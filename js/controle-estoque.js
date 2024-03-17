const URL = 'http://localhost:3400/produtos';
let idEdicao = 0;

let txtBemVindo = document.querySelector("#txt-bem-vindo");
txtBemVindo.innerHTML = "Seja bem-vindo(a), " + CarregarUsuario().nome + "!";

let listaProdutos = [];
let btnAdicionar = document.querySelector("#btn-adicionar");
let tabelaProdutos = document.querySelector('table>tbody');
let btnSair = document.querySelector("#btn-sair");
let tituloModal = document.querySelector("#titulo-modal");
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    quantidade: document.querySelector("#quantidade"),
    observacao: document.querySelector("#observacao"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar: document.querySelector("#btn-salvar"),
    btnCancelar: document.querySelector("#btn-cancelar")
}

function obterProdutos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': CarregarToken()
        }
    })
        .then(response => response.json())
        .then(produtos => {
            listaProdutos = produtos;
            popularTabela(produtos);
        })
        .catch(erro => { });

}

obterProdutos();

function popularTabela(produtos) {
    tabelaProdutos.innerHTML = "";

    produtos.forEach(produto => {
        CriarLinhaNaTabela(produto)
    });
}

function CriarLinhaNaTabela(produto) {

    let tr = document.createElement("tr");

    let tdId = document.createElement("td");
    let tdNome = document.createElement("td");
    let tdValor = document.createElement("td");
    let tdQuantidade = document.createElement("td");
    let tdObservacao = document.createElement("td");
    let tdData = document.createElement("td");
    let tdAcoes = document.createElement('td');

    tdAcoes.style.textAlign = 'center';

    tdId.innerHTML = produto.id;
    tdNome.innerHTML = produto.nome;
    tdValor.innerHTML = produto.valor;
    tdQuantidade.innerHTML = produto.quantidadeEstoque;
    tdObservacao.innerHTML = produto.observacao;
    tdData.innerHTML = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                            Editar
                        </button>
                        <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm">
                            Excluir
                        </button>`

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidade);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdData);
    tr.appendChild(tdAcoes);

    tabelaProdutos.appendChild(tr);
}

btnAdicionar.addEventListener('click', () => {
    limparModalProduto();
    tituloModal.innerHTML = "Adicionar produto";
    modalProduto.show();
});

function limparModalProduto() {
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.observacao.value = '';
    formModal.quantidade.value = '';
    formModal.dataCadastro.value = '';
}

formModal.btnSalvar.addEventListener('click', CadastrarOuEditarProduto);

function obterProdutoDoModal() {
    return new Produto({
        id: formModal.id.value,
        quantidadeEstoque: formModal.quantidade.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoNoBackend(produto) {
    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: CarregarToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(response => {
            let novoProduto = new Produto(response);
            listaProdutos.push(novoProduto);

            popularTabela(listaProdutos);

            modalProduto.hide();

            alert(`Produto ${produto.nome}, foi cadastrado com sucesso!`)
        })
}

function excluirProduto(id) {
    let produto = listaProdutos.find(produto => produto.id == id);

    if (confirm("Deseja realmente excluir o produto: " + produto.nome)) {
        excluirProdutoNoBackEnd(id);
    }
}

function excluirProdutoNoBackEnd(id) {
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: CarregarToken()
        }
    })
        .then(() => {
            removerProdutoDaLista(id);
            popularTabela(listaProdutos);
        })
}

function removerProdutoDaLista(id) {
    let indice = listaProdutos.findIndex(produto => produto.id == id);

    listaProdutos.splice(indice, 1);
}

function editarProduto(id) {
    tituloModal.innerHTML = "Editar produto";

    let produto = listaProdutos.find(produto => produto.id == id);

    idEdicao = produto.id;

    formModal.id.value = produto.id;
    formModal.nome.value = produto.nome;
    formModal.valor.value = produto.valor;
    formModal.quantidade.value = produto.quantidadeEstoque;
    formModal.observacao.value = produto.observacao;
    formModal.dataCadastro.value = produto.dataCadastro;

    modalProduto.show();
}

function AtualizarProdutoNoBackEnd(id) {
    fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: CarregarToken()
        },
        body: JSON.stringify(obterProdutoDoModal())
    })
        .then(() => {
            AtualizarProdutoDaLista(id);

            modalProduto.hide();

            alert(`Produto ${obterProdutoDoModal().nome}, foi atualizado com sucesso!`)
        })
}

function AtualizarProdutoDaLista(id) {
    let indice = listaProdutos.findIndex(produto => produto.id == id);

    listaProdutos[indice] = obterProdutoDoModal();

    popularTabela(listaProdutos);
}

function CadastrarOuEditarProduto() {
    if (tituloModal.innerHTML.includes("Adicionar")) {
        AdicionarProdutoDoModal();
    }
    else {
        AtualizarProdutoNoBackEnd(idEdicao);
    }
}

function AdicionarProdutoDoModal() {
    let produto = obterProdutoDoModal();

    if (!produto.validar()) {
        alert('Quantidade em estoque e o valor precisam ser preenchidos!');
        return;
    }

    adicionarProdutoNoBackend(produto);
}

btnSair.addEventListener("click", SairDoSistema);