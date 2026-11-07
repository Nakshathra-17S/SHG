import React from 'react';
import { LiveTelemetryEvent, Language } from '../types';
import { translations } from '../utils/i18n';
import { Radio, RefreshCw, CheckCircle, AlertCircle, Play, Pause, MapPin, Info } from 'lucide-react';

interface LiveTelemetryTickerProps {
  events: LiveTelemetryEvent[];
  isLiveStreaming: boolean;
  onToggleStreaming: () => void;
  onTriggerEvent: () => void;
  lang: Language;
}

export const LiveTelemetryTicker: React.FC<LiveTelemetryTickerProps> = ({
  events,
  isLiveStreaming,
  onToggleStreaming,
  onTriggerEvent,
  lang,
}) => {
  const t = translations[lang];

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-4 mb-6 shadow-2xs">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className={`w-3 h-3 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-ping' : 'bg-stone-400'}`}></span>
            <span className={`w-2.5 h-2.5 rounded-full absolute ${isLiveStreaming ? 'bg-emerald-600' : 'bg-stone-500'}`}></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>Karnataka Cluster Live Telemetry</span>
                <span className="text-stone-300">·</span>
                <span className="text-amber-800 lowercase font-medium">dharwad & bagalkote centers</span>
              </h3>
            </div>
            <p className="text-[11px] text-stone-500">
              Grounded in authentic Karnataka Sanjeevini (KSRLPS) piece-rate schedules & live workstation edge optical scans
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time streaming toggle */}
          <button
            onClick={onToggleStreaming}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{isLiveStreaming ? 'Live Stream: Active (12s)' : 'Start Live Telemetry'}</span>
          </button>

          {/* Trigger single live piece event */}
          <button
            onClick={onTriggerEvent}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Simulate live piece completion at Dharwad/Ilkal workstation"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span>+ Simulate 1 Piece Event</span>
          </button>
        </div>
      </div>

      {/* Live Events Flow */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
        {events.slice(0, 4).map((evt) => (
          <div
            key={evt.id}
            className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-baseline text-[11px] mb-1">
                <span className="font-mono text-stone-500">{evt.stationId}</span>
                <span className="text-stone-600 font-medium">{evt.timestamp}</span>
              </div>
              <div className="font-bold text-stone-900 truncate">
                {evt.artisanName}
              </div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                <span className="truncate">{evt.cluster}</span>
              </div>
              <div className="text-[11px] text-stone-700 font-medium mt-1 truncate">
                {evt.pieceType}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
              <span
                className={`font-semibold flex items-center gap-1 ${
                  evt.qcStatus === 'Approved' ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {evt.qcStatus === 'Approved' ? (
                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-700" />
                )}
                <span>{evt.qcStatus}</span>
              </span>

              {evt.earnedAmount > 0 && (
                <span className="font-bold text-stone-900">
                  +₹{evt.earnedAmount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
