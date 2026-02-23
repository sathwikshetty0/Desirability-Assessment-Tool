// Initialize score on load
document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const d = new Date();
        dateEl.textContent = d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateScore();

    // Add event listeners to all radio inputs
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', updateScore);
    });
});

function updateScore() {
    const questions = 9;
    let totalScore = 0;

    for (let i = 1; i <= questions; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
            totalScore += parseFloat(selected.value);
        }
    }

    // Update Score Number
    const scoreElement = document.getElementById('total-score');
    scoreElement.textContent = totalScore.toFixed(1).replace('.0', '');

    const maxScore = 45; // Define maxScore here

    // Update Accuracy Percent
    const accuracyPercent = (totalScore / maxScore) * 100;
    const accuracyEl = document.getElementById('accuracy-percent');
    if (accuracyEl) accuracyEl.textContent = `${accuracyPercent.toFixed(0)}%`;

    // Update Gauge
    const dashArray = 283; // 2 * PI * r (45)
    const percentage = totalScore / maxScore;
    const offset = dashArray - (dashArray * percentage);

    const gaugeFill = document.getElementById('gauge-fill-circle');
    if (gaugeFill) gaugeFill.style.strokeDashoffset = offset;

    // Update Progress Bar
    const progressBar = document.getElementById('main-progress-bar');
    if (progressBar) progressBar.style.width = `${accuracyPercent.toFixed(0)}%`;

    // Update Interpretation and Badge
    updateStatus(totalScore);
}

function updateStatus(score) {
    const badge = document.getElementById('status-badge');
    const interpretation = document.getElementById('interpretation');
    const gaugeFill = document.querySelector('.gauge-fill');

    if (score >= 33) {
        badge.textContent = "High Desirability";
        badge.style.background = "var(--success)";
        badge.style.color = "white";
        interpretation.textContent = "Strong potential! This problem statement is attractive and likely to lead to a successful solution. Proceed with confidence.";
        gaugeFill.style.stroke = "var(--success)";
    } else if (score >= 20) {
        badge.textContent = "Moderate Desirability";
        badge.style.background = "var(--warning)";
        badge.style.color = "black";
        interpretation.textContent = "Potential exists, but refinements are needed. Focus on improving customer understanding and value perception.";
        gaugeFill.style.stroke = "var(--warning)";
    } else {
        badge.textContent = "Low Desirability";
        badge.style.background = "var(--danger)";
        badge.style.color = "white";
        interpretation.textContent = "Significant issues to address. The problem may be too niche, poorly understood, or customers aren't willing to pay. Re-evaluate.";
        gaugeFill.style.stroke = "var(--danger)";
    }
}

function generateReport() {
    // Show loading overlay first
    const overlay = document.getElementById('loading-overlay');
    const bar = document.getElementById('loading-bar-fill');
    overlay.style.display = 'flex';

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        bar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                overlay.style.display = 'none';
                bar.style.width = '0%';
                checkBiasAndShowReport();
            }, 500);
        }
    }, 200);
}

