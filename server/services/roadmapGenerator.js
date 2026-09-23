const ROADMAP_TEMPLATES = {
  "Express.js": {
    priority: "high",

    learningTopics: [
      "Express.js fundamentals",
      "Creating an Express server",
      "Routing and route parameters",
      "Middleware",
      "Request and response handling",
      "Error handling",
      "REST API development",
    ],

    practiceTasks: [
      "Create a basic Express.js server",
      "Build GET, POST, PUT, and DELETE routes",
      "Create custom middleware",
      "Implement centralized error handling",
      "Build a small CRUD REST API",
    ],

    projectTask:
      "Build a REST API using Node.js, Express.js, and MongoDB with authentication and CRUD operations.",

    interviewTopics: [
      "What is Express.js?",
      "What is middleware in Express.js?",
      "Difference between app.use() and app.get()",
      "How does routing work in Express.js?",
      "How do you handle errors in Express.js?",
      "How do you build REST APIs using Express.js?",
    ],
  },

  "REST API": {
    priority: "high",

    learningTopics: [
      "REST architecture",
      "HTTP methods",
      "HTTP status codes",
      "Request and response structure",
      "RESTful resource design",
      "API validation",
      "API error handling",
    ],

    practiceTasks: [
      "Create CRUD endpoints",
      "Use appropriate HTTP methods",
      "Implement proper HTTP status codes",
      "Add request validation",
      "Handle API errors consistently",
    ],

    projectTask:
      "Build a complete REST API for a job application tracker with CRUD operations and validation.",

    interviewTopics: [
      "What is REST?",
      "Difference between GET, POST, PUT, PATCH, and DELETE",
      "What are HTTP status codes?",
      "What makes an API RESTful?",
      "How should API errors be handled?",
    ],
  },

  Authentication: {
    priority: "high",

    learningTopics: [
      "Authentication fundamentals",
      "Password hashing",
      "JWT authentication",
      "Access tokens",
      "Protected routes",
      "Authentication middleware",
      "Authorization basics",
    ],

    practiceTasks: [
      "Create user registration",
      "Create user login",
      "Hash passwords securely",
      "Generate JWT tokens",
      "Protect private API routes",
      "Implement logout/session handling",
    ],

    projectTask:
      "Build an authentication system with registration, login, password hashing, JWT-based protected routes, and user authorization.",

    interviewTopics: [
      "What is authentication?",
      "Authentication vs authorization",
      "What is JWT?",
      "Why should passwords be hashed?",
      "How do protected routes work?",
      "Where should authentication middleware be used?",
    ],
  },

  SQL: {
    priority: "medium",

    learningTopics: [
      "SQL fundamentals",
      "Tables and relationships",
      "SELECT queries",
      "INSERT, UPDATE, and DELETE",
      "JOIN operations",
      "Indexes",
      "Aggregation and grouping",
    ],

    practiceTasks: [
      "Create relational tables",
      "Write SELECT queries",
      "Practice different JOIN operations",
      "Use GROUP BY and aggregate functions",
      "Create indexes for frequently queried fields",
    ],

    projectTask:
      "Build a small relational database for a job tracking system and implement common queries.",

    interviewTopics: [
      "What is SQL?",
      "Difference between primary key and foreign key",
      "What are JOINs?",
      "What is an index?",
      "Difference between WHERE and HAVING",
    ],
  },

  MongoDB: {
    priority: "medium",

    learningTopics: [
      "MongoDB fundamentals",
      "Documents and collections",
      "CRUD operations",
      "MongoDB queries",
      "Indexes",
      "Schema design",
      "Mongoose basics",
    ],

    practiceTasks: [
      "Create MongoDB collections",
      "Perform CRUD operations",
      "Create Mongoose schemas",
      "Implement database queries",
      "Add indexes to frequently queried fields",
    ],

    projectTask:
      "Build a MongoDB-backed application using Mongoose with users, profiles, and application records.",

    interviewTopics: [
      "What is MongoDB?",
      "MongoDB vs relational databases",
      "What are collections and documents?",
      "What is Mongoose?",
      "What is indexing in MongoDB?",
    ],
  },

  JavaScript: {
    priority: "high",

    learningTopics: [
      "JavaScript fundamentals",
      "Variables and data types",
      "Functions",
      "Arrays and objects",
      "ES6+ features",
      "Promises and async/await",
      "Error handling",
    ],

    practiceTasks: [
      "Solve JavaScript programming problems",
      "Practice array methods",
      "Practice object manipulation",
      "Build asynchronous functions",
      "Handle errors using try/catch",
    ],

    projectTask:
      "Build a JavaScript-based application that consumes an API and manages asynchronous data operations.",

    interviewTopics: [
      "var, let, and const",
      "What is a closure?",
      "Promises vs async/await",
      "What is the event loop?",
      "Difference between == and ===",
    ],
  },

  Git: {
    priority: "medium",

    learningTopics: [
      "Git fundamentals",
      "Repositories",
      "Branches",
      "Commits",
      "Merging",
      "Remote repositories",
      "Pull requests",
    ],

    practiceTasks: [
      "Create a Git repository",
      "Create and switch branches",
      "Make meaningful commits",
      "Merge branches",
      "Push code to a remote repository",
    ],

    projectTask:
      "Manage a complete development project using Git branches, meaningful commits, and a remote repository.",

    interviewTopics: [
      "What is Git?",
      "Git vs GitHub",
      "What is a branch?",
      "What is a merge?",
      "What is a pull request?",
    ],
  },

  Python: {
    priority: "medium",

    learningTopics: [
      "Python fundamentals",
      "Functions",
      "Lists and dictionaries",
      "Object-oriented programming",
      "Exception handling",
      "Modules and packages",
    ],

    practiceTasks: [
      "Solve Python programming problems",
      "Practice lists and dictionaries",
      "Build reusable functions",
      "Implement classes",
      "Handle exceptions",
    ],

    projectTask:
      "Build a Python application that demonstrates functions, classes, file handling, and exception handling.",

    interviewTopics: [
      "Python data types",
      "List vs tuple",
      "What is a dictionary?",
      "What is object-oriented programming?",
      "How does exception handling work?",
    ],
  },

  "Data Structures and Algorithms": {
    priority: "high",

    learningTopics: [
      "Arrays",
      "Strings",
      "Linked lists",
      "Stacks and queues",
      "Trees",
      "Graphs",
      "Searching and sorting",
      "Time and space complexity",
    ],

    practiceTasks: [
      "Solve array problems",
      "Practice string problems",
      "Implement stacks and queues",
      "Practice binary search",
      "Solve sorting problems",
      "Practice tree and graph problems",
    ],

    projectTask:
      "Build a small algorithm visualization or problem-solving application demonstrating common data structures and algorithms.",

    interviewTopics: [
      "Time complexity",
      "Space complexity",
      "Array vs linked list",
      "Stack vs queue",
      "Binary search",
      "Common sorting algorithms",
    ],
  },

  "Object-Oriented Programming": {
    priority: "medium",

    learningTopics: [
      "Classes and objects",
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction",
    ],

    practiceTasks: [
      "Create classes and objects",
      "Implement inheritance",
      "Practice encapsulation",
      "Implement polymorphism",
      "Design a small OOP-based application",
    ],

    projectTask:
      "Build a small application using classes, inheritance, encapsulation, and polymorphism.",

    interviewTopics: [
      "What is OOP?",
      "What is encapsulation?",
      "What is inheritance?",
      "What is polymorphism?",
      "What is abstraction?",
    ],
  },
};

