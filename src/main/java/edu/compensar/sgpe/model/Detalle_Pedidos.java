package edu.compensar.sgpe.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalles_pedido")
public class Detalle_Pedidos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_detalle;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Pedidos pedido;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Productos producto;

    private Integer cantidad;
    private Double precio_unitario;

    // Getters y Setters
    public Long getId_detalle() { return id_detalle; }
    public void setId_detalle(Long id_detalle) { this.id_detalle = id_detalle; }

    public Pedidos getPedido() { return pedido; }
    public void setPedido(Pedidos pedido) { this.pedido = pedido; }

    public Productos getProducto() { return producto; }
    public void setProducto(Productos producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecio_unitario() { return precio_unitario; }
    public void setPrecio_unitario(Double precio_unitario) { this.precio_unitario = precio_unitario; }
}
