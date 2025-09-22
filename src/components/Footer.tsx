import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/username',
      label: 'GitHub'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/in/username',
      label: 'LinkedIn'
    },
    {
      icon: Twitter,
      href: 'https://twitter.com/username',
      label: 'Twitter'
    },
    {
      icon: Mail,
      href: 'mailto:hello@devportfolio.com',
      label: 'Email'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative py-16 bg-gradient-to-t from-card/50 to-background border-t border-border/50">
      <div className="section-padding container-width">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg glow-effect"></div>
              <span className="text-xl font-bold glow-text">DevPortfolio</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Full-stack developer and digital innovator creating exceptional web experiences 
              with cutting-edge technology and creative design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-accent transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Let's Connect</h3>
            <p className="text-muted-foreground">
              Ready to start your next project? Get in touch!
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-card/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:text-primary"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm flex items-center">
            © {currentYear} DevPortfolio. All rights reserved. Made with{' '}
            <Heart className="w-4 h-4 mx-1 text-red-400 fill-current" />
            and lots of caffeine.
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <button className="hover:text-accent transition-colors duration-200">
              Privacy Policy
            </button>
            <button className="hover:text-accent transition-colors duration-200">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-1 h-1 bg-primary rounded-full animate-float opacity-40"></div>
        <div className="absolute bottom-10 right-1/4 w-0.5 h-0.5 bg-accent rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-5 left-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-float opacity-30" style={{ animationDelay: '2s' }}></div>
      </div>
    </footer>
  );
};

export default Footer;