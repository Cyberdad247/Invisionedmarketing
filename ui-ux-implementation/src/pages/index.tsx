import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import SubscriptionPlans from '../components/landing/SubscriptionPlans';
import TokenPackages from '../components/landing/TokenPackages';
import TestimonialCarousel from '../components/landing/TestimonialCarousel';
import TrustElements from '../components/landing/TrustElements';
import InteractiveAgentBuilder from '../components/landing/InteractiveAgentBuilder';
import AgentBuildingProcess from '../components/landing/AgentBuildingProcess';
import CallToAction from '../components/landing/CallToAction';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <SubscriptionPlans />
        <TokenPackages />
        <TestimonialCarousel />
        <TrustElements />
        <InteractiveAgentBuilder />
        <AgentBuildingProcess />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
