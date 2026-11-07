/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Language, ShgMember, ProductionOrder, QcRecord, PassbookItem, LiveTelemetryEvent } from './types';
import { translations } from './utils/i18n';
import { INITIAL_MEMBERS, INITIAL_ORDERS, INITIAL_QC_LOG, INITIAL_LIVE_EVENTS } from './data/mockData';
import { speakText, stopSpeaking } from './utils/audioAssistant';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { LiveTelemetryTicker } from './components/LiveTelemetryTicker';
import { OrdersView } from './components/OrdersView';
import { AllocatorView } from './components/AllocatorView';
import { QcScannerView } from './components/QcScannerView';
import { PassbookView } from './components/PassbookView';
import { MembersDirectoryView } from './components/MembersDirectoryView';
import { BuyerPortalView } from './components/BuyerPortalView';
import { NewOrderModal } from './components/NewOrderModal';
import { PaymentVoucherModal } from './components/PaymentVoucherModal';
import { CheckCircle2, AlertCircle, Info, Heart, Radio } from 'lucide-react';

export default function App() {
  // Default to Kannada (kn) for Karnataka state restriction
  const [lang, setLang] = useState<Language>('kn');
  const [activeTab, setActiveTab] = useState<string>('orders');
  const [members, setMembers] = useState<ShgMember[]>(INITIAL_MEMBERS);
  const [orders, setOrders] = useState<ProductionOrder[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0].id);
  const [qcRecords, setQcRecords] = useState<QcRecord[]>(INITIAL_QC_LOG);

  // Live Telemetry Stream State
  const [liveEvents, setLiveEvents] = useState<LiveTelemetryEvent[]>(INITIAL_LIVE_EVENTS);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  // Modals & Vouchers
  const [showNewOrderModal, setShowNewOrderModal] = useState<boolean>(false);
  const [activeVoucher, setActiveVoucher] = useState<PassbookItem | null>(null);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'alert' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const t = translations[lang];

  // Stop audio on tab switch
  useEffect(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, [activeTab, lang]);

  // Real-time live production simulator
  const triggerSimulatedLiveEvent = () => {
    const activeArtisans = members.filter((m) => m.active);
    const artisan = activeArtisans[Math.floor(Math.random() * activeArtisans.length)];
    const targetOrder = orders.find((o) => o.id === 'ORD-KA-2026-89') || orders[0];
    const isApproved = Math.random() > 0.15; // 85% pass rate
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newEvent: LiveTelemetryEvent = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: nowTime,
      artisanName: artisan.name,
      cluster: artisan.village,
      orderId: targetOrder.id,
      pieceType: `${targetOrder.product.slice(0, 26)} #${targetOrder.completedUnits + 1}`,
      qcStatus: isApproved ? 'Approved' : 'Rework Required',
      earnedAmount: isApproved ? targetOrder.memberPieceRate : 0,
      stationId: `WS-${artisan.village.split(',')[1]?.trim().slice(0, 3).toUpperCase() || 'DWD'}-0${artisan.id}`,
    };

    setLiveEvents((prev) => [newEvent, ...prev.slice(0, 7)]);

    if (isApproved) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === targetOrder.id) {
            return {
              ...o,
              completedUnits: Math.min(o.totalUnits, o.completedUnits + 1),
              passedQcUnits: Math.min(o.totalUnits, o.passedQcUnits + 1),
            };
          }
          return o;
        })
      );
      showToast(`⚡ Live Stream: ${artisan.name} (${artisan.village}) completed piece. +₹${targetOrder.memberPieceRate} locked in passbook!`);
    } else {
      showToast(`⚠️ Live Stream: Seam variance flagged for ${artisan.name}. Returned for zero-penalty rework.`, 'alert');
    }
  };

  // Timer effect for live telemetry stream (every 12 seconds when streaming is active)
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      triggerSimulatedLiveEvent();
    }, 12000);
    return () => clearInterval(interval);
  }, [isLiveStreaming, orders, members]);

  // Handle vernacular voice summary toggle
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    let speechContent = '';

    if (activeTab === 'orders') {
      speechContent =
        lang === 'kn'
          ? `ಕರ್ನಾಟಕ ಸಂಜೀವಿನಿ ಪ್ರಗತಿ ಮಹಿಳಾ ಒಕ್ಕೂಟದಲ್ಲಿ ಮೂರು ಸಗಟು ಆದೇಶಗಳು ಚಾಲ್ತಿಯಲ್ಲಿವೆ. ಕರ್ನಾಟಕ ಕೈಮಗ್ಗ ನಿಗಮ ಕೆಹೆಚ್‌ಡಿಸಿ ಮತ್ತು ಫ್ಯಾಬ್‌ಇಂಡಿಯಾ ಬೆಂಗಳೂರು ಆರ್ಡರ್‌ಗಳು ಮುಖ್ಯವಾಗಿವೆ.`
          : lang === 'hi'
          ? `कर्नाटक संजीवनी महिला संघ में तीन थोक ऑर्डर सक्रिय हैं। केएचडीसी प्रियदर्शिनी और फैबइंडिया बेंगलुरु के ऑर्डर प्रमुख हैं।`
          : `Karnataka Sanjeevini Pragati SHG currently has active bulk orders from KHDC Karnataka Handloom Development Corporation and FabIndia Bengaluru.`;
    } else if (activeTab === 'allocator') {
      speechContent =
        lang === 'kn'
          ? `ಸ್ಮಾರ್ಟ್ ಹಂಚಿಕೆ ವ್ಯವಸ್ಥೆಯು ಧಾರವಾಡ ಮತ್ತು ಇಳಕಲ್ ಮಹಿಳೆಯರ ಮನೆಕೆಲಸದ ಸಮಯ ಮತ್ತು ಕಸೂತಿ ಕೌಶಲ್ಯವನ್ನು ಆಧರಿಸಿ ಸಮಾನವಾಗಿ ಕೆಲಸವನ್ನು ಹಂಚುತ್ತದೆ.`
          : lang === 'hi'
          ? `स्मार्ट कार्य आवंटन धारवाड़ और इलकल की महिलाओं के घरेलू समय और सिलाई गति के आधार पर निष्पक्ष रूप से काम बांटता है।`
          : `Capacity-Weighted Fair Allocator balances production quotas across Dharwad and Bagalkote women based on domestic hours, speed, and skill rating.`;
    } else if (activeTab === 'qc') {
      speechContent =
        lang === 'kn'
          ? `ಎಐ ಗುಣಮಟ್ಟ ತಪಾಸಣೆಯಲ್ಲಿ ಇಳಕಲ್ ಬಾರ್ಡರ್ ಮತ್ತು ಕಸೂತಿ ವಿನ್ಯಾಸವನ್ನು ಪರೀಕ್ಷಿಸಲಾಗುತ್ತದೆ. ಮೊದಲ ರಿವರ್ಕ್‌ಗೆ ಯಾವುದೇ ವೇತನ ಕಡಿತವಿಲ್ಲ.`
          : lang === 'hi'
          ? `एआई गुणवत्ता जांच में इलकल बॉर्डर और कसूती कढ़ाई की जांच की जाती है। प्रथम सुधार पर शून्य कटौती नियम लागू है।`
          : `AI Optical Inspection verifies Ilkal saree borders and Dharwad Kasuti motifs with Zero-Deduction First Rework protection.`;
    } else if (activeTab === 'passbook') {
      speechContent =
        lang === 'kn'
          ? `ಡಿಜಿಟಲ್ ಪಾಸ್‌ಬುಕ್‌ನಲ್ಲಿ ಪ್ರತಿ ಮಹಿಳೆಯ ದಿನದ ಕೂಲಿ ಮತ್ತು ಐದು ಪ್ರತಿಶತ ಬೋನಸ್ ನೇರವಾಗಿ ಕರ್ನಾಟಕ ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗಲು ಸಿದ್ಧವಾಗಿದೆ.`
          : lang === 'hi'
          ? `डिजिटल पासबुक में प्रत्येक कारीगर का पारिश्रमिक और 5% बोनस कर्नाटक ग्रामीण बैंक खाते में सीधे ट्रांसफर हेतु तैयार है।`
          : `Digital Passbook provides verified piece-rate earnings with direct bank transfers to Karnataka Vikas Grameena Bank accounts.`;
    } else if (activeTab === 'members') {
      speechContent =
        lang === 'kn'
          ? `ಸಂಜೀವಿನಿ ಒಕ್ಕೂಟದಲ್ಲಿ ಧಾರವಾಡ ಮತ್ತು ಬಾಗಲಕೋಟೆಯ 12 ನುರಿತ ಮಹಿಳಾ ಟೈಲರ್‌ಗಳು ಮತ್ತು ಕಸೂತಿ ಕಲಾವಿದರು ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದ್ದಾರೆ.`
          : lang === 'hi'
          ? `संजीवनी संघ में धारवाड़ और बागलकोट की 12 प्रमाणित महिला शिल्पी पंजीकृत हैं।`
          : `Directory of 12 certified artisans in Dharwad and Bagalkote clusters with domestic capacity tracking and verified bank accounts.`;
    } else {
      speechContent =
        lang === 'kn'
          ? `ಖರೀದಿದಾರರ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಕೆಹೆಚ್‌ಡಿಸಿ ಮತ್ತು ಶಿಕ್ಷಣ ಇಲಾಖೆಯು ಲೈವ್ ಆಗಿ ಬಟ್ಟೆಯ ಹೊಲಿಗೆ ಪ್ರಗತಿ ಮತ್ತು ದೋಷ ರಹಿತ ಗುಣಮಟ್ಟವನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.`
          : lang === 'hi'
          ? `संस्थागत खरीदार पोर्टल पर केएचडीसी और कर्नाटक शिक्षा विभाग बिना फोन किए वास्तविक प्रगति देख सकते हैं।`
          : `Buyer Trust SLA portal provides KHDC and DSERT with verifiable proof of milestones, ethical wages, and defect rates under 1.2 percent.`;
    }

    speakText(speechContent, lang).then(() => {
      setIsSpeaking(false);
    });
  };

  // Dynamic Transparent Passbook Ledger
  const passbookLedger: PassbookItem[] = useMemo(() => {
    return members.map((m) => {
      let assignedUnits = 0;
      let earnedAmount = 0;
      let rateAgg = 0;

      orders.forEach((ord) => {
        const qty = ord.assignedMap ? ord.assignedMap[m.id] || 0 : 0;
        if (qty > 0) {
          assignedUnits += qty;
          earnedAmount += qty * ord.memberPieceRate;
          rateAgg = ord.memberPieceRate;
        }
      });

      const onTimeBonus = m.rating >= 4.8 ? Math.round(earnedAmount * 0.05) : 0;
      const grossPayable = earnedAmount + onTimeBonus;

      return {
        id: m.id,
        name: m.name,
        role: m.role,
        bankUpi: m.bankUpi,
        bankAccountNo: m.bankAccountNo,
        assignedUnits,
        completedUnits: assignedUnits,
        pieceRateAvg: rateAgg || 110,
        earnedAmount,
        onTimeBonus,
        grossPayable,
        paidStatus: m.id % 4 === 0 ? 'Settled' : 'Ready for Transfer',
        transactionRef: m.id % 4 === 0 ? `KVGB-DBT-98124${m.id}` : undefined,
      };
    });
  }, [members, orders]);

  // Aggregate Metrics
  const totalUnits = orders.reduce((sum, o) => sum + o.totalUnits, 0);
  const completedUnits = orders.reduce((sum, o) => sum + o.completedUnits, 0);
  const totalDisbursable = passbookLedger.reduce((sum, item) => sum + item.grossPayable, 0);
  const activeMembersCount = members.filter((m) => m.active).length;

  // Handle applying fair allocation
  const handleApplyAllocation = (orderId: string, assignedMap: Record<number, number>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            assignedMap,
            status: 'Allocated',
          };
        }
        return o;
      })
    );

    // Update members active load
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        activeLoad: assignedMap[m.id] || 0,
      }))
    );

    const activeCount = Object.values(assignedMap).filter((v) => v > 0).length;
    showToast(`✨ CWFA Applied: Distributed fairly across ${activeCount} Karnataka artisans with 100% capacity balance!`);
  };

  // Handle adding new QC Record
  const handleAddQcRecord = (record: QcRecord, passed: boolean) => {
    setQcRecords((prev) => [record, ...prev]);

    if (passed) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === record.orderId) {
            return {
              ...o,
              completedUnits: Math.min(o.totalUnits, o.completedUnits + 1),
              passedQcUnits: Math.min(o.totalUnits, o.passedQcUnits + 1),
              status: o.completedUnits + 1 >= o.totalUnits ? 'Completed' : 'In Progress',
            };
          }
          return o;
        })
      );
      showToast(`✅ Piece approved and logged into KHDC verified dispatch batch!`);
    } else {
      showToast(`⚠️ Sanjeevini Zero-Deduction rule: Handed back to ${record.memberName} for correction. No wage docked.`, 'alert');
    }
  };

  // Handle Member Capacity Update
  const handleUpdateMemberCapacity = (memberId: number, newHours: number) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return { ...m, capacityHours: newHours };
        }
        return m;
      })
    );
    showToast(`Updated domestic capacity hours for Karnataka artisan.`);
  };

  // Disburse Single Payment
  const handleDisburseSingle = (memberId: number) => {
    const member = members.find((m) => m.id === memberId);
    showToast(`💸 Karnataka Gramin Bank DBT initiated: Sent direct to ${member?.name} (${member?.bankUpi})`);
  };

  // Disburse All
  const handleDisburseAll = () => {
    showToast(`🚀 Batch Direct Benefit Transfer (DBT) executed for all ready members via KVGB gateway!`);
  };

  // Ingest New Order
  const handleCreateOrder = (order: ProductionOrder) => {
    setOrders([order, ...orders]);
    setSelectedOrderId(order.id);
    setActiveTab('allocator');
    showToast(`🎉 Bulk Contract ${order.id} registered! Open the Smart Allocator to distribute work.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-amber-100 selection:text-amber-950">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 transition animate-in fade-in slide-in-from-top-3 ${
            toast.type === 'alert'
              ? 'bg-amber-950 text-amber-100 border-amber-800'
              : 'bg-stone-900 text-stone-100 border-stone-800'
          }`}
        >
          {toast.type === 'alert' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewOrder={() => setShowNewOrderModal(true)}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Module Breadcrumb & Active View Indicator */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-200/80 text-xs text-stone-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-stone-400">ಕರ್ನಾಟಕ ಸಂಜೀವಿನಿ KSRLPS</span>
            <span>/</span>
            <span className="font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
              {activeTab === 'orders'
                ? t.orders
                : activeTab === 'allocator'
                ? t.allocator
                : activeTab === 'qc'
                ? t.qc
                : activeTab === 'passbook'
                ? t.passbook
                : activeTab === 'members'
                ? t.members
                : t.buyerPortal}
            </span>
          </div>

          <div className="text-[11px] text-stone-500 hidden sm:flex items-center gap-2">
            <span>Dharwad & Bagalkote GPLF Hub</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">● System Online</span>
          </div>
        </div>

        {/* Tab 1: Orders (Shows Telemetry + KPI Metrics + Contracts) */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Karnataka Cluster Telemetry Stream */}
            <LiveTelemetryTicker
              events={liveEvents}
              isLiveStreaming={isLiveStreaming}
              onToggleStreaming={() => setIsLiveStreaming(!isLiveStreaming)}
              onTriggerEvent={triggerSimulatedLiveEvent}
              lang={lang}
            />

            {/* Top 4 KPI Metrics */}
            <MetricCards
              lang={lang}
              activeCount={activeMembersCount}
              totalMembers={members.length}
              giniIndex={0.08}
              totalDisbursable={totalDisbursable}
              completedUnits={completedUnits}
              totalUnits={totalUnits}
            />

            <OrdersView
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={setSelectedOrderId}
              onNavigateTab={setActiveTab}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 2: Smart Allocator (Dedicated CWFA Work Breakdown Studio) */}
        {activeTab === 'allocator' && (
          <div className="animate-in fade-in duration-200">
            <AllocatorView
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrderId={setSelectedOrderId}
              members={members}
              onApplyAllocation={handleApplyAllocation}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 3: Dedicated AI QC Optical Inspection Workstation */}
        {activeTab === 'qc' && (
          <div className="animate-in fade-in duration-200">
            <QcScannerView
              orders={orders}
              members={members}
              qcRecords={qcRecords}
              onAddQcRecord={handleAddQcRecord}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 4: Dedicated Financial Passbook & Direct Benefit Transfer Portal */}
        {activeTab === 'passbook' && (
          <div className="animate-in fade-in duration-200">
            <PassbookView
              passbookItems={passbookLedger}
              onDisburseSingle={handleDisburseSingle}
              onDisburseAll={handleDisburseAll}
              onViewVoucher={(item) => setActiveVoucher(item)}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 5: Dedicated Karnataka Artisans Directory */}
        {activeTab === 'members' && (
          <div className="animate-in fade-in duration-200">
            <MembersDirectoryView
              members={members}
              onUpdateMemberCapacity={handleUpdateMemberCapacity}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 6: Dedicated External Institutional Buyer SLA Portal */}
        {activeTab === 'buyerPortal' && (
          <div className="animate-in fade-in duration-200">
            <BuyerPortalView
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrderId={setSelectedOrderId}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* New Bulk Order Modal */}
      <NewOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onCreateOrder={handleCreateOrder}
        lang={lang}
      />

      {/* Printable Payment Voucher Modal */}
      <PaymentVoucherModal
        voucher={activeVoucher}
        onClose={() => setActiveVoucher(null)}
        lang={lang}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">SHGFlow AI Karnataka</span>
            <span aria-hidden="true">·</span>
            <span>ಸಂಜೀವಿನಿ KSRLPS (Govt of Karnataka) · Tech4Bharat Problem 8.1</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500">
            <span>Empowering Rural Mahila SHG Weavers & Tailors across Karnataka</span>
            <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700 inline" />
          </div>
        </div>
      </footer>
    </div>
  );
}
