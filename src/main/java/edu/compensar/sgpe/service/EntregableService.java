package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Entregable;
import jakarta.ejb.Stateless;

@Stateless
public class EntregableService extends AbstractService<Entregable> {
    public EntregableService() { super(Entregable.class); }
}
