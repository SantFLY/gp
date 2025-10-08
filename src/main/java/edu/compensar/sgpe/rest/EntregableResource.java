package edu.compensar.sgpe.rest;

import edu.compensar.sgpe.model.Entregable;
import edu.compensar.sgpe.service.EntregableService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.List;

@Path("/entregables")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class EntregableResource {
    @Inject private EntregableService service;
    @GET public List<Entregable> list(){ return service.findAll(); }
    @GET @Path("{id}") public Entregable get(@PathParam("id") Long id){ return service.find(id); }
    @POST public Response create(@jakarta.validation.Valid Entregable e){
        if (e.getActividad()==null || e.getEstudiante()==null) return Response.status(Response.Status.BAD_REQUEST).entity("Actividad y estudiante requeridos").build();
        if (e.getEstado()==null) e.setEstado("pendiente");
        e.setFecha_subida(LocalDateTime.now());
        service.create(e);
        return Response.status(Response.Status.CREATED).entity(e).build();
    }
    @PUT @Path("{id}") public Entregable update(@PathParam("id") Long id, @jakarta.validation.Valid Entregable e){ e.setId_entregable(id); return service.update(e); }
    @DELETE @Path("{id}") public Response delete(@PathParam("id") Long id){ service.delete(id); return Response.noContent().build(); }
}
