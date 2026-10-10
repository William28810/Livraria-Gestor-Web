/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.livrariagestor.livrariagestorweb.controller;

import com.livrariagestor.livrariagestorweb.model.Venda;
import com.livrariagestor.livrariagestorweb.repository.ClienteRepository;
import com.livrariagestor.livrariagestorweb.repository.VendaRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author William
 */
@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final JdbcTemplate jdbcTemplate;

    public VendaController(VendaRepository vendaRepository, ClienteRepository clienteRepository, JdbcTemplate jdbcTemplate) {
        this.vendaRepository = vendaRepository;
        this.clienteRepository = clienteRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Venda> listarVendas() {
        return vendaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venda> buscarVenda(@PathVariable Integer id) {
        return vendaRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> cadastrarVenda(@RequestBody Venda venda) {
        if (!relacionamentosValidos(venda)) {
            return ResponseEntity.badRequest().body("Cliente ou funcionário não encontrado.");
        }
        Venda vendaSalva = vendaRepository.save(venda);
        return ResponseEntity.status(HttpStatus.CREATED).body(vendaSalva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarVenda(@PathVariable Integer id, @RequestBody Venda venda) {
        if (!vendaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (!relacionamentosValidos(venda)) {
            return ResponseEntity.badRequest().body("Cliente ou funcionário não encontrado.");
        }
        venda.setId_venda(id);
        Venda vendaAtualizada = vendaRepository.save(venda);
        return ResponseEntity.ok(vendaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirVenda(@PathVariable Integer id) {
        if (!vendaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vendaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private boolean relacionamentosValidos(Venda venda) {
        if (!clienteRepository.existsById(venda.getId_cliente())) {
            return false;
        }
        Integer quantidade = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM usuario WHERE id_usuario = ?", Integer.class, venda.getId_usuario());
        return quantidade != null && quantidade > 0;
    }
}
