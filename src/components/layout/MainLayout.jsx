import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import Header from './Header';
import Footer from './Footer';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExitIntentPopup from '@/components/exit-intent/ExitIntentPopup';

export default function MainLayout() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { data: exitIntentPopup } = useQuery({
    queryKey: ['exit-intent-popup'],
    queryFn: () => localClient.settings.getExitIntentPopup(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ExitIntentPopup config={exitIntentPopup} />

      {/* Scroll to top */}
      {showScrollTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="icon"
          className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg w-11 h-11"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
