const User = require('../models/User');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const Analysis = require('../models/Analysis');

const sampleResumeContent = `
Alex Morgan
alex.morgan@example.com | (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alexmorgan-dev | GitHub: github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Full-Stack Software Engineer with 4+ years of experience designing and scaling web applications using React, Node.js, Express, and MongoDB. Proven track record of improving application performance by 35% and building resilient microservices in cloud environments.

CORE SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, Python, SQL
- Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, Webpack
- Backend: Node.js, Express.js, RESTful APIs, GraphQL, Microservices
- Databases: MongoDB, PostgreSQL, Redis, Mongoose
- DevOps & Tools: Docker, Git, GitHub Actions, AWS (S3, EC2), Jest, CI/CD

PROFESSIONAL EXPERIENCE
Senior Full-Stack Engineer | TechFlow Systems | 2022 - Present
- Architected and deployed microservices handling 2M+ daily requests using Node.js and MongoDB.
- Optimized database query indexes and caching layers with Redis, decreasing average response time by 42%.
- Mentored a squad of 4 junior developers and established code review guidelines reducing bug turnaround time by 30%.
- Integrated Stripe payment gateway and automated webhook reconciliation.

Full-Stack Developer | CloudNative Labs | 2020 - 2022
- Developed responsive customer-facing dashboard in React and Tailwind CSS, increasing user engagement by 25%.
- Built REST APIs in Express with JWT authentication, role-based access control, and rate limiting.
- Automated CI/CD deployment pipelines using GitHub Actions to AWS EC2.

EDUCATION
Bachelor of Technology in Computer Science & Engineering
Apex Institute of Technology | 2016 - 2020 | GPA: 3.8/4.0

KEY PROJECTS
- ResumeAI Platform: Developed an end-to-end ATS scanner using React, Node.js, and OpenAI API with PDF parsing.
- E-Commerce Microservices: Built inventory and checkout service using Express, Kafka, and MongoDB.
`;

const sampleJobContent = `
Senior Full-Stack Software Engineer (MERN / Cloud)
CloudScale Technologies — Remote / San Francisco, CA

About the Role:
We are seeking an experienced Senior Full-Stack Software Engineer with strong command over modern JavaScript/TypeScript, React, Node.js, and cloud ecosystems. You will be building mission-critical SaaS applications and high-throughput APIs.

Requirements:
- 3+ years of professional full-stack development experience with React and Node.js
- Proficiency in JavaScript, TypeScript, Express, and MongoDB
- Experience building and consuming RESTful APIs and GraphQL
- Hands-on experience with Docker, Kubernetes, and AWS cloud infrastructure
- Familiarity with CI/CD pipelines, automated testing (Jest/Cypress), and Agile development
- Strong problem-solving skills and passion for building scalable software
`;

