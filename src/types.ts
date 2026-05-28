/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN"
}

export enum Level {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

export enum EnrollStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  interests: string[];
  skills: string[];
  targetCareer?: string;
  createdAt?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  desc: string;
  level: Level;
  category: string;
  skills: string[];
  tags: string[];
  thumbUrl: string;
  authorId: string;
  authorName: string;
  durationMs: number; // calculated from lessons
  createdAt: string;
  ratingAverage: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl?: string; // e.g. custom visual element or Youtube identifier
  contentMd: string; // Markdown summary of lesson
  order: number;
  durationS: number;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answerIndex: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId: string | null; // null for overall course quiz
  title: string;
  questions: QuizQuestion[];
  passPct: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  scorePct: number;
  passed: boolean;
  ts: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollStatus;
  startedAt: string;
  completedAt?: string;
}

export interface Progress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  completed: boolean;
  secondsWatched: number;
  updatedAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  courseId: string;
  stars: number; // 1-5
  comment?: string;
  createdAt: string;
  userName: string;
}

export interface Interaction {
  id: string;
  userId: string;
  courseId: string;
  event: string; // "view" | "wishlist" | "enroll" | "start_lesson" | "finish_lesson" | "rate" | "click_reco"
  ts: string;
  meta?: any;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RecommendationResponse {
  courses: Course[];
  explanation?: string;
  type: "hybrid" | "cf" | "content" | "ai" | "skillgap" | "popular";
}
