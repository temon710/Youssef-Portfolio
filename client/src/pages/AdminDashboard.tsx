import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/lib/types';
import { Plus, Trash2, Edit, Save, Image as ImageIcon, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { 
    isAuthenticated, 
    projects, 
    deleteProject,
    language 
  } = useApp();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <Navbar />
      <div className="container px-4 pt-24 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
          </h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
            <TabsTrigger value="profile">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</TabsTrigger>
            <TabsTrigger value="projects">{language === 'ar' ? 'المشاريع' : 'Projects'}</TabsTrigger>
            <TabsTrigger value="security">{language === 'ar' ? 'الأمان' : 'Security'}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { userData, updateUserData, language } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    bioAr: userData.bio.ar,
    bioEn: userData.bio.en,
    phone: userData.phone,
    profileImage: userData.profileImage
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUserData({
        bio: { ar: formData.bioAr, en: formData.bioEn },
        phone: formData.phone,
        profileImage: formData.profileImage
      });
      toast({ title: language === 'ar' ? 'تم حفظ التغييرات' : 'Changes Saved' });
      setIsSaving(false);
    }, 300);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'المعلومات الشخصية' : 'Personal Info'}</CardTitle>
          <CardDescription>{language === 'ar' ? 'تعديل النبذة ورقم التواصل' : 'Edit bio and contact info'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bio (Arabic)</Label>
            <Textarea 
              value={formData.bioAr} 
              onChange={(e) => setFormData({...formData, bioAr: e.target.value})}
              className="min-h-[100px] text-right"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label>Bio (English)</Label>
            <Textarea 
              value={formData.bioEn} 
              onChange={(e) => setFormData({...formData, bioEn: e.target.value})}
              className="min-h-[100px]"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
            <Input 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'الصورة الشخصية' : 'Profile Image'}</CardTitle>
          <CardDescription>{language === 'ar' ? 'تغيير الصورة الشخصية' : 'Change profile picture'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="relative w-48 h-48">
            <img 
              src={formData.profileImage} 
              alt="Profile Preview" 
              className="w-full h-full object-cover rounded-full border-4 border-muted"
            />
          </div>
          <div className="w-full space-y-2">
             <Label>Image URL</Label>
             <div className="flex gap-2">
               <Input 
                 value={formData.profileImage} 
                 onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
                 placeholder="https://..."
               />
               <Button onClick={handleSave} disabled={isSaving} size="icon" className="flex-shrink-0">
                 <Save className="w-4 h-4" />
               </Button>
             </div>
             <p className="text-xs text-muted-foreground">
               {language === 'ar' ? '* أدخل رابط صورة مباشر وثم اضغط حفظ' : '* Enter image URL and click Save'}
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectsTab() {
  const { projects, deleteProject, language } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const openNew = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          {language === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="overflow-hidden group relative h-full flex flex-col">
                <div className="aspect-video bg-muted relative">
                  <img src={project.images[0]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" onClick={() => openEdit(project)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => {
                      deleteProject(project.id);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="p-4 flex-grow">
                  <CardTitle className="text-lg">{project.title[language]}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description[language]}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        project={editingProject} 
      />
    </div>
  );
}

function ProjectDialog({ open, onOpenChange, project }: { open: boolean, onOpenChange: (open: boolean) => void, project: Project | null }) {
  const { addProject, updateProject, language } = useApp();
  const { toast } = useToast();
  
  const key = project ? project.id : 'new';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project 
              ? (language === 'ar' ? 'تعديل المشروع' : 'Edit Project') 
              : (language === 'ar' ? 'إضافة مشروع' : 'Add Project')}
          </DialogTitle>
        </DialogHeader>
        <ProjectForm 
          key={key}
          initialData={project} 
          onSave={(data) => {
            if (project) {
              updateProject(project.id, data);
              toast({ title: 'Project Updated' });
            } else {
              addProject(data);
              toast({ title: 'Project Added' });
            }
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}

function ProjectForm({ initialData, onSave }: { initialData: Project | null, onSave: (data: any) => void }) {
  const [data, setData] = useState({
    title: initialData?.title || { ar: '', en: '' },
    description: initialData?.description || { ar: '', en: '' },
    category: initialData?.category || { ar: '', en: '' },
    images: initialData?.images || ['']
  });
  
  const { language } = useApp();

  const addImage = () => {
    setData({...data, images: [...data.images, '']});
  };

  const updateImage = (index: number, val: string) => {
    const newImages = [...data.images];
    newImages[index] = val;
    setData({...data, images: newImages.filter(img => img.trim() !== '')});
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    setData({...data, images: newImages.length === 0 ? [''] : newImages});
  };

  const handleSave = () => {
    const validImages = data.images.filter(img => img.trim() !== '');
    
    if (!data.title.ar.trim() || !data.title.en.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال عنوان المشروع' : 'Please enter project title');
      return;
    }

    if (validImages.length === 0) {
      alert(language === 'ar' ? 'الرجاء إضافة صورة واحدة على الأقل' : 'Please add at least one image');
      return;
    }

    onSave({
      ...data,
      images: validImages
    });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title (Arabic)</Label>
          <Input value={data.title.ar} onChange={e => setData({...data, title: {...data.title, ar: e.target.value}})} dir="rtl" placeholder="العنوان بالعربية" />
        </div>
        <div className="space-y-2">
          <Label>Title (English)</Label>
          <Input value={data.title.en} onChange={e => setData({...data, title: {...data.title, en: e.target.value}})} placeholder="Title in English" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category (Arabic)</Label>
          <Input value={data.category.ar} onChange={e => setData({...data, category: {...data.category, ar: e.target.value}})} dir="rtl" placeholder="التصنيف" />
        </div>
        <div className="space-y-2">
          <Label>Category (English)</Label>
          <Input value={data.category.en} onChange={e => setData({...data, category: {...data.category, en: e.target.value}})} placeholder="Category" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description (Arabic)</Label>
        <Textarea value={data.description.ar} onChange={e => setData({...data, description: {...data.description, ar: e.target.value}})} dir="rtl" placeholder="الوصف بالعربية" className="min-h-[80px]" />
      </div>
      <div className="space-y-2">
        <Label>Description (English)</Label>
        <Textarea value={data.description.en} onChange={e => setData({...data, description: {...data.description, en: e.target.value}})} placeholder="Description in English" className="min-h-[80px]" />
      </div>

      <div className="space-y-2">
        <Label>Images ({data.images.filter(img => img.trim()).length})</Label>
        <div className="space-y-2">
          {data.images.map((url, idx) => (
            <div key={idx} className="flex gap-2">
              <Input 
                value={url} 
                onChange={(e) => updateImage(idx, e.target.value)} 
                placeholder="https://example.com/image.jpg"
              />
              <Button variant="ghost" size="icon" onClick={() => removeImage(idx)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addImage} className="w-full gap-2">
            <Plus className="w-3 h-3" /> {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
          </Button>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        {language === 'ar' ? 'حفظ المشروع' : 'Save Project'}
      </Button>
    </div>
  );
}

function SecurityTab() {
  const { changePassword, language } = useApp();
  const { toast } = useToast();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!oldPassword.trim()) {
      alert(language === 'ar' ? 'أدخل كلمة المرور الحالية' : 'Enter current password');
      return;
    }
    if (!newPassword.trim()) {
      alert(language === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Enter new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if ((changePassword as any)(oldPassword, newPassword)) {
      toast({ title: language === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed successfully' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast({ variant: 'destructive', title: language === 'ar' ? 'كلمة المرور الحالية غير صحيحة' : 'Current password is incorrect' });
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' ? 'قم بتحديث كلمة المرور الخاصة بك' : 'Update your admin password'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</Label>
          <Input 
            type="password" 
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-2">
          <Label>{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
          <Input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-2">
          <Label>{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
          <Input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button onClick={handleChangePassword} className="w-full">
          {language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
        </Button>
      </CardContent>
    </Card>
  );
}
