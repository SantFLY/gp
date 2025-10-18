package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Clientes;
import jakarta.ejb.Stateless;

@Stateless
public class ClienteService extends AbstractService<Clientes> {
    public ClienteService() { super(Clientes.class); }
}
