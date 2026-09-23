import { getRequiredSkillsForRole } from "./skillRequirements.js";

const normalizeSkill = (skill) => {
  if (typeof skill !== "string") {
    return "";
  }

  return skill
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const SKILL_ALIASES = {
  "react.js": "react",
  react: "react",

  "node.js": "node.js",
  node: "node.js",

  "express": "express.js",
  "express.js": "express.js",

  "mongodb": "mongodb",
  "mongo": "mongodb",

  "javascript": "javascript",
  js: "javascript",

  "typescript": "typescript",
  ts: "typescript",

  "c++": "c++",

  "data structures and algorithms":
    "data structures and algorithms",

  dsa: "data structures and algorithms",

  "full-stack": "full stack",
  "full stack": "full stack",

  backend: "backend",
  "back-end": "backend",

  frontend: "frontend",
  "front-end": "frontend",

  "problem solving": "problem solving",

  sql: "sql",

  git: "git",

  github: "github",

  "rest api": "rest api",

  authentication: "authentication",

  "object-oriented programming":
    "object-oriented programming",

  oop: "object-oriented programming",

  html: "html",

  css: "css",

  "tailwind css": "tailwind css",

  python: "python",

  java: "java",

  php: "php",

  "machine learning": "machine learning",

  statistics: "statistics",

  "data analysis": "data analysis",

  "data visualization": "data visualization",

  excel: "excel",

  docker: "docker",

  "ci/cd": "ci/cd",

  "cloud computing": "cloud computing",

  networking: "networking",

  "shell scripting": "shell scripting",

  linux: "linux",

  "responsive design": "responsive design",
};

const getCanonicalSkill = (skill) => {
  const normalized = normalizeSkill(skill);

  if (!normalized) {
    return "";
  }

  return SKILL_ALIASES[normalized] || normalized;
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
      skillMap.set(canonicalSkill, skill);
    }
  });

  return [...skillMap.values()];
};

export const analyzeSkillGap = ({
  targetRole,
  resumeSkills = [],
}) => {
  const requiredSkills =
    getRequiredSkillsForRole(targetRole);

  const normalizedResumeSkills = new Set(
    resumeSkills.map(getCanonicalSkill).filter(Boolean)
  );

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((requiredSkill) => {
    const canonicalRequiredSkill =
      getCanonicalSkill(requiredSkill);

    if (normalizedResumeSkills.has(canonicalRequiredSkill)) {
      matchedSkills.push(requiredSkill);
    } else {
      missingSkills.push(requiredSkill);
    }
  });

  const totalRequiredSkills = requiredSkills.length;

  const matchPercentage =
    totalRequiredSkills > 0
      ? Math.round(
          (matchedSkills.length / totalRequiredSkills) * 100
        )
      : 0;

  return {
    targetRole: targetRole || "",
    requiredSkills: uniqueSkills(requiredSkills),
    matchedSkills: uniqueSkills(matchedSkills),
    missingSkills: uniqueSkills(missingSkills),
    matchPercentage,
    totalRequiredSkills,
    totalMatchedSkills: matchedSkills.length,
    totalMissingSkills: missingSkills.length,
  };
};

export default analyzeSkillGap;