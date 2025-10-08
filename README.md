
# SGPE — Sistema de Gestión de Proyectos Estudiantiles

Proyecto académico desarrollado en **Jakarta EE 10** con conexión a **MySQL**, orientado a la administración de proyectos, actividades y entregables de estudiantes y docentes.  
Su propósito es ofrecer una herramienta práctica, modular y con una interfaz moderna para gestionar procesos académicos de manera sencilla.

---

## Funcionalidades principales

- Módulos para estudiantes, docentes, proyectos, actividades y entregables.  
- API REST completa con operaciones CRUD.  
- Persistencia con **JPA (EclipseLink)** sobre **MySQL**.  
- Validaciones integradas con **Jakarta Bean Validation**.  
- Interfaz responsiva construida con **TailwindCSS** y **JavaScript nativo**.  
- Modales dinámicos, alertas tipo toast y validaciones visuales.  
- Base de datos autogenerada al iniciar la aplicación.  

---

---

## Configuración del entorno

### Requisitos

- Java JDK 21
- Apache NetBeans 24
- GlassFish Server 7.0.8
- MySQL 8 (por XAMPP o instalación local)

### Configurar la base de datos

1. Verifica que MySQL esté en ejecución (puerto 3306).  
2. Credenciales usadas por defecto:
   ```
   Usuario: root
   Contraseña: admin123
   ```
3. La base de datos `sgpe` se crea automáticamente.  
   Si lo prefieres, puedes crearla manualmente con:
   ```sql
   CREATE DATABASE sgpe CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

---

## Archivo `persistence.xml`

Configuración utilizada para la conexión y generación automática de tablas:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence" version="3.0">
  <persistence-unit name="sgpePU" transaction-type="JTA">
    <provider>org.eclipse.persistence.jpa.PersistenceProvider</provider>
    <class>edu.compensar.sgpe.model.Estudiante</class>
    <class>edu.compensar.sgpe.model.Docente</class>
    <class>edu.compensar.sgpe.model.Proyecto</class>
    <class>edu.compensar.sgpe.model.Actividad</class>
    <class>edu.compensar.sgpe.model.Entregable</class>
    <properties>
      <property name="jakarta.persistence.jdbc.driver" value="com.mysql.cj.jdbc.Driver"/>
      <property name="jakarta.persistence.jdbc.url" value="jdbc:mysql://localhost:3306/sgpe?createDatabaseIfNotExist=true&amp;serverTimezone=UTC"/>
      <property name="jakarta.persistence.jdbc.user" value="root"/>
      <property name="jakarta.persistence.jdbc.password" value="admin123"/>
      <property name="jakarta.persistence.schema-generation.database.action" value="create"/>
      <property name="eclipselink.logging.level" value="INFO"/>
    </properties>
  </persistence-unit>
</persistence>
```

---

## Cómo ejecutar el proyecto

1. Abre el proyecto en NetBeans.  
2. Realiza una limpieza y compilación:  
   **Run → Clean and Build Project**  
3. Inicia GlassFish Server.  
4. Ejecuta el proyecto con **Run Project (F6)**.  
5. Accede desde tu navegador en:  
   ```
   http://localhost:8080/sgpe/
   ```

---

## Endpoints REST disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| **GET** | `/api/estudiantes` | Lista todos los estudiantes |
| **GET** | `/api/estudiantes/{id}` | Consulta un estudiante específico |
| **POST** | `/api/estudiantes` | Registra un nuevo estudiante |
| **PUT** | `/api/estudiantes/{id}` | Actualiza la información de un estudiante |
| **DELETE** | `/api/estudiantes/{id}` | Elimina un estudiante |

*(La misma estructura aplica para docentes, proyectos, actividades y entregables.)*

---

## Tecnologías utilizadas

| Tecnología | Uso principal |
|-------------|----------------|
| Jakarta EE 10 | Framework base |
| EclipseLink JPA | Persistencia ORM |
| JAX-RS | Servicios REST |
| MySQL 8 | Almacenamiento |
| TailwindCSS | Diseño visual |
| JavaScript (Fetch API) | Lógica cliente |
| GlassFish 7 | Servidor de aplicaciones |

---

## Autor

**Santiago Polanco Buitrago**  

---

