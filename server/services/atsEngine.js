/**
 * Heuristic & Semantic ATS Analysis Engine
 * Evaluates resumes against job descriptions based on ATS industry standards:
 * - Keyword matching & relevance
 * - Skill gaps and overlaps
 * - Action verb usage & impact quantification
 * - Section structure and formatting cleanliness
 */

const ACTION_VERBS = [
  'built', 'developed', 'designed', 'implemented', 'created', 'architected', 'led', 'managed',
  'optimized', 'enhanced', 'reduced', 'increased', 'generated', 'streamlined', 'deployed',
  'automated', 'engineered', 'launched', 'delivered', 'orchestrated', 'spearheaded'
];

/**
 * Extracts candidate keywords from job description
 * @param {string} jobText 
 * @returns {string[]}
 */
const extractKeywordsFromJob = (jobText) => {
  if (!jobText) return [];
  const words = jobText
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'were', 'your', 'about', 'will', 'must'].includes(w));

  const counts = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([w]) => w);
};

/**
 * Calculates deterministic ATS and Match scores
 * @param {string} resumeText 
 * @param {string} jobText 
 * @param {string[]} resumeSkills 
 * @param {string[]} jobSkills 
 * @returns {object}
 */
const calculateAtsScores = (resumeText, jobText, resumeSkills = [], jobSkills = []) => {
  const rText = (resumeText || '').toLowerCase();
  const jText = (jobText || '').toLowerCase();

  // 1. Skill Match
  const normalizedResumeSkills = resumeSkills.map(s => s.toLowerCase());
  const normalizedJobSkills = jobSkills.length > 0 
    ? jobSkills.map(s => s.toLowerCase())
    : extractKeywordsFromJob(jobText).slice(0, 10);

  const matched = [];
  const missing = [];

  normalizedJobSkills.forEach(req => {
    if (normalizedResumeSkills.some(rs => rs.includes(req) || req.includes(rs)) || rText.includes(req)) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const skillsMatchRate = normalizedJobSkills.length > 0
    ? Math.round((matched.length / normalizedJobSkills.length) * 100)
    : 75;

  // 2. Keyword relevance
  const topJobKeywords = extractKeywordsFromJob(jobText);
  let matchedKeywords = 0;
  const keywordAnalysis = topJobKeywords.slice(0, 12).map(kw => {
    const found = rText.includes(kw);
    if (found) matchedKeywords++;
    return {
      keyword: kw,
      foundInResume: found,
      importance: matchedKeywords <= 4 ? 'High' : 'Medium',
      context: found ? `Found in resume context matching "${kw}"` : `Missing keyword crucial for ATS filtering`,
    };
  });

  const keywordRelevance = topJobKeywords.length > 0
    ? Math.round((matchedKeywords / Math.min(topJobKeywords.length, 12)) * 100)
    : 70;

  // 3. Experience & Quantification
  const hasActionVerbs = ACTION_VERBS.filter(v => rText.includes(v)).length;
  const hasMetrics = (resumeText.match(/\d+%/g) || []).length + (resumeText.match(/\$\d+/g) || []).length;
  const experienceRelevance = Math.min(95, Math.max(50, (hasActionVerbs * 3) + (hasMetrics * 5) + 40));

  // 4. Education & Certifications
  const hasDegree = /(bachelor|master|b\.?tech|b\.?s|degree|university|college)/i.test(resumeText);
  const educationRelevance = hasDegree ? 90 : 65;

  // 5. Formatting & Completeness
  let formattingScore = 85;
  if (rText.length < 300) formattingScore -= 30;
  if (!rText.includes('@')) formattingScore -= 15;
  if (!/(experience|education|skills)/i.test(rText)) formattingScore -= 20;

  // Calculate Weighted ATS Score
  const atsScore = Math.round(
    keywordRelevance * 0.25 +
    skillsMatchRate * 0.30 +
    experienceRelevance * 0.20 +
    educationRelevance * 0.15 +
    formattingScore * 0.10
  );

  // Calculate Weighted Job Match Score
  const jobMatchScore = Math.round(
    skillsMatchRate * 0.40 +
    keywordRelevance * 0.30 +
    experienceRelevance * 0.20 +
    educationRelevance * 0.10
  );

  const overallScore = Math.round((atsScore * 0.5) + (jobMatchScore * 0.5));

  return {
    overallScore: Math.min(98, Math.max(25, overallScore)),
    atsScore: Math.min(99, Math.max(30, atsScore)),
    jobMatchScore: Math.min(98, Math.max(25, jobMatchScore)),
    atsBreakdown: {
      keywordRelevance: Math.min(100, Math.max(20, keywordRelevance)),
      skillsMatch: Math.min(100, Math.max(20, skillsMatchRate)),
      experienceRelevance: Math.min(100, Math.max(30, experienceRelevance)),
      educationRelevance: Math.min(100, Math.max(30, educationRelevance)),
      formatting: Math.min(100, Math.max(40, formattingScore)),
      sectionCompleteness: Math.min(100, Math.max(50, formattingScore + 5)),
    },
    matchBreakdown: {
      overallMatch: Math.min(100, Math.max(25, jobMatchScore)),
      skillsMatch: Math.min(100, Math.max(20, skillsMatchRate)),
      experienceMatch: Math.min(100, Math.max(30, experienceRelevance)),
      keywordMatch: Math.min(100, Math.max(20, keywordRelevance)),
      educationMatch: Math.min(100, Math.max(30, educationRelevance)),
    },
    matchedSkills: matched.slice(0, 15),
    missingSkills: missing.slice(0, 10),
    recommendedSkills: missing.slice(0, 5),
    keywordAnalysis,
  };
};

module.exports = {
  extractKeywordsFromJob,
  calculateAtsScores,
};
