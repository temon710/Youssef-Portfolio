import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const { userData, language } = useApp();
  const isRTL = language === 'ar';

  return (
    <section className="min-h-[80vh] flex items-center justify-center pt-20 pb-10 overflow-hidden relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="container px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center md:text-start"
        >
          <div className="space-y-2">
            <h2 className="text-primary font-medium text-lg tracking-wide uppercase">
              {language === 'ar' ? 'مرحباً، أنا' : 'Hello, I am'}
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Youssef <span className="text-primary">Elnasry</span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0">
            {userData.bio[language]}
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button size="lg" className="gap-2 text-lg h-12 px-8 rounded-full shadow-lg shadow-primary/20" onClick={() => window.open(`https://wa.me/${userData.phone.replace(/\D/g,'')}`, '_blank')}>
              <MessageCircle className="w-5 h-5" />
              {language === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-lg h-12 px-8 rounded-full" onClick={() => window.open(`tel:${userData.phone}`, '_self')}>
              <Phone className="w-5 h-5" />
              {language === 'ar' ? 'اتصل بي' : 'Call Me'}
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex justify-center"
        >
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <img 
              src={userData.profileImage} 
              alt="Profile" 
              className="relative w-full h-full object-cover rounded-full border-8 border-background shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
