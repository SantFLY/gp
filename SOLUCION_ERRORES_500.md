# Solución de Errores 500 - Sistema SGPE

## 🔍 Problema Identificado

Los errores 500 (Internal Server Error) se deben a que el DataSource `jdbc/sgpeDS` no está configurado en el servidor GlassFish.

## ✅ Soluciones Implementadas

### 1. **Configuración de Persistencia Mejorada**
- ✅ Agregada clase `Historial_Pedidos` faltante en `persistence.xml`
- ✅ Mejorada configuración de conexión MySQL
- ✅ Agregado manejo de errores robusto en `AbstractService`

### 2. **Archivos de Configuración Creados**
- ✅ `glassfish-web.xml` - Configuración para GlassFish
- ✅ `database_setup.sql` - Script para crear la base de datos

## 🚀 Pasos para Solucionar

### **Paso 1: Configurar la Base de Datos**
```sql
-- Ejecutar en MySQL
mysql -u root -p < database_setup.sql
```

### **Paso 2: Configurar DataSource en GlassFish**

1. **Abrir la Consola de Administración de GlassFish:**
   - URL: `http://localhost:4848`
   - Usuario: `admin`
   - Contraseña: (la que configuraste)

2. **Crear Connection Pool:**
   - Ir a: `Resources` → `JDBC` → `Connection Pools`
   - Click: `New...`
   - **Pool Name:** `sgpePool`
   - **Resource Type:** `javax.sql.DataSource`
   - **Database Driver Vendor:** `MySQL`
   - Click: `Next`

3. **Configurar Propiedades del Pool:**
   - **URL:** `jdbc:mysql://localhost:3306/sgpe?serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true`
   - **User:** `root`
   - **Password:** `admin123`
   - **ServerName:** `localhost`
   - **Port:** `3306`
   - **DatabaseName:** `sgpe`
   - Click: `Finish`

4. **Crear JDBC Resource:**
   - Ir a: `Resources` → `JDBC` → `JDBC Resources`
   - Click: `New...`
   - **JNDI Name:** `jdbc/sgpeDS`
   - **Pool Name:** `sgpePool`
   - Click: `OK`

### **Paso 3: Redesplegar la Aplicación**

1. **En NetBeans:**
   - Click derecho en el proyecto
   - `Clean and Build`
   - Click derecho en el proyecto
   - `Deploy`

2. **Verificar Despliegue:**
   - Ir a: `Applications` en GlassFish
   - Verificar que `servergp` esté `Enabled`

### **Paso 4: Probar la Aplicación**

1. **Abrir en el navegador:**
   ```
   http://localhost:8080/servergp
   ```

2. **Verificar que no hay errores 500:**
   - Abrir DevTools (F12)
   - Ir a la pestaña `Console`
   - Debería mostrar solo mensajes verdes de éxito

## 🔧 Verificación de Configuración

### **Verificar DataSource:**
1. En GlassFish Console: `Resources` → `JDBC` → `JDBC Resources`
2. Verificar que `jdbc/sgpeDS` esté listado y `Enabled`

### **Verificar Connection Pool:**
1. En GlassFish Console: `Resources` → `JDBC` → `Connection Pools`
2. Click en `sgpePool`
3. Click en `Ping` para verificar conexión

### **Verificar Base de Datos:**
```sql
-- En MySQL
USE sgpe;
SHOW TABLES;
SELECT * FROM clientes;
SELECT * FROM productos;
```

## 🐛 Solución de Problemas Adicionales

### **Si persisten errores 500:**

1. **Verificar logs de GlassFish:**
   - Ubicación: `[GLASSFISH_HOME]/domains/domain1/logs/server.log`
   - Buscar errores relacionados con `sgpePU` o `jdbc/sgpeDS`

2. **Verificar que MySQL esté ejecutándose:**
   ```bash
   # Windows
   net start mysql
   
   # Linux/Mac
   sudo systemctl start mysql
   ```

3. **Verificar credenciales de MySQL:**
   - Usuario: `root`
   - Contraseña: `admin123`
   - Puerto: `3306`

4. **Reiniciar GlassFish:**
   - En NetBeans: Click derecho en servidor → `Restart`

## 📊 Resultado Esperado

Después de aplicar estas soluciones:

- ✅ No más errores 500 en la consola
- ✅ Las tablas se cargan con datos
- ✅ Funcionalidad CRUD completa
- ✅ Interfaz moderna y responsiva

## 🎯 URLs de Prueba

- **Aplicación:** `http://localhost:8080/servergp`
- **API Clientes:** `http://localhost:8080/servergp/api/clientes`
- **API Productos:** `http://localhost:8080/servergp/api/productos`
- **API Proveedores:** `http://localhost:8080/servergp/api/proveedores`
- **API Pedidos:** `http://localhost:8080/servergp/api/pedidos`

¡El sistema debería funcionar perfectamente después de estos pasos!
