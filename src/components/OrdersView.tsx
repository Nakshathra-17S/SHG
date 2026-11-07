import React, { useState } from 'react';
import { ProductionOrder, Language } from '../types';
import { translations } from '../utils/i18n';
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Scan, 
  FileText 
} from 'lucide-react';

interface OrdersViewProps {
  orders: ProductionOrder[];
  selectedOrderId: string;
  onSelectOrder: (orderId: string) => void;
  onNavigateTab: (tabId: string) => void;
  lang: Language;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onNavigateTab,
  lang,
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'allocated' | 'pending'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return o.status === 'In Progress';
    if (filter === 'allocated') return o.status === 'Allocated';
    if (filter === 'pending') return o.status === 'Pending Allocation';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Active Production Contracts
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Transparent order routing with guaranteed artisan piece rates and deadline SLA protections
          </p>
        </div>

        {/* Functional Filter Buttons */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Contracts ({orders.length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              filter === 'in-progress'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('allocated')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              filter === 'allocated'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Allocated
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {filteredOrders.map((order) => {
          const percent = Math.round((order.completedUnits / (order.totalUnits || 1)) * 100);
          const isSelected = order.id === selectedOrderId;
          const assignedCount = Object.keys(order.assignedMap || {}).length;
          const isExpanded = expandedOrderId === order.id;

          return (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order.id)}
              className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer relative shadow-2xs ${
                isSelected
                  ? 'border-amber-700 ring-2 ring-amber-700/15'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                    <span className="font-mono font-semibold text-amber-900">{order.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{order.buyerCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>Order Date: {order.orderDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">
                    {order.product}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Buyer: <strong className="text-stone-800">{order.buyerName}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-semibold ${
                    order.status === 'In Progress'
                      ? 'text-amber-800'
                      : order.status === 'Allocated'
                      ? 'text-emerald-800'
                      : 'text-stone-600'
                  }`}>
                    ● {order.status}
                  </span>
                  <div className="text-xs text-stone-600 mt-0.5">
                    {order.deadlineDays} days SLA remaining
                  </div>
                </div>
              </div>

              {/* Economic & Volume Breakdown */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 my-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                <div>
                  <div className="text-stone-600 font-medium">Total Volume</div>
                  <div className="text-base font-bold text-stone-900 mt-0.5">
                    {order.totalUnits} <span className="text-xs font-normal text-stone-600">{t.unit}</span>
                  </div>
                </div>
                <div>
                  <div className="text-stone-600 font-medium">Artisan Piece-Rate</div>
                  <div className="text-base font-bold text-emerald-800 mt-0.5">
                    ₹{order.memberPieceRate} <span className="text-xs font-normal text-stone-600">/ pc</span>
                  </div>
                  <div className="text-[10px] text-stone-600 mt-0.5">
                    Buyer pays ₹{order.ratePerUnit}
                  </div>
                </div>
                <div>
                  <div className="text-stone-600 font-medium">Fair Work Share</div>
                  <div className="text-base font-bold text-stone-800 mt-0.5">
                    {assignedCount > 0 ? `${assignedCount} Artisans` : 'Not Split'}
                  </div>
                  <div className="text-[10px] text-stone-600 mt-0.5">
                    {assignedCount > 0 ? 'Equitable CWFA' : 'Awaiting Split'}
                  </div>
                </div>
              </div>

              {/* Progress Bar & QC Stats */}
              <div>
                <div className="flex justify-between items-baseline text-xs text-stone-700 font-medium mb-1">
                  <span>
                    Fulfilled: <strong className="text-stone-900">{order.completedUnits}</strong> of {order.totalUnits} {t.unit}
                    {order.passedQcUnits > 0 && (
                      <span className="text-emerald-800 ml-2">
                        ({order.passedQcUnits} passed optical QC)
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-stone-900">{percent}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent >= 80 ? 'bg-emerald-700' : percent > 0 ? 'bg-amber-700' : 'bg-stone-300'
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>

              {/* Collapsible Specs & Technical Notes */}
              <div className="mt-3 pt-3 border-t border-stone-100 text-xs">
                <div className="flex justify-between items-center text-stone-600">
                  <span className="truncate max-w-[260px] italic">
                    {order.notes}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedOrderId(isExpanded ? null : order.id);
                    }}
                    className="text-amber-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide Specs' : 'View Specs'}</span>
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-2.5 p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 space-y-1 animate-fadeIn">
                    <div className="font-semibold text-stone-900 text-xs mb-1">Contract Specifications:</div>
                    {order.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder(order.id);
                    onNavigateTab('allocator');
                  }}
                  className="bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Fair Allocation (CWFA)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order.id);
                      onNavigateTab('qc');
                    }}
                    className="text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium text-xs py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order.id);
                      onNavigateTab('buyerPortal');
                    }}
                    className="text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium text-xs py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                    <span>SLA Audit</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
