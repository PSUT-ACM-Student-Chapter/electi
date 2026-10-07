import { db } from '../models/Database.js';

export function renderDataManagement(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-900">Data Management</h2>
            <p class="text-sm text-slate-500">Import and export your entire unencrypted JSON dataset for local backups or state rollbacks.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h3 class="text-lg font-semibold mb-2">Export Raw Backup</h3>
                <p class="text-sm text-slate-500 mb-4">Download the current unencrypted database state as a JSON file.</p>
                <button id="export-json-btn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition-colors">
                    Download electi_backup.json
                </button>
            </div>

            <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h3 class="text-lg font-semibold mb-2">Restore from Backup</h3>
                <p class="text-sm text-slate-500 mb-4">Upload a previous JSON backup. <strong>Warning:</strong> This overwrites current session data.</p>
                <input type="file" id="import-json-file" accept=".json" class="w-full border p-2 rounded mb-3 text-sm" />
                <button id="import-json-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition-colors">
                    Overwrite Database State
                </button>
            </div>
        </div>
    `;

    // Export raw JSON
    container.querySelector('#export-json-btn').addEventListener('click', () => {
        const dataStr = JSON.stringify(db.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `electi_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Import raw JSON
    container.querySelector('#import-json-btn').addEventListener('click', () => {
        const file = container.querySelector('#import-json-file').files[0];
        if (!file) return alert("Select a JSON file first.");

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.users && parsed.teams && parsed.contests) {
                    db.data = parsed;
                    alert("Database state successfully restored. You can now go to Admin Importer to generate a new vault.enc.");
                } else {
                    alert("Invalid backup file structure.");
                }
            } catch (err) {
                alert("Error parsing JSON file.");
            }
        };
        reader.readAsText(file);
    });
}
