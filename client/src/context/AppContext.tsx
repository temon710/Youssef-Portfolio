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

  const [adminPassword, setAdminPassword] = useState<string>('');

  // Data State
  const [userData, setUserData] = useState<UserData>(INITIAL_DATA);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch admin data
        const adminRes = await fetch('/api/admin');
        if (adminRes.ok) {
          const admin = await adminRes.json();
          setUserData({
            bio: { ar: admin.bioAr, en: admin.bioEn },
            phone: admin.phone,
            profileImage: admin.profileImage
          });
        }

        // Fetch projects
        const projectsRes = await fetch('/api/projects');
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.map((p: any) => ({
            id: p.id.toString(),
            title: { ar: p.titleAr, en: p.titleEn },
            description: { ar: p.descriptionAr, en: p.descriptionEn },
            category: { ar: p.categoryAr, en: p.categoryEn },
            images: p.images
          })));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  // Actions
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (password: string) => {
    setAdminPassword(password);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    localStorage.removeItem('isAuthenticated');
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      if (res.ok) {
        setAdminPassword(newPassword);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to change password:', error);
      return false;
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: adminPassword,
          bioAr: data.bio?.ar || userData.bio.ar,
          bioEn: data.bio?.en || userData.bio.en,
          phone: data.phone || userData.phone,
          profileImage: data.profileImage || userData.profileImage
        })
      });
      
      if (res.ok) {
        setUserData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: adminPassword,
          titleAr: project.title.ar,
          titleEn: project.title.en,
          descriptionAr: project.description.ar,
          descriptionEn: project.description.en,
          categoryAr: project.category.ar,
          categoryEn: project.category.en,
          images: project.images
        })
      });
      
      if (res.ok) {
        const newProject = await res.json();
        setProjects(prev => [{
          id: newProject.id.toString(),
          title: { ar: newProject.titleAr, en: newProject.titleEn },
          description: { ar: newProject.descriptionAr, en: newProject.descriptionEn },
          category: { ar: newProject.categoryAr, en: newProject.categoryEn },
          images: newProject.images
        }, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: adminPassword,
          ...(updates.title && { titleAr: updates.title.ar, titleEn: updates.title.en }),
          ...(updates.description && { descriptionAr: updates.description.ar, descriptionEn: updates.description.en }),
          ...(updates.category && { categoryAr: updates.category.ar, categoryEn: updates.category.en }),
          ...(updates.images && { images: updates.images })
        })
      });
      
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>;
  }

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
      changePassword
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
