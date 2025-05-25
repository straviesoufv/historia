// Datos para las flashcards organizados por bloques
const flashcardsData = {
  "mitologia": {
    titulo: "Mitología Romana",
    tarjetas: [
      { 
        termino: "Saturno", 
        definicion: "Dios que gobernó durante la Edad de Oro y devoraba a sus hijos por miedo a ser destronado",
        categoria: "Dioses",
        dificultad: "fácil"
      },
      { 
        termino: "Júpiter", 
        definicion: "Rey de los dioses, dios del cielo y el trueno. Hijo de Saturno que lo destronó",
        categoria: "Dioses",
        dificultad: "fácil"
      },
      { 
        termino: "Neptuno", 
        definicion: "Dios de los mares y los terremotos. Hermano de Júpiter y Plutón",
        categoria: "Dioses",
        dificultad: "media"
      },
      { 
        termino: "Marte", 
        definicion: "Dos de la guerra, padre de Rómulo y Remo, los fundadores de Roma",
        categoria: "Dioses",
        dificultad: "media"
      },
      { 
        termino: "Venus", 
        definicion: "Diosa del amor, la belleza y la fertilidad. Madre de Eneas, héroe troyano",
        categoria: "Dioses",
        dificultad: "fácil"
      }
    ]
  },
  "conquista": {
    titulo: "La conquista romana",
    tarjetas: [
      { 
        termino: "Guerras púnicas", 
        definicion: "Serie de tres guerras entre Roma y Cartago (264-146 a.C.) por el control del Mediterráneo",
        categoria: "Conflictos",
        dificultad: "media"
      },
      { 
        termino: "Aníbal", 
        definicion: "General cartaginés que cruzó los Alpes con elefantes para atacar Roma",
        categoria: "Personajes",
        dificultad: "fácil"
      },
      { 
        termino: "Escipión el Africano", 
        definicion: "General romano que derrotó a Aníbal en la batalla de Zama (202 a.C.)",
        categoria: "Personajes",
        dificultad: "media"
      },
      { 
        termino: "Numancia", 
        definicion: "Ciudad celtíbera que resistió heroicamente el asedio romano durante 20 años",
        categoria: "Lugares",
        dificultad: "difícil"
      },
      { 
        termino: "Viriato", 
        definicion: "Líder lusitano que dirigió la resistencia contra los romanos en Hispania",
        categoria: "Personajes",
        dificultad: "media"
      }
    ]
  },
  "sociedad": {
    titulo: "Sociedad y cultura",
    tarjetas: [
      { 
        termino: "Patricios", 
        definicion: "Clase social alta de Roma, descendientes de los fundadores de la ciudad",
        categoria: "Sociedad",
        dificultad: "fácil"
      },
      { 
        termino: "Plebeyos", 
        definicion: "Ciudadanos romanos que no pertenecían a las familias patricias",
        categoria: "Sociedad",
        dificultad: "fácil"
      },
      { 
        termino: "Gladiadores", 
        definicion: "Luchadores profesionales que combatían en espectáculos públicos",
        categoria: "Espectáculos",
        dificultad: "fácil"
      },
      { 
        termino: "Termas", 
        definicion: "Baños públicos romanos que eran centros de vida social",
        categoria: "Arquitectura",
        dificultad: "media"
      },
      { 
        termino: "Circo Máximo", 
        definicion: "Estadio para carreras de carros en Roma, con capacidad para 250,000 espectadores",
        categoria: "Espectáculos",
        dificultad: "media"
      }
    ]
  },
  "tecnologia": {
    titulo: "Tecnología e ingeniería",
    tarjetas: [
      { 
        termino: "Calzadas romanas", 
        definicion: "Red de caminos que conectaba todo el imperio, permitiendo el rápido movimiento de tropas",
        categoria: "Ingeniería",
        dificultad: "fácil"
      },
      { 
        termino: "Acueductos", 
        definicion: "Estructuras para transportar agua a las ciudades, como el Acueducto de Segovia",
        categoria: "Ingeniería",
        dificultad: "media"
      },
      { 
        termino: "Arco de medio punto", 
        definicion: "Elemento arquitectónico característico que distribuye el peso hacia los lados",
        categoria: "Arquitectura",
        dificultad: "difícil"
      },
      { 
        termino: "Hormigón romano", 
        definicion: "Material de construcción resistente al agua, usado en puertos y cúpulas",
        categoria: "Tecnología",
        dificultad: "difícil"
      },
      { 
        termino: "Vía Apia", 
        definicion: "Una de las primeras y más importantes calzadas romanas, que unía Roma con Brindisi",
        categoria: "Ingeniería",
        dificultad: "media"
      }
    ]
  }
};

// Función para mezclar un array (algoritmo de Fisher-Yates)
function mezclarArray(array) {
  const nuevoArray = [...array];
  for (let i = nuevoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
  }
  return nuevoArray;
}

// Función para obtener tarjetas de un bloque específico con opciones de filtrado
function obtenerTarjetas(bloque, filtroCategoria = null, filtroDificultad = null) {
  let tarjetas = [...flashcardsData[bloque].tarjetas];
  
  // Aplicar filtros si se especifican
  if (filtroCategoria && filtroCategoria !== 'todas') {
    tarjetas = tarjetas.filter(tarjeta => tarjeta.categoria === filtroCategoria);
  }
  
  if (filtroDificultad && filtroDificultad !== 'todas') {
    tarjetas = tarjetas.filter(tarjeta => tarjeta.dificultad === filtroDificultad);
  }
  
  return mezclarArray(tarjetas);
}

// Función para obtener todas las categorías únicas de un bloque
function obtenerCategorias(bloque) {
  const categorias = new Set();
  flashcardsData[bloque].tarjetas.forEach(tarjeta => {
    categorias.add(tarjeta.categoria);
  });
  return Array.from(categorias).sort();
}

// Función para obtener todas las dificultades únicas de un bloque
function obtenerDificultades(bloque) {
  const dificultades = new Set();
  flashcardsData[bloque].tarjetas.forEach(tarjeta => {
    dificultades.add(tarjeta.dificultad);
  });
  return Array.from(dificultades).sort();
}
