
const ctx = location.origin + '/servergp';
const api = {
  estudiantes: () => `${ctx}/api/estudiantes`,
  docentes: () => `${ctx}/api/docentes`,
  proyectos: () => `${ctx}/api/proyectos`,
  actividades: () => `${ctx}/api/actividades`,
  entregables: () => `${ctx}/api/entregables`,
  upload: () => `${ctx}/api/upload`
};

// --- Utils ---
function el(q){ return document.querySelector(q); }
function elAll(q){ return Array.from(document.querySelectorAll(q)); }
function toast(msg, type='info'){ // type: success, error, info
  const c = document.getElementById('toast-container');
  const color = type==='success' ? 'bg-green-600' : type==='error' ? 'bg-red-600' : 'bg-indigo-600';
  const div = document.createElement('div');
  div.className = `${color} text-white px-4 py-2 rounded shadow-lg`;
  div.style.minWidth = '200px';
  div.innerText = msg;
  c.appendChild(div);
  setTimeout(()=> div.classList.add('opacity-0'), 2500);
  setTimeout(()=> div.remove(), 3000);
}
function formatDate(d){ if(!d) return ''; return d.split('.')[0].replace('T',' '); }

// --- Modal system (reusable) ---
const modalRoot = el('#modal-root');

function createModal({title='', html, onConfirm, confirmText='Guardar', width='w-2/3'}) {
  // backdrop + modal structure
  const wrapper = document.createElement('div');
  wrapper.className = 'fixed inset-0 flex items-start justify-center z-40';
  wrapper.style.paddingTop = '6vh';
  wrapper.innerHTML = `
    <div class="absolute inset-0 bg-black opacity-40"></div>
    <div class="bg-white rounded-lg shadow-lg z-50 ${width}" role="dialog" aria-modal="true">
      <div class="p-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">${title}</h3>
        <button data-close class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>
      <div class="p-4" id="modal-body">${html}</div>
      <div class="p-4 border-t flex justify-end gap-3">
        <button data-cancel class="px-3 py-2 rounded bg-gray-100">Cancelar</button>
        <button data-confirm class="px-3 py-2 rounded bg-indigo-600 text-white">${confirmText}</button>
      </div>
    </div>
  `;
  modalRoot.appendChild(wrapper);
  // handlers
  wrapper.querySelector('[data-close]').addEventListener('click', ()=> wrapper.remove());
  wrapper.querySelector('[data-cancel]').addEventListener('click', ()=> wrapper.remove());
  wrapper.querySelector('[data-confirm]').addEventListener('click', async ()=>{
    try{
      const res = await onConfirm(wrapper);
      if(res !== false){ wrapper.remove(); }
    }catch(err){ toast('Error: '+err, 'error'); }
  });
  return wrapper;
}

// Confirm deletion modal
function openConfirm(msg, onOk){
  const cm = el('#confirm-modal');
  el('#confirm-msg').innerText = msg || '¿Confirmar?';
  cm.classList.remove('hidden'); cm.classList.add('flex');
  const ok = el('#confirm-ok'), cancel = el('#confirm-cancel');
  const cleanup = ()=> { cm.classList.add('hidden'); cm.classList.remove('flex'); ok.replaceWith(ok.cloneNode(true)); cancel.replaceWith(cancel.cloneNode(true)); };
  ok.addEventListener('click', async ()=>{
    try{ await onOk(); toast('Eliminado', 'success'); } catch(e){ toast('Error eliminando', 'error'); }
    cleanup();
  }, {once:true});
  cancel.addEventListener('click', ()=> cleanup(), {once:true});
}

// --- Client-side validation helpers ---
function setValid(input){ input.classList.remove('border-red-500'); input.classList.add('border-green-500'); const err = input.nextElementSibling; if(err && err.classList.contains('field-error')) err.innerText=''; }
function setInvalid(input, msg){ input.classList.remove('border-green-500'); input.classList.add('border-red-500'); let err = input.nextElementSibling; if(!err || !err.classList.contains('field-error')){ err = document.createElement('div'); err.className='field-error text-sm text-red-600 mt-1'; input.parentNode.insertBefore(err, input.nextSibling); } err.innerText = msg; }
function clearValidation(container){ container.querySelectorAll('.field-error').forEach(n=>n.remove()); container.querySelectorAll('input,textarea,select').forEach(i=>{ i.classList.remove('border-red-500','border-green-500'); }); }

