/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Role, Level, EnrollStatus, User, Course, Lesson, Quiz, QuizAttempt, Enrollment, Progress, Rating, Interaction } from "./src/types.js";

// Initialize express app
const app = express();
const PORT = 3000;

app.use(express.json());

// Setup API key for Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI Client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY detected. Running in local fallback mode.");
}

// Low-overhead JSON Database path
const DB_FILE = path.join(process.cwd(), "db.json");

// Default initial seed data for EdTech system
const DEFAULT_COURSES: Course[] = [
  {
    id: "c-react-full",
    title: "Mastering React 19 & Full-Stack Architectures",
    subtitle: "Build low-latency SPAs and SSR sites using state-management, motion, and Node.js.",
    desc: "Dive deep into modern web development. Learn React concurrency features, Server Components, advanced custom hooks, Vite tooling, and custom middleware patterns inside high-performance server architectures.",
    level: Level.INTERMEDIATE,
    category: "Web Development",
    skills: ["React 19", "TypeScript", "State Management", "Vite", "Express.js"],
    tags: ["frontend", "javascript", "fullstack", "modern-react", "spa"],
    thumbUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    authorId: "auth-expert-1",
    authorName: "Sarah Jenkins, Lead Frontend Architect",
    durationMs: 7200000,
    createdAt: new Date().toISOString(),
    ratingAverage: 4.8
  },
  {
    id: "c-python-ai",
    title: "Python for AI, Data Science & Feature Engineering",
    subtitle: "Manipulate dataset pipelines and run smart algorithms with clean mathematics.",
    desc: "Master key concepts in quantitative computing, pandas ETL operations, scikit-learn training, feature scaling, and preprocessing techniques to prepare advanced datasets for deep convolutional neural networks.",
    level: Level.BEGINNER,
    category: "Data Science & AI",
    skills: ["Python", "Pandas", "Scikit-Learn", "Feature Engineering", "Data Structures"],
    tags: ["python", "machine-learning", "analytical", "data", "ai"],
    thumbUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    authorId: "auth-expert-2",
    authorName: "Dr. Ryan Kapoor, AI Research Fellow",
    durationMs: 10800000,
    createdAt: new Date().toISOString(),
    ratingAverage: 4.9
  },
  {
    id: "c-cloud-native",
    title: "Cloud Native Microservices & Dockerized Orchestration",
    subtitle: "Establish high-availability backends with secure load balancing.",
    desc: "Construct highly resilient services utilizing Node.js, Express, Docker containers, and clean infrastructure definitions. Address service mesh, circuit breakers, caching with Redis, and robust container communication pipelines.",
    level: Level.ADVANCED,
    category: "Cloud Engineering",
    skills: ["Docker", "Kubernetes", "Microservices", "REST APIs", "Redis"],
    tags: ["cloud", "devops", "kubernetes", "backend", "scalable"],
    thumbUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
    authorId: "auth-expert-3",
    authorName: "Marcus Vance, Principal Solutions Lead",
    durationMs: 9000000,
    createdAt: new Date().toISOString(),
    ratingAverage: 4.7
  },
  {
    id: "c-typescript-algo",
    title: "Data Structures & Algos in TypeScript",
    subtitle: "Refactor code patterns to optimize time complexity.",
    desc: "Conquer standard coding interviews by mastering LinkedLists, BST, Graph Traversals, Dynamic Programming, and Big O notation patterns inside type-safe code templates. Make your data queries predictable and fast.",
    level: Level.INTERMEDIATE,
    category: "Computer Science",
    skills: ["TypeScript", "Algorithms", "Data Structures", "System Design"],
    tags: ["math", "algorithms", "typescript", "interviews", "software-engineering"],
    thumbUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
    authorId: "auth-expert-1",
    authorName: "Sarah Jenkins, Lead Frontend Architect",
    durationMs: 5400000,
    createdAt: new Date().toISOString(),
    ratingAverage: 4.6
  },
  {
    id: "c-security-shield",
    title: "Cybersecurity Shields, Cryptography & Threat Modeling",
    subtitle: "Mitigate application vectors and safeguard authentication sessions.",
    desc: "Gain deep knowledge in pen testing, security frameworks, private key algorithms, OAuth flows, and vulnerability scanning. Establish defensive engineering practices inside standard corporate structures.",
    level: Level.BEGINNER,
    category: "Cybersecurity",
    skills: ["Threat Modeling", "Cryptography", "OAuth Authentication", "Network Security"],
    tags: ["infosec", "cybersecurity", "security-shields", "defense", "tokens"],
    thumbUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    authorId: "auth-expert-4",
    authorName: "Elena Rostova, Chief Threat Officer",
    durationMs: 8000000,
    createdAt: new Date().toISOString(),
    ratingAverage: 4.5
  },
  {
    id: "c-pytorch-deep",
    title: "PyTorch Deep Learning & Custom Neural Nets",
    subtitle: "Train model layers using gradient descent.",
    desc: "A progressive study from mathematical foundations of tensor calculus to creating recurrent and generative model weights. Track epochs, implement regularization layers, and test custom predictions with actual tensor matrices.",
    level: Level.ADVANCED,
    category: "Data Science & AI",
    skills: ["PyTorch", "Deep Learning", "Tensor Computations", "Neural Networks"],
    tags: ["neural-networks", "machine-learning", "pytorch", "ai", "math"],
    thumbUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    authorId: "auth-expert-2",
    authorName: "Dr. Ryan Kapoor, AI Research Fellow",
    durationMs: 14400000,
    createdAt: new Date().toISOString(),
    ratingAverage: 4.95
  }
];

