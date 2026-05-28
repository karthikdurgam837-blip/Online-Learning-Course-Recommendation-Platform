import React from 'react';
import { Award, BookOpen, Clock, ShieldCheck, Trophy } from 'lucide-react';
import { Enrollment, Course, EnrollStatus } from '../types.ts';

interface AcademicCertificationsPortalProps {
  enrollments: any[];
  darkMode: boolean;
  setViewingCertificateCourse: (course: Course) => void;
}

export default function AcademicCertificationsPortal({
  enrollments,
  darkMode,
  setViewingCertificateCourse,
}: AcademicCertificationsPortalProps) {
  const completedEnrollments = enrollments.filter(e => e.status === EnrollStatus.COMPLETED);
  const totalCompletedLessons = enrollments.reduce((sum, e) => sum + (e.completedLessons || 0), 0);
  const totalLessonsCount = enrollments.reduce((sum, e) => sum + (e.totalLessons || 0), 0);

  return (
    <div className="space-y-6">
      {/* TROPHY SUMMARIZER COMPASS HEADER */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-violet-950/70 to-indigo-950/80 border border-violet-900/30 overflow-hidden shadow-xl text-white">
        <div className="relative z-10 space-y-1.5 max-w-[580px]">
          <span className="text-[10px] uppercase font-black text-violet-300 tracking-wider font-mono flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span>Academic Milestones Achievements Portfolio</span>
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-white font-display">Cryptographic Student Diploma Center</h3>
          <p className="text-xs text-violet-200 leading-relaxed font-sans font-light mt-1">
            Build your skills portfolio by completing curriculum items! As soon as all lessons in a path are marked completed, your authorized credentials badge is unlocked permanently on the ledger blockchain.
          </p>
        </div>
        <div className="absolute right-6 bottom-0 top-0 w-[180px] hidden md:flex items-center justify-center opacity-15 select-none pointer-events-none">
          <Award className="w-24 h-24 text-white stroke-[1.5]" />
        </div>
      </div>

      {/* COMPACT STATISTICS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-xs'} flex items-center gap-3`}>
          <div className="p-2.5 bg-violet-500/10 text-violet-605 rounded-lg">
            <Trophy className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase">Completed Courses</span>
            <span className={`text-lg font-black font-mono ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{completedEnrollments.length} Path(s)</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-xs'} flex items-center gap-3`}>
          <div className="p-2.5 bg-indigo-500/10 text-indigo-505 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase">Lessons Ticked</span>
            <span className={`text-lg font-black font-mono ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{totalCompletedLessons} / {totalLessonsCount || 0} Ticks</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-xs'} flex items-center gap-3`}>
          <div className="p-2.5 bg-fuchsia-500/10 text-fuchsia-500 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase">Syllabus Status</span>
            <span className={`text-lg font-black font-mono ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {completedEnrollments.length > 0 ? 'Verified Graduate' : 'In-Progress Study'}
            </span>
          </div>
        </div>
      </div>

      {/* DIPLOMAS INDEX GRID */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-450 font-mono flex items-center gap-1.5 select-none">
          <Award className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
          <span>My Earned Cryptographic Credentials</span>
        </h4>

        {completedEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedEnrollments.map((en) => (
              <div 
                key={en.id} 
                className={`p-5 rounded-xl border transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 hover:shadow-sm'
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                    <span className="text-[10px] text-violet-600 dark:text-violet-300 font-black tracking-widest uppercase font-mono bg-violet-100 dark:bg-violet-950/40 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-900/40">
                      {en.course?.category}
                    </span>
                    <span className="text-[10px] text-yellow-605 font-bold font-mono">
                      SECURE CREDENTIAL Verified
                    </span>
                  </div>

                  <h5 className={`font-extrabold mt-3 font-display text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{en.course?.title}</h5>
                  <p className="text-xs text-slate-400 mt-1">Instructor: {en.course?.authorName}</p>
                  
                  <div className={`p-3 border rounded-lg text-xs mt-3 ${
                    darkMode ? 'bg-slate-950/45 border-slate-850 text-slate-350' : 'bg-slate-50 border-slate-150 text-slate-600'
                  }`}>
                    <span className="font-bold text-[9px] uppercase text-violet-600 dark:text-violet-300 tracking-wider block mb-1 font-mono">
                      CREDENTIAL KEY
                    </span>
                    <code className="text-[10px] text-yellow-600/80 font-mono break-all leading-none">
                      APEX-RECO-{(en.courseId + (en.userId || 'auditor')).toUpperCase().substring(0, 16)}
                    </code>
                  </div>
                </div>

                <button
                  onClick={() => setViewingCertificateCourse(en.course)}
                  className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 hover:from-violet-605/20 hover:to-indigo-600/20 border border-violet-500/30 text-violet-600 dark:text-violet-300 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-violet-500/10"
                >
                  <Award className="w-4 h-4 stroke-[2.5]" />
                  <span>Reveal Gold Seal Diploma Card</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-10 rounded-2xl border border-dashed text-center space-y-3 max-w-lg mx-auto ${
            darkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-slate-50'
          }`}>
            <Award className="w-10 h-10 text-slate-400 dark:text-slate-705 mx-auto animate-pulse" />
            <div className="max-w-xs mx-auto">
              <h5 className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>No Diplomas Earned Yet</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                As soon as you complete 100% of any enrolled course syllabus and finish the lessons tick list, we will generate your gold physical seal and SHA codes immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
