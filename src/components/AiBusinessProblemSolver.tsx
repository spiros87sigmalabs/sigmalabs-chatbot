import React, { useState, useEffect } from "react";

type IndustryKey = "fintech" | "saas" | "healthcare" | "ecommerce" | "founding";

interface Option {
  label: string;
  nextSteps: (string | StepWithOptions)[];
}

interface StepWithOptions {
  text: string;
  options?: Option[];
}

type Step = string | StepWithOptions;

interface Scenario {
  title: string;
  steps: Step[];
}

// Σενάρια με decision points
const industryScenarios: Record<IndustryKey, Scenario> = {
  fintech: {
    title: "🔐 FinTech: Real-time Fraud Defense",
    steps: [
      "🚨 Unusual transaction pattern detected from user #4521",
      {
        text: "⚠️ Threat detected! What action do you want to take?",
        options: [
          {
            label: "Delete User",
            nextSteps: [
              "🗑️ User #4521 deleted from system",
              "✅ Threat neutralized by removal",
              "📊 Risk metrics updated across platform in real time",
            ],
          },
          {
            label: "Block User Temporarily",
            nextSteps: [
              "⛔ User #4521 temporarily blocked",
              "📲 Verification request sent to user",
              "✅ Threat minimized while awaiting verification",
              "📊 Risk metrics updated across platform in real time",
            ],
          },
          {
            label: "Ignore / Leave As Is",
            nextSteps: [
              "⚠️ No action taken",
              "🚨 Threat may persist — monitor closely",
              "📊 Risk metrics updated across platform in real time",
            ],
          },
        ],
      },
    ],
  },
  saas: {
    title: "📉 SaaS: Customer Churn Reduction",
    steps: [
      "⚠️ User engagement dropped by 30% over last week",
      {
        text: "💡 Identified 3 key pain points causing churn risk. What do you want to do?",
        options: [
          {
            label: "Launch Email Campaign",
            nextSteps: [
              "📤 Automated personalized email campaigns launched",
              "🔄 Incentives offered to high-risk customers",
              "✅ Churn rate dropped 15% within 5 days",
            ],
          },
          {
            label: "Ignore for Now",
            nextSteps: [
              "⚠️ No action taken",
              "📉 Risk of churn remains high",
            ],
          },
        ],
      },
    ],
  },
  healthcare: {
    title: "🏥 Healthcare: Critical Data Flow Optimization",
    steps: [
      "🚨 Real-time patient monitoring data delayed by 3 seconds",
      "🧠 AI identifies bottleneck in data pipeline at hospital #7",
      {
        text: "🔧 Alert sent to IT support team. What next?",
        options: [
          {
            label: "Reroute Data Pipeline",
            nextSteps: [
              "⚙️ System reroutes data through secondary secure channel",
              "✅ Patient dashboards updated with zero latency",
              "📈 System stability improved by 27%",
            ],
          },
          {
            label: "Monitor Only",
            nextSteps: [
              "⌛ Monitoring ongoing, no reroute yet",
              "⚠️ Delays may persist",
            ],
          },
        ],
      },
    ],
  },
  ecommerce: {
    title: "🛒 E-commerce: Boosting Conversion Rates",
    steps: [
      "📉 Conversion rate for featured product dropped by 25%",
      {
        text: "🧠 AI runs multivariate tests on price, images, copy. Choose an action:",
        options: [
          {
            label: "Deploy 15% Discount + New Photo",
            nextSteps: [
              "📤 Deploys changes to 30% of user traffic",
              "✅ Conversion rate increases by 18% within 48 hours",
              "💰 Revenue impact: +$12K weekly",
            ],
          },
          {
            label: "Wait and Analyze More",
            nextSteps: [
              "⌛ Further testing scheduled",
              "⚠️ Conversion rate impact unknown",
            ],
          },
        ],
      },
    ],
  },
  founding: {
    title: "💼 Founding & Client Management Platform",
    steps: [
      "📋 New client onboarded via intuitive registration flow",
      {
        text: "⏳ Funding program activated. Choose action:",
        options: [
          {
            label: "Send Referral Incentives",
            nextSteps: [
              "🔗 Referral system incentivizes partners for new signups",
              "📈 Client satisfaction and retention metrics improving steadily",
            ],
          },
          {
            label: "Skip Referral Incentives",
            nextSteps: [
              "⚠️ Referral system inactive",
              "📊 Growth slower than expected",
            ],
          },
        ],
      },
      "📲 Real-time updates pushed to client mobile and web portals",
      "⚙️ Scalable platform handles increasing demand effortlessly",
    ],
  },
};

const TYPING_SPEED = 40; // ms per character
const PAUSE_BETWEEN_STEPS = 1200; // ms pause after step finishes typing

