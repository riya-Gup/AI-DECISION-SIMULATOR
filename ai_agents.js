// js/ai_agents.js
function generateInsight(probBetter, stayMean, switchMean, riskTolerance) {
    if (probBetter > 65) return "✅ Switching/Action has a clear statistical advantage in most futures.";
    if (probBetter < 35) return "⚠️ Staying/Inaction is safer based on the simulated outcomes.";
    if (switchMean > stayMean * 1.2) return "📈 Higher upside potential, but with more uncertainty.";
    return "⚖️ The decision is finely balanced – consider non‑financial factors.";
}