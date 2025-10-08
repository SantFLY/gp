const ctx = location.origin + '/servergp';
const api = {
  estudiantes: () => `${ctx}/api/estudiantes`,
  docentes: () => `${ctx}/api/docentes`,
  proyectos: () => `${ctx}/api/proyectos`,
  actividades: () => `${ctx}/api/actividades`,
  entregables: () => `${ctx}/api/entregables`,
  upload: () => `${ctx}/api/upload`
};

function showMsg(m){ const el = document.getElementById('msg'); el.innerText = (typeof m === 'string') ? m : JSON.stringify(m); el.classList.add('text-red-600'); setTimeout(()=>{ el.innerText=''; el.classList.remove('text-red-600'); },4000); }

// Simple nav
document.querySelectorAll('nav button').forEach(b=>{
  b.addEventListener('click', ()=> {
    document.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    document.getElementById(b.dataset.show).classList.add('active');
    if (b.dataset.show === 'proyectos' || b.dataset.show === 'actividades' || b.dataset.show==='entregables') {
      refreshAllSelects();
    }
  });
});

// Fetch utilities
async function get(url){ const r = await fetch(url); if(!r.ok) throw new Error(r.status); return r.json(); }
async function post(url, body){ const r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
async function put(url, body){ const r = await fetch(url, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
async function del(url){ const r = await fetch(url, {method:'DELETE'}); if(!r.ok) throw new Error(r.status); return; }

// ESTUDIANTES
async function listarEstudiantes(){
  try {
    const data = await get(api.estudiantes());
    const tbody = document.querySelector('#tablaEstudiantes tbody'); tbody.innerHTML='';
    data.forEach(e=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${e.id_estudiante||''}</td><td>${e.nombre||''}</td><td>${e.correo||''}</td><td>${e.programa_academico||''}</td>
        <td><button data-id="${e.id_estudiante}" class="est-del">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    document.querySelectorAll('.est-del').forEach(b=>b.addEventListener('click', async ev=>{
      try{ await del(api.estudiantes() + '/' + ev.target.dataset.id); listarEstudiantes(); refreshAllSelects(); }catch(err){ showMsg(err); }
    }));
  } catch (err){ showMsg('Error estudiantes: '+err); }
}
document.getElementById('est_btnCreate').addEventListener('click', async ()=>{
  const nombre = document.getElementById('est_nombre').value.trim(), correo = document.getElementById('est_correo').value.trim(), programa = document.getElementById('est_programa').value.trim();
  if(!nombre||!correo){ showMsg('Nombre y correo son requeridos'); return; }
  try{ await post(api.estudiantes(), {nombre, correo, programa_academico:programa}); document.getElementById('est_nombre').value=''; document.getElementById('est_correo').value=''; document.getElementById('est_programa').value=''; listarEstudiantes(); refreshAllSelects(); }catch(e){ showMsg(e); }
});

// DOCENTES
async function listarDocentes(){
  try {
    const data = await get(api.docentes());
    const tbody = document.querySelector('#tablaDocentes tbody'); tbody.innerHTML='';
    const sel = document.getElementById('proy_docente'); sel.innerHTML = '<option value="">-- Seleccione docente --</option>';
    data.forEach(d=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${d.id_docente||''}</td><td>${d.nombre||''}</td><td>${d.correo||''}</td><td>${d.area||''}</td>
        <td><button data-id="${d.id_docente}" class="doc-del">Eliminar</button></td>`;
      tbody.appendChild(tr);
      const opt = document.createElement('option'); opt.value = d.id_docente; opt.text = d.nombre; sel.appendChild(opt);
    });
    document.querySelectorAll('.doc-del').forEach(b=>b.addEventListener('click', async ev=>{ try{ await del(api.docentes() + '/' + ev.target.dataset.id); listarDocentes(); refreshAllSelects(); }catch(e){ showMsg(e); }}));
  } catch (err){ showMsg('Error docentes: '+err); }
}
document.getElementById('doc_btnCreate').addEventListener('click', async ()=>{
  const nombre=document.getElementById('doc_nombre').value.trim(), correo=document.getElementById('doc_correo').value.trim(), area=document.getElementById('doc_area').value.trim();
  if(!nombre){ showMsg('Nombre requerido'); return; }
  try{ await post(api.docentes(), {nombre, correo, area}); document.getElementById('doc_nombre').value=''; document.getElementById('doc_correo').value=''; document.getElementById('doc_area').value=''; listarDocentes(); }catch(e){ showMsg(e); }
});

// PROYECTOS
async function listarProyectos(){
  try{
    const data = await get(api.proyectos());
    const tbody = document.querySelector('#tablaProyectos tbody'); tbody.innerHTML='';
    const sel = document.getElementById('act_proyecto'); sel.innerHTML = '<option value="">-- Seleccione proyecto --</option>';
    data.forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p.id_proyecto||''}</td><td>${p.nombre||''}</td><td>${p.docente? p.docente.nombre:''}</td><td>${p.fecha_inicio||''}</td><td>${p.fecha_fin||''}</td>
        <td><button data-id="${p.id_proyecto}" class="proy-del">Eliminar</button></td>`;
      tbody.appendChild(tr);
      const opt = document.createElement('option'); opt.value = p.id_proyecto; opt.text = p.nombre; sel.appendChild(opt);
    });
    document.querySelectorAll('.proy-del').forEach(b=>b.addEventListener('click', async ev=>{ try{ await del(api.proyectos() + '/' + ev.target.dataset.id); listarProyectos(); refreshAllSelects(); }catch(e){ showMsg(e); }}));
  }catch(e){ showMsg('Error proyectos:'+e); }
}
document.getElementById('proy_btnCreate').addEventListener('click', async ()=>{
  const nombre=document.getElementById('proy_nombre').value.trim(), inicio=document.getElementById('proy_fecha_inicio').value, fin=document.getElementById('proy_fecha_fin').value, docenteId=document.getElementById('proy_docente').value, descripcion=document.getElementById('proy_descripcion').value.trim();
  if(!nombre){ showMsg('Nombre del proyecto requerido'); return; }
  const body = {nombre, fecha_inicio: inicio||null, fecha_fin: fin||null, descripcion, docente: docenteId ? {id_docente: Number(docenteId)} : null};
  try{ await post(api.proyectos(), body); document.getElementById('proy_nombre').value=''; document.getElementById('proy_descripcion').value=''; listarProyectos(); }catch(e){ showMsg(e); }
});

// ACTIVIDADES
async function listarActividades(){
  try{
    const data = await get(api.actividades());
    const tbody = document.querySelector('#tablaActividades tbody'); tbody.innerHTML='';
    data.forEach(a=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${a.id_actividad||''}</td><td>${a.nombre||''}</td><td>${a.proyecto? a.proyecto.nombre:''}</td><td>${a.fecha_entrega||''}</td>
        <td><button data-id="${a.id_actividad}" class="act-del">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    document.querySelectorAll('.act-del').forEach(b=>b.addEventListener('click', async ev=>{ try{ await del(api.actividades() + '/' + ev.target.dataset.id); listarActividades(); refreshAllSelects(); }catch(e){ showMsg(e); }}));
  }catch(e){ showMsg('Error actividades:'+e); }
}
document.getElementById('act_btnCreate').addEventListener('click', async ()=>{
  const nombre=document.getElementById('act_nombre').value.trim(), fecha=document.getElementById('act_fecha_entrega').value, proyectoId=document.getElementById('act_proyecto').value, descripcion=document.getElementById('act_descripcion').value.trim();
  if(!nombre || !proyectoId){ showMsg('Nombre y proyecto requeridos'); return; }
  const body = {nombre, fecha_entrega: fecha||null, descripcion, proyecto: {id_proyecto: Number(proyectoId)}};
  try{ await post(api.actividades(), body); document.getElementById('act_nombre').value=''; document.getElementById('act_descripcion').value=''; listarActividades(); }catch(e){ showMsg(e); }
});

// ENTREGABLES
async function listarEntregables(){
  try{
    const data = await get(api.entregables());
    const tbody = document.querySelector('#tablaEntregables tbody'); tbody.innerHTML='';
    data.forEach(en=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${en.id_entregable||''}</td><td>${en.estudiante? en.estudiante.nombre:''}</td><td>${en.actividad? en.actividad.nombre:''}</td><td>${en.estado||''}</td><td>${en.fecha_subida||''}</td>
        <td><button data-id="${en.id_entregable}" class="ent-del">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    document.querySelectorAll('.ent-del').forEach(b=>b.addEventListener('click', async ev=>{ try{ await del(api.entregables() + '/' + ev.target.dataset.id); listarEntregables(); }catch(e){ showMsg(e); }}));
  }catch(e){ showMsg('Error entregables:'+e); }
}
document.getElementById('ent_btnCreate').addEventListener('click', async ()=>{
  const estudianteId=document.getElementById('ent_estudiante').value, actividadId=document.getElementById('ent_actividad').value, estado=document.getElementById('ent_estado').value, archivoUrl=document.getElementById('ent_archivoUrl').value.trim();
  if(!estudianteId || !actividadId){ showMsg('Seleccione estudiante y actividad'); return; }
  const body = {estudiante: {id_estudiante: Number(estudianteId)}, actividad: {id_actividad: Number(actividadId)}, estado, archivoUrl: archivoUrl || null};
  try{ await post(api.entregables(), body); document.getElementById('ent_archivoUrl').value=''; listarEntregables(); }catch(e){ showMsg(e); }
});

// Upload
document.getElementById('formUpload').addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  const f = document.getElementById('fileInput').files[0];
  if(!f){ showMsg('Seleccione un archivo'); return; }
  const fd = new FormData(); fd.append('file', f);
  try{
    const r = await fetch(api.upload(), {method:'POST', body: fd});
    if(!r.ok) { showMsg('Error subiendo archivo'); return; }
    const json = await r.json();
    document.getElementById('uploadResult').innerText = 'Archivo subido: ' + json.fileUrl;
    document.getElementById('ent_archivoUrl').value = json.fileUrl;
  }catch(e){ showMsg(e); }
});

// refresh selects used by multiple sections
async function refreshAllSelects(){
  try{
    const [est, doc, proy, act] = await Promise.all([get(api.estudiantes()), get(api.docentes()), get(api.proyectos()), get(api.actividades())]);
    const selEst = document.getElementById('ent_estudiante'); selEst.innerHTML='<option value="">-- Seleccione estudiante --</option>';
    est.forEach(e=>{ const o=document.createElement('option'); o.value=e.id_estudiante; o.text=e.nombre; selEst.appendChild(o); });
    // docentes handled by listarDocentes which populates proy_docente
    const selAct = document.getElementById('ent_actividad'); selAct.innerHTML='<option value="">-- Seleccione actividad --</option>';
    act.forEach(a=>{ const o=document.createElement('option'); o.value=a.id_actividad; o.text=a.nombre; selAct.appendChild(o); });
    // also refresh project and docente lists
    listarDocentes(); listarProyectos();
  }catch(e){ console.warn(e); }
}

// initial load
listarEstudiantes(); listarDocentes(); listarProyectos(); listarActividades(); listarEntregables();
