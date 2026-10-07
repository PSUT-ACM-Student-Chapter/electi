// src/components/AdminImporter.js
import { db } from '../models/Database.js';

// Note: If your parsers are exported from csvParser.js instead, change this import path to '../utils/csvParser.js'
import { Parsers } from '../models/DataParsers.js'; 
import { fetchUsersInfo } from '../utils/codeforcesApi.js';
import { calculateDiv2Readiness } from '../utils/readinessMath.js';

export function renderAdminImporter(container) {
    container.innerHTML = `
        <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm mb-6">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Admin Data Importer</h2>
            <p class="text-sm text-slate-500 mb-6">Select the data format and upload a file or paste HTML.</p>
            
            <div class="import-section grid gap-4 max-w-md">
                <select id="parser-select" class="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option value="FORM_REGISTRATION">Google Forms: Summer Registration</option>
                    <option value="ICPC_CSV">ICPC Standings (CSV)</option>
                    <option value="CF_HTML">Codeforces Standings (HTML)</option>
                </select>
                
                <!-- For CSV Files -->
                <input type="file" id="file-upload" accept=".csv" class="w-full border border-slate-300 p-2 rounded-lg text-sm bg-slate-50" />
                
                <!-- For HTML Pasting -->
                <textarea id="html-paste" placeholder="Paste Codeforces HTML here..." class="w-full border border-slate-300 p-3 rounded-lg text-sm h-32 focus:ring-2 focus:ring-indigo-500 hidden"></textarea>
                
                <button id="process-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm">Process Data</button>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h3 class="text-lg font-bold text-slate-900 mb-2">Codeforces Sync</h3>
                <p class="text-sm text-slate-500 mb-4">Fetch live Codeforces ratings and recalculate Div. 2 Readiness Scores for all users in the database.</p>
                <button id="sync-cf-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm">Run Codeforces Sync</button>
                <div id="sync-status" class="mt-3 text-sm text-emerald-600 font-medium"></div>
            </div>

            <div class="bg-white p-6 border-emerald-200 border rounded-xl shadow-sm bg-emerald-50/30">
                <h3 class="text-lg font-bold text-slate-900 mb-2">Export Permanent Vault</h3>
                <p class="text-sm text-slate-500 mb-4">Securely encrypt your local drafts into a new vault file ready for GitHub deployment.</p>
                <button id="export-vault-btn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm">Download New vault.enc</button>
            </div>
        </div>
    `;

    attachAdminListeners();
}

function attachAdminListeners() {
    const parserSelect = document.getElementById('parser-select');
    const fileUpload = document.getElementById('file-upload');
    const htmlPaste = document.getElementById('html-paste');
    const processBtn = document.getElementById('process-btn');
    const syncBtn = document.getElementById('sync-cf-btn');
    const exportBtn = document.getElementById('export-vault-btn');
    const statusText = document.getElementById('sync-status');

    // UI Toggle: Show file input or textarea based on parser selection
    parserSelect.addEventListener('change', (e) => {
        if (e.target.value === 'CF_HTML') {
            fileUpload.classList.add('hidden');
            htmlPaste.classList.remove('hidden');
        } else {
            fileUpload.classList.remove('hidden');
            htmlPaste.classList.add('hidden');
        }
    });

    // Process Data Button
    processBtn.addEventListener('click', () => {
        const parserType = parserSelect.value;
        const parser = Parsers[parserType];

        if (!parser) {
            alert(`Parser for ${parserType} not found.`);
            return;
        }

        if (parserType === 'CF_HTML') {
            const parsedData = parser.execute(htmlPaste.value);
            mergeContestData(parsedData, "Codeforces HTML Import");
        } else {
            const file = fileUpload.files[0];
            if (!file) return alert("Please select a file.");

            const reader = new FileReader();
            reader.onload = (e) => {
                const parsedData = parser.execute(e.target.result);
                if (parserType === 'FORM_REGISTRATION') {
                    mergeRegistrationData(parsedData);
                } else if (parserType === 'ICPC_CSV') {
                    mergeContestData(parsedData, file.name);
                }
            };
            reader.readAsText(file);
        }
    });

    // Codeforces Sync Button
    syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        syncBtn.classList.add('opacity-70');
        statusText.innerText = "Fetching Codeforces data (batching requests)...";

        const handles = db.data.users.map(u => u.cfHandle).filter(h => h);
        const cfData = await fetchUsersInfo(handles);

        cfData.forEach(cfUser => {
            const localUser = db.data.users.find(u => u.cfHandle?.toLowerCase() === cfUser.handle.toLowerCase());
            if (localUser) {
                localUser.maxRating = cfUser.maxRating || 0;
                localUser.currentRating = cfUser.rating || 0;
                
                // Fallback score if calculateDiv2Readiness isn't strictly defined
                if (typeof calculateDiv2Readiness === 'function') {
                    localUser.readinessScore = calculateDiv2Readiness(localUser.maxRating, localUser.currentRating, localUser.skips || 0, localUser.internalScore || 0);
                } else {
                    localUser.readinessScore = localUser.maxRating; 
                }
            }
        });

        db.saveDraft(); // Save state instantly to local storage
        statusText.innerText = `✓ Successfully updated stats for ${cfData.length} users.`;
        syncBtn.disabled = false;
        syncBtn.classList.remove('opacity-70');
    });

    // Export Vault Button
    exportBtn.addEventListener('click', async () => {
        const pwd = prompt("Enter community passcode to encrypt the new vault:");
        if (!pwd) return;

        try {
            const encryptedString = await db.exportVault(pwd);
            const blob = new Blob([encryptedString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'vault.enc';
            a.click();
            URL.revokeObjectURL(url);

            alert("vault.enc generated successfully! Replace the old file in your /data folder.");
        } catch (e) {
            alert("Encryption failed: " + e.message);
        }
    });
}

function mergeRegistrationData(parsedArray) {
    let addedCount = 0;
    let updatedCount = 0;
    
    parsedArray.forEach(newRow => {
        const existingUser = db.data.users.find(u => u.studentId === newRow.studentId);
        
        if (existingUser) {
            // Update existing user but preserve stats like CF ratings
            Object.assign(existingUser, { ...newRow, ...existingUser });
            updatedCount++;
        } else if (newRow.studentId) {
            db.data.users.push(newRow);
            addedCount++;
        }
    });
    
    db.saveDraft(); // Save state to browser storage instantly
    alert(`Import Complete: ${addedCount} new users added, ${updatedCount} users updated.`);
    document.getElementById('file-upload').value = ''; // Reset input
}

function mergeContestData(parsedArray, contestName) {
    const contestRecord = {
        id: 'contest_' + Date.now(),
        name: contestName,
        date: new Date().toISOString(),
        standings: parsedArray
    };

    db.data.contests.push(contestRecord);
    db.saveDraft(); // Save state to browser storage instantly
    alert(`Successfully appended standings for "${contestName}" (${parsedArray.length} teams).`);
    document.getElementById('file-upload').value = ''; // Reset input
}
