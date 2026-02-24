let currentStep = 1;
const totalSteps = 11;

document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    updateScore();
    updateWizard();

    // Event listeners for radio inputs
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', updateScore);
    });
});

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function updateWizard() {
    const steps = document.querySelectorAll('.step-pane');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicators = document.querySelectorAll('.step-indicator');

    steps.forEach((step) => {
        if (parseInt(step.dataset.step) === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    indicators.forEach(ind => {
        const stepNum = parseInt(ind.dataset.navStep);
        if (currentStep >= stepNum) {
            ind.classList.add('completed');
        } else {
            ind.classList.remove('completed');
        }

        const ranges = [1, 2, 4, 6, 8, 11];
        let currentRange = 1;
        for (let r of ranges) {
            if (currentStep >= r) currentRange = r;
        }

        if (stepNum === currentRange) {
            ind.classList.add('active');
        } else {
            ind.classList.remove('active');
        }
    });

    prevBtn.style.visibility = (currentStep === 1) ? "hidden" : "visible";

    if (currentStep === totalSteps) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "flex";
        if (currentStep === 1) {
            nextBtn.innerHTML = "<span>START ASSESSMENT →</span>";
        } else if (currentStep === totalSteps - 1) {
            nextBtn.innerHTML = "<span>VIEW VERDICT →</span>";
        } else {
            nextBtn.innerHTML = "<span>NEXT STEP →</span>";
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateWizard();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateWizard();
    }
}

function updateScore() {
    const questions = 9;
    let totalScore = 0;

    for (let i = 1; i <= questions; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
            totalScore += parseFloat(selected.value);
        }
    }

    const scoreElement = document.getElementById('total-score');
    if (scoreElement) animateNumber(scoreElement, totalScore);

    const dashArray = 565;
    const maxScore = 45;
    const percentage = totalScore / maxScore;
    const offset = dashArray - (dashArray * percentage);

    const gaugeFill = document.getElementById('gauge-fill-circle');
    if (gaugeFill) gaugeFill.style.strokeDashoffset = offset;

    updateStatus(totalScore);
    updatePillarBreakdown();
}

function updateStatus(score) {
    const badge = document.getElementById('status-badge');
    const interpretation = document.getElementById('interpretation');

    if (score >= 38) {
        badge.textContent = "Elite Desirability";
        badge.style.borderColor = "#10b981";
        interpretation.innerHTML = "<strong>Hyper-Attractive.</strong> This venture addresses a critical pain point with extreme clarity. Market receptivity is likely to be immediate.";
    } else if (score >= 30) {
        badge.textContent = "High Desirability";
        badge.style.borderColor = "var(--primary)";
        interpretation.innerHTML = "<strong>Strong Potential.</strong> The core desirability is validated. Minor strategy refinements could elevate this to elite status.";
    } else if (score >= 20) {
        badge.textContent = "Moderate Potential";
        badge.style.borderColor = "#f59e0b";
        interpretation.innerHTML = "<strong>Needs Refinement.</strong> Desirability is present but non-obvious. Focus on clarifying the value proposition.";
    } else {
        badge.textContent = "Critical Risk";
        badge.style.borderColor = "#ef4444";
        interpretation.innerHTML = "<strong>Strategic Risk.</strong> The current problem statement lacks compelling desirability. Customers may not recognize the issue.";
    }
}

function updatePillarBreakdown() {
    const breakdownEl = document.getElementById('pillar-breakdown');
    if (!breakdownEl) return;

    const pillars = [
        { name: "Problem Awareness", qs: [1, 2], max: 10 },
        { name: "Solution Search", qs: [3, 4], max: 10 },
        { name: "Value Perception", qs: [5, 6], max: 10 },
        { name: "Market Viability", qs: [7, 8, 9], max: 15 }
    ];

    let html = "";
    pillars.forEach(p => {
        let score = 0;
        p.qs.forEach(q => {
            const selected = document.querySelector(`input[name="q${q}"]:checked`);
            if (selected) score += parseFloat(selected.value);
        });
        const percent = (score / p.max) * 100;

        html += `
            <div class="metric-card">
                <span class="metric-name">${p.name}</span>
                <div class="metric-score">${score} <span style="font-size: 0.9rem; opacity: 0.4;">/ ${p.max}</span></div>
                <div class="metric-progress">
                    <div class="metric-fill" style="width: ${percent}%; background: ${score >= p.max * 0.7 ? 'var(--primary)' : 'var(--text-muted)'};"></div>
                </div>
            </div>
        `;
    });
    breakdownEl.innerHTML = html;
}

function generateReport() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';

    setTimeout(() => {
        overlay.style.display = 'none';
        proceedToReport();
    }, 1500);
}

function proceedToReport() {
    const problem = document.getElementById('problem-statement').value || "Untitled Venture";
    const team = document.getElementById('team-name').value || "N/A";
    const evaluator = document.getElementById('evaluator-name').value || "N/A";
    const totalScoreValue = document.getElementById('total-score').textContent;
    const statusText = document.getElementById('status-badge').textContent;
    const interpretationText = document.getElementById('interpretation').textContent;

    const questions = [
        { id: 1, title: "Awareness" }, { id: 2, title: "Clarity" },
        { id: 3, title: "Effort" }, { id: 4, title: "Frustration" },
        { id: 5, title: "Value Perception" }, { id: 6, title: "Price Sensitivity" },
        { id: 7, title: "TAM" }, { id: 8, title: "SAM" }, { id: 9, title: "SOM" }
    ];

    let badgeBg = "#4f46e5";
    const scoreVal = parseInt(totalScoreValue);
    if (scoreVal >= 38) badgeBg = "#10b981";
    else if (scoreVal >= 30) badgeBg = "#4f46e5";
    else if (scoreVal >= 20) badgeBg = "#f59e0b";
    else badgeBg = "#ef4444";

    // Build question rows as table pairs
    let questionRows = '';
    for (let i = 0; i < questions.length; i += 2) {
        const q1 = questions[i];
        const v1 = document.querySelector(`input[name="q${q1.id}"]:checked`)?.value || "0";
        const j1 = document.getElementById(`j${q1.id}`).value || "No detailed evidence provided.";

        let col2 = '<td style="width: 48%;"></td>'; // empty cell for odd question
        if (i + 1 < questions.length) {
            const q2 = questions[i + 1];
            const v2 = document.querySelector(`input[name="q${q2.id}"]:checked`)?.value || "0";
            const j2 = document.getElementById(`j${q2.id}`).value || "No detailed evidence provided.";
            col2 = `<td style="width: 48%; vertical-align: top; padding: 0 0 25px 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="font-size: 12px; font-weight: 900; color: #4f46e5; text-transform: uppercase; padding-bottom: 6px;">${q2.id}. ${q2.title}</td>
                        <td style="font-size: 12px; font-weight: 800; color: #0f172a; text-align: right; padding-bottom: 6px;">Score: ${v2}/5</td>
                    </tr>
                    <tr><td colspan="2" style="padding-bottom: 12px;">
                        <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${(v2 / 5) * 100}%; height: 100%; background: #4f46e5; border-radius: 3px;"></div>
                        </div>
                    </td></tr>
                    <tr><td colspan="2">
                        <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-left: 3px solid #4f46e5; border-radius: 8px; padding: 14px;">
                            <div style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">EVIDENCE & CONTEXT</div>
                            <div style="font-size: 11px; line-height: 1.5; color: #475569; word-break: break-word;">${j2.replace(/\n/g, '<br>')}</div>
                        </div>
                    </td></tr>
                </table>
            </td>`;
        }

        questionRows += `<tr style="page-break-inside: avoid;">
            <td style="width: 48%; vertical-align: top; padding: 0 10px 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="font-size: 12px; font-weight: 900; color: #4f46e5; text-transform: uppercase; padding-bottom: 6px;">${q1.id}. ${q1.title}</td>
                        <td style="font-size: 12px; font-weight: 800; color: #0f172a; text-align: right; padding-bottom: 6px;">Score: ${v1}/5</td>
                    </tr>
                    <tr><td colspan="2" style="padding-bottom: 12px;">
                        <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${(v1 / 5) * 100}%; height: 100%; background: #4f46e5; border-radius: 3px;"></div>
                        </div>
                    </td></tr>
                    <tr><td colspan="2">
                        <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-left: 3px solid #4f46e5; border-radius: 8px; padding: 14px;">
                            <div style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">EVIDENCE & CONTEXT</div>
                            <div style="font-size: 11px; line-height: 1.5; color: #475569; word-break: break-word;">${j1.replace(/\n/g, '<br>')}</div>
                        </div>
                    </td></tr>
                </table>
            </td>
            ${col2}
        </tr>`;
    }

    let reportHtml = `
        <div id="printable-report" style="width: 680px; padding: 40px; background: white; color: #1e293b; font-family: 'Outfit', sans-serif; box-sizing: border-box; margin: 0 auto;">
            <!-- Header -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                <tr>
                    <td style="vertical-align: top;">
                        <div style="font-size: 20px; font-weight: 900; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px;">DAT ASSESSMENT REPORT</div>
                        <div style="font-size: 28px; font-weight: 950; color: #0f172a; margin-top: 4px; line-height: 1.1;">${problem}</div>
                    </td>
                    <td style="vertical-align: top; text-align: right; color: #64748b; font-size: 11px; font-weight: 700; line-height: 1.6; white-space: nowrap;">
                        Team: ${team} | By: ${evaluator}<br>
                        Date: ${new Date().toLocaleDateString('en-GB')}
                    </td>
                </tr>
            </table>
            
            <div style="height: 3px; background: #4f46e5; margin-bottom: 30px;"></div>

            <!-- Executive Summary -->
            <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #e2e8f0; border-radius: 14px; margin-bottom: 35px;">
                <tr>
                    <td style="width: 130px; text-align: center; vertical-align: middle; padding: 25px 20px; border-right: 2px solid #e2e8f0;">
                        <div style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">OVERALL DESIRABILITY</div>
                        <div style="font-size: 52px; font-weight: 950; color: #4f46e5; line-height: 1;">${totalScoreValue}<span style="font-size: 20px; color: #cbd5e1;"> /45</span></div>
                    </td>
                    <td style="padding: 25px 30px; vertical-align: middle;">
                        <div style="background: ${badgeBg}; color: white; display: inline-block; padding: 5px 14px; border-radius: 100px; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                            ${statusText}
                        </div>
                        <div style="font-size: 13px; line-height: 1.6; color: #475569; font-style: italic;">
                            ${interpretationText.replace(/<\/?strong>/g, '')}
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Metrics Grid (TABLE-based for bulletproof PDF) -->
            <table style="width: 100%; border-collapse: collapse;">
                ${questionRows}
            </table>

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #f1f5f9; text-align: center;">
                <div style="font-size: 9px; color: #94a3b8; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                    CONFIDENTIAL BUSINESS ASSESSMENT | GENERATED VIA DAT FRAMEWORK
                </div>
            </div>
        </div>
    `;

    document.getElementById('report-content').innerHTML = reportHtml;
    document.getElementById('report-modal').style.display = 'flex';
}

function closeWelcome() {
    document.getElementById('welcome-modal').style.display = 'none';
}

function closeModal() {
    document.getElementById('report-modal').style.display = 'none';
}

function downloadReport() {
    const element = document.getElementById('printable-report');
    if (!element) { alert('No report found.'); return; }

    const problem = document.getElementById('problem-statement').value || "DAT-Assessment";

    const opt = {
        margin: 0,
        filename: `${problem.replace(/\s+/g, '-')}-DAT-Report.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            scrollY: 0,
            scrollX: 0,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
        // Ensures render from top
    }).save();
}

function animateNumber(element, target) {
    const start = parseFloat(element.textContent) || 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = start + (target - start) * ease;
        element.textContent = Math.round(current);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function resetForm() {
    if (confirm("Reset assessment? All data will be lost.")) {
        location.reload();
    }
}
