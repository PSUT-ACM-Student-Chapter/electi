/**
 * Standardizes raw CSV data from the PSUT ACM Summer Training Form.
 */
const parseGoogleForms = (rawCsvString) => {
    const { data, errors } = Papa.parse(rawCsvString, { header: true, skipEmptyLines: true });
    if (errors.length) console.warn("CSV Parsing Warnings:", errors);

    return data.map(row => ({
        timestamp: row['Timestamp'] || '',
        fullName: row['Full Name']?.trim() || 'Unknown',
        studentId: row['Student ID']?.trim() || '',
        email: row['Email']?.trim() || '',
        phoneNumber: row['Phone Number']?.trim() || '',
        major: row['Major']?.trim() || '',
        participatedBefore: row['Have you participated in any problem-solving contests before (e.g. JOI, IOI, JCPC, IEEEXtreme, etc.)? If so, please specify.'] || 'No',
        preferredTime: row['Choose what time suits you best \n(the trainings will be scheduled at the time that suits the majority of students)\n'] || ''
    }));
};

/**
 * Parses standard ICPC CSV standings (e.g., PSUT JCPC Qualification).
 */
const parseIcpcStandings = (rawCsvString) => {
    const { data } = Papa.parse(rawCsvString, { header: true, skipEmptyLines: true });
    
    return data.map(row => ({
        rank: parseInt(row['place'], 10) || 0,
        teamName: row['teamName']?.trim() || 'Unnamed Team',
        university: row['institution']?.trim() || '',
        problemsSolved: parseInt(row['problemsSolved'], 10) || 0,
        penalty: parseInt(row['totalTime'], 10) || 0
    }));
};

/**
 * Parses Codeforces HTML standings tables copied directly from the browser.
 */
const parseCodeforcesHtml = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    const rows = Array.from(doc.querySelectorAll('table.standings tbody tr[participantId]'));
    
    return rows.map(row => {
        const teamNode = row.querySelector('.contestant-cell');
        const solvedNode = row.querySelector('td:nth-child(4)'); // Adjust index based on CF column layout
        const penaltyNode = row.querySelector('td:nth-child(5)');
        
        return {
            teamName: teamNode ? teamNode.innerText.trim() : "Unknown",
            problemsSolved: solvedNode ? parseInt(solvedNode.innerText, 10) : 0,
            penalty: penaltyNode ? parseInt(penaltyNode.innerText, 10) : 0
        };
    });
};

// Export a unified parser registry
export const Parsers = {
    FORM_REGISTRATION: { name: 'Google Forms Registration', execute: parseGoogleForms },
    ICPC_CSV: { name: 'ICPC CSV Standings', execute: parseIcpcStandings },
    CF_HTML: { name: 'Codeforces HTML Table', execute: parseCodeforcesHtml }
};
