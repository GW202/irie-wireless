'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import IrieLayer from '@/components/landing/IrieLayer';
import HowItWorks from '@/components/landing/HowItWorks';
import Capabilities from '@/components/landing/Capabilities';
import MetricsStrip from '@/components/landing/MetricsStrip';
import FutureState from '@/components/landing/FutureState';
import StructureClarity from '@/components/landing/StructureClarity';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';
import ContactModal from '@/components/landing/ContactModal';

const ConstellationBg = dynamic(() => import('@/components/landing/ConstellationBg'), {
  ssr: false,
});
const GlobalVision = dynamic(() => import('@/components/landing/GlobalVision'), {
  ssr: false,
});

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalDismissedRef = useRef(false);
  const modalShownRef = useRef(false);

  const openModal = useCallback(() => {
    setModalOpen(true);
    modalShownRef.current = true;
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    modalDismissedRef.current = true;
  }, []);

  const triggerModalOnce = useCallback(() => {
    if (!modalShownRef.current && !modalDismissedRef.current) {
      openModal();
    }
  }, [openModal]);

  // Auto-trigger: 10-second timer
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerModalOnce();
    }, 10000);
    return () => clearTimeout(timer);
  }, [triggerModalOnce]);

  // Auto-trigger: scroll past "How It Works" section
  useEffect(() => {
    const section = document.getElementById('how');
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          triggerModalOnce();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [triggerModalOnce]);

  return (
    <>
      <ConstellationBg />
      <div className="relative z-[1]">
        <Navbar onContactClick={openModal} />
        <Hero onContactClick={openModal} />
        <ProblemSection />
        <IrieLayer />
        <HowItWorks />
        <Capabilities />
        <MetricsStrip />
        <GlobalVision />
        <FutureState />
        <StructureClarity />
        <FinalCTA onContactClick={openModal} />
        <Footer />
      </div>
      <ContactModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
