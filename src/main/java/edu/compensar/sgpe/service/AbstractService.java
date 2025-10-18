package edu.compensar.sgpe.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;

public abstract class AbstractService<T> {
    private Class<T> entityClass;

    public AbstractService(Class<T> entityClass) { this.entityClass = entityClass; }

    @PersistenceContext(unitName = "sgpePU")
    protected EntityManager em;

    @Transactional
    public void create(T entity) { 
        try {
            em.persist(entity); 
            em.flush();
        } catch (Exception e) {
            throw new RuntimeException("Error creando entidad: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public T update(T entity) { 
        try {
            T result = em.merge(entity); 
            em.flush();
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error actualizando entidad: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public void delete(Object id) { 
        try {
            T ref = em.find(entityClass, id); 
            if (ref != null) {
                em.remove(ref);
                em.flush();
            }
        } catch (Exception e) {
            throw new RuntimeException("Error eliminando entidad: " + e.getMessage(), e);
        }
    }
    
    public T find(Object id) { 
        try {
            return em.find(entityClass, id); 
        } catch (Exception e) {
            throw new RuntimeException("Error buscando entidad: " + e.getMessage(), e);
        }
    }
    
    public List<T> findAll() {
        try {
            return em.createQuery("SELECT e FROM " + entityClass.getSimpleName() + " e", entityClass).getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Error listando entidades: " + e.getMessage(), e);
        }
    }
}
