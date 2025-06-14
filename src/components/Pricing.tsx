
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with your learning journey",
      icon: Star,
      features: [
        "3 AI-generated roadmaps per month",
        "Basic progress tracking",
        "Community support",
        "Access to curated resources",
        "Weekly email tips",
        "Basic skill assessments",
        "Public roadmap sharing",
        "Mobile responsive design"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Unlock your full learning potential with premium features",
      icon: Crown,
      features: [
        "Unlimited AI-generated roadmaps",
        "Advanced progress analytics",
        "Priority support & live chat",
        "Personalized mentor matching",
        "Custom learning schedules",
        "Offline roadmap access",
        "Integration with learning platforms",
        "Achievement certificates"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true
    }
  ];

  return (
    <div className="py-20 px-6 min-h-screen flex items-center">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            Choose Your Learning Path
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start free and upgrade when you're ready to accelerate your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 h-full flex flex-col ${
                  plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${
                    plan.popular ? 'from-purple-500 to-pink-500' : 'from-gray-600 to-gray-700'
                  } p-4 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-gray-300 text-center">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full font-semibold text-lg py-6 rounded-xl transition-all duration-300 hover:scale-105 mt-auto ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25' 
                        : 'border-2 border-white/40 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm bg-white/5'
                    }`}
                  >
                    {plan.popular && <Zap className="mr-2 w-5 h-5" />}
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Trusted by 50,000+ learners worldwide</p>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-white ml-2 font-semibold">4.9/5 from 2,000+ reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
