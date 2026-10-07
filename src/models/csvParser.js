// src/models/csvParser.js (Update the parseGoogleForms function)

const parseGoogleForms = (rawCsvString) => {
    // transformHeader normalizes headers by lowercasing and trimming them
    const { data, errors } = Papa.parse(rawCsvString, { 
        header: true, 
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase() 
    });
    
    if (errors.length) console.warn("CSV Parsing Warnings:", errors);

    return data.map(row => {
        // Helper to find column names safely
        const findKey = (keywords) => Object.keys(row).find(k => keywords.some(kw => k.includes(kw)));
        
        const nameKey = findKey(['name', 'full']);
        const idKey = findKey(['id', 'student']);
        const emailKey = findKey(['email']);
        const phoneKey = findKey(['phone', 'number']);
        const majorKey = findKey(['major', 'specialization']);
        
        return {
            timestamp: row.timestamp || row['carimbo de data/hora'] || '',
            fullName: (nameKey ? row[nameKey] : 'Unknown').trim(),
            studentId: (idKey ? row[idKey] : '').trim(),
            email: (emailKey ? row[emailKey] : '').trim(),
            phoneNumber: (phoneKey ? row[phoneKey] : '').trim(),
            major: (majorKey ? row[majorKey] : 'Unknown').trim(),
            acmLevel: 'Unassigned',
            readinessScore: 0,
            internalScore: 0,
            maxRating: 0,
            currentRating: 0
        };
    }).filter(u => u.studentId); // Ignore rows where Student ID is missing
};
