/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.livrariagestor.livrariagestorweb.controller;

import com.livrariagestor.livrariagestorweb.model.Livro;
import com.livrariagestor.livrariagestorweb.repository.LivroRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

/**
 *
 * @author William
 */
@RestController
@RequestMapping("/api/livros")
public class LivroController {
    private final LivroRepository livroRepository;

    public LivroController(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    @GetMapping
    public List<Livro> listarLivros() {
        return livroRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public Livro buscarLivro(@PathVariable Integer id) {
        return livroRepository.findById(id).orElse(null);
    }
    
    @PostMapping
    public Livro cadastrarLivro(@RequestBody Livro livro) {
        return livroRepository.save(livro);
    }
    
    @PutMapping("/{id}")
    public Livro atualizarLivro(@PathVariable Integer id, @RequestBody Livro livro) {
        livro.setId_livro(id);
        return livroRepository.save(livro);
    }
    
    @DeleteMapping("/{id}")
    public void excluirLivro(@PathVariable Integer id) {
        livroRepository.deleteById(id);
    }
}
