export function renderUserTableTemplate() {
    return `
        <div>
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 class="text-xl font-bold text-slate-900">User Database</h3>
                <div class="flex gap-3 items-center w-full md:w-auto flex-wrap">
                    <label class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors shadow-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C6.721,2,2,6.721,2,12.545s4.721,10.545,10.545,10.545c6.12,0,10.201-4.301,10.201-10.384c0-0.697-0.076-1.372-0.188-2.039H12.545z"/></svg>
                        Import Form
                        <input type="file" id="csv-import-input" accept=".csv" class="hidden" />
                    </label>
                    <button id="download-users-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download
                    </button>
                </div>
            </div>

            <!-- Bulk Actions Toolbar -->
            <div id="bulk-actions-toolbar" class="hidden flex flex-col md:flex-row justify-between items-center gap-4 bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 shadow-sm">
                <span class="text-sm font-bold text-indigo-800"><span id="selected-count">0</span> users selected</span>
                <div class="flex gap-2">
                    <button id="bulk-uni-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">Set University</button>
                    <button id="bulk-delete-btn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">Delete Selected</button>
                </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center">
                <div class="relative w-full md:w-96">
                    <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="text" id="search-users" placeholder="Search by handle, name, university..." class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                
                <div class="flex items-center gap-6 w-full md:w-auto justify-end">
                    <label class="flex items-center gap-2 text-sm text-slate-600 font-medium cursor-pointer">
                        <input type="checkbox" id="filter-active" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"> Show only active
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-600 font-medium cursor-pointer">
                        <input type="checkbox" id="filter-untrusted" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"> Show only untrusted
                    </label>
                </div>
            </div>
            
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto max-h-[500px]">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold sticky top-0 z-10">
                            <tr>
                                <th class="py-3.5 px-4 w-10">
                                    <input type="checkbox" id="select-all-users" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer">
                                </th>
                                <th class="py-3.5 px-4">Handle</th>
                                <th class="py-3.5 px-4">Full Name</th>
                                <th class="py-3.5 px-4">University</th>
                                <th class="py-3.5 px-4">Entry Year</th>
                                <th class="py-3.5 px-4">Last Updated</th>
                                <th class="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="user-table-body" class="divide-y divide-slate-100">
                            <!-- Dynamic Rows -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
