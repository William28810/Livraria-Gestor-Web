/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.livrariagestor.livrariagestorweb.controller;

import com.livrariagestor.livrariagestorweb.model.Historico;
import com.livrariagestor.livrariagestorweb.repository.HistoricoRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 *
 * @author William
 */
@RestController
@RequestMapping("/api/historico")
public class HistoricoController {
    private final HistoricoRepository historicoRepository;

    public HistoricoController(HistoricoRepository historicoRepository) {
        this.historicoRepository = historicoRepository;
    }

    @GetMapping
    public List<Historico> listarHistorico() {
        return historicoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> registrarHistorico(
            @RequestBody Historico historico) {

        if (historico.getTipo_acao() == null
                || historico.getTipo_acao().isBlank()
                || historico.getTabela_movimentada() == null
                || historico.getTabela_movimentada().isBlank()
                || historico.getId_usuario() <= 0
                || historico.getId_registro_movimento() <= 0) {
            return ResponseEntity.badRequest()
                    .body("Preencha os dados obrigatórios do histórico.");
        }

        if (historico.getData_horario() == null) {
            historico.setData_horario(LocalDateTime.now());
        }

        Historico salvo = historicoRepository.save(historico);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }
}
