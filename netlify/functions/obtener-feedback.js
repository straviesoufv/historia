const fetch = require('node-fetch');

// Cargar variables de entorno
try {
  require('dotenv').config();
} catch (e) {
  console.log('dotenv no está disponible en producción');
}

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar solicitud OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  // Solo permitir solicitudes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { tema, pregunta, respuestaModelo, respuestaUsuario } = JSON.parse(event.body);
    
    if (!pregunta || !respuestaModelo || !respuestaUsuario) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan datos requeridos' })
      };
    }

    console.log('Solicitud de feedback recibida para la pregunta:', pregunta.substring(0, 50) + '...');
    
    // Intentar obtener la API key de OpenRouter de las variables de entorno
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    console.log('API Key de OpenRouter:', OPENROUTER_API_KEY ? '***' + OPENROUTER_API_KEY.slice(-4) : 'No encontrada');
    
    if (!OPENROUTER_API_KEY) {
      console.error('No se encontró la API key de OpenRouter');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error de configuración del servidor' })
      };
    }

    const messages = [
      {
        role: 'system',
        content: 'Eres un profesor de historia experto en la Antigua Roma. Evalúa la respuesta del estudiante comparándola con la respuesta modelo. Proporciona un feedback constructivo, señalando aciertos, errores importantes y sugerencias de mejora. Sé claro y conciso (máximo 150 palabras). Si la respuesta es muy corta o irrelevante, sugiere cómo mejorarla.'
      },
      {
        role: 'user',
        content: `Tema: ${tema || 'No especificado'}\n\nPregunta: ${pregunta}\n\nRespuesta modelo de referencia: ${respuestaModelo}\n\nRespuesta del estudiante: ${respuestaUsuario}`
      }
    ];

    console.log('Enviando solicitud a OpenRouter...');
    const respuesta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://historia-1eso-3t.netlify.app',
        'X-Title': 'Ejercicios de Historia Antigua'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: messages,
        max_tokens: 400,
        temperature: 0.7
      })
    });

    if (!respuesta.ok) {
      const errorText = await respuesta.text();
      console.error('Error en la respuesta de OpenRouter:', respuesta.status, errorText);
      return {
        statusCode: respuesta.status,
        body: JSON.stringify({ 
          error: `Error al contactar con OpenRouter: ${respuesta.statusText}` 
        })
      };
    }

    const data = await respuesta.json();
    console.log('Respuesta de OpenRouter recibida');
    
    const feedback = data.choices?.[0]?.message?.content || 'No se pudo generar el feedback.';
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        feedback: feedback
      })
    };
    
  } catch (error) {
    console.error('Error en la función de Netlify:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Error interno del servidor al procesar la solicitud.' 
      })
    };
  }
};
