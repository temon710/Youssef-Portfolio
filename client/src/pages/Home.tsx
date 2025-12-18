import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/ui/Hero';
import { PortfolioGrid } from '@/components/ui/PortfolioGrid';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <PortfolioGrid />
      </main>
      <Footer />
    </div>
  );
}
