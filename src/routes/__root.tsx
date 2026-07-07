import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OpsAudit — AI-Powered Operational Audits for Service Businesses" },
      { name: "description", content: "Turn a 15-minute structured intake into an instant, expert-level operational audit. Pinpoint exactly where you're losing money and what to fix first." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            OA
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            OpsAudit
          </span>
        </a>
        <nav className="flex items-center gap-6">
          <a href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </a>
          <a href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </a>
          <a
            href="/intake"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
          >
            Start Your Audit
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
            OA
          </div>
          <span className="text-sm font-semibold text-gray-700">OpsAudit</span>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} OpsAudit. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="/pricing" className="hover:text-gray-700 transition-colors">Pricing</a>
          <a href="/intake" className="hover:text-gray-700 transition-colors">Get Started</a>
        </div>
      </div>
    </footer>
  );
}