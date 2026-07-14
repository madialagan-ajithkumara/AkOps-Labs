"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, RotateCcw, Trophy, HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { allTriviaQuestions, type Question } from "@/lib/trivia-questions";

const QUESTION_TIME = 15;

type Status = "intro" | "playing" | "answered" | "finished";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleQuestion(q: Question): Question {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex),
  };
}

type Props = {
  categories?: string[];
  title?: string;
  description?: string;
  questionCount?: number;
  accentFrom?: string;
  accentTo?: string;
  storageKey?: string;
};

export default function TriviaQuiz({
  categories,
  title = "DevOps Trivia Quiz",
  description,
  questionCount = 10,
  accentFrom = "#2563eb",
  accentTo = "#06b6d4",
  storageKey = "akops-trivia-best-score",
}: Props) {
  const [status, setStatus] = useState<Status>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const pool = useMemo(
    () => (categories && categories.length > 0
      ? allTriviaQuestions.filter((q) => categories.includes(q.category))
      : allTriviaQuestions),
    [categories]
  );

  const current = questions[index];

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setBestScore(Number(stored));
  }, [storageKey]);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  function startQuiz() {
    const count = Math.min(questionCount, pool.length);
    const picked = shuffle(pool).slice(0, count).map(shuffleQuestion);
    setQuestions(picked);
    setIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(QUESTION_TIME);
    setSelected(null);
    setStatus("playing");
  }

  function handleAnswer(optionIndex: number) {
    if (status !== "playing") return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === current.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 50 + timeLeft * 5);
      setCorrectCount((c) => c + 1);
    }
    setStatus("answered");
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      setStatus("finished");
      return;
    }
    setIndex((i) => i + 1);
    setTimeLeft(QUESTION_TIME);
    setSelected(null);
    setStatus("playing");
  }

  useEffect(() => {
    if (status === "finished") {
      if (bestScore === null || score > bestScore) {
        window.localStorage.setItem(storageKey, String(score));
        setBestScore(score);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const progressPct = useMemo(
    () => (status === "playing" ? Math.round((timeLeft / QUESTION_TIME) * 100) : 0),
    [status, timeLeft]
  );

  const gradient = { backgroundImage: `linear-gradient(to right, ${accentFrom}, ${accentTo})` };

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: `${accentFrom}1a`, color: accentFrom }}
          >
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">{title}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            {description ??
              `${Math.min(questionCount, pool.length)} questions, ${QUESTION_TIME} seconds each — faster correct answers score more.`}
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startQuiz}
            style={gradient}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl"
          >
            <Play className="h-4 w-4" />
            Start Quiz
          </button>
        </div>
      )}

      {(status === "playing" || status === "answered") && current && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Question {index + 1} of {questions.length}</span>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">{current.category}</span>
            <span>{timeLeft}s</span>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-black/[0.06]">
            <div
              className="h-1.5 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%`, ...gradient }}
            />
          </div>

          <h3 className="mt-6 text-lg font-bold leading-snug">{current.question}</h3>

          <div className="mt-5 grid gap-3">
            {current.options.map((opt, i) => {
              const isCorrect = i === current.correctIndex;
              const isSelected = i === selected;
              let stateClasses = "border-black/10 bg-white hover:border-accent/40";
              if (status === "answered") {
                if (isCorrect) stateClasses = "border-accent bg-accent-soft text-accent";
                else if (isSelected) stateClasses = "border-red-300 bg-red-50 text-red-600";
                else stateClasses = "border-black/10 bg-white opacity-60";
              }
              return (
                <button
                  key={i}
                  disabled={status === "answered"}
                  onClick={() => handleAnswer(i)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${stateClasses}`}
                >
                  {opt}
                  {status === "answered" && isCorrect && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
                  {status === "answered" && isSelected && !isCorrect && <XCircle className="h-4 w-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {status === "answered" && (
            <button
              onClick={nextQuestion}
              style={gradient}
              className="mx-auto mt-6 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
            >
              {index + 1 >= questions.length ? "See results" : "Next question"}
            </button>
          )}
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Quiz complete!</h2>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {questions.length} correct
          </p>
          <p className="text-4xl font-extrabold text-gradient">{score}</p>
          {bestScore !== null && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestScore}
            </p>
          )}
          <button
            onClick={startQuiz}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