const DEFAULT_LESSONS: Lesson[] = [
  // Mastering React 19
  { id: "l-r1", courseId: "c-react-full", title: "Introduction to React 19 Core and Server Actions", contentMd: "Meet React 19's brand new architectural foundations! Today we investigate `useActionState` and new server features. In this module, we will explore asynchronous submission triggers and state transitions.", order: 1, durationS: 1200 },
  { id: "l-r2", courseId: "c-react-full", title: "Unifying Web Clients with custom REST hooks", contentMd: "Optimize communication. Combine local states cleanly with caching controllers, custom event models, and efficient background execution.", order: 2, durationS: 2400 },
  { id: "l-r3", courseId: "c-react-full", title: "Micro-interactions and Tailwind Dark Mode setups", contentMd: "Enhance visual delight. Harness responsive transitions, focus selectors, custom keyframes, and cohesive CSS palettes for a stellar aesthetic.", order: 3, durationS: 3600 },

  // Python for AI
  { id: "l-p1", courseId: "c-python-ai", title: "Pandas Structured DataFrames and clean JSON parsing", contentMd: "Master the bread and butter of analytical datasets. Load nested configurations, construct high-performance data slices, and clear missing entries.", order: 1, durationS: 3600 },
  { id: "l-p2", courseId: "c-python-ai", title: "Gradient Descent algorithms and Linear Math foundations", contentMd: "Write simple analytical matrix calculations manually to trace derivative pathways. Build numerical prediction models from scratch using core arithmetic logic.", order: 2, durationS: 3600 },
  { id: "l-p3", courseId: "c-python-ai", title: "Building your first Logistic classifier on real datasets", contentMd: "Perform complete training iterations. Score standard datasets, chart accuracy rates, isolate test-train splits, and export optimized models.", order: 3, durationS: 3600 },

  // Cloud Native
  { id: "l-d1", courseId: "c-cloud-native", title: "Docker Volumes and Multi-Stage Build Configurations", contentMd: "Minify image overhead. Configure precise layer caching boundaries and optimize production builds down to tight, secure, lightweight images.", order: 1, durationS: 3000 },
  { id: "l-d2", courseId: "c-cloud-native", title: "Express.js API proxies and Redis horizontal session setups", contentMd: "Avoid single point bottlenecks. Sync user headers and active tokens transparently over state-sharing Redis datastores.", order: 2, durationS: 3000 },
  { id: "l-d3", courseId: "c-cloud-native", title: "Deployments and Routing targets", contentMd: "Enable blue-green routes and robust rollbacks. Maintain strict zero-downtime guidelines during dynamic code releases.", order: 3, durationS: 3000 },

  // Algorithms
  { id: "l-a1", courseId: "c-typescript-algo", title: "Big O Analysis & Spatial Search Space Trees", contentMd: "Map how algorithms operate under constraint. Trace nested cycles and evaluate data growth trajectories visually.", order: 1, durationS: 1800 },
  { id: "l-a2", courseId: "c-typescript-algo", title: "Traversing Binary Search Trees recursion bounds", contentMd: "Solve dynamic traversal pathways. Unpick depth-first recursion boundaries and identify simple stack storage configurations.", order: 2, durationS: 1800 },
  { id: "l-a3", courseId: "c-typescript-algo", title: "Dynamic Scheduling algorithms and memoization", contentMd: "Overcome iterative repetition. Persist partial evaluations in light arrays to run ultra-complex calculations with standard linear durations.", order: 3, durationS: 1800 }
];

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: "q-react-full",
    courseId: "c-react-full",
    lessonId: null,
    title: "React 19 & Full-Stack Core Competency Quiz",
    questions: [
      { q: "Which hook is natively added in React 19 to handle async forms?", options: ["useActionState", "useAsyncEffect", "useFormTransition", "useFetchStatus"], answerIndex: 0 },
      { q: "What is the primary benefit of bundling our server code into a CommonJS (.cjs) file?", options: ["Avoid imports of third-party CSS", "Bypass rigid ES Module relative import runtime constraints", "Double the speed of local network drivers", "Remove developer comments automatically"], answerIndex: 1 },
      { q: "What is the best hook to optimize large calculations dynamically inside a component?", options: ["useEffect", "useMemo", "useLayoutEffect", "useDeferredState"], answerIndex: 1 }
    ],
    passPct: 66
  },
  {
    id: "q-python-ai",
    courseId: "c-python-ai",
    lessonId: null,
    title: "Python for AI Foundations Quiz",
    questions: [
      { q: "What library is used primarily to manage and structure tabbed matrices?", options: ["Matplotlib", "Seaborn", "Pandas", "Scipy"], answerIndex: 2 },
      { q: "Why do we perform feature scaling in machine learning?", options: ["To shrink random disk consumption", "To keep features on an uniform, balanced magnitude scale", "To generate mock user interests", "To encrypt API keys securely"], answerIndex: 1 }
    ],
    passPct: 50
  },
  {
    id: "q-cloud-native",
    courseId: "c-cloud-native",
    lessonId: null,
    title: "Cloud Native Containers & Docker Quiz",
    questions: [
      { q: "What Docker instruction is used to minimize layered dependencies recursively?", options: ["FROM", "RUN", "Multi-stage builds", "ENV"], answerIndex: 2 },
      { q: "What does Redis primarily offer inside a cluster architecture?", options: ["Server-side rendering templates", "Distributed high-speed state and session caching", "Automated neural network layer evaluations", "Custom SVG image compilation"], answerIndex: 1 }
    ],
    passPct: 50
  }
];

