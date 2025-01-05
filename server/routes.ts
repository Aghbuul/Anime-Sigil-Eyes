import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { processedImages } from "@db/schema";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import express from 'express';
import { eq } from 'drizzle-orm';

// Configure multer for temporary storage
const storage = multer.memoryStorage(); // Store files in memory instead of disk
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Store user-uploaded sigils in a temporary directory
const TEMP_DIR = path.join(process.cwd(), "tmp");
const SIGILS_DIR = path.join(process.cwd(), "public", "sigils");

export function registerRoutes(app: Express): Server {
  // Ensure temporary directory exists
  fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

  // Create necessary directories
  const uploadsDir = path.join(process.cwd(), "uploads");
  fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);
  fs.mkdir(SIGILS_DIR, { recursive: true }).catch(console.error);

  // Copy default sigils to public directory
  const defaultSigils = [
    ["image_fx___4_-removebg-preview.png", "sigil1.png"],
    ["sigil2.png", "sigil2.png"]
  ];

  Promise.all(defaultSigils.map(([src, dest]) =>
    fs.copyFile(
      path.join(process.cwd(), "attached_assets", src),
      path.join(SIGILS_DIR, dest)
    )
  )).catch(console.error);

  // Get list of available default sigils only
  app.get("/api/sigils", async (_req, res) => {
    try {
      const files = await fs.readdir(SIGILS_DIR);
      res.json(files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file)));
    } catch (error) {
      console.error("Error listing sigils:", error);
      res.status(500).json({ message: "Error listing sigils" });
    }
  });

  // Get specific sigil (checks both directories)
  app.get("/api/sigils/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      let filePath;

      // First check temporary directory for custom sigils
      const tempPath = path.join(TEMP_DIR, filename);
      const defaultPath = path.join(SIGILS_DIR, filename);

      try {
        await fs.access(tempPath);
        filePath = tempPath;
      } catch {
        // If not in temp, try default sigils
        try {
          await fs.access(defaultPath);
          filePath = defaultPath;
        } catch {
          throw new Error("Sigil not found");
        }
      }

      const sigil = await fs.readFile(filePath);
      res.contentType("image/png").send(sigil);
    } catch (error) {
      console.error("Error serving sigil:", error);
      res.status(404).json({ message: "Sigil not found" });
    }
  });

  // Upload custom sigil to temporary storage
  app.post("/api/sigils", upload.single("sigil"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No sigil provided" });
      }

      // Generate unique filename for temporary storage
      const filename = `custom-${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(TEMP_DIR, filename);

      // Save to temporary directory
      await fs.writeFile(filePath, req.file.buffer);

      // Set up cleanup after 1 hour
      setTimeout(async () => {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error("Error cleaning up temporary sigil:", error);
        }
      }, 3600000); // 1 hour in milliseconds

      res.json({ filename });
    } catch (error) {
      console.error("Error uploading sigil:", error);
      res.status(500).json({ message: "Error uploading sigil" });
    }
  });

  // Upload and process image
  app.post("/api/process", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Save original image
      const originalFilename = `${Date.now()}-${req.file.originalname}`;
      const originalPath = path.join(uploadsDir, originalFilename);
      await fs.writeFile(originalPath, req.file.buffer);

      // Store in database
      const imageRecord = await db.insert(processedImages).values({
        originalImage: originalPath,
        processedImage: originalPath, // Initially same as original
        eyeCoordinates: [], // Will be updated after processing
        sigilSize: 25, // Default size (25% of previous default)
        leftEyeEnabled: true,
        rightEyeEnabled: true,
      }).returning();

      res.json({
        id: imageRecord[0].id,
        originalImage: `/uploads/${originalFilename}`,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ message: "Error processing image" });
    }
  });

  // Update image processing settings
  app.put("/api/process/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { eyeCoordinates, sigilSize, leftEyeEnabled, rightEyeEnabled } = req.body;

      await db.update(processedImages)
        .set({
          eyeCoordinates,
          sigilSize,
          leftEyeEnabled,
          rightEyeEnabled,
          updatedAt: new Date(),
        })
        .where(eq(processedImages.id, parseInt(id)));

      res.json({ message: "Processing settings updated" });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Error updating settings" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadsDir));
  app.use("/tmp", express.static(TEMP_DIR));
  app.use("/sigils", express.static(SIGILS_DIR));

  const httpServer = createServer(app);
  return httpServer;
}