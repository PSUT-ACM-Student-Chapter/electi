// src/components/TeamProfile.js

export function renderTeams(container, teams, contests) {
    if (!teams || teams.length === 0) {
        container.innerHTML = `<p>No teams found in database.</p>`;
        return;
    }

    // Create a dropdown to select a team
    const teamOptions = teams.map(t => `<option value="${t.id}">${t.teamName}</option>`).join('');

    container.innerHTML = `
        <div class="team-profile-container">
            <h2>Team Profiles</h2>
            <select id="team-select" style="padding: 5px; font-size: 16px;">
                <option value="">-- Select a Team --</option>
                ${teamOptions}
            </select>
            
            <div id="team-details" style="margin-top: 20px;"></div>
        </div>
    `;

    document.getElementById('team-select').addEventListener('change', (e) => {
        const teamId = e.target.value;
        if (!teamId) {
            document.getElementById('team-details').innerHTML = '';
            return;
        }

        const team = teams.find(t => t.id == teamId);
        renderTeamDetails(document.getElementById('team-details'), team, contests);
    });
}

function renderTeamDetails(container, team, contests) {
    // Find all contests where this team's name appears in the standings
    const teamHistory = [];
    contests.forEach(contest => {
        const result = contest.standings.find(s => s.teamName === team.teamName);
        if (result) {
            teamHistory.push({
                contestName: contest.name,
                date: new Date(contest.date).toLocaleDateString(),
                rank: result.rank,
                solved: result.problemsSolved,
                penalty: result.penalty
            });
        }
    });

    const historyRows = teamHistory.map(h => `
        <tr>
            <td>${h.date}</td>
            <td>${h.contestName}</td>
            <td>${h.rank}</td>
            <td>${h.solved}</td>
            <td>${h.penalty}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="team-card" style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
            <h3>${team.teamName}</h3>
            <p><strong>Members:</strong> ${team.members ? team.members.join(', ') : 'Not assigned'}</p>
            <p><strong>Active:</strong> ${team.active ? 'Yes' : 'No'}</p>
            
            <h4 style="margin-top: 20px;">Contest History</h4>
            ${teamHistory.length > 0 ? `
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #eee; text-align: left;">
                            <th>Date</th>
                            <th>Contest</th>
                            <th>Rank</th>
                            <th>Solved</th>
                            <th>Penalty</th>
                        </tr>
                    </thead>
                    <tbody>${historyRows}</tbody>
                </table>
            ` : `<p>No contest history found for this team.</p>`}
        </div>
    `;
}
