import type { Metadata } from 'next';
import DemoDashboard from '@/components/DemoDashboard';

export const metadata: Metadata = {
  title: 'CORTEX',
  description: 'Intelligent on device memory. Private by design.',
};

export default function HomePage() {
  return <DemoDashboard />;
}
