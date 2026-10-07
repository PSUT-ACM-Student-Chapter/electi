// src/services/chartService.js
import { getEntryYear } from '../utils/formParser.js';

let acmChartInstance = null;
let yearChartInstance = null;
let compChartInstance = null;
let customChartInstance = null;

export function initCharts(container, users) {
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            renderStandardCharts(container, users);
            renderCustomChart(container, users);
        };
        document.head.appendChild(script);
    } else {
        renderStandardCharts(container, users);
        renderCustomChart(container, users);
    }
}

function renderStandardCharts(container, users) {
    const ctxAcm = container.querySelector('#chart-acm-level').getContext('2d');
    const ctxYear = container.querySelector('#chart-entry-year').getContext('2d');
    const ctxComp = container.querySelector('#chart-competitions').getContext('2d');

    const acmCounts = {};
    users.forEach(u => { 
        const lvl = u.acmLevel || 'None';
        acmCounts[lvl] = (acmCounts[lvl] || 0) + 1; 
    });

    const yearCounts = {};
    users.forEach(u => {
        const yr = getEntryYear(u);
        yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    });

    let dynamicCompCounts = {};
    users.forEach(u => {
        if (u.placements && Array.isArray(u.placements)) {
            u.placements.forEach(p => {
                const compName = p.competition || p.contestName || "Unknown";
                dynamicCompCounts[compName] = (dynamicCompCounts[compName] || 0) + 1;
            });
        }
    });

    if (Object.keys(dynamicCompCounts).length === 0) {
        dynamicCompCounts = { "No Placements Recorded": 1 };
    } else {
        const sortedComps = Object.entries(dynamicCompCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        dynamicCompCounts = Object.fromEntries(sortedComps);
    }

    if (acmChartInstance) acmChartInstance.destroy();
    acmChartInstance = new Chart(ctxAcm, {
        type: 'doughnut',
        data: {
            labels: Object.keys(acmCounts),
            datasets: [{ data: Object.values(acmCounts), backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    if (yearChartInstance) yearChartInstance.destroy();
    yearChartInstance = new Chart(ctxYear, {
        type: 'doughnut',
        data: {
            labels: Object.keys(yearCounts),
            datasets: [{ data: Object.values(yearCounts), backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#cbd5e1', '#6366f1'] }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    if (compChartInstance) compChartInstance.destroy();
    compChartInstance = new Chart(ctxComp, {
        type: 'doughnut',
        data: {
            labels: Object.keys(dynamicCompCounts),
            datasets: [{ data: Object.values(dynamicCompCounts), backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'] }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

export function renderCustomChart(container, users) {
    const ctx = container.querySelector('#chart-custom-analysis').getContext('2d');
    const groupBy = container.querySelector('#custom-groupby').value;
    const metric = container.querySelector('#custom-metric').value;
    const chartType = container.querySelector('#custom-type').value;

    const groups = {};

    users.forEach(u => {
        let key = u[groupBy] || 'Unknown';
        if (groupBy === 'entryYear') key = getEntryYear(u);
        if (groupBy === 'isActive') key = u.isActive ? 'Active' : 'Inactive';

        if (!groups[key]) groups[key] = [];
        groups[key].push(u);
    });

    const labels = Object.keys(groups);
    const dataValues = labels.map(key => {
        const groupUsers = groups[key];
        if (metric === 'count') return groupUsers.length;
        if (metric === 'avgRating') {
            const sum = groupUsers.reduce((acc, curr) => acc + (curr.maxRating || 0), 0);
            return Math.round(sum / groupUsers.length) || 0;
        }
        if (metric === 'maxRating') {
            return Math.max(...groupUsers.map(u => u.maxRating || 0), 0);
        }
        return 0;
    });

    if (customChartInstance) customChartInstance.destroy();
    customChartInstance = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: `${metric.toUpperCase()} by ${groupBy.toUpperCase()}`,
                data: dataValues,
                backgroundColor: chartType === 'bar' ? '#6366f1' : ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderRadius: chartType === 'bar' ? 6 : 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: chartType !== 'bar' } },
            scales: chartType === 'bar' ? { y: { beginAtZero: true } } : {}
        }
    });
}