function checkBiasAndShowReport() {
    const totalScore = parseFloat(document.getElementById('total-score').textContent);

    // If score is high (Bias threshold), show the ethical warning
    if (totalScore >= 35) {
        document.getElementById('warning-modal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        proceedToReport();
    }
}

function proceedToReport() {
    closeWarning();
    const problem = document.getElementById('problem-statement').value || "Untitled Problem";
    const team = document.getElementById('team-name').value || "N/A";
    const evaluator = document.getElementById('evaluator-name').value || "N/A";
    const totalScore = document.getElementById('total-score').textContent;
    const statusBadge = document.getElementById('status-badge');
    const badgeColor = window.getComputedStyle(statusBadge).backgroundColor;
    const badgeTextColor = window.getComputedStyle(statusBadge).color;

    const primaryColor = "#6366f1";
    const textColor = "#1e293b";
    const dimColor = "#64748b";
    const bgColor = "#ffffff";

    let reportHtml = `
        <div id="printable-report" style="background: ${bgColor}; color: ${textColor}; padding: 30px; font-family: 'Outfit', sans-serif; width: 750px; margin: auto;">
            <div style="border-bottom: 2px solid ${primaryColor}; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="color: ${primaryColor}; margin: 0; font-size: 22px; text-transform: uppercase;">DAT Assessment Report</h1>
                    <h2 style="color: ${textColor}; margin: 5px 0 0 0; font-size: 16px;">${problem}</h2>
                </div>
                <div style="text-align: right; color: ${dimColor}; font-size: 12px;">
                    <strong>Team:</strong> ${team} | <strong>By:</strong> ${evaluator}<br>
                    <strong>Date:</strong> ${new Date().toLocaleDateString()}
                </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-around;">
                <div style="text-align: left;">
                    <div style="font-size: 12px; color: ${dimColor}; text-transform: uppercase; letter-spacing: 1px;">Overall Desirability</div>
                    <div style="font-size: 48px; font-weight: 800; color: ${primaryColor}; line-height: 1;">
                        ${totalScore}<span style="font-size: 18px; color: ${dimColor}; font-weight: 400;">/45</span>
                    </div>
                </div>
                <div style="max-width: 450px; text-align: left; border-left: 2px solid #e2e8f0; padding-left: 25px;">
                    <div style="display: inline-block; padding: 4px 12px; border-radius: 50px; background: ${badgeColor}; color: ${badgeTextColor}; font-weight: 700; font-size: 11px; text-transform: uppercase; margin-bottom: 8px;">
                        ${statusBadge.textContent}
                    </div>
                    <p style="margin: 0; color: ${textColor}; font-style: italic; font-size: 13px; line-height: 1.4;">
                        ${document.getElementById('interpretation').textContent}
                    </p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px 30px;">
    `;

    const questionTitles = [
        "Awareness", "Clarity", "Effort", "Frustration",
        "Value Perception", "Price Sensitivity", "TAM", "SAM", "SOM"
    ];

    questionTitles.forEach((title, index) => {
        const val = document.querySelector(`input[name="q${index + 1}"]:checked`).value;
        const notes = document.querySelectorAll('.notes-input')[index].value;

        reportHtml += `
            <div style="padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                    <h4 style="color: ${primaryColor}; margin: 0; font-size: 11px; text-transform: uppercase;">${index + 1}. ${title}</h4>
                    <span style="font-weight: 700; font-size: 13px; color: ${textColor};">Score: ${val}/5</span>
                </div>
                <div style="height: 4px; width: 100%; background: #f1f5f9; border-radius: 2px; overflow: hidden; margin-bottom: 4px;">
                    <div style="height: 100%; width: ${(val / 5) * 100}%; background: ${primaryColor};"></div>
                </div>
                ${notes ? `<div style="color: ${dimColor}; font-size: 10px; line-height: 1.2; background: #fafafa; padding: 5px 8px; border-radius: 4px; border: 1px solid #eee; overflow: hidden; max-height: 60px;">${notes}</div>` : ''}
            </div>
        `;
    });

    reportHtml += `
            </div>
            <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; color: ${dimColor}; text-align: center; letter-spacing: 1px;">
                CONFIDENTIAL BUSINESS ASSESSMENT | GENERATED VIA DAT FRAMEWORK
            </div>
        </div>
    `;

    document.getElementById('report-content').innerHTML = reportHtml;
    document.getElementById('report-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeWarning() {
    document.getElementById('warning-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeWelcome() {
    document.getElementById('welcome-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeModal() {
    document.getElementById('report-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function downloadReport() {
    const element = document.getElementById('printable-report');
    const problem = document.getElementById('problem-statement').value || "DAT-Assessment";

    // Set a very specific configuration to fix displacement and cropping
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

    // Run with auto-paging to handle overflow, although we aim for one page
    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
        // This ensures the element is rendered from the top
    }).save();
}

function animateNumber(element, target) {
    // Keep function for potential use, but direct setting is safer for floats
    element.textContent = target;
}

function resetForm() {
    if (confirm("Are you sure you want to reset the entire assessment?")) {
        const form = document.getElementById('dat-form');
        form.reset();

        // Reset problem statement
        document.getElementById('problem-statement').value = "";
        document.getElementById('team-name').value = "";
        document.getElementById('evaluator-name').value = "";

        // Reset all textareas
        const textareas = document.querySelectorAll('.notes-input');
        textareas.forEach(ta => ta.value = "");

        // Reset radio defaults (set all to 3 - neutral)
        for (let i = 1; i <= 9; i++) {
            const rad = document.getElementById(`q${i}-3`);
            if (rad) rad.checked = true;
        }

        updateScore();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

