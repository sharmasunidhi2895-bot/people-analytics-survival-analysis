# People Analytics Survival Analysis: Modeling Employee Attrition Risk
Survival analysis project exploring employee attrition risk and time-to-event modeling using the IBM HR Analytics benchmark dataset, demonstrating how survival methods can inform workforce retention strategy.

An end-to-end People Analytics project that builds a proactive attrition early warning system using survival analysis. Instead of the standard classification approach (will they leave - yes/no?), this project models when employees leave using Kaplan Meier survival curves and Cox Proportional Hazards regression  correctly handling the 84% of the workforce that hasn't left yet (right censored observations). The analysis identifies overtime as the #1 independent risk factor (82% higher hazard), quantifies how career stagnation doubles attrition rates after 3 years without promotion, and converts model outputs into a deployable risk scoring system with per-employee intervention recommendations. Designed to mirror how a real People Analytics team would deliver insights to HR leadership, from survival curves for workforce planning, to hazard ratios for executive communication, to a ranked watch list that HRBPs can act on weekly.

The project combines:

• survival analysis modeling  
• an interactive analytics dashboard  
• an AI chatbot that explains insights from the data

## Analytical Approach

Instead of a simple classification model, this project uses **time-to-event modeling**.

Techniques used:

• Kaplan–Meier survival curves  
• Cox proportional hazards model  
• hazard ratio interpretation  
• attrition risk scoring

## Interactive Dashboard

An interactive dashboard built with Streamlit allows users to explore the results of the survival analysis.

The dashboard includes:

• key attrition metrics  
• survival curves by employee segment  
• hazard ratio interpretation  
• attrition risk watchlist

The dashboard translates statistical outputs into insights that HR leaders can act on.

## AI Chatbot

The project also includes an AI chatbot that allows users to ask questions about the attrition analysis.

Example questions the chatbot can answer:

• Which employees are at the highest attrition risk?  
• How does overtime impact employee survival probability?  
• What factors most strongly increase attrition hazard?

The chatbot uses a large language model to explain insights derived from the analysis.