// simple validators
function isEmail(str){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str); }

// --- Fetch helpers ---
async function getJson(url){ const r = await fetch(url); if(!r.ok) throw r.status; return r.json(); }
async function postJson(url, data){ const r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}); if(!r.ok) throw await r.text(); return r.json(); }
async function putJson(url, data){ const r = await fetch(url, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}); if(!r.ok) throw await r.text(); return r.json(); }
async function delReq(url){ const r = await fetch(url, {method:'DELETE'}); if(!r.ok) throw r.status; return; }

// --- Rendering lists (reuse from previous app_v2 but with modals) ---
async function listarEstudiantes(){
  try{
    const data = await getJson(api.estudiantes());
    const tbody = el('#tablaEstudiantes tbody'); tbody.innerHTML='';
    data.forEach(e=>{
      const tr = document.createElement('tr');
      tr.className='hover:bg-gray-50';
      tr.innerHTML = `<td class="p-2">${e.id_estudiante||''}</td><td class="p-2">${e.nombre||''}</td><td class="p-2">${e.correo||''}</td><td class="p-2">${e.programa_academico||''}</td>
        <td class="p-2">
          <button class="edit text-indigo-600 mr-2" data-id="${e.id_estudiante}">Editar</button>
          <button class="del text-red-600" data-id="${e.id_estudiante}">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
    // attach handlers
    tbody.querySelectorAll('.edit').forEach(b=> b.addEventListener('click', openEditEstudiante));
    tbody.querySelectorAll('.del').forEach(b=> b.addEventListener('click', ev=> {
      const id = ev.target.dataset.id;
      openConfirm('Eliminar estudiante ID '+id+'?', async ()=>{ await delReq(api.estudiantes() + '/' + id); listarEstudiantes(); });
    }));
  }catch(e){ toast('Error cargando estudiantes','error'); }
}

// New estudiante modal (create)
document.getElementById('est_btnNew').addEventListener('click', ()=>{
  const html = `
    <div>
      <label class="block mb-1">Nombre <span class="text-red-600">*</span></label>
      <input id="m_nombre" class="w-full border p-2 rounded" />
      <label class="block mt-3 mb-1">Correo <span class="text-red-600">*</span></label>
      <input id="m_correo" class="w-full border p-2 rounded" />
      <label class="block mt-3 mb-1">Programa</label>
      <input id="m_programa" class="w-full border p-2 rounded" />
    </div>
  `;
  createModal({
    title: 'Crear estudiante',
    html,
    onConfirm: async (modalEl) => {
      const nombre = modalEl.querySelector('#m_nombre');
      const correo = modalEl.querySelector('#m_correo');
      const programa = modalEl.querySelector('#m_programa');
      clearValidation(modalEl);
      if(!nombre.value.trim()){ setInvalid(nombre, 'Nombre requerido'); return false; } else setValid(nombre);
      if(!correo.value.trim() || !isEmail(correo.value.trim())){ setInvalid(correo, 'Correo inválido'); return false; } else setValid(correo);
      const body = { nombre: nombre.value.trim(), correo: correo.value.trim(), programa_academico: programa.value.trim() || null };
      try{ await postJson(api.estudiantes(), body); toast('Estudiante creado','success'); listarEstudiantes(); } catch(err){ toast('Error creando','error'); return false; }
    }
  });
});

// Edit estudiante modal
async function openEditEstudiante(ev){
  const id = ev.target.dataset.id;
  try{
    const e = await getJson(api.estudiantes() + '/' + id);
    const html = `
      <div>
        <label class="block mb-1">Nombre <span class="text-red-600">*</span></label>
        <input id="m_nombre" value="${e.nombre||''}" class="w-full border p-2 rounded" />
        <label class="block mt-3 mb-1">Correo <span class="text-red-600">*</span></label>
        <input id="m_correo" value="${e.correo||''}" class="w-full border p-2 rounded" />
        <label class="block mt-3 mb-1">Programa</label>
        <input id="m_programa" value="${e.programa_academico||''}" class="w-full border p-2 rounded" />
      </div>
    `;
    createModal({
      title: 'Editar estudiante',
      html,
      onConfirm: async (modalEl) => {
        const nombre = modalEl.querySelector('#m_nombre');
        const correo = modalEl.querySelector('#m_correo');
        const programa = modalEl.querySelector('#m_programa');
        clearValidation(modalEl);
        if(!nombre.value.trim()){ setInvalid(nombre, 'Nombre requerido'); return false; } else setValid(nombre);
        if(!correo.value.trim() || !isEmail(correo.value.trim())){ setInvalid(correo, 'Correo inválido'); return false; } else setValid(correo);
        const body = { nombre: nombre.value.trim(), correo: correo.value.trim(), programa_academico: programa.value.trim() || null };
        try{ await putJson(api.estudiantes() + '/' + id, body); toast('Estudiante actualizado','success'); listarEstudiantes(); } catch(err){ toast('Error actualizando','error'); return false; }
      }
    });
  }catch(e){ toast('Error cargando estudiante','error'); }
}

// --- Docentes: modal create/edit similar pattern ---
document.getElementById('doc_btnNew').addEventListener('click', ()=>{
  const html = `
    <div>
      <label class="block mb-1">Nombre <span class="text-red-600">*</span></label>
      <input id="m_nombre" class="w-full border p-2 rounded" />
      <label class="block mt-3 mb-1">Correo</label>
      <input id="m_correo" class="w-full border p-2 rounded" />
      <label class="block mt-3 mb-1">Área</label>
      <input id="m_area" class="w-full border p-2 rounded" />
    </div>
  `;
  createModal({
    title: 'Crear docente',
    html,
    onConfirm: async (modalEl) => {
      const nombre = modalEl.querySelector('#m_nombre');
      const correo = modalEl.querySelector('#m_correo');
      const area = modalEl.querySelector('#m_area');
      clearValidation(modalEl);
      if(!nombre.value.trim()){ setInvalid(nombre,'Nombre requerido'); return false; } else setValid(nombre);
      if(correo.value.trim() && !isEmail(correo.value.trim())){ setInvalid(correo,'Correo inválido'); return false; } else if(correo.value.trim()) setValid(correo);
      const body = { nombre: nombre.value.trim(), correo: correo.value.trim() || null, area: area.value.trim() || null };
      try{ await postJson(api.docentes(), body); toast('Docente creado','success'); listarDocentes(); listarProyectos(); }catch(e){ toast('Error creando docente','error'); return false; }
    }
  });
});

async function listarDocentes(){
  try{
    const data = await getJson(api.docentes());
    const tbody = el('#tablaDocentes tbody'); tbody.innerHTML='';
    const sel = el('#proy_docente');
    if(sel) sel.innerHTML = '<option value="">-- Seleccione docente --</option>';
    data.forEach(d=>{
      const tr = document.createElement('tr');
      tr.className='hover:bg-gray-50';
      tr.innerHTML = `<td class="p-2">${d.id_docente||''}</td><td class="p-2">${d.nombre||''}</td><td class="p-2">${d.correo||''}</td><td class="p-2">${d.area||''}</td>
        <td class="p-2"><button class="edit-doc text-indigo-600 mr-2" data-id="${d.id_docente}">Editar</button><button class="del-doc text-red-600" data-id="${d.id_docente}">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.del-doc').forEach(b=> b.addEventListener('click', ev=>{
      const id = ev.target.dataset.id;
      openConfirm('Eliminar docente ID '+id+'?', async ()=>{ await delReq(api.docentes() + '/' + id); listarDocentes(); listarProyectos(); });
    }));
    tbody.querySelectorAll('.edit-doc').forEach(b=> b.addEventListener('click', async (ev)=>{
      const id = ev.target.dataset.id;
      try{
        const d = await getJson(api.docentes() + '/' + id);
        const html = `<div>
          <label class="block mb-1">Nombre</label><input id="m_nombre" value="${d.nombre||''}" class="w-full border p-2 rounded" />
          <label class="block mt-3 mb-1">Correo</label><input id="m_correo" value="${d.correo||''}" class="w-full border p-2 rounded" />
          <label class="block mt-3 mb-1">Área</label><input id="m_area" value="${d.area||''}" class="w-full border p-2 rounded" />
        </div>`;
        createModal({
          title: 'Editar docente',
          html,
          onConfirm: async (modalEl)=>{
            const nombre = modalEl.querySelector('#m_nombre'), correo = modalEl.querySelector('#m_correo'), area = modalEl.querySelector('#m_area');
            clearValidation(modalEl);
            if(!nombre.value.trim()){ setInvalid(nombre,'Nombre requerido'); return false; } else setValid(nombre);
            if(correo.value.trim() && !isEmail(correo.value.trim())){ setInvalid(correo,'Correo inválido'); return false; } else if(correo.value.trim()) setValid(correo);
            const body = { nombre: nombre.value.trim(), correo: correo.value.trim() || null, area: area.value.trim() || null };
            try{ await putJson(api.docentes() + '/' + id, body); toast('Docente actualizado','success'); listarDocentes(); listarProyectos(); } catch(e){ toast('Error actualizando','error'); return false; }
          }
        });
      }catch(e){ toast('Error','error'); }
    }));
  }catch(e){ toast('Error cargando docentes','error'); }
}

