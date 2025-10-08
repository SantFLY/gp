package edu.compensar.sgpe.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "actividades")
public class Actividad implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_actividad;

    @NotBlank(message = "Nombre de la actividad es obligatorio")
    private String nombre;

    @Column(length = 2000)
    private String descripcion;

    private LocalDate fecha_entrega;

    @ManyToOne
    @JoinColumn(name = "id_proyecto")
    private Proyecto proyecto;

    public Long getId_actividad() { return id_actividad; }
    public void setId_actividad(Long id_actividad) { this.id_actividad = id_actividad; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFecha_entrega() { return fecha_entrega; }
    public void setFecha_entrega(LocalDate fecha_entrega) { this.fecha_entrega = fecha_entrega; }
    public Proyecto getProyecto() { return proyecto; }
    public void setProyecto(Proyecto proyecto) { this.proyecto = proyecto; }
}
