// src/services/userService.js
import { db } from '../models/Database.js';
import { parseGoogleFormCSV, getEntryYear } from '../utils/formParser.js';

export function saveUserFromForm(formContainer) {
    const originalHandle = formContainer.querySelector('#form-original-id').value;
    const cfHandle = formContainer.querySelector('#form-cf').value.trim();
    const studentId = formContainer.querySelector('#form-student-id').value.trim();
    
    let formEntryYear = formContainer.querySelector('#form-entry-year').value.trim();
    if (!formEntryYear && studentId) {
        const computedYear = getEntryYear({ studentId });
        formEntryYear = computedYear === 'Unknown' ? '' : computedYear;
    }

    const userData = {
        cfHandle: cfHandle,
        studentId: studentId,
        fullName: formContainer.querySelector('#form-name').value.trim(),
        maxRating: parseInt(formContainer.querySelector('#form-max-rating').value) || 0,
        linkedIn: formContainer.querySelector('#form-linkedin').value.trim(),
        major: formContainer.querySelector('#form-uni').value.trim(),
        acmLevel: formContainer.querySelector('#form-level').value,
        entryYear: formEntryYear,
        joinDate: formContainer.querySelector('#form-join-date').value,
        isActive: formContainer.querySelector('#form-active').checked,
        isTrusted: formContainer.querySelector('#form-trusted').checked,
        lastUpdated: new Date().toLocaleString()
    };

    if (originalHandle) {
        const index = db.data.users.findIndex(u => u.cfHandle === originalHandle);
        if (index !== -1) db.data.users[index] = { ...db.data.users[index], ...userData };
    } else {
        if (cfHandle && db.data.users.some(u => u.cfHandle && u.cfHandle.toLowerCase() === cfHandle.toLowerCase())) {
            throw new Error("A user with this Codeforces handle already exists.");
        }
        db.data.users.push({ ...userData, internalScore: 0, currentRating: 0, placements: [] });
    }

    db.saveDraft();
}

export async function importUsersFromCSV(file) {
    const uniPrompt = prompt("Enter the default university for this batch of users (Leave blank to use Form data):", "PSUT");
    if (uniPrompt === null) return 0;

    const newUsers = await parseGoogleFormCSV(file, uniPrompt);
    let addedCount = 0;

    newUsers.forEach(nu => {
        const exists = db.data.users.some(u => 
            (nu.studentId && u.studentId === nu.studentId) || 
            (u.fullName.toLowerCase() === nu.fullName.toLowerCase())
        );
        
        if (!exists) {
            db.data.users.push(nu);
            addedCount++;
        }
    });

    db.saveDraft();
    return addedCount;
}

export function exportUsersToCSV() {
    if (!db.data.users.length) {
        alert("No users to export.");
        return;
    }
    const keys = ["cfHandle", "fullName", "studentId", "major", "acmLevel", "maxRating", "entryYear", "email", "phone", "joinDate", "isActive", "isTrusted", "lastUpdated"];
    const csvRows = [keys.join(',')];
    
    db.data.users.forEach(u => {
        const row = keys.map(k => {
            let val = u[k];
            if (k === 'entryYear') val = getEntryYear(u);
            return `"${(val !== undefined && val !== null ? val : '').toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `electi_users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export function deleteUsers(identifiers) {
    db.data.users = db.data.users.filter(u => !identifiers.includes(u.cfHandle || u.fullName));
    db.saveDraft();
}

export function updateUsersUniversity(identifiers, newUni) {
    db.data.users = db.data.users.map(u => {
        const identifier = u.cfHandle || u.fullName;
        if (identifiers.includes(identifier)) return { ...u, major: newUni.trim(), lastUpdated: new Date().toLocaleString() };
        return u;
    });
    db.saveDraft();
}
