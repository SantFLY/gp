package edu.compensar.sgpe.rest;

import edu.compensar.sgpe.model.Proyecto;
import edu.compensar.sgpe.service.ProyectoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/proyectos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProyectoResource {
    @Inject private ProyectoService service;
    @GET public List<Proyecto> list(){ return service.findAll(); }
    @GET @Path("{id}") public Proyecto get(@PathParam("id") Long id){ return service.find(id); }
    @POST public Response create(@jakarta.validation.Valid Proyecto p){
        if (p.getNombre()==null) return Response.status(Response.Status.BAD_REQUEST).entity("Nombre requerido").build();
        service.create(p);
        return Response.status(Response.Status.CREATED).entity(p).build();
    }
    @PUT @Path("{id}") public Proyecto update(@PathParam("id") Long id, @jakarta.validation.Valid Proyecto p){ p.setId_proyecto(id); return service.update(p); }
    @DELETE @Path("{id}") public Response delete(@PathParam("id") Long id){ service.delete(id); return Response.noContent().build(); }
}