const AiBusinessProblemSolver: React.FC = () => {
  const [industry, setIndustry] = useState<IndustryKey>("fintech");
  const [displayedSteps, setDisplayedSteps] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [waitingForDecision, setWaitingForDecision] = useState(false);
  const [decisionOptions, setDecisionOptions] = useState<Option[] | null>(null);
  const [postDecisionSteps, setPostDecisionSteps] = useState<Step[]>([]);
  const [postDecisionStepIndex, setPostDecisionStepIndex] = useState(0);
  const [postDecisionCharIndex, setPostDecisionCharIndex] = useState(0);

  const scenario = industryScenarios[industry];

  useEffect(() => {
    setDisplayedSteps([]);
    setCurrentTyping("");
    setStepIndex(0);
    setCharIndex(0);
    setWaitingForDecision(false);
    setDecisionOptions(null);
    setPostDecisionSteps([]);
    setPostDecisionStepIndex(0);
    setPostDecisionCharIndex(0);
  }, [industry]);

  // Typing before decision
  useEffect(() => {
    if (waitingForDecision) return; // pause typing if waiting user choice
    if (stepIndex >= scenario.steps.length) return;

    const step = scenario.steps[stepIndex];

    if (typeof step === "string") {
      if (charIndex < step.length) {
        const timeout = setTimeout(() => {
          setCurrentTyping((prev) => prev + step[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, TYPING_SPEED);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedSteps((prev) => [...prev, step]);
          setCurrentTyping("");
          setStepIndex((prev) => prev + 1);
          setCharIndex(0);
        }, PAUSE_BETWEEN_STEPS);
        return () => clearTimeout(timeout);
      }
    } else if (step.options) {
      // Step with options - pause and wait for decision
      setWaitingForDecision(true);
      setDecisionOptions(step.options);
      setCurrentTyping(step.text);
    } else {
      // Step is object with text only (no options)
      if (charIndex < step.text.length) {
        const timeout = setTimeout(() => {
          setCurrentTyping((prev) => prev + step.text[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, TYPING_SPEED);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedSteps((prev) => [...prev, step.text]);
          setCurrentTyping("");
          setStepIndex((prev) => prev + 1);
          setCharIndex(0);
        }, PAUSE_BETWEEN_STEPS);
        return () => clearTimeout(timeout);
      }
    }
  }, [charIndex, stepIndex, scenario.steps, waitingForDecision]);

  // Typing after user decision
  useEffect(() => {
    if (!waitingForDecision && postDecisionSteps.length === 0) return;
    if (postDecisionStepIndex >= postDecisionSteps.length) return;

    const step = postDecisionSteps[postDecisionStepIndex];

    if (typeof step === "string") {
      if (postDecisionCharIndex < step.length) {
        const timeout = setTimeout(() => {
          setCurrentTyping((prev) => prev + step[postDecisionCharIndex]);
          setPostDecisionCharIndex((prev) => prev + 1);
        }, TYPING_SPEED);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedSteps((prev) => [...prev, step]);
          setCurrentTyping("");
          setPostDecisionStepIndex((prev) => prev + 1);
          setPostDecisionCharIndex(0);
        }, PAUSE_BETWEEN_STEPS);
        return () => clearTimeout(timeout);
      }
    } else if (step.options) {
      // (optional) handle nested decisions here if you want — currently not implemented
      // For simplicity, just append text if no options supported in postDecisionSteps
      if (postDecisionCharIndex < step.text.length) {
        const timeout = setTimeout(() => {
          setCurrentTyping((prev) => prev + step.text[postDecisionCharIndex]);
          setPostDecisionCharIndex((prev) => prev + 1);
        }, TYPING_SPEED);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedSteps((prev) => [...prev, step.text]);
          setCurrentTyping("");
          setPostDecisionStepIndex((prev) => prev + 1);
          setPostDecisionCharIndex(0);
        }, PAUSE_BETWEEN_STEPS);
        return () => clearTimeout(timeout);
      }
    }
  }, [postDecisionCharIndex, postDecisionStepIndex, postDecisionSteps, waitingForDecision]);

  const handleDecision = (option: Option) => {
    setWaitingForDecision(false);
    setDecisionOptions(null);
    setDisplayedSteps((prev) => [...prev, currentTyping, `> ${option.label}`]);
    setCurrentTyping("");
    setPostDecisionSteps(option.nextSteps);
    setPostDecisionStepIndex(0);
    setPostDecisionCharIndex(0);
    setStepIndex((prev) => prev + 1);
  };

  const handleAiChoose = () => {
    if (!decisionOptions || decisionOptions.length === 0) return;
    // AI chooses the first option by default
    handleDecision(decisionOptions[0]);
  };

  return (
    <div className="bg-gray-900 text-white py-12 px-6 md:px-20 rounded-2xl shadow-2xl my-16 max-w-4xl mx-auto font-mono">
      <h2 className="text-3xl font-bold mb-8 text-center">⚡ AI Business Problem Solver</h2>

      {/* Industry selector */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {Object.keys(industryScenarios).map((key) => (
          <button
            key={key}
            onClick={() => setIndustry(key as IndustryKey)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border cursor-pointer transition ${
              industry === key
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-600 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard-like panel */}
      <div
        className="bg-gray-800 rounded-lg p-6 overflow-auto max-h-72 border border-gray-700 shadow-inner"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <h3 className="text-xl font-semibold mb-4">{scenario.title}</h3>

        <ul className="space-y-2 min-h-[8rem]">
          {displayedSteps.map((step, i) => (
            <li key={i} className="text-green-400">
              {step}
            </li>
          ))}

          {!waitingForDecision && (stepIndex < scenario.steps.length || postDecisionStepIndex < postDecisionSteps.length) && (
            <li className="text-green-400">
              {currentTyping}
              <span className="blinking-cursor">|</span>
            </li>
          )}

          {/* Show decision buttons if waiting */}
          {waitingForDecision && decisionOptions && (
            <li>
              <div className="flex flex-wrap gap-3 mt-3 items-center">
                {decisionOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleDecision(opt)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white text-sm transition"
                  >
                    {opt.label}
                  </button>
                ))}
                {/* AI Choose Button */}
                <button
                  onClick={handleAiChoose}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-white text-sm transition ml-2"
                  title="Let AI choose the best option"
                >
                  Let AI choose
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <a
          href="#cta"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-3 rounded-full transition"
        >
          Want this for your business? Book a free 30' call
        </a>
      </div>

      {/* Blinking cursor animation */}
      <style>{`
        .blinking-cursor {
          display: inline-block;
          width: 1ch;
          animation: blink 1.2s steps(2, start) infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AiBusinessProblemSolver;
