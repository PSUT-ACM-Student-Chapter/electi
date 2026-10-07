// src/templates/userManagementTemplate.js
import { renderUserFormTemplate } from './components/userForm.js';
import { renderUserDashboardTemplate } from './components/userDashboard.js';
import { renderUserTableTemplate } from './components/userTable.js';

export function getUserManagementTemplate() {
    return `
        <!-- Collapsible Header / Toggle Button -->
        <div class="flex justify-between items-center mb-6 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div class="flex items-center gap-3 cursor-pointer select-none" id="toggle-user-section">
                <svg id="collapse-icon" class="w-5 h-5 text-indigo-600 transition-transform duration-200 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                <h2 class="text-2xl font-bold text-slate-900">User Management & Analytics</h2>
            </div>
            <span id="header-user-count" class="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">0 Users</span>
        </div>

        <!-- Collapsible Content Wrapper -->
        <div id="user-section-content" class="space-y-8">
            ${renderUserFormTemplate()}
            ${renderUserDashboardTemplate()}${renderUserTableTemplate()}
        </div>

        <!-- User Details Modal -->
        <div id="user-details-modal" class="fixed inset-0 bg-slate-900/50 hidden items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <button id="close-modal-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                <div class="p-8" id="modal-content"></div>
            </div>
        </div>
    `;
}
