// src/templates/components/userForm.js
export function renderUserFormTemplate() {
    return `
        <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm mb-8">
            <h3 class="text-lg font-bold text-slate-900 mb-4">Add / Update User Info</h3>
            <form id="user-form" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="hidden" id="form-original-id" value="" />
                
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Codeforces Handle *</label>
                    <input type="text" id="form-cf" required class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., tourist" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" id="form-name" required class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Gennady Korotkevich" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Student ID (Optional)</label>
                    <input type="text" id="form-student-id" class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 20211234" />
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Max Rating</label>
                    <input type="number" id="form-max-rating" class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 3400" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile</label>
                    <input type="url" id="form-linkedin" class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">University</label>
                    <input type="text" id="form-uni" class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Type or select university" />
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">ACM Level</label>
                    <select id="form-level" class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                        <option value="None">None</option>
                        <option value="Level 0">Level 0</option>
                        <option value="Level 1">Level 1</option>
                        <option value="Level 2">Level 2</option>
                        <option value="Codeability">Codeability</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Entry Year</label>
                    <input type="text" id="form-entry-year" class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 2024" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Join Year</label>
                    <input type="text" id="form-join-date" maxlength="4" class="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 2024" />
                </div>
                
                <div class="col-span-1 md:col-span-3 flex items-center gap-6 mt-2">
                    <label class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" id="form-active" checked class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                        Active
                    </label>
                    <label class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" id="form-trusted" class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                        Trusted
                    </label>
                </div>
                
                <div class="col-span-1 md:col-span-3 flex gap-3 mt-4 pt-4 border-t border-slate-100">
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">Save User</button>
                    <button type="button" id="form-clear-btn" class="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">Clear Form</button>
                </div>
            </form>
        </div>
    `;
}
