const cleanText = (text) => {
  if (typeof text !== "string") {
    return "";
  }

  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const extractSection = (text, sectionNames) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const normalizedSectionNames = sectionNames.map((name) =>
    name.toLowerCase()
  );

  const startIndex = lines.findIndex((line) =>
    normalizedSectionNames.includes(line.toLowerCase())
  );

  if (startIndex === -1) {
    return [];
  }

  const sectionLines = [];

  const sectionHeaders = [
    "education",
    "skills and expertise",
    "skills",
    "technical skills",
    "professional experience",
    "experience",
    "work experience",
    "academic projects",
    "projects",
    "extra curricular activities",
    "extracurricular activities",
  ];

  for (
    let index = startIndex + 1;
    index < lines.length;
    index += 1
  ) {
    const currentLine = lines[index].trim();

    const isNextSection = sectionHeaders.includes(
      currentLine.toLowerCase()
    );

    if (isNextSection) {
      break;
    }

    sectionLines.push(currentLine);
  }

  return sectionLines;
};

const extractSkills = (text) => {
  const skills = new Set();

  const skillPatterns = [
    "C++",
    "Python",
    "Java",
    "PHP",
    "JavaScript",
    "TypeScript",

    "React.js",
    "React",
    "Tailwind CSS",

    "Node.js",
    "Node",
    "Express.js",
    "Express",

    "MongoDB",
    "SQL",
    "MySQL",
    "PostgreSQL",

    "Git",
    "GitHub",

    "Next.js",

    "REST API",
    "REST APIs",
    "API",
    "Authentication",
    "Role-Based Access Control",
    "RBAC",

    "Data Structures and Algorithms",
    "DSA",
    "Problem Solving",

    "Web Development",
    "Full-Stack",
    "Full Stack",
    "Backend",
    "Frontend",
    "Front-End",
    "Back-End",

    "Object-Oriented Programming",
    "OOP",

    "HTML",
    "CSS",
    "Responsive Design",

    "WordPress",
    "SEO",

    "Data Analysis",
    "Statistics",
    "Machine Learning",
    "Data Visualization",

    "Docker",
    "Linux",
    "CI/CD",
    "Cloud Computing",
    "Networking",
    "Shell Scripting",
  ];

  const normalizedText = text.toLowerCase();

  skillPatterns.forEach((skill) => {
    if (normalizedText.includes(skill.toLowerCase())) {
      skills.add(skill);
    }
  });

  return [...skills];
};

const extractEducation = (text) => {
  return extractSection(text, [
    "Education",
  ]);
};

const extractExperience = (text) => {
  return extractSection(text, [
    "Professional Experience",
    "Experience",
    "Work Experience",
  ]);
};

const extractProjects = (text) => {
  return extractSection(text, [
    "Academic Projects",
    "Projects",
  ]);
};

const generateSummary = ({
  skills,
  education,
  experience,
  projects,
}) => {
  const parts = [];

  if (skills.length) {
    parts.push(
      `The resume contains ${skills.length} identified technical and professional skills.`
    );
  }

  if (education.length) {
    parts.push(
      "Education information was identified from the resume."
    );
  }

  if (experience.length) {
    parts.push(
      "Professional experience information was identified from the resume."
    );
  }

  if (projects.length) {
    parts.push(
      "Project information was identified from the resume."
    );
  }

  if (!parts.length) {
    return "No structured resume information could be identified.";
  }

  return parts.join(" ");
};

export const analyzeResumeText = (resumeText) => {
  const text = cleanText(resumeText);

  if (!text) {
    return {
      summary: "",
      skills: [],
      education: [],
      experience: [],
      projects: [],
      missingSkills: [],
    };
  }

  const skills = extractSkills(text);
  const education = extractEducation(text);
  const experience = extractExperience(text);
  const projects = extractProjects(text);

  const summary = generateSummary({
    skills,
    education,
    experience,
    projects,
  });

  return {
    summary,
    skills,
    education,
    experience,
    projects,
    missingSkills: [],
  };
};

export default analyzeResumeText;