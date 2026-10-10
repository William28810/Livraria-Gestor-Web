const conteudo = document.querySelector("#conteudo");
let livros = [];
let livroEditandoId = null;

let clientes = [];
let proximoIdCliente = 1;
let clienteEditandoId = null;

let vendas = [];
let proximoIdVenda = 1;

let usuarios = [];
let proximoIdUsuario = 1;
let usuarioEditandoId = null;

let historico = [];

carregarLivros();
document.querySelector("#btnBuscarLivro").addEventListener("click", function () {
    buscarLivros();
});
document.querySelector("#btnLivros").addEventListener("click", function () {
    conteudo.innerHTML = `
        <h2>Livros</h2>

        <div class="campo-busca">
            <label for="buscarLivro">Buscar:</label>
            <input type="text" id="buscarLivro">
            <button id="btnBuscarLivro">Buscar</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Gênero</th>
                    <th>Publicação</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                </tr>
            </thead>

            <tbody id="tabelaLivros"></tbody>
        </table>

        <div class="botoes-tabela">
            <button onclick="abrirModal('modalLivro')">Novo</button>
            <button onclick="editarLivro()">Editar</button>
            <button onclick="excluirLivro()">Excluir</button>
        </div>
    `;
    atualizarTabelaLivros();
});
document.querySelector("#btnClientes").addEventListener("click", function () {
    conteudo.innerHTML = `
        <h2>Clientes</h2>

        <div class="campo-busca">
            <label for="buscarCliente">Buscar:</label>
            <input type="text" id="buscarCliente">
            <button id="btnBuscarCliente">Buscar</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Endereço</th>
                </tr>
            </thead>

            <tbody id="tabelaClientes"></tbody>
        </table>

        <div class="botoes-tabela">
            <button onclick="abrirModal('modalCliente')">Novo</button>
            <button onclick="editarCliente()">Editar</button>
            <button onclick="excluirCliente()">Excluir</button>
        </div>
    `;
    carregarClientes();
});
document.querySelector("#btnVendas").addEventListener("click", function () {
    conteudo.innerHTML = `
        <h2>Vendas</h2>
                <button onclick="abrirModal('modalVenda')">Registrar Venda</button>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Data/Hora</th>
                    <th>Cliente</th>
                    <th>Funcionário</th>
                    <th>Valor Total</th>
                </tr>
            </thead>

            <tbody id="tabelaVendas"></tbody>
        </table>`;
    carregarVendas();
});
document.querySelector("#btnRelatorios").addEventListener("click", function () {
    conteudo.innerHTML = `
        <h2>Relatórios</h2>

        <div class="form-relatorio">

            <div class="campo-formulario">
                <label for="tipoRelatorio">Tipo de relatório:</label>

                <select id="tipoRelatorio">
                    <option value="">Selecione</option>
                    <option value="vendas-periodo">Venda por período</option>
                    <option value="livros-mais-vendidos">Livros mais vendidos</option>
                    <option value="desempenho-vendas">Desempenho de vendas</option>
                </select>
            </div>

            <div class="campo-formulario">
                <label for="dataInicial">Data inicial:</label>
                <input type="date" id="dataInicial">
            </div>

            <div class="campo-formulario">
                <label for="dataFinal">Data final:</label>
                <input type="date" id="dataFinal">
            </div>

            <div class="botao-relatorio">
                <button id="btnGerarRelatorio">Gerar Relatório</button>
            </div>

        </div>

        <div class="area-relatorio" id="areaRelatorio"></div>`;
    document.querySelector("#btnGerarRelatorio").addEventListener("click", function () {
        gerarRelatorio();
    });
});
document.querySelector("#btnHistorico").addEventListener("click", function () {
    conteudo.innerHTML = `
        <h2>Histórico</h2>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tipo de Ação</th>
                    <th>Entidade Afetada</th>
                    <th>ID Registro</th>
                    <th>Funcionário</th>
                    <th>Data/Hora</th>
                </tr>
            </thead>

            <tbody id="tabelaHistorico"></tbody>
        </table>
    `;

    carregarHistorico();
});
document.querySelector("#btnUsuarios").addEventListener("click", function () {
    conteudo.innerHTML = `
        <h2>Usuários</h2>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Nível de Permissão</th>
                    <th>Login</th>
                </tr>
            </thead>

            <tbody id="tabelaUsuarios"></tbody>
        </table>
        <div class="botoes-tabela">
            <button onclick="abrirModal('modalUsuario')">Novo</button>
            <button onclick="editarUsuario()">Editar</button>
            <button onclick="excluirUsuario()">Excluir</button>
        </div>`;
    carregarUsuarios();
});
function abrirModal(idModal) {
    const modal = document.querySelector("#" + idModal);
    modal.style.display = "flex";
}

