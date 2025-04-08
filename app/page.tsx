'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { MainNav } from '@/components/layout/MainNav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-0"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Ultimate University Companion
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with fellow students, access resources, track applications, and navigate university life with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!loading && !user ? (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/signup">Join UniFriend</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/resources">Explore Resources</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/hero-illustration.svg" 
                alt="Students collaborating" 
                className="w-full h-auto rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=UniFriend";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need for University Success</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              UniFriend brings together all the tools and resources you need to thrive in your academic journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>}
              title="Study Resources"
              description="Access and share study materials, notes, past papers, and more."
              link="/resources"
            />
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>}
              title="Application Tracking"
              description="Keep track of your university and NSFAS applications in one place."
              link="/applications"
            />
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>}
              title="Community Forum"
              description="Ask questions, share advice, and connect with fellow students."
              link="/forum"
            />
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
              title="Mentorship"
              description="Connect with experienced students for guidance and support."
              link="/mentorship"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Students Say</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Hear from students who have transformed their university experience with UniFriend.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="UniFriend helped me connect with seniors who guided me through my first year. The resources section saved me during exams!"
              author="Thabo M."
              role="First Year Student"
              university="University of Cape Town"
            />
            <TestimonialCard 
              quote="The NSFAS application support was invaluable. I wouldn't have managed to complete my funding application without UniFriend's guidance."
              author="Lerato K."
              role="Second Year Student"
              university="University of Johannesburg"
            />
            <TestimonialCard 
              quote="As an international student, UniFriend made it easy to find accommodation and connect with local students. The community here is amazing!"
              author="Mohammed A."
              role="Masters Student"
              university="Stellenbosch University"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your University Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of South African students already using UniFriend to navigate university life with confidence.
          </p>
          {!loading && !user ? (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Get Started Today</Link>
            </Button>
          ) : (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">Go to Your Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="UniFriend Logo" className="h-8 w-auto" />
                <span className="font-bold">UniFriend</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your ultimate companion for navigating university life in South Africa.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/resources" className="text-muted-foreground hover:text-foreground">Resources</Link></li>
                <li><Link href="/forum" className="text-muted-foreground hover:text-foreground">Forum</Link></li>
                <li><Link href="/events" className="text-muted-foreground hover:text-foreground">Events</Link></li>
                <li><Link href="/mentorship" className="text-muted-foreground hover:text-foreground">Mentorship</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQs</Link></li>
                <li><Link href="/feedback" className="text-muted-foreground hover:text-foreground">Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} UniFriend. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border transition-all hover:shadow-md">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button variant="link" className="p-0" asChild>
        <Link href={link}>Learn more →</Link>
      </Button>
    </div>
  );
}

function TestimonialCard({ quote, author, role, university }: { quote: string, author: string, role: string, university: string }) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="mb-4 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
      </div>
      <p className="mb-4 text-muted-foreground">{quote}</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}, {university}</p>
      </div>
    </div>
  );
}