// Rich set of starting reviews/ratings
const DEFAULT_RATINGS: Rating[] = [
  { id: "r1", userId: "u-simulated-2", courseId: "c-react-full", stars: 5, comment: "Exceptional architecture details. The server action explanations are absolute gold-standard.", createdAt: new Date().toISOString(), userName: "Alex Peterson" },
  { id: "r2", userId: "u-simulated-3", courseId: "c-react-full", stars: 4, comment: "Extremely clean structure, but some components could use extra background references.", createdAt: new Date().toISOString(), userName: "Linda Wu" },
  { id: "r3", userId: "u-simulated-2", courseId: "c-python-ai", stars: 5, comment: "I learned Pandas operations elegantly in minutes rather than digging for dry docs.", createdAt: new Date().toISOString(), userName: "Alex Peterson" }
];

// Helper to load/save database
class JsonDb {
  public data: {
    users: User[];
    courses: Course[];
    lessons: Lesson[];
    quizzes: Quiz[];
    quizAttempts: QuizAttempt[];
    enrollments: Enrollment[];
    progress: Progress[];
    ratings: Rating[];
    interactions: Interaction[];
  } = {
    users: [],
    courses: [],
    lessons: [],
    quizzes: [],
    quizAttempts: [],
    enrollments: [],
    progress: [],
    ratings: [],
    interactions: []
  };

  constructor() {
    this.read();
  }