function fecharModal(idModal) {
    const modal = document.querySelector("#" + idModal);
    const campos = modal.querySelectorAll("input, textarea, select");
    campos.forEach(function (campo) {
        campo.value = "";
    });
    if (idModal === "modalLivro") {
        livroEditandoId = null;
    }

    if (idModal === "modalCliente") {
        clienteEditandoId = null;
    }

    if (idModal === "modalUsuario") {
        usuarioEditandoId = null;
    }

    modal.style.display = "none";
}

function limparFormulario(idModal) {
    const modal = document.querySelector("#" + idModal);
    const campos = modal.querySelectorAll("input, textarea, select");
    campos.forEach(function (campo) {
        campo.value = "";
    });
}

// SALVAR LIVROS NA TABELA
async function salvarLivro() {
    const titulo = document.querySelector("#tituloLivro").value.trim();
    const autor = document.querySelector("#autorLivro").value.trim();
    const genero = document.querySelector("#generoLivro").value.trim();
    const publicacao = document.querySelector("#publicacaoLivro").value;
    const quantidade = document.querySelector("#quantidadeLivro").value;
    const preco = document.querySelector("#precoLivro").value;
    const observacao = document.querySelector("#observacaoLivro").value.trim();
    if (
            titulo === "" ||
            autor === "" ||
            genero === "" ||
            publicacao === "" ||
            quantidade === "" ||
            preco === ""
            ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const livro = {
        titulo: titulo,
        autor: autor,
        genero: genero,
        publicacao: publicacao,
        quantidade: Number(quantidade),
        preco: Number(preco),
        observacao: observacao
    };
    const editando = livroEditandoId !== null;
    try {
        const resposta = await fetch(
                editando
                ? `/api/livros/${livroEditandoId}`
                : "/api/livros",
                {
                    method: editando ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(livro)
                }
        );
        if (!resposta.ok) {
            throw new Error("Não foi possível salvar o livro.");
        }

        livroEditandoId = null;
        fecharModal("modalLivro");
        await carregarLivros();
        alert(
                editando
                ? "Livro atualizado com sucesso!"
                : "Livro cadastrado com sucesso!"
                );
    } catch (erro) {
        console.error("Erro ao salvar livro:", erro);
        alert("Não foi possível salvar o livro. Verifique o servidor e tente novamente.");
    }
}

// EDITAR LIVRO DA TABELA
function editarLivro() {
    const id = prompt("Digite o ID do livro que deseja editar:");
    if (id === null || id.trim() === "") {
        return;
    }

    const livro = livros.find(function (livro) {
        return String(livro.id_livro ?? livro.id) === id.trim();
    });
    if (livro === undefined) {
        alert("Livro não encontrado.");
        return;
    }

    livroEditandoId = livro.id_livro ?? livro.id;
    document.querySelector("#tituloLivro").value = livro.titulo;
    document.querySelector("#autorLivro").value = livro.autor;
    document.querySelector("#generoLivro").value = livro.genero;
    document.querySelector("#publicacaoLivro").value = livro.publicacao;
    document.querySelector("#quantidadeLivro").value = livro.quantidade;
    document.querySelector("#precoLivro").value = livro.preco;
    document.querySelector("#observacaoLivro").value = livro.observacao ?? "";
    abrirModal("modalLivro");
}

// EXCLUIR LIVRO DA TABELA
async function excluirLivro() {
    const id = prompt("Digite o ID do livro que deseja excluir:");
    if (id === null || id.trim() === "") {
        return;
    }

    const indice = livros.findIndex(function (livro) {
        return String(livro.id_livro ?? livro.id) === id.trim();
    });
    if (indice === -1) {
        alert("Livro não encontrado.");
        return;
    }

    const confirmar = confirm("Deseja realmente excluir este livro?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`/api/livros/${id.trim()}`, {
            method: "DELETE"
        });
        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o livro.");
        }

        await carregarLivros();
        alert("Livro excluído com sucesso!");
    } catch (erro) {
        console.error("Erro ao excluir livro:", erro);
        alert("Não foi possível excluir o livro. Verifique o servidor e tente novamente.");
    }
}

