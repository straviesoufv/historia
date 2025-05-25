/**
 * FlashCards Mejorado
 * 
 * Este script implementa un sistema de flashcards interactivo con las siguientes características:
 * - Filtrado por bloques temáticos
 * - Filtrado por categorías dentro de cada bloque
 * - Filtrado por nivel de dificultad
 * - Diseño responsivo
 * - Efectos de animación al voltear las tarjetas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const container = document.getElementById('flashcards-container');
    const blockFilter = document.getElementById('block-filter');
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const statsContainer = document.getElementById('flashcards-stats');
    const titleElement = document.getElementById('titulo-bloque');
    
    // Variables de estado
    let currentBlock = null;
    let currentFilters = {
        category: 'todas',
        difficulty: 'todas'
    };
    
    // Inicializar la aplicación
    function init() {
        // Cargar los selectores de filtros
        loadBlockFilter();
        loadDifficultyFilter();
        
        // Configurar eventos
        blockFilter.addEventListener('change', onBlockChange);
        categoryFilter.addEventListener('change', onFilterChange);
        difficultyFilter.addEventListener('change', onFilterChange);
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        // Cargar el primer bloque por defecto
        if (blockFilter.options.length > 0) {
            currentBlock = blockFilter.value;
            updateTitle(flashcardsData[currentBlock].titulo);
            loadCategoryFilter(currentBlock);
            renderFlashcards();
        }
    }
    
    // Cargar el selector de bloques
    function loadBlockFilter() {
        blockFilter.innerHTML = '';
        
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona un bloque';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        blockFilter.appendChild(defaultOption);
        
        // Opción para todos los bloques
        const allOption = document.createElement('option');
        allOption.value = 'todos';
        allOption.textContent = 'Todos los bloques';
        blockFilter.appendChild(allOption);
        
        // Opciones de bloques
        Object.keys(flashcardsData).forEach(blockId => {
            const option = document.createElement('option');
            option.value = blockId;
            option.textContent = flashcardsData[blockId].titulo;
            blockFilter.appendChild(option);
        });
    }
    
    // Cargar el selector de categorías
    function loadCategoryFilter(blockId) {
        categoryFilter.innerHTML = '';
        
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = 'todas';
        defaultOption.textContent = 'Todas las categorías';
        categoryFilter.appendChild(defaultOption);
        
        if (blockId === 'todos') {
            // Obtener todas las categorías únicas de todos los bloques
            const allCategories = new Set();
            Object.values(flashcardsData).forEach(block => {
                block.tarjetas.forEach(card => {
                    if (card.categoria) allCategories.add(card.categoria);
                });
            });
            
            allCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.toLowerCase();
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        } else if (blockId && flashcardsData[blockId]) {
            // Obtener categorías únicas del bloque seleccionado
            const categories = new Set(
                flashcardsData[blockId].tarjetas.map(card => card.categoria)
            );
            
            categories.forEach(category => {
                if (!category) return;
                const option = document.createElement('option');
                option.value = category.toLowerCase();
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    }
    
    // Cargar el selector de dificultad
    function loadDifficultyFilter() {
        difficultyFilter.innerHTML = '';
        
        const difficulties = [
            { value: 'todas', label: 'Todas las dificultades' },
            { value: 'fácil', label: 'Fácil' },
            { value: 'media', label: 'Media' },
            { value: 'difícil', label: 'Difícil' }
        ];
        
        difficulties.forEach(diff => {
            const option = document.createElement('option');
            option.value = diff.value;
            option.textContent = diff.label;
            difficultyFilter.appendChild(option);
        });
    }
    
    // Manejador de cambio de bloque
    function onBlockChange(e) {
        currentBlock = e.target.value;
        
        if (currentBlock === 'todos') {
            updateTitle('Todos los bloques');
        } else if (currentBlock && flashcardsData[currentBlock]) {
            updateTitle(flashcardsData[currentBlock].titulo);
        } else {
            updateTitle('Selecciona un bloque');
        }
        
        // Actualizar el selector de categorías
        loadCategoryFilter(currentBlock);
        
        // Reiniciar filtros
        currentFilters = {
            category: 'todas',
            difficulty: 'todas'
        };
        difficultyFilter.value = 'todas';
        
        // Renderizar las tarjetas
        renderFlashcards();
    }
    
    // Manejador de cambio de filtros
    function onFilterChange() {
        currentFilters = {
            category: categoryFilter.value,
            difficulty: difficultyFilter.value
        };
        renderFlashcards();
    }
    
    // Reiniciar todos los filtros
    function resetFilters() {
        if (blockFilter.value) {
            currentBlock = blockFilter.value;
            loadCategoryFilter(currentBlock);
        }
        
        currentFilters = {
            category: 'todas',
            difficulty: 'todas'
        };
        
        difficultyFilter.value = 'todas';
        renderFlashcards();
    }
    
    // Actualizar el título de la página
    function updateTitle(title) {
        if (titleElement) {
            titleElement.textContent = `Flashcards: ${title}`;
        }
    }
    
    // Renderizar las flashcards según los filtros
    function renderFlashcards() {
        if (!currentBlock) {
            container.innerHTML = '<div class="no-cards">Selecciona un bloque para comenzar</div>';
            updateStats(0);
            return;
        }
        
        // Obtener las tarjetas filtradas
        let cards = [];
        
        if (currentBlock === 'todos') {
            // Obtener tarjetas de todos los bloques
            Object.values(flashcardsData).forEach(block => {
                cards = cards.concat(block.tarjetas);
            });
        } else if (flashcardsData[currentBlock]) {
            // Obtener tarjetas del bloque seleccionado
            cards = [...flashcardsData[currentBlock].tarjetas];
        }
        
        // Aplicar filtros
        cards = cards.filter(card => {
            const matchesCategory = currentFilters.category === 'todas' || 
                                 (card.categoria && card.categoria.toLowerCase() === currentFilters.category);
            
            const matchesDifficulty = currentFilters.difficulty === 'todas' || 
                                   (card.dificultad && card.dificultad.toLowerCase() === currentFilters.difficulty);
            
            return matchesCategory && matchesDifficulty;
        });
        
        // Actualizar estadísticas
        updateStats(cards.length);
        
        // Mostrar mensaje si no hay tarjetas
        if (cards.length === 0) {
            container.innerHTML = `
                <div class="no-cards">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron tarjetas con los filtros seleccionados</p>
                    <button id="reset-filters-btn" class="button">Reiniciar filtros</button>
                </div>
            `;
            
            // Configurar el evento del botón de reinicio
            const resetBtn = document.getElementById('reset-filters-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetFilters);
            }
            
            return;
        }
        
        // Mezclar las tarjetas
        cards = shuffleArray([...cards]);
        
        // Generar el HTML de las tarjetas
        container.innerHTML = cards.map(card => createCardHTML(card)).join('');
        
        // Configurar eventos de las tarjetas
        const cardElements = document.querySelectorAll('.flashcard');
        cardElements.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
        });
    }
    
    // Crear el HTML de una tarjeta
    function createCardHTML(card) {
        const category = card.categoria || 'General';
        const difficulty = card.dificultad ? card.dificultad.charAt(0).toUpperCase() + card.dificultad.slice(1) : '';
        
        // Formatear el texto para mostrar saltos de línea
        const formattedDefinition = card.definicion.replace(/\n/g, '<br>');
        
        return `
            <div class="flashcard" data-category="${category.toLowerCase()}" data-difficulty="${card.dificultad || ''}">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="flashcard-header">
                            <span class="flashcard-category">${category}</span>
                            ${difficulty ? `<span class="flashcard-difficulty ${card.dificultad}">${difficulty}</span>` : ''}
                        </div>
                        <div class="flashcard-question">
                            <p>${card.termino}</p>
                            <div class="flashcard-hint">Haz clic para ver la respuesta</div>
                        </div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-header">
                            <span class="flashcard-category">${category}</span>
                            ${difficulty ? `<span class="flashcard-difficulty ${card.dificultad}">${difficulty}</span>` : ''}
                        </div>
                        <div class="flashcard-answer">
                            ${formattedDefinition}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Actualizar las estadísticas
    function updateStats(count) {
        if (!statsContainer) return;
        
        statsContainer.innerHTML = `
            <div class="stat">
                <span class="stat-value">${count}</span>
                <span class="stat-label">tarjetas</span>
            </div>
        `;
    }
    
    // Función para mezclar un array (algoritmo de Fisher-Yates)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Inicializar la aplicación
    init();
});
