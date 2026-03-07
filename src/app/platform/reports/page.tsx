'use client';

import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { FileText, Download, Calendar, Clock } from 'lucide-react';

const REPORTS = [
  { title: 'Monthly Analytics Report - February 2026', type: 'Analytics', date: 'Mar 1, 2026', status: 'Ready' },
  { title: 'Weekly Intelligence Brief - W9 2026', type: 'CarrierPulse', date: 'Mar 3, 2026', status: 'Ready' },
  { title: 'Usage Summary - February 2026', type: 'Usage Engine', date: 'Mar 1, 2026', status: 'Ready' },
  { title: 'Tenant Health Report - Q1 2026', type: 'Platform', date: 'Mar 5, 2026', status: 'Generating' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight mb-1">Reports</h1>
        <p className="text-text-3 text-xs">Scheduled and on-demand reports across all platform services</p>
      </div>

      <div className="space-y-2">
        {REPORTS.map((report, i) => (
          <Card key={i} hover>
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-accent-cyan" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{report.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-3 text-text-3 rounded">{report.type}</span>
                    <span className="text-[10px] text-text-3 flex items-center gap-1"><Calendar size={10} /> {report.date}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${report.status === 'Ready' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-amber/10 text-accent-amber'}`}>
                  {report.status === 'Generating' && <Clock size={10} className="inline mr-1" />}
                  {report.status}
                </span>
                {report.status === 'Ready' && (
                  <button className="text-text-3 hover:text-accent-cyan transition-colors">
                    <Download size={16} />
                  </button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
