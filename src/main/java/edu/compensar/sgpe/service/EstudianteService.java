package edu.compensar.sgpe.service;

import edu.compensar.sgpe.model.Estudiante;
import jakarta.ejb.Stateless;

@Stateless
public class EstudianteService extends AbstractService<Estudiante> {
    public EstudianteService() { super(Estudiante.class); }
}
