// SGPE - Funcionalidades de Pedidos e Historial
console.log("📋 Cargando módulo de Pedidos e Historial...");

// Funciones de Pedidos
async function listarPedidos() {
    try {
        console.log('Cargando lista de pedidos...');
        const data = await getJson(api.pedidos());
        console.log('Datos recibidos:', data);
        
        const tbody = el('#tablaPedidos tbody');
        tbody.innerHTML = '';
        
        data.forEach(pedido => {
            console.log('Procesando pedido:', pedido.id_pedido, 'Estado:', pedido.estado);
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            
            const estadoBadge = getEstadoBadge(pedido.estado);
            
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${pedido.id_pedido || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pedido.nombre_cliente || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pedido.fecha_pedido || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    ${estadoBadge}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="view-pedido text-primary-600 hover:text-primary-900 mr-3" data-id="${pedido.id_pedido}">Ver</button>
                    <button class="delete-pedido text-red-600 hover:text-red-900" data-id="${pedido.id_pedido}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tbody.querySelectorAll('.view-pedido').forEach(btn => {
            btn.addEventListener('click', (e) => openViewPedido(e.target.dataset.id));
        });
        
        tbody.querySelectorAll('.delete-pedido').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openConfirm(`¿Eliminar pedido ${e.target.dataset.id}?`, () => eliminarPedido(e.target.dataset.id));
            });
        });
        
    } catch (error) {
        toast('Error cargando pedidos: ' + error.message, 'error');
    }
}

function getEstadoBadge(estado) {
    const estados = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'en_proceso': 'bg-blue-100 text-blue-800',
        'completado': 'bg-green-100 text-green-800',
        'entregado': 'bg-green-100 text-green-800',
        'cancelado': 'bg-red-100 text-red-800'
    };
    
    const colorClass = estados[estado] || 'bg-gray-100 text-gray-800';
    return `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClass}">${estado || 'Sin estado'}</span>`;
}

