/**
 * Google Apps Script for DAT Assessment Tool
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code in the editor and paste THIS code.
 * 4. Click 'Deploy' > 'New Deployment'.
 * 5. Select 'Web App'.
 * 6. Set 'Execute as' to 'Me'.
 * 7. Set 'Who has access' to 'Anyone'.
 * 8. Click 'Deploy' and copy the 'Web App URL'.
 * 9. Paste this URL into script.js in the SHEET_URL variable.
 */

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);

        // Create headers if sheet is empty
        if (sheet.getLastRow() == 0) {
            sheet.appendRow([
                "Timestamp", "Venture", "Team", "Evaluator", "Total Score", "Verdict",
                "Q1 Score", "Q1 Evidence", "Q2 Score", "Q2 Evidence",
                "Q3 Score", "Q3 Evidence", "Q4 Score", "Q4 Evidence",
                "Q5 Score", "Q5 Evidence", "Q6 Score", "Q6 Evidence",
                "Q7 Score", "Q7 Evidence", "Q8 Score", "Q8 Evidence",
                "Q9 Score", "Q9 Evidence"
            ]);

            // Format headers
            sheet.getRange(1, 1, 1, 24).setFontWeight("bold").setBackground("#f3f4f6");
            sheet.setFrozenRows(1);
        }

        sheet.appendRow([
            data.timestamp || new Date().toLocaleString(),
            data.venture,
            data.team,
            data.evaluator,
            data.score,
            data.verdict,
            data.q1_score, data.q1_evidence,
            data.q2_score, data.q2_evidence,
            data.q3_score, data.q3_evidence,
            data.q4_score, data.q4_evidence,
            data.q5_score, data.q5_evidence,
            data.q6_score, data.q6_evidence,
            data.q7_score, data.q7_evidence,
            data.q8_score, data.q8_evidence,
            data.q9_score, data.q9_evidence
        ]);

        return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
