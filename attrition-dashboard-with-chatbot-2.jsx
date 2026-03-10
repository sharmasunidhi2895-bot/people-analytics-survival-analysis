import { useState, useMemo, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from "recharts";

const PALETTE = {
  bg: "#0C1222",
  card: "#131B2E",
  cardHover: "#1A2540",
  border: "#1E2D4A",
  borderLight: "#2A3F66",
  text: "#E8ECF4",
  textMuted: "#8899B4",
  textDim: "#5A6B87",
  accent: "#4F8EF7",
  accentLight: "#6BA3FF",
  danger: "#EF4444",
  dangerMuted: "#7F1D1D",
  warning: "#F59E0B",
  warningMuted: "#78350F",
  success: "#10B981",
  successMuted: "#064E3B",
  purple: "#A78BFA",
  cyan: "#22D3EE",
};

const tierColors = {
  "Very Low": PALETTE.success,
  "Low": "#34D399",
  "Moderate": PALETTE.warning,
  "High": "#F97316",
  "Critical": PALETTE.danger,
};

// ===== ALL DASHBOARD DATA =====
const deptAttritionData = [
  { name: "Sales", rate: 20.6, count: 446, color: PALETTE.danger },
  { name: "Human Resources", rate: 19.0, count: 63, color: PALETTE.warning },
  { name: "R&D", rate: 13.8, count: 961, color: PALETTE.accent },
];

const survivalData = [
  { year: 0, prob: 100 }, { year: 1, prob: 93.2 }, { year: 2, prob: 87.1 },
  { year: 3, prob: 82.4 }, { year: 4, prob: 78.9 }, { year: 5, prob: 75.3 },
  { year: 7, prob: 70.1 }, { year: 10, prob: 63.8 }, { year: 15, prob: 55.2 },
  { year: 20, prob: 48.7 },
];

const hazardData = [
  { factor: "OverTime", hr: 1.82, sig: "***", type: "risk" },
  { factor: "Frequent Travel", hr: 1.54, sig: "**", type: "risk" },
  { factor: "Career Stagnation", hr: 1.41, sig: "**", type: "risk" },
  { factor: "Promotion Velocity", hr: 1.33, sig: "*", type: "risk" },
  { factor: "Distance from Home", hr: 1.18, sig: "*", type: "risk" },
  { factor: "Num Companies", hr: 1.12, sig: "", type: "neutral" },
  { factor: "Gender (Male)", hr: 0.98, sig: "", type: "neutral" },
  { factor: "Training", hr: 0.89, sig: "", type: "protective" },
  { factor: "Work-Life Balance", hr: 0.78, sig: "*", type: "protective" },
  { factor: "Job Satisfaction", hr: 0.71, sig: "**", type: "protective" },
  { factor: "Manager Stability", hr: 0.64, sig: "***", type: "protective" },
  { factor: "Monthly Income", hr: 0.58, sig: "***", type: "protective" },
  { factor: "Engagement Score", hr: 0.52, sig: "***", type: "protective" },
  { factor: "Total Experience", hr: 0.47, sig: "***", type: "protective" },
  { factor: "Age", hr: 0.43, sig: "***", type: "protective" },
];

const riskTierData = [
  { tier: "Very Low", attrition: 4, count: 294, pct: 20 },
  { tier: "Low", attrition: 8, count: 294, pct: 20 },
  { tier: "Moderate", attrition: 15, count: 294, pct: 20 },
  { tier: "High", attrition: 24, count: 294, pct: 20 },
  { tier: "Critical", attrition: 35, count: 294, pct: 20 },
];

const promoData = [
  { years: "0", rate: 14 }, { years: "1", rate: 12 }, { years: "2", rate: 16 },
  { years: "3", rate: 19 }, { years: "4", rate: 22 }, { years: "5", rate: 24 },
  { years: "6", rate: 21 }, { years: "7+", rate: 26 },
];

const watchlistData = [
  { dept: "Sales", role: "Sales Executive", income: "$2,800", tenure: "1.2yr", promo: "0yr", satisfaction: 1, risk: 3.42, action: "Stay Interview + Comp Review" },
  { dept: "R&D", role: "Lab Technician", income: "$2,300", tenure: "2.0yr", promo: "2yr", satisfaction: 1, risk: 3.18, action: "Workload Review + Career Dev" },
  { dept: "Sales", role: "Sales Rep", income: "$3,100", tenure: "0.8yr", promo: "0yr", satisfaction: 2, risk: 2.95, action: "Onboarding Check-in" },
  { dept: "R&D", role: "Research Scientist", income: "$3,400", tenure: "4.1yr", promo: "4yr", satisfaction: 2, risk: 2.87, action: "Career Development" },
  { dept: "HR", role: "HR Associate", income: "$2,600", tenure: "3.5yr", promo: "3yr", satisfaction: 1, risk: 2.71, action: "Stay Interview + Career Dev" },
  { dept: "Sales", role: "Sales Executive", income: "$2,500", tenure: "1.5yr", promo: "1yr", satisfaction: 2, risk: 2.64, action: "Compensation Review" },
  { dept: "R&D", role: "Lab Technician", income: "$2,100", tenure: "1.1yr", promo: "1yr", satisfaction: 1, risk: 2.58, action: "Workload Review" },
];

const radarData = [
  { metric: "Overtime", leavers: 85, stayers: 32 },
  { metric: "Low Satisfaction", leavers: 72, stayers: 28 },
  { metric: "Career Stagnation", leavers: 65, stayers: 22 },
  { metric: "Low Income", leavers: 68, stayers: 35 },
  { metric: "Frequent Travel", leavers: 58, stayers: 20 },
  { metric: "Short Mgr Tenure", leavers: 62, stayers: 30 },
];

const DASHBOARD_CONTEXT = `You are an expert People Analytics AI assistant embedded in a Workforce Attrition Early Warning Dashboard. You answer questions about the data, findings, and retention strategies shown in this dashboard. Be concise, specific, and reference actual numbers from the data. Use People Analytics language.

Here is the complete dashboard data:

WORKFORCE OVERVIEW:
- Total employees: 1,470
- Overall attrition rate: 16.1% (237 voluntary separations)
- Median tenure (Kaplan-Meier): 5.0 years
- Critical risk employees: 294 (top 20% by risk score)
- Estimated annual savings from 10% retention improvement: $1.2M

DEPARTMENT ATTRITION:
- Sales: 20.6% attrition (446 employees) — highest
- Human Resources: 19.0% attrition (63 employees)
- R&D: 13.8% attrition (961 employees) — lowest

SURVIVAL ANALYSIS (Kaplan-Meier retention probabilities):
- Year 1: 93.2% retained
- Year 2: 87.1% retained (highest-risk period is years 0-2)
- Year 5: 75.3% retained
- Year 10: 63.8% retained
- Year 20: 48.7% retained

COX PROPORTIONAL HAZARDS MODEL (Concordance Index: 0.78):
Risk factors (Hazard Ratio > 1, increases attrition):
- OverTime: HR=1.82 (***) — #1 risk factor, 82% higher attrition risk
- Frequent Travel: HR=1.54 (**) — 54% higher risk
- Career Stagnation (3+ yrs no promotion): HR=1.41 (**) — 41% higher risk
- Promotion Velocity: HR=1.33 (*) — 33% higher risk
- Distance from Home: HR=1.18 (*) — 18% higher risk
- Num Companies Worked: HR=1.12 (not significant)

Protective factors (Hazard Ratio < 1, reduces attrition):
- Age: HR=0.43 (***) — 57% lower risk (strongest protective factor)
- Total Experience: HR=0.47 (***) — 53% lower risk
- Engagement Score: HR=0.52 (***) — 48% lower risk
- Monthly Income: HR=0.58 (***) — 42% lower risk
- Manager Stability: HR=0.64 (***) — 36% lower risk
- Job Satisfaction: HR=0.71 (**) — 29% lower risk
- Work-Life Balance: HR=0.78 (*) — 22% lower risk

RISK TIER VALIDATION (model-generated risk quintiles):
- Very Low tier: 4% actual attrition (294 employees)
- Low tier: 8% actual attrition (294 employees)
- Moderate tier: 15% actual attrition (294 employees)
- High tier: 24% actual attrition (294 employees)
- Critical tier: 35% actual attrition (294 employees)
The risk score correctly stratifies: Critical tier has ~9x the attrition rate of Very Low tier.

PROMOTION VELOCITY ANALYSIS:
- Employees with 0 years since promotion: 14% attrition
- 1 year: 12% attrition (lowest)
- 3 years: 19% attrition
- 5 years: 24% attrition
- 7+ years: 26% attrition (highest)
- Career-stagnated employees (3+ yrs tenure, 3+ yrs no promotion) leave at approximately 2x the rate of mobile employees.

HIGH-RISK WATCH LIST (top Critical-tier employees):
Primarily Sales Executives, Lab Technicians, and Sales Reps with low income, low satisfaction (1-2 out of 4), overtime, and stalled career progression. Recommended interventions include Stay Interviews, Compensation Reviews, Workload Reviews, Career Development conversations, and Onboarding Check-ins.

RETENTION STRATEGY:
Tier 1 (Immediate): Overtime audit + cap, career development conversations for stagnated employees, compensation benchmarking for bottom quartile.
Tier 2 (This Quarter): Strengthen onboarding/90-day check-ins, invest in manager training (manager stability is protective), evaluate hybrid options for travel-heavy roles.
Tier 3 (Ongoing): Deploy risk score dashboard for weekly HRBP reviews, quarterly model refresh, fairness audit before production deployment.

ROI ESTIMATE: If the early warning system retains 10% of Critical-tier employees who would otherwise leave (about 10 employees), at $120K replacement cost each, that's approximately $1.2M annual savings.

METHODOLOGY: Survival analysis using Kaplan-Meier estimator and Cox Proportional Hazards model on the IBM HR Analytics dataset (1,470 employees, 35 features). Risk scores generated via predict_partial_hazard from the Cox model.

When answering:
- Be specific with numbers from the data above
- Frame insights in terms of HR actions and business impact
- Use People Analytics language (workforce indicators, engagement signals, retention levers, etc.)
- Keep responses concise (2-4 sentences for simple questions, more for complex ones)
- If asked something not in the data, say so honestly

CRITICAL FORMAT REQUIREMENT:
After EVERY answer, you MUST end your response with exactly 3 contextual follow-up questions the user might want to ask next, based on what you just discussed. These must be wrapped in a special XML block like this:

<followups>
Question one here?
Question two here?
Question three here?
</followups>

The follow-up questions should be:
- Directly related to the topic you just answered about
- Progressively deeper (e.g., from overview to specific actions to ROI)
- Short (under 12 words each)
- Different from questions already asked in the conversation

Always include the <followups> block. Never skip it.`;

// ===== CHATBOT COMPONENT =====
function Chatbot({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your People Analytics assistant. I can answer questions about the attrition data, risk factors, survival analysis, retention strategies, and more. What would you like to know?", suggestions: [] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentSuggestions]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const initialSuggestions = [
    "What's the #1 attrition risk factor?",
    "Which department has highest attrition?",
    "What's the ROI of the early warning system?",
    "How does promotion delay affect attrition?",
    "What retention actions should we take first?",
  ];

  function parseFollowups(text) {
    const followupMatch = text.match(/<followups>([\s\S]*?)<\/followups>/);
    if (followupMatch) {
      const cleanText = text.replace(/<followups>[\s\S]*?<\/followups>/, "").trim();
      const suggestions = followupMatch[1]
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.endsWith("?"));
      return { cleanText, suggestions: suggestions.slice(0, 3) };
    }
    return { cleanText: text.trim(), suggestions: [] };
  }

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    setCurrentSuggestions([]);

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages
        .filter((m, i) => i > 0)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: DASHBOARD_CONTEXT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const rawText = data.content
        ?.filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n") || "I'm sorry, I couldn't process that request. Please try again.";

      const { cleanText, suggestions } = parseFollowups(rawText);

      setMessages(prev => [...prev, { role: "assistant", content: cleanText, suggestions }]);
      setCurrentSuggestions(suggestions);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again.", suggestions: [] }]);
      setCurrentSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, width: 420, height: 580,
      background: PALETTE.card, border: `1px solid ${PALETTE.borderLight}`,
      borderRadius: 16, display: "flex", flexDirection: "column",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(79,142,247,0.08)",
      zIndex: 1000, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: `1px solid ${PALETTE.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: `linear-gradient(135deg, ${PALETTE.card} 0%, #0E1629 100%)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 16,
            background: `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.purple})`,
          }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: PALETTE.text }}>Analytics Assistant</div>
            <div style={{ fontSize: 10, color: PALETTE.success, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PALETTE.success, boxShadow: `0 0 6px ${PALETTE.success}` }} />
              Powered by Claude
            </div>
          </div>
        </div>
        <button onClick={onToggle} style={{
          background: "none", border: "none", color: PALETTE.textMuted, cursor: "pointer",
          fontSize: 20, padding: "4px 8px", borderRadius: 6, lineHeight: 1,
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 16px 8px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "85%", padding: "10px 14px", borderRadius: 12,
              fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap",
              ...(msg.role === "user" ? {
                background: PALETTE.accent, color: "#fff",
                borderBottomRightRadius: 4,
              } : {
                background: "rgba(255,255,255,0.05)", color: PALETTE.text,
                border: `1px solid ${PALETTE.border}`, borderBottomLeftRadius: 4,
              }),
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.05)",
              border: `1px solid ${PALETTE.border}`, borderBottomLeftRadius: 4,
            }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: PALETTE.textDim,
                    animation: `pulse 1.2s infinite ${i * 0.2}s`,
                  }} />
                ))}
                <style>{`@keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }`}</style>
              </div>
            </div>
          </div>
        )}

        {/* Suggested questions — initial or dynamic follow-ups */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            {messages.length <= 1 && (
              <>
                <span style={{ fontSize: 10, color: PALETTE.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Try asking</span>
                {initialSuggestions.map((q, i) => (
                  <button key={`init-${i}`} onClick={() => sendMessage(q)} style={{
                    textAlign: "left", padding: "8px 12px", borderRadius: 8, fontSize: 12,
                    background: "rgba(79,142,247,0.06)", border: `1px solid ${PALETTE.border}`,
                    color: PALETTE.accentLight, cursor: "pointer", fontWeight: 500,
                    transition: "all 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(79,142,247,0.12)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(79,142,247,0.06)"}
                  >{q}</button>
                ))}
              </>
            )}
            {messages.length > 1 && currentSuggestions.length > 0 && (
              <>
                <span style={{ fontSize: 10, color: PALETTE.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 12, height: 1, background: PALETTE.border }} />
                  Follow-up questions
                  <span style={{ display: "inline-block", width: 12, height: 1, background: PALETTE.border }} />
                </span>
                {currentSuggestions.map((q, i) => (
                  <button key={`follow-${i}`} onClick={() => sendMessage(q)} style={{
                    textAlign: "left", padding: "8px 12px", borderRadius: 8, fontSize: 12,
                    background: "rgba(167,139,250,0.06)", border: `1px solid ${PALETTE.border}`,
                    color: PALETTE.purple, cursor: "pointer", fontWeight: 500,
                    transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(167,139,250,0.14)"; e.currentTarget.style.borderColor = PALETTE.borderLight; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(167,139,250,0.06)"; e.currentTarget.style.borderColor = PALETTE.border; }}
                  >
                    <span style={{ fontSize: 10, opacity: 0.6 }}>→</span>
                    {q}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 16px", borderTop: `1px solid ${PALETTE.border}`,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the attrition data..."
          disabled={loading}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${PALETTE.border}`,
            background: "rgba(255,255,255,0.04)", color: PALETTE.text, fontSize: 13,
            outline: "none", fontFamily: "inherit",
          }}
          onFocus={e => e.target.style.borderColor = PALETTE.accent}
          onBlur={e => e.target.style.borderColor = PALETTE.border}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer",
            background: input.trim() && !loading ? PALETTE.accent : PALETTE.border,
            color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
        >↑</button>
      </div>
    </div>
  );
}

// ===== REUSABLE COMPONENTS =====
const KpiCard = ({ label, value, sub, color = PALETTE.accent }) => (
  <div style={{
    background: PALETTE.card, border: `1px solid ${PALETTE.border}`,
    borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 6,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    <span style={{ fontSize: 12, color: PALETTE.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 32, fontWeight: 700, color: PALETTE.text, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    {sub && <span style={{ fontSize: 12, color: PALETTE.textDim }}>{sub}</span>}
  </div>
);

const SectionTitle = ({ children, badge }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: 8 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, color: PALETTE.text, margin: 0, letterSpacing: "-0.02em" }}>{children}</h2>
    {badge && <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: PALETTE.border, color: PALETTE.textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>{badge}</span>}
  </div>
);

const TabButton = ({ active, label, onClick }) => (
  <button onClick={onClick} style={{
    padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", transition: "all 0.2s",
    background: active ? PALETTE.accent : "transparent",
    color: active ? "#fff" : PALETTE.textMuted,
  }}>{label}</button>
);

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A2540", border: `1px solid ${PALETTE.borderLight}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <p style={{ color: PALETTE.textMuted, fontSize: 11, margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || PALETTE.text, fontSize: 13, margin: "2px 0", fontWeight: 500 }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// ===== MAIN DASHBOARD =====
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [chatOpen, setChatOpen] = useState(false);
  const sortedHazard = useMemo(() => [...hazardData].sort((a, b) => b.hr - a.hr), []);

  return (
    <div style={{ background: PALETTE.bg, minHeight: "100vh", color: PALETTE.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${PALETTE.card} 0%, #0E1629 100%)`,
        borderBottom: `1px solid ${PALETTE.border}`, padding: "28px 32px 20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE.success, boxShadow: `0 0 8px ${PALETTE.success}` }} />
              <span style={{ fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>People Analytics</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              Workforce Attrition Early Warning System
            </h1>
            <p style={{ fontSize: 13, color: PALETTE.textDim, margin: "6px 0 0", maxWidth: 600 }}>
              Survival analysis, risk scoring & retention strategy insights across 1,470 employees
            </p>
          </div>
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${PALETTE.border}` }}>
            <TabButton active={activeTab === "overview"} label="Overview" onClick={() => setActiveTab("overview")} />
            <TabButton active={activeTab === "survival"} label="Survival" onClick={() => setActiveTab("survival")} />
            <TabButton active={activeTab === "risk"} label="Risk Factors" onClick={() => setActiveTab("risk")} />
            <TabButton active={activeTab === "watchlist"} label="Watch List" onClick={() => setActiveTab("watchlist")} />
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px 40px", maxWidth: 1400, margin: "0 auto" }}>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          <KpiCard label="Total Workforce" value="1,470" sub="Active + separated" />
          <KpiCard label="Attrition Rate" value="16.1%" color={PALETTE.danger} sub="237 voluntary separations" />
          <KpiCard label="Median Tenure" value="5.0yr" color={PALETTE.accent} sub="Kaplan-Meier estimate" />
          <KpiCard label="Critical Risk" value="294" color={PALETTE.warning} sub="Top 20% by risk score" />
          <KpiCard label="Est. Savings" value="$1.2M" color={PALETTE.success} sub="10% retention improvement" />
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
                <SectionTitle badge="By Department">Attrition Hotspots</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={deptAttritionData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} horizontal={false} />
                    <XAxis type="number" tick={{ fill: PALETTE.textDim, fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 25]} />
                    <YAxis type="category" dataKey="name" tick={{ fill: PALETTE.textMuted, fontSize: 12, fontWeight: 500 }} width={120} />
                    <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
                    <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={28}>
                      {deptAttritionData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
                <SectionTitle badge="Comparison">Risk Profile: Leavers vs Active</SectionTitle>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={PALETTE.border} />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: PALETTE.textMuted, fontSize: 10 }} />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <Radar name="Leavers" dataKey="leavers" stroke={PALETTE.danger} fill={PALETTE.danger} fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Active" dataKey="stayers" stroke={PALETTE.accent} fill={PALETTE.accent} fillOpacity={0.1} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 11, color: PALETTE.textMuted }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
              <SectionTitle badge="Career Stagnation">Attrition Risk by Years Since Last Promotion</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={promoData} margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
                  <XAxis dataKey="years" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} label={{ value: "Years Since Last Promotion", position: "insideBottom", offset: -4, fill: PALETTE.textDim, fontSize: 11 }} />
                  <YAxis tick={{ fill: PALETTE.textDim, fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={36}>
                    {promoData.map((d, i) => <Cell key={i} fill={d.rate >= 20 ? PALETTE.danger : d.rate >= 16 ? PALETTE.warning : PALETTE.accent} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 12, color: PALETTE.textDim, marginTop: 8, lineHeight: 1.5 }}>
                Employees with 4+ years since their last promotion show attrition rates 40-85% above the org average. Career development conversations should be triggered at the 3-year mark.
              </p>
            </div>
          </div>
        )}

        {/* SURVIVAL */}
        {activeTab === "survival" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
              <SectionTitle badge="Kaplan-Meier">Employee Retention Probability Over Time</SectionTitle>
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={survivalData} margin={{ left: 10, right: 20 }}>
                  <defs>
                    <linearGradient id="survGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PALETTE.accent} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={PALETTE.accent} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
                  <XAxis dataKey="year" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} label={{ value: "Years at Company", position: "insideBottom", offset: -4, fill: PALETTE.textDim, fontSize: 11 }} />
                  <YAxis tick={{ fill: PALETTE.textDim, fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[40, 100]} />
                  <Tooltip content={<CustomTooltip formatter={v => `${v}% retained`} />} />
                  <Area type="monotone" dataKey="prob" stroke={PALETTE.accent} strokeWidth={3} fill="url(#survGrad)" name="Retention" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { yr: 1, prob: "93.2%", note: "Early attrition window" },
                { yr: 2, prob: "87.1%", note: "Highest risk period" },
                { yr: 5, prob: "75.3%", note: "Stabilization begins" },
                { yr: 10, prob: "63.8%", note: "Long-tenure cohort" },
              ].map(({ yr, prob, note }) => (
                <div key={yr} style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 10, padding: "16px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: PALETTE.textDim, marginBottom: 4, fontWeight: 600 }}>YEAR {yr}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: PALETTE.text, fontFamily: "'JetBrains Mono', monospace" }}>{prob}</div>
                  <div style={{ fontSize: 11, color: PALETTE.textMuted, marginTop: 4 }}>{note}</div>
                </div>
              ))}
            </div>
            <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
              <SectionTitle>Key Survival Insights for Workforce Planning</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { title: "Critical Window: 0–2 Years", desc: "13% of employees leave within 2 years. Onboarding quality and early manager relationships are the highest-ROI retention investments.", color: PALETTE.danger },
                  { title: "Stabilization: 3–5 Years", desc: "Attrition slows as employees deepen organizational ties. Career progression conversations at Year 3 prevent stagnation-driven exits.", color: PALETTE.warning },
                  { title: "Long-Term: 5+ Years", desc: "Remaining employees show strong retention. Compensation equity and leadership development keep this cohort engaged.", color: PALETTE.success },
                ].map(({ title, desc, color }, i) => (
                  <div key={i} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RISK FACTORS */}
        {activeTab === "risk" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
              <SectionTitle badge="Cox Proportional Hazards">Hazard Ratios — Workforce Risk & Protective Factors</SectionTitle>
              <p style={{ fontSize: 12, color: PALETTE.textDim, marginBottom: 16, lineHeight: 1.5 }}>
                Hazard Ratio &gt; 1 = increases attrition risk &nbsp;|&nbsp; HR &lt; 1 = protective factor &nbsp;|&nbsp; Model C-index: 0.78
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sortedHazard.map((d, i) => {
                  const maxHr = 2.0;
                  const barWidth = Math.min(Math.abs(d.hr - 1) / (maxHr - 1) * 100, 100);
                  const isRisk = d.hr > 1;
                  const color = d.type === "risk" ? PALETTE.danger : d.type === "protective" ? PALETTE.success : PALETTE.textDim;
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px 40px", alignItems: "center", gap: 12, padding: "6px 0" }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: PALETTE.textMuted, textAlign: "right" }}>{d.factor}</span>
                      <div style={{ position: "relative", height: 22, background: "rgba(255,255,255,0.03)", borderRadius: 4 }}>
                        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: PALETTE.border }} />
                        <div style={{
                          position: "absolute",
                          left: isRisk ? "50%" : `${50 - barWidth / 2}%`,
                          width: `${barWidth / 2}%`,
                          top: 2, bottom: 2, background: color, borderRadius: 3, opacity: 0.7,
                        }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{d.hr.toFixed(2)}</span>
                      <span style={{ fontSize: 11, color: PALETTE.textDim }}>{d.sig}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
              <SectionTitle badge="Risk Scoring">Attrition Rate by Model Risk Tier</SectionTitle>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={riskTierData} margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
                  <XAxis dataKey="tier" tick={{ fill: PALETTE.textMuted, fontSize: 11 }} />
                  <YAxis tick={{ fill: PALETTE.textDim, fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip formatter={v => `${v}%`} />} />
                  <Bar dataKey="attrition" radius={[6, 6, 0, 0]} barSize={48} name="Attrition Rate">
                    {riskTierData.map((d, i) => <Cell key={i} fill={tierColors[d.tier]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 12, color: PALETTE.textDim, marginTop: 8 }}>
                Critical-tier attrition (35%) is ~9x higher than Very Low tier (4%), validating the model for HRBP deployment.
              </p>
            </div>
          </div>
        )}

        {/* WATCHLIST */}
        {activeTab === "watchlist" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
              <SectionTitle badge="HRBP Action Required">High-Risk Employee Watch List</SectionTitle>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Dept", "Role", "Income", "Tenure", "Last Promo", "Satisfaction", "Risk", "Recommended Action"].map((h, i) => (
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: PALETTE.textMuted, borderBottom: `2px solid ${PALETTE.border}`, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {watchlistData.map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: "12px", color: PALETTE.textMuted }}>{row.dept}</td>
                        <td style={{ padding: "12px", color: PALETTE.text, fontWeight: 500 }}>{row.role}</td>
                        <td style={{ padding: "12px", color: PALETTE.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{row.income}</td>
                        <td style={{ padding: "12px", color: PALETTE.textMuted }}>{row.tenure}</td>
                        <td style={{ padding: "12px", color: PALETTE.textMuted }}>{row.promo}</td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", gap: 3 }}>
                            {[1, 2, 3, 4].map(n => (
                              <div key={n} style={{ width: 8, height: 8, borderRadius: 2, background: n <= row.satisfaction ? (row.satisfaction <= 2 ? PALETTE.danger : PALETTE.success) : PALETTE.border }} />
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: row.risk > 3 ? PALETTE.danger : PALETTE.warning }}>{row.risk.toFixed(2)}</span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {row.action.split(" + ").map((a, j) => (
                              <span key={j} style={{
                                fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                                background: a.includes("Stay") ? PALETTE.dangerMuted : a.includes("Comp") ? PALETTE.warningMuted : a.includes("Career") ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.06)",
                                color: a.includes("Stay") ? "#FCA5A5" : a.includes("Comp") ? "#FCD34D" : a.includes("Career") ? PALETTE.accentLight : PALETTE.textMuted,
                              }}>{a}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: 24 }}>
              <SectionTitle badge="Action Plan">Retention Strategy Recommendations</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {[
                  { priority: "IMMEDIATE", color: PALETTE.danger, items: [
                    { action: "Overtime Audit", detail: "Cap overtime for high-risk teams; redistribute workload" },
                    { action: "Career Conversations", detail: "Flag 294 stagnated employees for development plans" },
                    { action: "Comp Review", detail: "Benchmark bottom-quartile salaries against market" },
                  ]},
                  { priority: "THIS QUARTER", color: PALETTE.warning, items: [
                    { action: "Onboarding Overhaul", detail: "Strengthen 90-day check-ins (highest-risk window)" },
                    { action: "Manager Training", detail: "Invest in manager quality (strongest protective factor)" },
                    { action: "Travel Policy", detail: "Evaluate hybrid options for travel-heavy roles" },
                  ]},
                  { priority: "ONGOING", color: PALETTE.accent, items: [
                    { action: "Deploy Risk Dashboard", detail: "Weekly HRBP reviews of risk-scored employees" },
                    { action: "Quarterly Model Refresh", detail: "Retrain as workforce composition shifts" },
                    { action: "Fairness Audit", detail: "Ensure risk scores don't encode demographic bias" },
                  ]},
                ].map(({ priority, color, items }, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "0.08em", marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${color}30` }}>{priority}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {items.map((item, j) => (
                        <div key={j}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.text, marginBottom: 3 }}>{item.action}</div>
                          <div style={{ fontSize: 11, color: PALETTE.textDim, lineHeight: 1.5 }}>{item.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, padding: "16px 0", borderTop: `1px solid ${PALETTE.border}`, textAlign: "center" }}>
          <span style={{ fontSize: 11, color: PALETTE.textDim }}>
            People Analytics Portfolio — Sunidhi Sharma &nbsp;|&nbsp; Survival Analysis + Cox PH + Risk Scoring &nbsp;|&nbsp; IBM HR Dataset (n=1,470)
          </span>
        </div>
      </div>

      {/* Chat FAB */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: 16, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.purple})`,
          color: "#fff", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 32px rgba(79,142,247,0.3), 0 0 16px rgba(79,142,247,0.15)`,
          transition: "transform 0.2s",
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        >💬</button>
      )}

      {/* Chatbot */}
      <Chatbot isOpen={chatOpen} onToggle={() => setChatOpen(false)} />
    </div>
  );
}
