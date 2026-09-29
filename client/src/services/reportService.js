import jsPDF from 'jspdf';

/**
 * Generates and downloads a clean, professional PDF analysis report
 * @param {object} analysis Analysis document
 * @param {object} user Current user object
 */
export const generatePdfReport = (analysis, user) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2);

  let y = 18;

  // Helper for adding new page if needed
  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 18;
      // Header for subsequent pages
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 170);
      doc.text(`ResumeAI — Career Intelligence Report | ${analysis.jobDescription?.title || 'Analysis'}`, margin, 10);
      doc.setDrawColor(220, 225, 235);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('ResumeAI', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(190, 200, 225);
  doc.text('AI Resume & ATS Optimization Report', margin, 20);

  const reportDate = new Date(analysis.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Date: ${reportDate}`, pageWidth - margin - 35, 14);
  doc.text(`Candidate: ${user?.name || 'Applicant'}`, pageWidth - margin - 35, 20);

  y = 36;

  // Overview Card Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(`${analysis.jobDescription?.title || 'Target Position'}`, margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Company: ${analysis.jobDescription?.company || 'N/A'}  |  Resume: ${analysis.resume?.originalName || 'Uploaded Resume'}`, margin, y);
  y += 10;

  // Scores Row
  const boxWidth = (contentWidth - 8) / 3;

  // Overall Score Box
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.roundedRect(margin, y, boxWidth, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(79, 70, 229);
  doc.text(`${analysis.overallScore || 0}%`, margin + 10, y + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Overall Match Score', margin + 10, y + 16);

  // ATS Score Box
  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.roundedRect(margin + boxWidth + 4, y, boxWidth, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(5, 150, 105);
  doc.text(`${analysis.atsScore || 0}/100`, margin + boxWidth + 14, y + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ATS Readiness Score', margin + boxWidth + 14, y + 16);

  // Job Match Score Box
  doc.setFillColor(239, 246, 255); // Blue 50
  doc.roundedRect(margin + (boxWidth * 2) + 8, y, boxWidth, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(37, 99, 235);
  doc.text(`${analysis.jobMatchScore || 0}%`, margin + (boxWidth * 2) + 18, y + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Skill Alignment Score', margin + (boxWidth * 2) + 18, y + 16);

  y += 28;

  // Executive Summary
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Executive Summary', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const summaryLines = doc.splitTextToSize(analysis.summary || 'No summary available.', contentWidth);
  doc.text(summaryLines, margin, y);
  y += (summaryLines.length * 4.5) + 6;

  // Matched vs Missing Skills
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Skills Gap Analysis', margin, y);
  y += 5;

  const halfWidth = (contentWidth - 6) / 2;

  // Matched Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(16, 185, 129);
  doc.text(`Matched Skills (${(analysis.matchedSkills || []).length})`, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const matchedText = (analysis.matchedSkills || []).join(', ') || 'None detected';
  const matchedLines = doc.splitTextToSize(matchedText, halfWidth);
  doc.text(matchedLines, margin, y + 4);

  // Missing Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(239, 68, 68);
  doc.text(`Missing Skills (${(analysis.missingSkills || []).length})`, margin + halfWidth + 6, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const missingText = (analysis.missingSkills || []).join(', ') || 'No missing skills identified';
  const missingLines = doc.splitTextToSize(missingText, halfWidth);
  doc.text(missingLines, margin + halfWidth + 6, y + 4);

  const skillsBlockHeight = Math.max(matchedLines.length, missingLines.length) * 4;
  y += skillsBlockHeight + 12;

  // Key Strengths
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Key Strengths', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  (analysis.strengths || []).forEach(item => {
    checkPageBreak(10);
    doc.text(`• ${item}`, margin + 2, y);
    y += 4.5;
  });
  y += 4;

  // Areas for Improvement
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Areas for Improvement', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  (analysis.weaknesses || []).forEach(item => {
    checkPageBreak(10);
    doc.text(`• ${item}`, margin + 2, y);
    y += 4.5;
  });
  y += 4;

  // AI Improvement Suggestions
  if (analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('AI Bullet & Content Enhancements', margin, y);
    y += 6;

    analysis.improvementSuggestions.forEach((sug, i) => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229);
      doc.text(`Suggestion ${i + 1} (${sug.section}):`, margin, y);
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const origText = `Original: "${sug.original}"`;
      const origLines = doc.splitTextToSize(origText, contentWidth);
      doc.text(origLines, margin, y);
      y += (origLines.length * 3.8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      const impText = `Improved: "${sug.improved}"`;
      const impLines = doc.splitTextToSize(impText, contentWidth);
      doc.text(impLines, margin, y);
      y += (impLines.length * 3.8);

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      const reasonText = `Reason: ${sug.reason}`;
      const reasonLines = doc.splitTextToSize(reasonText, contentWidth);
      doc.text(reasonLines, margin, y);
      y += (reasonLines.length * 3.8) + 4;
    });
  }

  // Interview Questions
  if (analysis.interviewQuestions && analysis.interviewQuestions.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('Targeted Interview Preparation Questions', margin, y);
    y += 6;

    analysis.interviewQuestions.forEach((q, i) => {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      const qText = `${i + 1}. [${q.category || 'Technical'}] ${q.question}`;
      const qLines = doc.splitTextToSize(qText, contentWidth);
      doc.text(qLines, margin, y);
      y += (qLines.length * 4);

      if (q.suggestedAnswer) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const ansText = `Talking Points: ${q.suggestedAnswer}`;
        const ansLines = doc.splitTextToSize(ansText, contentWidth - 4);
        doc.text(ansLines, margin + 4, y);
        y += (ansLines.length * 3.8) + 3;
      }
    });
  }

  // Footer for each page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount} — Generated with ResumeAI (MERN Stack)`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const filename = `ResumeAI_Report_${(analysis.jobDescription?.title || 'Analysis').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
};
