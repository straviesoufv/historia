/**
 * Script para cargar dinámicamente el header y footer en todas las páginas
 * Asegura que los enlaces funcionen correctamente desde cualquier subdirectorio
 */

document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener la ruta base del sitio
    function getBasePath() {
        // Si estamos en localhost, usamos la ruta completa
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const pathParts = window.location.pathname.split('/');
            // Eliminamos el nombre del archivo actual de la ruta
            pathParts.pop();
            return pathParts.join('/') || '/';
        }
        // En producción, usamos la raíz del sitio
        return '/';
    }

    const basePath = getBasePath();
    
    // Cargar header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch(`${basePath}/header.html`)
            .then(response => response.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;
                // Actualizar el enlace activo después de cargar el header
                updateActiveLink();
            })
            .catch(error => console.error('Error al cargar el header:', error));
    }
    
    // Cargar footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch(`${basePath}/footer.html`)
            .then(response => response.text())
            .then(html => footerPlaceholder.innerHTML = html)
            .catch(error => console.error('Error al cargar el footer:', error));
    }
    
    // Función para actualizar el enlace activo en la navegación
    function updateActiveLink() {
        // Obtener la ruta actual sin parámetros de consulta
        const currentPath = window.location.pathname.split('?')[0];
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            // Obtener la ruta del enlace (eliminando la barra inicial si existe)
            let linkPath = link.getAttribute('href').replace(/^\//, '');
            
            // Si el enlace apunta a index.html, también debe coincidir con la raíz
            if (linkPath === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html'))) {
                link.classList.add('active');
                return;
            }
            
            // Comprobar si la ruta actual termina con la ruta del enlace
            if (currentPath.endsWith(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // También actualizar el enlace activo cuando se hace clic en un enlace
    document.addEventListener('click', function(e) {
        if (e.target.matches('nav a')) {
            // Pequeño retraso para permitir que se complete la navegación
            setTimeout(updateActiveLink, 50);
        }
    });
});
