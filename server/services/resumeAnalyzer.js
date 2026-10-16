
const cleanText = (text) => {
  if (typeof text !== "string") return "";

  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const normalizeText = (text) =>
  text.toLowerCase().replace(/\s+/g, " ").trim();

const escapeRegExp = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsSkill = (text, skill) => {
  const normalizedText = normalizeText(text);
  const normalizedSkill = normalizeText(skill);

  // Short aliases are checked with word boundaries to reduce false matches.
  const escapedSkill = escapeRegExp(normalizedSkill);
  const pattern = new RegExp(
    `(^|[^a-z0-9+#.])${escapedSkill}(?=$|[^a-z0-9+#.])`,
    "i"
  );

  return pattern.test(normalizedText);
};

const extractSection = (text, sectionNames) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const normalizedSectionNames = sectionNames.map(normalizeText);

  const startIndex = lines.findIndex((line) =>
    normalizedSectionNames.includes(normalizeText(line))
  );

  if (startIndex === -1) return [];

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
    "certifications",
    "certificates",
    "achievements",
    "summary",
    "professional summary",
    "objective",
    "career objective",
    "internships",
    "internship",
    "publications",
    "languages",
    "interests",
  ];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const currentLine = normalizeText(lines[index]);

    if (sectionHeaders.includes(currentLine)) break;

    sectionLines.push(lines[index]);
  }

  return sectionLines;
};

const SKILL_PATTERNS = [
  // Programming languages
  "C++",
  "C#",
  "C",
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Ruby",
  "Go",
  "Golang",
  "Kotlin",
  "Swift",
  "Dart",
  "R Programming",
  "Scala",
  "Rust",
  "SQL",

  // Frontend and web development
  "HTML",
  "HTML5",
  "CSS",
  "CSS3",
  "React.js",
  "ReactJS",
  "React",
  "Next.js",
  "NextJS",
  "Angular",
  "Vue.js",
  "Vue",
  "Svelte",
  "Tailwind CSS",
  "Bootstrap",
  "Responsive Design",
  "Web Accessibility",
  "JSX",
  "React Hooks",
  "State Management",
  "Redux",
  "SEO",
  "Web Development",

  // Backend
  "Node.js",
  "NodeJS",
  "Express.js",
  "ExpressJS",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Spring Framework",
  "ASP.NET Core",
  ".NET",
  "REST API",
  "REST APIs",
  "GraphQL",
  "API Development",
  "Authentication",
  "Authorization",
  "Role-Based Access Control",
  "RBAC",
  "JWT",
  "Microservices",
  "WebSockets",
  "Asynchronous Programming",
  "JSON",

  // Databases
  "MongoDB",
  "Mongoose",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "Oracle Database",
  "SQL Server",
  "Redis",
  "Firebase",
  "Firestore",
  "DBMS",
  "Database Management",
  "Database Design",
  "Data Modeling",
  "Data Warehousing",
  "Query Optimization",
  "Indexing",
  "ETL Pipelines",

  // Software engineering fundamentals
  "Data Structures and Algorithms",
  "DSA",
  "Problem Solving",
  "Object-Oriented Programming",
  "OOP",
  "Operating Systems",
  "Computer Networks",
  "Computer Architecture",
  "Algorithms",
  "Complexity Analysis",
  "Dynamic Programming",
  "Graph Algorithms",
  "Recursion",
  "STL",
  "Memory Management",
  "Pointers",
  "Multithreading",
  "Exception Handling",
  "Collections Framework",
  "Software Development",
  "Software Design",
  "Design Patterns",
  "System Design",
  "Agile Methodology",
  "Scrum",

  // Tools and version control
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Postman",
  "VS Code",
  "Visual Studio",
  "Jira",
  "Figma",
  "Selenium",
  "Playwright",
  "Cypress",

  // Testing and quality assurance
  "Software Testing",
  "Manual Testing",
  "Automation Testing",
  "Test Case Design",
  "Bug Reporting",
  "Bug Tracking",
  "Regression Testing",
  "API Testing",
  "Unit Testing",
  "Integration Testing",
  "Jest",
  "Mocha",
  "PyTest",
  "Testing",

  // Data analysis and business intelligence
  "Data Analysis",
  "Data Analytics",
  "Data Cleaning",
  "Data Visualization",
  "Statistics",
  "Probability",
  "Excel",
  "Microsoft Excel",
  "Advanced Excel",
  "Power BI",
  "Tableau",
  "Looker",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Jupyter Notebook",
  "Business Intelligence",
  "Requirements Gathering",
  "Business Documentation",
  "Business Analysis",
  "Process Mapping",
  "Stakeholder Management",
  "Product Strategy",
  "Market Research",
  "Roadmapping",
  "Prioritization",
  "User Research",
  "Wireframing",
  "Prototyping",
  "UI Design",
  "UX Design",
  "Usability Testing",
  "Information Architecture",
  "Visual Design",
  "Communication",

  // AI, machine learning and generative AI
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Neural Networks",
  "Natural Language Processing",
  "NLP",
  "Computer Vision",
  "Feature Engineering",
  "Model Evaluation",
  "Scikit-learn",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "OpenCV",
  "LLM Integration",
  "Large Language Models",
  "Prompt Engineering",
  "Retrieval-Augmented Generation",
  "RAG",
  "Vector Databases",
  "Embeddings",
  "LangChain",
  "LlamaIndex",
  "Generative AI",
  "MLOps",

  // Cloud, DevOps and networking
  "Docker",
  "Kubernetes",
  "Linux",
  "Windows",
  "CI/CD",
  "Cloud Computing",
  "AWS",
  "Microsoft Azure",
  "Azure",
  "Google Cloud",
  "GCP",
  "Shell Scripting",
  "Bash",
  "Networking",
  "TCP/IP",
  "DNS",
  "DHCP",
  "Network Security",
  "Firewalls",
  "Infrastructure as Code",
  "Terraform",
  "Ansible",
  "Jenkins",
  "Monitoring",
  "Prometheus",
  "Grafana",

  // Mobile development
  "Mobile App Development",
  "Android SDK",
  "Android Studio",
  "SwiftUI",
  "UIKit",
  "Xcode",
  "Flutter",
  "Room Database",
  "Core Data",

  // Other specializations
  "WordPress",
  "Blockchain",
  "Blockchain Fundamentals",
  "Solidity",
  "Smart Contracts",
  "Web3",
  "Ethereum",
  "Cryptography",
  "Embedded Systems",
  "Embedded C",
  "Microcontrollers",
  "RTOS",
  "Electronics Fundamentals",
  "Communication Protocols",
  "Troubleshooting",
  "Customer Support",
  "Ticketing Systems",
  "Backup and Recovery",
  "Performance Tuning",
  "Security",
  "Accessibility",
];

const extractSkills = (text) => {
  const skills = new Set();

  SKILL_PATTERNS.forEach((skill) => {
    if (containsSkill(text, skill)) {
      skills.add(skill);
    }
  });

  return [...skills];
};

const extractEducation = (text) =>
  extractSection(text, ["Education"]);

const extractExperience = (text) =>
  extractSection(text, [
    "Professional Experience",
    "Experience",
    "Work Experience",
  ]);

const extractProjects = (text) =>
  extractSection(text, [
    "Academic Projects",
    "Projects",
  ]);

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