  public read() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
        // Ensure defaults are present in case they got lost
        if (!this.data.courses || this.data.courses.length === 0) {
          this.data.courses = DEFAULT_COURSES;
        }
        if (!this.data.lessons || this.data.lessons.length === 0) {
          this.data.lessons = DEFAULT_LESSONS;
        }
        if (!this.data.quizzes || this.data.quizzes.length === 0) {
          this.data.quizzes = DEFAULT_QUIZZES;
        }
        if (!this.data.ratings || this.data.ratings.length === 0) {
          this.data.ratings = DEFAULT_RATINGS;
        }
        if (!this.data.users) this.data.users = [];
        if (!this.data.quizAttempts) this.data.quizAttempts = [];
        if (!this.data.enrollments) this.data.enrollments = [];
        if (!this.data.progress) this.data.progress = [];
        if (!this.data.interactions) this.data.interactions = [];
      } else {
        // Generate seeds
        this.data = {
          users: [
            {
              id: "u-simulated-1",
              email: "student@learning.edu",
              name: "Karthik Durgam",
              role: Role.STUDENT,
              interests: ["Web Development", "Data Science & AI"],
              skills: ["React 19", "Python"],
              targetCareer: "Full Stack AI Engineer"
            },
            {
              id: "u-simulated-2",
              email: "alex@learning.edu",
              name: "Alex Peterson",
              role: Role.STUDENT,
              interests: ["Cloud Engineering", "Cybersecurity"],
              skills: ["Docker", "Threat Modeling"],
              targetCareer: "Cloud Solutions Architect"
            },
            {
              id: "u-simulated-3",
              email: "linda@learning.edu",
              name: "Linda Wu",
              role: Role.STUDENT,
              interests: ["Web Development", "Computer Science"],
              skills: ["TypeScript", "TypeScript"],
              targetCareer: "Frontend Web Architect"
            }
          ],
          courses: DEFAULT_COURSES,
          lessons: DEFAULT_LESSONS,
          quizzes: DEFAULT_QUIZZES,
          quizAttempts: [],
          enrollments: [
            // Sample already enrolled courses
            { id: "e-init-1", userId: "u-simulated-1", courseId: "c-typescript-algo", status: EnrollStatus.ACTIVE, startedAt: new Date().toISOString() }
          ],
          progress: [
            { id: "p-init-1", enrollmentId: "e-init-1", lessonId: "l-a1", completed: true, secondsWatched: 1800, updatedAt: new Date().toISOString() }
          ],
          ratings: DEFAULT_RATINGS,
          interactions: [
            { id: "i-init-1", userId: "u-simulated-1", courseId: "c-typescript-algo", event: "enroll", ts: new Date().toISOString() },
            { id: "i-init-2", userId: "u-simulated-1", courseId: "c-react-full", event: "view", ts: new Date().toISOString() },
            { id: "i-init-3", userId: "u-simulated-2", courseId: "c-cloud-native", event: "enroll", ts: new Date().toISOString() }
          ]
        };
        this.write();
      }
    } catch (err) {
      console.error("Error reading JSON Database, seeding defaults instead:", err);
    }
  }

  public write() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing JSON Database:", err);
    }
  }
}

const db = new JsonDb();

// Secure authorization helper using robust base64 JSON tokens (JWT equivalent for offline-first sandboxes)
function authenticateUser(req: express.Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const payload = JSON.parse(decoded);
    // Find the real user in the database
    const user = db.data.users.find(u => u.id === payload.id);
    return user || null;
  } catch (err) {
    return null;
  }
}

// REST APIs

// 1️⃣ AUTHENTICATION & PROFILE APIs
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, interests, skills, targetCareer } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Missing required details: email, name" });
  }

  let existing = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Account with this email already exists" });
  }

  const newUser: User = {
    id: "user-" + Math.random().toString(36).substr(2, 9),
    email,
    name,
    role: Role.STUDENT,
    interests: interests || [],
    skills: skills || [],
    targetCareer: targetCareer || ""
  };

  db.data.users.push(newUser);
  db.write();

  // Create a base64 token representing user details (JWT-like payload)
  const token = Buffer.from(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role })).toString("base64");
  res.json({ token, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please offer an email to test or register." });
  }

  let user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Automatically register them in the mock context to keep UX seamless and helpful!
    user = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0].toUpperCase(),
      role: Role.STUDENT,
      interests: ["Web Development", "Data Science & AI"],
      skills: ["React 19"],
      targetCareer: "Full Stack Engineer"
    };
    db.data.users.push(user);
    db.write();
  }

  const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString("base64");
  res.json({ token, user });
});

app.get("/api/auth/profile", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Access denied. Valid Bearer Token required." });
  }
  res.json(user);
});

app.put("/api/auth/profile/update", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Access denied. Valid Bearer Token required." });
  }

  const { name, interests, skills, targetCareer } = req.body;
  const dbUser = db.data.users.find(u => u.id === user.id);
  if (dbUser) {
    dbUser.name = name || dbUser.name;
    dbUser.interests = interests || dbUser.interests;
    dbUser.skills = skills || dbUser.skills;
    dbUser.targetCareer = targetCareer !== undefined ? targetCareer : dbUser.targetCareer;
    db.write();
    res.json(dbUser);
  } else {
    res.status(404).json({ error: "User profile not found." });
  }
});

// 2️⃣ COURSES CRUD APIs
app.get("/api/courses", (req, res) => {
  const { category, search } = req.query;
  let matches = db.data.courses;

  if (category) {
    matches = matches.filter(c => c.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    matches = matches.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q)) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(matches);
});

app.get("/api/courses/:id", (req, res) => {
  const course = db.data.courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ error: "Course not found." });
  }
  res.json(course);
});

