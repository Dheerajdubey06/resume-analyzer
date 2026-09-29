const { OpenAI } = require('openai');
const { calculateAtsScores } = require('./atsEngine');

/**
 * Validates and normalizes structured analysis response
 * @param {object} data 
 * @param {object} baselineScores 
 * @returns {object}
 */
const normalizeAnalysisData = (data, baselineScores) => {
  return {
    overallScore: typeof data.overallScore === 'number' ? Math.min(100, Math.max(0, Math.round(data.overallScore))) : baselineScores.overallScore,
    atsScore: typeof data.atsScore === 'number' ? Math.min(100, Math.max(0, Math.round(data.atsScore))) : baselineScores.atsScore,
    jobMatchScore: typeof data.jobMatchScore === 'number' ? Math.min(100, Math.max(0, Math.round(data.jobMatchScore))) : baselineScores.jobMatchScore,
    atsBreakdown: {
      keywordRelevance: data.atsBreakdown?.keywordRelevance ?? baselineScores.atsBreakdown.keywordRelevance,
      skillsMatch: data.atsBreakdown?.skillsMatch ?? baselineScores.atsBreakdown.skillsMatch,
      experienceRelevance: data.atsBreakdown?.experienceRelevance ?? baselineScores.atsBreakdown.experienceRelevance,
      educationRelevance: data.atsBreakdown?.educationRelevance ?? baselineScores.atsBreakdown.educationRelevance,
      formatting: data.atsBreakdown?.formatting ?? baselineScores.atsBreakdown.formatting,
      sectionCompleteness: data.atsBreakdown?.sectionCompleteness ?? baselineScores.atsBreakdown.sectionCompleteness,
    },
    matchBreakdown: {
      overallMatch: data.matchBreakdown?.overallMatch ?? baselineScores.matchBreakdown.overallMatch,
      skillsMatch: data.matchBreakdown?.skillsMatch ?? baselineScores.matchBreakdown.skillsMatch,
      experienceMatch: data.matchBreakdown?.experienceMatch ?? baselineScores.matchBreakdown.experienceMatch,
      keywordMatch: data.matchBreakdown?.keywordMatch ?? baselineScores.matchBreakdown.keywordMatch,
      educationMatch: data.matchBreakdown?.educationMatch ?? baselineScores.matchBreakdown.educationMatch,
    },
    summary: data.summary || 'Resume analyzed against the target job role with detailed technical alignment insights.',
    strengths: Array.isArray(data.strengths) && data.strengths.length > 0 ? data.strengths : [
      'Strong foundational proficiency in core engineering competencies',
      'Clear project execution demonstrating end-to-end full-stack capabilities',
      'Clean professional presentation and logical section organization'
    ],
    weaknesses: Array.isArray(data.weaknesses) && data.weaknesses.length > 0 ? data.weaknesses : [
      'Lacks quantifiable business and performance metrics in bullet points (e.g. % speedup, $ saved)',
      'Several required job keywords and cloud tooling are absent',
      'Professional summary could be more tightly tailored to the target role'
    ],
    matchedSkills: Array.isArray(data.matchedSkills) && data.matchedSkills.length > 0 ? data.matchedSkills : baselineScores.matchedSkills,
    missingSkills: Array.isArray(data.missingSkills) && data.missingSkills.length > 0 ? data.missingSkills : baselineScores.missingSkills,
    recommendedSkills: Array.isArray(data.recommendedSkills) && data.recommendedSkills.length > 0 ? data.recommendedSkills : baselineScores.recommendedSkills,
    keywordAnalysis: Array.isArray(data.keywordAnalysis) && data.keywordAnalysis.length > 0 ? data.keywordAnalysis : baselineScores.keywordAnalysis,
    experienceAnalysis: data.experienceAnalysis || 'Work history exhibits strong functional contributions. Enhancing descriptions with measurable impact and action-oriented verbs will elevate ATS ranking.',
    educationAnalysis: data.educationAnalysis || 'Educational qualifications satisfy the standard prerequisite requirements for this career track.',
    projectAnalysis: data.projectAnalysis || 'Projects demonstrate direct practical experience. Highlight architectural trade-offs, scalability, and automated testing to stand out.',
    formattingSuggestions: Array.isArray(data.formattingSuggestions) && data.formattingSuggestions.length > 0 ? data.formattingSuggestions : [
      'Maintain standard single-column formatting for maximum ATS compatibility',
      'Use standard bullet points instead of non-standard symbols or tables',
      'Ensure contact details like LinkedIn and GitHub are clickable or cleanly listed'
    ],
    improvementSuggestions: Array.isArray(data.improvementSuggestions) && data.improvementSuggestions.length > 0 ? data.improvementSuggestions : [
      {
        section: 'Summary',
        original: 'Software engineer passionate about building web apps.',
        improved: 'Full-Stack Software Engineer with expertise in React, Node.js, and cloud architectures. Proven track record of developing scalable applications and optimizing API performance by up to 35%.',
        reason: 'Adds measurable achievement and core technology keywords tailored to the target position.'
      },
      {
        section: 'Experience',
        original: 'Worked on backend APIs and fixed database bugs.',
        improved: 'Architected and deployed 15+ RESTful microservices with Node.js and MongoDB, decreasing endpoint latency by 28% and increasing test coverage to 85%.',
        reason: 'Transforms passive duty into quantified accomplishments with strong action verbs.'
      }
    ],
    interviewQuestions: Array.isArray(data.interviewQuestions) && data.interviewQuestions.length > 0 ? data.interviewQuestions : [
      {
        question: 'How do you design and structure scalable REST APIs in your full-stack applications?',
        category: 'Technical',
        suggestedAnswer: 'Explain layered architecture (controllers, services, repositories), error handling middleware, JWT authentication, rate limiting, and database indexing.',
        reason: 'Directly evaluates your practical backend architecture expertise.'
      },
      {
        question: 'Describe a complex technical challenge you overcame in one of your featured projects.',
        category: 'Project-based',
        suggestedAnswer: 'Use the STAR method (Situation, Task, Action, Result). Highlight how you diagnosed the root cause, evaluated trade-offs, and verified the outcome.',
        reason: 'Assesses problem-solving ability and technical decision-making.'
      },
      {
        question: 'How do you prioritize competing deadlines or manage sudden requirement shifts?',
        category: 'HR',
        suggestedAnswer: 'Emphasize agile principles, proactive communication with stakeholders, transparent task breakdown, and focusing on high-impact deliverables first.',
        reason: 'Tests team collaboration, communication, and work ethic.'
      },
      {
        question: 'What strategies do you use to optimize MongoDB queries and overall database throughput?',
        category: 'Role-specific',
        suggestedAnswer: 'Discuss compound indexes, explain plans, lean queries in Mongoose, projection, caching with Redis, and avoiding unbounded queries.',
        reason: 'Validates database optimization depth.'
      }
    ]
  };
};

