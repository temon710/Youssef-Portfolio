import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PortfolioGrid() {
  const { projects, language } = useApp();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            {language === 'ar' ? 'أعمالي المميزة' : 'Featured Projects'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'مجموعة مختارة من المشاريع التي قمت بتنفيذها مؤخراً.' 
              : 'A curated selection of projects I have recently worked on.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-card">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={project.images[0]} 
                    alt={project.title[language]} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm">
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </span>
                  </div>
                </div>
                
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {project.category[language]}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold line-clamp-1">{project.title[language]}</h3>
                </CardHeader>
                
                <CardContent className="p-6 pt-2 flex-grow">
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {project.description[language]}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
