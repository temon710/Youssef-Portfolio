export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface Project {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  images: string[];
}

export interface UserData {
  bio: LocalizedText;
  phone: string;
  profileImage: string;
}

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}
