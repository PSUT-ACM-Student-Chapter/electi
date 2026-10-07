const CF_API_BASE = 'https://codeforces.com/api';

/**
 * Fetches user information for multiple handles in a single batched request.
 * Codeforces allows multiple handles separated by semicolons.
 * 
 * @param {string[]} handles - Array of Codeforces handles.
 * @returns {Promise<Object[]>} Array of CF user objects.
 */
export const fetchUsersInfo = async (handles) => {
    if (!handles || handles.length === 0) return [];

    try {
        // Chunk handles into groups of 300 to avoid URL length limits
        const chunkSize = 300;
        let allUsers = [];

        for (let i = 0; i < handles.length; i += chunkSize) {
            const chunk = handles.slice(i, i + chunkSize);
            const handlesString = chunk.join(';');
            
            const response = await fetch(`${CF_API_BASE}/user.info?handles=${handlesString}`);
            const data = await response.json();
            
            if (data.status === 'OK') {
                allUsers = [...allUsers, ...data.result];
            } else {
                console.error("CF API Error:", data.comment);
            }
            
            // Artificial 1-second delay between chunks to respect rate limits
            if (i + chunkSize < handles.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return allUsers;
    } catch (error) {
        console.error("Network error fetching Codeforces API:", error);
        return [];
    }
};
