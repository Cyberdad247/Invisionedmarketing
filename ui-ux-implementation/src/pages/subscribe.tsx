import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SubscriptionFlow from '../components/subscription/SubscriptionFlow';

export default function SubscribePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <SubscriptionFlow />
      </main>
      <Footer />
    </div>
  );
}
