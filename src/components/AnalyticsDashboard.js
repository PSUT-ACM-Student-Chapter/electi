import { db } from '../models/Database.js';

export function renderAnalyticsDashboard(container) {
    if (!db.data.users.length) return;

    // Derived stats
    const totalContests = db.data.contests.length;
    const avgScore = db.data.users.reduce((acc, u) => acc + (u.readinessScore || 0), 0) / db.data.users.length;
    
    // Process university distributions from teams
    const uniCounts = {};
    db.data.teams.forEach(t => {
        const uni = t.university || 'PSUT';
        uniCounts[uni] = (uniCounts[uni] || 0) + 1;
    });

    container.innerHTML = `
        <div class="mb-6 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-slate-900">Advanced Analytics</h2>
                <p class="text-sm text-slate-500">Cross-university metrics and overall community performance.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div class="text-sm text-indigo-600 font-semibold uppercase">Total Contests</div>
                <div class="text-3xl font-bold text-slate-900">${totalContests}</div>
            </div>
            <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div class="text-sm text-emerald-600 font-semibold uppercase">Avg Readiness Score</div>
                <div class="text-3xl font-bold text-slate-900">${avgScore.toFixed(1)} / 200</div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div class="text-sm text-blue-600 font-semibold uppercase">Registered Teams</div>
                <div class="text-3xl font-bold text-slate-900">${db.data.teams.length}</div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <canvas id="uniChart"></canvas>
            </div>
            <!-- Keep your existing major/level charts here -->
        </div>
    `;

    // Only render Chart if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        new Chart(container.querySelector('#uniChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(uniCounts),
                datasets: [{
                    data: Object.values(uniCounts),
                    backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384']
                }]
            },
            options: { plugins: { title: { display: true, text: 'Teams by University' } } }
        });
    }
}
