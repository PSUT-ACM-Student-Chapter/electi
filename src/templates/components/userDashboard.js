export function renderUserDashboardTemplate() {
    return `
        <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-8 mb-8">
            <h3 class="text-xl font-bold text-slate-900">Database Statistics & Analytics</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 text-center">
                    <div class="text-4xl font-extrabold text-blue-600" id="stat-total-users">0</div>
                    <div class="text-sm font-medium text-slate-600 mt-1">Total Users</div>
                </div>
                <div class="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 text-center">
                    <div class="text-4xl font-extrabold text-indigo-600" id="stat-universities">0</div>
                    <div class="text-sm font-medium text-slate-600 mt-1">Universities</div>
                </div>
                <div class="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 text-center">
                    <div class="text-4xl font-extrabold text-emerald-600" id="stat-teams">0</div>
                    <div class="text-sm font-medium text-slate-600 mt-1">Total Teams</div>
                </div>
                <div class="bg-teal-50/70 p-5 rounded-2xl border border-teal-100 text-center">
                    <div class="text-4xl font-extrabold text-teal-600" id="stat-competitions">0</div>
                    <div class="text-sm font-medium text-slate-600 mt-1">Unique Competitions</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div class="flex flex-col items-center">
                    <h4 class="text-sm font-bold text-slate-700 mb-3 text-center">ACM Level Breakdown</h4>
                    <div class="w-full h-64 relative"><canvas id="chart-acm-level"></canvas></div>
                </div>
                <div class="flex flex-col items-center">
                    <h4 class="text-sm font-bold text-slate-700 mb-3 text-center">Students by Entry Year</h4>
                    <div class="w-full h-64 relative"><canvas id="chart-entry-year"></canvas></div>
                </div>
                <div class="flex flex-col items-center">
                    <h4 class="text-sm font-bold text-slate-700 mb-3 text-center">Top Competitions by Participants</h4>
                    <div class="w-full h-64 relative"><canvas id="chart-competitions"></canvas></div>
                </div>
            </div>

            <!-- Custom Analysis Builder -->
            <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 mt-6">
                <div class="flex items-center gap-2 mb-4">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                    <h4 class="text-lg font-bold text-slate-900">Custom Analysis Builder</h4>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Group By (X-Axis)</label>
                        <select id="custom-groupby" class="w-full border border-slate-300 p-2.5 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                            <option value="acmLevel">ACM Level</option>
                            <option value="major">University / Major</option>
                            <option value="entryYear">Entry Year</option>
                            <option value="isActive">Active Status</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Metric (Y-Axis)</label>
                        <select id="custom-metric" class="w-full border border-slate-300 p-2.5 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                            <option value="count">User Count</option>
                            <option value="avgRating">Average Max Rating</option>
                            <option value="maxRating">Highest Max Rating</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Chart Type</label>
                        <select id="custom-type" class="w-full border border-slate-300 p-2.5 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                            <option value="bar">Bar Chart</option>
                            <option value="doughnut">Doughnut Chart</option>
                            <option value="line">Line Chart</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button id="custom-generate-btn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm">Generate</button>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-xl p-4 h-72 relative">
                    <canvas id="chart-custom-analysis"></canvas>
                </div>
            </div>
        </div>
    `;
}
