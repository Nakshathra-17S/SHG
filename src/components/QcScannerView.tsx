import React, { useState, useRef } from 'react';
import { ProductionOrder, ShgMember, QcRecord, Language } from '../types';
import { translations } from '../utils/i18n';
import { INSPECTION_PRESETS, InspectionPreset } from '../data/mockData';
import { speakText } from '../utils/audioAssistant';
import { 
  Scan, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Volume2, 
  RefreshCw, 
  Eye, 
  SlidersHorizontal 
} from 'lucide-react';

interface QcScannerViewProps {
  orders: ProductionOrder[];
  members: ShgMember[];
  qcRecords: QcRecord[];
  onAddQcRecord: (record: QcRecord, passed: boolean) => void;
  lang: Language;
}

export const QcScannerView: React.FC<QcScannerViewProps> = ({
  orders,
  members,
  qcRecords,
  onAddQcRecord,
  lang,
}) => {
  const t = translations[lang];

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState<number>(members[0]?.id || 1);
  const [selectedPreset, setSelectedPreset] = useState<InspectionPreset>(INSPECTION_PRESETS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanResult, setLastScanResult] = useState<{
    passed: boolean;
    score: number;
    varianceMm: number;
    defect: string;
    inspectionType: any;
    status: 'Approved' | 'Rework Required';
  } | null>(null);

  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'rework'>('all');

  // Trigger optical scan
  const handleTriggerScan = () => {
    setIsScanning(true);
    setLastScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const isApproved = selectedPreset.status === 'Approved';
      const result = {
        passed: isApproved,
        score: selectedPreset.score,
        varianceMm: selectedPreset.varianceMm,
        defect: selectedPreset.expectedDefect,
        inspectionType: selectedPreset.category as any,
        status: selectedPreset.status,
      };

      setLastScanResult(result);

      // Add to audit trail log
      const member = members.find((m) => m.id === selectedMemberId);
      const newRecord: QcRecord = {
        id: Date.now(),
        memberName: member ? member.name : 'SHG Member',
        memberId: selectedMemberId,
        orderId: selectedOrderId,
        defectType: result.defect,
        score: result.score,
        status: result.status,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seamVarianceMm: result.varianceMm,
        zeroDeductionApplied: !isApproved,
        inspectionType: selectedPreset.category as any,
        notes: selectedPreset.description,
      };

      onAddQcRecord(newRecord, isApproved);

      // Voice readout of QC result
      const voiceText = isApproved
        ? lang === 'kn'
          ? `ಗುಣಮಟ್ಟ ತಪಾಸಣೆ ಯಶಸ್ವಿಯಾಗಿದೆ. ಇಳಕಲ್ ಬಾರ್ಡರ್ ಮತ್ತು ಹೊಲಿಗೆ ನಿಖರತೆ ಶೇಕಡಾ 98 ರಷ್ಟಿದೆ. ಈ ಬಟ್ಟೆ ಅಂಗೀಕರಿಸಲ್ಪಟ್ಟಿದೆ.`
          : lang === 'hi'
          ? `गुणवत्ता जांच सफल! सिलाई और कॉलर परिशुद्धता 97 प्रतिशत सटीक है। यह परिधान पास है।`
          : `Quality Inspection Passed. Stitch alignment meets export specifications with ${result.score}% confidence.`
        : lang === 'kn'
          ? `ಗಮನಿಸಿ: ಹೊಲಿಗೆಯಲ್ಲಿ ಸಣ್ಣ ದೋಷವಿದೆ. ಸಂಜೀವಿನಿ ಶೂನ್ಯ ದಂಡ ನಿಯಮದ ಪ್ರಕಾರ ಯಾವುದೇ ಕೂಲಿ ಕಡಿತವಿಲ್ಲ. ತಕ್ಷಣವೇ ಸರಿಪಡಿಸಿ.`
          : lang === 'hi'
          ? `ध्यान दें: सिलाई में सुधार अपेक्षित है। प्रथम सुधार नीति के तहत कारीगर के पैसे नहीं कटेंगे। तत्काल रीवर्क करें।`
          : `Rework needed. Zero-deduction policy active. Artisan can re-stitch with no wage docked.`;

      speakText(voiceText, lang);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredLogs = qcRecords.filter((record) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'approved') return record.status === 'Approved';
    if (filterStatus === 'rework') return record.status === 'Rework Required';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Zero Deduction Rule Guarantee Banner */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-900" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
              {t.zeroPenaltyRule}
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Empowering artisans with trust: Defects caught at workstations are sent for immediate re-pass with <strong>100% full wage protection</strong>. Zero unfair penalties.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-lg shrink-0">
          NRLM Quality Standard
        </div>
      </div>

      {/* Main Scanner Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Scanner Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-amber-800" />
                <h3 className="font-bold text-stone-900 text-sm">
                  {t.scanCamera}
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                Model: Textile-YOLO-v9-Edge
              </span>
            </div>

            {/* Inputs: Contract & Member */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Contract Batch:
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2 focus:outline-2 focus:outline-amber-700 cursor-pointer"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} · {o.product.slice(0, 24)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Inspected Artisan:
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(parseInt(e.target.value))}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2 focus:outline-2 focus:outline-amber-700 cursor-pointer"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role.slice(0, 18)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Test Sample Garment Presets */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center justify-between">
                <span>Select Garment Test Preset or Upload Photo:</span>
                <span className="text-stone-500 font-normal">Edge AI Presets</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INSPECTION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setCustomImage(null);
                      setLastScanResult(null);
                    }}
                    className={`p-2 rounded-lg text-left border text-xs transition cursor-pointer ${
                      selectedPreset.id === preset.id && !customImage
                        ? 'border-amber-800 bg-amber-50/70 font-semibold text-stone-900 ring-1 ring-amber-800/30'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="font-bold truncate">{preset.name}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {preset.category} · {preset.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CAMERA & SCANNER SIMULATOR CANVAS */}
            <div className="relative aspect-4/3 rounded-xl bg-stone-950 border-2 border-stone-800 overflow-hidden flex items-center justify-center">
              {/* Optional uploaded image or textile pattern canvas */}
              {customImage ? (
                <img
                  src={customImage}
                  alt="Garment under test"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-300 bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px]">
                  <div className="w-full h-full border border-dashed border-stone-700 rounded-lg flex flex-col items-center justify-center relative p-4">
                    <Eye className="w-10 h-10 text-amber-500/60 mb-2" />
                    <span className="text-xs font-semibold text-stone-200">
                      Sample: {selectedPreset.name}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 max-w-xs text-center">
                      {selectedPreset.description}
                    </span>

                    {/* Simulated optical bounding contour boxes */}
                    {selectedPreset.contourCoordinates.map((box, i) => (
                      <div
                        key={i}
                        className={`absolute border-2 transition-all ${
                          selectedPreset.status === 'Approved'
                            ? 'border-emerald-400 bg-emerald-500/10'
                            : 'border-rose-400 bg-rose-500/15'
                        }`}
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.w}%`,
                          height: `${box.h}%`,
                        }}
                      >
                        <span className="absolute -top-4 left-0 text-[9px] font-mono px-1 bg-stone-900 text-white rounded">
                          {selectedPreset.category} ({selectedPreset.status === 'Approved' ? '98%' : '72%'})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Laser Scanning Animation Sweep */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-lg shadow-amber-400 animate-bounce top-1/2"></div>
              )}

              {/* Scanning status banner */}
              {isScanning && (
                <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                  <span className="text-xs font-bold tracking-wider text-amber-300">
                    {t.scanning}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-1">
                    Checking seam tension & millimeter variance...
                  </span>
                </div>
              )}

              {/* Camera Grid Overlay */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded">
                LIVE 60FPS · ISO 200 · F/1.8
              </div>
            </div>

            {/* Scan Action Controls */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleTriggerScan}
                disabled={isScanning}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                  isScanning
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                <Scan className="w-4 h-4 text-amber-400" />
                <span>{isScanning ? 'Analyzing Stitch...' : t.triggerScan}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-3 px-3.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                title="Upload real garment photo"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Scan Output Banner */}
            {lastScanResult && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xs ${
                  lastScanResult.passed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex justify-between items-baseline font-bold mb-1">
                  <span className="text-sm flex items-center gap-1.5">
                    {lastScanResult.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-700" />
                    )}
                    <span>{lastScanResult.status}</span>
                  </span>
                  <span className="font-mono text-xs">
                    Confidence: {lastScanResult.score}% · Variance: {lastScanResult.varianceMm}mm
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed">{lastScanResult.defect}</p>
                {!lastScanResult.passed && (
                  <div className="mt-2 text-[11px] font-semibold text-amber-900 bg-amber-100/60 p-2 rounded">
                    Notice: Handed back to artisan for quick pass. No piece-rate deduction applies under NRLM Zero-Deduction First Rework rule.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Traceability & Inspection History */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Inspection Traceability Log
              </h3>
              <p className="text-xs text-stone-500">
                Audited proof of zero bulk rejection penalties for institutional buyers
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                All ({qcRecords.length})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  filterStatus === 'approved' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('rework')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  filterStatus === 'rework' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Rework
              </button>
            </div>
          </div>

          {/* Record Items */}
          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 max-h-[520px]">
            {filteredLogs.map((record) => (
              <div
                key={record.id}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      record.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {record.status === 'Approved' ? '✓' : '!'}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      {record.memberName}
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-amber-900">{record.orderId}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.inspectionType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.timestamp}</span>
                    </div>
                    <p className="text-stone-700 mt-1 text-[11px] leading-relaxed">
                      {record.defectType}
                    </p>
                    {record.zeroDeductionApplied && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                        Zero-Deduction Rework Logged
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-stone-900 text-xs">
                    {record.score}%
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                    ±{record.seamVarianceMm}mm
                  </div>
                  <div
                    className={`text-[10px] font-semibold mt-1 ${
                      record.status === 'Approved' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    ● {record.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
