package edu.compensar.sgpe.model;

import jakarta.persistence.*;

@Entity
@Table(name = "proveedores")
public class Proovedores {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_proveedor;

    private String nombre;
    private String telefono;
    private String email;

    // Getters y Setters
    public Long getId_proveedor() { return id_proveedor; }
    public void setId_proveedor(Long id_proveedor) { this.id_proveedor = id_proveedor; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
