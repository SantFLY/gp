package edu.compensar.sgpe.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "entregables")
public class Entregable implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_entregable;

    @ManyToOne
    @JoinColumn(name = "id_actividad")
    @NotNull(message = "Actividad es requerida")
    private Actividad actividad;

    @ManyToOne
    @JoinColumn(name = "id_estudiante")
    @NotNull(message = "Estudiante es requerido")
    private Estudiante estudiante;

    @NotBlank
    private String estado; // pendiente, en progreso, entregado
    private LocalDateTime fecha_subida;
    private String archivoUrl;

    public Long getId_entregable() { return id_entregable; }
    public void setId_entregable(Long id_entregable) { this.id_entregable = id_entregable; }
    public Actividad getActividad() { return actividad; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }
    public Estudiante getEstudiante() { return estudiante; }
    public void setEstudiante(Estudiante estudiante) { this.estudiante = estudiante; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFecha_subida() { return fecha_subida; }
    public void setFecha_subida(LocalDateTime fecha_subida) { this.fecha_subida = fecha_subida; }
    public String getArchivoUrl() { return archivoUrl; }
    public void setArchivoUrl(String archivoUrl) { this.archivoUrl = archivoUrl; }
}
