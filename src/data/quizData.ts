export interface QuizQuestionData {
  id: number;
  image: string;
  options: string[];
  correctAnswer: string;
}

export const quizQuestions: QuizQuestionData[] = [
  {
    id: 1,
    image: "/quiz-fish-1.jpg",
    options: ["Red Morwong", "Kingfish", "Goatfish", "Red Rock Cod"],
    correctAnswer: "Red Morwong"
  },
  {
    id: 2,
    image: "/quiz-fish-1.jpg",
    options: ["Kingfish", "Red Rock Cod", "Bream", "Goatfish"],
    correctAnswer: "Goatfish"
  },
  {
    id: 3,
    image: "/quiz-fish-1.jpg",
    options: ["Salmon", "Black Marlin", "Kingfish", "Snapper"],
    correctAnswer: "Kingfish"
  },
  {
    id: 4,
    image: "/quiz-fish-1.jpg",
    options: ["Flathead", "Whiting", "Leatherjacket", "Dart"],
    correctAnswer: "Leatherjacket"
  },
  {
    id: 5,
    image: "/quiz-fish-1.jpg",
    options: ["Blue Morwong", "Ludrick", "Bream", "Silver Trevally"],
    correctAnswer: "Ludrick"
  },
  {
    id: 6,
    image: "/quiz-fish-1.jpg",
    options: ["Red Emperor", "Snapper", "Pink Snapper", "Coral Trout"],
    correctAnswer: "Snapper"
  },
  {
    id: 7,
    image: "/quiz-fish-1.jpg",
    options: ["Yellowtail Kingfish", "Samson Fish", "Amberjack", "Trevally"],
    correctAnswer: "Yellowtail Kingfish"
  },
  {
    id: 8,
    image: "/quiz-fish-1.jpg",
    options: ["Flathead", "Lizardfish", "Stargazer", "Sand Whiting"],
    correctAnswer: "Flathead"
  },
  {
    id: 9,
    image: "/quiz-fish-1.jpg",
    options: ["Murray Cod", "Barramundi", "Australian Bass", "Golden Perch"],
    correctAnswer: "Barramundi"
  },
  {
    id: 10,
    image: "/quiz-fish-1.jpg",
    options: ["Mackerel", "Bonito", "Tuna", "Spanish Mackerel"],
    correctAnswer: "Spanish Mackerel"
  },
  {
    id: 11,
    image: "/quiz-fish-1.jpg",
    options: ["John Dory", "Mirror Dory", "Silver Dory", "King Dory"],
    correctAnswer: "John Dory"
  },
  {
    id: 12,
    image: "/quiz-fish-1.jpg",
    options: ["Cobia", "Shark", "Grouper", "Giant Trevally"],
    correctAnswer: "Cobia"
  }
];