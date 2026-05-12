export type StudentProfile = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  guardian: string;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessonIds: string[];
};

export type Lesson = {
  id: string;
  topicId: string;
  type: "vocabulary" | "communication";
  title: string;
  phrase: string;
  description: string;
  visual: string;
  signHint: string;
  difficulty: "Easy" | "Medium";
  xp: number;
};

export type QuizQuestion = {
  id: string;
  lessonId: string;
  prompt: string;
  type: "image-choice" | "sign-choice" | "sentence-order";
  options: string[];
  answer: string;
  hint: string;
};

export type ExerciseType =
  | "learning"
  | "sign_practice"
  | "quiz"
  | "completion";

type BaseExercise = {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt?: string;
  instruction?: string;
  explanation?: string;
};

export type LearningExercise = BaseExercise & {
  type: "learning";
  title: string;
  content: string;
  targetWord?: string;
  sampleSignVideoUrl?: string;
  examples?: {
    text: string;
    translation?: string;
    signVideoUrl?: string;
  }[];
};

export type SignPracticeExercise = BaseExercise & {
  type: "sign_practice";
  targetWord: string;
  targetSignVideoUrl?: string;
  instruction?: string;
  maxRecordSeconds?: number;
  minConfidence?: number;
  allowRetry?: boolean;
};

export type QuizExercise = BaseExercise & {
  type: "quiz";
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    signVideoUrl?: string;
  }[];
};

export type CompletionExercise = BaseExercise & {
  type: "completion";
  score?: number;
  xp?: number;
  correctCount?: number;
  totalCount?: number;
  mistakes?: string[];
};

export type LessonExercise =
  | LearningExercise
  | SignPracticeExercise
  | QuizExercise
  | CompletionExercise;

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type LegacyAdminLessonDetail = {
  id: string;
  lessonId: string;
  title: string;
  label: string;
  description: string;
  status: string;
  details: string[];
};

export const profiles: StudentProfile[] = [
  {
    id: "minh",
    name: "Minh",
    age: 7,
    avatar: "M",
    guardian: "Lan",
  },
  {
    id: "an",
    name: "An",
    age: 6,
    avatar: "A",
    guardian: "Nam",
  },
  {
    id: "linh",
    name: "Linh",
    age: 8,
    avatar: "L",
    guardian: "Mai",
  },
];

export const topics: Topic[] = [
  {
    id: "family",
    title: "Family",
    description: "Parents, siblings, and warm everyday greetings.",
    icon: "Home",
    color: "bg-primary/10 text-primary",
    lessonIds: ["hello-family", "mother", "father"],
  },
  {
    id: "colors",
    title: "Colors",
    description: "Recognize colors through visuals and signs.",
    icon: "Palette",
    color: "text-primary",
    lessonIds: ["blue", "yellow", "red"],
  },
  {
    id: "feelings",
    title: "Feelings",
    description: "Express happy, sad, and asking for help.",
    icon: "Smile",
    color: "bg-emerald-100 text-emerald-800",
    lessonIds: ["happy", "sad", "help"],
  },
  {
    id: "school",
    title: "School",
    description: "Simple communication in the classroom.",
    icon: "BookOpen",
    color: "bg-amber-100 text-amber-800",
    lessonIds: ["teacher", "book", "thank-you"],
  },
];

export const lessons: Lesson[] = [
  {
    id: "hello-family",
    topicId: "family",
    type: "communication",
    title: "Hello, family",
    phrase: "Hello, family",
    description: "Practice greeting family members.",
    visual: "🏠",
    signHint: "Open your hand gently from near the chin outward, with a smile.",
    difficulty: "Easy",
    xp: 12,
  },
  {
    id: "mother",
    topicId: "family",
    type: "vocabulary",
    title: "Mother",
    phrase: "Mother",
    description: "Recognize the sign for mother.",
    visual: "👩",
    signHint: "Place an open hand near the cheek and move it slightly forward.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "father",
    topicId: "family",
    type: "vocabulary",
    title: "Father",
    phrase: "Father",
    description: "Recognize the sign for father.",
    visual: "👨",
    signHint: "Place an open hand near the forehead and move it slightly forward.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "blue",
    topicId: "colors",
    type: "vocabulary",
    title: "Blue",
    phrase: "Blue",
    description: "Learn the sign for ocean blue.",
    visual: "🌊",
    signHint: "Gently shake a B-shaped hand in front of the chest.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "yellow",
    topicId: "colors",
    type: "vocabulary",
    title: "Yellow",
    phrase: "Yellow",
    description: "Learn the sign for yellow like a star.",
    visual: "⭐",
    signHint: "Gently twist the hand near the shoulder with palm facing out.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "red",
    topicId: "colors",
    type: "vocabulary",
    title: "Red",
    phrase: "Red",
    description: "Recognize the sign for red.",
    visual: "🍎",
    signHint: "Touch the index finger near the lips, then move it down gently.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "happy",
    topicId: "feelings",
    type: "vocabulary",
    title: "Happy",
    phrase: "Happy",
    description: "Say that you feel happy with a sign.",
    visual: "😊",
    signHint: "Open both hands in front of the chest and move them up gently.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "sad",
    topicId: "feelings",
    type: "vocabulary",
    title: "Sad",
    phrase: "Sad",
    description: "Recognize the feeling of sadness.",
    visual: "☁️",
    signHint: "Move the fingers downward in front of the face with a sad expression.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "help",
    topicId: "feelings",
    type: "communication",
    title: "I need help",
    phrase: "I need help",
    description: "Use this when you need support from an adult.",
    visual: "🤝",
    signHint: "One hand supports the other, then lifts gently upward.",
    difficulty: "Medium",
    xp: 14,
  },
  {
    id: "teacher",
    topicId: "school",
    type: "vocabulary",
    title: "Teacher",
    phrase: "Teacher",
    description: "Learn the sign for teacher.",
    visual: "🧑‍🏫",
    signHint: "Open both hands near the temples, then move them down in front.",
    difficulty: "Medium",
    xp: 12,
  },
  {
    id: "book",
    topicId: "school",
    type: "vocabulary",
    title: "Book",
    phrase: "Book",
    description: "Recognize a classroom object.",
    visual: "📘",
    signHint: "Close both palms together, then open them like a book.",
    difficulty: "Easy",
    xp: 10,
  },
  {
    id: "thank-you",
    topicId: "school",
    type: "communication",
    title: "Thank you",
    phrase: "Thank you",
    description: "Practice a polite thank-you sentence.",
    visual: "💛",
    signHint: "Move the hand from the chin outward with a friendly expression.",
    difficulty: "Easy",
    xp: 12,
  },
];

