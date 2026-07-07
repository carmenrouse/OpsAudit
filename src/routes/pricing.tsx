import { createFileRoute, Link } from "@tanstack/react-router";
import type { Route } from "~/routes/intake";

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>) => ({
    session: typeof search.session === "string" ? search.session : undefined,
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Single Report",
    price: "$199",
    description: "One-time diagnostic. Perfect for a quick health check.",
    features: [
      "Full diagnostic report",
      "3 operational frameworks",
      "Prioritized recommendations",
      "Quick wins identified",
    ],
    popular: false,
    href: "#", // Stripe payment link placeholder
  },
  {
    name: "5-Report Pack",
    price: "$749",
    description: "Multi-location or quarterly check-ins. Save $246.",
    features: [
      "5 full diagnostic reports",
      "Team-wide benchmarking",
      "Trend tracking",
      "Priority support",
    ],
    popular: true,
    href: "#",
  },
  {
    name: "Monthly Subscription",
    price: "$499",
    description: "Quarterly audits + continuous dashboard. For serious ops teams.",
    features: [
      "Quarterly deep-dive reports",
      "Real-time benchmarking",
      "Continuous monitoring",
      "Expert debrief available",
    ],
    popular: false,
    href: "#",
    period: "/mo",
  },
];

function PricingPage() {
  const { session } = Route.useSearch();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {session ? "Almost There — Unlock Your Report" : "Simple, Transparent Pricing"}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {session
              ? "Your intake is complete! Choose a plan to unlock your full diagnostic report."
              : "Pay per report or subscribe for continuous monitoring. No hidden fees."}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 shadow-sm transition-all hover:shadow-lg ${
                plan.popular
                  ? "border-indigo-500 bg-white shadow-indigo-100"
                  : "border-gray-100 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  // Stripe payment link will go here
                  // For now, show a message
                  alert("Stripe payment links will be configured by the team lead.");
                }}
                className={`mt-8 flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.popular
                    ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                {plan.popular ? "Get Started" : plan.name === "Monthly Subscription" ? "Subscribe" : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        {/* Post-purchase flow info */}
        {session && (
          <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 p-6 text-center">
            <p className="text-sm text-indigo-700">
              <strong>Note:</strong> Your session is saved. After payment, you'll be redirected to your
              full diagnostic report.
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-center text-2xl font-bold text-gray-900">Questions?</h2>
          <div className="mx-auto mt-8 max-w-2xl space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">What happens after I purchase?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your diagnostic report is generated instantly by our AI engine and delivered
                on a dedicated page you can print or share.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Can I get a refund?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Yes — if you're not satisfied, we'll refund your first report within 14 days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">What if I want a human expert?</h3>
              <p className="mt-1 text-sm text-gray-600">
                After your AI report, you can book a 1-on-1 debrief with an operational expert
                for $299/hour. Available to all customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