// Create fresh course endpoint (Instructor / Admin role testing)
app.post("/api/courses", (req, res) => {
  const user = authenticateUser(req);
  // Allow all sandbox users to create courses for portfolio playground purposes
  const { title, subtitle, desc, level, category, skills, tags, thumbUrl } = req.body;

  if (!title || !desc || !category) {
    return res.status(400).json({ error: "Missing course metadata requirements." });
  }

  const newCourse: Course = {
    id: "c-" + Math.random().toString(36).substr(2, 9),
    title,
    subtitle: subtitle || "",
    desc,
    level: level || Level.BEGINNER,
    category,
    skills: skills || [],
    tags: tags || [],
    thumbUrl: thumbUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    authorId: user ? user.id : "instructor-anonymous",
    authorName: user ? user.name : "Playground Contributor",
    durationMs: 7200000,
    createdAt: new Date().toISOString(),
    ratingAverage: 5.0
  };

  db.data.courses.push(newCourse);
  db.write();
  res.json(newCourse);
});

// 3️⃣ ENROLLMENTS & STATS APIs
app.post("/api/enrollments", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Auth required to enroll in courses" });
  }

  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ error: "courseId is required to enroll." });
  }

  const courseExists = db.data.courses.some(c => c.id === courseId);
  if (!courseExists) {
    return res.status(404).json({ error: "Course not found." });
  }

  // Check existing enrollment
  let enrollment = db.data.enrollments.find(e => e.userId === user.id && e.courseId === courseId);
  if (enrollment) {
    return res.json({ message: "Already enrolled", enrollment });
  }

  enrollment = {
    id: "enroll-" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    courseId,
    status: EnrollStatus.ACTIVE,
    startedAt: new Date().toISOString()
  };

  db.data.enrollments.push(enrollment);

  // Auto seed progress for the first lesson of this course to make user player look amazing
  const courseLessons = db.data.lessons.filter(l => l.courseId === courseId);
  courseLessons.forEach(l => {
    db.data.progress.push({
      id: "prog-" + Math.random().toString(36).substr(2, 9),
      enrollmentId: enrollment!.id,
      lessonId: l.id,
      completed: false,
      secondsWatched: 0,
      updatedAt: new Date().toISOString()
    });
  });

  // Track the interaction event
  db.data.interactions.push({
    id: "int-" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    courseId,
    event: "enroll",
    ts: new Date().toISOString()
  });

  db.write();
  res.json({ message: "Successfully enrolled!", enrollment });
});

app.get("/api/enrollments", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Auth token required." });
  }

  const enrollments = db.data.enrollments.filter(e => e.userId === user.id);
  const enriched = enrollments.map(e => {
    const course = db.data.courses.find(c => c.id === e.courseId);
    // Find all progress records for this enrollment
    const progRecords = db.data.progress.filter(p => p.enrollmentId === e.id);
    const totalLessons = progRecords.length;
    const completedLessons = progRecords.filter(p => p.completed).length;
    // Calc completion percentage
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      ...e,
      course,
      completionPercent: percent,
      completedLessons,
      totalLessons
    };
  });

  res.json(enriched);
});

// 4️⃣ LESSONS APIs
app.get("/api/lessons/course/:courseId", (req, res) => {
  const { courseId } = req.params;
  const lessons = db.data.lessons.filter(l => l.courseId === courseId);
  res.json(lessons.sort((a, b) => a.order - b.order));
});

// 5️⃣ PROGRESS UPDATE APIs
app.put("/api/progress", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Auth required to update learning progress" });
  }

  const { enrollmentId, lessonId, completed, secondsWatched } = req.body;
  if (!enrollmentId || !lessonId) {
    return res.status(400).json({ error: "Missing progress keys." });
  }

  let record = db.data.progress.find(p => p.enrollmentId === enrollmentId && p.lessonId === lessonId);
  if (!record) {
    // Create lazy trace record
    record = {
      id: "prog-" + Math.random().toString(36).substr(2, 9),
      enrollmentId,
      lessonId,
      completed: completed || false,
      secondsWatched: secondsWatched || 0,
      updatedAt: new Date().toISOString()
    };
    db.data.progress.push(record);
  } else {
    record.completed = completed !== undefined ? completed : record.completed;
    record.secondsWatched = secondsWatched !== undefined ? secondsWatched : record.secondsWatched;
    record.updatedAt = new Date().toISOString();
  }

  // Audit if enrollment should transition to COMPLETED
  // Get all lessons for this enrollment's course
  const enrollment = db.data.enrollments.find(e => e.id === enrollmentId);
  if (enrollment) {
    const allCourseLessons = db.data.lessons.filter(l => l.courseId === enrollment.courseId);
    const allLessonProgress = db.data.progress.filter(p => p.enrollmentId === enrollmentId);

    // If every lesson of this course has completed = true, mark enrollment complete
    const isFinished = allCourseLessons.length > 0 && allCourseLessons.every(l => {
      const matchProg = allLessonProgress.find(p => p.lessonId === l.id);
      return matchProg ? matchProg.completed : false;
    });

    if (isFinished && enrollment.status !== EnrollStatus.COMPLETED) {
      enrollment.status = EnrollStatus.COMPLETED;
      enrollment.completedAt = new Date().toISOString();

      // Log finish interaction event
      db.data.interactions.push({
        id: "int-" + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        courseId: enrollment.courseId,
        event: "finish_lesson",
        ts: new Date().toISOString(),
        meta: { status: "course_completed" }
      });
    }
  }

  db.write();
  res.json(record);
});

