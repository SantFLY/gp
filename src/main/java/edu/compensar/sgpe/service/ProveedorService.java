package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Proovedores;
import jakarta.ejb.Stateless;

@Stateless
public class ProveedorService extends AbstractService<Proovedores> {
    public ProveedorService() { super(Proovedores.class); }
}
