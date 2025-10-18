package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Historial_Pedidos;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;

@Stateless
public class HistorialPedidoService extends AbstractService<Historial_Pedidos> {
    
    @PersistenceContext(unitName = "sgpePU")
    private EntityManager em;
    
    public HistorialPedidoService() { super(Historial_Pedidos.class); }
    
    public List<Historial_Pedidos> findByPedido(Long idPedido) {
        try {
            TypedQuery<Historial_Pedidos> query = em.createQuery(
                "SELECT h FROM Historial_Pedidos h WHERE h.pedido.id_pedido = :idPedido", 
                Historial_Pedidos.class
            );
            query.setParameter("idPedido", idPedido);
            return query.getResultList();
        } catch (Exception e) {
            System.err.println("Error buscando historial por pedido: " + e.getMessage());
            return null;
        }
    }
}
