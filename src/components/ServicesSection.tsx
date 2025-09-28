import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Palette, Brain, Database, Globe, Zap, ArrowRight } from 'lucide-react';

const ServicesSection = () => {
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

  const services = [
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "Complete web applications built from concept to deployment with modern technologies and scalable architecture.",
      features: ["React & Next.js", "Node.js & Express", "Database Design", "API Development", "Cloud Deployment"],
      price: "From $2,500",
      popular: false
    },
    {
      icon: Brain,
      title: "AI Integration & Development",
      description: "Cutting-edge AI solutions including machine learning models, neural networks, and intelligent automation systems.",
      features: ["Machine Learning", "Neural Networks", "NLP Solutions", "Computer Vision", "AI Chatbots"],
      price: "From $3,500",
      popular: true
    },
    {
      icon: Palette,
      title: "UI/UX Design & Development",
      description: "Beautiful, intuitive interfaces that engage users and drive conversions with pixel-perfect implementation.",
      features: ["User Research", "Wireframing", "Prototype Design", "Responsive Design", "Accessibility"],
      price: "From $1,800",
      popular: false
    },
    {
      icon: Database,
      title: "Database Architecture",
      description: "Robust database solutions designed for performance, scalability, and data integrity across complex systems.",
      features: ["Database Design", "Performance Optimization", "Data Migration", "Security Implementation", "Backup Solutions"],
      price: "From $2,000",
      popular: false
    },
    {
      icon: Globe,
      title: "DevOps & Cloud Solutions",
      description: "Complete infrastructure setup with automated deployment, monitoring, and scaling for modern applications.",
      features: ["CI/CD Pipelines", "Cloud Architecture", "Container Orchestration", "Monitoring Setup", "Security Hardening"],
      price: "From $2,800",
      popular: false
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Comprehensive application optimization to achieve lightning-fast load times and exceptional user experience.",
      features: ["Code Optimization", "Database Tuning", "Caching Strategies", "CDN Setup", "Core Web Vitals"],
      price: "From $1,500",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechStart Inc.",
      content: "Exceptional work on our AI-powered analytics platform. The neural network implementation exceeded our expectations.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Founder, DataFlow Solutions",
      content: "Outstanding full-stack development skills. Delivered a complex e-commerce platform ahead of schedule.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager, InnovateLab",
      content: "The UI/UX design work was phenomenal. Our user engagement increased by 300% after the redesign.",
      rating: 5
    }
  ];

  return (
    <section ref={sectionRef} id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-background/60 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 section-padding container-width">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            Professional <span className="tech-gradient bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive solutions that combine technical expertise with creative innovation
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className={`relative p-6 bg-white/10 backdrop-blur-md border-white/15 hover:border-white/25 shadow-lg transition-all duration-500 transform hover:scale-105 group ${
                  service.popular ? 'border-accent ring-2 ring-accent/20' : ''
                } ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: isVisible ? `${index * 0.1}s` : '0s' }}
              >
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-6 glow-effect group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-200">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-lg font-bold text-accent">{service.price}</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-primary hover:text-accent group-hover:translate-x-1 transition-all duration-200"
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className={`transition-all duration-1000 delay-800 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 glow-text">
            What Clients Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="p-6 bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-accent rounded-full mr-1"></div>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center transition-all duration-1000 delay-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how we can bring your vision to life with cutting-edge technology and exceptional design.
          </p>
          <Button 
            size="lg"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-effect px-8 py-4 text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;