const normalizeSkill = (skill) => {
  if (typeof skill !== "string") {
    return "";
  }

  return skill
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const findTemplate = (skill) => {
  const normalizedSkill = normalizeSkill(skill);

  if (!normalizedSkill) {
    return null;
  }

  const templateEntry = Object.entries(ROADMAP_TEMPLATES).find(
    ([templateSkill]) =>
      normalizeSkill(templateSkill) === normalizedSkill
  );

  if (!templateEntry) {
    return null;
  }

  return {
    skill: templateEntry[0],
    ...templateEntry[1],
  };
};

const createGenericRoadmapItem = (skill) => {
  return {
    skill,
    priority: "medium",
    reason: `This skill is required for the selected target role but was not identified in the resume.`,

    learningTopics: [
      `${skill} fundamentals`,
      `${skill} core concepts`,
      `${skill} practical implementation`,
      `${skill} best practices`,
    ],

    practiceTasks: [
      `Learn the fundamentals of ${skill}`,
      `Solve practical exercises using ${skill}`,
      `Build a small feature using ${skill}`,
      `Apply ${skill} in a practical project`,
    ],

    projectTask:
      `Build a small project that demonstrates practical usage of ${skill}.`,

    interviewTopics: [
      `What is ${skill}?`,
      `${skill} core concepts`,
      `${skill} common use cases`,
      `${skill} common interview questions`,
    ],

    status: "not_started",
    progress: 0,
  };
};

const generateRoadmapItems = (missingSkills = []) => {
  if (!Array.isArray(missingSkills)) {
    return [];
  }

  const uniqueSkills = [
    ...new Map(
      missingSkills
        .filter((skill) => typeof skill === "string")
        .map((skill) => [normalizeSkill(skill), skill.trim()])
    ).values(),
  ];

  return uniqueSkills.map((skill) => {
    const template = findTemplate(skill);

    if (!template) {
      return createGenericRoadmapItem(skill);
    }

    return {
      skill: template.skill,
      priority: template.priority,

      reason: `This skill is required for the selected target role but was not identified in the resume.`,

      learningTopics: template.learningTopics,
      practiceTasks: template.practiceTasks,
      projectTask: template.projectTask,
      interviewTopics: template.interviewTopics,

      status: "not_started",
      progress: 0,
    };
  });
};

export const generateRoadmap = ({
  targetRole = "",
  matchPercentage = 0,
  matchedSkills = [],
  missingSkills = [],
}) => {
  const roadmapItems = generateRoadmapItems(missingSkills);

  return {
    targetRole,
    matchPercentage,
    matchedSkills,
    missingSkills,
    roadmap: roadmapItems,
    overallProgress: 0,
    status: roadmapItems.length ? "not_started" : "completed",
  };
};

export default generateRoadmap;