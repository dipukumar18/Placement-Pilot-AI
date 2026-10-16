
import { getRequiredSkillsForRole } from "./skillRequirements.js";
import { normalizeSkill, getSkillKey } from "../utils/skillNormalizer.js";

const getCanonicalSkill = (skill) => {
  const normalized = normalizeSkill(skill);

  if (!normalized) {
    return "";
  }

  return getSkillKey(normalized);
};

const uniqueSkills = (skills) => {
  const skillMap = new Map();

  if (!Array.isArray(skills)) {
    return [];
  }

  skills.forEach((skill) => {
    const canonicalSkill = getCanonicalSkill(skill);

    if (!canonicalSkill) {
      return;
    }

    if (!skillMap.has(canonicalSkill)) {
      skillMap.set(canonicalSkill, normalizedDisplayName(skill));
    }
  });

  return [...skillMap.values()];
};

const normalizedDisplayName = (skill) => {
  return normalizeSkill(skill) || skill;
};

export const analyzeSkillGap = ({
  targetRole,
  resumeSkills = [],
}) => {
  const requiredSkills = getRequiredSkillsForRole(targetRole);

  const normalizedResumeSkills = new Set(
    (Array.isArray(resumeSkills) ? resumeSkills : [])
      .map(getCanonicalSkill)
      .filter(Boolean)
  );

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((requiredSkill) => {
    const canonicalRequiredSkill = getCanonicalSkill(requiredSkill);

    if (!canonicalRequiredSkill) {
      return;
    }

    if (normalizedResumeSkills.has(canonicalRequiredSkill)) {
      matchedSkills.push(requiredSkill);
    } else {
      missingSkills.push(requiredSkill);
    }
  });

  const normalizedRequiredSkills = uniqueSkills(requiredSkills);
  const normalizedMatchedSkills = uniqueSkills(matchedSkills);
  const normalizedMissingSkills = uniqueSkills(missingSkills);

  const totalRequiredSkills = normalizedRequiredSkills.length;
  const totalMatchedSkills = normalizedMatchedSkills.length;
  const totalMissingSkills = normalizedMissingSkills.length;

  const matchPercentage =
    totalRequiredSkills > 0
      ? Math.round((totalMatchedSkills / totalRequiredSkills) * 100)
      : 0;

  return {
    targetRole: targetRole || "",
    requiredSkills: normalizedRequiredSkills,
    matchedSkills: normalizedMatchedSkills,
    missingSkills: normalizedMissingSkills,
    matchPercentage,
    totalRequiredSkills,
    totalMatchedSkills,
    totalMissingSkills,
  };
};

export default analyzeSkillGap;
