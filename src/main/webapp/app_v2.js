// SGPE - Funcionalidades de Productos y Proveedores
console.log("📦 Cargando módulo de Productos y Proveedores...");

// Funciones de Productos
async function listarProductos() {
    try {
        const data = await getJson(api.productos());
        const tbody = el('#tablaProductos tbody');
        tbody.innerHTML = '';
        
        data.forEach(producto => {
    const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${producto.id_producto || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${producto.nombre || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">${producto.descripcion || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">$${producto.precio ? producto.precio.toFixed(2) : '0.00'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${producto.stock > 10 ? 'bg-green-100 text-green-800' : producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                        ${producto.stock || 0}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${producto.proveedor ? producto.proveedor.nombre : '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="edit-producto text-primary-600 hover:text-primary-900 mr-3" data-id="${producto.id_producto}">Editar</button>
                    <button class="delete-producto text-red-600 hover:text-red-900" data-id="${producto.id_producto}">Eliminar</button>
                </td>
            `;
    tbody.appendChild(tr);
  });
        
        tbody.querySelectorAll('.edit-producto').forEach(btn => {
            btn.addEventListener('click', (e) => openEditProducto(e.target.dataset.id));
        });
        
        tbody.querySelectorAll('.delete-producto').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openConfirm(`¿Eliminar producto ${e.target.dataset.id}?`, () => eliminarProducto(e.target.dataset.id));
            });
        });
        
    } catch (error) {
        toast('Error cargando productos: ' + error.message, 'error');
    }
}

function openCreateProducto() {
    loadProveedoresForSelect().then(proveedoresOptions => {
        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                    <input id="m_nombre" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea id="m_descripcion" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Precio <span class="text-red-500">*</span></label>
                        <input id="m_precio" type="number" step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stock <span class="text-red-500">*</span></label>
                        <input id="m_stock" type="number" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                    <select id="m_proveedor" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="">-- Seleccionar proveedor --</option>
                        ${proveedoresOptions}
                    </select>
                </div>
            </div>
        `;
        
        createModal({
            title: 'Crear Producto',
            html,
            onConfirm: async (modalEl) => {
                const nombre = modalEl.querySelector('#m_nombre');
                const descripcion = modalEl.querySelector('#m_descripcion');
                const precio = modalEl.querySelector('#m_precio');
                const stock = modalEl.querySelector('#m_stock');
                const proveedorId = modalEl.querySelector('#m_proveedor');
                
                clearValidation(modalEl);
                
                if (!nombre.value.trim()) {
                    setInvalid(nombre, 'Nombre requerido');
                    return false;
                } else {
                    setValid(nombre);
                }
                
                if (!precio.value || parseFloat(precio.value) < 0) {
                    setInvalid(precio, 'Precio válido requerido');
                    return false;
                } else {
                    setValid(precio);
                }
                
                if (!stock.value || parseInt(stock.value) < 0) {
                    setInvalid(stock, 'Stock válido requerido');
                    return false;
                } else {
                    setValid(stock);
                }
                
                const producto = {
                    nombre: nombre.value.trim(),
                    descripcion: descripcion.value.trim() || null,
                    precio: parseFloat(precio.value),
                    stock: parseInt(stock.value),
                    proveedor: proveedorId.value ? { id_proveedor: parseInt(proveedorId.value) } : null
                };
                
                try {
                    await postJson(api.productos(), producto);
                    toast('Producto creado exitosamente', 'success');
                    listarProductos();
                } catch (error) {
                    toast('Error creando producto: ' + error.message, 'error');
                    return false;
                }
            }
        });
    });
}

async function openEditProducto(id) {
    try {
        const producto = await getJson(api.productos() + '/' + id);
        const proveedoresOptions = await loadProveedoresForSelect();
        
        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                    <input id="m_nombre" value="${producto.nombre || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea id="m_descripcion" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">${producto.descripcion || ''}</textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Precio <span class="text-red-500">*</span></label>
                        <input id="m_precio" type="number" step="0.01" min="0" value="${producto.precio || 0}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stock <span class="text-red-500">*</span></label>
                        <input id="m_stock" type="number" min="0" value="${producto.stock || 0}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                    <select id="m_proveedor" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="">-- Seleccionar proveedor --</option>
                        ${proveedoresOptions}
                    </select>
                </div>
            </div>
        `;
        
        // Seleccionar proveedor actual
        setTimeout(() => {
            const select = document.querySelector('#m_proveedor');
            if (producto.proveedor) {
                select.value = producto.proveedor.id_proveedor;
            }
        }, 100);
        
        createModal({
            title: 'Editar Producto',
            html,
            onConfirm: async (modalEl) => {
                const nombre = modalEl.querySelector('#m_nombre');
                const descripcion = modalEl.querySelector('#m_descripcion');
                const precio = modalEl.querySelector('#m_precio');
                const stock = modalEl.querySelector('#m_stock');
                const proveedorId = modalEl.querySelector('#m_proveedor');
                
                clearValidation(modalEl);
                
                if (!nombre.value.trim()) {
                    setInvalid(nombre, 'Nombre requerido');
                    return false;
                } else {
                    setValid(nombre);
                }
                
                if (!precio.value || parseFloat(precio.value) < 0) {
                    setInvalid(precio, 'Precio válido requerido');
                    return false;
                } else {
                    setValid(precio);
                }
                
                if (!stock.value || parseInt(stock.value) < 0) {
                    setInvalid(stock, 'Stock válido requerido');
                    return false;
                } else {
                    setValid(stock);
                }
                
                const productoData = {
                    nombre: nombre.value.trim(),
                    descripcion: descripcion.value.trim() || null,
                    precio: parseFloat(precio.value),
                    stock: parseInt(stock.value),
                    proveedor: proveedorId.value ? { id_proveedor: parseInt(proveedorId.value) } : null
                };
                
                try {
                    await putJson(api.productos() + '/' + id, productoData);
                    toast('Producto actualizado exitosamente', 'success');
                    listarProductos();
                } catch (error) {
                    toast('Error actualizando producto: ' + error.message, 'error');
                    return false;
                }
            }
        });
    } catch (error) {
        toast('Error cargando producto: ' + error.message, 'error');
    }
}

async function eliminarProducto(id) {
    try {
        await deleteReq(api.productos() + '/' + id);
        toast('Producto eliminado exitosamente', 'success');
        listarProductos();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        let errorMessage = 'Error eliminando producto';
        if (error.message && error.message.includes('pedidos asociados')) {
            errorMessage = 'No se puede eliminar el producto porque tiene pedidos asociados. Elimine primero los pedidos relacionados.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        toast(errorMessage, 'error');
    }
}

// Funciones de Proveedores
async function listarProveedores() {
    try {
        const data = await getJson(api.proveedores());
        const tbody = el('#tablaProveedores tbody');
  tbody.innerHTML = '';
        
        data.forEach(proveedor => {
    const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${proveedor.id_proveedor || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${proveedor.nombre || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${proveedor.telefono || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${proveedor.email || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="edit-proveedor text-primary-600 hover:text-primary-900 mr-3" data-id="${proveedor.id_proveedor}">Editar</button>
                    <button class="delete-proveedor text-red-600 hover:text-red-900" data-id="${proveedor.id_proveedor}">Eliminar</button>
                </td>
            `;
    tbody.appendChild(tr);
  });
        
        tbody.querySelectorAll('.edit-proveedor').forEach(btn => {
            btn.addEventListener('click', (e) => openEditProveedor(e.target.dataset.id));
        });
        
        tbody.querySelectorAll('.delete-proveedor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openConfirm(`¿Eliminar proveedor ${e.target.dataset.id}?`, () => eliminarProveedor(e.target.dataset.id));
            });
        });
        
    } catch (error) {
        toast('Error cargando proveedores: ' + error.message, 'error');
    }
}

function openCreateProveedor() {
    const html = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                <input id="m_nombre" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
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
        title: 'Crear Proveedor',
        html,
        onConfirm: async (modalEl) => {
            const nombre = modalEl.querySelector('#m_nombre');
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
            
            const proveedor = {
                nombre: nombre.value.trim(),
                telefono: telefono.value.trim() || null,
                email: email.value.trim() || null
            };
            
            try {
                await postJson(api.proveedores(), proveedor);
                toast('Proveedor creado exitosamente', 'success');
                listarProveedores();
            } catch (error) {
                toast('Error creando proveedor: ' + error.message, 'error');
                return false;
            }
        }
    });
}

