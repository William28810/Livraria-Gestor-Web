/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.livrariagestor.livrariagestorweb.repository;

import com.livrariagestor.livrariagestorweb.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author William
 */
public interface LivroRepository extends JpaRepository<Livro, Integer> {
    
}
