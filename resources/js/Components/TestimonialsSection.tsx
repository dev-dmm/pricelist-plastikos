import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Maria S.",
      procedure: "Rhinoplasty",
      rating: 5,
      text: "Dr. Aesthetics completely transformed my confidence. The staff was professional, caring, and the results exceeded my expectations. I finally feel like myself.",
      before: "Concerned about profile",
      after: "Naturally beautiful result",
    },
    {
      name: "Elena K.",
      procedure: "Breast Augmentation",
      rating: 5,
      text: "The entire process was seamless. From the initial consultation to recovery, I felt supported every step of the way. The natural look is exactly what I wanted.",
      before: "Asymmetry issues",
      after: "Perfectly balanced",
    },
    {
      name: "Sophia D.",
      procedure: "Liposuction",
      rating: 5,
      text: "I'm amazed by the precision and artistry. The team listened to my goals and delivered results that look completely natural. Highly recommend!",
      before: "Stubborn areas",
      after: "Sculpted contours",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Trusted by Our Patients
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Real stories from real people who transformed their lives with us
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`cursor-pointer card-gradient transition-clinic-slow hover:shadow-clinic-lg ${
                  activeIndex === index
                    ? "ring-2 ring-primary shadow-clinic-lg scale-105"
                    : "hover:scale-102"
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.procedure}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                    {testimonial.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Testimonial Detail */}
          <Card className="card-gradient shadow-clinic-lg">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Before/After */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-accent/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        Before
                      </p>
                      <p className="text-foreground font-medium">
                        {testimonials[activeIndex].before}
                      </p>
                    </div>
                    <div className="p-6 bg-primary/10 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        After
                      </p>
                      <p className="text-foreground font-medium">
                        {testimonials[activeIndex].after}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <div className="space-y-4">
                  <div className="flex space-x-1 mb-2">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-foreground leading-relaxed italic">
                    "{testimonials[activeIndex].text}"
                  </blockquote>
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground">
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeIndex].procedure}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-clinic ${
                  activeIndex === index ? "bg-primary w-8" : "bg-secondary hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