// --- Proyectos (create/edit) ---
document.getElementById('proy_btnNew').addEventListener('click', async ()=>{
  // need docentes to choose
  const docentes = await getJson(api.docentes());
  const options = docentes.map(d=>`<option value="${d.id_docente}">${d.nombre}</option>`).join('');
  const html = `<div>
    <label class="block mb-1">Nombre <span class="text-red-600">*</span></label><input id="m_nombre" class="w-full border p-2 rounded" />
    <div class="grid grid-cols-2 gap-2 mt-3">
      <div>
        <label class="block mb-1">Fecha inicio</label><input id="m_inicio" type="date" class="w-full border p-2 rounded" />
      </div>
      <div><label class="block mb-1">Fecha fin</label><input id="m_fin" type="date" class="w-full border p-2 rounded" /></div>
    </div>
    <label class="block mt-3 mb-1">Docente</label><select id="m_docente" class="w-full border p-2 rounded"><option value=''>-- Ninguno --</option>${options}</select>
    <label class="block mt-3 mb-1">Descripción</label><textarea id="m_desc" class="w-full border p-2 rounded"></textarea>
  </div>`;
  createModal({
    title: 'Crear proyecto',
    html,
    onConfirm: async (modalEl)=>{
      const nombre = modalEl.querySelector('#m_nombre'), inicio = modalEl.querySelector('#m_inicio'), fin = modalEl.querySelector('#m_fin'), docente = modalEl.querySelector('#m_docente'), desc = modalEl.querySelector('#m_desc');
      clearValidation(modalEl);
      if(!nombre.value.trim()){ setInvalid(nombre,'Nombre requerido'); return false; } else setValid(nombre);
      const body = { nombre: nombre.value.trim(), fecha_inicio: inicio.value || null, fecha_fin: fin.value || null, descripcion: desc.value.trim() || null, docente: docente.value ? { id_docente: Number(docente.value) } : null };
      try{ await postJson(api.proyectos(), body); toast('Proyecto creado','success'); listarProyectos(); }catch(e){ toast('Error creando proyecto','error'); return false; }
    }
  });
});

