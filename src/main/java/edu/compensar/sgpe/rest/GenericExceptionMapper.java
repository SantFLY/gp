package edu.compensar.sgpe.rest;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import java.util.Map;

@Provider
public class GenericExceptionMapper implements ExceptionMapper<Throwable> {

    @Override
    public Response toResponse(Throwable ex) {
        Jsonb jb = JsonbBuilder.create();
        Map<String, String> payload = Map.of("error", "internal_error", "message", ex.getMessage() != null ? ex.getMessage() : "Unexpected error");
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(jb.toJson(payload)).build();
    }
}
