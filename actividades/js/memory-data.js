// Datos para el juego de memoria organizados por bloques
const memoryData = {
  "mitologia": {
    titulo: "Mitología Romana",
    pares: [
      { termino: "Saturno", definicion: "Dios que devoraba a sus hijos por miedo a ser destronado" },
      { termino: "Júpiter", definicion: "Hijo de Saturno que lo destronó y se convirtió en rey de los dioses" },
      { termino: "Proserpina", definicion: "Hija de Ceres raptada por Plutón, vive 6 meses en el inframundo" },
      { termino: "Ceres", definicion: "Diosa de la Tierra y la agricultura, madre de Proserpina" },
      { termino: "Plutón", definicion: "Dios del inframundo que raptó a Proserpina" },
      { termino: "Superávit", definicion: "Lo que queda" },
      { termino: "Déficit", definicion: "Lo que falta" },
      { termino: "Curriculum vitae", definicion: "Conjunto de méritos de una persona" }
    ]
  },
  "conquista": {
    titulo: "La conquista romana",
    pares: [
      { termino: "Guerras púnicas", definicion: "Conflictos entre Roma y Cartago por el control del Mediterráneo" },
      { termino: "Cartago", definicion: "Ciudad que fundó Qart Hadasht (Cartagena) como base en Hispania" },
      { termino: "Escipión", definicion: "General romano que desembarcó en Empúries en 218 a.C." },
      { termino: "Lusitanos", definicion: "Pueblo indígena que ofreció gran resistencia a Roma" },
      { termino: "Celtíberos", definicion: "Pueblo celta de la península que resistió la conquista romana" },
      { termino: "Romanización", definicion: "Proceso de adaptación a la civilización romana" },
      { termino: "Hispanorromanos", definicion: "Población indígena que adoptó la cultura romana" },
      { termino: "Latín", definicion: "Lengua que se impuso en Hispania durante la dominación romana" }
    ]
  },
  "organizacion": {
    titulo: "Organización y economía",
    pares: [
      { termino: "Provincia", definicion: "División administrativa romana gobernada por un gobernador" },
      { termino: "Itálica", definicion: "Colonia romana fundada en la actual Santiponce, Sevilla" },
      { termino: "Vía Augusta", definicion: "Importante calzada romana en Hispania" },
      { termino: "Vía de la Plata", definicion: "Ruta comercial y militar romana en el oeste peninsular" },
      { termino: "Tríada mediterránea", definicion: "Trigo, vid y olivo, principales cultivos romanos" },
      { termino: "Garum", definicion: "Salsa de pescado en salazón muy apreciada en Roma" },
      { termino: "Minas de Hispania", definicion: "Fuente de oro, plata, estaño, hierro y plomo" },
      { termino: "Esclavos", definicion: "Mano de obra principal en minas y grandes explotaciones" }
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

// Función para preparar las cartas del juego
function prepararCartas(bloque) {
  const pares = memoryData[bloque].pares;
  let cartas = [];
  
  // Crear pares de cartas (término y definición)
  pares.forEach((par, index) => {
    // Carta con término
    cartas.push({
      id: index * 2,
      contenido: par.termino,
      tipo: 'termino',
      parId: index,
      volteada: false,
      encontrada: false
    });
    
    // Carta con definición
    cartas.push({
      id: index * 2 + 1,
      contenido: par.definicion,
      tipo: 'definicion',
      parId: index,
      volteada: false,
      encontrada: false
    });
  });
  
  return mezclarArray(cartas);
}
