// src/components/Dashboard.js

export function renderDashboard(container, data) {
    if (!data.users || data.users.length === 0) {
        container.innerHTML = `<p>No data available. Please unlock the vault or import users.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="dashboard-header">
            <h2>Community Analytics</h2>
            <p>Total Active Members: <strong>${data.users.length}</strong></p>
        </div>
        
        <div class="charts-container" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-top: 20px;">
            <div style="width: 400px; height: 400px;">
                <canvas id="majorChart"></canvas>
            </div>
            <div style="width: 400px; height: 400px;">
                <canvas id="levelChart"></canvas>
            </div>
        </div>
    `;

    // Process data for charts
    const majorCounts = {};
    const levelCounts = {};

    data.users.forEach(user => {
        // Fallbacks if data is missing
        const major = user.major || 'Unknown';
        const level = user.acmLevel || 'Unassigned';

        majorCounts[major] = (majorCounts[major] || 0) + 1;
        levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    // Render Major Distribution Pie Chart
    new Chart(document.getElementById('majorChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(majorCounts),
            datasets: [{
                data: Object.values(majorCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: { plugins: { title: { display: true, text: 'Students by Major' } } }
    });

    // Render ACM Level Bar Chart
    new Chart(document.getElementById('levelChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(levelCounts),
            datasets: [{
                label: 'Number of Students',
                data: Object.values(levelCounts),
                backgroundColor: '#36A2EB'
            }]
        },
        options: { plugins: { title: { display: true, text: 'ACM Level Breakdown' } } }
    });
}
