'use client';

import HeroSection from '../components/heroSection';
import FrameCatalog from '../components/frameCatalog';
import LensCatalog from '../components/lensCatalog';
import CustomerReviews from '../components/customerReviews';
import LensWizardModal from '../components/lensWizardModal';
import { Frame } from '@/shared/types/database';
import HomeLayout from '@/shared/ui/homeLayout';

interface Props {
  frames: Frame[];
}

export default function HomeContainer({ frames }: Props) {
  return (
    <HomeLayout>
      <HeroSection />
      <FrameCatalog frames={frames} />
      <LensCatalog />
      <CustomerReviews />
      <LensWizardModal />
    </HomeLayout>
  );
}