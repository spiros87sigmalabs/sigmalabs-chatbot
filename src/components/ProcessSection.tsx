const processSteps = [
  { title: "Planning", description: "Strategic roadmap and requirements analysis" },
  { title: "Development", description: "Agile development with continuous delivery" },
  { title: "Testing", description: "Comprehensive QA and security testing" },
  { title: "Launch", description: "Deployment and ongoing support" }
];

export const ProcessSection = () => {
  return (
    <section id="process" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            How We Work
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground mb-6 sm:mb-8">
            Our Adaptive Delivery Process
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 sm:top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent transform -translate-x-6 sm:-translate-x-8"></div>
                )}
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{step.title}</h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-2">{step.description}</p>
            </div>
          ))}
        </div>
        
        
      </div>
    </section>
  );
};