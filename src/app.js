// src/app.js
import { db } from './models/Database.js';
import { renderUserManagement } from './components/UserManagement.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const appDashboard = document.getElementById('app-dashboard');
    const passwordInput = document.getElementById('vault-password');
    const unlockBtn = document.getElementById('unlock-btn');
    const bypassBtn = document.getElementById('bypass-btn');
    const errorMsg = document.getElementById('login-error');

    // Handle standard vault unlock
	unlockBtn.addEventListener('click', async () => {
    const password = passwordInput.value;
    if (!password) {
        errorMsg.innerText = "Please enter a passcode.";
        return;
    }
    
    unlockBtn.innerText = "Decrypting...";
    unlockBtn.disabled = true;
    errorMsg.innerText = "";

    try {
        const success = await db.unlock(password);
        if (success) {
            transitionToDashboard();
        } else {
            errorMsg.innerText = "Decryption failed. Check passcode or vault format.";
        }
    } catch (err) {
        console.error("Unlock Error:", err);
        errorMsg.innerText = `Error: ${err.message}`;
    } finally {
        unlockBtn.innerText = "Unlock Community Data";
        unlockBtn.disabled = false;
    }
});

    // Handle fresh start / bypass
    bypassBtn.addEventListener('click', () => {
        db.initializeEmpty();
        transitionToDashboard();
    });

    function transitionToDashboard() {
        loginScreen.style.display = 'none';
        appDashboard.style.display = 'flex';
        
        // Initialize global router for the HTML navigation buttons
        window.showView = showView;
        
        // Load default view
        showView('users');
    }
});

// View Router
function showView(viewName) {
    const container = document.getElementById('view-container');
    container.innerHTML = ''; // Clear current view
    
    // Highlight active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === viewName) {
            btn.classList.add('bg-slate-50', 'text-indigo-600');
        } else {
            btn.classList.remove('bg-slate-50', 'text-indigo-600');
        }
    });

    // Route to appropriate component
    switch (viewName) {
        case 'users':
            renderUserManagement(container);
            break;
        case 'dashboard':
        case 'analytics':
        case 'leaderboard':
        case 'teams':
        case 'editor':
        case 'admin':
        case 'management':
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-slate-500">
                    <svg class="w-12 h-12 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    <h2 class="text-xl font-semibold text-slate-700">${viewName.charAt(0).toUpperCase() + viewName.slice(1)} Module</h2>
                    <p class="text-sm mt-2">This component is currently under construction.</p>
                </div>
            `;
            break;
        default:
            container.innerHTML = `<h2 class="text-xl font-bold text-red-600">View not found</h2>`;
    }
}
