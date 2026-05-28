import React from 'react';
import { BarChart2, Plus, Zap } from 'lucide-react';
import { User, Course } from '../types.ts';

interface CareerGapSectionProps {
  user: User | null;
  darkMode: boolean;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  profileName: string;
  setProfileName: (val: string) => void;
  profileCareer: string;
  setProfileCareer: (val: string) => void;
  profileInterests: string[];
  removeInterestTag: (tag: string) => void;
  newInterestInput: string;
  setNewInterestInput: (val: string) => void;
  addInterestTag: () => void;
  profileSkills: string[];
  removeSkillTag: (tag: string) => void;
  newSkillInput: string;
  setNewSkillInput: (val: string) => void;
  addSkillTag: () => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  targetCareerSkills: { name: string; weight: number }[];
  targetCareerTitle: string;
  alignmentPercentage: number;
}

export default function CareerGapSection({
  user,
  darkMode,
  isEditingProfile,
  setIsEditingProfile,
  profileName,
  setProfileName,
  profileCareer,
  setProfileCareer,
  profileInterests,
  removeInterestTag,
  newInterestInput,
  setNewInterestInput,
  addInterestTag,
  profileSkills,
  removeSkillTag,
  newSkillInput,
  setNewSkillInput,
  addSkillTag,
  handleUpdateProfile,
  targetCareerSkills,
  targetCareerTitle,
  alignmentPercentage,
}: CareerGapSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT COLUMN: ACTIVE PROFILE PARAMETERS EDITOR */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-850">
          <div>
            <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 tracking-wider font-mono">My Account Vector</span>
            <h3 className={`text-xl font-extrabold tracking-tight mt-1 font-display ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {user ? user.name : 'Simulated Auditor'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">{user ? user.email : 'No registered session'}</p>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-3 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 hover:text-violet-550 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-950/20 border border-violet-200 dark:border-violet-950/30 transition-colors cursor-pointer"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg outline-none border focus:ring-1 focus:ring-violet-500 {
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Professional Career Target</label>
              <input
                type="text"
                value={profileCareer}
                placeholder="e.g. Full Stack AI Engineer"
                onChange={(e) => setProfileCareer(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg outline-none border focus:ring-1 focus:ring-violet-500 ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              />
              <p className="text-[9px] text-slate-405 mt-1">Our server compares options based on this key career string.</p>
            </div>

            {/* Tags preference */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Interests Preference tags</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {profileInterests.map((interest, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10px] px-2 py-0.5 rounded border border-violet-250 dark:border-violet-900">
                    {interest}
                    <button type="button" onClick={() => removeInterestTag(interest)} className="hover:text-red-500 font-mono text-[11px] ml-1">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add interest tag..."
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-lg outline-none border focus:ring-1 focus:ring-violet-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={addInterestTag}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Skills preference */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Familiar technology skill inventory</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {profileSkills.map((skill, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10px] px-2 py-0.5 rounded border border-violet-250 dark:border-violet-900">
                    {skill}
                    <button type="button" onClick={() => removeSkillTag(skill)} className="hover:text-red-500 font-mono text-[11px] ml-1">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill tag..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-lg outline-none border focus:ring-1 focus:ring-violet-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={addSkillTag}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
            >
              Sync Profile Parameters
            </button>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div className={`p-4 rounded-xl border text-xs space-y-3.5 ${
              darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-150'
            }`}>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[9px] tracking-wide">Target Tech Career Alignment:</span>
                <p className={`font-extrabold mt-1 font-display text-sm ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {user?.targetCareer || 'No custom career added yet'}
                </p>
              </div>
              
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[9px] tracking-wide">Category preferences:</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {user?.interests && user.interests.length > 0 ? (
                    user.interests.map((pref, i) => (
                      <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        darkMode ? 'bg-violet-950/40 text-violet-300 border-violet-900/30' : 'bg-violet-100/50 text-violet-700 border-violet-200'
                      }`}>
                        {pref}
                      </span>
                    ))
                  ) : (
                    <em className="text-slate-500 font-mono">None selected</em>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[9px] tracking-wide">Tech Skills inventory:</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {user?.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, i) => (
                      <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        darkMode ? 'bg-violet-950/40 text-violet-300 border-violet-950/30' : 'bg-violet-100/50 text-violet-700 border-violet-200'
                      }`}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <em className="text-slate-500 font-mono">None registered</em>
                  )}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl text-xs flex gap-2 border ${
              darkMode ? 'bg-violet-950/10 border-violet-800/20' : 'bg-violet-50/50 border-violet-100'
            }`}>
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-slate-650 dark:text-slate-350 leading-relaxed text-[11px]">
                <strong>Real-time gap evaluation:</strong> Edit your tech skills inventory above! Adding target items (e.g. <code>React 19</code>, <code>TypeScript</code>) instantly increases your match and fulfills missing criteria in the tracker opposite.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: HIGH FIDELITY SVG SKILLS ALIGNMENT WHEEL & CHECKLIST */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'
      } flex flex-col justify-between`}>
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-violet-650 dark:text-violet-400 flex items-center gap-1.5 mb-3 select-none">
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span>Career Vectors Gap Analyser Chart</span>
          </h4>

          <div className="flex flex-col items-center justify-center p-2 mb-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              
              {/* Visual SVG Circular progress meter ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="41" 
                  className={`fill-transparent ${darkMode ? 'stroke-slate-950/80' : 'stroke-slate-100'}`} 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="41" 
                  className="stroke-violet-505 dark:stroke-violet-500 fill-transparent transition-all duration-1000 ease-out" 
                  strokeWidth="8"
                  style={{ stroke: 'currentColor', color: '#8b5cf6' }}
                  strokeDasharray={`${2 * Math.PI * 41}`}
                  strokeDashoffset={`${2 * Math.PI * 41 * (1 - alignmentPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Inner Center Text */}
              <div className="absolute text-center">
                <span className="block text-3xl font-black text-transparent bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 bg-clip-text font-mono tracking-tighter">
                  {alignmentPercentage}%
                </span>
                <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-mono mt-0.5">
                  MATCH RATE
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-slate-450 font-semibold text-[11px] uppercase tracking-wider">
            Target Domain: <strong className="text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text font-display font-black block mt-1 normal-case text-sm">{targetCareerTitle}</strong>
          </span>
          
          {/* SVG Visual Matrix representing required target skills and matching statuses */}
          <div className="grid grid-cols-2 gap-2 pt-1.5">
            {targetCareerSkills.map((sk) => {
              const isAcquired = user?.skills.some(us => us.toLowerCase() === sk.name.toLowerCase());
              return (
                <div key={sk.name} className={`flex items-center justify-between p-2 rounded-lg border ${
                  darkMode ? 'bg-slate-950/75 border-slate-850' : 'bg-slate-50 border-slate-150'
                }`}>
                  <span className="font-bold text-[11px] text-slate-650 dark:text-slate-350">{sk.name}</span>
                  <span className={`text-[9px] font-black uppercase ${
                    isAcquired ? 'text-violet-600 dark:text-violet-400 font-mono' : 'text-slate-400'
                  }`}>
                    {isAcquired ? '✓ FULFILLED' : 'MISSING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
