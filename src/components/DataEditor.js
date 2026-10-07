import { db } from '../models/Database.js';

export function renderDataEditor(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-900">Data Editor</h2>
            <p class="text-sm text-slate-500">Manage teams, add new university entries, and oversee competition records.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Add Team Section -->
            <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h3 class="text-lg font-semibold mb-4">Create New Team</h3>
                <input type="text" id="new-team-name" placeholder="Team Name" class="w-full border p-2 rounded mb-3" />
                <input type="text" id="new-team-uni" placeholder="University" class="w-full border p-2 rounded mb-3" />
                <button id="add-team-btn" class="w-full bg-emerald-600 text-white py-2 rounded">Add Team</button>
                <div id="team-status" class="mt-2 text-sm text-green-600"></div>
            </div>

            <!-- Existing Contests Preview -->
            <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm h-64 overflow-y-auto">
                <h3 class="text-lg font-semibold mb-4">Contests in Database</h3>
                <ul class="space-y-2 text-sm">
                    ${db.data.contests.length === 0 ? '<li>No contests imported yet.</li>' : 
                      db.data.contests.map(c => `
                        <li class="flex justify-between border-b pb-1">
                            <span class="font-medium">${c.name}</span>
                            <span class="text-slate-500">${new Date(c.date).toLocaleDateString()}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    container.querySelector('#add-team-btn').addEventListener('click', () => {
        const name = container.querySelector('#new-team-name').value.trim();
        const uni = container.querySelector('#new-team-uni').value.trim();
        
        if (name) {
            db.data.teams.push({
                id: 'team_' + Date.now(),
                teamName: name,
                university: uni || 'Unknown',
                members: [],
                active: true
            });
            container.querySelector('#team-status').innerText = `Team "${name}" added.`;
            container.querySelector('#new-team-name').value = '';
        }
    });
}
