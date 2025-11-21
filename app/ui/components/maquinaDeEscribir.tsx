"use client";
import React, { useEffect, useState } from "react";

type TypewriterProps = {
  phrases?: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
};

export default function Typewriter({
  phrases = ["Desarrollador Web", "Diseñador UX/UI", "Freelancer"],
  typeSpeed = 80,
  deleteSpeed = 40,
  pause = 1200,
  className = "",
}: TypewriterProps) {
  const [display, setDisplay] = useState<string>("");
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const current = phrases[phraseIndex % phrases.length];

    if (!deleting && charIndex <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex));
        setCharIndex((i) => i + 1);
      }, typeSpeed);
    } else if (deleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex));
        setCharIndex((i) => i - 1);
      }, deleteSpeed);
    } else if (!deleting && charIndex > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex < 0) {
      setDeleting(false);
      setCharIndex(0);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pause]);

  return (
    <span
      className={`block w-full text-center max-w-full md:max-w-[60ch] whitespace-normal break-words align-middle ${className}`}
      aria-live="polite"
    >
      <span className="inline-block leading-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-400">
          {display}
        </span>
        <span
          className="inline-block ml-1 align-bottom h-6 w-[2px] animate-blink"
          aria-hidden="true"
        />
      </span>

      <style jsx>{`
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
          background-color: #0f172a;
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </span>
  );
}
