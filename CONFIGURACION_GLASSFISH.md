# Configuración de GlassFish para SGPE

## Pasos para configurar GlassFish correctamente:

### 1. Crear el DataSource en GlassFish

1. **Acceder al Admin Console de GlassFish:**
   - Abrir navegador en: `http://localhost:4848`
   - Usuario: `admin`
   - Contraseña: `admin` (o la que hayas configurado)

2. **Crear el Connection Pool:**
   - Ir a: `Resources` → `JDBC` → `Connection Pools`
   - Click en `New...`
   - **Pool Name:** `sgpePool`
   - **Resource Type:** `javax.sql.DataSource`
   - **Database Driver Vendor:** `MySQL`
   - Click `Next`

3. **Configurar el Pool:**
   - **URL:** `jdbc:mysql://localhost:3306/sgpe?serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true`
   - **User:** `root`
   - **Password:** `admin123`
   - **Driver Class:** `com.mysql.cj.jdbc.Driver`
   - Click `Finish`

4. **Crear el DataSource:**
   - Ir a: `Resources` → `JDBC` → `JDBC Resources`
   - Click en `New...`
   - **JNDI Name:** `jdbc/sgpeDS`
   - **Pool Name:** `sgpePool`
   - Click `OK`

### 2. Verificar la Base de Datos

1. **Ejecutar el script SQL:**
   - Abrir MySQL Workbench o línea de comandos
   - Ejecutar el archivo `database_setup.sql`
   - Verificar que se crearon las tablas correctamente

2. **Verificar conexión:**
   - En GlassFish Admin Console
   - Ir a: `Resources` → `JDBC` → `Connection Pools`
   - Click en `sgpePool`
   - Click en `Ping` para verificar la conexión

### 3. Desplegar la Aplicación

1. **Compilar el proyecto:**
   - En NetBeans: `Clean and Build`
   - Verificar que no hay errores de compilación

2. **Desplegar:**
   - Click derecho en el proyecto
   - `Deploy`
   - Verificar que el despliegue es exitoso

### 4. Probar los Endpoints

1. **Probar cliente:**
   - `GET http://localhost:8080/servergp/api/clientes`
   - Debería devolver una lista de clientes

2. **Probar productos:**
   - `GET http://localhost:8080/servergp/api/productos`
   - Debería devolver una lista de productos

3. **Probar proveedores:**
   - `GET http://localhost:8080/servergp/api/proveedores`
   - Debería devolver una lista de proveedores

### 5. Solución de Problemas

**Si obtienes error 500:**
1. Verificar que MySQL esté ejecutándose
2. Verificar que la base de datos `sgpe` existe
3. Verificar que el DataSource está configurado correctamente
4. Revisar los logs de GlassFish en: `glassfish/domains/domain1/logs/server.log`

**Si obtienes error 404:**
1. Verificar que la aplicación se desplegó correctamente
2. Verificar que el contexto es `/servergp`
3. Verificar que los endpoints están registrados en `RestApplication.java`

**Si obtienes error de conexión:**
1. Verificar que MySQL está ejecutándose en puerto 3306
2. Verificar credenciales de MySQL
3. Verificar que el driver MySQL está en el classpath
