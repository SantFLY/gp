package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.*;
import edu.compensar.sgpe.rest.InventarioResource;
import edu.compensar.sgpe.rest.InventarioResource.PedidoDTO;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class PedidoService extends AbstractService<Pedidos> {

    @PersistenceContext(unitName = "sgpePU")
    private EntityManager em;
    
    @EJB private ClienteService clienteService;
    @EJB private ProductoService productoService;
    @EJB private DetallePedidoService detalleService;

    public PedidoService() { super(Pedidos.class); }
    
    public List<Pedidos> findByCliente(Long idCliente) {
        try {
            TypedQuery<Pedidos> query = em.createQuery(
                "SELECT p FROM Pedidos p WHERE p.cliente.id_cliente = :idCliente", 
                Pedidos.class
            );
            query.setParameter("idCliente", idCliente);
            return query.getResultList();
        } catch (Exception e) {
            System.err.println("Error buscando pedidos por cliente: " + e.getMessage());
            return null;
        }
    }

    /**
     * Crea un pedido con multiples items y actualiza stock en la misma transacción.
     * Lanza IllegalArgumentException en caso de fallo de validación (cliente/producto inexistente o stock insuficiente)
     */
    @Transactional
    public Pedidos createPedidoConItems(PedidoDTO dto) {
        System.out.println("=== INICIO createPedidoConItems ===");
        System.out.println("DTO recibido: " + dto);
        
        if (dto == null || dto.id_cliente == null || dto.items == null || dto.items.isEmpty()) {
            System.err.println("Payload de pedido inválido");
            throw new IllegalArgumentException("Payload de pedido inválido");
        }

        System.out.println("Buscando cliente con ID: " + dto.id_cliente);
        Clientes cliente = clienteService.find(dto.id_cliente);
        System.out.println("Cliente encontrado: " + cliente);
        if (cliente == null) throw new IllegalArgumentException("Cliente no existe: " + dto.id_cliente);

        // crear pedido
        Pedidos pedido = new Pedidos();
        pedido.setCliente(cliente);
        pedido.setFecha_pedido(LocalDate.now());
        pedido.setEstado("pendiente");
        this.create(pedido); // persiste pedido y asigna id
        
        // Refrescar el pedido para asegurar que el cliente esté cargado
        em.refresh(pedido);
        System.out.println("Pedido creado con cliente: " + pedido.getCliente());

        List<Detalle_Pedidos> detalles = new ArrayList<>();
        System.out.println("Procesando " + dto.items.size() + " items");
        System.out.println("Items recibidos: " + dto.items);

        for (PedidoDTO.Item it : dto.items) {
            System.out.println("Procesando item: producto=" + it.id_producto + ", cantidad=" + it.cantidad);
            Productos prod = productoService.find(it.id_producto);
            System.out.println("Producto encontrado: " + prod);
            if (prod == null) throw new IllegalArgumentException("Producto no existe: " + it.id_producto);
            if (prod.getStock() == null) prod.setStock(0);
            System.out.println("Stock actual: " + prod.getStock() + ", cantidad solicitada: " + it.cantidad);
            if (prod.getStock() < it.cantidad) throw new IllegalArgumentException("Stock insuficiente para: " + prod.getNombre());

            // reducir stock
            prod.setStock(prod.getStock() - it.cantidad);
            productoService.update(prod);

            // crear detalle
            Detalle_Pedidos det = new Detalle_Pedidos();
            det.setPedido(pedido);
            det.setProducto(prod);
            det.setCantidad(it.cantidad);
            det.setPrecio_unitario(prod.getPrecio());
            detalleService.create(det);
            detalles.add(det);
        }

        pedido.setDetalles(detalles);
        this.update(pedido); // guardar relación detalles (opcional según mapeo)
        System.out.println("Detalles creados: " + detalles.size());
        System.out.println("Detalles del pedido: " + pedido.getDetalles());
        System.out.println("=== FIN createPedidoConItems - Pedido creado con ID: " + pedido.getId_pedido() + " ===");
        return pedido;
    }

    
    public static class InventarioPedidoDTO {
        public Long id_cliente;
        public List<Item> items;
        public static class Item { public Long id_producto; public Integer cantidad; }
    }
}
