// Sistema de Gestión de Inventario SGPE - JavaScript Principal
console.log("🚀 SGPE - Sistema de Gestión de Inventario cargado correctamente");

// Configuración de la API
const API_BASE = location.origin + '/servergp/api';
const api = {
    clientes: () => `${API_BASE}/clientes`,
    productos: () => `${API_BASE}/productos`,
    proveedores: () => `${API_BASE}/proveedores`,
    pedidos: () => `${API_BASE}/pedidos`,
    historial: (id) => `${API_BASE}/historial/${id}`
};

// Utilidades
function el(selector) { return document.querySelector(selector); }
function elAll(selector) { return Array.from(document.querySelectorAll(selector)); }

// Sistema de notificaciones toast
function toast(message, type = 'info') {
    const container = el('#toast-container');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const toastEl = document.createElement('div');
    toastEl.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    toastEl.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(toastEl);
    
    // Animar entrada
    setTimeout(() => toastEl.classList.remove('translate-x-full'), 100);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        toastEl.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toastEl.remove(), 300);
    }, 3000);
}

// Sistema de modales
function createModal({ title = '', html, onConfirm, onShow, confirmText = 'Guardar', width = 'max-w-2xl', showCancel = true }) {
    const modalRoot = el('#modal-root');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    wrapper.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl ${width} w-full max-h-[90vh] overflow-hidden animate-bounce-in">
            <div class="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold">${title}</h3>
                    <button data-close class="text-white hover:text-gray-200 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-6 max-h-[60vh] overflow-y-auto" id="modal-body">${html}</div>
            <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                ${showCancel ? '<button data-cancel class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>' : ''}
                <button data-confirm class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">${confirmText}</button>
            </div>
        </div>
    `;
    
    modalRoot.appendChild(wrapper);
    
    if (onShow) {
        try {
            onShow(wrapper);
        } catch (error) {
            console.error('Error en onShow callback:', error);
        }
    }
    
    const closeBtn = wrapper.querySelector('[data-close]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => wrapper.remove());
    }
    
    const cancelBtn = wrapper.querySelector('[data-cancel]');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => wrapper.remove());
    }
    
    const confirmBtn = wrapper.querySelector('[data-confirm]');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            try {
                const result = await onConfirm(wrapper);
                if (result !== false) wrapper.remove();
            } catch (err) {
                toast('Error: ' + err.message, 'error');
            }
        });
    }
    
    return wrapper;
}

// Modal de confirmación
function openConfirm(message, onOk) {
    const modal = el('#confirm-modal');
    el('#confirm-msg').textContent = message || '¿Confirmar esta acción?';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    const okBtn = el('#confirm-ok');
    const cancelBtn = el('#confirm-cancel');
    
    const cleanup = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        okBtn.replaceWith(okBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    };
    
    okBtn.addEventListener('click', async () => {
        try {
            await onOk();
            toast('Operación completada', 'success');
        } catch (e) {
            toast('Error: ' + e.message, 'error');
        }
        cleanup();
    }, { once: true });
    
    cancelBtn.addEventListener('click', cleanup, { once: true });
}

// Validación de formularios
function setValid(input) {
    input.classList.remove('border-red-500', 'ring-red-500');
    input.classList.add('border-green-500', 'ring-green-500');
    const error = input.nextElementSibling;
    if (error && error.classList.contains('field-error')) {
        error.textContent = '';
    }
}

function setInvalid(input, message) {
    input.classList.remove('border-green-500', 'ring-green-500');
    input.classList.add('border-red-500', 'ring-red-500');
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('field-error')) {
        error = document.createElement('div');
        error.className = 'field-error text-sm text-red-600 mt-1';
        input.parentNode.insertBefore(error, input.nextSibling);
    }
    error.textContent = message;
}

function clearValidation(container) {
    container.querySelectorAll('.field-error').forEach(el => el.remove());
    container.querySelectorAll('input, textarea, select').forEach(input => {
        input.classList.remove('border-red-500', 'border-green-500', 'ring-red-500', 'ring-green-500');
    });
}

// Validadores
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Funciones de API
async function getJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
            const errorText = await response.text();
            if (errorText) {
                errorMessage = errorText;
            }
        } catch (e) {
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

async function postJson(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function putJson(url, data) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function deleteReq(url) {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
            const errorText = await response.text();
            if (errorText) {
                errorMessage = errorText;
            }
        } catch (e) {
        }
        throw new Error(errorMessage);
    }
}

// Funciones de navegación
function initNavigation() {
    elAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.section;
            
            elAll('.sidebar-btn').forEach(b => b.classList.remove('bg-primary-100', 'text-primary-700'));
            btn.classList.add('bg-primary-100', 'text-primary-700');
            
            // Mostrar sección
            elAll('.section').forEach(sec => sec.classList.add('hidden'));
            el(`#${target}`).classList.remove('hidden');
            
            // Cargar datos según la sección
            switch(target) {
                case 'clientes': listarClientes(); break;
                case 'productos': listarProductos(); break;
                case 'proveedores': listarProveedores(); break;
                case 'pedidos': listarPedidos(); break;
                case 'historial': break; // Se carga manualmente
            }
        });
    });
}

