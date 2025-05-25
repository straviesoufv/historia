// netlify/functions/env.js
exports.handler = async (event, context) => {
  // Configurar encabezados CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar solicitud OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Devolver la API key desde las variables de entorno
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      api_key: process.env.API_KEY || ''
    })
  };
};
