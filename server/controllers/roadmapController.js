import Roadmap from "../models/Roadmap.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";

import analyzeSkillGap from "../services/skillGapAnalyzer.js";
import generateRoadmap from "../services/roadmapGenerator.js";

export const getRoadmap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "targetRole"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
        errors: [],
      });
    }

    if (!user.targetRole) {
      return res.status(400).json({
        success: false,
        message: "Please set your target role before generating a roadmap",
        errors: [],
      });
    }

    const resume = await Resume.findOne({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Please upload a resume before generating a roadmap",
        errors: [],
      });
    }

    const resumeSkills = resume.analysis?.skills || [];

    const skillGap = analyzeSkillGap({
      targetRole: user.targetRole,
      resumeSkills,
    });

    const generatedRoadmap = generateRoadmap({
      targetRole: user.targetRole,
      matchPercentage: skillGap.matchPercentage,
      matchedSkills: skillGap.matchedSkills,
      missingSkills: skillGap.missingSkills,
    });

    let roadmap = await Roadmap.findOne({
      user: req.user.userId,
    });

    if (!roadmap) {
      roadmap = await Roadmap.create({
        user: req.user.userId,
        targetRole: generatedRoadmap.targetRole,
        matchPercentage: generatedRoadmap.matchPercentage,
        matchedSkills: generatedRoadmap.matchedSkills,
        missingSkills: generatedRoadmap.missingSkills,
        roadmap: generatedRoadmap.roadmap,
        overallProgress: generatedRoadmap.overallProgress,
        status: generatedRoadmap.status,
      });
    } else {
      roadmap.targetRole = generatedRoadmap.targetRole;
      roadmap.matchPercentage = generatedRoadmap.matchPercentage;
      roadmap.matchedSkills = generatedRoadmap.matchedSkills;
      roadmap.missingSkills = generatedRoadmap.missingSkills;

      const existingProgress = new Map(
        roadmap.roadmap.map((item) => [
          item.skill.toLowerCase(),
          {
            status: item.status,
            progress: item.progress,
          },
        ])
      );

      roadmap.roadmap = generatedRoadmap.roadmap.map((item) => {
        const previous = existingProgress.get(
          item.skill.toLowerCase()
        );

        if (!previous) {
          return item;
        }

        return {
          ...item,
          status: previous.status,
          progress: previous.progress,
        };
      });

      const totalItems = roadmap.roadmap.length;

      if (totalItems === 0) {
        roadmap.overallProgress = 100;
        roadmap.status = "completed";
      } else {
        const totalProgress = roadmap.roadmap.reduce(
          (sum, item) => sum + item.progress,
          0
        );

        roadmap.overallProgress = Math.round(
          totalProgress / totalItems
        );

        if (roadmap.overallProgress === 100) {
          roadmap.status = "completed";
        } else if (roadmap.overallProgress > 0) {
          roadmap.status = "in_progress";
        } else {
          roadmap.status = "not_started";
        }
      }

      await roadmap.save();
    }

    return res.status(200).json({
      success: true,
      message: "Personalized roadmap generated successfully",
      data: {
        id: roadmap._id,
        targetRole: roadmap.targetRole,
        matchPercentage: roadmap.matchPercentage,
        matchedSkills: roadmap.matchedSkills,
        missingSkills: roadmap.missingSkills,
        overallProgress: roadmap.overallProgress,
        status: roadmap.status,
        roadmap: roadmap.roadmap,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateRoadmapItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { status, progress } = req.body;

    if (
      status !== undefined &&
      !["not_started", "in_progress", "completed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid roadmap item status",
        errors: [],
      });
    }

    if (
      progress !== undefined &&
      (!Number.isFinite(Number(progress)) ||
        Number(progress) < 0 ||
        Number(progress) > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be a number between 0 and 100",
        errors: [],
      });
    }

    const roadmap = await Roadmap.findOne({
      user: req.user.userId,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
        errors: [],
      });
    }

    const roadmapItem = roadmap.roadmap.id(itemId);

    if (!roadmapItem) {
      return res.status(404).json({
        success: false,
        message: "Roadmap item not found",
        errors: [],
      });
    }

    if (status !== undefined) {
      roadmapItem.status = status;
    }

    if (progress !== undefined) {
      roadmapItem.progress = Number(progress);
    }

    if (roadmapItem.progress === 100) {
      roadmapItem.status = "completed";
    } else if (roadmapItem.progress > 0) {
      roadmapItem.status = "in_progress";
    } else {
      roadmapItem.status = "not_started";
    }

    const totalItems = roadmap.roadmap.length;

    if (totalItems === 0) {
      roadmap.overallProgress = 100;
      roadmap.status = "completed";
    } else {
      const totalProgress = roadmap.roadmap.reduce(
        (sum, item) => sum + item.progress,
        0
      );

      roadmap.overallProgress = Math.round(
        totalProgress / totalItems
      );

      if (roadmap.overallProgress === 100) {
        roadmap.status = "completed";
      } else if (roadmap.overallProgress > 0) {
        roadmap.status = "in_progress";
      } else {
        roadmap.status = "not_started";
      }
    }

    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: "Roadmap progress updated successfully",
      data: {
        id: roadmap._id,
        targetRole: roadmap.targetRole,
        matchPercentage: roadmap.matchPercentage,
        matchedSkills: roadmap.matchedSkills,
        missingSkills: roadmap.missingSkills,
        overallProgress: roadmap.overallProgress,
        status: roadmap.status,
        roadmap: roadmap.roadmap,
        updatedAt: roadmap.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};