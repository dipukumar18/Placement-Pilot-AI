
import Roadmap from "../models/Roadmap.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";

import analyzeSkillGap from "../services/skillGapAnalyzer.js";
import generateRoadmap from "../services/roadmapGenerator.js";
import { normalizeRole } from "../services/skillRequirements.js";

const calculateRoadmapProgress = (roadmapItems) => {
  const totalItems = roadmapItems.length;

  if (totalItems === 0) {
    return {
      overallProgress: 0,
      status: "not_started",
    };
  }

  const totalProgress = roadmapItems.reduce(
    (sum, item) => sum + (Number(item.progress) || 0),
    0
  );

  const overallProgress = Math.round(totalProgress / totalItems);

  let status = "not_started";

  if (overallProgress === 100) {
    status = "completed";
  } else if (overallProgress > 0) {
    status = "in_progress";
  }

  return { overallProgress, status };
};

const buildRoadmapResponse = (roadmap) => ({
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
});

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
      const oldRole = normalizeRole(roadmap.targetRole);
      const newRole = normalizeRole(user.targetRole);

      const roleChanged = oldRole !== newRole;

      roadmap.targetRole = generatedRoadmap.targetRole;
      roadmap.matchPercentage = skillGap.matchPercentage;
      roadmap.matchedSkills = skillGap.matchedSkills;
      roadmap.missingSkills = skillGap.missingSkills;

      if (roleChanged) {
        // A different role gets a fresh learning roadmap.
        roadmap.roadmap = generatedRoadmap.roadmap.map((item) => ({
          ...item.toObject?.() ?? item,
          status: "not_started",
          progress: 0,
        }));
      } else {
        // Preserve learning progress only for the same target role.
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
            ...item.toObject?.() ?? item,
            status: previous.status,
            progress: previous.progress,
          };
        });
      }

      const progress = calculateRoadmapProgress(roadmap.roadmap);

      roadmap.overallProgress = progress.overallProgress;
      roadmap.status = progress.status;

      await roadmap.save();
    }

    return res.status(200).json({
      success: true,
      message: "Personalized roadmap generated successfully",
      data: buildRoadmapResponse(roadmap),
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
      (
        progress === "" ||
        !Number.isFinite(Number(progress)) ||
        Number(progress) < 0 ||
        Number(progress) > 100
      )
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

    if (progress !== undefined) {
      roadmapItem.progress = Number(progress);

      if (roadmapItem.progress === 100) {
        roadmapItem.status = "completed";
      } else if (roadmapItem.progress > 0) {
        roadmapItem.status = "in_progress";
      } else {
        roadmapItem.status = "not_started";
      }
    } else if (status !== undefined) {
      roadmapItem.status = status;

      if (status === "completed") {
        roadmapItem.progress = 100;
      } else if (status === "not_started") {
        roadmapItem.progress = 0;
      } else if (roadmapItem.progress === 0 || roadmapItem.progress === 100) {
        roadmapItem.progress = 1;
      }
    }

    const calculated = calculateRoadmapProgress(roadmap.roadmap);

    roadmap.overallProgress = calculated.overallProgress;
    roadmap.status = calculated.status;

    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: "Roadmap progress updated successfully",
      data: buildRoadmapResponse(roadmap),
    });
  } catch (error) {
    return next(error);
  }
};
