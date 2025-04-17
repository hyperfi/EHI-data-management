import store from './store.js';

export async function apiRequest(url, options = {}) {
  try {
    let response = await fetch(url, options);

    // Check if the response status is 403
    if (response.status === 403) {
      // Clear session storage and dispatch logout
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('isLoggedIn');
      store.dispatch('logout');
      console.error('Session expired. Logging out...');
      window.location.reload(); // Reload the page to redirect to login
      return; // Stop further execution
    }

    // Return the response if it's not 403
    return response;
  } catch (error) {
    console.error('Error during API request:', error);
    throw error; // Re-throw the error for further handling
  }
}