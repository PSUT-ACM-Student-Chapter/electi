
const googleFormsParser = {
    id: 'google_forms_registration',
    name: 'Summer Training Registration',
    parse: (rawCsvString) => {
        const result = Papa.parse(rawCsvString, { header: true, skipEmptyLines: true });
        return result.data.map(row => ({
            timestamp: row['Timestamp'],
            fullName: row['Full Name']?.trim(),
            studentId: row['Student ID'],
            email: row['Email']?.trim(),
            phoneNumber: row['Phone Number'],
            major: row['Major']?.trim()
        }));
    }
};

const icpcStandingsParser = {
    id: 'icpc_standings',
    name: 'ICPC CSV Standings',
    parse: (rawCsvString) => {
        const result = Papa.parse(rawCsvString, { header: true, skipEmptyLines: true });
        return result.data.map(row => ({
            rank: parseInt(row['place']),
            teamName: row['teamName']?.trim(),
            university: row['institution']?.trim(),
            problemsSolved: parseInt(row['problemsSolved']),
            penalty: parseInt(row['totalTime'])
        }));
    }
};

const codeforcesHtmlParser = {
    id: 'codeforces_html',
    name: 'Codeforces HTML Table',
    parse: (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const rows = doc.querySelectorAll('table.standings tbody tr[participantId]');
        
        return Array.from(rows).map(row => {
            const teamNode = row.querySelector('.contestant-cell');
            const solvedNode = row.querySelector('td:nth-child(4)'); // Adjust based on exact CF DOM
            const penaltyNode = row.querySelector('td:nth-child(5)');
            
            return {
                teamName: teamNode ? teamNode.innerText.trim() : "Unknown",
                problemsSolved: solvedNode ? parseInt(solvedNode.innerText) : 0,
                penalty: penaltyNode ? parseInt(penaltyNode.innerText) : 0
            };
        });
    }
};

export const Parsers = {
    [googleFormsParser.id]: googleFormsParser,
    [icpcStandingsParser.id]: icpcStandingsParser,
    [codeforcesHtmlParser.id]: codeforcesHtmlParser
};
