package edu.compensar.sgpe.dto;

import java.time.LocalDate;
import java.util.List;

public class PedidoDetalleDTO {
    private Long id_pedido;
    private Long id_cliente;
    private String nombre_cliente;
    private LocalDate fecha_pedido;
    private String estado;
    private List<DetalleProductoDTO> productos;

    public PedidoDetalleDTO() {}

    public PedidoDetalleDTO(Long id_pedido, Long id_cliente, String nombre_cliente, LocalDate fecha_pedido, String estado) {
        this.id_pedido = id_pedido;
        this.id_cliente = id_cliente;
        this.nombre_cliente = nombre_cliente;
        this.fecha_pedido = fecha_pedido;
        this.estado = estado;
    }

    // Clase interna para los detalles de productos
    public static class DetalleProductoDTO {
        private Long id_producto;
        private String nombre_producto;
        private Integer cantidad;
        private Double precio_unitario;
        private Double subtotal;

        public DetalleProductoDTO() {}

        public DetalleProductoDTO(Long id_producto, String nombre_producto, Integer cantidad, Double precio_unitario) {
            this.id_producto = id_producto;
            this.nombre_producto = nombre_producto;
            this.cantidad = cantidad;
            this.precio_unitario = precio_unitario;
            this.subtotal = cantidad * precio_unitario;
        }

        // Getters y Setters
        public Long getId_producto() { return id_producto; }
        public void setId_producto(Long id_producto) { this.id_producto = id_producto; }

        public String getNombre_producto() { return nombre_producto; }
        public void setNombre_producto(String nombre_producto) { this.nombre_producto = nombre_producto; }

        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

        public Double getPrecio_unitario() { return precio_unitario; }
        public void setPrecio_unitario(Double precio_unitario) { this.precio_unitario = precio_unitario; }

        public Double getSubtotal() { return subtotal; }
        public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    }

    // Getters y Setters principales
    public Long getId_pedido() { return id_pedido; }
    public void setId_pedido(Long id_pedido) { this.id_pedido = id_pedido; }

    public Long getId_cliente() { return id_cliente; }
    public void setId_cliente(Long id_cliente) { this.id_cliente = id_cliente; }

    public String getNombre_cliente() { return nombre_cliente; }
    public void setNombre_cliente(String nombre_cliente) { this.nombre_cliente = nombre_cliente; }

    public LocalDate getFecha_pedido() { return fecha_pedido; }
    public void setFecha_pedido(LocalDate fecha_pedido) { this.fecha_pedido = fecha_pedido; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<DetalleProductoDTO> getProductos() { return productos; }
    public void setProductos(List<DetalleProductoDTO> productos) { this.productos = productos; }
}
