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

// POST /corregir
app.post('/corregir', async (req, res) => {
    const { pregunta, respuestaModelo, respuestaUsuario } = req.body;
    if (!pregunta || !respuestaModelo || !respuestaUsuario) {
        return res.status(400).json({ error: 'Faltan datos.' });
    }
    // Construir prompt para feedback constructivo
    const prompt = `Eres un profesor de historia de 1º de ESO. Aquí tienes una pregunta de desarrollo: "${pregunta}".\n\nRespuesta modelo: ${respuestaModelo}\n\nRespuesta del alumno: ${respuestaUsuario}\n\nHaz una corrección constructiva: di si la respuesta es correcta o no, qué le falta, qué podría mejorar, y si está bien, felicita al alumno. Básate en la respuesta modelo para evaluar la respuesta del alumno, no busques en otras fuentes. Responde en español. No hace falta que digas el nombre del alumno`;
    try {
        const respuesta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-maverick',
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        const data = await respuesta.json();
        const feedback = data.choices?.[0]?.message?.content || 'No se pudo obtener feedback.';
        res.json({ feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al contactar con OpenRouter.' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3030;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor OpenRouter escuchando en puerto ${PORT}`);
    console.log('Ruta del archivo de preguntas:', preguntasPath);
    console.log('API Key cargada:', OPENROUTER_API_KEY ? 'Sí' : 'No');
});
