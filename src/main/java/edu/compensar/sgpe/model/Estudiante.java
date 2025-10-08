package edu.compensar.sgpe.model;

import jakarta.persistence.*;
import java.io.Serializable;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "estudiantes")
public class Estudiante implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_estudiante;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Email(message = "Formato de correo inválido")
    private String correo;

    @Size(max = 255)
    private String programa_academico;

    public Long getId_estudiante() { return id_estudiante; }
    public void setId_estudiante(Long id_estudiante) { this.id_estudiante = id_estudiante; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getPrograma_academico() { return programa_academico; }
    public void setPrograma_academico(String programa_academico) { this.programa_academico = programa_academico; }
}
