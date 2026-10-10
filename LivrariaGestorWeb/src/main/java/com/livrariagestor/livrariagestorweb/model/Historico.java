/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.livrariagestor.livrariagestorweb.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/**
 *
 * @author William
 */
@Entity
@Table(name = "historico")
public class Historico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_historico;

    private String tipo_acao;
    private LocalDateTime data_horario;
    private int id_usuario;
    private String tabela_movimentada;
    private int id_registro_movimento;

    public Historico() {
    }

    public int getId_historico() {
        return id_historico;
    }

    public void setId_historico(int id_historico) {
        this.id_historico = id_historico;
    }

    public String getTipo_acao() {
        return tipo_acao;
    }

    public void setTipo_acao(String tipo_acao) {
        this.tipo_acao = tipo_acao;
    }

    public LocalDateTime getData_horario() {
        return data_horario;
    }

    public void setData_horario(LocalDateTime data_horario) {
        this.data_horario = data_horario;
    }

    public int getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(int id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getTabela_movimentada() {
        return tabela_movimentada;
    }

    public void setTabela_movimentada(String tabela_movimentada) {
        this.tabela_movimentada = tabela_movimentada;
    }

    public int getId_registro_movimento() {
        return id_registro_movimento;
    }

    public void setId_registro_movimento(int id_registro_movimento) {
        this.id_registro_movimento = id_registro_movimento;
    }
}
