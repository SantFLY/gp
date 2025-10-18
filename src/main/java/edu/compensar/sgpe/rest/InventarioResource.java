package edu.compensar.sgpe.rest;

import edu.compensar.sgpe.model.*;
import edu.compensar.sgpe.service.*;
import edu.compensar.sgpe.dto.PedidoDTO;
import edu.compensar.sgpe.dto.PedidoDetalleDTO;
import edu.compensar.sgpe.dto.HistorialDTO;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.util.*;
import java.time.LocalDate;

@Stateless
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InventarioResource {

    @EJB private ProductoService productoService;
    @EJB private ProveedorService proveedorService;
    @EJB private ClienteService clienteService;
    @EJB private PedidoService pedidoService;
    @EJB private DetallePedidoService detalleService;
    @EJB private HistorialPedidoService historialService;

    // --------- PRODUCTOS ----------
    @GET @Path("/productos")
    public Response getProductos() {
        return Response.ok(productoService.findAll()).build();
    }

    @GET @Path("/productos/{id}")
    public Response getProducto(@PathParam("id") Long id) {
        Productos p = productoService.find(id);
        if (p == null) return Response.status(Response.Status.NOT_FOUND).entity("Producto no encontrado").build();
        return Response.ok(p).build();
    }

    @POST @Path("/productos")
    public Response crearProducto(Productos producto, @Context UriInfo uriInfo) {
        productoService.create(producto);
        UriBuilder ub = uriInfo.getAbsolutePathBuilder().path(producto.getId_producto().toString());
        return Response.created(ub.build()).entity(producto).build();
    }

    @PUT @Path("/productos/{id}")
    public Response actualizarProducto(@PathParam("id") Long id, Productos payload) {
        Productos p = productoService.find(id);
        if (p == null) return Response.status(Response.Status.NOT_FOUND).entity("Producto no encontrado").build();
        p.setNombre(payload.getNombre());
        p.setDescripcion(payload.getDescripcion());
        p.setPrecio(payload.getPrecio());
        p.setStock(payload.getStock());
        p.setProveedor(payload.getProveedor());
        productoService.update(p);
        return Response.ok(p).build();
    }

    @DELETE @Path("/productos/{id}")
    public Response borrarProducto(@PathParam("id") Long id) {
        try {
        Productos p = productoService.find(id);
        if (p == null) return Response.status(Response.Status.NOT_FOUND).entity("Producto no encontrado").build();
            
            List<Detalle_Pedidos> detalles = detalleService.findByProducto(id);
            if (detalles != null && !detalles.isEmpty()) {
                return Response.status(Response.Status.CONFLICT)
                    .entity("No se puede eliminar el producto porque tiene pedidos asociados. Elimine primero los pedidos relacionados.").build();
            }
            
        productoService.delete(id);
        return Response.noContent().build();
        } catch (Exception e) {
            System.err.println("Error eliminando producto: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error eliminando producto: " + e.getMessage()).build();
        }
    }

    // --------- PROVEEDORES ----------
    @GET @Path("/proveedores")
    public Response getProveedores() {
        return Response.ok(proveedorService.findAll()).build();
    }

    @GET @Path("/proveedores/{id}")
    public Response getProveedor(@PathParam("id") Long id) {
        Proovedores prov = proveedorService.find(id);
        if (prov == null) return Response.status(Response.Status.NOT_FOUND).entity("Proveedor no encontrado").build();
        return Response.ok(prov).build();
    }

    @POST @Path("/proveedores")
    public Response crearProveedor(Proovedores proveedor, @Context UriInfo ui) {
        proveedorService.create(proveedor);
        UriBuilder ub = ui.getAbsolutePathBuilder().path(proveedor.getId_proveedor().toString());
        return Response.created(ub.build()).entity(proveedor).build();
    }

    @PUT @Path("/proveedores/{id}")
    public Response actualizarProveedor(@PathParam("id") Long id, Proovedores payload) {
        Proovedores prov = proveedorService.find(id);
        if (prov == null) return Response.status(Response.Status.NOT_FOUND).entity("Proveedor no encontrado").build();
        prov.setNombre(payload.getNombre());
        prov.setTelefono(payload.getTelefono());
        prov.setEmail(payload.getEmail());
        proveedorService.update(prov);
        return Response.ok(prov).build();
    }

    @DELETE @Path("/proveedores/{id}")
    public Response borrarProveedor(@PathParam("id") Long id) {
        try {
        Proovedores prov = proveedorService.find(id);
        if (prov == null) return Response.status(Response.Status.NOT_FOUND).entity("Proveedor no encontrado").build();
            
            List<Productos> productos = productoService.findByProveedor(id);
            if (productos != null && !productos.isEmpty()) {
                return Response.status(Response.Status.CONFLICT)
                    .entity("No se puede eliminar el proveedor porque tiene productos asociados. Elimine primero los productos relacionados.").build();
            }
            
        proveedorService.delete(id);
        return Response.noContent().build();
        } catch (Exception e) {
            System.err.println("Error eliminando proveedor: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error eliminando proveedor: " + e.getMessage()).build();
        }
    }

    // --------- CLIENTES ----------
    @GET @Path("/clientes")
    public Response getClientes() {
        return Response.ok(clienteService.findAll()).build();
    }

    @GET @Path("/clientes/{id}")
    public Response getCliente(@PathParam("id") Long id) {
        Clientes c = clienteService.find(id);
        if (c == null) return Response.status(Response.Status.NOT_FOUND).entity("Cliente no encontrado").build();
        return Response.ok(c).build();
    }

    @POST @Path("/clientes")
    public Response crearCliente(Clientes cliente, @Context UriInfo ui) {
        clienteService.create(cliente);
        UriBuilder ub = ui.getAbsolutePathBuilder().path(cliente.getId_cliente().toString());
        return Response.created(ub.build()).entity(cliente).build();
    }

    @PUT @Path("/clientes/{id}")
    public Response actualizarCliente(@PathParam("id") Long id, Clientes payload) {
        Clientes c = clienteService.find(id);
        if (c == null) return Response.status(Response.Status.NOT_FOUND).entity("Cliente no encontrado").build();
        c.setNombre(payload.getNombre());
        c.setDireccion(payload.getDireccion());
        c.setTelefono(payload.getTelefono());
        c.setEmail(payload.getEmail());
        clienteService.update(c);
        return Response.ok(c).build();
    }

    @DELETE @Path("/clientes/{id}")
    public Response borrarCliente(@PathParam("id") Long id) {
        try {
        Clientes c = clienteService.find(id);
        if (c == null) return Response.status(Response.Status.NOT_FOUND).entity("Cliente no encontrado").build();
            
            List<Pedidos> pedidos = pedidoService.findByCliente(id);
            if (pedidos != null && !pedidos.isEmpty()) {
                return Response.status(Response.Status.CONFLICT)
                    .entity("No se puede eliminar el cliente porque tiene pedidos asociados. Elimine primero los pedidos relacionados.").build();
            }
            
        clienteService.delete(id);
        return Response.noContent().build();
        } catch (Exception e) {
            System.err.println("Error eliminando cliente: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error eliminando cliente: " + e.getMessage()).build();
        }
    }

    // --------- PEDIDOS ----------
    // DTO para recibir pedidos con múltiples productos
    public static class PedidoDTO {
        public Long id_cliente;
        public List<Item> items;
        public static class Item { public Long id_producto; public Integer cantidad; }
    }

    @POST @Path("/pedidos")
    public Response crearPedido(PedidoDTO dto, @Context UriInfo ui) {
        try {
            System.out.println("Recibido pedido: " + dto);
            System.out.println("Cliente ID: " + dto.id_cliente);
            System.out.println("Items: " + dto.items);
            
            if (dto == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Datos de pedido no válidos").build();
            }
            
            if (dto.id_cliente == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("ID de cliente requerido").build();
            }
            
            if (dto.items == null || dto.items.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Debe incluir al menos un producto").build();
            }
            
            Pedidos creado = pedidoService.createPedidoConItems(dto);
            
            edu.compensar.sgpe.dto.PedidoDTO responseDTO = new edu.compensar.sgpe.dto.PedidoDTO();
            responseDTO.setId_pedido(creado.getId_pedido());
            responseDTO.setId_cliente(creado.getCliente() != null ? creado.getCliente().getId_cliente() : null);
            responseDTO.setNombre_cliente(creado.getCliente() != null ? creado.getCliente().getNombre() : "Sin cliente");
            responseDTO.setFecha_pedido(creado.getFecha_pedido());
            responseDTO.setEstado(creado.getEstado());
            
            UriBuilder ub = ui.getAbsolutePathBuilder().path("pedidos").path(creado.getId_pedido().toString());
            return Response.created(ub.build()).entity(responseDTO).build();
        } catch (IllegalArgumentException ex) {
            System.err.println("Error de validación: " + ex.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(ex.getMessage()).build();
        } catch (Exception ex) {
            System.err.println("Error interno: " + ex.getMessage());
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al crear pedido: " + ex.getMessage()).build();
        }
    }

    @GET @Path("/pedidos/{id}")
    public Response getPedido(@PathParam("id") Long id) {
        try {
        Pedidos p = pedidoService.find(id);
        if (p == null) return Response.status(Response.Status.NOT_FOUND).entity("Pedido no encontrado").build();
            
            PedidoDetalleDTO dto = new PedidoDetalleDTO();
            dto.setId_pedido(p.getId_pedido());
            dto.setId_cliente(p.getCliente() != null ? p.getCliente().getId_cliente() : null);
            dto.setNombre_cliente(p.getCliente() != null ? p.getCliente().getNombre() : "Sin cliente");
            dto.setFecha_pedido(p.getFecha_pedido());
            dto.setEstado(p.getEstado());
            
            // Cargar detalles de productos
            List<PedidoDetalleDTO.DetalleProductoDTO> productos = new ArrayList<>();
            if (p.getDetalles() != null) {
                for (Detalle_Pedidos detalle : p.getDetalles()) {
                    PedidoDetalleDTO.DetalleProductoDTO productoDTO = new PedidoDetalleDTO.DetalleProductoDTO(
                        detalle.getProducto().getId_producto(),
                        detalle.getProducto().getNombre(),
                        detalle.getCantidad(),
                        detalle.getPrecio_unitario()
                    );
                    productos.add(productoDTO);
                }
            }
            dto.setProductos(productos);
            
            return Response.ok(dto).build();
        } catch (Exception e) {
            System.err.println("Error obteniendo pedido: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error obteniendo pedido: " + e.getMessage()).build();
        }
    }

    @GET @Path("/pedidos")
    public Response listPedidos() {
        try {
            List<Pedidos> pedidos = pedidoService.findAll();
            List<edu.compensar.sgpe.dto.PedidoDTO> pedidosDTO = new ArrayList<>();
            
            for (Pedidos pedido : pedidos) {
                edu.compensar.sgpe.dto.PedidoDTO dto = new edu.compensar.sgpe.dto.PedidoDTO();
                dto.setId_pedido(pedido.getId_pedido());
                dto.setId_cliente(pedido.getCliente() != null ? pedido.getCliente().getId_cliente() : null);
                dto.setNombre_cliente(pedido.getCliente() != null ? pedido.getCliente().getNombre() : "Sin cliente");
                dto.setFecha_pedido(pedido.getFecha_pedido());
                dto.setEstado(pedido.getEstado());
                pedidosDTO.add(dto);
            }
            
            return Response.ok(pedidosDTO).build();
        } catch (Exception e) {
            System.err.println("Error listando pedidos: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error listando pedidos: " + e.getMessage()).build();
        }
    }

    @DELETE @Path("/pedidos/{id}")
    public Response borrarPedido(@PathParam("id") Long id) {
        try {
            Pedidos p = pedidoService.find(id);
            if (p == null) return Response.status(Response.Status.NOT_FOUND).entity("Pedido no encontrado").build();
            
            if (p.getDetalles() != null) {
                for (Detalle_Pedidos detalle : p.getDetalles()) {
                    detalleService.delete(detalle.getId_detalle());
                }
            }
            
            pedidoService.delete(id);
            return Response.noContent().build();
        } catch (Exception e) {
            System.err.println("Error eliminando pedido: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error eliminando pedido: " + e.getMessage()).build();
        }
    }

    @PUT @Path("/pedidos/{id}/entregar")
    public Response marcarComoEntregado(@PathParam("id") Long id) {
        try {
            System.out.println("=== INICIO marcarComoEntregado ===");
            System.out.println("ID del pedido: " + id);
            
            Pedidos p = pedidoService.find(id);
            if (p == null) {
                System.out.println("Pedido no encontrado con ID: " + id);
                return Response.status(Response.Status.NOT_FOUND).entity("Pedido no encontrado").build();
            }
            
            System.out.println("Pedido encontrado - Estado actual: " + p.getEstado());
            
            p.setEstado("entregado");
            pedidoService.update(p);
            System.out.println("Estado actualizado a: " + p.getEstado());
            
            try {
                Historial_Pedidos historial = new Historial_Pedidos();
                historial.setPedido(p);
                historial.setFecha_entrega(java.time.LocalDate.now());
                historial.setEstado_entrega("entregado");
                historialService.create(historial);
                System.out.println("Registro de historial creado con ID: " + historial.getId_entrega());
            } catch (Exception e) {
                System.err.println("Error creando historial: " + e.getMessage());
                e.printStackTrace();
                // Continuar sin historial por ahora
            }
            
            edu.compensar.sgpe.dto.PedidoDTO responseDTO = new edu.compensar.sgpe.dto.PedidoDTO();
            responseDTO.setId_pedido(p.getId_pedido());
            responseDTO.setId_cliente(p.getCliente() != null ? p.getCliente().getId_cliente() : null);
            responseDTO.setNombre_cliente(p.getCliente() != null ? p.getCliente().getNombre() : "Sin cliente");
            responseDTO.setFecha_pedido(p.getFecha_pedido());
            responseDTO.setEstado(p.getEstado());
            
            System.out.println("=== FIN marcarComoEntregado - Respuesta enviada ===");
            return Response.ok(responseDTO).build();
        } catch (Exception e) {
            System.err.println("Error marcando pedido como entregado: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error marcando pedido como entregado: " + e.getMessage()).build();
        }
    }

    // --------- ELIMINACIÓN EN CASCADA ----------
    @DELETE @Path("/clientes/{id}/forzar")
    public Response borrarClienteForzado(@PathParam("id") Long id) {
        try {
            Clientes c = clienteService.find(id);
            if (c == null) return Response.status(Response.Status.NOT_FOUND).entity("Cliente no encontrado").build();
            
            // Eliminar pedidos del cliente primero
            List<Pedidos> pedidos = pedidoService.findByCliente(id);
            if (pedidos != null && !pedidos.isEmpty()) {
                for (Pedidos pedido : pedidos) {
                    // Eliminar detalles del pedido
                    if (pedido.getDetalles() != null) {
                        for (Detalle_Pedidos detalle : pedido.getDetalles()) {
                            detalleService.delete(detalle.getId_detalle());
                        }
                    }
                    // Eliminar historial del pedido
                    List<Historial_Pedidos> historial = historialService.findByPedido(pedido.getId_pedido());
                    if (historial != null) {
                        for (Historial_Pedidos h : historial) {
                            historialService.delete(h.getId_entrega());
                        }
                    }
                    // Eliminar el pedido
                    pedidoService.delete(pedido.getId_pedido());
                }
            }
            
            // Ahora eliminar el cliente
            clienteService.delete(id);
            return Response.noContent().build();
        } catch (Exception e) {
            System.err.println("Error eliminando cliente forzado: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error eliminando cliente: " + e.getMessage()).build();
        }
    }

    @DELETE @Path("/proveedores/{id}/forzar")
    public Response borrarProveedorForzado(@PathParam("id") Long id) {
        try {
            Proovedores prov = proveedorService.find(id);
            if (prov == null) return Response.status(Response.Status.NOT_FOUND).entity("Proveedor no encontrado").build();
            
            // Eliminar productos del proveedor primero
            List<Productos> productos = productoService.findByProveedor(id);
            if (productos != null && !productos.isEmpty()) {
                for (Productos producto : productos) {
                    // Verificar si el producto tiene pedidos
                    List<Detalle_Pedidos> detalles = detalleService.findByProducto(producto.getId_producto());
                    if (detalles != null && !detalles.isEmpty()) {
                        return Response.status(Response.Status.CONFLICT)
                            .entity("No se puede eliminar el proveedor porque sus productos tienen pedidos asociados.").build();
                    }
                    productoService.delete(producto.getId_producto());
                }
            }
            
            // Ahora eliminar el proveedor
            proveedorService.delete(id);
            return Response.noContent().build();
        } catch (Exception e) {
            System.err.println("Error eliminando proveedor forzado: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error eliminando proveedor: " + e.getMessage()).build();
        }
    }

    // --------- PRUEBA DE HISTORIAL ----------
    @POST @Path("/historial/test")
    public Response crearHistorialTest() {
        try {
            System.out.println("=== CREANDO HISTORIAL DE PRUEBA ===");
            
            // Buscar un pedido existente
            List<Pedidos> pedidos = pedidoService.findAll();
            if (pedidos.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).entity("No hay pedidos para crear historial").build();
            }
            
            Pedidos pedido = pedidos.get(0);
            System.out.println("Usando pedido: " + pedido.getId_pedido());
            
            Historial_Pedidos historial = new Historial_Pedidos();
            historial.setPedido(pedido);
            historial.setFecha_entrega(java.time.LocalDate.now());
            historial.setEstado_entrega("entregado");
            
            System.out.println("Creando historial...");
            historialService.create(historial);
            System.out.println("Historial creado con ID: " + historial.getId_entrega());
            
            HistorialDTO dto = new HistorialDTO();
            dto.setId_entrega(historial.getId_entrega());
            dto.setId_pedido(pedido.getId_pedido());
            dto.setFecha_entrega(historial.getFecha_entrega());
            dto.setEstado_entrega(historial.getEstado_entrega());
            
            return Response.ok(dto).build();
        } catch (Exception e) {
            System.err.println("Error creando historial de prueba: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error creando historial: " + e.getMessage()).build();
        }
    }

    // --------- HISTORIAL DE ENTREGAS ----------
    @GET @Path("/historial/{idCliente}")
    public Response historialPorCliente(@PathParam("idCliente") Long idCliente) {
        try {
            // Verificar que el cliente existe
            Clientes cliente = clienteService.find(idCliente);
            if (cliente == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Cliente no encontrado").build();
            }
            
            // Obtener todos los registros de historial
            List<Historial_Pedidos> historialCompleto = historialService.findAll();
            List<HistorialDTO> historialCliente = new ArrayList<>();
            
            // Filtrar por cliente y convertir a DTO
            for (Historial_Pedidos h : historialCompleto) {
                if (h.getPedido() != null && 
                    h.getPedido().getCliente() != null && 
                    h.getPedido().getCliente().getId_cliente().equals(idCliente)) {
                    
                    HistorialDTO dto = new HistorialDTO();
                    dto.setId_entrega(h.getId_entrega());
                    dto.setId_pedido(h.getPedido().getId_pedido());
                    dto.setFecha_entrega(h.getFecha_entrega());
                    dto.setEstado_entrega(h.getEstado_entrega());
                    historialCliente.add(dto);
                }
            }
            
            return Response.ok(historialCliente).build();
        } catch (Exception e) {
            System.err.println("Error obteniendo historial: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error obteniendo historial: " + e.getMessage()).build();
        }
    }
}
