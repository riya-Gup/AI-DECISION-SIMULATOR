// js/main.js
document.getElementById('calculateBtn').addEventListener('click', async () => {
    const decision = document.getElementById('decision-select').value;
    if (!decision) return;

    const nSims = 10000;
    const years = 5;
    const engine = new MonteCarloEngine(nSims, years);
    let result;

    showSpinner(true);

    setTimeout(() => {
        try {
            switch (decision) {
                case 'job-switch':
                    result = engine.simulateJobSwitch(
                        parseFloat(document.getElementById('job_cur_sal').value),
                        parseFloat(document.getElementById('job_cur_growth').value),
                        parseFloat(document.getElementById('job_cur_layoff').value),
                        parseFloat(document.getElementById('job_off_sal').value),
                        parseFloat(document.getElementById('job_off_growth').value),
                        parseFloat(document.getElementById('job_off_layoff').value)
                    );
                    break;
                case 'higher-studies':
                    result = engine.simulateHigherStudies(
                        parseFloat(document.getElementById('study_cur_sal').value),
                        parseFloat(document.getElementById('study_tuition').value),
                        parseInt(document.getElementById('study_duration').value),
                        parseFloat(document.getElementById('study_new_sal').value),
                        parseFloat(document.getElementById('study_placement').value),
                        parseFloat(document.getElementById('study_loan_int').value),
                        document.getElementById('study_risk_tolerance').value
                    );
                    break;
                case 'startup':
                    result = engine.simulateStartup(
                        parseFloat(document.getElementById('startup_cur_sal').value),
                        parseFloat(document.getElementById('startup_investment').value),
                        parseFloat(document.getElementById('startup_burn').value),
                        parseFloat(document.getElementById('startup_success_prob').value),
                        parseFloat(document.getElementById('startup_revenue').value),
                        parseInt(document.getElementById('startup_time_profit').value),
                        document.getElementById('startup_industry_risk').value
                    );
                    break;
                case 'move-city':
                    result = engine.simulateMoveCity(
                        parseFloat(document.getElementById('city_cur_sal').value),
                        parseFloat(document.getElementById('city_new_sal').value),
                        parseFloat(document.getElementById('city_col_index').value),
                        parseFloat(document.getElementById('city_reloc_cost').value),
                        parseFloat(document.getElementById('city_growth_diff').value),
                        document.getElementById('city_job_risk').value
                    );
                    break;
                default:
                    return;
            }

            const stayArr = result.stay.map(v => Number(v));
            const switchArr = result.switch.map(v => Number(v));

            const probBetter = (switchArr.filter((v,i) => v > stayArr[i]).length / stayArr.length * 100).toFixed(1);
            const stayMean = (stayArr.reduce((a,b)=>a+b,0)/stayArr.length).toFixed(0);
            const switchMean = (switchArr.reduce((a,b)=>a+b,0)/switchArr.length).toFixed(0);
            const stayP10 = stayArr.slice().sort((a,b)=>a-b)[Math.floor(stayArr.length*0.1)].toFixed(0);
            const switchP10 = switchArr.slice().sort((a,b)=>a-b)[Math.floor(switchArr.length*0.1)].toFixed(0);

            document.getElementById('results').innerHTML = `
                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                    <div class="result-card"><h3>📉 Stay / No Action</h3>
                        <p>Mean wealth: <strong>$${parseFloat(stayMean).toLocaleString()}</strong></p>
                        <p>10th percentile: <strong>$${parseFloat(stayP10).toLocaleString()}</strong></p>
                    </div>
                    <div class="result-card"><h3>📈 Switch / Action</h3>
                        <p>Mean wealth: <strong>$${parseFloat(switchMean).toLocaleString()}</strong></p>
                        <p>Probability better: <strong>${probBetter}%</strong></p>
                        <p>10th percentile: <strong>$${parseFloat(switchP10).toLocaleString()}</strong></p>
                    </div>
                </div>
            `;

            // Small delay before drawing chart to ensure DOM is ready
            setTimeout(() => {
                drawComparison(stayArr, switchArr, 'chart');
            }, 50);
        } catch (err) {
            console.error(err);
            document.getElementById('results').innerHTML = '<p style="color:#ef4444;">Error during simulation. Check console.</p>';
        } finally {
            showSpinner(false);
        }
    }, 50);
});