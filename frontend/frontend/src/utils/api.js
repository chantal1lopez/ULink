const BASE_URL = 'http://localhost:3000/api';

// Configuración genérica para llamadas a la API
const apiCall = async ({ url, method, body, headers }) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
      console.error(response.status)
    }
    return await response.json();
  } catch (error) {
    console.error('Error making api call', error);
    throw error; 
  }
};

export const get = (url, headers) => apiCall({ url, method: 'GET', headers });
export const post = (url, body, headers) => apiCall({ url, method: 'POST', body, headers });
export const patch = (url, body, headers) => apiCall({ url, method: 'PATCH', body, headers });
export const put = (url, body, headers) => apiCall({ url, method: 'PUT', body, headers });
export const del = (url, headers) => apiCall({ url, method: 'DELETE', headers });
