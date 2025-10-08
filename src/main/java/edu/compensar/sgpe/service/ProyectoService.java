package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Proyecto;
import jakarta.ejb.Stateless;

@Stateless
public class ProyectoService extends AbstractService<Proyecto> {
    public ProyectoService() { super(Proyecto.class); }
}
