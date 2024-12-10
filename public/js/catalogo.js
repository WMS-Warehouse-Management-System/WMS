document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('btnAbrirLinha')) {
            const linhaDetalhe = event.target.closest('tr').nextElementSibling;

            if (linhaDetalhe) {
                const isHidden = linhaDetalhe.style.display === 'none';
                linhaDetalhe.style.display = isHidden ? 'table-row' : 'none';
                event.target.textContent = isHidden ? '-' : '+';
            }
        }
    });
});



document.getElementById('filtrarBtn').addEventListener('click', function () {
    const caixote = document.getElementById('caixote');
    
    // Alterna a classe 'active' para mostrar ou esconder o formulário de filtro
    caixote.classList.toggle('active');
});




document.addEventListener("DOMContentLoaded", () => {
    const filtrarButton = document.querySelector("#filtrar");
    const caixote = document.querySelector("#caixote");

    //mostrar ou esconder o caixote
    filtrarButton.addEventListener("click", (event) => {
        caixote.classList.toggle("active");
        event.stopPropagation(); // impede que o click no filtro feche o dropdown
    });

    // Fecha o caixote se clicar fora dele
    document.addEventListener("click", (event) => {
        if (!caixote.contains(event.target) && !filtrarButton.contains(event.target)) {
            caixote.classList.remove("active");
        }
    });
});
//   muda o botao
function activateButton(clickedButton) {
const buttons = document.querySelectorAll('.botoes'); 
buttons.forEach(button => button.classList.remove('clicked')); 
clickedButton.classList.add('clicked');}

//----------SCRIPT PRINCIPAL

    async function fetchProdutosCatalogo() {
        try {
            const response = await fetch('/ver-catalogo');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos: ' + response.statusText);
            }

            const produtos = await response.json();

            const tbody = document.querySelector('#tabela-estoque tbody');
            tbody.innerHTML = '';

            if (produtos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6">Nenhum produtos encontrado</td></tr>';
                return;
            }

            produtos.forEach(produtos => {

const row = `
<tr>
    <td>${produtos.CODIGO}</td>
    <td>${produtos.NOME_BASICO}</td>
    <td>${produtos.DESCRICAO_TECNICA}</td>
    <td>${produtos.QUANT}</td>
    <td>${produtos.CATEGORIA}</td>
    <td>${produtos.FABRICANTE}</td>
    <td class="colunaAbrirDetalhes" id="${produtos.CODIGO}"><button onclick=abrirLinha() class="btnAbrirLinha" id="${produtos.CODIGO}">+</button></td>
</tr>
<tr id="linhaDetalhe" style="display: none;">
    <td colspan="6">
        <div class="containerLinhaOculta">
        <div class="containerLinhaDetalhes">
            <div class="imagemProduto">
                <img src="https://img.kalunga.com.br/fotosdeprodutos/124209d.jpg" alt="" id="imagemLinhaDetalhe">
            </div>
            <div class="endereco-obs">
                <table>
                    <thead>
                        <th colspan="2">Endereçamento</th>
                    </thead>
                    <tbody id="tableEnderecamento">
                        <tr>
                            <td id="colunaTopico" class="celulaDetalhe">Rua</td>
                            <td class="celulaDetalhe">${produtos.RUA}</td>
                        </tr>
                        <tr>
                            <td id="colunaTopico" class="celulaDetalhe">Coluna</td>
                            <td class="celulaDetalhe">${produtos.COLUNA}</td>
                        </tr>
                        <tr>
                            <td id="colunaTopico" class="celulaDetalhe">Andar</td>
                            <td class="celulaDetalhe">${produtos.ANDAR}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                     <thead>
                        <th  id="tableObservacoes">Observações</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="celulaObservacoes">${produtos.OBSERVACOES_ADICIONAL}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="caractProd">

                <table>
                <thead>
                    <th  colspan="2">Características</th>
                </thead>
                <tbody id="tableCaracter">
                    <tr>
                        <td id="colunaTopico">Largura</td>
                        <td class="celulaDetalhe">${produtos.LARGURA} cm</td>
                    </tr>
                    <tr>
                        <td id="colunaTopico">Altura</td>
                        <td class="celulaDetalhe">${produtos.ALTURA} cm</td>
                    </tr>
                    <tr>
                        <td id="colunaTopico">Profundidade</td>
                        <td class="celulaDetalhe">${produtos.PROFUNDIDADE} cm</td>
                    <tr>
                        <td id="colunaTopico">Peso</td>
                        <td class="celulaDetalhe">${produtos.PESO} Kg</td>
                    </tr>
                    <tr>
                        <td id="colunaTopico">Frágil</td>
                        <td class="celulaDetalhe">${produtos.FRAGILIDADE}</td>
                    </tr>
                    
                </tbody>
                </table>
            </div>
        </div>
        </div>
    </td>
</tr>
    `;
tbody.innerHTML += row;
});
            } catch (error) {
                alert('Erro ao buscar usuários: ' + error.message);
            }
    }

    window.onload = fetchProdutosCatalogo;

//---------------------LIMPAR FILTRO

function limparFiltros() {
    document.getElementById('categoria').value = '';
    document.getElementById('fabricante').value = '';
    document.getElementById('dedata').value = '';
    document.getElementById('atedata').value = '';
}

//---------------------------FILTRO BACK END



//-----------------------FILTRO CATEGORIA




//-----------------------FILTRO FABRICANTE

document.addEventListener('DOMContentLoaded', async () => {
    const filtroFabricante = document.getElementById('fabricante');

    try {
        const response = await fetch('http://localhost:3000/filtro-fabricante');
        if (response.ok) {
            const fabricantes = await response.json();

            fabricantes.forEach(fabricante => {
                const option = document.createElement('option');
                option.value = fabricante.FABRICANTE;
                option.textContent = fabricante.FABRICANTE;
                filtroFabricante.appendChild(option);
            });
        } else {
            console.error('Erro ao carregar fabricantes:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
});

function atualizarTabela(dados) {
    const tbody = document.querySelector('#tabela-estoque tbody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado</td></tr>';
        return;
    }

    dados.forEach(produto => {
        const row = `
            <tr>
                <td>${produto.CODIGO}</td>
                <td>${produto.NOME_BASICO}</td>
                <td>${produto.DESCRICAO_TECNICA}</td>
                <td>${produto.QUANT}</td>
                <td>${produto.CATEGORIA}</td>
                <td>${produto.FABRICANTE}</td>
            </tr>`;
        tbody.innerHTML += row;
    });
}


function atualizarTabela(dados) {
    const tbody = document.querySelector('#tabela-estoque tbody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado</td></tr>';
        return;
    }

    dados.forEach(produto => {
        const row = `
            <tr>
                <td>${produto.CODIGO}</td>
                <td>${produto.NOME_BASICO}</td>
                <td>${produto.DESCRICAO_TECNICA}</td>
                <td>${produto.QUANT}</td>
                <td>${produto.CATEGORIA}</td>
                <td>${produto.FABRICANTE}</td>
            </tr>`;
        tbody.innerHTML += row;
    });
}