// carregar livros
async function carregarLivros() {
    try {
        const resposta = await fetch("/api/livros");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar livros.");
        }

        livros = await resposta.json();
        atualizarTabelaLivros();
    } catch (erro) {
        console.error("Erro ao carregar livros:", erro);
        alert("Não foi possível carregar os livros do servidor.");
    }
}

// atualizar tabela de livros
function atualizarTabelaLivros(lista = livros) {
    document.querySelector("#btnBuscarLivro").addEventListener("click", function () {
        buscarLivros();
    });
    const tabela = document.querySelector("#tabelaLivros");
    if (tabela === null) {
        return;
    }

    tabela.innerHTML = "";
    if (lista.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7">Nenhum livro encontrado.</td>
            </tr>
        `;
        return;
    }

    lista.forEach(function (livro) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${livro.id_livro}</td>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.genero}</td>
            <td>${livro.publicacao}</td>
            <td>${livro.quantidade}</td>
            <td>${Number(livro.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</td>
        `;
        tabela.appendChild(linha);
    });
}

// Buscar Livros
function buscarLivros() {
    const busca = document.querySelector("#buscarLivro").value.trim().toLowerCase();
    const livrosEncontrados = livros.filter(function (livro) {
        return livro.titulo.toLowerCase().includes(busca) ||
                String(livro.id_livro ?? livro.id) === busca ||
                livro.autor.toLowerCase().includes(busca) ||
                livro.genero.toLowerCase().includes(busca);
    });
    atualizarTabelaLivros(livrosEncontrados);
}

// SALVAR CLIENTES NA TABELA
async function salvarCliente() {
    const nome = document.querySelector("#nomeCliente").value.trim();
    const cpf = document.querySelector("#cpfCliente").value.trim();
    const telefone = document.querySelector("#telefoneCliente").value.trim();
    const email = document.querySelector("#emailCliente").value.trim();
    const endereco = document.querySelector("#enderecoCliente").value.trim();
    if (nome === "" || cpf === "" || telefone === "" || email === "" || endereco === "") {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    const cliente = {nome_cliente: nome, cpf: cpf, telefone: telefone, email: email, endereco: endereco};
    const editando = clienteEditandoId !== null;
    try {
        const resposta = await fetch(editando ? `/api/clientes/${clienteEditandoId}` : "/api/clientes", {method: editando ? "PUT" : "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(cliente)});
        if (!resposta.ok) {
            throw new Error("Não foi possível salvar o cliente.");
        }
        clienteEditandoId = null;
        fecharModal("modalCliente");
        await carregarClientes();
        alert(editando ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
    } catch (erro) {
        console.error("Erro ao salvar cliente:", erro);
        alert("Não foi possível salvar o cliente. Verifique o servidor e tente novamente.");
    }
}

// EDITAR CLIENTE DA TABELA
function editarCliente() {
    const id = prompt("Digite o ID do cliente que deseja editar:");
    if (id === null || id.trim() === "") {
        return;
    }

    const cliente = clientes.find(function (cliente) {
        return String(cliente.id_cliente ?? cliente.id) === id.trim();
    });
    if (cliente === undefined) {
        alert("Cliente não encontrado.");
        return;
    }

    clienteEditandoId = cliente.id_cliente ?? cliente.id;
    document.querySelector("#nomeCliente").value = cliente.nome_cliente ?? cliente.nome;
    document.querySelector("#cpfCliente").value = cliente.cpf;
    document.querySelector("#telefoneCliente").value = cliente.telefone;
    document.querySelector("#emailCliente").value = cliente.email;
    document.querySelector("#enderecoCliente").value = cliente.endereco;
    abrirModal("modalCliente");
}

// EXCLUIR CLIENTE DA TABELA
async function excluirCliente() {
    const id = prompt("Digite o ID do cliente que deseja excluir:");
    if (id === null || id.trim() === "") {
        return;
    }

    const indice = clientes.findIndex(function (cliente) {
        return String(cliente.id_cliente ?? cliente.id) === id.trim();
    });
    if (indice === -1) {
        alert("Cliente não encontrado.");
        return;
    }

    const confirmar = confirm("Deseja realmente excluir este cliente?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`/api/clientes/${id.trim()}`, {
            method: "DELETE"
        });
        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o cliente.");
        }

        await carregarClientes();
        alert("Cliente excluído com sucesso!");
    } catch (erro) {
        console.error("Erro ao excluir cliente:", erro);
        alert("Não foi possível excluir o cliente. Verifique o servidor e tente novamente.");
    }
}

// carregar clientes
async function carregarClientes() {
    try {
        const resposta = await fetch("/api/clientes");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar clientes.");
        }
        clientes = await resposta.json();
        atualizarTabelaClientes();
    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
        alert("Não foi possível carregar os clientes do servidor.");
    }
}

