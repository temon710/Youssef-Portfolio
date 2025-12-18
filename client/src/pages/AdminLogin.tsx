import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [password, setPassword] = useState('');
  const { login, language } = useApp();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({
        title: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login Successful',
        description: language === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Welcome to the dashboard',
      });
      setLocation('/admin');
    } else {
      toast({
        variant: "destructive",
        title: language === 'ar' ? 'خطأ في الدخول' : 'Login Failed',
        description: language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8 pt-10">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground text-sm">
            Please enter your password to access the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password (admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-center text-lg tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base">
              {language === 'ar' ? 'دخول' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pb-8">
          <Button variant="link" onClick={() => setLocation('/')} className="text-muted-foreground">
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
