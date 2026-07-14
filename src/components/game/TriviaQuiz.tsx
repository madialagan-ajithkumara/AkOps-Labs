"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, RotateCcw, Trophy, HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { triviaQuestions, type Question } from "@/lib/trivia-questions";

const QUESTION_COUNT = 10;
const QUESTION_TIME = 15;
const BEST_SCORE_KEY = "akops-trivia-best-score";

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

export default function TriviaQuiz() {
  const [status, setStatus] = useState<Status>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const current = questions[index];

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

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
    const picked = shuffle(triviaQuestions).slice(0, QUESTION_COUNT).map(shuffleQuestion);
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
        window.localStorage.setItem(BEST_SCORE_KEY, String(score));
        setBestScore(score);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const progressPct = useMemo(
    () => (status === "playing" ? Math.round((timeLeft / QUESTION_TIME) * 100) : 0),
    [status, timeLeft]
  );

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">DevOps Trivia Quiz</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            {QUESTION_COUNT} random questions on Docker, Kubernetes, CI/CD, Cloud,
            and Git. {QUESTION_TIME} seconds per question — faster correct answers
            score more.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startQuiz}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35"
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
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
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
              className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
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
