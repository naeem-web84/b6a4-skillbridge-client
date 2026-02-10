"use client";

import { Facebook, Twitter, Instagram, Linkedin, Youtube, Heart, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { text: "About Us", href: "/about" },
    { text: "Careers", href: "#" },
    { text: "Press", href: "#" },
    { text: "Blog", href: "#" },
  ];

  const legalLinks = [
    { text: "Privacy Policy", href: "#" },
    { text: "Terms of Service", href: "#" },
    { text: "Cookie Policy", href: "#" },
    { text: "GDPR Compliance", href: "#" },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
    { icon: <Youtube className="h-5 w-5" />, label: "YouTube" },
  ];

  const tutorResources = [
    "Teaching Guidelines",
    "Payment Information",
    "Profile Setup",
    "Session Management",
    "Community Forum"
  ];

  const studentResources = [
    "How to Book",
    "Learning Paths",
    "Progress Tracking",
    "Payment Methods",
    "FAQ"
  ];

  return (
    <footer className="bg-background border-t mt-24">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                    <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-xl">
                      S
                    </span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse opacity-75"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">SkillBridge</h2>
                <p className="text-sm text-muted-foreground">Learn Anything, Anytime</p>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6">
              Connecting passionate learners with expert tutors worldwide. 
              Quality education should be accessible to everyone.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 hover:scale-105 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.text}>
                  <Link href={link.href}>
                    <div className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 cursor-pointer">
                      {link.text}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">For Tutors</h4>
                <ul className="space-y-2">
                  {tutorResources.map((resource) => (
                    <li key={resource}>
                      <div className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {resource}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">For Students</h4>
                <ul className="space-y-2">
                  {studentResources.map((resource) => (
                    <li key={resource}>
                      <div className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {resource}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3 mb-8">
              {legalLinks.map((link) => (
                <li key={link.text}>
                  <div className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {link.text}
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="bg-muted/50 rounded-xl p-4 border">
              <h4 className="font-medium mb-2">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe to our newsletter for updates and tips.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-background rounded-lg border"
                  aria-label="Email for newsletter subscription"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <div className="flex items-center gap-1">
              <span>© {currentYear} SkillBridge. All rights reserved.</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            </div>
            <p className="mt-1">Making education accessible worldwide</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span>Secure Platform</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs">🌐</span>
              </div>
              <span>Available in 50+ countries</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold">SSL</span>
              </div>
              <span className="text-sm">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs">🏆</span>
              </div>
              <span className="text-sm">Verified Tutors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs">🔒</span>
              </div>
              <span className="text-sm">Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;