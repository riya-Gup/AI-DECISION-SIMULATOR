// js/charts.js
function drawComparison(stayData, switchData, elementId) {
    console.log("Drawing chart with data lengths:", stayData.length, switchData.length);
    
    if (!stayData || !switchData || stayData.length === 0 || switchData.length === 0) {
        document.getElementById(elementId).innerHTML = '<p style="color:#f97316;">⚠️ No data to display. Run a simulation first.</p>';
        return;
    }
    
    const stayClean = stayData.filter(v => typeof v === 'number' && isFinite(v));
    const switchClean = switchData.filter(v => typeof v === 'number' && isFinite(v));
    
    if (stayClean.length === 0 || switchClean.length === 0) {
        document.getElementById(elementId).innerHTML = '<p style="color:#f97316;">⚠️ Invalid numeric data from simulation.</p>';
        return;
    }
    
    // Clear container
    const chartDiv = document.getElementById(elementId);
    chartDiv.innerHTML = '';
    
    const allData = [...stayClean, ...switchClean];
    const dataRange = Math.max(...allData) - Math.min(...allData);
    let nbins = 40;
    if (dataRange > 500000) nbins = 60;
    if (dataRange < 10000) nbins = 30;
    
    const traceStay = {
        x: stayClean,
        type: 'histogram',
        opacity: 0.65,
        name: '📉 Stay / No Action',
        histnorm: 'probability density',
        marker: { color: '#3b82f6', line: { color: '#1e3a8a', width: 1 } },
        nbinsx: nbins
    };
    const traceSwitch = {
        x: switchClean,
        type: 'histogram',
        opacity: 0.65,
        name: '📈 Switch / Action',
        histnorm: 'probability density',
        marker: { color: '#a855f7', line: { color: '#6b21a5', width: 1 } },
        nbinsx: nbins
    };
    const layout = {
        title: { text: '💰 5‑Year Total Wealth Distribution (10,000 scenarios)', font: { size: 16, color: '#f1f5f9' }, x: 0.05 },
        barmode: 'overlay',
        bargap: 0.02,
        xaxis: { title: 'Total Wealth (USD)', tickformat: '$,.0f', gridcolor: '#334155', color: '#e2e8f0' },
        yaxis: { title: 'Probability Density', gridcolor: '#334155', color: '#e2e8f0' },
        legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, xanchor: 'center', x: 0.5, font: { color: '#f1f5f9' }, bgcolor: 'rgba(0,0,0,0.6)' },
        plot_bgcolor: 'rgba(0,0,0,0.3)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 80, l: 70, r: 40, b: 60 },
        autosize: true,
        height: 450
    };
    const config = { responsive: true, displayModeBar: true };
    
    try {
        Plotly.newPlot(elementId, [traceStay, traceSwitch], layout, config);
        setTimeout(() => {
            Plotly.relayout(elementId, {});
        }, 100);
    } catch (err) {
        console.error("Plotly error:", err);
        chartDiv.innerHTML = '<p style="color:#ef4444;">Failed to render chart. Check console or internet connection.</p>';
    }
}