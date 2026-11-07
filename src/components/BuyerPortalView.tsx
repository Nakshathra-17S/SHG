import React, { useState } from 'react';
import { ProductionOrder, Language } from '../types';
import { translations } from '../utils/i18n';
import { 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Award, 
  Copy, 
  Check, 
  FileBadge 
} from 'lucide-react';

interface BuyerPortalViewProps {
  orders: ProductionOrder[];
  selectedOrderId: string;
  onSelectOrderId: (orderId: string) => void;
  lang: Language;
}

export const BuyerPortalView: React.FC<BuyerPortalViewProps> = ({
  orders,
  selectedOrderId,
  onSelectOrderId,
  lang,
}) => {
  const t = translations[lang];
  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const [copied, setCopied] = useState(false);

  const handleShareLink = () => {
    const fakeAuditUrl = `https://shgflow.org/audit/${currentOrder.id}?hash=8f9a2b71c`;
    navigator.clipboard?.writeText(fakeAuditUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const defectRate = 1.2;
  const onTimeConfidence = 99.1;
  const ethicalPassThrough = 100;

  return (
    <div className="space-y-6">
      {/* Top Buyer SLA Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-600 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>External Buyer Trust & Verification SLA Portal</span>
              <span className="text-stone-400">·</span>
              <span>ISO & FairTrade Compliance</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Contract Milestone Audit: {currentOrder.buyerName}
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Corporate buyers (e.g. FabIndia, Khadi Bhavan, IKEA) can audit live production progress, optical defect rate benchmarks, and direct artisan piece-rate disbursements without manual follow-up calls.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedOrderId}
              onChange={(e) => onSelectOrderId(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg p-2.5 focus:outline-2 focus:outline-amber-700 cursor-pointer"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} · {o.buyerName}
                </option>
              ))}
            </select>

            <button
              onClick={handleShareLink}
              className="bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : t.shareReport}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pillars for Buyers */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
              Batch Defect Rate (Optical Edge QC)
            </span>
            <div className="text-2xl font-bold text-emerald-800 mt-1">
              {defectRate}%
            </div>
            <div className="text-xs text-stone-600 mt-0.5">
              Industry tolerance standard: &lt; 4.0%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
              Dispatch On-Time SLA Confidence
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1">
              {onTimeConfidence}%
            </div>
            <div className="text-xs text-stone-600 mt-0.5">
              {currentOrder.deadlineDays} days remaining with 3-day buffer
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
              Ethical Wage Direct Pass-Through
            </span>
            <div className="text-2xl font-bold text-amber-900 mt-1">
              {ethicalPassThrough}%
            </div>
            <div className="text-xs text-stone-600 mt-0.5">
              Zero middlemen deductions. Direct DBT passbook
            </div>
          </div>
        </div>

        {/* Live Cryptographic Milestone Proof Trail */}
        <div className="border border-stone-200 rounded-xl p-5 bg-stone-50/50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-stone-900 text-sm">
              Live Production Milestones for {currentOrder.id} ({currentOrder.product})
            </h4>
            <span className="text-xs text-stone-600 font-mono">
              Traceability Hash: SHA256:4a8f...92d1
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3 text-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-stone-900">
                    Raw Material Inward: Bagalkote Ilkal Yarn & Dharwad Khadi Check
                  </span>
                  <span className="text-stone-600 font-mono">2026-11-01 · 09:30 AM</span>
                </div>
                <p className="text-stone-600 mt-0.5">
                  100% natural Ilkal 80s count yarn tested. Pre-shrinkage certified by Karnataka Textile Dept.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-stone-900">
                    Sanjeevini CWFA Work Allocation across 8 Karnataka Artisans
                  </span>
                  <span className="text-stone-600 font-mono">2026-11-02 · 11:15 AM</span>
                </div>
                <p className="text-stone-600 mt-0.5">
                  Dynamic split across Dharwad & Bagalkote women with verified domestic capacity matrix (Gini 0.08).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                ↻
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-stone-900">
                    In-Line Production & Mandarin Collar Seam Assembly ({currentOrder.completedUnits} / {currentOrder.totalUnits} units)
                  </span>
                  <span className="text-amber-900 font-semibold">In Progress (80%)</span>
                </div>
                <p className="text-stone-600 mt-0.5">
                  Edge computer vision inspection running at individual stations with zero penalty rework guarantee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs opacity-75">
              <span className="w-6 h-6 rounded-full bg-stone-300 text-stone-600 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                ○
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-stone-700">
                    Consolidated Export Packaging & Batch RFID Tagging
                  </span>
                  <span className="text-stone-500">Scheduled in 2 days</span>
                </div>
                <p className="text-stone-500 mt-0.5">
                  Pre-dispatch final sample audit before logistic pickup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
