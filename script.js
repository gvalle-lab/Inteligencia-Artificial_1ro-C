// Datos de archivos del repositorio
const repositoryFiles = [
    {
        name: "En blanco 3.pages",
        type: ".pages",
        size: 261852,
        path: "En%20blanco%203.pages",
        icon: "📄",
        url: "https://github.com/gvalle-lab/Inteligencia-Artificial_1ro-C/blob/main/En%20blanco%203.pages"
    },
    {
        name: "En blanco 54.pdf",
        type: ".pdf",
        size: 135284,
        path: "En%20blanco%2054.pdf",
        icon: "📕",
        url: "https://github.com/gvalle-lab/Inteligencia-Artificial_1ro-C/blob/main/En%20blanco%2054.pdf"
    },
    {
        name: "En blanco 9.pdf",
        type: ".pdf",
        size: 152136,
        path: "En%20blanco%209.pdf",
        icon: "📗",
        url: "https://github.com/gvalle-lab/Inteligencia-Artificial_1ro-C/blob/main/En%20blanco%209.pdf"
    },
    {
        name: "Inteligencia_artificial.pages",
        type: ".pages",
        size: 349543,
        path: "Inteligencia_artificial.pages",
        icon: "📘",
        url: "https://github.com/gvalle-lab/Inteligencia-Artificial_1ro-C/blob/main/Inteligencia_artificial.pages"
    }
];

// Estado de la aplicación
let currentFiles = [...repositoryFiles];
let filteredFiles = [...repositoryFiles];

// Elementos del DOM
const filesContainer = document.getElementById('files-container');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const validationForm = document.getElementById('validation-form');
const validationResult = document.getElementById('validation-result');
const resultContent = document.getElementById('result-content');

// Funciones auxiliares
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileIcon(type) {
    const iconMap = {
        '.pdf': '📕',
        '.pages': '📘',
        '.docx': '📄',
        '.xlsx': '📊',
        '.txt': '📝',
        '.md': '📖'
    };
    return iconMap[type] || '📎';
}

function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';
    
    const fileIcon = file.icon || getFileIcon(file.type);
    const formattedSize = formatFileSize(file.size);
    
    card.innerHTML = `
        <div class="file-icon">${fileIcon}</div>
        <h3 class="file-name">${file.name}</h3>
        <span class="file-type">${file.type.toUpperCase().substring(1)}</span>
        <p class="file-size">📦 ${formattedSize}</p>
        <div class="file-actions">
            <a href="${file.url}" target="_blank" class="btn btn-primary btn-small">
                ↗️ Ver en GitHub
            </a>
            <button class="btn btn-secondary btn-small" onclick="copyFileInfo('${file.name}', '${file.type}', '${file.size}')">
                📋 Copiar
            </button>
        </div>
    `;
    
    return card;
}

