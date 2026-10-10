/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.livrariagestor.livrariagestorweb.controller;

import java.sql.Date;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author William
 */
@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {
    private final JdbcTemplate jdbcTemplate;

    public RelatorioController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/vendas-periodo")
    public List<Map<String, Object>> vendasPeriodo(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataInicial,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataFinal) {

        String sql = """
            SELECT
                v.id_venda AS id,
                v.data_horario AS dataHora,
                c.nome_cliente AS cliente,
                u.nome_funcionario AS funcionario,
                v.valor_total AS valorTotal
            FROM venda v
            LEFT JOIN cliente c
                ON c.id_cliente = v.id_cliente
            LEFT JOIN usuario u
                ON u.id_usuario = v.id_usuario
            WHERE v.data_horario >= ?
              AND v.data_horario < DATE_ADD(?, INTERVAL 1 DAY)
            ORDER BY v.data_horario
            """;

        return jdbcTemplate.queryForList(
                sql,
                Date.valueOf(dataInicial),
                Date.valueOf(dataFinal)
        );
    }

    @GetMapping("/livros-mais-vendidos")
    public List<Map<String, Object>> livrosMaisVendidos(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataInicial,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataFinal) {

        String sql = """
            SELECT
                l.id_livro AS idLivro,
                l.titulo AS titulo,
                SUM(iv.quantidade) AS quantidade
            FROM item_venda iv
            INNER JOIN venda v
                ON v.id_venda = iv.id_venda
            INNER JOIN livro l
                ON l.id_livro = iv.id_livro
            WHERE v.data_horario >= ?
              AND v.data_horario < DATE_ADD(?, INTERVAL 1 DAY)
            GROUP BY l.id_livro, l.titulo
            ORDER BY quantidade DESC, l.titulo
            """;

        return jdbcTemplate.queryForList(
                sql,
                Date.valueOf(dataInicial),
                Date.valueOf(dataFinal)
        );
    }

    @GetMapping("/desempenho-vendas")
    public Map<String, Object> desempenhoVendas(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataInicial,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataFinal) {

        String sql = """
            SELECT
                COUNT(*) AS quantidadeVendas,
                COALESCE(SUM(valor_total), 0) AS faturamento,
                COALESCE(AVG(valor_total), 0) AS ticketMedio
            FROM venda
            WHERE data_horario >= ?
              AND data_horario < DATE_ADD(?, INTERVAL 1 DAY)
            """;

        Map<String, Object> resultado = new LinkedHashMap<>(
                jdbcTemplate.queryForMap(
                        sql,
                        Date.valueOf(dataInicial),
                        Date.valueOf(dataFinal)
                )
        );

        String sqlMelhorPeriodo = """
            SELECT DATE_FORMAT(data_horario, '%m/%Y') AS periodo
            FROM venda
            WHERE data_horario >= ?
              AND data_horario < DATE_ADD(?, INTERVAL 1 DAY)
            GROUP BY DATE_FORMAT(data_horario, '%m/%Y')
            ORDER BY SUM(valor_total) DESC
            LIMIT 1
            """;

        List<Map<String, Object>> periodos =
                jdbcTemplate.queryForList(
                        sqlMelhorPeriodo,
                        Date.valueOf(dataInicial),
                        Date.valueOf(dataFinal)
                );

        resultado.put(
                "melhorPeriodo",
                periodos.isEmpty()
                        ? "Sem vendas no período"
                        : periodos.get(0).get("periodo")
        );

        return resultado;
    }
}
