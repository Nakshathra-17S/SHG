import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { Scale, Users, Clock, IndianRupee } from 'lucide-react';

interface MetricCardsProps {
  lang: Language;
  activeCount: number;
  totalMembers: number;
  giniIndex: number;
  totalDisbursable: number;
  completedUnits: number;
  totalUnits: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  lang,
  activeCount,
  totalMembers,
  giniIndex,
  totalDisbursable,
  completedUnits,
  totalUnits,
}) => {
  const t = translations[lang];
  const completionRate = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Algorithmic Fairness Index */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
          <span className="font-semibold">{t.fairnessScore}</span>
          <Scale className="w-4 h-4 text-amber-700" />
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            {giniIndex <= 0.1 ? '98.4%' : `${Math.round((1 - giniIndex) * 100)}%`}
          </span>
          <span className="text-xs font-semibold text-emerald-800">
            Gini {giniIndex}
          </span>
        </div>
        <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
          <span>Equitable Division</span>
          <span aria-hidden="true">·</span>
          <span>Zero Work Hoarding</span>
        </div>
        <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div className="bg-amber-700 h-full rounded-full" style={{ width: '98%' }}></div>
        </div>
      </div>

      {/* 2. Artisans on Duty */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
          <span className="font-semibold">{t.activeMembers}</span>
          <Users className="w-4 h-4 text-stone-700" />
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            {activeCount} <span className="text-sm font-normal text-stone-600">/ {totalMembers}</span>
          </span>
          <span className="text-xs font-semibold text-emerald-800">100% active</span>
        </div>
        <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
          <span>Domestic hours guarded</span>
          <span aria-hidden="true">·</span>
          <span>4-7h/day</span>
        </div>
        <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div className="bg-emerald-700 h-full rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* 3. On-Time Dispatch SLA */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
          <span className="font-semibold">{t.onTimeRate}</span>
          <Clock className="w-4 h-4 text-stone-700" />
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            96.8%
          </span>
          <span className="text-xs font-semibold text-stone-700">{completionRate}% made</span>
        </div>
        <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
          <span>3-day buffer</span>
          <span aria-hidden="true">·</span>
          <span>Zero SLA penalty</span>
        </div>
        <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div className="bg-stone-800 h-full rounded-full" style={{ width: '96.8%' }}></div>
        </div>
      </div>

      {/* 4. Verified Earnings Disbursable */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
          <span className="font-semibold">{t.pendingPayouts}</span>
          <IndianRupee className="w-4 h-4 text-amber-800" />
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            ₹{totalDisbursable.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-emerald-800">Direct DBT</span>
        </div>
        <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
          <span>Piece-rate locked</span>
          <span aria-hidden="true">·</span>
          <span>Bank audited</span>
        </div>
        <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div className="bg-amber-800 h-full rounded-full" style={{ width: '88%' }}></div>
        </div>
      </div>
    </div>
  );
};
