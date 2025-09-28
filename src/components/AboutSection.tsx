import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Code, Database, Zap, Cpu, Globe } from 'lucide-react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const capabilities = [
    {
      icon: Brain,
      title: "Neural Networks",
      description: "AI-driven software development with machine learning integration",
      delay: "0s"
    },
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "React, Node.js, Java, and modern web technologies",
      delay: "0.2s"
    },
    {
      icon: Database,
      title: "Database Architecture",
      description: "RDBMS design, optimization, and data modeling",
      delay: "0.4s"
    },
    {
      icon: Zap,
      title: "Prompt Engineering",
      description: "Advanced AI prompt design and LLM integration",
      delay: "0.6s"
    },
    {
      icon: Cpu,
      title: "System Architecture",
      description: "Scalable solutions with complex mathematical modeling",
      delay: "0.8s"
    },
    {
      icon: Globe,
      title: "Web Innovation",
      description: "Cutting-edge web applications with modern frameworks",
      delay: "1s"
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-background/60 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 section-padding container-width">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 glow-text">
            I offer the mind of a{' '}
            <span className="tech-gradient bg-clip-text text-transparent">Graduate</span>
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            that works like an <span className="text-primary font-semibold">engineer</span> and yet has the imagination of an{' '}
            <span className="text-accent font-semibold">astrophysicist</span>.
            <br />
            I think like a <span className="text-purple-400 font-semibold">child</span>, but express like an{' '}
            <span className="text-emerald-400 font-semibold">adult</span>.
          </p>
        </div>

        {/* 3D Tech Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card 
                key={index}
                className={`p-6 bg-white/15 backdrop-blur-md border-white/20 hover:border-white/30 shadow-xl hover:shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-500 transform hover:scale-105 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ 
                  transitionDelay: isVisible ? capability.delay : '0s',
                  animationDelay: capability.delay 
                }}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 mx-auto glow-effect">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-foreground">
                  {capability.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {capability.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <p className="text-xl text-muted-foreground mb-8">
            Ready to see these capabilities in action?
          </p>
          <Button 
            size="lg"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-effect px-8 py-4 text-lg"
          >
            View My Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;