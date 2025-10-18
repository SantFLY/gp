package edu.compensar.sgpe.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Clientes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cliente;

    private String nombre;
    private String direccion;
    private String telefono;
    private String email;

    // Getters y Setters
    public Long getId_cliente() { return id_cliente; }
    public void setId_cliente(Long id_cliente) { this.id_cliente = id_cliente; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