async function listarProyectos(){
  try{
    const data = await getJson(api.proyectos());
    const tbody = el('#tablaProyectos tbody'); tbody.innerHTML='';
    data.forEach(p=>{
      const tr = document.createElement('tr'); tr.className='hover:bg-gray-50';
      tr.innerHTML = `<td class="p-2">${p.id_proyecto||''}</td><td class="p-2">${p.nombre||''}</td><td class="p-2">${p.docente? p.docente.nombre : ''}</td><td class="p-2">${p.fecha_inicio||''}</td><td class="p-2">${p.fecha_fin||''}</td>
        <td class="p-2"><button class="edit-proy text-indigo-600 mr-2" data-id="${p.id_proyecto}">Editar</button><button class="del-proy text-red-600" data-id="${p.id_proyecto}">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.del-proy').forEach(b=> b.addEventListener('click', ev=> {
      const id = ev.target.dataset.id;
      openConfirm('Eliminar proyecto ID '+id+'?', async ()=>{ await delReq(api.proyectos() + '/' + id); listarProyectos(); });
    }));
    tbody.querySelectorAll('.edit-proy').forEach(b=> b.addEventListener('click', async ev=>{
      const id = ev.target.dataset.id;
      try{
        const p = await getJson(api.proyectos() + '/' + id);
        const docentes = await getJson(api.docentes());
        const options = docentes.map(d=>`<option value="${d.id_docente}" ${p.docente && p.docente.id_docente===d.id_docente ? 'selected' : ''}>${d.nombre}</option>`).join('');
        const html = `<div>
          <label class="block mb-1">Nombre</label><input id="m_nombre" value="${p.nombre||''}" class="w-full border p-2 rounded" />
          <div class="grid grid-cols-2 gap-2 mt-3"><div><label class="block mb-1">Fecha inicio</label><input id="m_inicio" type="date" value="${p.fecha_inicio||''}" class="w-full border p-2 rounded" /></div><div><label class="block mb-1">Fecha fin</label><input id="m_fin" type="date" value="${p.fecha_fin||''}" class="w-full border p-2 rounded" /></div></div>
          <label class="block mt-3 mb-1">Docente</label><select id="m_docente" class="w-full border p-2 rounded"><option value=''>-- Ninguno --</option>${options}</select>
          <label class="block mt-3 mb-1">Descripción</label><textarea id="m_desc" class="w-full border p-2 rounded">${p.descripcion||''}</textarea>
        </div>`;
        createModal({
          title: 'Editar proyecto',
          html,
          onConfirm: async (modalEl)=>{
            const nombre = modalEl.querySelector('#m_nombre'), inicio = modalEl.querySelector('#m_inicio'), fin = modalEl.querySelector('#m_fin'), docente = modalEl.querySelector('#m_docente'), desc = modalEl.querySelector('#m_desc');
            clearValidation(modalEl);
            if(!nombre.value.trim()){ setInvalid(nombre,'Nombre requerido'); return false; } else setValid(nombre);
            const body = { nombre: nombre.value.trim(), fecha_inicio: inicio.value || null, fecha_fin: fin.value || null, descripcion: desc.value.trim() || null, docente: docente.value ? { id_docente: Number(docente.value) } : null };
            try{ await putJson(api.proyectos() + '/' + id, body); toast('Proyecto actualizado','success'); listarProyectos(); }catch(e){ toast('Error actualizando','error'); return false; }
          }
        });
      }catch(e){ toast('Error cargando proyecto','error'); }
    }));
  }catch(e){ toast('Error cargando proyectos','error'); }
}

// --- Actividades ---
document.getElementById('act_btnNew').addEventListener('click', async ()=>{
  const proyectos = await getJson(api.proyectos());
  const options = proyectos.map(p=>`<option value="${p.id_proyecto}">${p.nombre}</option>`).join('');
  const html = `<div>
    <label class="block mb-1">Nombre <span class="text-red-600">*</span></label><input id="m_nombre" class="w-full border p-2 rounded" />
    <label class="block mt-3 mb-1">Proyecto <span class="text-red-600">*</span></label><select id="m_proyecto" class="w-full border p-2 rounded"><option value=''>-- Seleccione --</option>${options}</select>
    <label class="block mt-3 mb-1">Fecha entrega</label><input id="m_entrega" type="date" class="w-full border p-2 rounded" />
    <label class="block mt-3 mb-1">Descripción</label><textarea id="m_desc" class="w-full border p-2 rounded"></textarea>
  </div>`;
  createModal({
    title: 'Crear actividad',
    html,
    onConfirm: async (modalEl)=>{
      const nombre = modalEl.querySelector('#m_nombre'), proyecto = modalEl.querySelector('#m_proyecto'), entrega = modalEl.querySelector('#m_entrega'), desc = modalEl.querySelector('#m_desc');
      clearValidation(modalEl);
      if(!nombre.value.trim()){ setInvalid(nombre,'Nombre requerido'); return false; } else setValid(nombre);
      if(!proyecto.value){ setInvalid(proyecto,'Seleccione un proyecto'); return false; } else setValid(proyecto);
      const body = { nombre: nombre.value.trim(), fecha_entrega: entrega.value || null, descripcion: desc.value.trim() || null, proyecto: { id_proyecto: Number(proyecto.value) } };
      try{ await postJson(api.actividades(), body); toast('Actividad creada','success'); listarActividades(); }catch(e){ toast('Error creando actividad','error'); return false; }
    }
  });
});

async function listarActividades(){
  try{
    const data = await getJson(api.actividades());
    const tbody = el('#tablaActividades tbody'); tbody.innerHTML='';
    data.forEach(a=>{
      const tr = document.createElement('tr'); tr.className='hover:bg-gray-50';
      tr.innerHTML = `<td class="p-2">${a.id_actividad||''}</td><td class="p-2">${a.nombre||''}</td><td class="p-2">${a.proyecto? a.proyecto.nombre : ''}</td><td class="p-2">${a.fecha_entrega||''}</td>
        <td class="p-2"><button class="edit-act text-indigo-600 mr-2" data-id="${a.id_actividad}">Editar</button><button class="del-act text-red-600" data-id="${a.id_actividad}">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.del-act').forEach(b=> b.addEventListener('click', ev=> {
      const id = ev.target.dataset.id;
      openConfirm('Eliminar actividad ID '+id+'?', async ()=>{ await delReq(api.actividades() + '/' + id); listarActividades(); });
    }));
    tbody.querySelectorAll('.edit-act').forEach(b=> b.addEventListener('click', async ev=>{
      const id = ev.target.dataset.id;
      try{
        const a = await getJson(api.actividades() + '/' + id);
        const proyectos = await getJson(api.proyectos());
        const options = proyectos.map(p=>`<option value="${p.id_proyecto}" ${a.proyecto && a.proyecto.id_proyecto===p.id_proyecto ? 'selected':''}>${p.nombre}</option>`).join('');
        const html = `<div>
          <label class="block mb-1">Nombre</label><input id="m_nombre" value="${a.nombre||''}" class="w-full border p-2 rounded" />
          <label class="block mt-3 mb-1">Proyecto</label><select id="m_proyecto" class="w-full border p-2 rounded">${options}</select>
          <label class="block mt-3 mb-1">Fecha entrega</label><input id="m_entrega" type="date" value="${a.fecha_entrega||''}" class="w-full border p-2 rounded" />
          <label class="block mt-3 mb-1">Descripción</label><textarea id="m_desc" class="w-full border p-2 rounded">${a.descripcion||''}</textarea>
        </div>`;
        createModal({
          title: 'Editar actividad',
          html,
          onConfirm: async (modalEl)=>{
            const nombre = modalEl.querySelector('#m_nombre'), proyecto = modalEl.querySelector('#m_proyecto'), entrega = modalEl.querySelector('#m_entrega'), desc = modalEl.querySelector('#m_desc');
            clearValidation(modalEl);
            if(!nombre.value.trim()){ setInvalid(nombre,'Nombre requerido'); return false; } else setValid(nombre);
            if(!proyecto.value){ setInvalid(proyecto,'Seleccione proyecto'); return false; } else setValid(proyecto);
            const body = { nombre: nombre.value.trim(), fecha_entrega: entrega.value || null, descripcion: desc.value.trim() || null, proyecto: { id_proyecto: Number(proyecto.value) } };
            try{ await putJson(api.actividades() + '/' + id, body); toast('Actividad actualizada','success'); listarActividades(); }catch(e){ toast('Error actualizando','error'); return false; }
          }
        });
      }catch(e){ toast('Error cargando actividad','error'); }
    }));
  }catch(e){ toast('Error cargando actividades','error'); }
}

