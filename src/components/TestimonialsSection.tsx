import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Christos Pavlidis",
    title: "CTO at Yolo88 Car Leasing",
    content: "SigmaLabs transformed our leasing experience with an AI support agent boosting satisfaction by 40%. Their chatbot handles contracts, answers FAQs, and guides customers effortlessly.",
    avatar: "/api/placeholder/64/64",
    initials: "CP"
  },
  {
    name: "Kostas Charalabidis", 
    title: "CEO at SKINNERA DEVELOPMENT",
    content: "Partnering with Sigma Labs transformed our operations. Their platform helped us scale rapidly while keeping our client and funding workflows seamless. The intuitive design and real-time features are exactly what we needed",
    avatar: "/api/placeholder/64/64",
    initials: "KC"
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Trusted by Innovative Companies
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 border-border/50 hover:shadow-card transition-all duration-300 hover:border-brand-primary/30">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-primary text-white text-sm sm:text-lg font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-foreground text-base sm:text-lg leading-tight">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">{testimonial.title}</p>
                  </div>
                </div>
                <blockquote className="text-foreground leading-relaxed italic text-sm sm:text-base">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};