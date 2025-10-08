const apiBase = location.origin + '/servergp/api/estudiantes'; 
async function listar() {
  try {
    const res = await fetch(apiBase);
    if (!res.ok) { showMsg('Error al obtener estudiantes: ' + res.status); return; }
    const data = await res.json();
    const tbody = document.querySelector('#tablaEstudiantes tbody');
    tbody.innerHTML = '';
    data.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${e.id_estudiante || ''}</td><td>${e.nombre || ''}</td>
        <td>${e.correo || ''}</td><td>${e.programa_academico || ''}</td>
        <td><button data-id="${e.id_estudiante}" class="del">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    document.querySelectorAll('.del').forEach(b => b.addEventListener('click', async ev=>{
      const id = ev.target.dataset.id;
      if (!confirm('Eliminar estudiante ' + id + '?')) return;
      await fetch(apiBase + '/' + id, { method: 'DELETE' });
      listar();
    }));
  } catch (err) { showMsg(err); }
}
function showMsg(m){ document.getElementById('msg').innerText = m; setTimeout(()=>document.getElementById('msg').innerText='',3000); }
document.getElementById('btnCreate').addEventListener('click', async ()=>{
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const programa = document.getElementById('programa').value;
  if (!nombre || !correo) { showMsg('Nombre y correo requeridos'); return; }
  const body = { nombre, correo, programa_academico: programa };
  const res = await fetch(apiBase, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (!res.ok) { showMsg('Error creando: ' + res.status); return; }
  document.getElementById('nombre').value=''; document.getElementById('correo').value=''; document.getElementById('programa').value='';
  listar();
});
listar();
