import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { Course } from '../types.ts';

interface RecommendationHubStateProps {
  recoModelStrategy: 'hybrid' | 'skills' | 'item-item' | 'ai' | 'skillgap';
  setRecoModelStrategy: (val: any) => void;
  isRecoLoading: boolean;
  recoExplanation: string;
  recommendedCourses: Course[];
  darkMode: boolean;
  loadCoursePlayer: (courseId: string) => void;
}

export default function RecommendationHubState({
  recoModelStrategy,
  setRecoModelStrategy,
  isRecoLoading,
  recoExplanation,
  recommendedCourses,
  darkMode,
  loadCoursePlayer,
}: RecommendationHubStateProps) {
  return (
    <div className="space-y-6">
      {/* EXPLANATORY BOARD & SWITCHER */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between gap-1 mb-4 font-display">
          <h3 className={`text-lg font-extrabold flex items-center gap-1.5 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            <Sparkles className="w-5 h-5 text-violet-500 shrink-0" />
            <span>Smart Hybrid Recommendation Core</span>
          </h3>
          {isRecoLoading && (
            <span className="text-[10px] text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/60 font-mono px-2.5 py-0.5 rounded-full border border-violet-200 dark:border-violet-900 animate-pulse">
              Computing alignment...
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Toggle between our backend recommendation strategies. Our Node service automatically runs TF-IDF calculations, peer behavioral habits, gap analysis, and Gemini 3.5 LLM inferences!
        </p>

        {/* Strategy Tab Group */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-2 p-1.5 rounded-xl mb-6 border ${
          darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200'
        }`}>
          {[
            { id: 'hybrid', label: 'Hybrid Matcher', desc: 'Combines tags & content similarity' },
            { id: 'skills', label: 'Familiar Skills', desc: 'Promotes already matching items' },
            { id: 'skillgap', label: 'Skill Gap Bridge', desc: 'Targets missing target competencies' },
            { id: 'item-item', label: 'Peer Enroller Habits', desc: 'Cohorts co-occurrence algorithm' },
            { id: 'ai', label: 'Gemini AI Coach', desc: 'Generative LLM tutoring model' }
          ].map(strat => {
            const isSelected = recoModelStrategy === strat.id;
            return (
              <button
                key={strat.id}
                onClick={() => setRecoModelStrategy(strat.id as any)}
                className={`p-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/10' 
                    : darkMode 
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <span className="block">{strat.label}</span>
                <span className="hidden md:block text-[8px] opacity-70 font-normal font-sans mt-0.5">{strat.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation card */}
        <div className={`p-4 rounded-xl border text-xs ${
          darkMode ? 'bg-slate-950 border-violet-950/40 text-slate-300' : 'bg-violet-50/50 border-violet-100 text-slate-700'
        }`}>
          <span className="font-extrabold text-[9px] uppercase text-violet-600 dark:text-violet-300 tracking-wider block mb-1.5 font-mono">
            {recoModelStrategy.toUpperCase()} INFERENCE EXPLANATION
          </span>
          <p className="leading-normal italic text-[13px]">"{recoExplanation || 'Aligning student vectors...'}"</p>
        </div>
      </div>

      {/* RECOMMENDED COURSES CATALOG INDEX */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-450 font-mono">
          AI Matched Path Suggestions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((c) => (
              <div 
                key={c.id} 
                className={`group p-4 rounded-xl border transition-all cursor-pointer hover:border-violet-600/40 ${
                  darkMode ? 'bg-slate-900 border-slate-850 hover:bg-slate-950' : 'bg-white border-slate-205 hover:shadow-md'
                }`}
                onClick={() => loadCoursePlayer(c.id)}
              >
                <div className="flex gap-4">
                  <img src={c.thumbUrl} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-900/30 shadow-sm" />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="block text-[9px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-widest">{c.category}</span>
                        <span className={`text-[9px] border px-1.5 py-0.2 rounded font-mono ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-230 text-slate-600'
                        }`}>
                          {c.level}
                        </span>
                      </div>
                      <h5 className={`font-extrabold text-sm group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mt-1 truncate ${
                        darkMode ? 'text-slate-100' : 'text-slate-800'
                      }`}>{c.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.subtitle || c.desc}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-violet-600 dark:text-violet-300 font-bold block">
                        Led by: {c.authorName}
                      </span>
                      <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" /> {c.ratingAverage} Ratings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`col-span-2 p-12 rounded-2xl border border-dashed text-center text-xs font-mono ${
              darkMode ? 'border-slate-800 bg-slate-950/20 text-slate-500' : 'border-slate-300 bg-slate-100 text-slate-400'
            }`}>
              Querying live recommendations pipeline...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
