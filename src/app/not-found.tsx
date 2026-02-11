import Link from 'next/link';
import { Home, Search, ArrowLeft, GraduationCap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center"> 
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-bold text-primary/10 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full animate-pulse" />
              <GraduationCap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 text-primary/40" />
            </div>
          </div>
        </div>
 
        <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
 
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-medium text-card-foreground mb-4 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Looking for something? Try these:
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Find Tutors', 'Browse Subjects', 'How it Works', 'Pricing'].map((text) => (
              <span
                key={text}
                className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
 
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          
          <Link
            href="/tutors"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-input hover:border-primary text-card-foreground hover:text-primary font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Tutors
          </Link>
        </div>
 
        <p className="text-sm text-muted-foreground mt-8">
          Need help?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}