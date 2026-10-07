// src/utils/formParser.js

export function getEntryYear(user) {
    if (user.entryYear) return user.entryYear;
    
    if (user.studentId) {
        const idStr = String(user.studentId).trim();
        const yearMatch = idStr.match(/^(\d{4})/);
        if (yearMatch) {
            const year = parseInt(yearMatch[1], 10);
            if (year > 1990 && year <= new Date().getFullYear() + 2) {
                return year.toString();
            }
        }
    }
    return "Unknown";
}

export async function parseGoogleFormCSV(file, defaultUni) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const rawCsv = event.target.result;
            
            if (!window.Papa) {
                await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js');
            }
            
            const { data } = window.Papa.parse(rawCsv, { 
                header: true, 
                skipEmptyLines: true, 
                transformHeader: h => h.trim().toLowerCase() 
            });
            
            const newUsers = [];
            data.forEach(row => {
                const findKey = (keywords) => Object.keys(row).find(k => keywords.some(kw => k.includes(kw)));
                
                const nameKey = findKey(['name', 'full name']);
                const fullName = (nameKey && row[nameKey] ? row[nameKey] : '').trim();
                
                if (!fullName) return; // Skip rows without a name

                const idKey = findKey(['id', 'student id']);
                const studentId = idKey && row[idKey] ? row[idKey].trim() : '';

                const majorKey = findKey(['major', 'uni', 'university']);
                const emailKey = findKey(['email']);
                const phoneKey = findKey(['phone', 'phone number']);
                const timestampKey = findKey(['timestamp', 'time']);

                // Extract ONLY the 4-digit year for joinDate
                let formattedJoinYear = new Date().getFullYear().toString();
                if (timestampKey && row[timestampKey]) {
                    const rawTime = String(row[timestampKey]).trim();
                    const yearMatch = rawTime.match(/\b(20\d{2}|19\d{2})\b/); // Matches 4-digit years starting with 19 or 20
                    if (yearMatch) {
                        formattedJoinYear = yearMatch[1];
                    } else {
                        const parsedDate = new Date(rawTime);
                        if (!isNaN(parsedDate)) {
                            formattedJoinYear = parsedDate.getFullYear().toString();
                        }
                    }
                }

                let finalMajor = defaultUni.trim();
                if (!finalMajor) {
                    finalMajor = (majorKey && row[majorKey]) ? row[majorKey].trim() : 'PSUT';
                }

                // Extract Entry Year implicitly from Student ID if available
                const extractedYearMatch = studentId.match(/^(\d{4})/);
                const entryYear = extractedYearMatch ? extractedYearMatch[1] : '';

                newUsers.push({
                    cfHandle: '',
                    studentId: studentId,
                    fullName: fullName,
                    major: finalMajor,
                    email: (emailKey && row[emailKey] ? row[emailKey] : '').trim(),
                    phone: (phoneKey && row[phoneKey] ? row[phoneKey] : '').trim(),
                    acmLevel: 'None',
                    entryYear: entryYear,
                    isActive: true,
                    isTrusted: false,
                    maxRating: 0,
                    joinDate: formattedJoinYear, // Stored as 4 digits (e.g. "2024")
                    lastUpdated: new Date().toLocaleString(),
                    placements: []
                });
            });
            
            resolve(newUsers);
        };
        
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}
