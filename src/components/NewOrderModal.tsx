import React, { useState } from 'react';
import { ProductionOrder, Language } from '../types';
import { translations } from '../utils/i18n';
import { PlusCircle, X, Info } from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: ProductionOrder) => void;
  lang: Language;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onCreateOrder,
  lang,
}) => {
  const t = translations[lang];

  const [form, setForm] = useState({
    buyerName: '',
    buyerCategory: 'Retail Brand' as const,
    product: '',
    productCategory: 'Apparel & Garments',
    totalUnits: 300,
    deadlineDays: 7,
    ratePerUnit: 160,
    memberPieceRate: 110,
    notes: '',
    spec1: 'Pre-washed 100% natural fiber',
    spec2: 'Reinforced 12 SPI interlocked seams',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.buyerName || !form.product) return;

    const newOrder: ProductionOrder = {
      id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      buyerName: form.buyerName,
      buyerCategory: form.buyerCategory,
      product: form.product,
      productCategory: form.productCategory,
      totalUnits: Number(form.totalUnits),
      completedUnits: 0,
      passedQcUnits: 0,
      deadlineDays: Number(form.deadlineDays),
      ratePerUnit: Number(form.ratePerUnit),
      memberPieceRate: Number(form.memberPieceRate),
      status: 'Pending Allocation',
      assignedMap: {},
      notes: form.notes || 'Standard NRLM production guidelines.',
      orderDate: new Date().toISOString().slice(0, 10),
      specs: [form.spec1, form.spec2].filter(Boolean),
    };

    onCreateOrder(newOrder);
    onClose();
  };

  const groupGross = form.totalUnits * form.ratePerUnit;
  const womenPayout = form.totalUnits * form.memberPieceRate;
  const shgReserves = groupGross - womenPayout;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 my-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-lg text-stone-900">
              Create New Bulk Production Order
            </h3>
            <p className="text-xs text-stone-500">
              Ingest institutional order and setup fair piece-rate split
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-stone-700 mb-1">{t.buyerName}</label>
            <input
              type="text"
              required
              placeholder="e.g. FabIndia / Khadi Bhavan / Tata Trent CSR"
              value={form.buyerName}
              onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:outline-2 focus:outline-amber-700"
            />
          </div>

          <div>
            <label className="block text-stone-700 mb-1">{t.product}</label>
            <input
              type="text"
              required
              placeholder="e.g. Handspun Indigo Kurti / Jute Laptop Sleeves"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:outline-2 focus:outline-amber-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 mb-1">{t.totalVolume}</label>
              <input
                type="number"
                min="10"
                required
                value={form.totalUnits}
                onChange={(e) => setForm({ ...form, totalUnits: parseInt(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:outline-2 focus:outline-amber-700"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">{t.deadlineSla}</label>
              <input
                type="number"
                min="1"
                required
                value={form.deadlineDays}
                onChange={(e) => setForm({ ...form, deadlineDays: parseInt(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:outline-2 focus:outline-amber-700"
              />
            </div>
          </div>

          {/* Transparent Economic Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 mb-1">{t.buyerRate}</label>
              <input
                type="number"
                min="10"
                required
                value={form.ratePerUnit}
                onChange={(e) => setForm({ ...form, ratePerUnit: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:outline-2 focus:outline-amber-700"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">{t.artisanRate}</label>
              <input
                type="number"
                min="5"
                required
                value={form.memberPieceRate}
                onChange={(e) => setForm({ ...form, memberPieceRate: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:outline-2 focus:outline-amber-700"
              />
            </div>
          </div>

          {/* Live transparent margin indicator */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 flex justify-between items-center text-[11px]">
            <div>
              <span>Direct to Women Artisans:</span>
              <strong className="text-emerald-800 ml-1 font-bold">
                ₹{womenPayout.toLocaleString()} ({Math.round((womenPayout / (groupGross || 1)) * 100)}%)
              </strong>
            </div>
            <div>
              <span>SHG Raw Materials & Reserve:</span>
              <strong className="text-stone-900 ml-1 font-bold">
                ₹{shgReserves.toLocaleString()}
              </strong>
            </div>
          </div>

          <div>
            <label className="block text-stone-700 mb-1">{t.technicalSpecs}</label>
            <input
              type="text"
              placeholder="e.g. Double reinforced shoulder seams, natural dye"
              value={form.spec1}
              onChange={(e) => setForm({ ...form, spec1: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 outline-none mb-2"
            />
            <textarea
              rows={2}
              placeholder="Inspection and packaging guidelines..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg font-bold shadow-xs transition cursor-pointer"
            >
              {t.saveOrder}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
