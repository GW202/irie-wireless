'use client';

import DemoBanner from '@/components/dashboard/DemoBanner';
import StatCard from '@/components/dashboard/StatCard';
import SubscriberChart from '@/components/dashboard/SubscriberChart';
import CarrierStatus from '@/components/dashboard/CarrierStatus';
import BrandTable from '@/components/dashboard/BrandTable';
import WorkflowEngine from '@/components/dashboard/WorkflowEngine';
import PlanDonut from '@/components/dashboard/PlanDonut';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import PortInMetrics from '@/components/dashboard/PortInMetrics';
import { STAT_CARDS } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <>
      <DemoBanner />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Subscriber Chart + Carrier Status */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-6">
        <SubscriberChart />
        <CarrierStatus />
      </div>

      {/* Brand Table + Workflow Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <BrandTable />
        <div>
          <WorkflowEngine />
          <PlanDonut />
        </div>
      </div>

      {/* Activity Feed + Port-In Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <ActivityFeed />
        <PortInMetrics />
      </div>
    </>
  );
}
