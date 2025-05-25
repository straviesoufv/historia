# Guía de estructura y estilo para la plantilla educativa

## Estructura base:
- Todas las páginas usan una **plantilla común** (`layout.html`) que incluye:
  - Encabezado (`header.html`): logo o nombre del proyecto y enlaces de navegación principales (teoría, mapa mental, actividades, etc.).
  - Footer (`footer.html`): copyright, créditos, enlaces adicionales.
- El header y el footer deben estar **centralizados** y editarse solo una vez para actualizar en toda la web (usa includes, componentes o un script JS en HTML puro).
- El contenido de cada sección se inserta en el bloque principal del `layout`.

## Estilo visual:
- Paleta principal: tonos suaves de azul y verde; fondo blanco o gris muy claro.
- Tipografía: clara, sin serifas ("Segoe UI", "Roboto", Arial, etc.).
- Títulos: grandes, solo la primera palabra en mayúscula (excepto nombres propios).
- Espaciado y márgenes amplios; bloques de contenido bien diferenciados.
- Botones y enlaces grandes, accesibles y con buen contraste.
- **Diseño responsive**: bien adaptado a móvil y escritorio.

## Convenciones y organización:
- Nombres de archivos y rutas: minúsculas, separados por guiones.
- Cada bloque temático en su propio archivo o componente.
- Las actividades deben ser fácilmente editables o ampliables (en archivos o componentes independientes).
- **Comportamiento común:** navegación principal y footer en todas las páginas; navegación con indicación visual de la sección activa; enlaces modificables desde el archivo base.
- No uses mayúsculas innecesarias (solo al inicio de frase y nombres propios).

## Recomendaciones adicionales:
- Comenta el código donde sean esperables futuras modificaciones.
- Mantén el diseño limpio y funcional; evita imágenes o decoraciones innecesarias.
- Si añades JavaScript, que sea modular y bien separado por función.
- Señala claramente en el código dónde debe ir el contenido editable por el docente.