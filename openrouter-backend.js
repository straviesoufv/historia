// Backend Express para preguntas de desarrollo y feedback con OpenRouter
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(cors());

// Leer API key de archivo
const apiKeyPath = path.join(__dirname, '.env', 'openrouter.txt');
let OPENROUTER_API_KEY = '';
try {
    OPENROUTER_API_KEY = fs.readFileSync(apiKeyPath, 'utf8').trim();
} catch (err) {
    console.error('No se pudo leer la API key de OpenRouter:', err);
}

const preguntasPath = path.join(__dirname, 'Preguntas_desarrollo.txt');

// Utilidad: parsear preguntas y respuestas del archivo
function parsePreguntas(texto) {
    // Eliminar la primera línea de encabezado si existe
    const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
    
    // Si la primera línea es el encabezado, la saltamos
    const startIndex = lineas[0].includes('TEMA') ? 1 : 0;
    
    // Procesar cada línea (excepto la de encabezado)
    return lineas.slice(startIndex).map(linea => {
        // Dividir por tabulaciones (\t)
        const partes = linea.split('\t');
        if (partes.length >= 3) {
            return {
                tema: partes[0].trim(),
                pregunta: partes[1].trim(),
                respuestaModelo: partes[2].trim()
            };
        }
        return null;
    }).filter(Boolean);
}

// GET /pregunta-aleatoria
app.get('/pregunta-aleatoria', (req, res) => {
    fs.readFile(preguntasPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de preguntas:', err);
            return res.status(500).json({ error: 'No se pudo leer el archivo de preguntas.' });
        }
        const preguntas = parsePreguntas(data);
        console.log('Preguntas parseadas:', preguntas.length);
        if (!preguntas.length) {
            console.error('No se encontraron preguntas en el archivo');
            return res.status(404).json({ error: 'No hay preguntas disponibles.' });
        }
        const idx = Math.floor(Math.random() * preguntas.length);
        res.json({
            pregunta: preguntas[idx].pregunta,
            respuestaModelo: preguntas[idx].respuestaModelo,
            tema: preguntas[idx].tema
        });
    });
});

// POST /obtener-feedback
app.post('/obtener-feedback', async (req, res) => {
    const { tema, pregunta, respuestaModelo, respuestaUsuario } = req.body;
    
    if (!pregunta || !respuestaModelo || !respuestaUsuario) {
        return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }
    
    try {
        console.log('Solicitud de feedback recibida para la pregunta:', pregunta.substring(0, 50) + '...');
        
        // Construir el prompt para el feedback
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
            return res.status(respuesta.status).json({ 
                error: `Error al contactar con OpenRouter: ${respuesta.statusText}` 
            });
        }
        
        const data = await respuesta.json();
        console.log('Respuesta de OpenRouter recibida');
        
        const feedback = data.choices?.[0]?.message?.content || 'No se pudo generar el feedback.';
        
        res.json({ 
            success: true,
            feedback: feedback
        });
        
    } catch (error) {
        console.error('Error en /obtener-feedback:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al procesar la solicitud.' 
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3030;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor OpenRouter escuchando en puerto ${PORT}`);
    console.log('Ruta del archivo de preguntas:', preguntasPath);
    console.log('API Key cargada:', OPENROUTER_API_KEY ? 'Sí' : 'No');
});
