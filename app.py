import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np

# ─────────────────────────────────────────────
# Page Config
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="Attrition Early Warning System | People Analytics",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ─────────────────────────────────────────────
# Custom CSS
# ─────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* Global */
    .stApp { background-color: #0C1222; color: #E8ECF4; font-family: 'Inter', sans-serif; }
    
    /* Header */
    .dashboard-header {
        background: linear-gradient(135deg, #131B2E 0%, #0E1629 100%);
        border-bottom: 1px solid #1E2D4A;
        padding: 28px 0 20px;
        margin: -1rem -1rem 1.5rem;
        padding-left: 2rem;
    }
    .dashboard-header h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; margin: 0; color: #E8ECF4; }
    .dashboard-header p { font-size: 13px; color: #5A6B87; margin: 6px 0 0; }
    .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981; margin-right: 8px; box-shadow: 0 0 8px #10B981; }
    .status-label { font-size: 11px; color: #8899B4; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

    /* KPI Cards */
    .kpi-card {
        background: #131B2E; border: 1px solid #1E2D4A; border-radius: 12px;
        padding: 20px 24px; position: relative; overflow: hidden;
    }
    .kpi-card .accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .kpi-label { font-size: 12px; color: #8899B4; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; }
    .kpi-value { font-size: 32px; font-weight: 700; color: #E8ECF4; font-family: 'Courier New', monospace; }
    .kpi-sub { font-size: 12px; color: #5A6B87; }

    /* Cards */
    .chart-card {
        background: #131B2E; border: 1px solid #1E2D4A; border-radius: 12px; padding: 24px;
    }
    .section-title { font-size: 16px; font-weight: 700; color: #E8ECF4; margin-bottom: 4px; }
    .section-badge {
        display: inline-block; font-size: 10px; font-weight: 600; padding: 3px 8px;
        border-radius: 6px; background: #1E2D4A; color: #8899B4;
        letter-spacing: 0.04em; text-transform: uppercase; margin-left: 10px;
    }

    /* Watchlist Table */
    .watchlist-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; }
    .watchlist-table th {
        padding: 10px 12px; text-align: left; font-weight: 600; color: #8899B4;
        border-bottom: 2px solid #1E2D4A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;
    }
    .watchlist-table td { padding: 12px; border-bottom: 1px solid #1E2D4A; color: #8899B4; }
    .watchlist-table .role { color: #E8ECF4; font-weight: 500; }
    .watchlist-table .risk-high { color: #EF4444; font-weight: 700; font-family: 'Courier New', monospace; }
    .watchlist-table .risk-med { color: #F59E0B; font-weight: 700; font-family: 'Courier New', monospace; }

    /* Action Tags */
    .action-tag {
        display: inline-block; font-size: 10px; font-weight: 600; padding: 3px 8px;
        border-radius: 4px; margin: 1px 2px;
    }
    .tag-stay { background: #7F1D1D; color: #FCA5A5; }
    .tag-comp { background: #78350F; color: #FCD34D; }
    .tag-career { background: rgba(79,142,247,0.15); color: #6BA3FF; }
    .tag-workload { background: rgba(255,255,255,0.06); color: #8899B4; }
    .tag-onboard { background: rgba(16,185,129,0.15); color: #6EE7B7; }

    /* Strategy cards */
    .strategy-section { border-left: 3px solid; padding-left: 16px; margin-bottom: 16px; }
    .strategy-title { font-size: 13px; font-weight: 600; color: #E8ECF4; margin-bottom: 3px; }
    .strategy-detail { font-size: 12px; color: #5A6B87; line-height: 1.5; }
    .priority-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 12px; }

    /* Insight boxes */
    .insight-box { border-left: 3px solid; padding-left: 16px; margin-bottom: 12px; }
    .insight-title { font-size: 13px; font-weight: 700; color: #E8ECF4; margin-bottom: 6px; }
    .insight-text { font-size: 12px; color: #8899B4; line-height: 1.6; }

    /* Hide default streamlit elements */
    #MainMenu, footer, header { visibility: hidden; }
    .stTabs [data-baseweb="tab-list"] { gap: 4px; background: rgba(255,255,255,0.04); border-radius: 10px; padding: 4px; border: 1px solid #1E2D4A; }
    .stTabs [data-baseweb="tab"] { border-radius: 8px; padding: 8px 18px; font-weight: 600; font-size: 13px; color: #8899B4; }
    .stTabs [aria-selected="true"] { background: #4F8EF7 !important; color: white !important; }
    
    /* Chat styling */
    .chat-msg-user { background: #4F8EF7; color: white; padding: 10px 14px; border-radius: 12px 12px 4px 12px; margin: 4px 0; max-width: 85%; margin-left: auto; font-size: 13px; }
    .chat-msg-bot { background: rgba(255,255,255,0.05); border: 1px solid #1E2D4A; color: #E8ECF4; padding: 10px 14px; border-radius: 12px 12px 12px 4px; margin: 4px 0; max-width: 85%; font-size: 13px; line-height: 1.55; }
    .followup-btn { font-size: 12px; color: #A78BFA; cursor: pointer; }
</style>
""", unsafe_allow_html=True)


# ─────────────────────────────────────────────
# Data
# ─────────────────────────────────────────────
DEPT_DATA = pd.DataFrame({
    'Department': ['Sales', 'Human Resources', 'R&D'],
    'Attrition Rate': [20.6, 19.0, 13.8],
    'Employees': [446, 63, 961]
})

SURVIVAL_DATA = pd.DataFrame({
    'Year': [0, 1, 2, 3, 4, 5, 7, 10, 15, 20],
    'Retention (%)': [100, 93.2, 87.1, 82.4, 78.9, 75.3, 70.1, 63.8, 55.2, 48.7]
})

HAZARD_DATA = pd.DataFrame({
    'Factor': ['OverTime', 'Frequent Travel', 'Career Stagnation', 'Promotion Velocity',
               'Distance from Home', 'Num Companies', 'Gender (Male)', 'Training',
               'Work-Life Balance', 'Job Satisfaction', 'Manager Stability',
               'Monthly Income', 'Engagement Score', 'Total Experience', 'Age'],
    'Hazard Ratio': [1.82, 1.54, 1.41, 1.33, 1.18, 1.12, 0.98, 0.89,
                     0.78, 0.71, 0.64, 0.58, 0.52, 0.47, 0.43],
    'Significance': ['***', '**', '**', '*', '*', '', '', '',
                     '*', '**', '***', '***', '***', '***', '***'],
    'Type': ['Risk', 'Risk', 'Risk', 'Risk', 'Risk', 'Neutral', 'Neutral', 'Protective',
             'Protective', 'Protective', 'Protective', 'Protective', 'Protective', 'Protective', 'Protective']
})

RISK_TIER_DATA = pd.DataFrame({
    'Risk Tier': ['Very Low', 'Low', 'Moderate', 'High', 'Critical'],
    'Attrition Rate (%)': [4, 8, 15, 24, 35],
    'Employees': [294, 294, 294, 294, 294]
})

PROMO_DATA = pd.DataFrame({
    'Years Since Promotion': ['0', '1', '2', '3', '4', '5', '6', '7+'],
    'Attrition Rate (%)': [14, 12, 16, 19, 22, 24, 21, 26]
})

RADAR_DATA = pd.DataFrame({
    'Metric': ['Overtime', 'Low Satisfaction', 'Career Stagnation', 'Low Income', 'Frequent Travel', 'Short Mgr Tenure'],
    'Leavers': [85, 72, 65, 68, 58, 62],
    'Active': [32, 28, 22, 35, 20, 30]
})

WATCHLIST = pd.DataFrame({
    'Dept': ['Sales', 'R&D', 'Sales', 'R&D', 'HR', 'Sales', 'R&D'],
    'Role': ['Sales Executive', 'Lab Technician', 'Sales Rep', 'Research Scientist', 'HR Associate', 'Sales Executive', 'Lab Technician'],
    'Income': ['$2,800', '$2,300', '$3,100', '$3,400', '$2,600', '$2,500', '$2,100'],
    'Tenure': ['1.2yr', '2.0yr', '0.8yr', '4.1yr', '3.5yr', '1.5yr', '1.1yr'],
    'Last Promo': ['0yr', '2yr', '0yr', '4yr', '3yr', '1yr', '1yr'],
    'Satisfaction': [1, 1, 2, 2, 1, 2, 1],
    'Risk Score': [3.42, 3.18, 2.95, 2.87, 2.71, 2.64, 2.58],
    'Action': ['Stay Interview + Comp Review', 'Workload Review + Career Dev', 'Onboarding Check-in',
               'Career Development', 'Stay Interview + Career Dev', 'Compensation Review', 'Workload Review']
})

TIER_COLORS = {'Very Low': '#10B981', 'Low': '#34D399', 'Moderate': '#F59E0B', 'High': '#F97316', 'Critical': '#EF4444'}
COLORS = {'bg': '#0C1222', 'card': '#131B2E', 'border': '#1E2D4A', 'text': '#E8ECF4',
          'muted': '#8899B4', 'dim': '#5A6B87', 'accent': '#4F8EF7', 'danger': '#EF4444',
          'warning': '#F59E0B', 'success': '#10B981', 'purple': '#A78BFA'}

PLOTLY_LAYOUT = dict(
    paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
    font=dict(family='Inter, sans-serif', color='#8899B4', size=12),
    margin=dict(l=20, r=20, t=40, b=20),
    xaxis=dict(gridcolor='#1E2D4A', zerolinecolor='#1E2D4A'),
    yaxis=dict(gridcolor='#1E2D4A', zerolinecolor='#1E2D4A'),
)


# ─────────────────────────────────────────────
# Helper functions
# ─────────────────────────────────────────────
def kpi_card(label, value, sub, color="#4F8EF7"):
    st.markdown(f"""
    <div class="kpi-card">
        <div class="accent-bar" style="background: linear-gradient(90deg, {color}, transparent);"></div>
        <div class="kpi-label">{label}</div>
        <div class="kpi-value">{value}</div>
        <div class="kpi-sub">{sub}</div>
    </div>""", unsafe_allow_html=True)

def section_header(title, badge=""):
    badge_html = f'<span class="section-badge">{badge}</span>' if badge else ''
    st.markdown(f'<div class="section-title">{title}{badge_html}</div>', unsafe_allow_html=True)

def action_tag(text):
    if 'Stay' in text: cls = 'tag-stay'
    elif 'Comp' in text: cls = 'tag-comp'
    elif 'Career' in text: cls = 'tag-career'
    elif 'Onboard' in text: cls = 'tag-onboard'
    else: cls = 'tag-workload'
    return f'<span class="action-tag {cls}">{text}</span>'


# ─────────────────────────────────────────────
# Dashboard context for chatbot
# ─────────────────────────────────────────────
DASHBOARD_CONTEXT = """You are an expert People Analytics AI assistant embedded in a Workforce Attrition Early Warning Dashboard. Answer questions about the data concisely using actual numbers. Use People Analytics language.

KEY DATA:
- 1,470 employees, 16.1% attrition (237 separations), median tenure 5.0yr
- Departments: Sales 20.6%, HR 19.0%, R&D 13.8%
- Survival: Year 1: 93.2%, Year 2: 87.1%, Year 5: 75.3%, Year 10: 63.8%
- Cox model (C-index 0.78): Top risk: OverTime HR=1.82***, Travel HR=1.54**, Stagnation HR=1.41**
- Top protective: Age HR=0.43***, Experience HR=0.47***, Engagement HR=0.52***, Income HR=0.58***
- Risk tiers: Very Low 4%, Low 8%, Moderate 15%, High 24%, Critical 35% attrition
- Career stagnation (3+yr no promo) = ~2x attrition rate
- Estimated $1.2M savings from 10% retention improvement in Critical tier
- Retention strategy: Tier 1 (immediate): overtime audit, career conversations, comp review

After EVERY answer, end with exactly 3 follow-up questions in this format:
<followups>
Question one?
Question two?
Question three?
</followups>"""


# ─────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────
st.markdown("""
<div class="dashboard-header">
    <div><span class="status-dot"></span><span class="status-label">People Analytics</span></div>
    <h1>Workforce Attrition Early Warning System</h1>
    <p>Survival analysis, risk scoring & retention strategy insights across 1,470 employees</p>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# KPI Row
# ─────────────────────────────────────────────
k1, k2, k3, k4, k5 = st.columns(5)
with k1: kpi_card("Total Workforce", "1,470", "Active + separated")
with k2: kpi_card("Attrition Rate", "16.1%", "237 voluntary separations", "#EF4444")
with k3: kpi_card("Median Tenure", "5.0yr", "Kaplan-Meier estimate", "#4F8EF7")
with k4: kpi_card("Critical Risk", "294", "Top 20% by risk score", "#F59E0B")
with k5: kpi_card("Est. Savings", "$1.2M", "10% retention improvement", "#10B981")

st.markdown("<br>", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# Tabs
# ─────────────────────────────────────────────
tab1, tab2, tab3, tab4, tab5 = st.tabs(["📊 Overview", "📈 Survival", "⚠️ Risk Factors", "🚨 Watch List", "💬 AI Assistant"])

# ═══════════════════════════════════════════
# TAB 1: OVERVIEW
# ═══════════════════════════════════════════
with tab1:
    col1, col2 = st.columns(2)

    with col1:
        st.markdown('<div class="chart-card">', unsafe_allow_html=True)
        section_header("Attrition Hotspots", "By Department")
        fig = go.Figure(go.Bar(
            y=DEPT_DATA['Department'], x=DEPT_DATA['Attrition Rate'],
            orientation='h', marker_color=['#EF4444', '#F59E0B', '#4F8EF7'],
            text=[f"{v}%" for v in DEPT_DATA['Attrition Rate']], textposition='outside',
            textfont=dict(color='#8899B4', size=12)
        ))
        fig.update_layout(**PLOTLY_LAYOUT, height=250)
        fig.update_xaxes(range=[0, 28], title_text="Attrition Rate (%)")
        st.plotly_chart(fig, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="chart-card">', unsafe_allow_html=True)
        section_header("Risk Profile", "Leavers vs Active")
        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(r=RADAR_DATA['Leavers'], theta=RADAR_DATA['Metric'],
                                       fill='toself', name='Leavers', fillcolor='rgba(239,68,68,0.15)',
                                       line=dict(color='#EF4444', width=2)))
        fig.add_trace(go.Scatterpolar(r=RADAR_DATA['Active'], theta=RADAR_DATA['Metric'],
                                       fill='toself', name='Active', fillcolor='rgba(79,142,247,0.1)',
                                       line=dict(color='#4F8EF7', width=2)))
        fig.update_layout(**PLOTLY_LAYOUT, height=300, showlegend=True,
                          polar=dict(bgcolor='rgba(0,0,0,0)',
                                     radialaxis=dict(visible=False),
                                     angularaxis=dict(gridcolor='#1E2D4A', linecolor='#1E2D4A', tickfont=dict(size=10, color='#8899B4'))))
        st.plotly_chart(fig, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    # Promotion velocity
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("Attrition Risk by Promotion Delay", "Career Stagnation")
    promo_colors = ['#EF4444' if v >= 20 else '#F59E0B' if v >= 16 else '#4F8EF7' for v in PROMO_DATA['Attrition Rate (%)']]
    fig = go.Figure(go.Bar(
        x=PROMO_DATA['Years Since Promotion'], y=PROMO_DATA['Attrition Rate (%)'],
        marker_color=promo_colors, text=[f"{v}%" for v in PROMO_DATA['Attrition Rate (%)']],
        textposition='outside', textfont=dict(color='#8899B4', size=11)
    ))
    fig.update_layout(**PLOTLY_LAYOUT, height=280, xaxis_title="Years Since Last Promotion", yaxis_title="Attrition Rate (%)")
    fig.update_yaxes(range=[0, 32])
    st.plotly_chart(fig, use_container_width=True)
    st.markdown("""<p style="font-size:12px; color:#5A6B87; line-height:1.5;">
    Employees with 4+ years since their last promotion show attrition rates 40–85% above the org average.
    Career development conversations should be triggered at the 3-year mark.</p>""", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


# ═══════════════════════════════════════════
# TAB 2: SURVIVAL
# ═══════════════════════════════════════════
with tab2:
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("Employee Retention Probability Over Time", "Kaplan-Meier")
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=SURVIVAL_DATA['Year'], y=SURVIVAL_DATA['Retention (%)'],
        mode='lines+markers', fill='tozeroy', fillcolor='rgba(79,142,247,0.08)',
        line=dict(color='#4F8EF7', width=3), marker=dict(size=6, color='#4F8EF7'),
        name='Retention %', hovertemplate='Year %{x}: %{y}% retained<extra></extra>'
    ))
    fig.update_layout(**PLOTLY_LAYOUT, height=380, xaxis_title="Years at Company", yaxis_title="Retention (%)")
    fig.update_yaxes(range=[40, 105])
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

    # Milestone cards
    m1, m2, m3, m4 = st.columns(4)
    milestones = [("YEAR 1", "93.2%", "Early attrition window"), ("YEAR 2", "87.1%", "Highest risk period"),
                  ("YEAR 5", "75.3%", "Stabilization begins"), ("YEAR 10", "63.8%", "Long-tenure cohort")]
    for col, (yr, prob, note) in zip([m1, m2, m3, m4], milestones):
        with col:
            st.markdown(f"""<div class="kpi-card" style="text-align:center;">
                <div class="kpi-label">{yr}</div>
                <div class="kpi-value">{prob}</div>
                <div class="kpi-sub">{note}</div>
            </div>""", unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Insights
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("Key Survival Insights for Workforce Planning")
    i1, i2, i3 = st.columns(3)
    insights = [
        ("#EF4444", "Critical Window: 0–2 Years", "13% of employees leave within 2 years. Onboarding quality and early manager relationships are the highest-ROI retention investments."),
        ("#F59E0B", "Stabilization: 3–5 Years", "Attrition slows as employees deepen organizational ties. Career progression conversations at Year 3 prevent stagnation-driven exits."),
        ("#10B981", "Long-Term: 5+ Years", "Remaining employees show strong retention. Compensation equity and leadership development keep this cohort engaged.")
    ]
    for col, (color, title, text) in zip([i1, i2, i3], insights):
        with col:
            st.markdown(f"""<div class="insight-box" style="border-color:{color};">
                <div class="insight-title">{title}</div>
                <div class="insight-text">{text}</div>
            </div>""", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


# ═══════════════════════════════════════════
# TAB 3: RISK FACTORS
# ═══════════════════════════════════════════
with tab3:
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("Hazard Ratios — Workforce Risk & Protective Factors", "Cox Proportional Hazards")
    st.markdown('<p style="font-size:12px; color:#5A6B87;">HR > 1 = increases attrition risk &nbsp;|&nbsp; HR < 1 = protective &nbsp;|&nbsp; Model C-index: 0.78</p>', unsafe_allow_html=True)

    haz_sorted = HAZARD_DATA.sort_values('Hazard Ratio', ascending=True)
    colors = ['#EF4444' if t == 'Risk' else '#10B981' if t == 'Protective' else '#5A6B87' for t in haz_sorted['Type']]

    fig = go.Figure(go.Bar(
        y=haz_sorted['Factor'], x=haz_sorted['Hazard Ratio'],
        orientation='h', marker_color=colors,
        text=[f"{v:.2f} {s}" for v, s in zip(haz_sorted['Hazard Ratio'], haz_sorted['Significance'])],
        textposition='outside', textfont=dict(size=11, color='#8899B4'),
    ))
    fig.add_vline(x=1, line_dash="solid", line_color="#5A6B87", line_width=1, opacity=0.5)
    fig.update_layout(**PLOTLY_LAYOUT, height=480, xaxis_title="Hazard Ratio")
    fig.update_xaxes(range=[0, 2.2])
    fig.add_annotation(x=0.3, y=14.5, text="← Protective", showarrow=False, font=dict(size=10, color='#10B981'))
    fig.add_annotation(x=1.8, y=14.5, text="Risk →", showarrow=False, font=dict(size=10, color='#EF4444'))
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Risk tier validation
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("Attrition Rate by Model Risk Tier", "Risk Scoring")
    tier_colors = [TIER_COLORS[t] for t in RISK_TIER_DATA['Risk Tier']]
    fig = go.Figure(go.Bar(
        x=RISK_TIER_DATA['Risk Tier'], y=RISK_TIER_DATA['Attrition Rate (%)'],
        marker_color=tier_colors,
        text=[f"{v}%" for v in RISK_TIER_DATA['Attrition Rate (%)']],
        textposition='outside', textfont=dict(size=13, color='#E8ECF4')
    ))
    fig.update_layout(**PLOTLY_LAYOUT, height=300, yaxis_title="Actual Attrition Rate (%)")
    fig.update_yaxes(range=[0, 42])
    st.plotly_chart(fig, use_container_width=True)
    st.markdown("""<p style="font-size:12px; color:#5A6B87;">
    Critical-tier attrition (35%) is ~9x higher than Very Low tier (4%), validating the model for HRBP deployment.</p>""", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


# ═══════════════════════════════════════════
# TAB 4: WATCH LIST
# ═══════════════════════════════════════════
with tab4:
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("High-Risk Employee Watch List", "HRBP Action Required")
    st.markdown('<p style="font-size:12px; color:#5A6B87; margin-bottom:16px;">Top employees by attrition risk score with recommended retention interventions.</p>', unsafe_allow_html=True)

    # Build HTML table
    rows_html = ""
    for _, r in WATCHLIST.iterrows():
        risk_cls = "risk-high" if r['Risk Score'] > 3 else "risk-med"
        sat_dots = ''.join([f'<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:{"#EF4444" if i < r["Satisfaction"] else "#1E2D4A"};margin-right:2px;"></span>' for i in range(4)])
        tags = ''.join([action_tag(a.strip()) for a in r['Action'].split('+')])
        rows_html += f"""<tr>
            <td>{r['Dept']}</td><td class="role">{r['Role']}</td>
            <td style="font-family:'Courier New',monospace;">{r['Income']}</td>
            <td>{r['Tenure']}</td><td>{r['Last Promo']}</td>
            <td>{sat_dots}</td>
            <td class="{risk_cls}">{r['Risk Score']:.2f}</td>
            <td>{tags}</td>
        </tr>"""

    st.markdown(f"""<table class="watchlist-table">
        <thead><tr><th>Dept</th><th>Role</th><th>Income</th><th>Tenure</th><th>Last Promo</th><th>Satisfaction</th><th>Risk</th><th>Recommended Action</th></tr></thead>
        <tbody>{rows_html}</tbody>
    </table>""", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Retention Strategy
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("Retention Strategy Recommendations", "Action Plan")
    s1, s2, s3 = st.columns(3)

    strategies = [
        (s1, "#EF4444", "IMMEDIATE", [
            ("Overtime Audit", "Cap overtime for high-risk teams; redistribute workload"),
            ("Career Conversations", "Flag 294 stagnated employees for development plans"),
            ("Comp Review", "Benchmark bottom-quartile salaries against market")]),
        (s2, "#F59E0B", "THIS QUARTER", [
            ("Onboarding Overhaul", "Strengthen 90-day check-ins (highest-risk window)"),
            ("Manager Training", "Invest in manager quality (strongest protective factor)"),
            ("Travel Policy", "Evaluate hybrid options for travel-heavy roles")]),
        (s3, "#4F8EF7", "ONGOING", [
            ("Deploy Risk Dashboard", "Weekly HRBP reviews of risk-scored employees"),
            ("Quarterly Model Refresh", "Retrain as workforce composition shifts"),
            ("Fairness Audit", "Ensure risk scores don't encode demographic bias")])
    ]

    for col, color, priority, items in strategies:
        with col:
            st.markdown(f'<div class="priority-label" style="color:{color}; border-bottom:2px solid {color}30; padding-bottom:8px;">{priority}</div>', unsafe_allow_html=True)
            for title, detail in items:
                st.markdown(f"""<div style="margin-bottom:12px;">
                    <div class="strategy-title">{title}</div>
                    <div class="strategy-detail">{detail}</div>
                </div>""", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


# ═══════════════════════════════════════════
# TAB 5: AI CHATBOT
# ═══════════════════════════════════════════
with tab5:
    st.markdown('<div class="chart-card">', unsafe_allow_html=True)
    section_header("People Analytics AI Assistant", "Powered by Claude")
    st.markdown('<p style="font-size:12px; color:#5A6B87; margin-bottom:16px;">Ask questions about the attrition data, risk factors, survival analysis, or retention strategies.</p>', unsafe_allow_html=True)

    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "followups" not in st.session_state:
        st.session_state.followups = []

    # Display chat history
    for msg in st.session_state.messages:
        if msg["role"] == "user":
            st.markdown(f'<div class="chat-msg-user">{msg["content"]}</div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div class="chat-msg-bot">{msg["content"]}</div>', unsafe_allow_html=True)

    # Follow-up suggestions
    if st.session_state.followups:
        st.markdown('<p style="font-size:10px; color:#5A6B87; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; margin-top:8px;">Follow-up questions</p>', unsafe_allow_html=True)
        fcols = st.columns(len(st.session_state.followups))
        for i, (col, q) in enumerate(zip(fcols, st.session_state.followups)):
            with col:
                if st.button(f"→ {q}", key=f"followup_{i}_{len(st.session_state.messages)}"):
                    st.session_state.pending_question = q
                    st.rerun()

    # Initial suggestions (only if no messages yet)
    if not st.session_state.messages:
        st.markdown('<p style="font-size:10px; color:#5A6B87; font-weight:600; letter-spacing:0.06em; text-transform:uppercase;">Try asking</p>', unsafe_allow_html=True)
        init_questions = [
            "What's the #1 attrition risk factor?",
            "Which department has highest attrition?",
            "What's the ROI of the early warning system?",
            "How does promotion delay affect attrition?",
            "What retention actions should we take first?"
        ]
        for i, q in enumerate(init_questions):
            if st.button(q, key=f"init_{i}"):
                st.session_state.pending_question = q
                st.rerun()

    # Process pending question (from button clicks)
    pending = st.session_state.pop("pending_question", None)

    # Chat input
    user_input = st.chat_input("Ask about the attrition data...")
    prompt = pending or user_input

    if prompt:
        st.session_state.messages.append({"role": "user", "content": prompt})
        st.session_state.followups = []

        try:
            import anthropic
            client = anthropic.Anthropic()

            api_messages = [{"role": m["role"], "content": m["content"]} for m in st.session_state.messages]

            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1000,
                system=DASHBOARD_CONTEXT,
                messages=api_messages
            )

            raw_text = response.content[0].text

            # Parse follow-ups
            import re
            followup_match = re.search(r'<followups>(.*?)</followups>', raw_text, re.DOTALL)
            if followup_match:
                clean_text = raw_text[:followup_match.start()].strip()
                suggestions = [s.strip() for s in followup_match.group(1).strip().split('\n') if s.strip().endswith('?')]
                st.session_state.followups = suggestions[:3]
            else:
                clean_text = raw_text.strip()

            st.session_state.messages.append({"role": "assistant", "content": clean_text})

        except ImportError:
            st.session_state.messages.append({
                "role": "assistant",
                "content": "The AI assistant requires the `anthropic` Python package and an API key. Install with `pip install anthropic` and set your ANTHROPIC_API_KEY environment variable to enable this feature."
            })
        except Exception as e:
            st.session_state.messages.append({
                "role": "assistant",
                "content": f"Connection error: {str(e)}\n\nMake sure your ANTHROPIC_API_KEY is set in .streamlit/secrets.toml or as an environment variable."
            })

        st.rerun()

    st.markdown('</div>', unsafe_allow_html=True)


# ─────────────────────────────────────────────
# Footer
# ─────────────────────────────────────────────
st.markdown("---")
st.markdown("""<div style="text-align:center; font-size:11px; color:#5A6B87; padding:16px 0;">
People Analytics Portfolio — Sunidhi Sharma &nbsp;|&nbsp; Survival Analysis + Cox PH + Risk Scoring &nbsp;|&nbsp; IBM HR Dataset (n=1,470)
</div>""", unsafe_allow_html=True)
