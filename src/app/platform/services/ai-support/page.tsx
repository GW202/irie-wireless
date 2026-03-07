'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import {
  Bot,
  MessageSquare,
  Search,
  Lightbulb,
  HelpCircle,
  AlertCircle,
  Clock,
  BrainCircuit,
} from 'lucide-react';

const AI_MODULES = [
  { icon: Search, label: 'Knowledge Retrieval', description: 'AI-powered search across platform documentation, carrier specs, and operational data' },
  { icon: BrainCircuit, label: 'Automated Troubleshooting', description: 'Intelligent diagnosis of connectivity, provisioning, and billing issues' },
  { icon: Lightbulb, label: 'Predictive Recommendations', description: 'Proactive suggestions for plan optimization, churn prevention, and capacity' },
  { icon: HelpCircle, label: 'Question Answering', description: 'Natural language interface for operational queries and data exploration' },
  { icon: AlertCircle, label: 'Incident Explanation', description: 'AI-generated root cause analysis and incident summaries' },
  { icon: MessageSquare, label: 'Chat Interface', description: 'Conversational AI assistant for telecom operations support' },
];

export default function AISupportPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
            <Bot size={20} className="text-accent-purple" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Support</h1>
            <p className="text-text-3 text-xs">AI Assistant for Telecom Operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-bg-4 text-text-3 rounded">
            <Clock size={10} /> v0.7.0
          </span>
          <span className="text-[10px] font-mono px-2 py-1 bg-accent-purple/10 text-accent-purple rounded">BETA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_MODULES.map((mod) => (
          <Card key={mod.label}>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                  <mod.icon size={16} className="text-accent-purple" />
                </div>
                <div>
                  <h3 className="text-xs font-bold mb-0.5">{mod.label}</h3>
                  <p className="text-[11px] text-text-3 leading-relaxed">{mod.description}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Chat Placeholder */}
      <Card>
        <CardHeader>
          <MessageSquare size={16} className="text-accent-purple" />
          AI Assistant
        </CardHeader>
        <CardBody className="p-0">
          <div className="h-64 flex flex-col">
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <Bot size={40} className="text-text-3 mx-auto mb-3" />
                <p className="text-sm text-text-2">AI Support Assistant</p>
                <p className="text-xs text-text-3 mt-1">Chat interface coming in beta release</p>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-bg-3 border border-border rounded-lg px-4 py-2 text-sm outline-none placeholder:text-text-3 text-text-1 opacity-50 cursor-not-allowed"
                  placeholder="Ask about your telecom operations..."
                  disabled
                />
                <button className="px-4 py-2 bg-accent-purple/10 text-accent-purple rounded-lg text-sm font-medium opacity-50 cursor-not-allowed" disabled>
                  Send
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
