"use client";

import { BookOpen, Users, Target, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Expert Tutors",
      description: "Verified professionals across various subjects and skills",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Personalized Learning",
      description: "One-on-one sessions tailored to your learning style",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Flexible Scheduling",
      description: "Learn at your own pace with flexible time slots",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Verified Results",
      description: "Track your progress with measurable outcomes",
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    }
  ];

  const stats = [
    { value: "500+", label: "Expert Tutors" },
    { value: "10,000+", label: "Students Taught" },
    { value: "50+", label: "Subjects Covered" },
    { value: "4.9/5", label: "Average Rating" }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-1" variant="secondary">
            About SkillBridge
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in">
            Bridging the Gap Between <span className="text-primary">Learners</span> and <span className="text-primary">Experts</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            SkillBridge is a revolutionary platform that connects passionate learners with expert tutors across various disciplines. 
            We believe in making quality education accessible, personalized, and effective for everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full border hover:shadow-lg transition-shadow hover:scale-[1.02] transition-transform duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full ${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-16 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slide-in-left">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              To democratize quality education by creating meaningful connections between learners and educators. 
              We strive to break down barriers to learning and empower individuals to achieve their full potential.
            </p>
            <p className="text-lg text-muted-foreground">
              Through our platform, we aim to create a global community where knowledge sharing becomes seamless, 
              accessible, and rewarding for both students and tutors.
            </p>
          </div>
          
          <div className="animate-slide-in-right">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                To become the world&apos;s most trusted platform for personalized learning, where anyone, anywhere 
                can access the expertise they need to grow personally and professionally.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12 animate-fade-in">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "We maintain the highest standards in tutoring quality and platform experience."
              },
              {
                title: "Accessibility",
                description: "Education should be available to all, regardless of location or background."
              },
              {
                title: "Community",
                description: "We foster supportive relationships between learners and educators."
              }
            ].map((value, index) => (
              <div
                key={value.title}
                className="animate-fade-in-up"
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <div className="bg-card border p-6 rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-primary mb-4">0{index + 1}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
          opacity: 0;
          animation: slideInLeft 0.8s ease-out forwards;
          animation-delay: 0.5s;
        }
        
        .animate-slide-in-right {
          opacity: 0;
          animation: slideInRight 0.8s ease-out forwards;
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default About;