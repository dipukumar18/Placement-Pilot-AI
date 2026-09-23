const ROLE_SKILL_REQUIREMENTS = {
  "software developer": [
    "JavaScript",
    "Data Structures and Algorithms",
    "Problem Solving",
    "Git",
    "SQL",
    "REST API",
    "Object-Oriented Programming",
  ],

  "frontend developer": [
    "JavaScript",
    "React",
    "HTML",
    "CSS",
    "Git",
    "REST API",
    "Responsive Design",
  ],

  "backend developer": [
    "Node.js",
    "Express.js",
    "JavaScript",
    "MongoDB",
    "SQL",
    "REST API",
    "Authentication",
    "Git",
  ],

  "full stack developer": [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "SQL",
    "REST API",
    "Git",
    "Authentication",
  ],

  "data analyst": [
    "Python",
    "SQL",
    "Excel",
    "Data Analysis",
    "Statistics",
    "Data Visualization",
  ],

  "data scientist": [
    "Python",
    "SQL",
    "Statistics",
    "Machine Learning",
    "Data Analysis",
    "Data Visualization",
  ],

  "machine learning engineer": [
    "Python",
    "SQL",
    "Machine Learning",
    "Statistics",
    "Data Structures and Algorithms",
    "Data Analysis",
    "Git",
  ],

  "java developer": [
    "Java",
    "Object-Oriented Programming",
    "Data Structures and Algorithms",
    "SQL",
    "REST API",
    "Git",
  ],

  "python developer": [
    "Python",
    "Object-Oriented Programming",
    "SQL",
    "REST API",
    "Git",
    "Data Structures and Algorithms",
  ],

  "devops engineer": [
    "Linux",
    "Git",
    "Docker",
    "CI/CD",
    "Cloud Computing",
    "Networking",
    "Shell Scripting",
  ],
};

const normalizeRole = (role) => {
  if (typeof role !== "string") {
    return "";
  }

  return role
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const getRequiredSkillsForRole = (role) => {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return [];
  }

  if (ROLE_SKILL_REQUIREMENTS[normalizedRole]) {
    return ROLE_SKILL_REQUIREMENTS[normalizedRole];
  }

  const matchingRole = Object.keys(ROLE_SKILL_REQUIREMENTS).find(
    (availableRole) =>
      normalizedRole.includes(availableRole) ||
      availableRole.includes(normalizedRole)
  );

  if (!matchingRole) {
    return [];
  }

  return ROLE_SKILL_REQUIREMENTS[matchingRole];
};

export {
  ROLE_SKILL_REQUIREMENTS,
  normalizeRole,
  getRequiredSkillsForRole,
};

export default getRequiredSkillsForRole;