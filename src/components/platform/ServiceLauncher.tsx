'use client';

import { PLATFORM_SERVICES } from '@/lib/services';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';
import ServiceCard from './ServiceCard';

export default function ServiceLauncher() {
  const { isServiceEnabled } = useTenant();
  const { checkPermission } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {PLATFORM_SERVICES.map((service) => {
        const enabled = isServiceEnabled(service.slug) && checkPermission(service.requiredPermission);
        return <ServiceCard key={service.slug} service={service} enabled={enabled} />;
      })}
    </div>
  );
}