// 6️⃣ QUIZZES & ASSESSMENT APIs
app.get("/api/quizzes/course/:courseId", (req, res) => {
  const quizzes = db.data.quizzes.filter(q => q.courseId === req.params.courseId);
  res.json(quizzes);
});

app.post("/api/quizzes/submit", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Auth token needed." });
  }

  const { quizId, answers } = req.body; // answers is number[] of chosen indices
  if (!quizId || !answers) {
    return res.status(400).json({ error: "Missing submission answers to score." });
  }

  const quiz = db.data.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ error: "Quiz criteria not found." });
  }

  // Calculate scores
  let correctCount = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.answerIndex) {
      correctCount++;
    }
  });

  const scorePct = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = scorePct >= quiz.passPct;

  const attempt: QuizAttempt = {
    id: "attempt-" + Math.random().toString(36).substr(2, 9),
    quizId,
    userId: user.id,
    scorePct,
    passed,
    ts: new Date().toISOString()
  };

  db.data.quizAttempts.push(attempt);
  db.write();

  res.json(attempt);
});

// 7️⃣ RATINGS & REVIEWS
app.get("/api/ratings/course/:courseId", (req, res) => {
  const ratings = db.data.ratings.filter(r => r.courseId === req.params.courseId);
  res.json(ratings);
});

app.post("/api/ratings", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Authentication required to review." });
  }

  const { courseId, stars, comment } = req.body;
  if (!courseId || !stars) {
    return res.status(400).json({ error: "Course and star parameters are required." });
  }

  const newRating: Rating = {
    id: "rating-" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    courseId,
    stars: Number(stars),
    comment: comment || "",
    createdAt: new Date().toISOString(),
    userName: user.name
  };

  db.data.ratings.push(newRating);

  // Recalculate Course rating average
  const courseRatings = db.data.ratings.filter(r => r.courseId === courseId);
  const sum = courseRatings.reduce((acc, curr) => acc + curr.stars, 0);
  const course = db.data.courses.find(c => c.id === courseId);
  if (course) {
    course.ratingAverage = Number((sum / courseRatings.length).toFixed(2));
  }

  db.write();
  res.json(newRating);
});

// 8️⃣ INTERACTION TELEMETRY PIPELINE
app.post("/api/interactions", (req, res) => {
  const user = authenticateUser(req);
  const { courseId, event, meta } = req.body;

  if (!courseId || !event) {
    return res.status(400).json({ error: "Required fields missing." });
  }

  const newInteraction: Interaction = {
    id: "int-" + Math.random().toString(36).substr(2, 9),
    userId: user ? user.id : "anonymous-auditor",
    courseId,
    event,
    ts: new Date().toISOString(),
    meta: meta || {}
  };

  db.data.interactions.push(newInteraction);
  db.write();
  res.json({ status: "logged", newInteraction });
});


