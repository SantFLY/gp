package edu.compensar.sgpe.rest;

import edu.compensar.sgpe.model.Docente;
import edu.compensar.sgpe.service.DocenteService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/docentes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class DocenteResource {
    @Inject private DocenteService service;
    @GET public List<Docente> list(){ return service.findAll(); }
    @GET @Path("{id}") public Docente get(@PathParam("id") Long id){ return service.find(id); }
    @POST public Response create(@jakarta.validation.Valid Docente d){
        if (d.getNombre()==null) return Response.status(Response.Status.BAD_REQUEST).entity("Nombre requerido").build();
        service.create(d);
        return Response.status(Response.Status.CREATED).entity(d).build();
    }
    @PUT @Path("{id}") public Docente update(@PathParam("id") Long id, @jakarta.validation.Valid Docente d){ d.setId_docente(id); return service.update(d); }
    @DELETE @Path("{id}") public Response delete(@PathParam("id") Long id){ service.delete(id); return Response.noContent().build(); }
}
