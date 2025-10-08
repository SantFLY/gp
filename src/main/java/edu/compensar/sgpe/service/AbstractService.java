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
    public void create(T entity) { em.persist(entity); }
    
    @Transactional
    public T update(T entity) { return em.merge(entity); }
    
    @Transactional
    public void delete(Object id) { T ref = em.find(entityClass, id); if (ref != null) em.remove(ref); }
    
    public T find(Object id) { return em.find(entityClass, id); }
    
    public List<T> findAll() {
        return em.createQuery("SELECT e FROM " + entityClass.getSimpleName() + " e", entityClass).getResultList();
    }
}
