import { jsPDF } from "jspdf";

/**
 * CareerPilot AI — Resume Intelligence PDF Report Generator
 *
 * Produces a professional multi-page PDF from a resume analysis object.
 * Handles page overflow, section headers, bullet lists, tag grids, and
 * auto-pagination for every data section the dashboard displays.
 */

// ── Brand Colors ──────────────────────────────────────────────
const COLORS = {
  primary: [79, 70, 229],       // Indigo-600
  secondary: [99, 102, 241],    // Indigo-500
  accent: [16, 185, 129],       // Emerald-500
  danger: [239, 68, 68],        // Red-500
  warning: [245, 158, 11],      // Amber-500
  dark: [30, 30, 46],           // Surface dark
  textPrimary: [15, 23, 42],    // Slate-900
  textSecondary: [100, 116, 139], // Slate-500
  bg: [248, 250, 252],          // Slate-50
  white: [255, 255, 255],
  border: [226, 232, 240],      // Slate-200
};

// ── Layout Constants ──────────────────────────────────────────
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_RESERVE = 20;

/**
 * Main export function: generates and downloads a PDF report.
 * @param {Object} analysis - The activeAnalysis object from the dashboard.
 */
export function generateResumePDF(analysis) {
  if (!analysis) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  // ── Helpers ───────────────────────────────────────────────
  const ensureSpace = (needed) => {
    if (y + needed > PAGE_H - FOOTER_RESERVE) {
      drawFooter(doc, analysis);
      doc.addPage();
      y = MARGIN;
    }
  };

  const setFont = (style = "normal", size = 10) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
  };

  const setColor = (rgb) => doc.setTextColor(...rgb);

  // ── Cover / Header ────────────────────────────────────────
  y = drawHeader(doc, analysis);

  // ── 1. Score Summary ──────────────────────────────────────
  y = drawScoreSummary(doc, analysis, y);

  // ── 2. AI Explanation ─────────────────────────────────────
  ensureSpace(30);
  y = drawSectionTitle(doc, "AI Career Mentor Analysis", y);
  setFont("normal", 10);
  setColor(COLORS.textPrimary);
  const explLines = doc.splitTextToSize(
    analysis.ai_explanation || "No AI analysis available.",
    CONTENT_W
  );
  for (const line of explLines) {
    ensureSpace(6);
    doc.text(line, MARGIN, y);
    y += 5;
  }
  y += 6;

  // ── 3. Technical Skills ───────────────────────────────────
  y = drawTagSection(doc, "Technical Skills", analysis.technical_skills, COLORS.primary, y, ensureSpace);

  // ── 4. Soft Skills ────────────────────────────────────────
  y = drawTagSection(doc, "Soft Skills", analysis.soft_skills, COLORS.accent, y, ensureSpace);

  // ── 5. Strengths ──────────────────────────────────────────
  y = drawBulletList(doc, "Strengths & Achievements", analysis.strengths, COLORS.accent, y, ensureSpace);

  // ── 6. Weaknesses ─────────────────────────────────────────
  y = drawBulletList(doc, "Improvement Areas", analysis.weaknesses, COLORS.warning, y, ensureSpace);

  // ── 7. Missing Skills ─────────────────────────────────────
  y = drawTagSection(doc, "Missing Skills", analysis.missing_skills, COLORS.danger, y, ensureSpace);

  // ── 8. Suggestions ────────────────────────────────────────
  y = drawBulletList(doc, "Suggestions & Fixes", analysis.suggestions, COLORS.secondary, y, ensureSpace);

  // ── 9. Roadmap ────────────────────────────────────────────
  ensureSpace(20);
  y = drawSectionTitle(doc, "6-Step Learning Roadmap", y);
  if (analysis.roadmap?.length > 0) {
    analysis.roadmap.forEach((step, idx) => {
      ensureSpace(14);
      // Step badge
      doc.setFillColor(...COLORS.primary);
      doc.roundedRect(MARGIN, y - 4, 8, 8, 2, 2, "F");
      setFont("bold", 9);
      setColor(COLORS.white);
      doc.text(String(idx + 1), MARGIN + 2.8, y + 1);

      // Step text
      setFont("normal", 10);
      setColor(COLORS.textPrimary);
      const stepLines = doc.splitTextToSize(step, CONTENT_W - 14);
      stepLines.forEach((line, li) => {
        if (li > 0) ensureSpace(5);
        doc.text(line, MARGIN + 12, y + (li * 5));
      });
      y += Math.max(stepLines.length * 5, 5) + 4;
    });
  } else {
    setFont("italic", 9);
    setColor(COLORS.textSecondary);
    doc.text("No learning steps generated.", MARGIN, y);
    y += 8;
  }
  y += 4;

  // ── 10. Recommended Roles ─────────────────────────────────
  ensureSpace(20);
  y = drawSectionTitle(doc, "Recommended Job Roles", y);
  if (analysis.recommended_roles?.length > 0) {
    analysis.recommended_roles.forEach((role) => {
      ensureSpace(18);
      // Card background
      doc.setFillColor(...COLORS.bg);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, 16, 2, 2, "F");
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, 16, 2, 2, "S");

      setFont("bold", 10);
      setColor(COLORS.textPrimary);
      doc.text(role.title || "Untitled Role", MARGIN + 4, y + 1);

      setFont("normal", 8);
      setColor(COLORS.textSecondary);
      doc.text(
        "Salary: " + (role.salary_range || "N/A") + "   |   Match: " + (role.match_percentage || 0) + "%",
        MARGIN + 4,
        y + 7
      );
      y += 20;
    });
  } else {
    setFont("italic", 9);
    setColor(COLORS.textSecondary);
    doc.text("No recommended roles available.", MARGIN, y);
    y += 8;
  }
  y += 4;

  // ── 11. Certifications ────────────────────────────────────
  ensureSpace(20);
  y = drawSectionTitle(doc, "Recommended Certifications", y);
  if (analysis.recommended_certifications?.length > 0) {
    analysis.recommended_certifications.forEach((cert) => {
      ensureSpace(18);
      doc.setFillColor(...COLORS.bg);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, 16, 2, 2, "F");
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, 16, 2, 2, "S");

      setFont("bold", 10);
      setColor(COLORS.textPrimary);
      doc.text(cert.name || "Untitled Certification", MARGIN + 4, y + 1);

      setFont("normal", 8);
      setColor(COLORS.textSecondary);
      doc.text(
        "Provider: " + (cert.provider || "N/A") + "   |   Difficulty: " + (cert.difficulty || "N/A"),
        MARGIN + 4,
        y + 7
      );
      y += 20;
    });
  } else {
    setFont("italic", 9);
    setColor(COLORS.textSecondary);
    doc.text("No certifications recommended.", MARGIN, y);
    y += 8;
  }
  y += 4;

  // ── 12. Learning Resources ────────────────────────────────
  ensureSpace(20);
  y = drawSectionTitle(doc, "Learning Resources", y);
  if (analysis.learning_resources?.length > 0) {
    analysis.learning_resources.forEach((res) => {
      ensureSpace(14);
      setFont("bold", 9);
      if (res.url) {
        setColor([37, 99, 235]); // Blue link color
        doc.textWithLink("• " + (res.title || "Untitled"), MARGIN + 2, y, { url: res.url });
      } else {
        setColor(COLORS.primary);
        doc.text("• " + (res.title || "Untitled"), MARGIN + 2, y);
      }

      setFont("normal", 8);
      setColor(COLORS.textSecondary);
      const meta = "Type: " + (res.type || "Link");
      doc.text(meta, MARGIN + 6, y + 4);
      y += 8;
    });
  } else {
    setFont("italic", 9);
    setColor(COLORS.textSecondary);
    doc.text("No learning resources recommended.", MARGIN, y);
    y += 8;
  }
  y += 4;

  // ── 13. Recommended Projects ──────────────────────────────
  ensureSpace(20);
  y = drawSectionTitle(doc, "Recommended Portfolio Projects", y);
  if (analysis.recommended_projects?.length > 0) {
    analysis.recommended_projects.forEach((proj) => {
      // Calculate dynamic heights first
      setFont("normal", 8);
      const descLines = doc.splitTextToSize(proj.description || "", CONTENT_W - 12);
      let nextY = 7 + (descLines.length * 4) + 2;
      
      let stackLines = [];
      if (proj.tech_stack?.length > 0) {
        setFont("italic", 7);
        stackLines = doc.splitTextToSize("Stack: " + proj.tech_stack.join(", "), CONTENT_W - 12);
        nextY += stackLines.length * 4;
      }
      
      const cardHeight = Math.max(22, nextY + 4);
      ensureSpace(cardHeight + 4);
      
      doc.setFillColor(...COLORS.bg);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, cardHeight, 2, 2, "F");
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, cardHeight, 2, 2, "S");

      setFont("bold", 10);
      setColor(COLORS.textPrimary);
      doc.text(proj.title || "Untitled Project", MARGIN + 4, y + 1);

      setFont("normal", 8);
      setColor(COLORS.textSecondary);
      descLines.forEach((line, li) => {
        doc.text(line, MARGIN + 4, y + 7 + (li * 4));
      });
      
      if (stackLines.length > 0) {
        setFont("italic", 7);
        setColor(COLORS.secondary);
        let stackY = y + 7 + (descLines.length * 4) + 2;
        stackLines.forEach((line, li) => {
          doc.text(line, MARGIN + 4, stackY + (li * 4));
        });
      }
      y += cardHeight + 4;
    });
  } else {
    setFont("italic", 9);
    setColor(COLORS.textSecondary);
    doc.text("No portfolio projects recommended.", MARGIN, y);
    y += 8;
  }

  // ── Final Footer ──────────────────────────────────────────
  drawFooter(doc, analysis);

  // ── Save ──────────────────────────────────────────────────
  const safeName = (analysis.filename || "resume")
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save("CareerPilot_Report_" + safeName + ".pdf");
}


