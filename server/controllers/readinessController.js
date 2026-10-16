import calculatePlacementReadiness from "../services/placementReadinessService.js";

export const getPlacementReadiness = async (req, res, next) => {
  try {
    const readiness = await calculatePlacementReadiness(req.user.userId);
    return res.status(200).json({ success: true, message: "Placement readiness retrieved successfully", data: readiness });
  } catch (error) {
    return next(error);
  }
};
