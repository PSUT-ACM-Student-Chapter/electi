// src/components/UserManagement.js
import { db } from '../models/Database.js';
import { getEntryYear } from '../utils/formParser.js';
import { getUserManagementTemplate } from '../templates/userManagementTemplate.js';
import { saveUserFromForm, importUsersFromCSV, exportUsersToCSV, deleteUsers, updateUsersUniversity } from '../services/userService.js';
import { initCharts, renderCustomChart } from '../services/chartService.js';

export function renderUserManagement(container) {
    container.innerHTML = getUserManagementTemplate();

    attachCollapsibleToggle(container);
    attachUserManagementListeners(container);
    refreshDashboardAndTable(container);
}

function attachCollapsibleToggle(container) {
    const toggleBtn = container.querySelector('#toggle-user-section');
    const content = container.querySelector('#user-section-content');
    const icon = container.querySelector('#collapse-icon');

    const isCollapsed = localStorage.getItem('electi_users_collapsed') === 'true';
    if (isCollapsed) {
        content.classList.add('hidden');
        icon.classList.remove('rotate-90');
    }

    toggleBtn.addEventListener('click', () => {
        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-90');
        const collapsedState = content.classList.contains('hidden');
        localStorage.setItem('electi_users_collapsed', collapsedState);
    });
}

function refreshDashboardAndTable(container) {
    const users = db.data.users || [];
    const teams = db.data.teams || [];
    const contests = db.data.contests || [];

    container.querySelector('#stat-total-users').innerText = users.length;
    container.querySelector('#header-user-count').innerText = `${users.length} Users`;
    
    const unis = new Set(users.map(u => u.major).filter(m => m && m.toLowerCase() !== 'unknown'));
    container.querySelector('#stat-universities').innerText = unis.size;
    container.querySelector('#stat-teams').innerText = teams.length;
    container.querySelector('#stat-competitions').innerText = contests.length;

    initCharts(container, users);
    renderUserTable(container);
}

function attachUserManagementListeners(container) {
    const form = container.querySelector('#user-form');
    const clearBtn = container.querySelector('#form-clear-btn');
    const searchInput = container.querySelector('#search-users');
    const filterActive = container.querySelector('#filter-active');
    const filterUntrusted = container.querySelector('#filter-untrusted');
    const importInput = container.querySelector('#csv-import-input');
    const downloadBtn = container.querySelector('#download-users-btn');
    const customGenBtn = container.querySelector('#custom-generate-btn');
    const modal = container.querySelector('#user-details-modal');
    const closeModalBtn = container.querySelector('#close-modal-btn');
    
    const bulkToolbar = container.querySelector('#bulk-actions-toolbar');
    const bulkDelBtn = container.querySelector('#bulk-delete-btn');
    const bulkUniBtn = container.querySelector('#bulk-uni-btn');
    const selectAllBox = container.querySelector('#select-all-users');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            saveUserFromForm(form);
            form.reset();
            container.querySelector('#form-original-id').value = '';
            refreshDashboardAndTable(container);
        } catch (error) {
            alert(error.message);
        }
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        container.querySelector('#form-original-id').value = '';
    });

    searchInput.addEventListener('input', () => renderUserTable(container));
    filterActive.addEventListener('change', () => renderUserTable(container));
    filterUntrusted.addEventListener('change', () => renderUserTable(container));

    customGenBtn.addEventListener('click', () => renderCustomChart(container, db.data.users));

    importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const addedCount = await importUsersFromCSV(file);
            if (addedCount > 0) {
                alert(`Successfully imported ${addedCount} new entries.`);
                refreshDashboardAndTable(container);
            }
        } catch (error) {
            alert("Error parsing CSV: " + error.message);
        }
        importInput.value = '';
    });

    downloadBtn.addEventListener('click', exportUsersToCSV);

    function getSelectedIdentifiers() {
        return Array.from(container.querySelectorAll('.user-checkbox:checked')).map(cb => cb.dataset.identifier);
    }

    selectAllBox.addEventListener('change', (e) => {
        container.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = e.target.checked);
        updateBulkToolbar(container);
    });

    container.querySelector('#user-table-body').addEventListener('change', (e) => {
        if (e.target.classList.contains('user-checkbox')) {
            updateBulkToolbar(container);
            const allCheckboxes = Array.from(container.querySelectorAll('.user-checkbox'));
            selectAllBox.checked = allCheckboxes.length > 0 && allCheckboxes.every(cb => cb.checked);
        }
    });

    bulkDelBtn.addEventListener('click', () => {
        const identifiers = getSelectedIdentifiers();
        if (confirm(`Are you sure you want to delete ${identifiers.length} selected user(s)?`)) {
            deleteUsers(identifiers);
            selectAllBox.checked = false;
            updateBulkToolbar(container);
            refreshDashboardAndTable(container);
        }
    });

    bulkUniBtn.addEventListener('click', () => {
        const identifiers = getSelectedIdentifiers();
        const newUni = prompt(`Enter the new University for ${identifiers.length} selected user(s):`);
        if (newUni !== null) {
            updateUsersUniversity(identifiers, newUni);
            selectAllBox.checked = false;
            updateBulkToolbar(container);
            refreshDashboardAndTable(container);
        }
    });

    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
}

