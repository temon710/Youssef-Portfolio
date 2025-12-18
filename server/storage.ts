import { db } from "./db";
import { adminData, projects, type AdminData, type InsertAdminData, type Project, type InsertProject } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAdminData(): Promise<AdminData | undefined>;
  updateAdminData(data: Partial<InsertAdminData>): Promise<AdminData>;
  verifyAdminPassword(password: string): Promise<boolean>;
  changeAdminPassword(oldPassword: string, newPassword: string): Promise<boolean>;
  
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getAdminData(): Promise<AdminData | undefined> {
    const result = await db.query.adminData.findFirst();
    return result;
  }

  async updateAdminData(data: Partial<InsertAdminData>): Promise<AdminData> {
    const result = await db
      .update(adminData)
      .set(data)
      .where(eq(adminData.id, 1))
      .returning();
    return result[0];
  }

  async verifyAdminPassword(password: string): Promise<boolean> {
    const admin = await this.getAdminData();
    if (!admin) return false;
    return password === admin.adminPassword;
  }

  async changeAdminPassword(oldPassword: string, newPassword: string): Promise<boolean> {
    const isValid = await this.verifyAdminPassword(oldPassword);
    if (!isValid) return false;
    
    await this.updateAdminData({ adminPassword: newPassword });
    return true;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.query.projects.findMany();
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db
      .insert(projects)
      .values(project)
      .returning();
    return result[0];
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