// atualizar tabela clientes
function atualizarTabelaClientes(lista = clientes) {
    document.querySelector("#btnBuscarCliente").addEventListener("click", function () {
        buscarClientes();
    });
    const tabela = document.querySelector("#tabelaClientes");
    if (tabela === null) {
        return;
    }

    tabela.innerHTML = "";
    if (lista.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7">Nenhum cliente encontrado.</td>
            </tr>
        `;
        return;
    }

    lista.forEach(function (cliente) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${cliente.id_cliente}</td>
            <td>${cliente.nome_cliente}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.email}</td>
            <td>${cliente.endereco}</td>
        `;
        tabela.appendChild(linha);
    });
}

// Buscar Clientes
function buscarClientes() {
    const busca = document.querySelector("#buscarCliente").value.trim().toLowerCase();
    const clientesEncontrados = clientes.filter(function (cliente) {
        return (cliente.nome_cliente ?? cliente.nome).toLowerCase().includes(busca) ||
                String(cliente.id_cliente ?? cliente.id) === busca;
    });
    atualizarTabelaClientes(clientesEncontrados);
}

// SALVAR VENDAS NA TABELA
async function salvarVenda() {
    const dataHora = document.querySelector("#dataHoraVenda").value;
    const nomeCliente = document.querySelector("#clienteVenda").value.trim();
    const nomeFuncionario = document.querySelector("#funcionarioVenda").value.trim();
    const valorTotal = document.querySelector("#valorTotalVenda").value;
    if (dataHora === "" || nomeCliente === "" || nomeFuncionario === "" || valorTotal === "") {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const valor = Number(valorTotal);
    if (!Number.isFinite(valor) || valor < 0) {
        alert("Informe um valor total válido.");
        return;
    }
    try {
        const [respostaClientes, respostaUsuarios] = await Promise.all([fetch("/api/clientes"), fetch("/api/usuarios")]);
        if (!respostaClientes.ok || !respostaUsuarios.ok) {
            throw new Error("Não foi possível consultar clientes e funcionários.");
        }
        const clientes = await respostaClientes.json();
        const usuarios = await respostaUsuarios.json();
        const clientesEncontrados = clientes.filter(function (cliente) {
            return cliente.nome_cliente.trim().toLowerCase() === nomeCliente.toLowerCase();
        });
        const usuariosEncontrados = usuarios.filter(function (usuario) {
            return usuario.nome_funcionario.trim().toLowerCase() === nomeFuncionario.toLowerCase();
        });
        if (clientesEncontrados.length === 0) {
            alert("Cliente não encontrado. Digite o nome de um cliente cadastrado.");
            return;
        }
        if (clientesEncontrados.length > 1) {
            alert("Existe mais de um cliente com esse nome. É necessário identificar o cliente correto.");
            return;
        }
        if (usuariosEncontrados.length === 0) {
            alert("Funcionário não encontrado. Digite o nome de um funcionário cadastrado.");
            return;
        }
        if (usuariosEncontrados.length > 1) {
            alert("Existe mais de um funcionário com esse nome. É necessário identificar o funcionário correto.");
            return;
        }
        const venda = {data_horario: dataHora, id_cliente: clientesEncontrados[0].id_cliente, id_usuario: usuariosEncontrados[0].id_usuario, valor_total: valor};
        const resposta = await fetch("/api/vendas", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(venda)});
        if (!resposta.ok) {
            throw new Error("O servidor não conseguiu cadastrar a venda.");
        }
        fecharModal("modalVenda");
        await carregarVendas();
        alert("Venda cadastrada com sucesso!");
    } catch (erro) {
        console.error("Erro ao salvar venda:", erro);
        alert("Não foi possível salvar a venda. Verifique o servidor e tente novamente.");
    }
}

