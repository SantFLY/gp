package edu.compensar.sgpe.rest;

import edu.compensar.sgpe.model.Actividad;
import edu.compensar.sgpe.service.ActividadService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/actividades")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ActividadResource {
    @Inject private ActividadService service;
    @GET public List<Actividad> list(){ return service.findAll(); }
    @GET @Path("{id}") public Actividad get(@PathParam("id") Long id){ return service.find(id); }
    @POST public Response create(@jakarta.validation.Valid Actividad a){
        if (a.getNombre()==null) return Response.status(Response.Status.BAD_REQUEST).entity("Nombre requerido").build();
        service.create(a);
        return Response.status(Response.Status.CREATED).entity(a).build();
    }
    @PUT @Path("{id}") public Actividad update(@PathParam("id") Long id, @jakarta.validation.Valid Actividad a){ a.setId_actividad(id); return service.update(a); }
    @DELETE @Path("{id}") public Response delete(@PathParam("id") Long id){ service.delete(id); return Response.noContent().build(); }
}
