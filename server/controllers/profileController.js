import User from "../models/User.js";
import { isProfileComplete, buildUserProfile } from "../utils/profile.js";
import { getSkillKey, normalizeSkill } from "../utils/skillNormalizer.js";

const currentYear = new Date().getFullYear();

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return null;
  }

  const normalizedSkills = skills.map(normalizeSkill);

  if (normalizedSkills.some((skill) => !skill)) {
    return null;
  }

  const uniqueSkills = new Map();
  normalizedSkills.forEach((skill) => uniqueSkills.set(getSkillKey(skill), skill));

  return [...uniqueSkills.values()];
};

const validateEducation = (education) => {
  if (!education || typeof education !== "object" || Array.isArray(education)) {
    return null;
  }

  const fields = ["college", "degree", "branch"];
  const sanitized = {};

  for (const field of fields) {
    if (typeof education[field] !== "string" || education[field].trim().length > 120) {
      return null;
    }
    sanitized[field] = education[field].trim();
  }

  const graduationYear = Number(education.graduationYear);
  if (!Number.isInteger(graduationYear) || graduationYear < 1950 || graduationYear > currentYear + 15) {
    return null;
  }

  return { ...sanitized, graduationYear };
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: buildUserProfile(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["fullName", "education", "skills", "targetRole"];
    const receivedFields = Object.keys(req.body);
    const unsupportedFields = receivedFields.filter((field) => !allowedFields.includes(field));

    if (!receivedFields.length || unsupportedFields.length) {
      return res.status(422).json({
        success: false,
        message: unsupportedFields.length ? "Request contains unsupported fields" : "Provide at least one profile field",
        errors: unsupportedFields,
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists", errors: [] });
    }

    if (Object.hasOwn(req.body, "fullName")) {
      if (typeof req.body.fullName !== "string" || req.body.fullName.trim().length < 2 || req.body.fullName.trim().length > 100) {
        return res.status(422).json({ success: false, message: "Full name must be between 2 and 100 characters", errors: [] });
      }
      user.fullName = req.body.fullName.trim();
    }

    if (Object.hasOwn(req.body, "education")) {
      const education = validateEducation(req.body.education);
      if (!education) {
        return res.status(422).json({ success: false, message: "Education must contain valid college, degree, branch, and graduationYear values", errors: [] });
      }
      user.education = education;
    }

    if (Object.hasOwn(req.body, "skills")) {
      const skills = normalizeSkills(req.body.skills);
      if (!skills) {
        return res.status(422).json({ success: false, message: "Skills must be an array of valid skill names up to 60 characters", errors: [] });
      }
      user.skills = skills;
    }

    if (Object.hasOwn(req.body, "targetRole")) {
      if (typeof req.body.targetRole !== "string" || !req.body.targetRole.trim() || req.body.targetRole.trim().length > 100) {
        return res.status(422).json({ success: false, message: "Target role must be between 1 and 100 characters", errors: [] });
      }
      user.targetRole = req.body.targetRole.trim();
    }

    user.profileCompleted = isProfileComplete(user);
    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully", data: buildUserProfile(user) });
  } catch (error) {
    return next(error);
  }
};