export const quizzes: QuizQuestion[] = lessons.flatMap((lesson) => [
  {
    id: `${lesson.id}-meaning`,
    lessonId: lesson.id,
    prompt: `What does this sign mean?`,
    type: "sign-choice",
    options: [lesson.phrase, "I am sorry", "Purple", "Go outside"],
    answer: lesson.phrase,
    hint: `Remember the picture ${lesson.visual} and the phrase "${lesson.phrase}".`,
  },
  {
    id: `${lesson.id}-match`,
    lessonId: lesson.id,
    prompt: `Choose the picture that best matches "${lesson.phrase}"`,
    type: "image-choice",
    options: [lesson.visual, "🚗", "🍌", "🎈"],
    answer: lesson.visual,
    hint: "Look back at the large picture from the lesson.",
  },
]);

export const badges: Badge[] = [
  {
    id: "first-lesson",
    title: "First ocean step",
    description: "Complete your first lesson.",
    icon: "Star",
  },
  {
    id: "perfect-quiz",
    title: "Perfect answers",
    description: "Answer every question correctly in one lesson.",
    icon: "Trophy",
  },
  {
    id: "three-lessons",
    title: "Steady learner",
    description: "Complete 3 lessons.",
    icon: "Medal",
  },
];

export type AdminLearningData = {
  topics: Topic[];
  lessons: Lesson[];
  exercises: LessonExercise[];
};

const ADMIN_LEARNING_STORAGE_KEY = "sign-ocean-admin-learning-data";

function createDefaultAdminLearningData(): AdminLearningData {
  return {
    topics,
    lessons,
    exercises: [],
  };
}

function mergeAdminLearningData(data: Partial<AdminLearningData>) {
  const topicMap = new Map(topics.map((topic) => [topic.id, topic]));
  const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  for (const topic of data.topics ?? []) {
    if (topic?.id) topicMap.set(topic.id, topic);
  }

  for (const lesson of data.lessons ?? []) {
    if (lesson?.id) lessonMap.set(lesson.id, lesson);
  }

  const legacyDetails = (
    data as Partial<AdminLearningData> & {
      lessonDetails?: LegacyAdminLessonDetail[];
    }
  ).lessonDetails;
  const migratedExercises: LessonExercise[] = (legacyDetails ?? [])
    .filter((detail) => Boolean(detail?.id && detail.lessonId && detail.title))
    .map((detail) => ({
      id: detail.id,
      lessonId: detail.lessonId,
      type: "learning",
      title: detail.title,
      content: detail.description,
      prompt: detail.label,
      explanation: detail.details.join("\n"),
      examples: detail.details.map((item) => ({ text: item })),
    }));

  return {
    topics: Array.from(topicMap.values()),
    lessons: Array.from(lessonMap.values()),
    exercises: [...migratedExercises, ...(data.exercises ?? [])].filter(
      (exercise): exercise is LessonExercise =>
        Boolean(exercise?.id && exercise.lessonId && exercise.type)
    ),
  };
}

export function readAdminLearningData(): AdminLearningData {
  if (typeof window === "undefined") return createDefaultAdminLearningData();

  try {
    const raw = window.localStorage.getItem(ADMIN_LEARNING_STORAGE_KEY);
    if (!raw) return createDefaultAdminLearningData();
    return mergeAdminLearningData(JSON.parse(raw));
  } catch {
    return createDefaultAdminLearningData();
  }
}

export function writeAdminLearningData(data: AdminLearningData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_LEARNING_STORAGE_KEY,
    JSON.stringify(data)
  );
}

export function getLesson(lessonId: string) {
  return readAdminLearningData().lessons.find((lesson) => lesson.id === lessonId);
}

export function getTopic(topicId: string) {
  return readAdminLearningData().topics.find((topic) => topic.id === topicId);
}

export function getTopicLessons(topicId: string) {
  const data = readAdminLearningData();
  const topic = data.topics.find((item) => item.id === topicId);
  if (!topic) return [];
  return topic.lessonIds
    .map((lessonId) => data.lessons.find((lesson) => lesson.id === lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson));
}

export function getLessonQuiz(lessonId: string) {
  return quizzes.filter((question) => question.lessonId === lessonId);
}
