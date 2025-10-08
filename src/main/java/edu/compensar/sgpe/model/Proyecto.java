package edu.compensar.sgpe.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "proyectos")
public class Proyecto implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_proyecto;

    @NotBlank(message = "Nombre del proyecto es obligatorio")
    private String nombre;

    @Column(length = 2000)
    private String descripcion;

    private LocalDate fecha_inicio;
    private LocalDate fecha_fin;

    @ManyToOne
    @JoinColumn(name = "id_docente")
    private Docente docente;

    public Long getId_proyecto() { return id_proyecto; }
    public void setId_proyecto(Long id_proyecto) { this.id_proyecto = id_proyecto; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFecha_inicio() { return fecha_inicio; }
    public void setFecha_inicio(LocalDate fecha_inicio) { this.fecha_inicio = fecha_inicio; }
    public LocalDate getFecha_fin() { return fecha_fin; }
    public void setFecha_fin(LocalDate fecha_fin) { this.fecha_fin = fecha_fin; }
    public Docente getDocente() { return docente; }
    public void setDocente(Docente docente) { this.docente = docente; }
}
