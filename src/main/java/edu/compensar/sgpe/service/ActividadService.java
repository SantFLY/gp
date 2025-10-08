package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Actividad;
import jakarta.ejb.Stateless;

@Stateless
public class ActividadService extends AbstractService<Actividad> {
    public ActividadService() { super(Actividad.class); }
}
