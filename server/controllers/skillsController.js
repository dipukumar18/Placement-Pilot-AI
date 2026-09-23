import User from "../models/User.js";
import { isProfileComplete } from "../utils/profile.js";
import { getSkillKey, normalizeSkill } from "../utils/skillNormalizer.js";

const findCurrentUser = (userId) => User.findById(userId);

export const getSkills = async (req, res, next) => {
  try {
    const user = await findCurrentUser(req.user.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists", errors: [] });
    }

    return res.status(200).json({ success: true, message: "Skills retrieved successfully", data: { skills: user.skills } });
  } catch (error) {
    return next(error);
  }
};

export const addSkill = async (req, res, next) => {
  try {
    const skill = normalizeSkill(req.body.skill);
    if (!skill) {
      return res.status(422).json({ success: false, message: "Skill must be a non-empty string up to 60 characters", errors: [] });
    }

    const user = await findCurrentUser(req.user.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists", errors: [] });
    }

    if (user.skills.some((item) => getSkillKey(item) === getSkillKey(skill))) {
      return res.status(409).json({ success: false, message: "This skill is already in your profile", errors: [] });
    }

    user.skills.push(skill);
    user.profileCompleted = isProfileComplete(user);
    await user.save();

    return res.status(201).json({ success: true, message: "Skill added successfully", data: { skills: user.skills } });
  } catch (error) {
    return next(error);
  }
};

export const removeSkill = async (req, res, next) => {
  try {
    const skill = normalizeSkill(req.params.skill);
    if (!skill) {
      return res.status(422).json({ success: false, message: "Skill must be a non-empty string up to 60 characters", errors: [] });
    }

    const user = await findCurrentUser(req.user.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists", errors: [] });
    }

    const originalLength = user.skills.length;
    user.skills = user.skills.filter((item) => getSkillKey(item) !== getSkillKey(skill));
    if (user.skills.length === originalLength) {
      return res.status(404).json({ success: false, message: "Skill was not found in your profile", errors: [] });
    }

    user.profileCompleted = isProfileComplete(user);
    await user.save();

    return res.status(200).json({ success: true, message: "Skill removed successfully", data: { skills: user.skills } });
  } catch (error) {
    return next(error);
  }
};
