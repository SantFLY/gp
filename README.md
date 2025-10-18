# SGPE - Sistema de Gestión de Inventario

Sistema web completo para la gestión de inventarios, pedidos y entregas desarrollado con Jakarta EE y tecnologías modernas.

## 🚀 Características Principales

### 📦 Gestión de Inventario
- **Productos**: CRUD completo con control de stock
- **Proveedores**: Administración de proveedores y sus productos
- **Clientes**: Gestión de base de datos de clientes
- **Pedidos**: Sistema completo de pedidos con múltiples productos

### 📋 Sistema de Pedidos
- Creación de pedidos con múltiples productos
- Validación de stock en tiempo real
- Estados de pedido: pendiente, en proceso, completado, entregado
- Historial de entregas por cliente
- Control de cantidades máximas por producto

### 🎨 Interfaz Moderna
- Diseño responsivo con Tailwind CSS
- Interfaz intuitiva y fácil de usar
- Modales dinámicos para operaciones
- Notificaciones toast para feedback
- Validación en tiempo real

## 🛠️ Tecnologías Utilizadas

### Backend
- **Jakarta EE 10** - Framework empresarial
- **JAX-RS** - API REST
- **JPA/Hibernate** - Persistencia de datos
- **EJB** - Servicios empresariales
- **MySQL** - Base de datos
- **GlassFish** - Servidor de aplicaciones

### Frontend
- **HTML5** - Estructura
- **CSS3/Tailwind** - Estilos
- **JavaScript Vanilla** - Lógica de cliente
- **Fetch API** - Comunicación con backend

### Base de Datos
- **MySQL 8.0** - Motor de base de datos
- **JPA Annotations** - Mapeo objeto-relacional
- **Transacciones JTA** - Integridad de datos

## 📊 Estructura de la Base de Datos

### Tablas Principales
- `productos` - Catálogo de productos
- `proveedores` - Información de proveedores
- `clientes` - Base de datos de clientes
- `pedidos` - Órdenes de compra
- `detalles_pedido` - Productos por pedido
- `historial_entregas` - Registro de entregas

### Relaciones
- Productos → Proveedores (Many-to-One)
- Pedidos → Clientes (Many-to-One)
- Pedidos → Detalles (One-to-Many)
- Historial → Pedidos (Many-to-One)

## 🚀 Instalación y Configuración

### Prerrequisitos
- Java 21+
- NetBeans IDE
- GlassFish Server 8.0
- MySQL 8.0+

### Configuración de Base de Datos
1. Crear base de datos `sgpe`
2. Configurar usuario `root` con contraseña `admin123`
3. El esquema se genera automáticamente

### Configuración de GlassFish
1. Crear DataSource `jdbc/sgpeDS`
2. Configurar pool de conexiones MySQL
3. Desplegar aplicación

### Ejecución
1. Clonar repositorio
2. Abrir en NetBeans
3. Configurar GlassFish
4. Desplegar aplicación
5. Acceder a `http://localhost:8080/servergp`

## 📱 Funcionalidades por Módulo

### 👥 Gestión de Clientes
- ✅ Crear, editar, eliminar clientes
- ✅ Validación de datos obligatorios
- ✅ Eliminación en cascada (forzada)
- ✅ Búsqueda y filtrado

### 📦 Gestión de Productos
- ✅ CRUD completo de productos
- ✅ Control de stock automático
- ✅ Asociación con proveedores
- ✅ Validación de precios y cantidades
- ✅ Prevención de eliminación con pedidos activos

### 🏢 Gestión de Proveedores
- ✅ Administración de proveedores
- ✅ Eliminación en cascada de productos
- ✅ Validación de datos de contacto
- ✅ Gestión de productos asociados

### 📋 Gestión de Pedidos
- ✅ Creación de pedidos con múltiples productos
- ✅ Validación de stock en tiempo real
- ✅ Control de cantidades máximas
- ✅ Estados de pedido dinámicos
- ✅ Cálculo automático de totales

### 📊 Historial de Entregas
- ✅ Registro automático de entregas
- ✅ Consulta por cliente
- ✅ Estados de entrega
- ✅ Fechas de entrega
- ✅ Trazabilidad completa

## 🔧 API Endpoints

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

### Proveedores
- `GET /api/proveedores` - Listar proveedores
- `POST /api/proveedores` - Crear proveedor
- `PUT /api/proveedores/{id}` - Actualizar proveedor
- `DELETE /api/proveedores/{id}` - Eliminar proveedor

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/{id}` - Actualizar cliente
- `DELETE /api/clientes/{id}` - Eliminar cliente
- `DELETE /api/clientes/{id}/forzar` - Eliminación forzada

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/{id}` - Obtener pedido
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/{id}/entregar` - Marcar como entregado
- `DELETE /api/pedidos/{id}` - Eliminar pedido

### Historial
- `GET /api/historial/{idCliente}` - Historial por cliente

## 🎯 Características Técnicas

### Validaciones
- ✅ Validación de stock antes de crear pedidos
- ✅ Prevención de eliminación con dependencias
- ✅ Validación de datos obligatorios
- ✅ Control de cantidades máximas

### Manejo de Errores
- ✅ Mensajes de error descriptivos
- ✅ Códigos HTTP apropiados
- ✅ Logging detallado
- ✅ Rollback de transacciones

### Seguridad
- ✅ Validación de entrada
- ✅ Prevención de inyección SQL
- ✅ Manejo seguro de transacciones
- ✅ Validación de referencias

## 📈 Mejoras Futuras

- [ ] Autenticación y autorización
- [ ] Reportes y estadísticas
- [ ] Notificaciones por email
- [ ] API de integración
- [ ] Dashboard en tiempo real
- [ ] Exportación de datos

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama de feature
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como proyecto académico para el sistema de gestión de inventarios SGPE.

---

**Versión**: 1.0.0  
**Última actualización**: 2025-01-17