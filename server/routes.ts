import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAdminDataSchema, insertProjectSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Admin Data Routes
  app.get("/api/admin", async (req, res) => {
    try {
      const admin = await storage.getAdminData();
      if (!admin) {
        return res.status(404).json({ message: "Admin data not found" });
      }
      res.json(admin);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin data" });
    }
  });

  app.patch("/api/admin", async (req, res) => {
    try {
      const { password } = req.body;
      
      // Verify password
      const isValid = await storage.verifyAdminPassword(password);
      if (!isValid) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validated = insertAdminDataSchema.partial().parse(req.body);
      const updated = await storage.updateAdminData(validated);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/admin/change-password", async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing passwords" });
      }

      const success = await storage.changeAdminPassword(oldPassword, newPassword);
      if (!success) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Projects Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const { password, ...projectData } = req.body;
      
      // Verify password
      const isValid = await storage.verifyAdminPassword(password);
      if (!isValid) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validated = insertProjectSchema.parse(projectData);
      const project = await storage.createProject(validated);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const { password, ...projectData } = req.body;
      const id = parseInt(req.params.id);
      
      // Verify password
      const isValid = await storage.verifyAdminPassword(password);
      if (!isValid) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validated = insertProjectSchema.partial().parse(projectData);
      const project = await storage.updateProject(id, validated);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { password } = req.body;
      const id = parseInt(req.params.id);
      
      // Verify password
      const isValid = await storage.verifyAdminPassword(password);
      if (!isValid) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  return httpServer;
}
