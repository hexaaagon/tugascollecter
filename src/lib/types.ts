export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  deadline?: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "deadline" | "event";
  homeworkId?: string;
}

export const MOCK_HOMEWORK: Homework[] = [
  {
    id: "1",
    title: "Mathematics Assignment Chapter 5",
    subject: "Mathematics",
    description:
      "Complete exercises 1-20 from chapter 5, including word problems",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: "high",
    completed: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Physics Lab Report",
    subject: "Physics",
    description: "Write a detailed lab report on the pendulum experiment",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    priority: "high",
    completed: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "History Essay",
    subject: "History",
    description: "Write a 1500-word essay on World War II causes",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: "medium",
    completed: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Programming Project",
    subject: "Computer Science",
    description: "Build a mobile app using React Native",
    priority: "low",
    completed: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Chemistry Quiz Preparation",
    subject: "Chemistry",
    description: "Study chapters 8-10 for upcoming quiz",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    priority: "medium",
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];
