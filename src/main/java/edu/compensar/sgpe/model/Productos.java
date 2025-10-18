package edu.compensar.sgpe.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Productos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_producto;

    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proovedores proveedor;

    // Getters y Setters
    public Long getId_producto() { return id_producto; }
    public void setId_producto(Long id_producto) { this.id_producto = id_producto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Proovedores getProveedor() { return proveedor; }
    public void setProveedor(Proovedores proveedor) { this.proveedor = proveedor; }
}