async function openEditProveedor(id) {
    try {
        const proveedor = await getJson(api.proveedores() + '/' + id);
        
        const html = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span class="text-red-500">*</span></label>
                    <input id="m_nombre" value="${proveedor.nombre || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input id="m_telefono" value="${proveedor.telefono || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input id="m_email" type="email" value="${proveedor.email || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
            </div>
        `;
        
        createModal({
            title: 'Editar Proveedor',
            html,
            onConfirm: async (modalEl) => {
                const nombre = modalEl.querySelector('#m_nombre');
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
                
                const proveedorData = {
                    nombre: nombre.value.trim(),
                    telefono: telefono.value.trim() || null,
                    email: email.value.trim() || null
                };
                
                try {
                    await putJson(api.proveedores() + '/' + id, proveedorData);
                    toast('Proveedor actualizado exitosamente', 'success');
                    listarProveedores();
                } catch (error) {
                    toast('Error actualizando proveedor: ' + error.message, 'error');
                    return false;
                }
            }
        });
    } catch (error) {
        toast('Error cargando proveedor: ' + error.message, 'error');
    }
}

async function eliminarProveedor(id) {
    try {
        await deleteReq(api.proveedores() + '/' + id);
        toast('Proveedor eliminado exitosamente', 'success');
        listarProveedores();
    } catch (error) {
        console.error('Error eliminando proveedor:', error);
        let errorMessage = 'Error eliminando proveedor';
        if (error.message && error.message.includes('productos asociados')) {
            errorMessage = 'No se puede eliminar el proveedor porque tiene productos asociados. Elimine primero los productos relacionados.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        toast(errorMessage, 'error');
    }
}

async function loadProveedoresForSelect() {
    try {
        const proveedores = await getJson(api.proveedores());
        return proveedores.map(prov => 
            `<option value="${prov.id_proveedor}">${prov.nombre}</option>`
        ).join('');
    } catch (error) {
        console.error('Error cargando proveedores:', error);
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    el('#producto_btnNew').addEventListener('click', openCreateProducto);
    el('#proveedor_btnNew').addEventListener('click', openCreateProveedor);
});

console.log("✅ Módulo de Productos y Proveedores cargado");