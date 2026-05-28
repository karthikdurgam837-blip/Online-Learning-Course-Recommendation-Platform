import React, { useState } from 'react';
import { BookOpen, Settings, Map, List, Code, HelpCircle, GraduationCap } from 'lucide-react';

interface DeveloperDocsHubProps {
  darkMode: boolean;
}

export default function DeveloperDocsHub({ darkMode }: DeveloperDocsHubProps) {
  const [activeTab, setActiveTab] = useState<'explain' | 'stack' | 'arch' | 'roadmap' | 'files' | 'guide' | 'interview'>('explain');

  return (
    <div className={`rounded-2xl border ${
      darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
    } overflow-hidden flex flex-col min-h-[500px]`}>
      
      {/* Title banner */}
      <div className={`p-5 border-b flex items-center justify-between ${
        darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-150 bg-slate-50'
      }`}>
        <div className="flex items-center gap-2">
          <GraduationCap className={`w-5 h-5 text-violet-500`} />
          <h2 className={`text-sm font-bold tracking-tight font-display ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Project Walkthrough Documentation & Technical Interview Prep</h2>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          darkMode ? 'text-violet-300 bg-violet-950/60 border-violet-900/40' : 'text-violet-605 bg-violet-50 border-violet-200'
        }`}>
          ED-TECH SUITE
        </span>
      </div>

      {/* Embedded Tabs */}
      <div className={`flex border-b text-xs overflow-x-auto whitespace-nowrap scrollbar-none ${
        darkMode ? 'bg-slate-950/90 border-slate-850' : 'bg-slate-50/50 border-slate-150'
      }`}>
        {[
          { id: 'explain', label: '1. What & Why', icon: BookOpen },
          { id: 'stack', label: '2. Tech Stack Customization', icon: Settings },
          { id: 'arch', label: '3. Data Architecture', icon: Map },
          { id: 'roadmap', label: '4. Implementation Plan', icon: List },
          { id: 'files', label: '5. Folder Directories', icon: Code },
          { id: 'guide', label: '6. Install & Local Run', icon: Settings },
          { id: 'interview', label: '7. Technical Q&A Prep', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-3 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-violet-505 text-violet-600 dark:text-violet-400 bg-violet-100/10 dark:bg-slate-900/40 font-display'
                  : 'border-transparent text-slate-400 hover:text-slate-205'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabs Scrolling Content */}
      <div className="p-6 overflow-y-auto space-y-4 bg-slate-900/20 leading-relaxed text-sm text-slate-350 min-h-[350px]">
        
        {/* TAB 1: EXPLANATION */}
        {activeTab === 'explain' && (
          <div className="space-y-4 font-sans">
            <h3 className={`text-md font-extrabold border-b pb-2 font-display ${darkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-150'}`}>Online Learning & Custom Hybrid Recommender</h3>
            
            <div className={`p-4 border rounded-lg text-xs ${
              darkMode ? 'bg-violet-950/30 border-violet-900/50 text-violet-200' : 'bg-violet-50/60 border-violet-100 text-slate-700'
            }`}>
              <p className="font-extrabold text-[10px] text-violet-600 dark:text-violet-300 uppercase tracking-widest mb-1.5 font-mono">CORE CONCEPT OBJECTS</p>
              An Online Learning & Course Recommendation Platform is a smart website where students browse tech courses, enroll inside lessons, complete quizzes, and are automatically guided on what to study next. This platform prevents choice fatigue by dynamically offering recommendations aligned with user interests and target goals.
            </div>

            <div className={`p-4 rounded-lg text-xs border ${
              darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-150 text-slate-705'
            }`}>
              <p className="font-bold text-[10px] text-slate-450 uppercase tracking-wider mb-2 font-mono">TECHNICAL ARCHITECTURE DETAIL</p>
              Behind the UI lives a <strong>Hybrid Recommendation Engine</strong> integrating multiple data sources:
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-650 dark:text-slate-300">
                <li><strong>Content Recommendation:</strong> Correlates TF-IDF categorical tags, key descriptors, and level tags against users' select interest vectors.</li>
                <li><strong>Collaborative Behavior mapping:</strong> Evaluates enrollment occurrences ("co-enrollments") where items taken together by peer cohorts are promoted dynamically.</li>
                <li><strong>Skill-Gap advisor:</strong> Bridges target student careers (e.g., Data Scientist vs. Cloud Architect) with missing skill tags in their profile.</li>
                <li><strong>Gemini 3.5 LLM Mentorship:</strong> Evaluates student history using a server-side agent, designing custom career pathways and micro-explanations.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: TECH STACK MATRIX */}
        {activeTab === 'stack' && (
          <div className="space-y-4">
            <h3 className={`text-md font-extrabold border-b pb-2 font-display ${darkMode ? 'text-white border-slate-800' : 'text-slate-805 border-slate-150'}`}>Tech Stack Comparisons</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
              <div className="border border-slate-800 rounded-xl overflow-hidden p-4 space-y-2 bg-slate-950/20">
                <div className="font-bold text-slate-350 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1.5 font-mono">Option A: Easy Beginner Stack</div>
                <p><strong>Front:</strong> HTML5, CSS3, Vanilla JS web scripts.</p>
                <p><strong>Back:</strong> No server. Static mock arrays persisted inside browser localStorage.</p>
                <p><strong>Recommendation:</strong> Hardcoded mock conditions.</p>
              </div>

              <div className={`border rounded-xl overflow-hidden p-4 space-y-2 ${
                darkMode ? 'border-violet-500/30 bg-violet-950/15' : 'border-violet-200 bg-violet-50/40 text-slate-705'
              }`}>
                <div className="font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest text-[10px] border-b border-violet-800/30 pb-1.5 flex items-center justify-between font-mono">
                  <span>Option B: Core Full-Stack</span>
                  <span className="bg-violet-900/50 text-[9px] px-1.5 py-0.2 text-violet-200 border border-violet-850 rounded">ACTIVE</span>
                </div>
                <p><strong>Front:</strong> React 19, Tailwind CSS 4 utility layout, Lucide Icons, and Motion micro-animations.</p>
                <p><strong>Back:</strong> Express.js node microservice, custom API proxy routes on port 3000, and standard seed database.</p>
                <p><strong>Database:</strong> JSON DB mapping users, courses, interaction metrics, and progress percentages.</p>
                <p><strong>Recommendation:</strong> Content matches, behavioral occurrences, skill gaps, and server-side **Gemini 3.5 Mentoring**.</p>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden p-4 space-y-2 bg-slate-950/20">
                <div className="font-bold text-slate-350 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1.5 font-mono">Option C: Complex Platform Stack</div>
                <p><strong>Front:</strong> Next.js Server Components, custom design components.</p>
                <p><strong>Back:</strong> NestJS API Server, FastAPI prediction model cluster in Python.</p>
                <p><strong>Database:</strong> PostgreSQL with relational Prisma ORM, Redis memory cache, Meilisearch queries.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARCHITECTURE */}
        {activeTab === 'arch' && (
          <div className="space-y-4">
            <h3 className={`text-md font-extrabold border-b pb-2 font-display ${darkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-150'}`}>Flow Architecture</h3>
            
            <div className={`p-4 font-mono rounded-xl text-[11px] overflow-x-auto leading-relaxed text-violet-305 dark:text-violet-400 border ${
              darkMode ? 'bg-slate-955/80 border-slate-850' : 'bg-slate-50 border-slate-150'
            }`}>
{`   [ REACT 19 FRONTEND ]
         │
         ▼ (Fetch API with Authorization Bearer header)
   [ EXPRESS.JS SERVER ] ──▶ [ LOCAL FILE DB - db.json ]
         │                      • Users & Profile states
         │                      • Course lessons & progress
         │                      • Interactions (event pipeline)
         ▼
   [ HYBRID RECOMMENDATION CORE ]
         ├── CO-OCCURRENCE (Peer enroll habits matching)
         ├── CONTENT MATRIX (Cosine similarity equivalents on Tags)
         ├── SKILL-GAP GRAPH (Fulfill target career gaps)
         └── GEMINI AI MENTOR (process.env.GEMINI_API_KEY)
                  └─► Calls gemini-3.5-flash with student context`}
            </div>

            <div className={`p-4 rounded-xl border text-xs text-slate-350 space-y-2 ${
              darkMode ? 'bg-slate-950/30 border-slate-850' : 'bg-slate-50 border-slate-150 text-slate-600'
            }`}>
              <span className="font-bold block uppercase tracking-wider text-[9px] text-slate-450 font-mono">DATABASE SEED SCHEMAS</span>
              <p>Our mock <code>db.json</code> on the server-side persists standard relational tables for user metrics loggings: Users preferences, courses, custom progress percentages, reviews feedback, and activity interactions telemetry events list.</p>
            </div>
          </div>
        )}

        {/* TAB 4: Phase-by-Phase implementation plan */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <h3 className={`text-md font-extrabold border-b pb-2 font-display ${darkMode ? 'text-white border-slate-808' : 'text-slate-805 border-slate-150'}`}>Phase-by-Phase Roadmap</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { title: "Phase 1: Environment Bootstrapping", desc: "Configure Node scripts in package.json, declare TS enums in types.ts." },
                { title: "Phase 2: Database and Seeds Modeling", desc: "Construct low-overhead FS database storage to pre-seed rich simulated developer courses." },
                { title: "Phase 3: Auth & Profile Engine", desc: "Deliver Base64 login credentials & allow structural preference edits." },
                { title: "Phase 4: Course Listing & Detail view", desc: "Visualise course, average review stars, and lessons detail metrics in React." },
                { title: "Phase 5: Enrollment & Tracker", desc: "Wire enrollment hooks and mark lessons watched. Update student completion percentages." },
                { title: "Phase 6: Multi-layer Recommendations", desc: "Formulate behavioral occurrences, skill gaps, and server-side model routing." },
                { title: "Phase 7: Assessment Quizzes", desc: "Provide automated quiz questions per course with instant score calculator." },
                { title: "Phase 8: UI polishing & Dark Mode support", desc: "Deliver customizable theme controller with smooth transitions." },
              ].map((phase, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-slate-950/40 border-slate-850/80 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-700'
                }`}>
                  <span className="font-extrabold text-violet-600 dark:text-violet-400 block mb-1 font-mono text-[10px]">PHASE {idx + 1}: {phase.title}</span>
                  <p className="text-[11px] leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GITHUB FOLDER STRUCTURE */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <h3 className={`text-md font-extrabold border-b pb-2 font-display ${darkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-150'}`}>Proposed GitHub Project Structure</h3>
            
            <div className={`p-4 font-mono rounded-xl text-xs text-violet-605 dark:text-violet-300 border ${
              darkMode ? 'bg-slate-950/80 border-slate-850' : 'bg-slate-50 border-slate-150'
            }`}>
{`edtech-hybrid-recommender/
├── db.json                 <-- Seeded database system
├── server.ts               <-- Core fullstack REST APIs & Recommend logic
├── vite.config.ts          <-- Vite asset pipelines
├── package.json            <-- Modular tool declarations
├── src/
│   ├── main.tsx            <-- UI application bootstrap
│   ├── index.css           <-- Tailwind configuration
│   ├── types.ts            <-- Shared structural TypeScript models
│   ├── App.tsx             <-- Modular view controller & dashboards
│   └── components/
│       ├── CareerGapSection.tsx            <-- SVG circular networks
│       ├── RecommendationHubState.tsx     <-- Recommender switcher
│       ├── AcademicCertificationsPortal.tsx <-- Trophy ledger
│       └── DeveloperDocsHub.tsx            <-- Docs inline tabs
└── README.md               <-- Detailed step-by-step markdown manual`}
            </div>
          </div>
        )}

        {/* TAB 6: INSTALLATION & RUN GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs">
            <h3 className={`text-md font-extrabold border-b pb-2 font-display ${darkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-150'}`}>Execution Guides</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3 border rounded-xl space-y-1 ${darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'}`}>
                <span className="font-bold block text-violet-600 dark:text-violet-400 mb-1 tracking-wider text-[10px] uppercase font-mono">1. Environment Setup</span>
                Create standard <code>.env</code> in root mapping requirements:
                <pre className="p-1.5 bg-slate-900 rounded font-mono text-[10px] text-slate-300 mt-1 leading-none">
{`GEMINI_API_KEY="AI_STUDIO_KEY"
NODE_ENV="production"`}
                </pre>
              </div>

              <div className={`p-3 border rounded-xl space-y-1 ${darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'}`}>
                <span className="font-bold block text-violet-600 dark:text-violet-400 mb-1 tracking-wider text-[10px] uppercase font-mono">2. Run locally</span>
                Use the package loader script on Windows/Mac to run locally:
                <pre className="p-1.5 bg-slate-900 rounded font-mono text-[10px] text-slate-300 mt-1 leading-none">
{`# Install dependencies
npm install

# Start development
npm run dev`}
                </pre>
              </div>

              <div className={`p-3 border rounded-xl space-y-1 ${darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'}`}>
                <span className="font-bold block text-violet-600 dark:text-violet-400 mb-1 tracking-wider text-[10px] uppercase font-mono text-center">3. Production Build Bundle</span>
                Compile client assets and backend code for container ingress:
                <pre className="p-1.5 bg-slate-900 rounded font-mono text-[10px] text-slate-300 mt-1 leading-none">
{`npm run build
npm run start`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: INTERVIEW QUESTIONS & PREPARATION */}
        {activeTab === 'interview' && (
          <div className="space-y-4 font-sans">
            <h3 className={`text-sm font-extrabold border-b pb-2 font-display ${darkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-150'}`}>Edtech Architect Interview Preparation Q&A</h3>
            
            <div className="space-y-3 text-xs overflow-y-auto max-h-[400px]">
              {[
                {
                  q: "Explain your Online Learning & Course Recommendation Platform project.",
                  a: "I built a full-stack ed-tech application in modern React 19 and Express.js featuring user learning records, lesson trackers, automated quizzes, and a hybrid recommendation engine. The recommendation engine implements layered strategies: client profile interest-category matching, student peer co-occurrence (collaborative behavior patterns), skill-gap targeting against clear careers, and interactive, personalized career coaching powered by server-side Gemini 3.5 AI APIs."
                },
                {
                  q: "What is a Hybrid Recommendation System, and how is it implemented here?",
                  a: "A hybrid recommender combines content-based metrics (aligning user tags with item metadata tags to prevent the 'cold start' problem) with collaborative filtering behaviors (associating course co-occurrences where peers frequently take similar courses). This platform merges categorical tagging correlations, target career competencies, and LLM reasoning vectors to serve highly relevant, diverse course suggestions."
                },
                {
                  q: "How does the platform secure environment keys, like the Gemini API key?",
                  a: "The architecture adheres strictly to secure guidelines by running server-side APIs via Express. The Gemini API client is initialized server-side inside `server.ts` using `process.env.GEMINI_API_KEY` and never leaks to the client browser. All frontend recommendation queries hit the server endpoint `/api/reco` which evaluates recommendations under server boundaries and returns the safe response."
                },
                {
                  q: "How does progress tracking and completion logic function over multiple lessons?",
                  a: "Progress is tracked per lesson via `/api/progress`. When a student interacts with a lesson, it tracks the duration elapsed. Once a student marks all associated lessons complete, the system automatically transitions the overall course enrollment state to COMPLETED, noting the exact timing and unlocking the dynamic quiz evaluation screens."
                },
                {
                  q: "What is the benefit of bundling the backend Server into a CJS file during production builds?",
                  a: "Our node environment uses standard ES modules natively. Compiling `server.ts` to `dist/server.cjs` with `esbuild` bundles all custom TypeScript files while keeping external libraries out. This completely avoids rigid ES module path matching checks at Node runtime and significantly speeds up container starting performance."
                }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-slate-950/60 border-slate-850 hover:border-slate-800' : 'bg-slate-50 border-slate-150 hover:border-violet-200'
                } transition-colors`}>
                  <p className="font-extrabold text-violet-605 dark:text-violet-400 mb-1.5 leading-snug">Q{idx + 1}: {item.q}</p>
                  <p className="text-slate-500 dark:text-slate-300 italic leading-relaxed">"{item.a}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