// carregar vendas
async function carregarVendas() {
    try {
        const [respostaVendas, respostaClientes, respostaUsuarios] = await Promise.all([fetch("/api/vendas"), fetch("/api/clientes"), fetch("/api/usuarios")]);
        if (!respostaVendas.ok || !respostaClientes.ok || !respostaUsuarios.ok) {
            throw new Error("Erro ao carregar os dados das vendas.");
        }
        const dadosVendas = await respostaVendas.json();
        const dadosClientes = await respostaClientes.json();
        const dadosUsuarios = await respostaUsuarios.json();
        vendas = dadosVendas.map(function (venda) {
            const cliente = dadosClientes.find(function (cliente) {
                return cliente.id_cliente === venda.id_cliente;
            });
            const usuario = dadosUsuarios.find(function (usuario) {
                return usuario.id_usuario === venda.id_usuario;
            });
            return {id: venda.id_venda, dataHora: venda.data_horario, cliente: cliente ? cliente.nome_cliente : "Cliente não encontrado", funcionario: usuario ? usuario.nome_funcionario : "Funcionário não encontrado", valorTotal: Number(venda.valor_total).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})};
        });
        atualizarTabelaVendas();
    } catch (erro) {
        console.error("Erro ao carregar vendas:", erro);
        alert("Não foi possível carregar as vendas do servidor.");
    }
}

// atualizar a tabela de vendas
function atualizarTabelaVendas() {
    const tabela = document.querySelector("#tabelaVendas");
    if (tabela === null) {
        return;
    }

    tabela.innerHTML = "";
    if (vendas.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5">Nenhuma venda encontrada.</td>
            </tr>"
        `;
        return;
    }

    vendas.forEach(function (venda) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${venda.id}</td>
            <td>${venda.dataHora}</td>
            <td>${venda.cliente}</td>
            <td>${venda.funcionario}</td>
            <td>${venda.valorTotal}</td>
        `;
        tabela.appendChild(linha);
    });
}

// SALVAR USUARIO NA TABELA
async function salvarUsuario() {
    const nome = document.querySelector("#nomeUsuario").value.trim();
    const cargo = document.querySelector("#cargoUsuario").value.trim();
    const nivelPermissao = document.querySelector("#nivelPermissaoUsuario").value.trim();
    const login = document.querySelector("#loginUsuario").value.trim();
    const senha = document.querySelector("#senhaUsuario").value.trim();

    if (
        nome === "" ||
        cargo === "" ||
        nivelPermissao === "" ||
        login === "" ||
        senha === ""
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    
    const usuario = {
        nome_funcionario: nome,
        cargo: cargo,
        nivel_permissao: nivelPermissao,
        login: login,
        senha: senha
    };
    
    try {
        const editando = usuarioEditandoId !== null;
        const url = editando
            ? `/api/usuarios/${usuarioEditandoId}`
            : "/api/usuarios";

        const resposta = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (!resposta.ok) {
            const mensagem = await resposta.text();
            throw new Error(mensagem || "Erro ao salvar funcionário.");
        }

        usuarioEditandoId = null;
        fecharModal("modalUsuario");
        await carregarUsuarios();

        alert(editando
            ? "Funcionário atualizado com sucesso!"
            : "Funcionário cadastrado com sucesso!");

    } catch (erro) {
        console.error("Erro ao salvar funcionário:", erro);
        alert("Não foi possível salvar o funcionário: " + erro.message);
    }
}

// EDITAR USUARIO DA TABELA
function editarUsuario() {
    const id = prompt("Digite o ID do usuário que deseja editar:");

    if (id === null || id.trim() === "") {
        return;
    }

    const usuario = usuarios.find(function (usuario) {
        return String(usuario.id_usuario) === id.trim();
    });

    if (usuario === undefined) {
        alert("Usuário não encontrado.");
        return;
    }

    usuarioEditandoId = usuario.id_usuario;

    document.querySelector("#nomeUsuario").value = usuario.nome_funcionario;
    document.querySelector("#cargoUsuario").value = usuario.cargo;
    document.querySelector("#nivelPermissaoUsuario").value = usuario.nivel_permissao;
    document.querySelector("#loginUsuario").value = usuario.login;

    // A API não fornece a senha na consulta.
    // Solicita a senha atual para não deixar o campo vazio.
    document.querySelector("#senhaUsuario").value = "";

    abrirModal("modalUsuario");
}

// EXCLUIR USUARIO DA TABELA
async function excluirUsuario() {
    const id = prompt("Digite o ID do usuário que deseja excluir:");

    if (id === null || id.trim() === "") {
        return;
    }

    const usuario = usuarios.find(function (usuario) {
        return String(usuario.id_usuario) === id.trim();
    });

    if (usuario === undefined) {
        alert("Usuário não encontrado.");
        return;
    }

    const confirmar = confirm(
        "Deseja realmente excluir o usuário " +
        usuario.nome_funcionario + "?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`/api/usuarios/${id.trim()}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o usuário.");
        }

        await carregarUsuarios();
        alert("Usuário excluído com sucesso!");

    } catch (erro) {
        console.error("Erro ao excluir usuário:", erro);
        alert("Falha ao excluir usuário. Verifique o servidor.");
    }
}

