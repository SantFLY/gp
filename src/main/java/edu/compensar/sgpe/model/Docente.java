package edu.compensar.sgpe.model;

import jakarta.persistence.*;
import java.io.Serializable;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "docentes")
public class Docente implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_docente;

    @NotBlank(message = "Nombre es obligatorio")
    private String nombre;

    @Email(message = "Formato de correo inválido")
    private String correo;

    @Size(max = 255)
    private String area;

    public Long getId_docente() { return id_docente; }
    public void setId_docente(Long id_docente) { this.id_docente = id_docente; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
}
