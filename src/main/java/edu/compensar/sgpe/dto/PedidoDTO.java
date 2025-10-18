package edu.compensar.sgpe.dto;

import java.time.LocalDate;

public class PedidoDTO {
    private Long id_pedido;
    private Long id_cliente;
    private String nombre_cliente;
    private LocalDate fecha_pedido;
    private String estado;

    public PedidoDTO() {}

    public PedidoDTO(Long id_pedido, Long id_cliente, String nombre_cliente, LocalDate fecha_pedido, String estado) {
        this.id_pedido = id_pedido;
        this.id_cliente = id_cliente;
        this.nombre_cliente = nombre_cliente;
        this.fecha_pedido = fecha_pedido;
        this.estado = estado;
    }

    // Getters y Setters
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
}
