-- Script para configurar la base de datos SGPE
-- Ejecutar este script en MySQL antes de desplegar la aplicación

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS sgpe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE sgpe;

-- Crear tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(500),
    telefono VARCHAR(20),
    email VARCHAR(255)
);

-- Crear tabla proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255)
);

-- Crear tabla productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    stock INT DEFAULT 0,
    id_proveedor BIGINT,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);

-- Crear tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente BIGINT,
    fecha_pedido DATE,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- Crear tabla detalle_pedidos
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT,
    id_producto BIGINT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Crear tabla historial_pedidos
CREATE TABLE IF NOT EXISTS historial_pedidos (
    id_historial BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT,
    fecha_entrega DATE,
    estado_entrega VARCHAR(50) DEFAULT 'ENTREGADO',
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

-- Insertar datos de prueba
INSERT IGNORE INTO clientes (id_cliente, nombre, direccion, telefono, email) VALUES 
(1, 'Juan Pérez', 'Calle 123 #45-67', '3001234567', 'juan@email.com'),
(2, 'María García', 'Avenida 456 #78-90', '3007654321', 'maria@email.com'),
(3, 'Carlos López', 'Carrera 789 #12-34', '3009876543', 'carlos@email.com');

INSERT IGNORE INTO proveedores (id_proveedor, nombre, telefono, email) VALUES 
(1, 'Proveedor ABC', '3001234567', 'juan@proveedorabc.com'),
(2, 'Distribuidora XYZ', '3007654321', 'maria@distribuidoraxyz.com'),
(3, 'Suministros 123', '3009876543', 'carlos@suministros123.com');

INSERT IGNORE INTO productos (id_producto, nombre, descripcion, precio, stock, id_proveedor) VALUES 
(1, 'Laptop Dell', 'Laptop Dell Inspiron 15', 1500000.00, 10, 1),
(2, 'Mouse Logitech', 'Mouse inalámbrico Logitech', 50000.00, 25, 2),
(3, 'Teclado Mecánico', 'Teclado mecánico RGB', 200000.00, 15, 1);

INSERT IGNORE INTO pedidos (id_pedido, id_cliente, fecha_pedido, estado) VALUES 
(1, 1, '2025-01-15', 'PENDIENTE'),
(2, 2, '2025-01-16', 'ENTREGADO'),
(3, 3, '2025-01-17', 'EN_PROCESO');

INSERT IGNORE INTO detalle_pedidos (id_detalle, id_pedido, id_producto, cantidad, precio_unitario) VALUES 
(1, 1, 1, 1, 1500000.00),
(2, 1, 2, 2, 50000.00),
(3, 2, 3, 1, 200000.00);

INSERT IGNORE INTO historial_pedidos (id_historial, id_pedido, fecha_entrega, estado_entrega) VALUES 
(1, 2, '2025-01-18', 'ENTREGADO'),
(2, 3, '2025-01-19', 'EN_CAMINO');