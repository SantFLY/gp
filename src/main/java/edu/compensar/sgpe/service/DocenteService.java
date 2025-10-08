package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Docente;
import jakarta.ejb.Stateless;

@Stateless
public class DocenteService extends AbstractService<Docente> {
    public DocenteService() { super(Docente.class); }
}
