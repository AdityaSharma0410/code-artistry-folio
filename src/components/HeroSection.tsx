import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroImage from '../assets/hero-programmer.jpg';

const HeroSection = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show starry background for 3 seconds, then fade in hero content
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setIsVisible(true), 500);
    }, 3000);

    return () => clearTimeout(introTimer);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-20 bg-background/30 backdrop-blur-sm transition-opacity duration-1000"></div>
      )}

      {/* Background Image */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${showIntro ? 'opacity-30' : 'opacity-100'}`}>
        <img 
          src={heroImage}
          alt="Developer programming in dark environment"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
      </div>

      {/* Spotlight Effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1/2 hero-glow opacity-40"></div>

      {/* Content */}
      <div className={`relative z-10 text-center section-padding container-width transition-all duration-1000 transform ${
        showIntro ? 'translate-y-10 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}>
        <div className={`transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="hero-text mb-6 glow-text">
            Full-Stack Developer &<br />
            <span className="tech-gradient bg-clip-text text-transparent">
              Digital Innovator
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The best way to know my capabilities as a programmer is to{' '}
            <span className="text-accent font-semibold">scroll down</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary/80 hover:bg-primary/90 backdrop-blur-md border border-white/10 shadow-lg px-8 py-4 text-lg"
              onClick={scrollToAbout}
            >
              Discover My Work
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 bg-white/10 text-accent hover:bg-white/20 hover:text-accent-foreground backdrop-blur-md px-8 py-4 text-lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
          isVisible && !showIntro ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <button 
            onClick={scrollToAbout}
            className="flex flex-col items-center text-muted-foreground hover:text-accent transition-colors duration-200"
            aria-label="Scroll to about section"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Floating Tech Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-accent rounded-full animate-float opacity-80" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default HeroSection;