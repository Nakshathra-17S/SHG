import React, { useState } from 'react';
import { ShgMember, Language } from '../types';
import { translations } from '../utils/i18n';
import { 
  Users, 
  Search, 
  Sliders, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Award, 
  Clock, 
  Zap 
} from 'lucide-react';

interface MembersDirectoryViewProps {
  members: ShgMember[];
  onUpdateMemberCapacity: (memberId: number, newHours: number) => void;
  lang: Language;
}

export const MembersDirectoryView: React.FC<MembersDirectoryViewProps> = ({
  members,
  onUpdateMemberCapacity,
  lang,
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'A+' | 'A' | 'B' | 'C'>('all');
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.village.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (gradeFilter === 'all') return true;
    return m.skillGrade === gradeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Mahila SHG Register & Capacity Matrix
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            12 Active Artisans & Certified Tailors in Pragati Sanjeevini GPLF Dharwad & Bagalkote (KSRLPS Registered)
          </p>
        </div>

        <div className="text-xs text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>All 12 Bank Accounts Aadhaar-Verified</span>
        </div>
      </div>

      {/* Search & Skill Grade Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by artisan name, village, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:outline-2 focus:outline-amber-700"
          />
        </div>

        {/* Skill Grade Selector */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
          {(['all', 'A+', 'A', 'B', 'C'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setGradeFilter(grade)}
              className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                gradeFilter === grade
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMembers.map((member) => {
          const isEditing = editingMemberId === member.id;

          return (
            <div
              key={member.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition"
            >
              <div>
                {/* Header: Initial & Rating */}
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-950 font-bold flex items-center justify-center text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-800">
                      ★ {member.rating}
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Grade {member.skillGrade}
                    </span>
                  </div>
                </div>

                {/* Artisan Info */}
                <h3 className="text-base font-bold text-stone-900">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-amber-900 mt-0.5">
                  {member.role}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{member.village}</span>
                  <span aria-hidden="true">·</span>
                  <span>{member.experienceYears} yrs exp</span>
                </div>

                {/* Capacity & Speed Metrics */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Domestic Hours:</span>
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="2"
                          max="10"
                          defaultValue={member.capacityHours}
                          onChange={(e) =>
                            onUpdateMemberCapacity(member.id, parseInt(e.target.value) || member.capacityHours)
                          }
                          className="w-12 bg-stone-100 border border-stone-300 rounded px-1.5 py-0.5 text-xs font-bold"
                        />
                        <button
                          onClick={() => setEditingMemberId(null)}
                          className="text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">
                          {member.capacityHours} hrs / day
                        </span>
                        <button
                          onClick={() => setEditingMemberId(member.id)}
                          className="text-[10px] text-amber-800 underline cursor-pointer"
                          title="Adjust domestic caregiving hours"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Verified Speed:</span>
                    </span>
                    <span className="font-bold text-stone-900">
                      {member.speedUnitsPerDay} pcs / day
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>Phone:</span>
                    </span>
                    <span className="text-stone-700 font-mono text-[11px]">
                      {member.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank UPI Bar */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-stone-500 truncate max-w-[130px]">
                  {member.bankUpi}
                </span>
                <span className="text-emerald-800 font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                  <span>DBT Active</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