// carregar usuarios
async function carregarUsuarios() {
    try {
        const resposta = await fetch("/api/usuarios");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar usuários.");
        }

        usuarios = await resposta.json();
        atualizarTabelaUsuarios();
    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
        alert("Não foi possível carregar os usuários do servidor.");
    }
}

// atualizar tabela usuario
function atualizarTabelaUsuarios() {
    const tabela = document.querySelector("#tabelaUsuarios");
    if (tabela === null) {
        return;
    }

    tabela.innerHTML = "";
    usuarios.forEach(function (usuario) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${usuario.id_usuario}</td>
            <td>${usuario.nome_funcionario}</td>
            <td>${usuario.cargo}</td>
            <td>${usuario.nivel_permissao ?? ""}</td>
            <td>${usuario.login ?? ""}</td>
        `;
        tabela.appendChild(linha);
    });
}

// GERAR RELATÓRIO
async function gerarRelatorio() {
    const tipo = document.querySelector("#tipoRelatorio").value;
    const dataInicial = document.querySelector("#dataInicial").value;
    const dataFinal = document.querySelector("#dataFinal").value;
    const areaRelatorio = document.querySelector("#areaRelatorio");

    if (tipo === "") {
        alert("Selecione o tipo de relatório.");
        return;
    }

    if (dataInicial === "" || dataFinal === "") {
        alert("Preencha a data inicial e a data final.");
        return;
    }

    if (dataInicial > dataFinal) {
        alert("Data inicial não pode ser maior que a data final.");
        return;
    }

    areaRelatorio.innerHTML = "<p>Carregando relatório...</p>";

    try {
        const parametros =
            `dataInicial=${encodeURIComponent(dataInicial)}` +
            `&dataFinal=${encodeURIComponent(dataFinal)}`;

        let resposta;
        let dados;

        if (tipo === "vendas-periodo") {
            resposta = await fetch(
                `/api/relatorios/vendas-periodo?${parametros}`
            );
        } else if (tipo === "livros-mais-vendidos") {
            resposta = await fetch(
                `/api/relatorios/livros-mais-vendidos?${parametros}`
            );
        } else if (tipo === "desempenho-vendas") {
            resposta = await fetch(
                `/api/relatorios/desempenho-vendas?${parametros}`
            );
        }

        if (!resposta.ok) {
            throw new Error("Erro ao consultar o relatório.");
        }

        dados = await resposta.json();

        const formatarMoeda = function (valor) {
            return Number(valor || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        };

        const formatarData = function (data) {
            if (!data) {
                return "";
            }

            const valor = String(data);

            if (valor.includes("T")) {
                return new Date(valor).toLocaleString("pt-BR");
            }

            return valor.replace(" ", "T")
                .replace("T", " ")
                .substring(0, 19);
        };

        if (tipo === "vendas-periodo") {
            const vendasPeriodo = dados;
            const totalVendas = vendasPeriodo.reduce(
                (total, venda) => total + Number(venda.valorTotal || 0),
                0
            );

            areaRelatorio.innerHTML = `
                <h3>Vendas por período</h3>

                <p>Período: ${dataInicial} até ${dataFinal}</p>

                <p>Quantidade de vendas: ${vendasPeriodo.length}</p>

                <p>Total vendido: ${formatarMoeda(totalVendas)}</p>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data/Hora</th>
                            <th>Cliente</th>
                            <th>Funcionário</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody id="tabelaRelatorioVendas"></tbody>
                </table>
            `;

            const tabela = document.querySelector("#tabelaRelatorioVendas");

            if (vendasPeriodo.length === 0) {
                tabela.innerHTML = `
                    <tr>
                        <td colspan="5">Nenhuma venda encontrada no período.</td>
                    </tr>
                `;
                return;
            }

            tabela.innerHTML = vendasPeriodo.map(venda => `
                <tr>
                    <td>${venda.id}</td>
                    <td>${formatarData(venda.dataHora)}</td>
                    <td>${venda.cliente || "Não informado"}</td>
                    <td>${venda.funcionario || "Não informado"}</td>
                    <td>${formatarMoeda(venda.valorTotal)}</td>
                </tr>
            `).join("");
        }

        if (tipo === "livros-mais-vendidos") {
            areaRelatorio.innerHTML = `
                <h3>Livros mais vendidos</h3>

                <p>Período: ${dataInicial} até ${dataFinal}</p>

                <p>
                    Os resultados consideram os itens registrados
                    nas vendas do período.
                </p>

                <table>
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Livro</th>
                            <th>Quantidade vendida</th>
                        </tr>
                    </thead>
                    <tbody id="tabelaLivrosVendidos"></tbody>
                </table>
            `;

            const tabela = document.querySelector("#tabelaLivrosVendidos");

            if (dados.length === 0) {
                tabela.innerHTML = `
                    <tr>
                        <td colspan="3">
                            Nenhum item de venda encontrado no período.
                        </td>
                    </tr>
                `;
                return;
            }

            tabela.innerHTML = dados.map((livro, indice) => `
                <tr>
                    <td>${indice + 1}º</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.quantidade}</td>
                </tr>
            `).join("");
        }

        if (tipo === "desempenho-vendas") {
            areaRelatorio.innerHTML = `
                <h3>Desempenho de vendas</h3>

                <p>Período: ${dataInicial} até ${dataFinal}</p>

                <table>
                    <thead>
                        <tr>
                            <th>Indicador</th>
                            <th>Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total de vendas</td>
                            <td>${dados.quantidadeVendas}</td>
                        </tr>
                        <tr>
                            <td>Faturamento</td>
                            <td>${formatarMoeda(dados.faturamento)}</td>
                        </tr>
                        <tr>
                            <td>Ticket médio</td>
                            <td>${formatarMoeda(dados.ticketMedio)}</td>
                        </tr>
                        <tr>
                            <td>Melhor período por faturamento</td>
                            <td>${dados.melhorPeriodo}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
    } catch (erro) {
        console.error("Erro ao gerar relatório:", erro);
        areaRelatorio.innerHTML = `
            <p>Não foi possível gerar o relatório. Tente novamente.</p>
        `;
    }
}

// CARREGAR HISTORICO
async function carregarHistorico() {
    try {
        const resposta = await fetch("/api/historico");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar o histórico.");
        }

        const dados = await resposta.json();

        historico = dados.map(function (registro) {
            return {
                id: registro.id_historico,
                tipoAcao: registro.tipo_acao,
                dataHora: registro.data_horario,
                idUsuario: registro.id_usuario,
                tabela: registro.tabela_movimentada,
                idRegistro: registro.id_registro_movimento
            };
        });

        atualizarTabelaHistorico();
    } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
        alert("Não foi possível carregar o histórico do servidor.");
    }
}

// ATUALIZAR TABELA HISTORICO
function atualizarTabelaHistorico() {
    const tabela = document.querySelector("#tabelaHistorico");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = historico.map(function (registro) {
        const data = registro.dataHora
            ? new Date(registro.dataHora).toLocaleString("pt-BR")
            : "";

        return `
            <tr>
                <td>${registro.id}</td>
                <td>${registro.tipoAcao}</td>
                <td>${registro.tabela}</td>
                <td>${registro.idRegistro}</td>
                <td>${registro.idUsuario}</td>
                <td>${data}</td>
            </tr>
        `;
    }).join("");
}
