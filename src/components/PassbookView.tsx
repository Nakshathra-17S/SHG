import React, { useState } from 'react';
import { ShgMember, ProductionOrder, PassbookItem, Language } from '../types';
import { translations } from '../utils/i18n';
import { 
  Download, 
  Send, 
  CheckCircle, 
  FileCheck, 
  Receipt, 
  ShieldCheck, 
  Search, 
  Building 
} from 'lucide-react';

interface PassbookViewProps {
  passbookItems: PassbookItem[];
  onDisburseSingle: (memberId: number) => void;
  onDisburseAll: () => void;
  onViewVoucher: (item: PassbookItem) => void;
  lang: Language;
}

export const PassbookView: React.FC<PassbookViewProps> = ({
  passbookItems,
  onDisburseSingle,
  onDisburseAll,
  onViewVoucher,
  lang,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'settled'>('all');

  // Filtered passbook
  const filtered = passbookItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bankUpi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    if (filterStatus === 'ready') return item.paidStatus === 'Ready for Transfer';
    if (filterStatus === 'settled') return item.paidStatus === 'Settled';
    return true;
  });

  const totalDisbursable = passbookItems.reduce((acc, curr) => acc + curr.grossPayable, 0);
  const pendingCount = passbookItems.filter((i) => i.paidStatus === 'Ready for Transfer').length;

  // Export CSV formatted for Indian Bank PFMS / NPCI bulk direct debit
  const handleExportCsv = () => {
    const headers = [
      'Beneficiary ID',
      'Artisan Full Name',
      'Bank Account / UPI VPA',
      'IFSC Code',
      'Verified Finished Pieces',
      'Base Piece Rate (INR)',
      'Quality & Speed Bonus (INR)',
      'Gross Payable (INR)',
      'Disbursal Status',
      'NRLM SHG ID',
    ];

    const rows = passbookItems.map((item) => [
      item.id,
      `"${item.name}"`,
      `"${item.bankUpi}"`,
      'KVGB0001084',
      item.completedUnits || item.assignedUnits,
      item.pieceRateAvg,
      item.onTimeBonus,
      item.grossPayable,
      item.paidStatus,
      'KA-DWD-KSRLPS-2024-0982-A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SHGFlow_Bank_Direct_Payout_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Zero-Trust Transparent Member Passbook</span>
            <span className="text-stone-400">·</span>
            <span>Direct Benefit Transfer (DBT) Ready</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Artisan Piece-Rate Ledger & Bank Disbursals
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl mt-1 leading-relaxed">
            Eliminates payment chaos: Piece-rate earnings, promptness bonuses (5%), and zero deduction for workstation reworks are automatically locked into verifiable individual passbook entries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCsv}
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{t.exportCsv}</span>
          </button>

          {pendingCount > 0 && (
            <button
              onClick={onDisburseAll}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Release All ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Summary & Search */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Disbursable Pool
          </span>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            ₹{totalDisbursable.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            100% transparent piece-rate allocation
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Average Artisan Earning
          </span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            ₹{Math.round(totalDisbursable / (passbookItems.length || 1)).toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Significantly above rural minimum daily wage
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Direct Bank Accounts
          </span>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            12 / 12 Verified
          </div>
          <div className="text-xs text-stone-500 mt-1">
            NPCI Aadhaar-seeded / UPI linked
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, UPI or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:outline-2 focus:outline-amber-700"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer ${
              filterStatus === 'all' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            All Members ({passbookItems.length})
          </button>
          <button
            onClick={() => setFilterStatus('ready')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer ${
              filterStatus === 'ready' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            Ready for Transfer ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('settled')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer ${
              filterStatus === 'settled' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            Settled ({passbookItems.length - pendingCount})
          </button>
        </div>
      </div>

      {/* Transparent Passbook Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100/80 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Artisan Member</th>
                <th className="px-4 py-3.5">Bank / UPI VPA</th>
                <th className="px-3 py-3.5 text-center">Allocated Pieces</th>
                <th className="px-4 py-3.5 text-right">Base Piece Pay</th>
                <th className="px-4 py-3.5 text-right">Quality Bonus (5%)</th>
                <th className="px-4 py-3.5 text-right">Gross Total</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
              {filtered.map((row) => {
                const isSettled = row.paidStatus === 'Settled';

                return (
                  <tr key={row.id} className="hover:bg-amber-50/20 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-stone-900 text-sm">{row.name}</div>
                      <div className="text-[11px] text-stone-500">{row.role}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono text-stone-900 text-xs font-semibold">
                        {row.bankUpi}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        A/C: {row.bankAccountNo.slice(-4).padStart(12, '•')}
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-center">
                      <span className="font-bold text-stone-900 text-sm">
                        {row.assignedUnits}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        ₹{row.pieceRateAvg} / pc
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold text-stone-800">
                      ₹{row.earnedAmount.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-800">
                      +₹{row.onTimeBonus.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right font-extrabold text-stone-900 text-sm">
                      ₹{row.grossPayable.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`text-[11px] font-semibold ${
                          isSettled ? 'text-emerald-800' : 'text-amber-800'
                        }`}
                      >
                        ● {row.paidStatus}
                      </span>
                      {row.transactionRef && (
                        <div className="text-[9px] font-mono text-stone-400 mt-0.5">
                          Ref: {row.transactionRef}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Printable Voucher Button */}
                        <button
                          onClick={() => onViewVoucher(row)}
                          className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 p-1.5 rounded-lg transition cursor-pointer"
                          title="Generate printable payment voucher"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>

                        {/* Release Payment Button */}
                        {isSettled ? (
                          <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onDisburseSingle(row.id)}
                            className="bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs py-1.5 px-3 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            Release ₹{row.grossPayable}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
