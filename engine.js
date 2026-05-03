// js/engine.js
class MonteCarloEngine {
    constructor(nSims = 10000, years = 5) {
        this.nSims = nSims;
        this.years = years;
    }

    normal(mean, std) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + std * z;
    }

    simulateJobSwitch(currentSal, currentGrowth, currentLayoff,
                      offerSal, offerGrowth, offerLayoff) {
        let stay = [], sw = [];
        for (let sim = 0; sim < this.nSims; sim++) {
            let stayTotal = 0, swTotal = 0;
            let staySal = currentSal, swSal = offerSal;
            for (let y = 0; y < this.years; y++) {
                let stayGrow = this.normal(currentGrowth/100, 0.02);
                staySal = staySal * (1 + stayGrow);
                if (Math.random() < currentLayoff/100) staySal *= 0.6;
                stayTotal += staySal;

                let swGrow = this.normal(offerGrowth/100, 0.03);
                swSal = swSal * (1 + swGrow);
                if (Math.random() < offerLayoff/100) swSal *= 0.6;
                swTotal += swSal;
            }
            stay.push(stayTotal);
            sw.push(swTotal);
        }
        return { stay, switch: sw };
    }

    simulateHigherStudies(currentSal, tuition, duration, expectedSal, placementProb, loanInterest, riskTol) {
        let noStudy = [], study = [];
        placementProb /= 100;
        loanInterest /= 100;
        for (let sim = 0; sim < this.nSims; sim++) {
            let noStudyTotal = 0, studyTotal = 0;
            let curSal = currentSal;
            for (let y = 0; y < this.years; y++) {
                let grow = this.normal(0.05, 0.03);
                curSal = curSal * (1 + grow);
                noStudyTotal += curSal;
            }
            let loan = tuition;
            for (let y = 0; y < duration; y++) {
                studyTotal -= currentSal;
                loan += loan * loanInterest;
            }
            let placed = Math.random() < placementProb;
            let postSal = placed ? expectedSal : currentSal * 0.8;
            for (let y = duration; y < this.years; y++) {
                let grow = this.normal(0.07, 0.04);
                postSal = postSal * (1 + grow);
                studyTotal += postSal;
            }
            studyTotal -= loan;
            noStudy.push(noStudyTotal);
            study.push(studyTotal);
        }
        return { stay: noStudy, switch: study };
    }

    simulateStartup(currentSal, investment, burnRate, successProb, expectedRevenue, timeProfit, industryRisk) {
        let job = [], startup = [];
        successProb /= 100;
        burnRate *= 12;
        for (let sim = 0; sim < this.nSims; sim++) {
            let jobTotal = 0, startupTotal = -investment;
            let sal = currentSal;
            for (let y = 0; y < this.years; y++) {
                let grow = this.normal(0.05, 0.03);
                sal = sal * (1 + grow);
                jobTotal += sal;
                startupTotal -= burnRate;
                let success = Math.random() < successProb;
                if (success && y >= timeProfit) {
                    startupTotal += expectedRevenue / (this.years - timeProfit);
                }
            }
            job.push(jobTotal);
            startup.push(startupTotal);
        }
        return { stay: job, switch: startup };
    }

    simulateMoveCity(currentSal, newSal, colIndex, relocCost, growthDiff, jobRisk) {
        let stay = [], move = [];
        for (let sim = 0; sim < this.nSims; sim++) {
            let stayTotal = 0, moveTotal = 0;
            let curSal = currentSal, newSalCurr = newSal;
            for (let y = 0; y < this.years; y++) {
                let growStay = this.normal(0.04, 0.02);
                curSal = curSal * (1 + growStay);
                stayTotal += curSal;

                let growMove = this.normal(0.04 + growthDiff/100, 0.03);
                newSalCurr = newSalCurr * (1 + growMove);
                let adjSalary = newSalCurr * (100 / colIndex);
                let riskFactor = (jobRisk === 'Low' ? 0.02 : jobRisk === 'Medium' ? 0.05 : 0.10);
                if (Math.random() < riskFactor) adjSalary *= 0.5;
                moveTotal += adjSalary;
            }
            moveTotal -= relocCost;
            stay.push(stayTotal);
            move.push(moveTotal);
        }
        return { stay, switch: move };
    }
}