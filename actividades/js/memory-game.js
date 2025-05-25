document.addEventListener('DOMContentLoaded', function() {
    // Variables del juego
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let intentos = 0;
    let aciertos = 0;
    let totalParejas = 0;

    // Elementos del DOM
    const memoryGrid = document.getElementById('memory-grid');
    const intentosElement = document.getElementById('intentos');
    const aciertosElement = document.getElementById('aciertos');
    const totalParejasElement = document.getElementById('total-parejas');
    const reiniciarBtn = document.getElementById('reiniciar-btn');
    const selectorBloques = document.getElementById('selector-bloques');
    const tituloBloque = document.getElementById('titulo-bloque');

    // Cargar los datos del archivo memory-data.js
    function cargarDatosMemory() {
        // Usamos los datos de memory-data.js que ya están cargados
        if (typeof memoryData === 'undefined') {
            console.error('No se encontraron los datos del juego');
            return;
        }
        
        // Configurar el selector de bloques
        configurarSelectorBloques();
        
        // Iniciar el juego con el primer bloque por defecto
        if (selectorBloques.options.length > 0) {
            inicializarJuego(selectorBloques.value);
        }
    }

    // Configurar el selector de bloques
    function configurarSelectorBloques() {
        // Limpiar opciones existentes
        selectorBloques.innerHTML = '';
        
        // Añadir opción para todos los bloques
        const todasLasOpciones = document.createElement('option');
        todasLasOpciones.value = 'todos';
        todasLasOpciones.textContent = 'Todos los bloques';
        selectorBloques.appendChild(todasLasOpciones);
        
        // Añadir opciones para cada bloque
        Object.keys(memoryData).forEach(bloque => {
            const opcion = document.createElement('option');
            opcion.value = bloque;
            opcion.textContent = memoryData[bloque].titulo;
            selectorBloques.appendChild(opcion);
        });
    }

    // Inicializar el juego con un bloque específico
    function inicializarJuego(bloque) {
        // Limpiar el tablero actual
        memoryGrid.innerHTML = '';
        
        // Obtener los pares de cartas según el bloque seleccionado
        let paresSeleccionados = [];
        
        if (bloque === 'todos') {
            // Combinar todos los bloques
            Object.values(memoryData).forEach(bloqueData => {
                paresSeleccionados = [...paresSeleccionados, ...bloqueData.pares];
            });
            tituloBloque.textContent = 'Memory: Todos los bloques';
        } else {
            // Usar solo el bloque seleccionado
            paresSeleccionados = [...memoryData[bloque].pares];
            tituloBloque.textContent = `Memory: ${memoryData[bloque].titulo}`;
        }
        
        // Limitar a 8 pares (16 cartas) para no hacer el juego demasiado grande
        paresSeleccionados = paresSeleccionados.slice(0, 8);
        
        // Crear las cartas
        crearCartas(paresSeleccionados);
        
        // Reiniciar contadores
        reiniciarContadores(paresSeleccionados.length);
    }

    // Crear las cartas en el tablero
    function crearCartas(pares) {
        // Limpiar el tablero
        memoryGrid.innerHTML = '';
        
        // Crear un array con todas las cartas (término y definición)
        cards = [];
        
        pares.forEach((par, index) => {
            cards.push(
                {
                    pairId: index,
                    id: `term-${index}`,
                    content: par.termino,
                    type: 'termino',
                    bloque: par.bloque || 'general'
                },
                {
                    pairId: index,
                    id: `def-${index}`,
                    content: par.definicion,
                    type: 'definicion',
                    bloque: par.bloque || 'general'
                }
            );
        });
        
        // Mezclar las cartas
        cards = mezclarArray([...cards]);
        
        // Crear los elementos HTML de las cartas
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.pairId = card.pairId;
            cardElement.dataset.id = card.id;
            cardElement.dataset.type = card.type;
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">
                        <i class="fas fa-question"></i>
                    </div>
                    <div class="card-face card-back ${card.type}">
                        ${card.content}
                    </div>
                </div>
            `;
            
            cardElement.addEventListener('click', flipCard);
            memoryGrid.appendChild(cardElement);
        });
    }

    // Función para mezclar un array (algoritmo de Fisher-Yates)
    function mezclarArray(array) {
        const nuevoArray = [...array];
        for (let i = nuevoArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
        }
        return nuevoArray;
    }

    // Reiniciar contadores
    function reiniciarContadores(total) {
        intentos = 0;
        aciertos = 0;
        totalParejas = total;
        
        intentosElement.textContent = intentos;
        aciertosElement.textContent = aciertos;
        totalParejasElement.textContent = totalParejas;
    }

    // Voltear una carta
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // Primera carta del par
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Segunda carta del par
        secondCard = this;
        checkForMatch();
    }

    // Comprobar si las cartas coinciden
    function checkForMatch() {
        const isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId && 
                      firstCard.dataset.type !== secondCard.dataset.type;
        
        intentos++;
        intentosElement.textContent = intentos;
        
        if (isMatch) {
            disableCards();
            aciertos++;
            aciertosElement.textContent = aciertos;
            
            // Comprobar si se ha ganado el juego
            if (aciertos === totalParejas) {
                setTimeout(() => {
                    alert(`¡Felicidades! Has completado el juego en ${intentos} intentos.`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    // Deshabilitar cartas coincidentes
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    // Volver a dar la vuelta a las cartas si no coinciden
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    // Reiniciar el tablero después de cada jugada
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Event listeners
    reiniciarBtn.addEventListener('click', () => {
        if (selectorBloques.value) {
            inicializarJuego(selectorBloques.value);
        }
    });
    
    selectorBloques.addEventListener('change', (e) => {
        inicializarJuego(e.target.value);
    });

    // Inicializar el juego cuando el DOM esté listo
    if (memoryGrid) {
        cargarDatosMemory();
    }
});