// ══════════════════════════════════════════════════════════════
// INTERNAL DRAWING HELPERS
// ══════════════════════════════════════════════════════════════

function drawHeader(doc, analysis) {
  // Dark header band
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, PAGE_W, 42, "F");

  // Brand
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("CareerPilot AI", MARGIN, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 220);
  doc.text("Resume Intelligence Report", MARGIN, 26);

  // Filename + date on right
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  const dateStr = analysis.generated_at
    ? new Date(analysis.generated_at).toLocaleString()
    : new Date().toLocaleString();
  doc.text(analysis.filename || "resume.pdf", PAGE_W - MARGIN, 18, { align: "right" });
  doc.setTextColor(180, 180, 220);
  doc.text(dateStr, PAGE_W - MARGIN, 26, { align: "right" });

  // Accent line
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 42, PAGE_W, 1.5, "F");

  return 54; // next y position
}

function drawFooter(doc, _analysis) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.textSecondary);
    doc.text(
      "Generated by CareerPilot AI — Resume Intelligence Engine v1.0",
      MARGIN,
      PAGE_H - 8
    );
    doc.text(
      "Page " + i + " of " + pageCount,
      PAGE_W - MARGIN,
      PAGE_H - 8,
      { align: "right" }
    );
    // Bottom accent line
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
  }
}

