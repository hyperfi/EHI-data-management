import store from './store.js';

export async function apiRequest(url, options = {}) {
  try {
      let response = await fetch(url, options);

      console.log('Response:', response.status); // Log the response for debugging
      // Check if the response status is 403
      if (response.status === 403) {
          console.log('first if')
          window.location.reload(); // Reload the page to redirect to login
          response = await fetch(url, options); // Retry the request
          if (response.status === 403) {
            console.log('second if')
            // If still 403, clear session storage and dispatch logout
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('isLoggedIn');
            store.dispatch('logout');
            console.error('Session expired. Logging out...');
            window.location.reload(); // Reload the page to redirect to login
            return; // Return to prevent further processing
          }
          else {
            console.log('second else')
            // If the response is not 403, return the response
            return response;
          }
        }
      console.log('else')
      return response; // Return the response for further processing
    } catch (error) {
    console.error('Error during API request:', error);
    throw error; // Re-throw the error for further handling
  }
}