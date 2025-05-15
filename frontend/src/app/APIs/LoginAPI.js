const BASE_URL = "http://localhost:80/login"; // Ensure this matches the AuthController's endpoint

/**
 * Sends login credentials to the backend and retrieves a JWT token.
 * 
 * @param {Object} user - The user credentials (username and password).
 * @returns {Object} - The response containing the JWT token.
 * @throws {Error} - If the authentication fails.
 */
export async function validateAuth(user) {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user), // Send username and password in the request body
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas, intente nuevamente'); // Customize the error message based on your needs
        }
        else {
           return await response.json();
        }
    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
}