// --- Entregables (create/edit) ---
document.getElementById('ent_btnNew').addEventListener('click', async ()=>{
  const estudiantes = await getJson(api.estudiantes());
  const actividades = await getJson(api.actividades());
  const optsEst = estudiantes.map(s=>`<option value="${s.id_estudiante}">${s.nombre}</option>`).join('');
  const optsAct = actividades.map(a=>`<option value="${a.id_actividad}">${a.nombre}</option>`).join('');
  const html = `<div>
    <label class="block mb-1">Estudiante <span class="text-red-600">*</span></label><select id="m_est" class="w-full border p-2 rounded">${optsEst}</select>
    <label class="block mt-3 mb-1">Actividad <span class="text-red-600">*</span></label><select id="m_act" class="w-full border p-2 rounded">${optsAct}</select>
    <label class="block mt-3 mb-1">Estado</label><select id="m_estado" class="w-full border p-2 rounded"><option value="pendiente">pendiente</option><option value="en progreso">en progreso</option><option value="entregado">entregado</option></select>
    <label class="block mt-3 mb-1">Archivo (URL)</label><input id="m_arch" class="w-full border p-2 rounded" />
  </div>`;
  createModal({
    title: 'Crear entregable',
    html,
    onConfirm: async (modalEl)=>{
      const est = modalEl.querySelector('#m_est'), act = modalEl.querySelector('#m_act'), estado = modalEl.querySelector('#m_estado'), arch = modalEl.querySelector('#m_arch');
      clearValidation(modalEl);
      if(!est.value){ setInvalid(est,'Seleccione estudiante'); return false; } else setValid(est);
      if(!act.value){ setInvalid(act,'Seleccione actividad'); return false; } else setValid(act);
      const body = { estudiante: { id_estudiante: Number(est.value) }, actividad: { id_actividad: Number(act.value) }, estado: estado.value, archivoUrl: arch.value.trim() || null };
      try{ await postJson(api.entregables(), body); toast('Entregable creado','success'); listarEntregables(); }catch(e){ toast('Error creando entregable','error'); return false; }
    }
  });
});

