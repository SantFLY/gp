package edu.compensar.sgpe.rest;

import edu.compensar.sgpe.model.Estudiante;
import edu.compensar.sgpe.service.EstudianteService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/estudiantes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class EstudianteResource {

    @Inject
    private EstudianteService service;

    @GET
    public List<Estudiante> list() { return service.findAll(); }

    @GET
    @Path("{id}")
    public Estudiante get(@PathParam("id") Long id) { return service.find(id); }

    @POST
    public Response create(@jakarta.validation.Valid Estudiante e) {
        if (e.getNombre() == null || e.getCorreo() == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Nombre y correo son requeridos").build();
        }
        service.create(e);
        return Response.status(Response.Status.CREATED).entity(e).build();
    }

    @PUT
    @Path("{id}")
    public Estudiante update(@PathParam("id") Long id, @jakarta.validation.Valid Estudiante e) {
        e.setId_estudiante(id);
        return service.update(e);
    }

    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
