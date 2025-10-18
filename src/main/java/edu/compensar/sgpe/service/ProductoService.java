package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Productos;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;

@Stateless
public class ProductoService extends AbstractService<Productos> {
    
    @PersistenceContext(unitName = "sgpePU")
    private EntityManager em;
    
    public ProductoService() { super(Productos.class); }
    
    public List<Productos> findByProveedor(Long idProveedor) {
        try {
            TypedQuery<Productos> query = em.createQuery(
                "SELECT p FROM Productos p WHERE p.proveedor.id_proveedor = :idProveedor", 
                Productos.class
            );
            query.setParameter("idProveedor", idProveedor);
            return query.getResultList();
        } catch (Exception e) {
            System.err.println("Error buscando productos por proveedor: " + e.getMessage());
            return null;
        }
    }
}
