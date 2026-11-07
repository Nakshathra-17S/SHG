import React from 'react';
import { PassbookItem, Language } from '../types';
import { translations } from '../utils/i18n';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PaymentVoucherModalProps {
  voucher: PassbookItem | null;
  onClose: () => void;
  lang: Language;
}

export const PaymentVoucherModal: React.FC<PaymentVoucherModalProps> = ({
  voucher,
  onClose,
  lang,
}) => {
  const t = translations[lang];

  if (!voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex justify-between items-start mb-4 no-print">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Official Digital Payout Voucher
            </h3>
            <p className="text-xs text-stone-500">
              Direct Benefit Transfer (DBT) Receipt · National Rural Livelihoods Mission
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Voucher Card */}
        <div className="border border-stone-300 rounded-xl p-5 bg-[#fffdfa] relative text-stone-800">
          {/* Watermark / Seal */}
          <div className="border-b border-stone-200 pb-4 mb-4 flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-amber-900">
                {t.shgGroup}
              </div>
              <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                Reg: {t.regId} · Gram Panchayat Navalgund, Dharwad Dist · KSRLPS Sanjeevini
              </div>
              <h2 className="text-lg font-bold text-stone-900 mt-2">
                Verified Artisan Payment Voucher
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-stone-500">
                Date: {new Date().toLocaleDateString('en-IN')}
              </span>
              <div className="mt-1 text-[11px] font-semibold text-emerald-800 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified DBT</span>
              </div>
            </div>
          </div>

          {/* Member Details */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div>
              <span className="text-stone-500">Beneficiary Name:</span>
              <div className="font-bold text-stone-900 text-sm mt-0.5">
                {voucher.name}
              </div>
              <div className="text-[11px] text-stone-600">{voucher.role}</div>
            </div>

            <div>
              <span className="text-stone-500">Bank / UPI VPA:</span>
              <div className="font-mono font-bold text-stone-900 text-xs mt-0.5">
                {voucher.bankUpi}
              </div>
              <div className="text-[10px] text-stone-500">
                A/C: {voucher.bankAccountNo}
              </div>
            </div>
          </div>

          {/* Itemized Calculation */}
          <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 text-xs space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-stone-600">
                Finished & QC-Passed Pieces ({voucher.assignedUnits} units @ ₹{voucher.pieceRateAvg}/unit):
              </span>
              <span className="font-semibold text-stone-900">
                ₹{voucher.earnedAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">
                Quality & On-Time Performance Bonus (5%):
              </span>
              <span className="font-semibold text-emerald-800">
                +₹{voucher.onTimeBonus.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">
                Workstation Rework Penalty:
              </span>
              <span className="font-semibold text-stone-700">
                ₹0 (Zero Deduction Rule)
              </span>
            </div>

            <div className="border-t border-stone-200 pt-2 flex justify-between items-baseline">
              <span className="font-bold text-stone-900 text-sm">
                Total Net Payable (INR):
              </span>
              <span className="text-lg font-bold text-amber-900">
                ₹{voucher.grossPayable.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Signature / Trust Stamp Footer */}
          <div className="pt-2 border-t border-dashed border-stone-200 flex justify-between items-center text-[11px] text-stone-500">
            <div>
              <div className="font-semibold text-stone-800">Pragati Sanjeevini Treasurer (GPLF Dharwad)</div>
              <div>Digital Authorization Stamp · Govt of Karnataka</div>
            </div>
            <div className="text-right font-mono text-[10px]">
              Auth Ref: {voucher.transactionRef || 'KVGB-DBT-2026-9812401'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
