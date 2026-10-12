import React from "react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center font-bold text-sm tracking-wider">
            CS
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-base">
              ChakraSaakshya
            </span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              Foundation
            </span>
          </div>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link
            href="/"
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            System Status
          </Link>
          <a
            href="https://github.com/bh00mi-11/ChakraSaakshya"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4">
        WeMakeDevs × FalkorDB Hackathon (Track 01: Agents That Act on Connected Data) — Pre-Event Foundation
      </div>
    </footer>
  );
}
