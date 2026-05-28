/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Sparkles, Brain, Compass, BookOpenCheck, User, Award,
  CheckCircle, Clock, Star, Search, ArrowRight, ChevronRight, Play,
  Send, Layers, Activity, Check, RotateCcw, FileText, Moon, Sun,
  Plus, X, HelpCircle, GraduationCap, BarChart2, ShieldAlert, Zap,
  Download, ExternalLink, Calendar, CheckSquare, Settings, LogOut,
  Sliders, ShieldCheck, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InfoPanel from './components/InfoPanel.tsx';
import CareerGapSection from './components/CareerGapSection.tsx';
import RecommendationHubState from './components/RecommendationHubState.tsx';
import AcademicCertificationsPortal from './components/AcademicCertificationsPortal.tsx';
import DeveloperDocsHub from './components/DeveloperDocsHub.tsx';
import { Role, Level, EnrollStatus, User as UserType, Course, Lesson, Quiz, QuizAttempt, Enrollment, Progress, Rating, Interaction } from './types.ts';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edtech_theme');
    return saved ? saved === 'dark' : true; // Default to sleek tech dark mode
  });

  // Authentication states
  const [user, setUser] = useState<UserType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('edtech_reco_token'));
  const [loginEmail, setLoginEmail] = useState<string>('student@learning.edu');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Custom profile update states
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>('');
  const [profileCareer, setProfileCareer] = useState<string>('');
  const [profileInterests, setProfileInterests] = useState<string[]>([]);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [newInterestInput, setNewInterestInput] = useState<string>('');

  // Course exploration catalog state
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessons, setActiveLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Users enrollment and tracking state
  const [enrollments, setEnrollments] = useState<any[]>([]); // Enriched enrollments
  const [activeEnrollment, setActiveEnrollment] = useState<any | null>(null);
  const [lessonSecondsWatched, setLessonSecondsWatched] = useState<number>(0);
  const [isSimulatingPlayback, setIsSimulatingPlayback] = useState<boolean>(false);
  const playbackTimerRef = useRef<any>(null);

  // Quizzes states
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: number }>({});
  const [quizAttemptOutcome, setQuizAttemptOutcome] = useState<QuizAttempt | null>(null);

  // Academic certification milestone modal state
  const [viewingCertificateCourse, setViewingCertificateCourse] = useState<Course | null>(null);

  // Ratings & reviews state
  const [courseRatings, setCourseRatings] = useState<Rating[]>([]);
  const [userRatingStars, setUserRatingStars] = useState<number>(5);
  const [userRatingComment, setUserRatingComment] = useState<string>('');
  const [ratingError, setRatingError] = useState<string | null>(null);

  // Recommendations state
  const [recoModelStrategy, setRecoModelStrategy] = useState<'hybrid' | 'skills' | 'item-item' | 'ai' | 'skillgap'>('hybrid');
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [recoExplanation, setRecoExplanation] = useState<string>('');
  const [isRecoLoading, setIsRecoLoading] = useState<boolean>(false);

  // UI state layout controllers
  const [showDocHub, setShowDocHub] = useState<boolean>(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'learn' | 'explore' | 'career' | 'recommendations' | 'certifications' | 'docs'>('learn');
  const [globalNotification, setGlobalNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Recruiter Guided Walkthrough diagnostic manager
  const [simulationStep, setSimulationStep] = useState<number>(0);

  // Sync themes across HTML nodes
  useEffect(() => {
    localStorage.setItem('edtech_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Fetch initial profile if token exists
  useEffect(() => {
    if (authToken) {
      fetchProfile();
    } else {
      handleAutoLogin();
    }
  }, [authToken]);

  // Fetch catalog on categorization edits
  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, searchQuery]);

  // Fetch recommendations dynamically on session strategy changes
  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, recoModelStrategy]);

  // Update simulator playback steps
  useEffect(() => {
    if (isSimulatingPlayback && activeLesson) {
      playbackTimerRef.current = setInterval(() => {
        setLessonSecondsWatched(prev => {
          const nextVal = prev + 30; // High speed multiplier for study walkthrough
          if (nextVal >= activeLesson.durationS) {
            setIsSimulatingPlayback(false);
            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
            showNotify('info', `Simulated study complete: click "Mark Lesson Completed" to claim syllabus credit!`);
            return activeLesson.durationS;
          }
          return nextVal;
        });
      }, 500);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isSimulatingPlayback, activeLesson]);

  // Interactive quick notification bubbles
  const showNotify = (type: 'success' | 'info', text: string) => {
    setGlobalNotification({ type, text });
    setTimeout(() => setGlobalNotification(null), 5000);
  };

  // 1-Click Simulated Walker Pipeline Seeder
  const triggerSimulationWalkthrough = async (stepIndex?: number) => {
    const nextStep = stepIndex !== undefined ? stepIndex : (simulationStep + 1 > 5 ? 0 : simulationStep + 1);
    
    if (nextStep === 0) {
      setSimulationStep(0);
      logout();
      showNotify('info', 'Evaluator Session reset. Interactive pipeline is cleared.');
      return;
    }

    if (nextStep === 1) {
      // Step 1: Sign in
      setLoginEmail('student@learning.edu');
      await handleAutoLogin();
      setSimulationStep(1);
      setActiveDashboardTab('career'); // Go to Profile/Career Analyser View!
      showNotify('success', '1. Authenticated: Loaded student@learning.edu with pre-populated interests & skills!');
    } else if (nextStep === 2) {
      // Step 2: Enroll in target React course
      const targetCourse = courses.find(c => c.id === 'c-react-full') || courses[0];
      if (targetCourse) {
        await handleEnroll(targetCourse.id);
        setSimulationStep(2);
        setActiveDashboardTab('learn'); // Go to Learning view to play!
        showNotify('success', `2. Syllabus Enrolled: Joined "${targetCourse.title}" successfully!`);
      }
    } else if (nextStep === 3) {
      // Step 3: Fast-forward learning state to 100% complete
      const targetCourseId = 'c-react-full';
      await loadCoursePlayer(targetCourseId);
      
      // Lazily ensure enrollment object is loaded in player context
      const matchedEnroll = enrollments.find(e => e.courseId === targetCourseId);
      const enId = matchedEnroll ? matchedEnroll.id : 'enroll-init-1';

      try {
        // Complete lessons in swift sequence in db.json for recruiter demonstration
        const lessonsRes = await fetch(`/api/lessons/course/${targetCourseId}`);
        const lessonsList: Lesson[] = await lessonsRes.json();
        
        for (const les of lessonsList) {
          await fetch('/api/progress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify({
              enrollmentId: enId,
              lessonId: les.id,
              completed: true,
              secondsWatched: les.durationS
            })
          });
        }

        await fetchEnrollments();
        await loadCoursePlayer(targetCourseId); // reload updated progress percentages
        setSimulationStep(3);
        setActiveDashboardTab('learn');
        showNotify('info', '3. Syllabus Completed: All lessons fast-forwarded to completed status (100%)!');
      } catch (err) {
        showNotify('info', 'Walkthrough fast-forward error. Make sure to log in.');
      }
    } else if (nextStep === 4) {
      // Step 4: Pass verification quiz
      if (activeQuiz) {
        const correctAnswers: { [index: number]: number } = {};
        activeQuiz.questions.forEach((q, idx) => {
          correctAnswers[idx] = q.answerIndex; // Load cheat codes for walkthrough passing
        });
        setSelectedAnswers(correctAnswers);
        
        // Auto submit quiz answers
        try {
          const res = await fetch('/api/quizzes/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify({
              quizId: activeQuiz.id,
              answers: Object.keys(correctAnswers).map(k => correctAnswers[Number(k)])
            })
          });
          const data = await res.json();
          if (res.ok) {
            setQuizAttemptOutcome(data);
            showNotify('success', '4. Milestone Checked: Passed criteria quiz at 100%! Diploma unlocked.');
            await fetchEnrollments(); // Update status state
            setActiveDashboardTab('certifications'); // Redirect to awards center!
          }
        } catch {
          showNotify('info', 'Assessment submission failed.');
        }
        setSimulationStep(4);
      } else {
        showNotify('info', 'Please complete step 3 beforehand to build player structures.');
      }
    } else if (nextStep === 5) {
      // Step 5: Toggle Gemini Career Mentorship Recommender
      setRecoModelStrategy('ai');
      setSimulationStep(5);
      setActiveDashboardTab('recommendations'); // Go to Strategy View!
      showNotify('success', '5. AI Activated: Querying server-side Gemini flash-3.5 engine matching target career gap!');
    }
  };

  const handleAutoLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('edtech_reco_token', data.token);
        setAuthToken(data.token);
        setUser(data.user);
        setProfileName(data.user.name);
        setProfileCareer(data.user.targetCareer || '');
        setProfileInterests(data.user.interests || []);
        setProfileSkills(data.user.skills || []);
        setAuthError(null);
      } else {
        setAuthError(data.error);
      }
    } catch (err) {
      setAuthError('Connection failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('edtech_reco_token');
    setAuthToken(null);
    setUser(null);
    setActiveCourseId(null);
    setActiveCourse(null);
    setViewingCertificateCourse(null);
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    setIsSimulatingPlayback(false);
    setSimulationStep(0);
    showNotify('info', 'Active session cleared. Recruiter parameters reset.');
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setProfileName(data.name);
        setProfileCareer(data.targetCareer || '');
        setProfileInterests(data.interests || []);
        setProfileSkills(data.skills || []);
        fetchEnrollments();
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: profileName,
          interests: profileInterests,
          skills: profileSkills,
          targetCareer: profileCareer
        })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setIsEditingProfile(false);
        showNotify('success', 'Student profile vectors and career targets updated!');
      }
    } catch (err) {
      showNotify('info', 'Could not sync update profile options.');
    }
  };

  const addSkillTag = () => {
    if (newSkillInput.trim() && !profileSkills.includes(newSkillInput.trim())) {
      setProfileSkills([...profileSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const removeSkillTag = (tag: string) => {
    setProfileSkills(profileSkills.filter(s => s !== tag));
  };

  const addInterestTag = () => {
    if (newInterestInput.trim() && !profileInterests.includes(newInterestInput.trim())) {
      setProfileInterests([...profileInterests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const removeInterestTag = (tag: string) => {
    setProfileInterests(profileInterests.filter(i => i !== tag));
  };

  const fetchCourses = async () => {
    try {
      let url = '/api/courses';
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      }
    } catch (err) {
      console.error('Failed to stream course listings.');
    }
  };

  const fetchEnrollments = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/enrollments', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollments(data);
        if (activeCourseId) {
          const match = data.find((e: any) => e.courseId === activeCourseId);
          setActiveEnrollment(match || null);
        }
      }
    } catch (err) {
      console.error('Failed to load active enrolled profiles.');
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!authToken) {
      showNotify('info', 'Please sign in first to test enrollment telemetry!');
      return;
    }
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ courseId })
      });
      const data = await res.json();
      if (res.ok) {
        showNotify('success', `Joined catalog path "${courses.find(c => c.id === courseId)?.title || 'Course'}"! Tracker initialized.`);
        await fetchEnrollments();
        await fetchRecommendations();
        setActiveDashboardTab('learn');
        await loadCoursePlayer(courseId);
      }
    } catch (err) {
      showNotify('info', 'Enrollment stream connection dropped.');
    }
  };

  const loadCoursePlayer = async (courseId: string) => {
    try {
      setActiveCourseId(courseId);
      const matchedCourse = courses.find(c => c.id === courseId) || await (await fetch(`/api/courses/${courseId}`)).json();
      setActiveCourse(matchedCourse);

      // Fetch lessons syllabus
      const resLessons = await fetch(`/api/lessons/course/${courseId}`);
      if (resLessons.ok) {
        const lessonsData = await resLessons.json();
        setActiveLessons(lessonsData);
        if (lessonsData.length > 0) {
          setActiveLesson(lessonsData[0]);
          setLessonSecondsWatched(0);
          setIsSimulatingPlayback(false);
        }
      }

      // Link progress state
      const matchedEnroll = enrollments.find(e => e.courseId === courseId);
      if (matchedEnroll) {
        setActiveEnrollment(matchedEnroll);
      }

      // Load cohort reviews
      const resRatings = await fetch(`/api/ratings/course/${courseId}`);
      if (resRatings.ok) {
        setCourseRatings(await resRatings.json());
      }

      // Load quizzes
      const resQuizzes = await fetch(`/api/quizzes/course/${courseId}`);
      if (resQuizzes.ok) {
        const quizzesData = await resQuizzes.json();
        setQuizzes(quizzesData);
        if (quizzesData.length > 0) {
          setActiveQuiz(quizzesData[0]);
          setSelectedAnswers({});
          setQuizAttemptOutcome(null);
        } else {
          setActiveQuiz(null);
        }
      }

      // Interact logger view tag
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authToken ? `Bearer ${authToken}` : '' },
        body: JSON.stringify({ courseId, event: 'view' })
      });

    } catch (err) {
      showNotify('info', 'Failed to fetch course lessons syllabus.');
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setLessonSecondsWatched(0);
    setIsSimulatingPlayback(false);
  };

  const submitProgressState = async (completed: boolean) => {
    if (!activeEnrollment || !activeLesson) return;
    try {
      const res = await fetch('/api/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          enrollmentId: activeEnrollment.id,
          lessonId: activeLesson.id,
          completed,
          secondsWatched: lessonSecondsWatched
        })
      });
      if (res.ok) {
        showNotify('success', `Progress synced: ${completed ? 'Lesson Completed!' : 'Watched duration recorded.'}`);
        await fetchEnrollments(); 
        await loadCoursePlayer(activeCourseId!);
      }
    } catch (err) {
      showNotify('info', 'Study metrics offline. Sync failed.');
    }
  };

  const submitStarsReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !activeCourseId) return;
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          courseId: activeCourseId,
          stars: userRatingStars,
          comment: userRatingComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotify('success', 'Review verified and published inside students logs.');
        setUserRatingComment('');
        setCourseRatings([data, ...courseRatings]);
        setRatingError(null);
        fetchCourses();
      } else {
        setRatingError(data.error);
      }
    } catch {
      setRatingError('Comment creation failed.');
    }
  };

  const submitQuizAnswers = async () => {
    if (!activeQuiz || !authToken) return;
    const answerIndices = Object.keys(selectedAnswers).map(k => selectedAnswers[Number(k)]);
    
    if (Object.keys(selectedAnswers).length < activeQuiz.questions.length) {
      showNotify('info', 'Complete all multiple choices before submitting.');
      return;
    }

    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers: answerIndices
        })
      });
      const data = await res.json();
      if (res.ok) {
        setQuizAttemptOutcome(data);
        if (data.passed) {
          showNotify('success', `Milestone Completed! Clean pass scored at ${data.scorePct}%!`);
          await fetchEnrollments();
          await loadCoursePlayer(activeCourseId!);
        } else {
          showNotify('info', `Under score limits. Reached ${data.scorePct}%. (Passing: ${activeQuiz.passPct}%)`);
        }
      }
    } catch (err) {
      showNotify('info', 'Quiz grading service connection lost.');
    }
  };

  const fetchRecommendations = async () => {
    setIsRecoLoading(true);
    try {
      const res = await fetch(`/api/reco?strategy=${recoModelStrategy}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      const data = await res.json();
      if (res.ok) {
        setRecommendedCourses(data.courses || []);
        setRecoExplanation(data.explanation || '');
      }
      setIsRecoLoading(false);
    } catch (err) {
      setIsRecoLoading(false);
      console.error('Dynamic recommendations calculations query failed.');
    }
  };

  const targetCareerSkills = [
    { name: "React 19", weight: 8 },
    { name: "TypeScript", weight: 9 },
    { name: "Docker", weight: 7 },
    { name: "Python", weight: 8 },
    { name: "Deep Learning", weight: 10 },
    { name: "Threat Modeling", weight: 6 },
    { name: "Kubernetes", weight: 8 }
  ];

  const currentSkillsCount = user?.skills.length || 0;
  const targetCareerTitle = user?.targetCareer || 'Full Stack AI Architect';
  const matchingSkillsInInventory = targetCareerSkills.filter(s =>
    user?.skills.some(us => us.toLowerCase() === s.name.toLowerCase())
  );
  
  const alignmentPercentage = Math.min(Math.round((matchingSkillsInInventory.length / targetCareerSkills.length) * 100), 100);

  // Helper values for sidebar statistics
  const completedPathsCount = enrollments.filter(e => e.status === EnrollStatus.COMPLETED).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-850'} transition-colors duration-300 font-sans antialiased text-sm flex flex-col`}>
      
      {/* BANNER NOTIFICATIONS */}
      <AnimatePresence>
        {globalNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="global-alert-banner" 
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4.5 py-3 rounded-xl shadow-2xl transition-all border ${
              globalNotification.type === 'success' 
                ? 'bg-violet-950/95 border-violet-500/30 text-violet-200' 
                : 'bg-violet-950/95 border-violet-500/30 text-violet-200'
            }`}
          >
            {globalNotification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-violet-400 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-violet-400 shrink-0 animate-pulse" />
            )}
            <span className="text-xs font-semibold leading-relaxed tracking-tight">{globalNotification.text}</span>
            <button onClick={() => setGlobalNotification(null)} className="hover:opacity-85 text-slate-400 p-0.5 ml-2 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL TOP HEADER SECTOR */}
      <header id="platform-main-header" className={`sticky top-0 z-45 border-b backdrop-blur-md transition-colors ${
        darkMode ? 'bg-slate-950/90 border-slate-900' : 'bg-white/90 border-slate-205 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="relative bg-violet-600 text-white p-2 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
              <Brain className="w-[18px] h-[18px] text-violet-100 stroke-[2]" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-display">
                EdEasy Learning Systems
              </span>
              <p className="text-[8px] uppercase font-bold tracking-widest text-slate-400 block -mt-1 font-mono">
                AI Cognitive Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Walkthrough Status Badge */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${
              darkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
              <span className="text-[10px] text-slate-400 font-mono">SERVER STATUS: OK</span>
            </div>

            {/* Theme Selector */}
            <button
              id="theme-toggle-controller"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-800 text-yellow-500 hover:bg-slate-850' : 'bg-white border-slate-200 text-violet-600 hover:bg-slate-100'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Recruiter Simulator Walkthrough Pipeline Controller in Header */}
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-lg p-0.5">
              <button
                onClick={() => triggerSimulationWalkthrough()}
                className="px-2.5 py-1 text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 hover:bg-amber-500/30 rounded-md transition-all flex items-center gap-1 cursor-pointer animate-pulse"
              >
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <span>Sim Step {simulationStep}</span>
              </button>
              <button
                onClick={() => triggerSimulationWalkthrough(0)}
                className="p-1 text-[10px] text-red-400 hover:text-red-300 font-bold hover:bg-red-950/20 rounded cursor-pointer"
                title="Reset simulation parameters"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FLOATING DIAGNOSTIC EVALUATOR PLATFORM - RECRUITER MINI BAR */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mt-3.5 w-full">
        <div className={`p-3 px-4.5 rounded-xl border ${
          darkMode ? 'bg-violet-950/10 border-violet-900/40' : 'bg-violet-50/40 border-violet-100'
        } flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden`}>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-slate-400 leading-none">
              <strong className="text-slate-350">Recruiter Evaluation:</strong> Try our pre-baked simulation workflow steps to see immediate completion metrics state updates!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {[
              { step: 1, label: '1. Auth Profile' },
              { step: 2, label: '2. Joint Course' },
              { step: 3, label: '3. Fast Completion (100%)' },
              { step: 4, label: '4. Pass Quiz' },
              { step: 5, label: '5. AI Mentor' }
            ].map(pill => {
              const matchesActive = simulationStep === pill.step;
              return (
                <button
                  key={pill.step}
                  onClick={() => triggerSimulationWalkthrough(pill.step)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-md transition-all border text-center cursor-pointer leading-none ${
                    matchesActive
                      ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER WORKSPACE STRUCTURE */}
      <main className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 w-full pb-20">
        
        {/* LEFT COMPREHENSIVE SIDE NAVIGATION MENU PAGE LINK CONTROLLERS */}
        <section id="student-sidebar-menu" className="lg:col-span-3 space-y-4">
          
          {/* USER QUICK GREETINGS BADGE CONTROLLER */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
          } space-y-3`}>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-violet-500/15 font-display shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold leading-none truncate font-display text-slate-105">{user.name}</span>
                  <span className="block text-[10px] text-violet-400 font-bold truncate mt-1 leading-none font-mono">{user.targetCareer || 'Fullstack Engineer'}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md shrink-0 cursor-pointer"
                  title="Sign out of student account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`flex-1 px-2.5 py-1 text-xs rounded-lg outline-none border focus:ring-1 focus:ring-violet-500 ${
                      darkMode ? 'bg-slate-950 border-slate-805 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                    placeholder="student@learning.edu"
                  />
                  <button
                    onClick={handleAutoLogin}
                    className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Login
                  </button>
                </div>
                {authError && <p className="text-[9px] text-red-400 font-mono text-center">{authError}</p>}
              </div>
            )}
            
            {/* Quick telemetry ticks counter */}
            {user && (
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono leading-none">
                <span>Paths Enrolled: <strong className="text-slate-250 font-sans">{enrollments.length}</strong></span>
                <span>Completed: <strong className="text-violet-400 font-bold font-sans">{completedPathsCount}</strong></span>
              </div>
            )}
          </div>

          {/* DYNAMIC NAV MENU LIST ITEM ACTIONS */}
          <div className={`p-2.5 rounded-xl border ${
            darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-205 shadow-sm'
          } space-y-1`}>
            {[
              { id: 'learn', label: 'My Enrolled Study Player', sub: 'Course syllabus playing sandbox', icon: BookOpenCheck, count: enrollments.length },
              { id: 'explore', label: 'EdEasy Course Catalog', sub: 'Dynamic skill courses indices', icon: Compass },
              { id: 'career', label: 'Career Gap Analyser', sub: 'Student targets alignment wheel', icon: BarChart2, highlight: alignmentPercentage > 0 },
              { id: 'recommendations', label: 'AI Recommender Core', sub: 'Generative hybrid matching engine', icon: Sparkles, badge: recoModelStrategy.toUpperCase() },
              { id: 'certifications', label: 'My Academic Diplomas', sub: 'Gold physical sealed awards seals', icon: Award, count: completedPathsCount },
              { id: 'docs', label: 'Walkthrough Docs Q&A', sub: 'Full setup guides & interview answers', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeDashboardTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveDashboardTab(tab.id as any);
                    // Reset single view context if clicking explore
                    if (tab.id === 'explore') setActiveCourseId(null);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow shadow-violet-500/10'
                      : 'text-slate-400 hover:text-slate-105 hover:bg-slate-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-md ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-slate-950/45 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold leading-none">{tab.label}</span>
                      <span className={`block text-[8px] truncate mt-0.5 ${
                        isSelected ? 'text-violet-100' : 'text-slate-400'
                      }`}>{tab.sub}</span>
                    </div>
                  </div>

                  {tab.count !== undefined && tab.count > 0 ? (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full font-sans leading-none ${
                      isSelected ? 'bg-white text-violet-600' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {tab.count}
                    </span>
                  ) : tab.badge ? (
                    <span className={`text-[7px] font-black tracking-tight px-1 py-0.2 rounded font-mono select-none ${
                      isSelected ? 'bg-amber-500 text-white' : 'bg-amber-955/20 text-amber-450 border border-amber-500/10'
                    }`}>
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-850 text-center text-[10px] text-slate-500 font-mono">
            EdEasy Edtech • Version 4.2.0
          </div>
        </section>

        {/* RIGHT FULL-SCALE WORKSPACE PANEL */}
        <section id="developer-workspace-panels" className="lg:col-span-9 space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDashboardTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* PAGE 1: MY ACTIVE CURRICULUM SYLLABUS AND LESSON PLAYER */}
              {activeDashboardTab === 'learn' && (
                <div className="space-y-6">
                  {activeCourseId ? (
                    /* EXTENDED PLAYER & TESTING CENTER */
                    <div className={`p-6 rounded-2xl border transition-colors ${
                      darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <button
                        onClick={() => setActiveCourseId(null)}
                        className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-350 font-extrabold mb-4 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 cursor-pointer transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                        <span>Back to curriculum dashboard</span>
                      </button>

                      <div className="space-y-4">
                        <div className="pb-3 border-b border-slate-850">
                          <span className="text-[10px] uppercase font-black text-violet-400 tracking-wider bg-violet-950/50 px-2.5 py-1 rounded border border-violet-900/40">
                            {activeCourse?.category}
                          </span>
                          <h2 className="text-xl font-extrabold mt-3 leading-snug font-display text-slate-105">{activeCourse?.title}</h2>
                          <p className="text-xs text-slate-405 mt-1">Lead Architect: <strong className="text-slate-200">{activeCourse?.authorName}</strong></p>
                        </div>

                        {/* TWO-COLUMN LAYOUT: player vs drawer navigation */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          
                          {/* Left Player simulation panel */}
                          <div className="lg:col-span-7 bg-slate-950 rounded-xl p-5 border border-slate-850 flex flex-col justify-between min-h-[300px]">
                            
                            {activeLesson ? (
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-2 mb-3.5">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                                      Simulated Media Session
                                    </span>
                                    <span className="text-[10px] text-violet-400 bg-violet-950 px-2 py-0.5 rounded-full border border-violet-900 font-mono">
                                      Playback Stream Online
                                    </span>
                                  </div>

                                  <div className="space-y-2 py-2">
                                    <h4 className="text-sm font-extrabold text-white">{activeLesson.title}</h4>
                                    <p className="text-[11px] text-slate-400 italic">"{activeLesson.intro || 'A rigorous study of this domain.'}"</p>
                                  </div>
                                </div>

                                <div className="space-y-4 pt-6">
                                  {/* Progress bar visual */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                      <span>{Math.floor(lessonSecondsWatched / 60)}:{(lessonSecondsWatched % 60).toString().padStart(2, '0')} Elapsed</span>
                                      <span>{Math.floor(activeLesson.durationS / 60)}:00 Total Duration</span>
                                    </div>
                                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                      <span 
                                        className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-300 block"
                                        style={{ width: `${(lessonSecondsWatched / activeLesson.durationS) * 100}%` }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setIsSimulatingPlayback(!isSimulatingPlayback)}
                                      className={`px-3 py-1.5 text-xs rounded-lg font-bold flex-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                        isSimulatingPlayback ? 'bg-amber-600 text-white' : 'bg-violet-600 text-white hover:bg-violet-500 font-semibold'
                                      }`}
                                    >
                                      {isSimulatingPlayback ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                                      <span>{isSimulatingPlayback ? 'Simulating Study (Auto Elapsed)' : 'Start Simulated Video Lesson'}</span>
                                    </button>

                                    <button
                                      onClick={() => submitProgressState(true)}
                                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Mark Lesson Completed</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                                <BookOpen className="w-10 h-10 text-slate-650 animate-pulse" />
                                <h5 className="font-bold text-slate-300">No active video selected</h5>
                                <p className="text-[11px] text-slate-400 max-w-xs">Please choose any lesson checkpoints on the sidebar navigation ledger to begin streaming!</p>
                              </div>
                            )}

                          </div>

                          {/* Lessons and Syllabus checklist navigation column */}
                          <div className="lg:col-span-5 space-y-3">
                            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-mono">
                              Course syllabus checklist
                            </h4>

                            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                              {activeLessons.map((les, index) => {
                                const isCompleted = activeEnrollment?.completedLessonsList?.includes(les.id);
                                const isCurrent = activeLesson?.id === les.id;
                                return (
                                  <div 
                                    key={les.id}
                                    onClick={() => handleSelectLesson(les)}
                                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                                      isCurrent 
                                        ? 'bg-violet-950/45 border-violet-500/50 text-violet-200 font-display' 
                                        : 'bg-slate-950/50 border-slate-900 text-slate-350 hover:bg-slate-950 hover:border-slate-800'
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1 pr-2">
                                      <span className="block text-[10px] font-bold text-slate-400 font-mono">LESSON {index + 1} ({Math.floor(les.durationS / 60)} min)</span>
                                      <h5 className="font-bold text-xs truncate mt-0.5">{les.title}</h5>
                                    </div>
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                      isCompleted 
                                        ? 'bg-violet-650 text-white' 
                                        : isCurrent ? 'bg-violet-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 font-mono'
                                    }`}>
                                      {isCompleted ? '✓' : index + 1}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                        {/* ACADEMICS TESTING SYLLABUS GATEWAY */}
                        {activeQuiz && (
                          <div className="pt-6 border-t border-slate-800 mt-6 space-y-4">
                            <div className="flex items-center gap-2">
                              <Compass className="w-[15px] h-[15px] text-violet-400 stroke-[2]" />
                              <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 font-mono">Milestone Competency Quiz Validation</h4>
                              <span className="ml-auto text-[9px] bg-violet-950 text-violet-400 px-2 py-0.5 rounded font-bold border border-violet-900 font-mono">
                                Required Passing Grade: {activeQuiz.passPct}%
                              </span>
                            </div>

                            {activeEnrollment?.status === EnrollStatus.COMPLETED ? (
                              <div className="p-4 bg-violet-950/20 border border-violet-900/50 rounded-xl flex items-center gap-3">
                                <Award className="w-10 h-10 text-yellow-500 shrink-0" />
                                <div>
                                  <h5 className="font-extrabold text-slate-100 text-sm font-display">MILESTONE CHECKED & APPROVED</h5>
                                  <p className="text-[11px] text-slate-400 mt-0.5">You passed the criteria examination, completed lessons study tracking, and unlocked your gold-seal cryptographic achievements diploma!</p>
                                </div>
                              </div>
                            ) : (
                              <div className="p-5 bg-slate-955/20 rounded-xl border border-slate-850 space-y-4">
                                <div className="space-y-1">
                                  <h4 className="text-xs font-black text-slate-205">Course Assessment Block: {activeQuiz.title}</h4>
                                  <p className="text-[11px] text-slate-400">Complete 100% of the lessons study milestones above to qualify for grading certification approval.</p>
                                </div>

                                {/* Rendering assessment cards */}
                                <div className="space-y-4 pt-1">
                                  {activeQuiz.questions.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-2">
                                      <p className="text-xs font-bold text-slate-200">
                                        Milestone Question {qIdx + 1}: {q.q}
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {q.options.map((opt, optIdx) => {
                                          const isSelected = selectedAnswers[qIdx] === optIdx;
                                          return (
                                            <button
                                              key={optIdx}
                                              onClick={() => {
                                                if (quizAttemptOutcome?.passed) return;
                                                setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
                                              }}
                                              className={`p-2.5 text-xs rounded-lg text-left border cursor-pointer transition-all ${
                                                isSelected 
                                                  ? 'bg-violet-600 border-violet-500 text-white shadow-md' 
                                                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-850/50'
                                              }`}
                                            >
                                              {opt}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {quizAttemptOutcome && (
                                  <div className={`p-4 rounded-xl border text-xs flex gap-2.5 ${
                                    quizAttemptOutcome.passed 
                                      ? 'bg-violet-950/70 border-violet-500/40 text-violet-300' 
                                      : 'bg-red-950/40 border-red-900/30 text-red-400'
                                  }`}>
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <div>
                                      <strong>Grading Outcome Score: {quizAttemptOutcome.scorePct}% ({quizAttemptOutcome.passed ? 'PASSED' : 'UNDER LIMITS'})</strong>
                                      <p className="opacity-80 mt-1 leading-normal">
                                        {quizAttemptOutcome.passed 
                                          ? 'Splendid! Credentials synced. You may now load the certifications portal to view your Gold Seal Diploma.' 
                                          : 'Requirement score not met. Please study the lessons above to attempt the examination quizzes again!'}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                  <button
                                    onClick={submitQuizAnswers}
                                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                                  >
                                    Submit Quiz Answers
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedAnswers({});
                                      setQuizAttemptOutcome(null);
                                    }}
                                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-bold rounded-lg border border-slate-800 transition-colors cursor-pointer"
                                  >
                                    Clear Answers
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* SECTION: COHORT REVIEWS LISTINGS */}
                        <div id="course-cohort-feedback" className="pt-6 border-t border-slate-800 mt-6 space-y-4">
                          <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
                            <Star className="w-[15px] h-[15px] text-amber-500 fill-amber-500" />
                            <span>Cohort Sentiment & Reviews logs</span>
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            
                            {/* Write Review block */}
                            <div className="md:col-span-5 p-4 rounded-xl border border-slate-850 bg-slate-950/45">
                              <form onSubmit={submitStarsReview} className="space-y-3.5">
                                <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider block font-mono">Write dynamic portfolio review</span>
                                
                                <div className="space-y-1">
                                  <label className="block text-[10px] text-slate-450 uppercase font-bold">Stars metric multiplier</label>
                                  <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((stars) => (
                                      <button
                                        key={stars}
                                        type="button"
                                        onClick={() => setUserRatingStars(stars)}
                                        className="focus:outline-none cursor-pointer"
                                      >
                                        <Star className={`w-4 h-4 ${
                                          stars <= userRatingStars ? 'text-amber-400 fill-amber-450' : 'text-slate-700'
                                        }`} />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] text-slate-450 uppercase font-bold">Comments review narrative</label>
                                  <textarea
                                    value={userRatingComment}
                                    onChange={(e) => setUserRatingComment(e.target.value)}
                                    placeholder="Add custom auditor comments rating review narrative..."
                                    rows={2}
                                    className={`w-full p-2.5 text-xs rounded-lg outline-none border focus:ring-1 focus:ring-violet-500 ${
                                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                                    }`}
                                    required
                                  />
                                </div>

                                {ratingError && <p className="text-[10px] text-red-400 font-medium font-mono">{ratingError}</p>}

                                <button
                                  type="submit"
                                  className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                                >
                                  Submit Comment
                                </button>
                              </form>
                            </div>

                            {/* Listings column */}
                            <div className="md:col-span-7 space-y-2.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Cohort Evaluator Feedback ({courseRatings.length})</span>
                              
                              <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                                {courseRatings.length > 0 ? (
                                  courseRatings.map((rate) => (
                                    <div key={rate.id} className="p-3 bg-slate-950/25 rounded-lg border border-slate-850">
                                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                                        <span className="font-extrabold text-violet-400">{rate.userName}</span>
                                        <span className="text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rate.stars}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-350 mt-1 italic leading-relaxed">"{rate.comment}"</p>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
                                    No metrics comments submitted.
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    /* MAIN STUDENT LIST CURRICULUM SCREEN */
                    <div className="space-y-5">
                      {/* STAT HEADER INTERACTION BLOCK */}
                      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-violet-950/80 border border-violet-900/30 overflow-hidden shadow-xl">
                        <div className="relative z-10 space-y-1.5 max-w-[560px]">
                          <span className="text-[10px] uppercase font-black text-yellow-405 tracking-wider font-mono">Syllabus Portal Dashboard</span>
                          <h3 className="text-xl font-bold tracking-tight text-white font-display">Fast-Track Your Full-Stack Capabilities Bridge</h3>
                          <p className="text-xs text-violet-200 leading-relaxed font-sans font-light mt-1">
                            Double check your current enrolled study paths, load simulating lessons watch-timers, complete module checks and claim your Gold credentials verified by our local server!
                          </p>
                        </div>
                        <div className="absolute right-6 bottom-0 top-0 w-[180px] hidden md:flex items-center justify-center opacity-15 select-none pointer-events-none">
                          <GraduationCap className="w-24 h-24 text-white stroke-[1.5]" />
                        </div>
                      </div>

                      {/* ACTIVE PATHS */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-violet-400 shrink-0" />
                          <span>My Enrolled Path Dashboard ({enrollments.length})</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {enrollments.length > 0 ? (
                            enrollments.map((en) => {
                              const isCompleted = en.status === EnrollStatus.COMPLETED;
                              return (
                                <div 
                                  key={en.id} 
                                  className={`p-4 rounded-xl border transition-all ${
                                    darkMode ? 'bg-slate-900 border-slate-850 hover:border-slate-800' : 'bg-white border-slate-205 shadow-xs'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-extrabold text-violet-400 uppercase tracking-widest font-mono">{en.course?.category}</span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                                      isCompleted ? 'bg-violet-950 text-violet-400 border border-violet-900/50' : 'bg-violet-955 text-violet-400 border border-violet-900/50'
                                    }`}>
                                      {en.status}
                                    </span>
                                  </div>

                                  <h5 className="font-extrabold text-sm text-slate-105 mt-2 font-display">{en.course?.title}</h5>
                                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans leading-relaxed">{en.course?.subtitle || en.course?.desc}</p>
                                  
                                  <div className="flex items-center justify-between text-xs mt-4 pb-1">
                                    <span className="text-[10px] text-slate-400 font-semibold">{en.completedLessons} / {en.totalLessons} Lessons Tocked</span>
                                    <span className="font-bold text-violet-400 font-mono">{en.completionPercent}% Completed</span>
                                  </div>
                                  <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                                    <span 
                                      className="h-full bg-gradient-to-r from-amber-600 to-violet-600 block rounded-full transition-all duration-300"
                                      style={{ width: `${en.completionPercent}%` }}
                                    />
                                  </div>

                                  <div className="flex gap-2 mt-4">
                                    <button
                                      onClick={() => loadCoursePlayer(en.courseId)}
                                      className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Play className="w-3 h-3 fill-white" />
                                      <span>{isCompleted ? 'Review Syllabus' : 'Study Checkpoints'}</span>
                                    </button>
                                    
                                    {isCompleted && (
                                      <button
                                        onClick={() => setViewingCertificateCourse(en.course)}
                                        className="py-1.5 px-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 hover:from-yellow-500/30 hover:to-amber-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-amber-500/5"
                                      >
                                        <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                                        <span>Read Award</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="md:col-span-2 p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3 bg-slate-950/20 py-12">
                              <Compass className="w-9 h-9 text-slate-750 mx-auto animate-pulse" />
                              <div className="max-w-xs mx-auto">
                                <h5 className="font-bold text-slate-350">No ongoing path enrolled</h5>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Please open the Courses Catalog inside our application sidebar to find premium certified syllabuses to join!</p>
                              </div>
                              <button
                                onClick={() => setActiveDashboardTab('explore')}
                                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                Browse Courses Catalog
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PAGE 2: COURSES CATALOG */}
              {activeDashboardTab === 'explore' && (
                <div className="space-y-6">
                  
                  {/* SEARCH FILTERS BAR */}
                  <div className={`p-4 rounded-xl border transition-colors ${
                    darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'
                  } flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs`}>
                    
                    <div className="relative w-full md:w-[320px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search syllabus by title, keywords, tag..."
                        className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-lg outline-none border focus:ring-1 focus:ring-violet-500 ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-850'
                        }`}
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-2 text-slate-400 hover:text-slate-200 text-xs font-bold pt-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 md:justify-end">
                      {['All', 'Web Development', 'Data Science & AI', 'Cloud Engineering', 'Computer Science', 'Cybersecurity'].map(cat => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/10' 
                                : 'bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-205 border border-slate-850'
                            }`}
                          >
                            {cat === 'All' ? 'View All' : cat.split('&')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* COURSES CATALOG INDEX LISTINGS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.length > 0 ? (
                      courses.map((c) => {
                        const isUserEnrolled = enrollments.some(en => en.courseId === c.id);
                        return (
                          <div 
                            key={c.id} 
                            className={`group rounded-xl border overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.01] ${
                              darkMode ? 'bg-slate-900 border-slate-850 hover:border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                            }`}
                          >
                            <div>
                              <div className="relative h-32 overflow-hidden border-b border-slate-900">
                                <img src={c.thumbUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                                <span className="absolute bottom-3 left-3 bg-violet-600 text-[9px] uppercase tracking-widest text-white px-2 py-0.5 rounded-lg font-black border border-violet-500/30 font-mono">
                                  {c.category}
                                </span>
                                <span className="absolute top-3 right-3 bg-slate-950/70 text-[9px] text-slate-350 font-bold px-2 py-0.5 rounded-lg border border-slate-800 font-mono">
                                  {c.level}
                                </span>
                              </div>

                              <div className="p-4 space-y-1.5">
                                <h5 className="font-extrabold text-sm text-slate-105 group-hover:text-violet-400 transition-colors line-clamp-1 font-display">{c.title}</h5>
                                <p className="text-[11px] text-violet-300 font-bold tracking-tight">Led by: {c.authorName}</p>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.subtitle || c.desc}</p>
                                
                                <div className="flex flex-wrap gap-1 pt-2">
                                  {c.skills.slice(0, 3).map((sk, idx) => (
                                    <span key={idx} className="text-[9px] bg-slate-950 text-slate-300 font-medium px-2 py-0.5 rounded border border-slate-850 font-mono">
                                      {sk}
                                    </span>
                                  ))}
                                  {c.skills.length > 3 && <span className="text-[9px] text-slate-400 font-medium px-1.5 py-0.5 font-mono">+{c.skills.length - 3}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="p-4 pt-1 flex items-center justify-between border-t border-slate-850/30 gap-2">
                              <span className="text-[11px] text-amber-400 font-extrabold flex items-center gap-0.5 font-mono">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {c.ratingAverage} Ratings
                              </span>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => loadCoursePlayer(c.id)}
                                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-semibold border border-slate-850 transition-colors cursor-pointer"
                                >
                                  Read Modules
                                </button>
                                <button
                                  onClick={() => handleEnroll(c.id)}
                                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    isUserEnrolled 
                                      ? 'bg-violet-955 text-violet-400 border border-violet-900/40' 
                                      : 'bg-violet-600 hover:bg-violet-500 text-white'
                                  }`}
                                >
                                  {isUserEnrolled ? <Check className="w-3 px-0.5 text-violet-400" /> : null}
                                  <span>{isUserEnrolled ? 'Syllabus Joined' : 'Enroll Path'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 font-mono">
                        No matching courses in current selected catalog index filter.
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* PAGE 3: CAREER VECTOR & SKILL GAP ANALYSER */}
              {activeDashboardTab === 'career' && (
                <div className="space-y-6">
                  {/* Descriptive Welcome Box */}
                  <div className="p-4 py-5 rounded-xl bg-gradient-to-r from-violet-950/35 to-indigo-950/35 border border-violet-800/20 text-xs space-y-1">
                    <span className="text-[10px] font-mono tracking-widest uppercase font-black text-amber-500">
                      Vectors & Calibration
                    </span>
                    <h3 className="text-base font-bold text-white font-display">Student Competencies Diagnostic Control Panel</h3>
                    <p className="text-slate-450 leading-relaxed">
                      Customise your student career preferences below. Adding familiar tools updates your credentials vector database instantly. The High-Fidelity SVG gap map calculates match alignments relative to professional criteria in real-time.
                    </p>
                  </div>

                  <CareerGapSection
                    user={user}
                    darkMode={darkMode}
                    isEditingProfile={isEditingProfile}
                    setIsEditingProfile={setIsEditingProfile}
                    profileName={profileName}
                    setProfileName={setProfileName}
                    profileCareer={profileCareer}
                    setProfileCareer={setProfileCareer}
                    profileInterests={profileInterests}
                    removeInterestTag={removeInterestTag}
                    newInterestInput={newInterestInput}
                    setNewInterestInput={setNewInterestInput}
                    addInterestTag={addInterestTag}
                    profileSkills={profileSkills}
                    removeSkillTag={removeSkillTag}
                    newSkillInput={newSkillInput}
                    setNewSkillInput={setNewSkillInput}
                    addSkillTag={addSkillTag}
                    handleUpdateProfile={handleUpdateProfile}
                    targetCareerSkills={targetCareerSkills}
                    targetCareerTitle={targetCareerTitle}
                    alignmentPercentage={alignmentPercentage}
                  />
                </div>
              )}

              {/* PAGE 4: PERSONALIZED INTELLIGENT RECOMMENDATION CORE */}
              {activeDashboardTab === 'recommendations' && (
                <RecommendationHubState
                  recoModelStrategy={recoModelStrategy}
                  setRecoModelStrategy={setRecoModelStrategy}
                  isRecoLoading={isRecoLoading}
                  recoExplanation={recoExplanation}
                  recommendedCourses={recommendedCourses}
                  darkMode={darkMode}
                  loadCoursePlayer={loadCoursePlayer}
                />
              )}

              {/* PAGE 5: DIPLOMAS CERTIFICATE HUB */}
              {activeDashboardTab === 'certifications' && (
                <AcademicCertificationsPortal
                  enrollments={enrollments}
                  darkMode={darkMode}
                  setViewingCertificateCourse={setViewingCertificateCourse}
                />
              )}

              {/* PAGE 6: DOCUMENTATION & WALKTHROUGH PANEL */}
              {activeDashboardTab === 'docs' && (
                <DeveloperDocsHub
                  darkMode={darkMode}
                />
              )}

            </motion.div>
          </AnimatePresence>

        </section>

      </main>

      {/* FOOTER ADVISORY REGISTRY */}
      <footer className={`fixed bottom-0 left-0 right-0 z-40 border-t ${
        darkMode ? 'bg-slate-950/90 border-slate-900 text-slate-400' : 'bg-white/95 border-slate-205 text-slate-600'
      } py-2 block backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs leading-none">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="font-extrabold font-display">EdEasy Adaptive Recommendation Workspace</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-450 font-mono">Academic Capstone Portfolio Project</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping" />
              <span>Full-Stack microservice on port 3000</span>
            </span>
            <button
              onClick={() => setActiveDashboardTab('docs')}
              className="px-3.5 py-1 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-all cursor-pointer shadow-violet-500/10 text-[11px]"
            >
              Consult Setup Guides
            </button>
          </div>
        </div>
      </footer>

      {/* GOLD PLATED DEFIED CERTIFICATION VIEW MODAL OVERLAY */}
      <AnimatePresence>
        {viewingCertificateCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark Mask Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm" 
              onClick={() => setViewingCertificateCourse(null)} 
            />

            {/* Content Golden Diploma Card wrapper */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 25 }}
              className="relative w-full max-w-2xl bg-slate-900 text-slate-100 border border-amber-500/50 rounded-3xl p-8 shadow-2xl overflow-hidden text-center select-none"
            >
              
              {/* Background watermark seals & frames */}
              <div className="absolute inset-2 border-2 border-dashed border-amber-500/20 rounded-2xl pointer-events-none" />
              <div className="absolute top-2 right-2 w-[110px] h-[110px] bg-gradient-to-br from-yellow-500/10 to-transparent blur-lg pointer-events-none" />
              
              {/* Gold seal stamp decoration */}
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/5 rounded-full border border-amber-500/10 flex items-center justify-center text-center">
                <GraduationCap className="w-16 h-16 text-yellow-600 opacity-25" />
              </div>

              {/* Close Overlay tag */}
              <button 
                onClick={() => setViewingCertificateCourse(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors cursor-pointer text-xs font-bold"
              >
                Close View
              </button>

              <div className="space-y-6 pt-4">
                
                <div className="flex flex-col items-center gap-1">
                  <span className="text-yellow-450 font-black text-[10px] tracking-widest uppercase font-mono bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    ED-TECH ACADEMIC CREDENTIAL LEDGER
                  </span>
                  <Award className="w-12 h-12 text-yellow-500 mt-4 animate-bounce shrink-0 stroke-[1.5]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-display text-white tracking-tight">CERTIFICATE OF RECOGNITIVE STATUS</h3>
                  <p className="text-[11px] text-slate-400 italic font-mono uppercase tracking-wide">This cryptographic record certifies that active student</p>
                </div>

                <div className="relative inline-block border-b-2 border-slate-700 px-8 py-1">
                  <span className="text-xl font-extrabold font-display bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    {user ? user.name : 'Simulated Auditor'}
                  </span>
                </div>

                <p className="text-xs text-slate-350 max-w-md mx-auto leading-relaxed">
                  has successfully completed 100% of the rigorous syllabus criteria, passed checkpoint assessments validation requirements, and demonstrated core competencies in the professional domain of:
                </p>

                <h4 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850 inline-block max-w-sm shrink-0">
                  {viewingCertificateCourse.title}
                </h4>

                {/* Simulated cryptographic validator */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4 text-left border-t border-slate-800/60 mt-4 text-[10px] font-mono">
                  <div>
                    <span className="block text-slate-500 font-semibold mb-0.5">VERIFICATION SHA CODE:</span>
                    <span className="text-yellow-500/80 truncate block">APEX-RECO-{(viewingCertificateCourse.id + (user ? user.id : 'anon')).toUpperCase().slice(0, 12)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-slate-500 font-semibold mb-0.5">DATE OF GENERATION:</span>
                    <span className="text-slate-300 block">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Hand-signed script signature visualizer */}
                <div className="flex items-center justify-around pt-6 max-w-md mx-auto text-[10px] text-slate-400 border-t border-dashed border-slate-800">
                  <div className="text-center space-y-1">
                    <span className="italic text-transparent bg-gradient-to-r from-amber-400 to-violet-400 bg-clip-text font-display text-sm leading-none block font-light select-none tracking-normal">Sarah Jenkins</span>
                    <span className="block text-slate-500 border-t border-slate-800 pt-1 text-[9px] uppercase font-mono">Sarah Jenkins, Core Frontend Lead</span>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="italic text-yellow-500 font-display text-sm leading-none block font-light select-none tracking-normal">Dr. Ryan Kapoor</span>
                    <span className="block text-slate-500 border-t border-slate-800 pt-1 text-[9px] uppercase font-mono">Dr. Ryan Kapoor, AI Research Fellow</span>
                  </div>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