const seedSampleDataForUser = async (userId) => {
  // 1. Create Sample Resume
  const resume = await Resume.create({
    user: userId,
    originalName: 'Alex_Morgan_FullStack_Resume.pdf',
    cloudinaryPublicId: 'demo_alex_morgan_resume',
    cloudinaryUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
    fileType: 'pdf',
    fileSize: 142850,
    extractedText: sampleResumeContent,
    parsedData: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '(555) 234-5678',
      summary: 'Results-driven Full-Stack Software Engineer with 4+ years of experience designing and scaling web applications using React, Node.js, Express, and MongoDB.',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'REST API', 'Tailwind CSS', 'Redux', 'Jest'],
      education: [
        {
          degree: 'Bachelor of Technology in Computer Science & Engineering',
          institution: 'Apex Institute of Technology',
          year: '2016 - 2020',
          details: 'GPA: 3.8/4.0',
        },
      ],
      experience: [
        {
          role: 'Senior Full-Stack Engineer',
          company: 'TechFlow Systems',
          duration: '2022 - Present',
          description: 'Architected and deployed microservices handling 2M+ daily requests using Node.js and MongoDB.',
        },
        {
          role: 'Full-Stack Developer',
          company: 'CloudNative Labs',
          duration: '2020 - 2022',
          description: 'Developed responsive customer-facing dashboard in React and Tailwind CSS.',
        },
      ],
      projects: [
        {
          title: 'ResumeAI Platform',
          technologies: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
          description: 'Developed an end-to-end ATS scanner using React, Node.js, and OpenAI API.',
          link: 'https://github.com/alexmorgan/resumeai',
        },
      ],
      certifications: ['AWS Certified Solutions Architect Associate'],
    },
    analysisCount: 1,
  });

  // 2. Create Sample Job
  const job = await JobDescription.create({
    user: userId,
    title: 'Senior Full-Stack Software Engineer (MERN / Cloud)',
    company: 'CloudScale Technologies',
    description: sampleJobContent,
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'REST API'],
    experienceLevel: 'Senior Level',
    analysisCount: 1,
  });

  // 3. Create Sample Analysis
  const analysis = await Analysis.create({
    user: userId,
    resume: resume._id,
    jobDescription: job._id,
    overallScore: 88,
    atsScore: 86,
    jobMatchScore: 90,
    atsBreakdown: {
      keywordRelevance: 88,
      skillsMatch: 92,
      experienceRelevance: 85,
      educationRelevance: 90,
      formatting: 95,
      sectionCompleteness: 94,
    },
    matchBreakdown: {
      overallMatch: 90,
      skillsMatch: 92,
      experienceMatch: 86,
      keywordMatch: 88,
      educationMatch: 90,
    },
    summary: 'Candidate shows exceptional alignment with the Senior Full-Stack role. Demonstrated experience with Node.js microservices, React frontends, and cloud deployments positions this candidate in the top 10% of applicants.',
    strengths: [
      'Strong hands-on mastery of required MERN stack technologies (React, Node.js, MongoDB, Express)',
      'Proven quantification of business impact (e.g. 42% query latency reduction, 2M+ daily requests)',
      'Solid foundational computer science degree with high academic standing',
      'Direct experience with containerization (Docker) and AWS cloud services'
    ],
    weaknesses: [
      'Kubernetes is not explicitly listed in hands-on production experience',
      'No explicit mention of GraphQL in production projects, only in skills overview',
      'Could elaborate more on automated testing strategies with Cypress/Playwright'
    ],
    matchedSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS', 'REST API', 'JavaScript', 'Git', 'Tailwind CSS'],
    missingSkills: ['Kubernetes', 'GraphQL', 'Cypress'],
    recommendedSkills: ['Kubernetes', 'System Design Patterns', 'GraphQL Federation', 'Terraform'],
    keywordAnalysis: [
      { keyword: 'React', foundInResume: true, importance: 'High', context: 'Prominently featured in projects and frontend experience' },
      { keyword: 'Node.js', foundInResume: true, importance: 'High', context: 'Demonstrated deep microservices backend work' },
      { keyword: 'MongoDB', foundInResume: true, importance: 'High', context: 'Clear database indexing and scaling examples' },
      { keyword: 'Kubernetes', foundInResume: false, importance: 'High', context: 'Critical container orchestration requirement in JD' },
      { keyword: 'TypeScript', foundInResume: true, importance: 'High', context: 'Listed in core skills and utilized across projects' },
      { keyword: 'AWS', foundInResume: true, importance: 'Medium', context: 'S3, EC2 mentioned in deployment pipelines' },
      { keyword: 'Docker', foundInResume: true, importance: 'Medium', context: 'Containerization verified in DevOps stack' },
      { keyword: 'GraphQL', foundInResume: false, importance: 'Low', context: 'Bonus API technology cited in job posting' }
    ],
    experienceAnalysis: 'Candidate exhibits strong senior-level engineering rigor. High-impact bullet points with quantified percentages make the experience section stand out to automated ATS scoring filters.',
    educationAnalysis: 'B.Tech in Computer Science & Engineering directly aligns with prerequisite requirements for Senior Engineering roles.',
    projectAnalysis: 'Featured full-stack platforms showcase end-to-end execution, database design, and real-world system architecture.',
    formattingSuggestions: [
      'Maintain the clean single-column layout currently utilized',
      'Ensure standard date formats (Month Year - Month Year) for consistent ATS chronological parsing',
      'Keep resume length within 1-2 pages maximum'
    ],
    improvementSuggestions: [
      {
        section: 'Skills',
        original: 'DevOps & Tools: Docker, Git, GitHub Actions, AWS (S3, EC2), Jest, CI/CD',
        improved: 'DevOps & Cloud: Docker, Kubernetes (EKS), AWS (S3, EC2, Lambda), CI/CD (GitHub Actions), Jest, Cypress',
        reason: 'Adds missing high-demand keywords (Kubernetes, Cypress) that recruiters search for.'
      },
      {
        section: 'Experience',
        original: 'Integrated Stripe payment gateway and automated webhook reconciliation.',
        improved: 'Spearheaded Stripe payment processing integration and idempotent webhook pipelines, safeguarding $450K+ in monthly customer transactions with zero data loss.',
        reason: 'Quantifies fiscal scale and reinforces technical reliability.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Can you walk us through how you optimized MongoDB query latency by 42% in your previous role?',
        category: 'Technical',
        suggestedAnswer: 'Explain how you analyzed slow queries using explain("executionStats"), designed compound indexes, eliminated unneeded fields using projection, and implemented Redis caching for hot read paths.',
        reason: 'Validates claims made in the resume with concrete architectural specifics.'
      },
      {
        question: 'How do you ensure state consistency and idempotency when handling asynchronous webhooks?',
        category: 'Technical',
        suggestedAnswer: 'Discuss unique idempotency keys in Redis/DB, database transactions, signature verification, and retry queues with exponential backoff.',
        reason: 'Evaluates resilience design for external integrations.'
      },
      {
        question: 'Tell us about a time you had to mentor a struggling team member through a critical deadline.',
        category: 'HR',
        suggestedAnswer: 'Highlight active listening, pair programming, breaking down complex tasks into manageable subtasks, and celebrating incremental wins without blame.',
        reason: 'Tests leadership and emotional intelligence for senior roles.'
      },
      {
        question: 'How would you transition a monolithic Node.js application to Docker containers on AWS?',
        category: 'Role-specific',
        suggestedAnswer: 'Discuss multi-stage Docker builds for minimal image size, environment variable management via AWS Secrets Manager, container registry (ECR), and ECS/EKS deployment.',
        reason: 'Assesses cloud-native migration capabilities requested by the employer.'
      }
    ]
  });

  return { resume, job, analysis };
};

module.exports = {
  sampleResumeContent,
  sampleJobContent,
  seedSampleDataForUser,
};