function updateBulkToolbar(container) {
    const checkedCount = container.querySelectorAll('.user-checkbox:checked').length;
    const toolbar = container.querySelector('#bulk-actions-toolbar');
    const countSpan = container.querySelector('#selected-count');
    
    if (checkedCount > 0) {
        countSpan.innerText = checkedCount;
        toolbar.classList.remove('hidden');
        toolbar.classList.add('flex');
    } else {
        toolbar.classList.add('hidden');
        toolbar.classList.remove('flex');
    }
}

function renderUserTable(container) {
    const tbody = container.querySelector('#user-table-body');
    const searchInput = container.querySelector('#search-users');
    const filterActive = container.querySelector('#filter-active');
    const filterUntrusted = container.querySelector('#filter-untrusted');
    
    container.querySelector('#select-all-users').checked = false;
    updateBulkToolbar(container);

    const lowerFilter = searchInput ? searchInput.value.toLowerCase() : "";
    const showActiveOnly = filterActive ? filterActive.checked : false;
    const showUntrustedOnly = filterUntrusted ? filterUntrusted.checked : false;

    const filteredUsers = db.data.users.filter(u => {
        const matchesText = (u.cfHandle && u.cfHandle.toLowerCase().includes(lowerFilter)) ||
            (u.fullName && u.fullName.toLowerCase().includes(lowerFilter)) ||
            (u.major && u.major.toLowerCase().includes(lowerFilter)) ||
            (u.studentId && u.studentId.toLowerCase().includes(lowerFilter));
        const matchesActive = showActiveOnly ? u.isActive === true : true;
        const matchesUntrusted = showUntrustedOnly ? u.isTrusted === false : true;
        return matchesText && matchesActive && matchesUntrusted;
    });

    if (filteredUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">No matching users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredUsers.map(u => {
        const identifier = u.cfHandle || u.fullName;
        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-3.5 px-4 w-10">
                    <input type="checkbox" class="user-checkbox w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" data-identifier="${identifier}">
                </td>
                <td class="py-3.5 px-4 font-bold text-indigo-600 cursor-pointer handle-click" data-identifier="${identifier}">
                    <span class="hover:underline">${u.cfHandle || '<span class="text-slate-400 font-normal italic">No Handle</span>'}</span>
                </td>
                <td class="py-3.5 px-4 font-medium text-slate-800">${u.fullName || 'Unknown'}</td>
                <td class="py-3.5 px-4 text-slate-600">${u.major || '--'}</td>
                <td class="py-3.5 px-4 text-slate-600 font-medium">${getEntryYear(u)}</td>
                <td class="py-3.5 px-4 text-slate-500 text-xs">${u.lastUpdated || '--'}</td>
                <td class="py-3.5 px-4 text-right space-x-2">
                    <button class="details-btn text-indigo-600 hover:text-indigo-800 text-xs font-semibold" data-identifier="${identifier}">Details</button>
                    <button class="edit-btn text-slate-600 hover:text-slate-800 text-xs font-semibold" data-identifier="${identifier}">Edit</button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('.handle-click, .details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => showUserModal(e.currentTarget.getAttribute('data-identifier'), container));
    });

    tbody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const identifier = e.target.getAttribute('data-identifier');
            const user = db.data.users.find(u => (u.cfHandle || u.fullName) === identifier);
            if (user) {
                container.querySelector('#form-original-id').value = user.cfHandle || '';
                container.querySelector('#form-cf').value = user.cfHandle || '';
                container.querySelector('#form-name').value = user.fullName || '';
                container.querySelector('#form-student-id').value = user.studentId || '';
                container.querySelector('#form-max-rating').value = user.maxRating || '';
                container.querySelector('#form-linkedin').value = user.linkedIn || '';
                container.querySelector('#form-uni').value = user.major || '';
                container.querySelector('#form-level').value = user.acmLevel || 'None';
                container.querySelector('#form-entry-year').value = user.entryYear || getEntryYear(user);
                container.querySelector('#form-join-date').value = user.joinDate || '';
                container.querySelector('#form-active').checked = user.isActive !== false;
                container.querySelector('#form-trusted').checked = user.isTrusted === true;

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function showUserModal(identifier, container) {
    const user = db.data.users.find(u => (u.cfHandle || u.fullName) === identifier);
    if (!user) return;

    const modal = container.querySelector('#user-details-modal');
    const content = container.querySelector('#modal-content');

    const userTeams = (db.data.teams || []).filter(t => 
        (t.members && t.members.includes(user.studentId)) || 
        (t.members && t.members.includes(user.cfHandle))
    );
    let teamsHtml = userTeams.map(t => `<span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold border border-indigo-100">${t.teamName || t.name || 'Unnamed Team'}</span>`).join('');
    if (!teamsHtml) teamsHtml = `<span class="text-slate-500 text-sm">No teams found</span>`;

    let placementsHtml = '';
    if (user.placements && user.placements.length > 0) {
        placementsHtml = user.placements.map(p => `
            <tr>
                <td class="p-3 font-medium text-indigo-600">${p.competition || p.contestName || '--'}</td>
                <td class="p-3">${p.type || '--'}</td>
                <td class="p-3">${p.rank || '--'}</td>
                <td class="p-3 font-bold">${p.placement || '--'}</td>
            </tr>
        `).join('');
    } else {
        placementsHtml = `<tr><td colspan="4" class="p-4 text-center text-slate-500">No placement history found.</td></tr>`;
    }

    content.innerHTML = `
        <div class="flex items-center gap-6 mb-6">
            <div class="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-800 shadow-inner">
                ${user.maxRating || '0'}
            </div>
            <div>
                <div class="flex items-center gap-3 mb-1">
                    <h3 class="text-2xl font-bold text-slate-900">${user.cfHandle || user.fullName}</h3>
                    ${user.isActive ? `<span class="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded font-bold tracking-wide">ACTIVE</span>` : ''}
                </div>
                <p class="text-slate-600 text-base mb-2">${user.cfHandle ? user.fullName : 'Codeforces Handle not linked'}</p>
                ${user.cfHandle ? `<a href="https://codeforces.com/profile/${user.cfHandle}" target="_blank" class="text-indigo-600 hover:underline text-sm font-medium flex items-center gap-1">View on Codeforces <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>` : ''}
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
            <div>
                <p class="text-xs text-slate-400 font-bold uppercase">University</p>
                <p class="font-medium text-slate-800 text-sm mt-0.5">${user.major || '--'}</p>
            </div>
            <div>
                <p class="text-xs text-slate-400 font-bold uppercase">ACM Level</p>
                <p class="font-medium text-slate-800 text-sm mt-0.5">${user.acmLevel || 'None'}</p>
            </div>
            <div>
                <p class="text-xs text-slate-400 font-bold uppercase">Entry Year</p>
                <p class="font-medium text-slate-800 text-sm mt-0.5">${getEntryYear(user)}</p>
            </div>
            <div>
                <p class="text-xs text-slate-400 font-bold uppercase">Student ID</p>
                <p class="font-medium text-slate-800 text-sm mt-0.5">${user.studentId || '--'}</p>
            </div>
            <div>
                <p class="text-xs text-slate-400 font-bold uppercase">Join Date</p>
                <p class="font-medium text-slate-800 text-sm mt-0.5">${user.joinDate || '--'}</p>
            </div>
            <div>
                <p class="text-xs text-slate-400 font-bold uppercase">Email</p>
                ${user.email ? `<a href="mailto:${user.email}" class="text-indigo-600 hover:underline text-sm font-medium mt-0.5 truncate block">${user.email}</a>` : `<p class="text-slate-400 text-sm mt-0.5">--</p>`}
            </div>
            <div>
                <p class="text-xs text-slate-400 font-bold uppercase">Phone Number</p>
                ${user.phone ? `<a href="tel:${user.phone}" class="text-indigo-600 hover:underline text-sm font-medium mt-0.5 block">${user.phone}</a>` : `<p class="text-slate-400 text-sm mt-0.5">--</p>`}
            </div>
            <div class="col-span-2 md:col-span-3 pt-2">
                <p class="text-xs text-slate-400 font-bold uppercase">LinkedIn</p>
                ${user.linkedIn ? `<a href="${user.linkedIn}" target="_blank" class="text-indigo-600 hover:underline font-medium text-sm mt-0.5 block">LinkedIn Profile</a>` : '<p class="text-slate-400 text-sm mt-0.5">--</p>'}
            </div>
        </div>

        <div class="mb-6">
            <h4 class="text-base font-bold text-slate-900 mb-2">Teams</h4>
            <div class="flex gap-2 flex-wrap">
                ${teamsHtml}
            </div>
        </div>
        
        <div>
            <h4 class="text-base font-bold text-slate-900 mb-2">All Placements</h4>
            <div class="border border-slate-200 rounded-xl overflow-hidden">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 text-slate-500 font-semibold uppercase">
                        <tr><th class="p-3">Competition</th><th class="p-3">Type</th><th class="p-3">Rank</th><th class="p-3">Placement</th></tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${placementsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
