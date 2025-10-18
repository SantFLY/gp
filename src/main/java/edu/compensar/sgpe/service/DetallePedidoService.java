package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Detalle_Pedidos;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;

@Stateless
public class DetallePedidoService extends AbstractService<Detalle_Pedidos> {
    
    @PersistenceContext(unitName = "sgpePU")
    private EntityManager em;
    
    public DetallePedidoService() { super(Detalle_Pedidos.class); }
    
    public List<Detalle_Pedidos> findByProducto(Long idProducto) {
        try {
            TypedQuery<Detalle_Pedidos> query = em.createQuery(
                "SELECT d FROM Detalle_Pedidos d WHERE d.producto.id_producto = :idProducto", 
                Detalle_Pedidos.class
            );
            query.setParameter("idProducto", idProducto);
            return query.getResultList();
        } catch (Exception e) {
            System.err.println("Error buscando detalles por producto: " + e.getMessage());
            return null;
        }
    }
}