/**
 * Analyzes resume text against job description using OpenAI or smart local ATS engine
 * @param {string} resumeText 
 * @param {string} jobDescriptionText 
 * @param {string[]} resumeSkills 
 * @param {string[]} jobSkills 
 * @returns {Promise<object>}
 */
const analyzeResumeWithAI = async (resumeText, jobDescriptionText, resumeSkills = [], jobSkills = []) => {
  // First calculate baseline deterministic ATS scores
  const baselineScores = calculateAtsScores(resumeText, jobDescriptionText, resumeSkills, jobSkills);

  const apiKey = process.env.OPENAI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-'));

  if (!isKeyConfigured || process.env.DEMO_MODE === 'true') {
    console.log('ℹ️  Using Intelligent ATS & AI Heuristic Engine (OpenAI key not configured or DEMO_MODE active).');
    return normalizeAnalysisData({}, baselineScores);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const prompt = `
You are an expert ATS (Applicant Tracking System) algorithms engineer, Senior Technical Recruiter, and Career Coach.
Analyze the following Candidate Resume against the Job Description.

Candidate Resume Text:
"""
${resumeText.slice(0, 4000)}
"""

Target Job Description:
"""
${jobDescriptionText.slice(0, 3000)}
"""

Provide an exhaustive, constructive, and realistic evaluation. You MUST return ONLY a valid raw JSON object matching the following structure without any markdown wrappers or preamble:

{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "jobMatchScore": number (0-100),
  "atsBreakdown": {
    "keywordRelevance": number (0-100),
    "skillsMatch": number (0-100),
    "experienceRelevance": number (0-100),
    "educationRelevance": number (0-100),
    "formatting": number (0-100),
    "sectionCompleteness": number (0-100)
  },
  "matchBreakdown": {
    "overallMatch": number (0-100),
    "skillsMatch": number (0-100),
    "experienceMatch": number (0-100),
    "keywordMatch": number (0-100),
    "educationMatch": number (0-100)
  },
  "summary": "Detailed 2-3 sentence executive evaluation of match",
  "strengths": ["3-5 clear bullet strengths with specific technical context"],
  "weaknesses": ["3-5 clear bullet weaknesses or missing qualifications"],
  "matchedSkills": ["Array of skills present in both resume and job description"],
  "missingSkills": ["Array of skills requested in job description but missing from resume"],
  "recommendedSkills": ["3-6 high priority skills candidate should acquire or emphasize"],
  "keywordAnalysis": [
    {
      "keyword": "string",
      "foundInResume": boolean,
      "importance": "High" | "Medium" | "Low",
      "context": "Short explanation of importance for ATS"
    }
  ],
  "experienceAnalysis": "Paragraph analyzing work history, quantification, action verbs, and relevancy",
  "educationAnalysis": "Paragraph evaluating academic and certification alignment",
  "projectAnalysis": "Paragraph evaluating relevant projects and recommendations",
  "formattingSuggestions": ["2-4 concrete ATS formatting tips"],
  "improvementSuggestions": [
    {
      "section": "Summary" | "Experience" | "Projects" | "Skills",
      "original": "Current phrasing or weak snippet from resume",
      "improved": "AI-optimized high-impact version with metrics and action verbs",
      "reason": "Why this improves ATS ranking and recruiter appeal"
    }
  ],
  "interviewQuestions": [
    {
      "question": "Realistic interview question tailored to this resume and role",
      "category": "Technical" | "HR" | "Project-based" | "Role-specific",
      "suggestedAnswer": "Key talking points candidate should include in their response",
      "reason": "Why the recruiter is asking this"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI Resume Analyzer and ATS scoring engine. Always output pure JSON without backticks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI provider');
    }

    const parsedJson = JSON.parse(content);
    return normalizeAnalysisData(parsedJson, baselineScores);
  } catch (error) {
    console.error('⚠️  OpenAI API call failed:', error.message);
    console.log('Falling back to local ATS & Semantic engine.');
    return normalizeAnalysisData({}, baselineScores);
  }
};

module.exports = {
  analyzeResumeWithAI,
  normalizeAnalysisData,
};
