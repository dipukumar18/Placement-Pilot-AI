import Resume from "../models/Resume.js";
import User from "../models/User.js";
import fs from "fs/promises";
import fsSync from "fs";
import { PDFParse } from "pdf-parse";

import analyzeResumeText from "../services/resumeAnalyzer.js";
import analyzeSkillGap from "../services/skillGapAnalyzer.js";

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
        errors: [],
      });
    }

    let extractedText = "";

    try {
      const fileBuffer = await fs.readFile(req.file.path);

      const parser = new PDFParse({
        data: fileBuffer,
      });

      const result = await parser.getText();

      extractedText = result.text?.trim() || "";

      await parser.destroy();
    } catch (pdfError) {
      console.error("PDF Text Extraction Error:", pdfError);

      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error(
          "Resume cleanup error:",
          cleanupError.message
        );
      }

      return res.status(422).json({
        success: false,
        message:
          "Resume uploaded, but PDF text could not be extracted",
        errors: [pdfError.message],
      });
    }

    const resumeAnalysis =
      analyzeResumeText(extractedText);

    const user = await User.findById(
      req.user.userId
    ).select("targetRole");

    if (!user) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error(
          "Resume cleanup error:",
          cleanupError.message
        );
      }

      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
        errors: [],
      });
    }

    const skillGap = analyzeSkillGap({
      targetRole: user.targetRole,
      resumeSkills: resumeAnalysis.skills,
    });

    const analysis = {
      summary: resumeAnalysis.summary,
      skills: resumeAnalysis.skills,
      education: resumeAnalysis.education,
      experience: resumeAnalysis.experience,
      projects: resumeAnalysis.projects,
      missingSkills: skillGap.missingSkills,
    };

    const resume = await Resume.create({
      user: req.user.userId,
      originalFileName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      extractedText,
      analysisStatus: "completed",
      analysis,
    });

    return res.status(201).json({
      success: true,
      message:
        "Resume uploaded, text extracted, and analyzed successfully",
      data: {
        id: resume._id,
        originalFileName: resume.originalFileName,
        fileName: resume.fileName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        extractedTextLength:
          resume.extractedText.length,
        analysisStatus: resume.analysisStatus,

        targetRole: user.targetRole,

        analysis: resume.analysis,

        skillGap: {
          requiredSkills: skillGap.requiredSkills,
          matchedSkills: skillGap.matchedSkills,
          missingSkills: skillGap.missingSkills,
          matchPercentage:
            skillGap.matchPercentage,
          totalRequiredSkills:
            skillGap.totalRequiredSkills,
          totalMatchedSkills:
            skillGap.totalMatchedSkills,
          totalMissingSkills:
            skillGap.totalMissingSkills,
        },

        uploadedAt: resume.createdAt,
      },
    });
  } catch (error) {
    if (
      req.file?.path &&
      fsSync.existsSync(req.file.path)
    ) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error(
          "Resume cleanup error:",
          cleanupError.message
        );
      }
    }

    return next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
        errors: [],
      });
    }

    const user = await User.findById(
      req.user.userId
    ).select("targetRole");

    const skillGap = analyzeSkillGap({
      targetRole: user?.targetRole || "",
      resumeSkills: resume.analysis?.skills || [],
    });

    return res.status(200).json({
      success: true,
      message: "Resume retrieved successfully",
      data: {
        id: resume._id,
        originalFileName:
          resume.originalFileName,
        fileName: resume.fileName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,

        extractedText:
          resume.extractedText,

        extractedTextLength:
          resume.extractedText.length,

        analysisStatus:
          resume.analysisStatus,

        analysis: resume.analysis,

        targetRole:
          user?.targetRole || "",

        skillGap: {
          requiredSkills:
            skillGap.requiredSkills,

          matchedSkills:
            skillGap.matchedSkills,

          missingSkills:
            skillGap.missingSkills,

          matchPercentage:
            skillGap.matchPercentage,

          totalRequiredSkills:
            skillGap.totalRequiredSkills,

          totalMatchedSkills:
            skillGap.totalMatchedSkills,

          totalMissingSkills:
            skillGap.totalMissingSkills,
        },

        uploadedAt:
          resume.createdAt,

        updatedAt:
          resume.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};