function renderFiles(files) {
    filesContainer.innerHTML = '';
    
    if (files.length === 0) {
        filesContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <p>No se encontraron archivos con los criterios de búsqueda.</p>
            </div>
        `;
        return;
    }
    
    files.forEach(file => {
        filesContainer.appendChild(createFileCard(file));
    });
    
    updateStatistics();
}

function filterFiles() {
    const searchTerm = searchInput.value.toLowerCase();
    const fileType = filterSelect.value;
    
    filteredFiles = repositoryFiles.filter(file => {
        const matchSearch = file.name.toLowerCase().includes(searchTerm);
        const matchType = fileType === '' || file.type === fileType;
        return matchSearch && matchType;
    });
    
    renderFiles(filteredFiles);
}

function updateStatistics() {
    const totalFiles = repositoryFiles.length;
    const totalSize = repositoryFiles.reduce((sum, file) => sum + file.size, 0);
    
    // Tipo más común
    const typeCounts = {};
    repositoryFiles.forEach(file => {
        typeCounts[file.type] = (typeCounts[file.type] || 0) + 1;
    });
    const mostCommonType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0];
    
    // Archivo más grande
    const largestFile = repositoryFiles.reduce((prev, current) => 
        prev.size > current.size ? prev : current
    );
    
    // Actualizar DOM
    document.getElementById('file-count').textContent = totalFiles;
    document.getElementById('total-files').textContent = totalFiles;
    document.getElementById('total-size').textContent = formatFileSize(totalSize);
    document.getElementById('common-type').textContent = mostCommonType ? mostCommonType.toUpperCase().substring(1) : 'N/A';
    document.getElementById('largest-file').textContent = largestFile.name;
}

function copyFileInfo(name, type, size) {
    const info = `Nombre: ${name}\nTipo: ${type}\nTamaño: ${formatFileSize(size)}`;
    navigator.clipboard.writeText(info).then(() => {
        showNotification('✅ Información copiada al portapapeles');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Validación de información
function validateFileInfo(event) {
    event.preventDefault();
    
    const fileName = document.getElementById('file-name-input').value.trim();
    const fileType = document.getElementById('file-type-input').value;
    const fileSize = document.getElementById('file-size-input').value;
    
    const validation = {
        isValid: true,
        messages: [],
        warnings: [],
        errors: []
    };
    
    // Validar nombre del archivo
    if (!fileName) {
        validation.errors.push('El nombre del archivo es requerido');
        validation.isValid = false;
    } else if (fileName.length < 3) {
        validation.errors.push('El nombre debe tener al menos 3 caracteres');
        validation.isValid = false;
    } else if (fileName.length > 100) {
        validation.warnings.push('El nombre del archivo es muy largo (máximo 100 caracteres)');
    } else {
        validation.messages.push('Nombre válido');
    }
    
    // Validar tipo de archivo
    if (!fileType) {
        validation.errors.push('El tipo de archivo es requerido');
        validation.isValid = false;
    } else {
        validation.messages.push(`Tipo: ${fileType.toUpperCase().substring(1)} detectado`);
    }
    
    // Validar tamaño
    if (fileSize === '' || fileSize === null) {
        validation.warnings.push('El tamaño no fue especificado');
    } else if (isNaN(fileSize) || fileSize < 0) {
        validation.errors.push('El tamaño debe ser un número válido');
        validation.isValid = false;
    } else {
        const size = parseFloat(fileSize);
        if (size === 0) {
            validation.warnings.push('El archivo tiene tamaño cero');
        } else if (size > 1000000) {
            validation.warnings.push('El archivo es muy grande (> 1 GB)');
        }
        validation.messages.push(`Tamaño: ${formatFileSize(size * 1024)} válido`);
    }
    
    // Verificar si existe un archivo similar
    const similarFile = repositoryFiles.find(f => 
        f.name.toLowerCase().includes(fileName.toLowerCase()) || 
        (fileType && f.type === fileType)
    );
    
    if (similarFile) {
        validation.messages.push(`⚠️ Archivo similar encontrado: ${similarFile.name}`);
    }
    
    // Mostrar resultados
    displayValidationResults(validation);
}

function displayValidationResults(validation) {
    resultContent.innerHTML = '';
    
    if (validation.isValid) {
        validationResult.classList.remove('error', 'warning');
        resultContent.innerHTML = '<div class="result-item"><span class="result-icon">✅</span><strong>Información válida - El archivo cumple con todos los requisitos</strong></div>';
    } else {
        validationResult.classList.add('error');
        resultContent.innerHTML = '<div class="result-item"><span class="result-icon">❌</span><strong>Errores encontrados:</strong></div>';
    }
    
    // Mostrar mensajes
    validation.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<span class="result-icon">✅</span><span>${msg}</span>`;
        resultContent.appendChild(div);
    });
    
    // Mostrar advertencias
    validation.warnings.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<span class="result-icon">⚠️</span><span>${msg}</span>`;
        resultContent.appendChild(div);
    });
    
    // Mostrar errores
    validation.errors.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<span class="result-icon">❌</span><span>${msg}</span>`;
        resultContent.appendChild(div);
    });
    
    if (validation.warnings.length > 0 && validation.errors.length === 0) {
        validationResult.classList.add('warning');
        validationResult.classList.remove('error');
    }
    
    validationResult.classList.remove('hidden');
}

// Event Listeners
searchInput.addEventListener('input', filterFiles);
filterSelect.addEventListener('change', filterFiles);
validationForm.addEventListener('submit', validateFileInfo);

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    renderFiles(repositoryFiles);
    updateStatistics();
    
    // Actualizar fecha
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('last-update').textContent = dateStr;
});