function openCreatePedido() {
    // Cargar clientes y productos para el formulario
    Promise.all([
        loadClientesForSelect(),
        loadProductosForSelect()
    ]).then(([clientesOptions, productosOptions]) => {
        const html = `
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cliente <span class="text-red-500">*</span></label>
                    <select id="m_cliente" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="">-- Seleccionar cliente --</option>
                        ${clientesOptions}
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Productos</label>
                    <div id="productos-container" class="space-y-3">
                        <div class="producto-item flex space-x-3 items-end">
                            <div class="flex-1">
                                <select class="producto-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="">-- Seleccionar producto --</option>
                                    ${productosOptions}
                                </select>
                            </div>
                            <div class="w-24">
                                <input type="number" min="1" placeholder="Cantidad" class="cantidad-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                            </div>
                            <button type="button" class="remove-producto bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
      </div>
                    <button type="button" id="add-producto" class="mt-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span>Agregar Producto</span>
                    </button>
      </div>
    </div>
  `;
        
        createModal({
            title: 'Crear Pedido',
            html,
            onConfirm: async (modalEl) => {
                const clienteId = modalEl.querySelector('#m_cliente');
                
                clearValidation(modalEl);
                
                if (!clienteId.value) {
                    setInvalid(clienteId, 'Seleccione un cliente');
                    return false;
                } else {
                    setValid(clienteId);
                }
                
                // Recopilar productos
                const productos = [];
                let hasError = false;
                
                console.log('Elementos .producto-item encontrados:', modalEl.querySelectorAll('.producto-item').length);
                
                modalEl.querySelectorAll('.producto-item').forEach((item, index) => {
                    console.log(`Procesando item ${index + 1}:`, item);
                    const productoSelect = item.querySelector('.producto-select');
                    const cantidadInput = item.querySelector('.cantidad-input');
                    
                    console.log('Producto select value:', productoSelect.value);
                    console.log('Cantidad input value:', cantidadInput.value);
                    
                    if (productoSelect.value && cantidadInput.value) {
                        const cantidad = parseInt(cantidadInput.value);
                        const stock = parseInt(productoSelect.options[productoSelect.selectedIndex].getAttribute('data-stock') || 0);
                        
                        // Validar que la cantidad no exceda el stock
                        if (cantidad > stock) {
                            toast(`La cantidad (${cantidad}) excede el stock disponible (${stock}) para el producto seleccionado`, 'error');
                            hasError = true;
                            return;
                        }
                        
                        productos.push({
                            id_producto: parseInt(productoSelect.value),
                            cantidad: cantidad
                        });
                    }
                });
                
                if (hasError) {
                    return false;
                }
                
                console.log('Productos recopilados:', productos);
                console.log('Cantidad de productos:', productos.length);
                
                if (productos.length === 0) {
                    toast('Agregue al menos un producto', 'warning');
                    return false;
                }
                
                const pedidoData = {
                    id_cliente: parseInt(clienteId.value),
                    items: productos
                };
                
                console.log('Datos del pedido a enviar:', pedidoData);
                
                try {
                    await postJson(api.pedidos(), pedidoData);
                    toast('Pedido creado exitosamente', 'success');
                    listarPedidos();
                } catch (error) {
                    console.error('Error completo:', error);
                    let errorMessage = 'Error creando pedido';
                    
                    if (error.message && error.message.includes('Stock insuficiente')) {
                        errorMessage = 'Stock insuficiente para uno o más productos. Verifique las cantidades disponibles.';
                    } else if (error.message && error.message.includes('Cliente no existe')) {
                        errorMessage = 'El cliente seleccionado no existe.';
                    } else if (error.message && error.message.includes('Producto no existe')) {
                        errorMessage = 'Uno o más productos no existen.';
                    } else if (error.message) {
                        errorMessage = 'Error: ' + error.message;
                    }
                    
                    toast(errorMessage, 'error');
                    return false;
                }
            },
            onShow: (modalEl) => {
                setupProductosManagement(modalEl);
                
                const firstSelect = modalEl.querySelector('.producto-select');
                if (firstSelect) {
                    firstSelect.addEventListener('change', function() {
                        const cantidadInput = this.closest('.producto-item').querySelector('.cantidad-input');
                        const selectedOption = this.options[this.selectedIndex];
                        const stock = selectedOption.getAttribute('data-stock') || 0;
                        
                        cantidadInput.max = stock;
                        cantidadInput.placeholder = `Máximo: ${stock}`;
                        
                        // Si la cantidad actual es mayor al stock, ajustarla
                        if (parseInt(cantidadInput.value) > parseInt(stock)) {
                            cantidadInput.value = stock;
                        }
                    });
                }
    }
  });
});
}

