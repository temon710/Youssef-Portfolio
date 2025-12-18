import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

export function Navbar() {
  const { theme, toggleTheme, language, setLanguage, isAuthenticated, logout } = useApp();
  const [location] = useLocation();

  const isRTL = language === 'ar';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Youssef Elnasry
          </a>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                <LayoutDashboard className="w-4 h-4" />
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </Button>
            </Link>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <span className="font-bold text-sm">{language === 'ar' ? 'EN' : 'ع'}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {isAuthenticated ? (
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="w-5 h-5 text-destructive" />
            </Button>
          ) : (
             <Link href="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <LogIn className="w-5 h-5" />
              </Button>
             </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
