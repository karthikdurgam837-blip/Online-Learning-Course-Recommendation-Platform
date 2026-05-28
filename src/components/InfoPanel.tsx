/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Map, HelpCircle, Code, Settings, List, HelpCircle as QuestionIcon } from 'lucide-react';

interface InfoPanelProps {
  onClose: () => void;
}

export default function InfoPanel({ onClose }: InfoPanelProps) {
  const [activeTab, setActiveTab] = useState<'explain' | 'stack' | 'arch' | 'phases' | 'folder' | 'guide' | 'interview'>('explain');

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[640px] bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col z-50 shadow-2xl h-full font-sans overflow-hidden">
      {/* Panel Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-slate-100">Project Documentation & Interview Kit</h2>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
        >
          Close Documentation
        </button>
      </div>

      {/* Embedded Tabs */}
      <div className="bg-slate-950 flex border-b border-slate-800 text-xs scrollbar-none overflow-x-auto whitespace-nowrap">
        {[
          { id: 'explain', label: '1. What & Why', icon: BookOpen },
          { id: 'stack', label: '2. Tech Stack', icon: Settings },
          { id: 'arch', label: '3. Architecture', icon: Map },
          { id: 'phases', label: '4. Phase Plan', icon: List },
          { id: 'folder', label: '5. Folders', icon: Code },
          { id: 'guide', label: '6. Install Guide', icon: Settings },
          { id: 'interview', label: '7. Interview Q&A', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 font-medium border-b-2 transition-all ${
                isSelected
                  ? 'border-violet-500 text-violet-400 bg-slate-900/55'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabs Scrolling Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900 leading-relaxed text-sm text-slate-300">
        
        {/* TAB 1: EXPLANATION */}
        {activeTab === 'explain' && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-white border-b border-slate-800 pb-2">Online Learning & Custom Hybrid Recommender</h3>
            
            <div className="p-3 bg-violet-950/40 border border-violet-900/60 rounded-lg text-violet-200">
              <p className="font-semibold text-xs text-violet-350 uppercase tracking-wider mb-1">Simple Concept Explanation</p>
              An Online Learning & Course Recommendation Platform is a smart website where students browse tech courses, enroll inside lessons, complete quizzes, and are automatically guided on what to study next. This platform prevents choice fatigue by dynamically offering recommendations aligned with user interests and target goals.
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1">Technical Deep-Dive</p>
              Behind the UI lives a <strong>Hybrid Recommendation Engine</strong> integrating multiple data sources:
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-slate-300">
                <li><strong>Content Recommendation:</strong> Correlates TF-IDF categorical tags, key descriptors, and level tags against users' select interest vectors.</li>
                <li><strong>Collaborative Behavior mapping:</strong> Evaluates enrollment occurrences ("co-enrollments") where items taken together by peer cohorts are promoted dynamically.</li>
                <li><strong>Skill-Gap advisor:</strong> Bridges target student careers (e.g., Data Scientist vs. Cloud Architect) with missing skill tags in their profile.</li>
                <li><strong>Gemini 3.5 LLM Mentorship:</strong> Evaluates student history using a server-side agent, designing custom career pathways and micro-explanations.</li>
              </ul>
            </div>

            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mt-4">Why is this useful?</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800">
                <span className="font-semibold block text-violet-400">For Learners</span>
                Aligns and tracks study goals without guessing next vectors.
              </div>
              <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800">
                <span className="font-semibold block text-violet-400">For EdTech / Universities</span>
                Boosts retention engagement and guides continuous completions.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECH STACK MATRIX */}
        {activeTab === 'stack' && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-white border-b border-slate-800 pb-2">Comparison of Project Tech Stacks</h3>
            
            <div className="space-y-4 text-xs">
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-950 p-2 font-bold text-violet-400 border-b border-slate-800">Option A: Easy Beginner Stack</div>
                <div className="p-3 space-y-1">
                  <p><strong>Front:</strong> HTML5, CSS3, Vanilla JS web scripts.</p>
                  <p><strong>Back:</strong> No server. Static mock arrays persisted inside browser localStorage.</p>
                  <p><strong>Recommendation:</strong> Hardcoded mock conditions.</p>
                </div>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden border-violet-500/30">
                <div className="bg-violet-950/30 p-2 font-bold text-violet-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Option B: Core Full-Stack (Our Applied Strategy)</span>
                  <span className="bg-violet-900 text-violet-200 px-1.5 py-0.5 rounded text-[10px]">SELECTED BEST</span>
                </div>
                <div className="p-3 space-y-1 bg-slate-900/50">
                  <p><strong>Front:</strong> React 19, Tailwind CSS 4 utility layout, Lucide Icons, and Motion micro-animations.</p>
                  <p><strong>Back:</strong> Express.js node microservice, custom API proxy routes on port 3000, and standard seed database.</p>
                  <p><strong>Database:</strong> JSON DB mapping users, courses, interaction metrics, and progress percentages.</p>
                  <p><strong>Recommendation:</strong> Content matches, behavioral occurrences, skill gaps, and server-side **Gemini 3.5 Mentoring**.</p>
                </div>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-950 p-2 font-bold text-violet-400 border-b border-slate-800">Option C: Complex Platform Stack</div>
                <div className="p-3 space-y-1">
                  <p><strong>Front:</strong> Next.js Server Components, custom design components.</p>
                  <p><strong>Back:</strong> NestJS API Server, FastAPI prediction model cluster in Python.</p>
                  <p><strong>Database:</strong> PostgreSQL with relational Prisma ORM, Redis memory cache, Meilisearch queries.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARCHITECTURE */}
        {activeTab === 'arch' && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-white border-b border-slate-800 pb-2">Flow Architecture</h3>
            
            <div className="p-3 font-mono bg-slate-950 rounded text-[11px] overflow-x-auto leading-tight text-violet-400">
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

            <h4 className="font-semibold text-xs text-white uppercase tracking-wider mt-4">Database Schema Equivalents:</h4>
            <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
              <li><strong>Users Table:</strong> id, email, role, select interest tags, skills list, target career targets.</li>
              <li><strong>Courses Table:</strong> id, title, category, skills taught, description, tags, average rating.</li>
              <li><strong>Enrollments Table:</strong> id, user link, course link, active/completed status, startedAt.</li>
              <li><strong>Progress Table:</strong> id, enrollment link, lesson link, completed boolean, watched seconds.</li>
              <li><strong>Interactions Table:</strong> id, user link, course link, logged event (enroll, view, click_reco).</li>
            </ul>
          </div>
        )}

        {/* TAB 4: PHASE PLAN */}
        {activeTab === 'phases' && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-white border-b border-slate-800 pb-2">Phase-by-Phase Roadmap</h3>
            
            <div className="space-y-3 text-xs">
              {[
                { title: "Phase 1: Environment Bootstrapping", desc: "Configure Node scripts in package.json, declare TS enums in src/types.ts." },
                { title: "Phase 2: Database and Seeds Modeling", desc: "Construct low-overhead FS database storage to pre-seed rich simulated developer courses and lesson content." },
                { title: "Phase 3: Auth & Profile Engine", desc: "Deliver Base64 login generators & allow modifying interest tags, skill sets and carrier path goals." },
                { title: "Phase 4: Course Listing & Detail view", desc: "Visualise course, average review stars, and lessons detail metrics in React." },
                { title: "Phase 5: Enrollment & Tracker", desc: "Wire enrollment hooks and mark lessons watched. Update student completion percentages in runtime." },
                { title: "Phase 6: Multi-layer Recommendations", desc: "Formulate behavioral occurrences, skill gaps, and server-side model routing via `@google/genai`." },
                { title: "Phase 7: Assessment Quizzes", desc: "Provide automated quiz questions per course with instant score calculator." },
                { title: "Phase 8: UI polishing & Dark Mode support", desc: "Deliver customizable theme controller with smooth transitions." },
              ].map((phase, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/40 rounded border border-slate-800/80">
                  <span className="font-semibold text-violet-400 block mb-0.5">Phase {idx + 1}: {phase.title}</span>
                  <p className="text-slate-300">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GITHUB FOLDER STRUCTURE */}
        {activeTab === 'folder' && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-white border-b border-slate-800 pb-2">Proposed GitHub Project Structure</h3>
            
            <div className="p-3 font-mono bg-slate-950 rounded text-xs text-violet-300">
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
│       └── InfoPanel.tsx   <-- Documentation slider panel
└── README.md               <-- Detailed step-by-step markdown manual`}
            </div>
          </div>
        )}

        {/* TAB 6: INSTALLATION & RUN GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-md font-semibold text-white text-sm border-b border-slate-800 pb-2">Execution Guides</h3>
            
            <div className="space-y-3">
              <div className="bg-slate-950 p-2.5 border border-slate-800 rounded">
                <span className="font-semibold block text-violet-400 mb-1">1. Environment Setup</span>
                Create standard `.env` in root mapping requirements:
                <pre className="p-1 bg-slate-900 rounded text-[10px] text-slate-300 mt-1">
{`GEMINI_API_KEY="AI_STUDIO_KEY"
NODE_ENV="production"`}
                </pre>
              </div>

              <div className="bg-slate-950 p-2.5 border border-slate-800 rounded">
                <span className="font-semibold block text-violet-400 mb-1">2. Run locally</span>
                Use the package loader script on Windows/Mac to run locally:
                <pre className="p-1 bg-slate-900 rounded text-[10px] text-slate-300 mt-1">
{`# Install dependencies
npm install

# Start full-stack development instance (Express is hot-reloaded by tsx)
npm run dev`}
                </pre>
              </div>

              <div className="bg-slate-950 p-2.5 border border-slate-800 rounded">
                <span className="font-semibold block text-violet-400 mb-1">3. Production Bundle Build</span>
                Compile client assets and backend code for container ingress:
                <pre className="p-1 bg-slate-900 rounded text-[10px] text-slate-300 mt-1">
{`npm run build
npm run start`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: INTERVIEW QUESTIONS & PREPARATION */}
        {activeTab === 'interview' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">Ed-Tech Interview Preparation Q&A</h3>
            
            <div className="space-y-4 text-xs">
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
                  q: "What is the benefit of bunding the backend Server into a CJS file during production builds?",
                  a: "Our node environment uses standard ES modules natively. Compiling `server.ts` to `dist/server.cjs` with `esbuild` bundles all custom TypeScript files while maintaining external libraries out. This completely avoids rigid ES module path matching checks at Node runtime and significantly speeds up container starting performance."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 rounded border border-slate-800 hover:border-slate-700 transition-colors">
                  <p className="font-bold text-violet-400 mb-1">Q{idx + 1}: {item.q}</p>
                  <p className="text-slate-300 italic">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
