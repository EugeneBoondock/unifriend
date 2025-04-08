import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-background border-t py-12", className)}>
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
              <li><a href="/resources" className="text-muted-foreground hover:text-foreground">Resources</a></li>
              <li><a href="/forum" className="text-muted-foreground hover:text-foreground">Forum</a></li>
              <li><a href="/events" className="text-muted-foreground hover:text-foreground">Events</a></li>
              <li><a href="/mentorship" className="text-muted-foreground hover:text-foreground">Mentorship</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
              <li><a href="/faq" className="text-muted-foreground hover:text-foreground">FAQs</a></li>
              <li><a href="/feedback" className="text-muted-foreground hover:text-foreground">Feedback</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              <li><a href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href="/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UniFriend. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
