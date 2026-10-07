export function renderLeaderboard(container, users) {
    if (!users || users.length === 0) {
        container.innerHTML = `<div class="bg-white p-6 rounded-xl border border-slate-200 text-slate-500">No users found in database.</div>`;
        return;
    }

    const sortedUsers = [...users].sort((a, b) => (b.readinessScore || 0) - (a.readinessScore || 0));
    let tableRows = '';
    
    sortedUsers.forEach((user, index) => {
        tableRows += `
            <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100">
                <td class="py-4 px-6 text-sm text-slate-500">${index + 1}</td>
                <td class="py-4 px-6 text-sm font-medium text-slate-900">${user.fullName || 'Unknown'}</td>
                <td class="py-4 px-6 text-sm"><a href="https://codeforces.com/profile/${user.cfHandle || ''}" target="_blank" class="text-indigo-600 hover:underline">${user.cfHandle || 'N/A'}</a></td>
                <td class="py-4 px-6 text-sm text-slate-500">${user.acmLevel || 'N/A'}</td>
                <td class="py-4 px-6 text-sm text-slate-500">${user.maxRating || 0}</td>
                <td class="py-4 px-6 text-sm font-bold text-emerald-600">${user.readinessScore || 0}</td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-900">Div. 2 Readiness Leaderboard</h2>
            <p class="text-sm text-slate-500 mt-1">Calculated using highest Codeforces rating and internal contest scores.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr class="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            <th class="py-3 px-6">Rank</th>
                            <th class="py-3 px-6">Name</th>
                            <th class="py-3 px-6">CF Handle</th>
                            <th class="py-3 px-6">Level</th>
                            <th class="py-3 px-6">Max Rating</th>
                            <th class="py-3 px-6">Score (200)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
