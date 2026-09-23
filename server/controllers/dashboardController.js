import User from "../models/User.js";

export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists", errors: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard retrieved successfully",
      data: {
        user: { id: user._id, fullName: user.fullName, email: user.email, targetRole: user.targetRole, skills: user.skills },
        readinessScore: user.readinessScore,
        profileCompletion: user.profileCompleted ? 100 : 0,
        recentActivity: [],
      },
    });
  } catch (error) {
    return next(error);
  }
};
