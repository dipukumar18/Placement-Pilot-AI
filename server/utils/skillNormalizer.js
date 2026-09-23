const SKILL_ALIASES = new Map([
  ["javascript", "JavaScript"],
  ["js", "JavaScript"],
  ["node", "Node.js"],
  ["nodejs", "Node.js"],
  ["node.js", "Node.js"],
  ["react", "React"],
  ["reactjs", "React"],
  ["react.js", "React"],
  ["mongodb", "MongoDB"],
  ["mongo", "MongoDB"],
  ["express", "Express"],
  ["expressjs", "Express"],
  ["express.js", "Express"],
  ["rest api", "REST API"],
  ["restful api", "REST API"],
  ["api", "REST API"],
  ["git", "Git"],
  ["sql", "SQL"],
  ["dsa", "DSA"],
  ["html", "HTML"],
  ["css", "CSS"],
  ["python", "Python"],
  ["java", "Java"],
  ["c++", "C++"],
]);

export const normalizeSkill = (skill) => {
  if (typeof skill !== "string") {
    return null;
  }

  const normalized = skill.trim().replace(/\s+/g, " ");

  if (!normalized || normalized.length > 60) {
    return null;
  }

  return SKILL_ALIASES.get(normalized.toLowerCase()) ?? normalized;
};

export const getSkillKey = (skill) => skill.toLocaleLowerCase("en-US");
