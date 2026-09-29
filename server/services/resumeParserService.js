const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Comprehensive dictionary of common skills for detection
const SKILL_DICTIONARY = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust',
  'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Redux', 'Zustand', 'HTML', 'HTML5', 'CSS', 'CSS3',
  'Tailwind CSS', 'Bootstrap', 'Sass', 'LESS', 'Material UI', 'Node.js', 'Express', 'Express.js', 'NestJS', 'Django',
  'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'GraphQL', 'REST API', 'WebSockets', 'Microservices',
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB', 'Oracle', 'Firebase', 'Supabase',
  'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services', 'Azure', 'Google Cloud', 'GCP', 'Terraform', 'CI/CD',
  'GitHub Actions', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Linux', 'Bash', 'Shell', 'Nginx', 'Apache',
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Selenium', 'Unit Testing', 'TDD',
  'Machine Learning', 'Deep Learning', 'Data Analysis', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch',
  'NLP', 'OpenAI', 'LangChain', 'LLM', 'Artificial Intelligence', 'Data Science', 'Tableau', 'Power BI',
  'Agile', 'Scrum', 'Jira', 'Figma', 'System Design', 'OAuth', 'JWT', 'Security', 'Problem Solving', 'Leadership'
];

/**
 * Parses raw file buffer based on file type and extracts raw text
 * @param {Buffer} buffer 
 * @param {string} fileType 
 * @returns {Promise<string>}
 */
const extractTextFromFile = async (buffer, fileType) => {
  const ext = fileType.toLowerCase().replace('.', '');

  try {
    if (ext === 'pdf') {
      const data = await pdfParse(buffer);
      return data.text || '';
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } else if (ext === 'doc' || ext === 'txt') {
      // Basic text extraction for plain/doc fallback
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\t\n\r]/g, ' ');
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error(`Error extracting text from ${fileType}:`, error.message);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};

/**
 * Extracts structured data from resume text using NLP and regex heuristics
 * @param {string} text 
 * @returns {object}
 */
const parseResumeStructured = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      name: '',
      email: '',
      phone: '',
      summary: '',
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
    };
  }

  const cleanText = text.replace(/\r\n/g, '\n');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // 1. Extract Email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/;
  const emailMatch = cleanText.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  // 2. Extract Phone
  const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = cleanText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // 3. Extract Name (Usually in first 3 lines, excluding lines with email, urls, phone, or section titles)
  let name = '';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (
      !line.includes('@') &&
      !line.match(/https?:\/\//) &&
      !line.match(/\d{4,}/) &&
      !line.match(/resume|curriculum|vitae|profile|experience|education|skills/i) &&
      line.length > 2 &&
      line.length < 40 &&
      line.split(' ').length <= 4
    ) {
      name = line;
      break;
    }
  }

  // 4. Extract Skills
  const detectedSkills = new Set();
  const lowerText = cleanText.toLowerCase();

  for (const skill of SKILL_DICTIONARY) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,;()·/•|])${escaped}(?:$|[\\s,;()·/•|])`, 'i');
    if (regex.test(cleanText)) {
      detectedSkills.add(skill);
    }
  }

  // 5. Extract Sections
  const sections = {
    summary: '',
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  let currentSection = '';
  let sectionBuffers = {
    summary: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  const sectionKeywords = {
    summary: /^(summary|professional summary|executive summary|profile|about me|objective)$/i,
    experience: /^(experience|work experience|employment history|work history|professional experience)$/i,
    education: /^(education|academic background|academics|qualifications)$/i,
    projects: /^(projects|academic projects|personal projects|key projects)$/i,
    certifications: /^(certifications|licenses|courses|certificates)$/i,
    skills: /^(skills|technical skills|core competencies|technologies)$/i,
  };

  for (const line of lines) {
    let matchedSec = null;
    for (const [sec, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line.replace(/[^a-zA-Z\s]/g, '').trim())) {
        matchedSec = sec;
        break;
      }
    }

    if (matchedSec) {
      currentSection = matchedSec;
      continue;
    }

    if (currentSection && sectionBuffers[currentSection]) {
      sectionBuffers[currentSection].push(line);
    }
  }

  // Summarize extracted sections
  sections.summary = sectionBuffers.summary.slice(0, 4).join(' ');

  // Parse Education entries
  if (sectionBuffers.education.length > 0) {
    const eduText = sectionBuffers.education.join('\n');
    const degreeRegex = /(bachelor|master|b\.?tech|b\.?s\.?|m\.?s\.?|ph\.?d|diploma|associate|b\.?e\.?|mba)[^\n]*/gi;
    const matches = eduText.match(degreeRegex) || [];
    sections.education = matches.map(m => ({
      degree: m.trim(),
      institution: 'University / Institute',
      year: 'Relevant Period',
      details: m.trim()
    }));
    if (sections.education.length === 0 && sectionBuffers.education.length > 0) {
      sections.education.push({
        degree: sectionBuffers.education[0],
        institution: sectionBuffers.education[1] || '',
        year: '',
        details: sectionBuffers.education.slice(0, 3).join(' ')
      });
    }
  }

  // Parse Experience
  if (sectionBuffers.experience.length > 0) {
    const expLines = sectionBuffers.experience;
    let currentExp = null;
    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      if (line.includes('•') || line.startsWith('-')) {
        if (currentExp) {
          currentExp.description += (currentExp.description ? ' ' : '') + line.replace(/^[•\-]\s*/, '');
        }
      } else if (line.length < 60 && !currentExp) {
        currentExp = {
          role: line,
          company: expLines[i + 1] || 'Company',
          duration: 'Present',
          description: '',
        };
      }
    }
    if (currentExp) {
      sections.experience.push(currentExp);
    }
  }

  // Parse Projects
  if (sectionBuffers.projects.length > 0) {
    const projLines = sectionBuffers.projects;
    for (let i = 0; i < Math.min(projLines.length, 5); i++) {
      const line = projLines[i];
      if (!line.startsWith('•') && !line.startsWith('-') && line.length < 50) {
        sections.projects.push({
          title: line,
          technologies: [],
          description: projLines[i + 1] || '',
          link: ''
        });
      }
    }
  }

  return {
    name: name || 'Candidate',
    email,
    phone,
    summary: sections.summary,
    skills: Array.from(detectedSkills),
    education: sections.education,
    experience: sections.experience,
    projects: sections.projects,
    certifications: sectionBuffers.certifications.slice(0, 5),
  };
};

module.exports = {
  extractTextFromFile,
  parseResumeStructured,
};
