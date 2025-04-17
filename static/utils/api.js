import store from './store.js';

export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);

    // Check if the response status is 403
    if (response.status === 403) {
      // Clear session storage and dispatch logout
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('isLoggedIn');
      store.dispatch('logout');
      console.error('Session expired. Logging out...');
      // reload the page to redirect to login
        window.location.reload();
    }

    return response;
  } catch (error) {
    console.error('Error during API request:', error);
    throw error; // Re-throw the error for further handling
  }
}