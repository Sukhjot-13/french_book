import React from "react";

export function PriorityBadge({ priority }: { priority?: number | null }) {
  if (priority === undefined || priority === null) return null;

  const styles: Record<number, { bg: string; text: string; label: string }> = {
    5: { bg: "bg-[#002147] text-white", text: "text-white", label: "P5 Essential" },
    4: { bg: "bg-[#0284c7] text-white", text: "text-white", label: "P4 High" },
    3: { bg: "bg-[#2563eb]/20 text-[#1d4ed8]", text: "text-[#1d4ed8]", label: "P3 Medium" },
    2: { bg: "bg-slate-200 text-slate-700", text: "text-slate-700", label: "P2 Low" },
    1: { bg: "bg-slate-100 text-slate-500", text: "text-slate-500", label: "P1 Supplementary" },
  };

  const style = styles[priority] || styles[3];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${style.bg}`}
      title={`Learning Priority ${priority}/5`}
    >
      ★ {style.label}
    </span>
  );
}

export function GroupBadge({ group }: { group?: string | null }) {
  if (!group) return null;

  const labels: Record<string, string> = {
    "1st_group": "1er Groupe (-er)",
    "2nd_group": "2e Groupe (-ir)",
    "3rd_group": "3e Groupe (-re/-oir)",
    "irregular": "Irrégulier",
    "defective": "Défectif",
    "impersonal": "Impersonnel",
  };

  const label = labels[group] || group;

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-800 font-medium">
      {label}
    </span>
  );
}

export function AuxiliaryBadge({ auxiliary }: { auxiliary?: string | null }) {
  if (!auxiliary) return null;

  const isEtre = auxiliary === "etre" || auxiliary === "être";
  const isBoth = auxiliary === "both";

  const text = isBoth ? "Avoir / Être" : isEtre ? "Aux: Être" : "Aux: Avoir";
  const bg = isBoth
    ? "bg-purple-100 text-purple-800"
    : isEtre
    ? "bg-amber-100 text-amber-900 border border-amber-300"
    : "bg-blue-50 text-blue-900";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${bg}`}>
      {text}
    </span>
  );
}

export function RegularityBadge({ regularity }: { regularity?: string | null }) {
  if (!regularity) return null;

  const isReg = regularity === "regular";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
        isReg ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
      }`}
    >
      {isReg ? "Régulier" : "Irrégulier"}
    </span>
  );
}

export function TransitivityBadge({ transitivity }: { transitivity?: string | null }) {
  if (!transitivity) return null;

  const labels: Record<string, string> = {
    transitive: "Transitif direct",
    transitive_indirect: "Transitif indirect",
    intransitive: "Intransitif",
    both: "Transitif & Intransitif",
    ditransitive: "Ditransitif",
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-50 text-cyan-900 border border-cyan-200">
      {labels[transitivity] || transitivity}
    </span>
  );
}

export function PosBadge({ pos }: { pos?: string | null }) {
  if (!pos) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 font-medium uppercase tracking-wider">
      {pos}
    </span>
  );
}

export function GenderBadge({ gender }: { gender?: string | null }) {
  if (!gender) return null;

  const isMasc = gender === "masculine" || gender === "m";
  const isFem = gender === "feminine" || gender === "f";

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
        isMasc
          ? "bg-blue-100 text-blue-900"
          : isFem
          ? "bg-rose-100 text-rose-900"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {isMasc ? "n.m." : isFem ? "n.f." : gender}
    </span>
  );
}

export function RegisterBadge({ register }: { register?: string | null }) {
  if (!register || register === "neutral") return null;

  const colors: Record<string, string> = {
    formal: "bg-indigo-50 text-indigo-800 border border-indigo-200",
    informal: "bg-amber-50 text-amber-800",
    colloquial: "bg-orange-100 text-orange-900",
    literary: "bg-purple-100 text-purple-900",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono capitalize ${colors[register] || "bg-slate-100 text-slate-700"}`}>
      {register}
    </span>
  );
}

export function CEFRBadge({ cefr }: { cefr?: string | null }) {
  if (!cefr) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#002147] text-white tracking-wider">
      {cefr.toUpperCase()}
    </span>
  );
}

export function MoodBadge({ mood }: { mood?: string | null }) {
  if (!mood) return null;

  const labels: Record<string, string> = {
    indicative: "Indicatif",
    subjunctive: "Subjonctif",
    conditional: "Conditionnel",
    imperative: "Impératif",
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
      {labels[mood] || mood}
    </span>
  );
}

export function CollocationBadge({ strength }: { strength?: string | null }) {
  if (!strength) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-900 border border-amber-200">
      {strength}
    </span>
  );
}
