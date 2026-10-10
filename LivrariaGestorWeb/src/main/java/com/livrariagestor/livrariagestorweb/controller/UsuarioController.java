/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.livrariagestor.livrariagestorweb.controller;

import com.livrariagestor.livrariagestorweb.model.Usuario;
import com.livrariagestor.livrariagestorweb.repository.UsuarioRepository;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 *
 * @author William
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Map<String, Object>> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(usuario -> {
                    Map<String, Object> dados = new java.util.LinkedHashMap<>();
                    dados.put("id_usuario", usuario.getId_usuario());
                    dados.put("nome_funcionario", usuario.getNome_funcionario());
                    dados.put("cargo", usuario.getCargo() == null ? "" : usuario.getCargo());
                    dados.put("nivel_permissao", usuario.getNivel_permissao() == null
                            ? "" : usuario.getNivel_permissao());
                    dados.put("login", usuario.getLogin() == null ? "" : usuario.getLogin());
                    return dados;
                })
                .toList();
    }
    
    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        if (usuario.getNome_funcionario() == null
                || usuario.getNome_funcionario().isBlank()
                || usuario.getLogin() == null
                || usuario.getLogin().isBlank()
                || usuario.getSenha() == null
                || usuario.getSenha().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Nome, login e senha são obrigatórios.");
        }

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                java.util.Map.of(
                        "id_usuario", usuarioSalvo.getId_usuario(),
                        "nome_funcionario", usuarioSalvo.getNome_funcionario(),
                        "cargo", usuarioSalvo.getCargo() == null ? "" : usuarioSalvo.getCargo(),
                        "nivel_permissao", usuarioSalvo.getNivel_permissao() == null
                                ? "" : usuarioSalvo.getNivel_permissao(),
                        "login", usuarioSalvo.getLogin() == null ? "" : usuarioSalvo.getLogin()
                )
        );
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(
            @PathVariable Integer id,
            @RequestBody Usuario usuario) {

        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        if (usuario.getNome_funcionario() == null
                || usuario.getNome_funcionario().isBlank()
                || usuario.getCargo() == null
                || usuario.getCargo().isBlank()
                || usuario.getNivel_permissao() == null
                || usuario.getNivel_permissao().isBlank()
                || usuario.getLogin() == null
                || usuario.getLogin().isBlank()
                || usuario.getSenha() == null
                || usuario.getSenha().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Preencha todos os campos obrigatórios.");
        }

        usuario.setId_usuario(id);
        Usuario usuarioAtualizado = usuarioRepository.save(usuario);

        java.util.Map<String, Object> dados = new java.util.LinkedHashMap<>();
        dados.put("id_usuario", usuarioAtualizado.getId_usuario());
        dados.put("nome_funcionario", usuarioAtualizado.getNome_funcionario());
        dados.put("cargo", usuarioAtualizado.getCargo());
        dados.put("nivel_permissao", usuarioAtualizado.getNivel_permissao());
        dados.put("login", usuarioAtualizado.getLogin());

        return ResponseEntity.ok(dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirUsuario(@PathVariable Integer id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
