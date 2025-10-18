package edu.compensar.sgpe.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedidos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_pedido;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Clientes cliente;

    private LocalDate fecha_pedido;
    private String estado;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Detalle_Pedidos> detalles;

    // Getters y Setters
    public Long getId_pedido() { return id_pedido; }
    public void setId_pedido(Long id_pedido) { this.id_pedido = id_pedido; }

    public Clientes getCliente() { return cliente; }
    public void setCliente(Clientes cliente) { this.cliente = cliente; }

    public LocalDate getFecha_pedido() { return fecha_pedido; }
    public void setFecha_pedido(LocalDate fecha_pedido) { this.fecha_pedido = fecha_pedido; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<Detalle_Pedidos> getDetalles() { return detalles; }
    public void setDetalles(List<Detalle_Pedidos> detalles) { this.detalles = detalles; }
}
