export const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col space-y-6 sm:space-y-8 md:flex-row md:justify-between md:items-start md:space-y-0">
          <div className="flex flex-col space-y-4 text-center md:text-left">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SigmaLabs
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-sm sm:text-base text-muted-foreground">
              <a href="https://sigmalabs.gr/about" className="hover:text-brand-primary transition-colors">About Us</a>
              <a href="https://sigmalabs.gr/privacy-policy" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
            </div>
          </div>
          
          <div className="text-center md:text-right text-sm sm:text-base text-muted-foreground">
            <p className="leading-relaxed">Greece, Athens • GDPR‑Ready • Enterprise‑Grade Solutions</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