// Funciones de clientes
async function listarClientes() {
    try {
        const data = await getJson(api.clientes());
        const tbody = el('#tablaClientes tbody');
    tbody.innerHTML = '';
        
        data.forEach(cliente => {
      const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${cliente.id_cliente || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cliente.nombre || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.direccion || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.telefono || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.email || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="edit-cliente text-primary-600 hover:text-primary-900 mr-3" data-id="${cliente.id_cliente}">Editar</button>
                    <button class="delete-cliente text-red-600 hover:text-red-900" data-id="${cliente.id_cliente}">Eliminar</button>
                </td>
            `;
      tbody.appendChild(tr);
        });
        
        tbody.querySelectorAll('.edit-cliente').forEach(btn => {
            btn.addEventListener('click', (e) => openEditCliente(e.target.dataset.id));
        });
        
        tbody.querySelectorAll('.delete-cliente').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clienteId = e.target.dataset.id;
                const clienteNombre = e.target.closest('tr').querySelector('td:nth-child(2)').textContent;
                openConfirmWithOptions(
                    `¿Eliminar cliente "${clienteNombre}"?`,
                    [
                        { text: 'Eliminar Normal', action: () => eliminarCliente(clienteId), class: 'bg-red-600 hover:bg-red-700' },
                        { text: 'Eliminar Forzado', action: () => eliminarClienteForzado(clienteId), class: 'bg-orange-600 hover:bg-orange-700' }
                    ]
                );
            });
        });
        
    } catch (error) {
        toast('Error cargando clientes: ' + error.message, 'error');
    }
}

function openCreateCliente() {
    const html = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                <input id="m_nombre" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input id="m_direccion" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input id="m_telefono" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="m_email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
        </div>
    `;
    
    createModal({
        title: 'Crear Cliente',
        html,
        onConfirm: async (modalEl) => {
            const nombre = modalEl.querySelector('#m_nombre');
            const direccion = modalEl.querySelector('#m_direccion');
            const telefono = modalEl.querySelector('#m_telefono');
            const email = modalEl.querySelector('#m_email');
            
            clearValidation(modalEl);
            
            if (!nombre.value.trim()) {
                setInvalid(nombre, 'Nombre requerido');
                return false;
            } else {
                setValid(nombre);
            }
            
            if (email.value.trim() && !isValidEmail(email.value.trim())) {
                setInvalid(email, 'Email inválido');
                return false;
            } else if (email.value.trim()) {
                setValid(email);
            }
            
            const cliente = {
                nombre: nombre.value.trim(),
                direccion: direccion.value.trim() || null,
                telefono: telefono.value.trim() || null,
                email: email.value.trim() || null
            };
            
            try {
                await postJson(api.clientes(), cliente);
                toast('Cliente creado exitosamente', 'success');
                listarClientes();
            } catch (error) {
                toast('Error creando cliente: ' + error.message, 'error');
                return false;
            }
        }
    });
}

async function openEditCliente(id) {
    try {
        const cliente = await getJson(api.clientes() + '/' + id);
        
        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                    <input id="m_nombre" value="${cliente.nombre || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input id="m_direccion" value="${cliente.direccion || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input id="m_telefono" value="${cliente.telefono || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input id="m_email" type="email" value="${cliente.email || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
            </div>
        `;
        
        createModal({
            title: 'Editar Cliente',
            html,
            onConfirm: async (modalEl) => {
                const nombre = modalEl.querySelector('#m_nombre');
                const direccion = modalEl.querySelector('#m_direccion');
                const telefono = modalEl.querySelector('#m_telefono');
                const email = modalEl.querySelector('#m_email');
                
                clearValidation(modalEl);
                
                if (!nombre.value.trim()) {
                    setInvalid(nombre, 'Nombre requerido');
                    return false;
                } else {
                    setValid(nombre);
                }
                
                if (email.value.trim() && !isValidEmail(email.value.trim())) {
                    setInvalid(email, 'Email inválido');
                    return false;
                } else if (email.value.trim()) {
                    setValid(email);
                }
                
                const clienteData = {
                    nombre: nombre.value.trim(),
                    direccion: direccion.value.trim() || null,
                    telefono: telefono.value.trim() || null,
                    email: email.value.trim() || null
                };
                
                try {
                    await putJson(api.clientes() + '/' + id, clienteData);
                    toast('Cliente actualizado exitosamente', 'success');
                    listarClientes();
                } catch (error) {
                    toast('Error actualizando cliente: ' + error.message, 'error');
                    return false;
                }
            }
        });
    } catch (error) {
        toast('Error cargando cliente: ' + error.message, 'error');
    }
}

async function eliminarCliente(id) {
    try {
        await deleteReq(api.clientes() + '/' + id);
        toast('Cliente eliminado exitosamente', 'success');
        listarClientes();
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        let errorMessage = 'Error eliminando cliente';
        
        if (error.message && error.message.includes('HTTP 409')) {
            errorMessage = 'No se puede eliminar el cliente porque tiene pedidos asociados. Use "Eliminar Forzado" para eliminar también los pedidos.';
        } else if (error.message && error.message.includes('pedidos asociados')) {
            errorMessage = 'No se puede eliminar el cliente porque tiene pedidos asociados. Use "Eliminar Forzado" para eliminar también los pedidos.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        toast(errorMessage, 'error');
    }
}

async function eliminarClienteForzado(id) {
    try {
        await deleteReq(api.clientes() + '/' + id + '/forzar');
        toast('Cliente y pedidos asociados eliminados exitosamente', 'success');
        listarClientes();
    } catch (error) {
        console.error('Error eliminando cliente forzado:', error);
        toast('Error eliminando cliente: ' + error.message, 'error');
    }
}

function openConfirmWithOptions(message, options) {
    const modalRoot = el('#modal-root');
    const wrapper = document.createElement('div');
    wrapper.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    wrapper.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">${message}</h3>
            <div class="flex flex-col space-y-2">
                ${options.map(option => `
                    <button class="px-4 py-2 text-white rounded-md transition-colors ${option.class}" data-action="${option.text}">
                        ${option.text}
                    </button>
                `).join('')}
                <button class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors" data-action="cancel">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    modalRoot.appendChild(wrapper);
    
    wrapper.addEventListener('click', (e) => {
        if (e.target.dataset.action) {
            const action = e.target.dataset.action;
            if (action === 'cancel') {
                modalRoot.removeChild(wrapper);
            } else {
                const option = options.find(opt => opt.text === action);
                if (option) {
                    option.action();
                    modalRoot.removeChild(wrapper);
                }
            }
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Inicializando SGPE...');
    
    initNavigation();
    
    el('#cliente_btnNew').addEventListener('click', openCreateCliente);
    el('#btn-refresh').addEventListener('click', () => {
        const activeSection = el('.sidebar-btn.bg-primary-100')?.dataset.section;
        if (activeSection) {
            switch(activeSection) {
                case 'clientes': listarClientes(); break;
                case 'productos': listarProductos(); break;
                case 'proveedores': listarProveedores(); break;
                case 'pedidos': listarPedidos(); break;
            }
        }
        toast('Datos actualizados', 'success');
    });
    
    // Cargar datos iniciales
    listarClientes();
    
    console.log('✅ SGPE inicializado correctamente');
});