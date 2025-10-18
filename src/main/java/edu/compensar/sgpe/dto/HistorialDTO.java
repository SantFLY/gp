package edu.compensar.sgpe.dto;

import java.time.LocalDate;

public class HistorialDTO {
    private Long id_entrega;
    private Long id_pedido;
    private LocalDate fecha_entrega;
    private String estado_entrega;

    // Constructores
    public HistorialDTO() {}

    public HistorialDTO(Long id_entrega, Long id_pedido, LocalDate fecha_entrega, String estado_entrega) {
        this.id_entrega = id_entrega;
        this.id_pedido = id_pedido;
        this.fecha_entrega = fecha_entrega;
        this.estado_entrega = estado_entrega;
    }

    // Getters y Setters
    public Long getId_entrega() { return id_entrega; }
    public void setId_entrega(Long id_entrega) { this.id_entrega = id_entrega; }

    public Long getId_pedido() { return id_pedido; }
    public void setId_pedido(Long id_pedido) { this.id_pedido = id_pedido; }

    public LocalDate getFecha_entrega() { return fecha_entrega; }
    public void setFecha_entrega(LocalDate fecha_entrega) { this.fecha_entrega = fecha_entrega; }

    public String getEstado_entrega() { return estado_entrega; }
    public void setEstado_entrega(String estado_entrega) { this.estado_entrega = estado_entrega; }
}
