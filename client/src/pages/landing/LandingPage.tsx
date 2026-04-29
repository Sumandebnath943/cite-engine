import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { EnginesSection } from './components/EnginesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden cite-page-bg">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <EnginesSection />
      <HowItWorksSection />
      <PricingSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
