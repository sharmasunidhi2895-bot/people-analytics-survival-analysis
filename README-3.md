# Workforce Attrition Early Warning Dashboard

> Interactive People Analytics dashboard with AI-powered chatbot — built with Streamlit, Plotly, and Claude.

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://your-app-url.streamlit.app)

## Features

- **Overview** — Department attrition hotspots, leavers vs active risk radar, promotion velocity analysis
- **Survival Analysis** — Kaplan-Meier retention curve with milestone annotations and workforce planning insights
- **Risk Factors** — Cox Proportional Hazards forest chart with hazard ratios + risk tier validation
- **Watch List** — Actionable high-risk employee table with recommended interventions + retention strategy
- **AI Assistant** — Claude-powered chatbot that answers questions about the dashboard data with contextual follow-up suggestions

## Quick Start (Local)

```bash
# Clone the repo
git clone https://github.com/yourusername/attrition-dashboard.git
cd attrition-dashboard

# Install dependencies
pip install -r requirements.txt

# (Optional) Set up the AI chatbot — add your Anthropic API key
cp .streamlit/secrets.toml.example .streamlit/secrets.toml
# Edit .streamlit/secrets.toml and add your key

# Run the dashboard
streamlit run app.py
```

The dashboard runs at `http://localhost:8501`. The AI chatbot tab requires an Anthropic API key — all other tabs work without it.

## Deploy to Streamlit Community Cloud (Free)

1. **Push this repo to GitHub** (public or private)

2. Go to [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub

3. Click **"New app"** and select:
   - Repository: `yourusername/attrition-dashboard`
   - Branch: `main`
   - Main file path: `app.py`

4. **(Optional) Add your API key for the chatbot:**
   - In the Streamlit Cloud dashboard, go to your app → **Settings** → **Secrets**
   - Add: `ANTHROPIC_API_KEY = "sk-ant-..."`

5. Click **Deploy** — your dashboard will be live in ~2 minutes

## Project Structure

```
├── app.py                          # Main Streamlit dashboard (all 5 tabs)
├── requirements.txt                # Python dependencies
├── .streamlit/
│   ├── config.toml                 # Dark theme configuration
│   └── secrets.toml.example        # API key template (copy to secrets.toml)
└── README.md
```

## Tech Stack

- **Streamlit** — Dashboard framework
- **Plotly** — Interactive charts (bar, radar, area, scatter)
- **Anthropic Claude API** — AI chatbot with contextual follow-up suggestions
- **pandas / numpy** — Data handling

## Part of a Larger Portfolio

This dashboard is a companion to the [Employee Attrition & Fairness Audit](https://github.com/yourusername/attrition-fairness-audit) project, which includes:

1. **Notebook 01** — EDA, survival analysis, risk scoring system
2. **Notebook 02** — XGBoost classification with SHAP explainability
3. **Notebook 04** — Algorithmic fairness audit and bias mitigation
4. **This dashboard** — Interactive visualization layer with AI assistant

## About

Built by [Sunidhi Sharma](https://linkedin.com/in/sunidhi-sharma) — Senior Data Scientist specializing in People Analytics, Causal Inference, and Responsible AI in HR.