function setupProductosManagement(modalEl) {
    const container = modalEl.querySelector('#productos-container');
    const addBtn = modalEl.querySelector('#add-producto');
    
    if (!container || !addBtn) {
        console.error('Elementos necesarios no encontrados en el modal');
        return;
    }
    
    addBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.className = 'producto-item flex space-x-3 items-end';
        newItem.innerHTML = `
            <div class="flex-1">
                <select class="producto-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">-- Seleccionar producto --</option>
                </select>
            </div>
            <div class="w-24">
                <input type="number" min="1" placeholder="Cantidad" class="cantidad-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
      </div>
            <button type="button" class="remove-producto bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        
        // Cargar opciones de productos en el nuevo select
        loadProductosForSelect().then(options => {
            const select = newItem.querySelector('.producto-select');
            select.innerHTML = '<option value="">-- Seleccionar producto --</option>' + options;
            
            select.addEventListener('change', function() {
                const cantidadInput = newItem.querySelector('.cantidad-input');
                const selectedOption = this.options[this.selectedIndex];
                const stock = selectedOption.getAttribute('data-stock') || 0;
                
                cantidadInput.max = stock;
                cantidadInput.placeholder = `Máximo: ${stock}`;
                
                // Si la cantidad actual es mayor al stock, ajustarla
                if (parseInt(cantidadInput.value) > parseInt(stock)) {
                    cantidadInput.value = stock;
                }
            });
        });
        
        container.appendChild(newItem);
    });
    
    container.addEventListener('click', (e) => {
        if (e.target.closest('.remove-producto')) {
            e.target.closest('.producto-item').remove();
        }
    });
}

async function openViewPedido(id) {
    try {
        console.log('Abriendo vista del pedido:', id);
        const pedido = await getJson(api.pedidos() + '/' + id);
        console.log('Pedido cargado:', pedido);
        
  const html = `
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-2">Información del Pedido</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div><span class="font-medium">ID:</span> ${pedido.id_pedido}</div>
                        <div><span class="font-medium">Cliente:</span> ${pedido.nombre_cliente || 'N/A'}</div>
                        <div><span class="font-medium">Fecha:</span> ${pedido.fecha_pedido || 'N/A'}</div>
                        <div><span class="font-medium">Estado:</span> ${pedido.estado || 'N/A'}</div>
                    </div>
                </div>
                
                ${pedido.productos && pedido.productos.length > 0 ? `
    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">Productos</h4>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="px-3 py-2 text-left">Producto</th>
                                        <th class="px-3 py-2 text-left">Cantidad</th>
                                        <th class="px-3 py-2 text-left">Precio Unit.</th>
                                        <th class="px-3 py-2 text-left">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${pedido.productos.map(producto => `
                                        <tr class="border-b">
                                            <td class="px-3 py-2">${producto.nombre_producto || 'N/A'}</td>
                                            <td class="px-3 py-2">${producto.cantidad || 0}</td>
                                            <td class="px-3 py-2">$${producto.precio_unitario ? producto.precio_unitario.toFixed(2) : '0.00'}</td>
                                            <td class="px-3 py-2 font-semibold">$${producto.subtotal ? producto.subtotal.toFixed(2) : '0.00'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : '<p class="text-gray-500 text-center py-4">No hay productos en este pedido</p>'}
                
                <div class="flex justify-end space-x-3 mt-6">
                    ${pedido.estado !== 'entregado' ? `
                        <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" onclick="marcarComoEntregado(${pedido.id_pedido})">
                            Marcar como Entregado
                        </button>
                    ` : ''}
                </div>
    </div>
  `;
        
        createModal({
            title: 'Detalles del Pedido',
          html,
            confirmText: 'Cerrar',
            showCancel: false,
            onConfirm: () => true,
            onShow: (modalEl) => {
                console.log('Modal de detalles del pedido mostrado');
            }
        });
    } catch (error) {
        toast('Error cargando pedido: ' + error.message, 'error');
    }
}

async function eliminarPedido(id) {
    try {
        await deleteReq(api.pedidos() + '/' + id);
        toast('Pedido eliminado exitosamente', 'success');
        listarPedidos();
    } catch (error) {
        console.error('Error eliminando pedido:', error);
        let errorMessage = 'Error eliminando pedido';
        if (error.message && error.message.includes('historial asociado')) {
            errorMessage = 'No se puede eliminar el pedido porque tiene historial asociado.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        toast(errorMessage, 'error');
    }
}

async function marcarComoEntregado(id) {
    try {
        console.log('Intentando marcar pedido como entregado:', id);
        
        // Confirmar la acción
        const confirmed = await openConfirm('¿Marcar este pedido como entregado?', () => true);
        if (!confirmed) {
            console.log('Usuario canceló la operación');
            return;
        }
        
        console.log('Enviando petición PUT a:', api.pedidos() + '/' + id + '/entregar');
        
        // Actualizar el estado del pedido
        const response = await putJson(api.pedidos() + '/' + id + '/entregar', {});
        console.log('Respuesta del servidor:', response);
        
        toast('Pedido marcado como entregado exitosamente', 'success');
        closeModal();
        listarPedidos(); // Recargar la lista
    } catch (error) {
        console.error('Error completo al marcar como entregado:', error);
        toast('Error marcando pedido como entregado: ' + error.message, 'error');
    }
}

// Funciones de Historial
async function consultarHistorial() {
    const clienteId = el('#idClienteHistorial').value;
    
    if (!clienteId) {
        toast('Ingrese un ID de cliente', 'warning');
        return;
    }
    
    try {
        // Mostrar loading
        const tbody = el('#tablaHistorial tbody');
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">Consultando...</td></tr>';
        
        const data = await getJson(api.historial(clienteId));
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                        No se encontraron entregas para este cliente
                    </td>
                </tr>
            `;
            toast('No hay entregas registradas para este cliente', 'info');
            return;
        }
        
        data.forEach(entrega => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            
            const estadoBadge = getEstadoBadge(entrega.estado_entrega);
            
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${entrega.id_entrega || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${entrega.id_pedido || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entrega.fecha_entrega || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    ${estadoBadge}
                </td>
            `;
      tbody.appendChild(tr);
        });
        
        toast(`Se encontraron ${data.length} entregas`, 'success');
    } catch (error) {
        console.error('Error consultando historial:', error);
        const tbody = el('#tablaHistorial tbody');
        
        let errorMessage = 'Error consultando historial';
        let displayMessage = 'Error al consultar el historial';
        
        // Manejo específico de errores
        if (error.message && error.message.includes('Cliente no encontrado')) {
            errorMessage = 'El cliente especificado no existe en el sistema';
            displayMessage = 'Cliente no encontrado. Verifique que el ID sea correcto.';
        } else if (error.message && error.message.includes('HTTP 404')) {
            errorMessage = 'Cliente no encontrado';
            displayMessage = 'El cliente con el ID especificado no existe.';
        } else if (error.message && error.message.includes('HTTP 500')) {
            errorMessage = 'Error interno del servidor';
            displayMessage = 'Error interno del servidor. Intente más tarde.';
        } else if (error.message) {
            errorMessage = error.message;
            displayMessage = error.message;
        }
        
        // Mostrar mensaje de error en la tabla
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-8 text-center text-red-600">
                    <div class="flex flex-col items-center space-y-2">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <span class="font-medium">${displayMessage}</span>
                    </div>
                </td>
            </tr>
        `;
        
        // Mostrar toast con el error
        toast(errorMessage, 'error');
    }
}

// Funciones auxiliares para cargar datos en selects
async function loadClientesForSelect() {
    try {
        const clientes = await getJson(api.clientes());
        return clientes.map(cliente => 
            `<option value="${cliente.id_cliente}">${cliente.nombre}</option>`
        ).join('');
    } catch (error) {
        console.error('Error cargando clientes:', error);
        return '';
    }
}

async function loadProductosForSelect() {
    try {
        const productos = await getJson(api.productos());
        return productos.map(producto => 
            `<option value="${producto.id_producto}" data-stock="${producto.stock || 0}">${producto.nombre} - $${producto.precio ? producto.precio.toFixed(2) : '0.00'} (Stock: ${producto.stock || 0})</option>`
        ).join('');
    } catch (error) {
        console.error('Error cargando productos:', error);
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pedidoBtnNew = el('#pedido_btnNew');
    if (pedidoBtnNew) {
        pedidoBtnNew.addEventListener('click', openCreatePedido);
    }
    
    const btnConsultarHistorial = el('#btnConsultarHistorial');
    if (btnConsultarHistorial) {
        btnConsultarHistorial.addEventListener('click', consultarHistorial);
    }
    
    // Enter key para consultar historial
    const idClienteHistorial = el('#idClienteHistorial');
    if (idClienteHistorial) {
        idClienteHistorial.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                consultarHistorial();
            }
        });
    }
});

console.log("✅ Módulo de Pedidos e Historial cargado");