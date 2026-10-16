import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Roadmap from "../models/Roadmap.js";

import analyzeSkillGap from "../services/skillGapAnalyzer.js";
import calculatePlacementReadiness from "../services/placementReadinessService.js";
import getDashboardAnalytics from "../services/dashboardAnalyticsService.js";
import { getGamificationSummary } from "../services/gamificationService.js";

export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
        errors: [],
      });
    }

    const [resume, roadmap, readiness, analytics, gamification] = await Promise.all([
      Resume.findOne({ user: user._id }).sort({ createdAt: -1 }),
      Roadmap.findOne({ user: user._id }),
      calculatePlacementReadiness(user._id),
      getDashboardAnalytics(user._id),
      getGamificationSummary(user._id),
    ]);

    const resumeSkills = resume?.analysis?.skills || [];

    const skillGap = user.targetRole
      ? analyzeSkillGap({
          targetRole: user.targetRole,
          resumeSkills,
        })
      : {
          matchPercentage: 0,
          matchedSkills: [],
          missingSkills: [],
          requiredSkills: [],
          totalRequiredSkills: 0,
          totalMatchedSkills: 0,
          totalMissingSkills: 0,
        };

    const roadmapItems = roadmap?.roadmap || [];

    const completedTasks = roadmapItems.filter(
      (item) => item.status === "completed"
    ).length;

    const inProgressTasks = roadmapItems.filter(
      (item) => item.status === "in_progress"
    ).length;

    const pendingTasks = roadmapItems.filter(
      (item) => item.status === "not_started"
    ).length;

    const recentActivity = [];

    if (resume) {
      recentActivity.push({
        type: "resume",
        title: "Resume uploaded",
        description: resume.originalFileName,
        date: resume.createdAt,
      });

      if (resume.analysisStatus === "completed") {
        recentActivity.push({
          type: "resume_analysis",
          title: "Resume analysis completed",
          description: `${resumeSkills.length} skills detected`,
          date: resume.updatedAt,
        });
      }
    }

    if (roadmap) {
      recentActivity.push({
        type: "roadmap",
        title: "Learning roadmap updated",
        description: `${completedTasks} of ${roadmapItems.length} tasks completed`,
        date: roadmap.updatedAt,
      });
    }

    recentActivity.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const profileFields = [
      user.fullName,
      user.email,
      user.education?.college,
      user.education?.degree,
      user.education?.branch,
      user.education?.graduationYear,
      user.targetRole,
    ];

    const filledProfileFields = profileFields.filter(
      (value) => value !== null && value !== undefined && String(value).trim() !== ""
    ).length;

    const profileCompletion = Math.round(
      (filledProfileFields / profileFields.length) * 100
    );

    return res.status(200).json({
      success: true,
      message: "Dashboard retrieved successfully",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          skills: user.skills || [],
          education: user.education,
          profileCompleted: user.profileCompleted,
        },

        readinessScore: readiness.score,
        readiness,
        analytics,
        gamification,

        profileCompletion,

        resume: {
          uploaded: Boolean(resume),
          fileName: resume?.originalFileName || null,
          analysisStatus: resume?.analysisStatus || "not_started",
          skills: resumeSkills,
          totalDetectedSkills: resumeSkills.length,
          matchPercentage: skillGap.matchPercentage,
          matchedSkills: skillGap.matchedSkills,
          missingSkills: skillGap.missingSkills,
          totalRequiredSkills: skillGap.totalRequiredSkills,
          uploadedAt: resume?.createdAt || null,
        },

        roadmap: {
          exists: Boolean(roadmap),
          targetRole: roadmap?.targetRole || user.targetRole || "",
          overallProgress: roadmap?.overallProgress || 0,
          status: roadmap?.status || "not_started",
          totalTasks: roadmapItems.length,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          matchedSkills: roadmap?.matchedSkills || skillGap.matchedSkills,
          missingSkills: roadmap?.missingSkills || skillGap.missingSkills,
          updatedAt: roadmap?.updatedAt || null,
        },

        recentActivity: recentActivity.slice(0, 5),
      },
    });
  } catch (error) {
    return next(error);
  }
};
