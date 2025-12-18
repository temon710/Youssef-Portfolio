import { useApp } from '@/context/AppContext';

export function Footer() {
  const { language } = useApp();
  
  return (
    <footer className="py-8 border-t border-border/50 bg-background">
      <div className="container px-4 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Youssef Elnasry. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}
