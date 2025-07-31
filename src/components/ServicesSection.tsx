import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Custom Web Applications",
    subtitle: "Custom Web Applications",
    description: "Scalable platforms tailored to your business logic from B2B portals to SaaS dashboards",
    features: ["Smart automation", "Predictive analytics", "AI Agents", "Recommendation engines"],
    icon: "🌐"
  },
  {
    title: "AI & Machine Learning",
    subtitle: "AI & Machine Learning", 
    description: "Scalable Tech Solutions for European Enterprises",
    features: ["Smart automation", "Predictive analytics", "AI Agents", "Next-level workflows"],
    icon: "🤖"
  },
  {
    title: "FinTech & InsurTech Platforms",
    subtitle: "FinTech & InsurTech Platforms",
    description: "Real-time risk‑scoring & AI‑driven risk engines",
    features: ["GDPR‑compliant customer portals", "Scalable microservices architecture", "Real-time processing"],
    icon: "💳"
  },
  {
    title: "Healthcare & Life Sciences",
    subtitle: "Healthcare & Life Sciences",
    description: "Secure patient portals & telemedicine apps",
    features: ["Clinical dashboards with real-time data", "End-to-end data privacy", "Accessibility compliance"],
    icon: "🏥"
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Services
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-card/50 border-border/50 hover:shadow-card transition-all duration-300 hover:border-brand-primary/30 group"
            >
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm sm:text-base text-muted-foreground">
                      <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};