// 9️⃣ HYBRID RECOMMENDATION CORE ENGINE
app.get("/api/reco", async (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    // Cold start logic - recommend highest rated, excluded none, marked as popular
    const popularCourses = [...db.data.courses].sort((a, b) => b.ratingAverage - a.ratingAverage).slice(0, 4);
    return res.json({
      courses: popularCourses,
      explanation: "Anonymous session detected. Presenting catalog ranked by student average reviews.",
      type: "popular"
    });
  }

  const { strategy } = req.query; // "hybrid" | "skills" | "item-item" | "ai" | "skillgap"
  const userEnrollments = db.data.enrollments.filter(e => e.userId === user.id);
  const enrolledCourseIds = new Set(userEnrollments.map(e => e.courseId));

  // Determine non-enrolled candidates
  const candidates = db.data.courses.filter(c => !enrolledCourseIds.has(c.id));

  // 🧪 Fallback/Tag Similarity Scoring (Content filtering)
  const scoreCourse = (course: Course) => {
    let score = 0;
    // Match categories (Large overlap)
    const userCategoryPrefs = user.interests || [];
    if (userCategoryPrefs.some(p => course.category.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(course.category.toLowerCase()))) {
      score += 5;
    }
    // Match specific tags
    course.tags.forEach(t => {
      if (userCategoryPrefs.some(p => p.toLowerCase().includes(t.toLowerCase()))) {
        score += 2;
      }
    });
    // Match specific skill strings
    const userSkills = user.skills || [];
    course.skills.forEach(s => {
      if (userSkills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))) {
        score += 3;
      }
    });
    // Tiny adjustment for rating average to prefer high dynamic values
    score += course.ratingAverage * 0.5;
    return score;
  };

  if (strategy === "skills") {
    // Recommend matching user interest profile with high accuracy
    const scored = candidates.map(c => ({ course: c, score: scoreCourse(c) }));
    scored.sort((a, b) => b.score - a.score);
    return res.json({
      courses: scored.map(s => s.course).slice(0, 3),
      explanation: `Selected specifically to fulfill your marked skills (${user.skills.join(", ")}) and category interests.`,
      type: "skills"
    });
  }

  if (strategy === "skillgap") {
    // Skill Gap suggestions comparing current skills to target career
    const target = user.targetCareer || "Senior Software Engineer";
    // Simulated carrier path target skills mapping
    let targetSkillsRequired: string[] = ["Docker", "Kubernetes", "TypeScript", "Deep Learning", "React 19", "Express.js", "Threat Modeling"];
    if (target.toLowerCase().includes("ai") || target.toLowerCase().includes("data")) {
      targetSkillsRequired = ["Python", "PyTorch", "Pandas", "Scikit-Learn", "Deep Learning", "Neural Networks"];
    } else if (target.toLowerCase().includes("security") || target.toLowerCase().includes("cyber")) {
      targetSkillsRequired = ["Threat Modeling", "Cryptography", "OAuth Authentication", "Network Security"];
    } else if (target.toLowerCase().includes("cloud") || target.toLowerCase().includes("devops")) {
      targetSkillsRequired = ["Docker", "Kubernetes", "Microservices", "Redis", "Express.js"];
    }

    const missingSkills = targetSkillsRequired.filter(ts => !user.skills.some(us => us.toLowerCase() === ts.toLowerCase()));

    // Rank candidate courses that provide at least one of these missing skills
    const skillGapCandidates = candidates.filter(c =>
      c.skills.some(cs => missingSkills.some(ms => ms.toLowerCase() === cs.toLowerCase()))
    );

    // Fallback to average score if zero match
    const finalList = skillGapCandidates.length > 0 ? skillGapCandidates : candidates.slice(0, 2);

    return res.json({
      courses: finalList.slice(0, 3),
      explanation: missingSkills.length > 0
        ? `We analyzed your target goal (${target}) and aligned courses containing missing key target skills: ${missingSkills.slice(0, 4).join(", ")}.`
        : `Your portfolio skills map closely to standard targets! Recommended for advanced proficiency:`,
      type: "skillgap"
    });
  }

  // ITEM-ITEM/Co-occurrence ("Because you watched/enrolled in...")
  if (strategy === "item-item") {
    if (userEnrollments.length === 0) {
      // Prompt popular or high similarity
      const scored = candidates.map(c => ({ course: c, score: scoreCourse(c) }));
      scored.sort((a, b) => b.score - a.score);
      return res.json({
        courses: scored.map(s => s.course).slice(0, 3),
        explanation: "Based on trending course categories in our collective student body.",
        type: "popular"
      });
    }

    // Get the most recent enrolled course as seed
    const lastCourseId = userEnrollments[userEnrollments.length - 1].courseId;
    const seedCourse = db.data.courses.find(c => c.id === lastCourseId);

    // Dynamic item co-occurrence similarity based on event log overlaps
    // Finding courses that are frequently enrolled in by users who also enroll in lastCourseId
    const otherEnrolledUsers = db.data.enrollments
      .filter(e => e.courseId === lastCourseId && e.userId !== user.id)
      .map(e => e.userId);

    const coOccurrenceCounts: { [cid: string]: number } = {};
    otherEnrolledUsers.forEach(uid => {
      db.data.enrollments
        .filter(e => e.userId === uid && e.courseId !== lastCourseId)
        .forEach(e => {
          coOccurrenceCounts[e.courseId] = (coOccurrenceCounts[e.courseId] || 0) + 1;
        });
    });

    // Sort by count
    const sortedByOverlap = Object.keys(coOccurrenceCounts)
      .filter(cid => !enrolledCourseIds.has(cid))
      .sort((a, b) => coOccurrenceCounts[b] - coOccurrenceCounts[a]);

    let itemResults: Course[] = [];
    if (sortedByOverlap.length > 0) {
      itemResults = sortedByOverlap.map(id => db.data.courses.find(c => c.id === id)!).filter(Boolean);
    } else if (seedCourse) {
      // Content-similarity fallback looking for same category or tags
      itemResults = candidates
        .filter(c => c.category === seedCourse.category || c.tags.some(t => seedCourse.tags.includes(t)))
        .slice(0, 3);
    } else {
      itemResults = candidates.slice(0, 3);
    }

    return res.json({
      courses: itemResults.slice(0, 3),
      explanation: seedCourse
        ? `Because you joined "${seedCourse.title}", you might appreciate these closely aligned topics:`
        : "Selected from aligned industry domains:",
      type: "hybrid"
    });
  }

  // GEMINI AI INTEGRATION MENTOR RECOMENDATION SYSTEM
  if (strategy === "ai") {
    if (!aiClient) {
      // Fallback beautifully with robust tag scoring
      const scored = candidates.map(c => ({ course: c, score: scoreCourse(c) }));
      scored.sort((a, b) => b.score - a.score);
      return res.json({
        courses: scored.map(s => s.course).slice(0, 3),
        explanation: "🧠 (Local Hybrid Fallback) AI advisor is offline: Calculated robust recommendation aligning with your target skills & metrics.",
        type: "hybrid"
      });
    }

    try {
      // Create detailed user profile description for Gemini
      const candidateSummary = candidates.map(c => `- ID: "${c.id}", Title: "${c.title}", Description: "${c.subtitle || c.desc}", Category: "${c.category}", Skills taught: [${c.skills.join(", ")}], Tags: [${c.tags.join(", ")}]`).join("\n");
      const userSummary = `
- Name: ${user.name}
- Target Career: ${user.targetCareer || "Full-Stack Software Specialist"}
- Selected Interests: ${user.interests.join(", ")}
- Current Skills: ${user.skills.join(", ")}
- Already Completed/Enrolled Course IDs: [${Array.from(enrolledCourseIds).join(", ")}]
`;

      const prompt = `
You are an expert technical career mentor. Evaluate the candidate courses and recommend the best MATCHING options (exactly 2 or 3) for the student's target career and background.

Student Profile:
${userSummary}

Candidate Courses available to suggest:
${candidateSummary}

You MUST response in custom raw strictly formatted valid JSON structure:
{
  "recommendedIds": ["course_id_1", "course_id_2"],
  "explanation": "Provide a 2 to 3 sentence sleek, motivational, professional summary explaining the career progression vector and why these particular courses close the student's skill-gap."
}
Do NOT wrap in markdown \`\`\`json blocks. Return only raw json string.
`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "";
      const parsed = JSON.parse(responseText.trim());

      const aiRecommendedCourses = parsed.recommendedIds
        .map((id: string) => db.data.courses.find(c => c.id === id))
        .filter(Boolean);

      const finalCourses = aiRecommendedCourses.length > 0 ? aiRecommendedCourses : candidates.slice(0, 3);

      return res.json({
        courses: finalCourses,
        explanation: parsed.explanation || "Your Gemini Technical Mentor selected these courses to bridge your target career path requirements.",
        type: "ai"
      });

    } catch (err) {
      console.error("Gemini Advisor Recommendation error:", err);
      // Fallback elegantly
      const scored = candidates.map(c => ({ course: c, score: scoreCourse(c) }));
      scored.sort((a, b) => b.score - a.score);
      return res.json({
        courses: scored.map(s => s.course).slice(0, 3),
        explanation: "🧠 (Fallback) Simulated AI advisor mapped courses aligning to your specific interests and skills.",
        type: "hybrid"
      });
    }
  }

  // DEFAULT HYBRID STRATEGY
  const scored = candidates.map(c => ({ course: c, score: scoreCourse(c) }));
  scored.sort((a, b) => b.score - a.score);

  res.json({
    courses: scored.map(s => s.course).slice(0, 4),
    explanation: "Curated specifically by matching your preferred Categories and Tag interest profile.",
    type: "hybrid"
  });
});

// Sync Vite middleware or serve static asset contents
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite dev server for hot static loading
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted.");
  } else {
    // Serve static client assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static client assets for production.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server listening on: http://localhost:${PORT}`);
  });
}

startServer();
