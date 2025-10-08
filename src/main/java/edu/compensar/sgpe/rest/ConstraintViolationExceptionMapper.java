package edu.compensar.sgpe.rest;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import java.util.*;

@Provider
public class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    static class Violation {
        public String property;
        public String message;
        public Violation(String property, String message) { this.property = property; this.message = message; }
    }

    static class ErrorResponse {
        public String error = "validation_error";
        public List<Violation> violations = new ArrayList<>();
    }

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        ErrorResponse er = new ErrorResponse();
        for (ConstraintViolation<?> v : exception.getConstraintViolations()) {
            String prop = v.getPropertyPath() != null ? v.getPropertyPath().toString() : null;
            er.violations.add(new Violation(prop, v.getMessage()));
        }
        Jsonb jb = JsonbBuilder.create();
        return Response.status(Response.Status.BAD_REQUEST).entity(jb.toJson(er)).build();
    }
}
