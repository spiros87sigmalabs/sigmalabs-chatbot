export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="https://sigmalabs.gr/nl/logo.png" // Replace this path with your actual image path
              alt="Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              SigmaLabs
            </div>
          </div>

          {/* Navigation for larger screens */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="#services" className="text-sm text-muted-foreground hover:text-brand-primary transition-colors">
              Services
            </a>
            <a href="#process" className="text-sm text-muted-foreground hover:text-brand-primary transition-colors">
              Process
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-brand-primary transition-colors">
              Testimonials
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