async function listarEntregables(){
  try{
    const data = await getJson(api.entregables());
    const tbody = el('#tablaEntregables tbody'); tbody.innerHTML='';
    data.forEach(en=>{
      const tr = document.createElement('tr'); tr.className='hover:bg-gray-50';
      tr.innerHTML = `<td class="p-2">${en.id_entregable||''}</td><td class="p-2">${en.estudiante? en.estudiante.nombre : ''}</td><td class="p-2">${en.actividad? en.actividad.nombre : ''}</td><td class="p-2">${en.estado||''}</td><td class="p-2">${formatDate(en.fecha_subida||'')}</td>
        <td class="p-2"><button class="edit-en text-indigo-600 mr-2" data-id="${en.id_entregable}">Editar</button><button class="del-en text-red-600" data-id="${en.id_entregable}">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.del-en').forEach(b=> b.addEventListener('click', ev=>{
      const id = ev.target.dataset.id;
      openConfirm('Eliminar entregable ID '+id+'?', async ()=>{ await delReq(api.entregables() + '/' + id); listarEntregables(); });
    }));
    tbody.querySelectorAll('.edit-en').forEach(b=> b.addEventListener('click', async ev=>{
      const id = ev.target.dataset.id;
      try{
        const en = await getJson(api.entregables() + '/' + id);
        const estudiantes = await getJson(api.estudiantes());
        const actividades = await getJson(api.actividades());
        const optsEst = estudiantes.map(s=>`<option value="${s.id_estudiante}" ${en.estudiante && en.estudiante.id_estudiante===s.id_estudiante ? 'selected':''}>${s.nombre}</option>`).join('');
        const optsAct = actividades.map(a=>`<option value="${a.id_actividad}" ${en.actividad && en.actividad.id_actividad===a.id_actividad ? 'selected':''}>${a.nombre}</option>`).join('');
        const html = `<div>
          <label class="block mb-1">Estudiante</label><select id="m_est" class="w-full border p-2 rounded">${optsEst}</select>
          <label class="block mt-3 mb-1">Actividad</label><select id="m_act" class="w-full border p-2 rounded">${optsAct}</select>
          <label class="block mt-3 mb-1">Estado</label><select id="m_estado" class="w-full border p-2 rounded"><option value="pendiente" ${en.estado==='pendiente'?'selected':''}>pendiente</option><option value="en progreso" ${en.estado==='en progreso'?'selected':''}>en progreso</option><option value="entregado" ${en.estado==='entregado'?'selected':''}>entregado</option></select>
          <label class="block mt-3 mb-1">Archivo (URL)</label><input id="m_arch" value="${en.archivoUrl||''}" class="w-full border p-2 rounded" />
        </div>`;
        createModal({
          title: 'Editar entregable',
          html,
          onConfirm: async (modalEl)=>{
            const est = modalEl.querySelector('#m_est'), act = modalEl.querySelector('#m_act'), estado = modalEl.querySelector('#m_estado'), arch = modalEl.querySelector('#m_arch');
            clearValidation(modalEl);
            if(!est.value){ setInvalid(est,'Seleccione estudiante'); return false; } else setValid(est);
            if(!act.value){ setInvalid(act,'Seleccione actividad'); return false; } else setValid(act);
            const body = { estudiante: { id_estudiante: Number(est.value) }, actividad: { id_actividad: Number(act.value) }, estado: estado.value, archivoUrl: arch.value.trim() || null };
            try{ await putJson(api.entregables() + '/' + id, body); toast('Entregable actualizado','success'); listarEntregables(); }catch(e){ toast('Error actualizando','error'); return false; }
          }
        });
      }catch(e){ toast('Error cargando entregable','error'); }
    }));
  }catch(e){ toast('Error cargando entregables','error'); }
}

// --- Upload form handling (keeps same behavior) ---
el('#formUpload').addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  const f = el('#fileInput').files[0];
  if(!f){ toast('Seleccione un archivo','error'); return; }
  const fd = new FormData(); fd.append('file', f);
  try{
    const r = await fetch(api.upload(), {method:'POST', body: fd});
    if(!r.ok){ toast('Error subiendo archivo','error'); return; }
    const j = await r.json();
    el('#uploadResult').innerText = 'Archivo subido: ' + j.fileUrl;
    toast('Archivo subido', 'success');
  }catch(e){ toast('Error subiendo','error'); }
});

// --- Initialization & nav ---
elAll('.sidebar-btn').forEach(b=> b.addEventListener('click', ()=>{
  const target = b.dataset.show;
  elAll('.section').forEach(s=> s.classList.add('hidden'));
  el('#' + target).classList.remove('hidden');
  // refresh lists when showing
  if(target === 'estudiantes') listarEstudiantes();
  if(target === 'docentes') listarDocentes();
  if(target === 'proyectos') listarProyectos();
  if(target === 'actividades') listarActividades();
  if(target === 'entregables') listarEntregables();
}));

el('#btn-refresh').addEventListener('click', ()=>{
  listarEstudiantes(); listarDocentes(); listarProyectos(); listarActividades(); listarEntregables();
  toast('Datos refrescados','success');
});

// initial load
listarEstudiantes(); listarDocentes(); listarProyectos(); listarActividades(); listarEntregables();
