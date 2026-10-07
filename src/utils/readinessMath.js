/**
 * Calculates the Electi Div. 2 Readiness Score (0 - 200 points).
 * Adjust the weights below based on your community's rules.
 * 
 * @param {number} maxRating - The user's highest CF rating.
 * @param {number} avgRating - The user's current/average CF rating.
 * @param {number} skips - Number of skipped or unregistered contests.
 * @param {number} internalScore - Points gained from internal PSUT training contests.
 * @returns {number} The calculated readiness score (max 200).
 */
export const calculateDiv2Readiness = (maxRating, avgRating, skips, internalScore) => {
    // Example logic:
    // Base rating score (max 100 points): normalized against a 1400 rating threshold
    const ratingComponent = Math.min(100, ((maxRating * 0.6) + (avgRating * 0.4)) / 14);
    
    // Internal performance score (max 100 points)
    const internalComponent = Math.min(100, internalScore);
    
    // Penalty: Subtract 5 points for every skipped contest
    const penalty = skips * 5;
    
    const finalScore = (ratingComponent + internalComponent) - penalty;
    
    // Clamp the score between 0 and 200
    return Math.max(0, Math.min(200, Math.round(finalScore)));
};

/**
 * Estimates a combined team rating for three members based on CF formulas.
 * (Often calculated using a non-linear average).
 */
export const calculateTeamRating = (memberRatings) => {
    if (!memberRatings || memberRatings.length === 0) return 0;
    
    // Codeforces roughly weights the strongest member heavily.
    // E.g., RMS (Root Mean Square) or weighted sum.
    const sortedRatings = [...memberRatings].sort((a, b) => b - a);
    
    // Simple heuristic: 100% of best, 50% of second, 25% of third
    let teamScore = sortedRatings[0];
    if (sortedRatings.length > 1) teamScore += (sortedRatings[1] * 0.5);
    if (sortedRatings.length > 2) teamScore += (sortedRatings[2] * 0.25);
    
    return Math.round(teamScore);
};
