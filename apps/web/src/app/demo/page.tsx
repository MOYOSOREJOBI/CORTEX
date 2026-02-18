/**
 * Demo page — "/demo"
 * Renders the glassmorphism DemoDashboard component.
 * This is the centerpiece of the CORTEX portfolio project.
 */

import type { Metadata } from 'next';
import DemoDashboard from '@/components/DemoDashboard';

export const metadata: Metadata = {
  title: 'Dashboard Demo — CORTEX',
  description: 'Interactive glassmorphism dashboard showcasing the CORTEX AI memory system.',
};

export default function DemoPage() {
  return <DemoDashboard />;
}
