import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppContextType, Language, Project, Theme, UserData } from '@/lib/types';
import profileImg from '@assets/generated_images/professional_minimal_portrait_of_a_creative_developer.png';
import project1 from '@assets/generated_images/modern_minimal_web_design_project_mockup.png';
import project2 from '@assets/generated_images/mobile_app_interface_design_project_mockup.png';
import project3 from '@assets/generated_images/abstract_digital_art_project_cover.png';

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_DATA: UserData = {
  bio: {
    ar: "مطور واجهات أمامية ومصمم تجربة مستخدم شغوف ببناء تجارب رقمية استثنائية.",
    en: "Passionate Frontend Developer and UI/UX Designer crafting exceptional digital experiences."
  },
  phone: "+20 123 456 7890",
  profileImage: profileImg
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: { ar: 'تصميم موقع تجارة إلكترونية', en: 'E-commerce Website Design' },
    description: { 
      ar: 'منصة تسوق عصرية مع تجربة مستخدم سلسة ونظام دفع متكامل.', 
      en: 'Modern shopping platform with seamless UX and integrated payment system.' 
    },
    category: { ar: 'تطوير ويب', en: 'Web Development' },
    images: [project1]
  },
  {
    id: '2',
    title: { ar: 'تطبيق إدارة المهام', en: 'Task Management App' },
    description: { 
      ar: 'تطبيق موبايل لزيادة الإنتاجية وتنظيم العمل اليومي.', 
      en: 'Mobile application to boost productivity and organize daily work.' 
    },
    category: { ar: 'تطبيقات موبايل', en: 'Mobile App' },
    images: [project2]
  },
  {
    id: '3',
    title: { ar: 'هوية بصرية لشركة تقنية', en: 'Tech Startup Branding' },
    description: { 
      ar: 'تصميم شعار وهوية بصرية كاملة تعكس الابتكار والحداثة.', 
      en: 'Logo design and full visual identity reflecting innovation and modernity.' 
    },
    category: { ar: 'تصميم جرافيك', en: 'Graphic Design' },
    images: [project3]
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Password State
  const [adminPassword, setAdminPasswordState] = useState<string>(() => {
    return localStorage.getItem('adminPassword') || 'admin123';
  });

  // Data State
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Effects
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // Actions
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (password: string) => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword === adminPassword) {
      setAdminPasswordState(newPassword);
      localStorage.setItem('adminPassword', newPassword);
      return true;
    }
    return false;
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      toggleTheme,
      isAuthenticated,
      login,
      logout,
      userData,
      updateUserData,
      projects,
      addProject,
      updateProject,
      deleteProject,
      changePassword: changePassword as any,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