function drawScoreSummary(doc, analysis, y) {
  const cardW = (CONTENT_W - 8) / 3;

  const scores = [
    { label: "Resume Quality", value: (analysis.resume_score || 0) + "%", color: COLORS.primary },
    { label: "ATS Readiness", value: (analysis.ats_score || 0) + "%", color: COLORS.accent },
    { label: "AI Confidence", value: analysis.confidence_score ? `${analysis.confidence_score}%` : "N/A", color: COLORS.secondary },
  ];

  scores.forEach((item, idx) => {
    const x = MARGIN + idx * (cardW + 4);

    // Card bg
    doc.setFillColor(...COLORS.bg);
    doc.roundedRect(x, y, cardW, 24, 3, 3, "F");
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(x, y, cardW, 24, 3, 3, "S");

    // Color bar
    doc.setFillColor(...item.color);
    doc.roundedRect(x, y, cardW, 3, 3, 3, "F");
    doc.rect(x, y + 1.5, cardW, 1.5, "F"); // flatten bottom of rounded rect

    // Label
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.textSecondary);
    doc.text(item.label, x + cardW / 2, y + 10, { align: "center" });

    // Value
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...item.color);
    doc.text(item.value, x + cardW / 2, y + 20, { align: "center" });
  });

  return y + 32;
}

function drawSectionTitle(doc, title, y) {
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(MARGIN, y - 1, 3, 8, 1, 1, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textPrimary);
  doc.text(title, MARGIN + 6, y + 5);

  return y + 12;
}

function drawTagSection(doc, title, items, color, y, ensureSpace) {
  ensureSpace(20);
  y = drawSectionTitle(doc, title, y);

  if (!items || items.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...COLORS.textSecondary);
    doc.text("None detected.", MARGIN, y);
    return y + 10;
  }

  let x = MARGIN;
  items.forEach((tag) => {
    const tagText = " " + tag + " ";
    const tagW = doc.getStringUnitWidth(tagText) * 8 / doc.internal.scaleFactor + 4;

    if (x + tagW > PAGE_W - MARGIN) {
      x = MARGIN;
      y += 8;
      ensureSpace(10);
    }

    doc.setFillColor(...color, 30);
    doc.roundedRect(x, y - 3.5, tagW, 7, 2, 2, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...color);
    doc.text(tagText, x + 2, y + 1);

    x += tagW + 3;
  });

  return y + 12;
}

function drawBulletList(doc, title, items, color, y, ensureSpace) {
  ensureSpace(20);
  y = drawSectionTitle(doc, title, y);

  if (!items || items.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...COLORS.textSecondary);
    doc.text("No items recorded.", MARGIN, y);
    return y + 10;
  }

  items.forEach((item) => {
    ensureSpace(8);
    // Bullet dot
    doc.setFillColor(...color);
    doc.circle(MARGIN + 2, y - 1, 1.2, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.textPrimary);
    const lines = doc.splitTextToSize(item, CONTENT_W - 10);
    lines.forEach((line, li) => {
      if (li > 0) ensureSpace(5);
      doc.text(line, MARGIN + 7, y + (li * 4.5));
    });
    y += Math.max(lines.length * 4.5, 4.5) + 2;
  });

  return y + 4;
}
