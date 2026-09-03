import React from "react";
import { getConcepts } from "@/src/lib/data/selectors";
import { ConceptsExplorer } from "@/src/components/concepts/ConceptsExplorer";

export const metadata = {
  title: "Concepts Explorer | French Revision Platform",
  description: "Explore 206 grammatical, syntactic, and structural concepts of the French language.",
};

export default function ConceptsPage() {
  const concepts = getConcepts();

  return (
    <div className="space-y-6 pb-16">
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-sans text-primary tracking-tight">
            Concepts Explorer
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
          Browse the complete inventory of 206 linguistic, syntactic, and pedagogical concepts mapped across the French textbook. Filter by CEFR proficiency level, search key topics, and explore how rules, verbs, and expressions interlock.
        </p>
      </div>

      {/* CONCEPTS EXPLORER */}
      <ConceptsExplorer concepts={concepts} />
    </div>
  );
}
