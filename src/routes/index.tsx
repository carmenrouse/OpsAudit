import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

const problems = [
  {
    title: "Hidden Revenue Leaks",
    description:
      "Your business is bleeding money in ways you can't see. Scheduling conflicts, process bottlenecks, underutilized staff — the average service business loses 15-25% of potential revenue to operational inefficiency.",
    icon: "💸",
  },
  {
    title: "Consultants Are Too Slow & Expensive",
    description:
      "A traditional ops audit costs $5k–$20k and takes weeks. By the time you get the report, the data is already stale. Small and mid-size businesses deserve better.",
    icon: "⏱️",
  },
  {
    title: "You Don't Know What to Fix First",
    description:
      "Everything feels urgent. But without data-backed prioritization, you're guessing. The wrong fix wastes time, money, and team morale.",
    icon: "🎯",
  },
];

const steps = [
  {
    number: "01",
    title: "Complete the Intake",
    description:
      "A structured 15-minute questionnaire about your business operations, staffing, costs, and pain points. No consultant meetings. No scheduling hassles.",
    color: "bg-indigo-600",
  },
  {
    number: "02",
    title: "AI Analyzes Your Ops",
    description:
      "Our engine applies proven frameworks — Lean, Theory of Constraints, Queuing Theory — to your specific inputs. The same methodologies top consultants use, but in minutes, not weeks.",
    color: "bg-emerald-600",
  },
  {
    number: "03",
    title: "Get Your Diagnostic Report",
    description:
      "A polished, actionable report that pinpoints where you're losing money (with dollar figures), why it's happening, and exactly what to fix — prioritized by ROI.",
    color: "bg-amber-600",
  },
];

const industries = [
  { name: "Restaurants", icon: "🍽️" },
  { name: "Medical Clinics", icon: "🏥" },
  { name: "Field Services", icon: "🔧" },
  { name: "Logistics & Delivery", icon: "🚚" },
  { name: "Salons & Spas", icon: "💇" },
  { name: "Auto Repair", icon: "🔩" },
  { name: "Dental Practices", icon: "🦷" },
  { name: "Cleaning Services", icon: "🧹" },
];

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white px-6 pb-24 pt-16 sm:pb-32 sm:pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />
          <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-emerald-100/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              AI-Powered Operational Audits
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Turn 15 Minutes Into an
              <span className="block text-indigo-600"> Expert-Level Ops Audit</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Stop losing money to hidden inefficiencies. Our AI applies proven
              operational frameworks — Lean, Theory of Constraints, Queuing Theory —
              to diagnose exactly where your service business is bleeding cash and
              what to fix first.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/intake"
                className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300"
              >
                Start Your Free Diagnostic
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Full report from $199.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-white/60 p-8 backdrop-blur-sm sm:grid-cols-4">
            {[
              { label: "Avg. Inefficiencies Found", value: "4.7" },
              { label: "Avg. Annual Savings Identified", value: "$187k" },
              { label: "Report Delivery Time", value: "< 2 min" },
              { label: "Frameworks Applied", value: "3" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-indigo-600 sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Business Is Losing Money — You Just Can't See It
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Operational inefficiency is the silent killer of margins in service
              businesses. Here's why most owners never catch it until it's too late.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <span className="text-4xl">{problem.icon}</span>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {problem.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From zero to actionable diagnostic in under 20 minutes. No consultants,
              no meetings, no waiting.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-12 top-16 hidden h-0.5 w-[calc(100%-3rem)] bg-indigo-200 sm:block" />
                )}
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ${step.color}`}
                >
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for Service Businesses
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              If you have 20-200 employees and run on processes — even imperfect ones —
              OpsAudit can find the gaps costing you real money.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-100"
              >
                <span className="text-2xl">{industry.icon}</span>
                <span className="font-medium text-gray-800">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-gradient-to-b from-indigo-600 to-indigo-800 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Diagnostic Report Includes
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Every report is structured, actionable, and backed by operational science.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Inefficiency Analysis",
                items: ["Top 3-5 operational bottlenecks", "Dollar figures per inefficiency", "Root cause breakdown", "Lean & TOC framework mapping"],
              },
              {
                title: "Prioritized Fixes",
                items: ["Ranked by ROI impact", "Time-estimated implementation", "Resource requirements", "Dependency mapping"],
              },
              {
                title: "Quick Wins",
                items: ["Actions under 30 days", "Zero-cost improvements", "High-impact, low-effort changes", "Immediate savings opportunities"],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-indigo-500/30 bg-white/10 p-8 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold">{section.title}</h3>
                <ul className="mt-6 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-indigo-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Pay per report or subscribe for continuous monitoring. No hidden fees, no
              long-term contracts.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                name: "Single Report",
                price: "$199",
                description: "One-time diagnostic. Perfect for a quick health check.",
                features: ["Full diagnostic report", "3 operational frameworks", "Prioritized recommendations", "Quick wins identified"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "5-Report Pack",
                price: "$749",
                description: "Multi-location or quarterly check-ins. Save $246.",
                features: ["5 full diagnostic reports", "Team-wide benchmarking", "Trend tracking", "Priority support"],
                cta: "Best Value",
                popular: true,
              },
              {
                name: "Monthly",
                price: "$499",
                description: "Quarterly audits + continuous dashboard. For serious ops teams.",
                features: ["Quarterly deep-dive reports", "Real-time benchmarking", "Continuous monitoring", "Expert debrief available"],
                cta: "Subscribe",
                popular: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border-2 p-8 shadow-sm transition-all hover:shadow-lg ${
                  tier.popular
                    ? "border-indigo-500 bg-white shadow-indigo-100"
                    : "border-gray-100 bg-white"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                  {tier.name === "Monthly" && (
                    <span className="text-gray-500">/mo</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/pricing"
                  className={`mt-8 flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    tier.popular
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Stop Guessing. Start Optimizing.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            In 15 minutes, you'll know exactly where your business is losing money —
            and exactly what to do about it. No commitment, no risk.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/intake"
              className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
            >
              Start Your Diagnostic Now
            </Link>
            <a
              href="/pricing"
              className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}