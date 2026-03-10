## People Analytics Survival Analysis: Employee Attrition Early Warning System

This project applies survival analysis to model **when employees are likely to leave**, rather than simply predicting whether they will leave.

Using the IBM HR Analytics benchmark dataset, the analysis demonstrates how time-to-event modeling can help People Analytics teams identify attrition risk earlier and design proactive retention strategies.

The project builds an end-to-end attrition early warning system using Kaplan–Meier survival curves and Cox proportional hazards regression, correctly handling right-censored observations (employees who have not yet left the organization).

Key insights include:

• Overtime emerges as the strongest independent attrition risk factor (≈82% higher hazard)  
• Career stagnation significantly increases attrition risk after ~3 years without promotion  
• Survival model outputs are translated into a practical risk-scoring framework for HR intervention  

The project mirrors how a real People Analytics team would deliver insights to leadership — combining statistical modeling, executive-friendly metrics, and actionable employee watchlists.

---

## Analytical Approach

Instead of a simple classification model, this project uses **time-to-event modeling**.

Methods used:

• Kaplan–Meier survival curves  
• Cox proportional hazards regression  
• hazard ratio interpretation  
• attrition risk scoring

---

## Interactive Dashboard

An interactive dashboard built with **Streamlit** allows users to explore survival curves, attrition risk metrics, and employee watchlists.

The dashboard translates statistical outputs into insights that HR leaders can use for workforce planning and retention strategy.

---

## AI Chatbot

The project also includes an AI chatbot that allows users to ask questions about the analysis.

Example questions include:

• Which employees are at the highest attrition risk?  
• How does overtime impact employee survival probability?  
• What factors most strongly influence attrition hazard?

The chatbot uses a large language model to explain insights derived from the analysis.
