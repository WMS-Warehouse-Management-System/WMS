// Alternar exibição do formulário de recebimento
function toggleForm() {
  const formContainer = document.getElementById("formContainer");
  if (formContainer.style.display === "block") {
    formContainer.style.display = "none";
  } else {
    formContainer.style.display = "block";
  }
}
document.getElementById("formContainer").addEventListener("click", (event) => {
  const formContent = document.getElementById("formContent");
  if (!formContent.contains(event.target)) {
    document.getElementById("formContainer").style.display = "none";
  }
});

function toggleSection(sectionId) {
  var section = document.getElementById(sectionId);
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}

//---Inserir dados no BD
document
  .getElementById("formContainer")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = document.getElementById("productName").value;
    const data = document.getElementById("receiving_date").value;
    const quantidade = document.getElementById("quantity_received").value;
    const codigo = document.getElementById("product_code").value;
    const validade = document.getElementById("product_validade").value;
    const lote = document.getElementById("numb_lote").value;
    const fornecedor = document.getElementById("product_font").value;

    const response = await fetch("http://localhost:3000/financeiro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nome: nome,
        Data: data,
        Quantidade: quantidade,
        Codigo: codigo,
        Validade: validade,
        Lote: lote,
        Fornecedor: fornecedor,
      }),
    });

    if (response.ok) {
      alert("Recebimento adicionado com sucesso!");
      document.getElementById("productForm").reset(); // Limpa o formulário
    } else {
      alert("Erro ao adicionar recebimento!");
    }
  });

// //---------FILTRO AINDA NÃO FUNCIONANDO EM PROCESSO

// const toggleFilterButton = document.getElementById("toggle-filter");
// const filterOverlay = document.getElementById("filter-overlay");

// toggleFilterButton.addEventListener("click", () => {
//   const isVisible = filterOverlay.style.display === "block";
//   filterOverlay.style.display = isVisible ? "none" : "block";
// });

// function carregarFiltros() {
//   fetch("/opcoes-filtros")
//     .then((response) => response.json())
//     .then((data) => {
//       // Limpar opções de filtros antes de adicionar novos
//       const fornecedorSelect = document.getElementById("fornecedor");
//       const fabricanteSelect = document.getElementById("fabricante");
//       const tipoSelect = document.getElementById("tipo");
//       const nomeSelect = document.getElementById("nome");

//       fornecedorSelect.innerHTML = "";
//       fabricanteSelect.innerHTML = "";
//       tipoSelect.innerHTML = "";
//       nomeSelect.innerHTML = "";

//       // Carregar as opções de fornecedor
//       data.fornecedor.forEach((fornecedor) => {
//         const option = document.createElement("option");
//         option.value = fornecedor;
//         option.textContent = fornecedor;
//         fornecedorSelect.appendChild(option);
//       });

//       // Carregar as opções de fabricante
//       data.fabricante.forEach((fabricante) => {
//         const option = document.createElement("option");
//         option.value = fabricante;
//         option.textContent = fabricante;
//         fabricanteSelect.appendChild(option);
//       });

//       // Carregar as opções de tipo
//       data.tipo.forEach((tipo) => {
//         const option = document.createElement("option");
//         option.value = tipo;
//         option.textContent = tipo;
//         tipoSelect.appendChild(option);
//       });

//       // Carregar as opções de nome de produto
//       data.nome.forEach((nome) => {
//         const option = document.createElement("option");
//         option.value = nome;
//         option.textContent = nome;
//         nomeSelect.appendChild(option);
//       });
//     })
//     .catch((error) => {
//       console.error("Erro ao carregar filtros:", error);
//     });
// }

// // Chama a função para carregar os filtros quando a página carrega
// const params = new URLSearchParams();
// // Adicionar filtros ao params, por exemplo:
// params.append("fornecedor", selectedFornecedor);
// params.append("fabricante", selectedFabricante);
// // ...

// fetch(`/api/produtos?${params.toString()}`)
//   .then((response) => response.json())
//   .then((data) => {
//     const productsList = document.getElementById("products-list");
//     productsList.innerHTML = "";
//     data.forEach((produto) => {
//       const productItem = document.createElement("div");
//       productItem.className = "product-item";
//       productItem.innerHTML = `
//                 <h2>${produto.nome}</h2>
//                 <p>Fornecedor: ${produto.fornecedor}</p>
//                 <p>Fabricante: ${produto.fabricante}</p>
//                 <p>Tipo: ${produto.tipo}</p>
//                 <p>Validade: ${produto.data_validade}</p>
//             `;
//       productsList.appendChild(productItem);
//     });
//   })
//   .catch((error) => console.error("Erro ao buscar produtos:", error));



//--------------------------------------------------------------Aparecer os recebimentos na tela

async function fetchVerRecebimentos() {
    try {
        const response = await fetch('/Recebimento');
        
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos: ' + response.statusText);
        }

        const recebimentos = await response.json();

        const tabelaRecebimentos = document.querySelector('.table-container');
        if (!tabelaRecebimentos) {
            throw new Error('Elemento com id "table-container" não encontrado no DOM.');
        }

        tabelaRecebimentos.innerHTML = ''; // Limpa o conteúdo anterior

        if (recebimentos.length === 0) {
            tabelaRecebimentos.innerHTML = '<div class="nenhum-recebimento">Nenhum recebimento encontrado</div>';
            return;
        }

        recebimentos.forEach(recebimento => {

            const row = `
                <div class="tabela-recebimentos">
                    <div class="table-container" id="table-container">
                    <div class="linhaPrincipal">
                        <div class="cell">Data<br><span>${recebimento.DATA_RECEB}</span></div>
                        <div class="cell">Código<br><span>${recebimento.CODIGO}</span></div>
                        <div class="cell">Item<br><span>${recebimento.NOME_BASICO}</span></div>
                        <div class="cell">Fornecedor<br><span>${recebimento.Fornecedor}</span></div>
                        <div class="cell">Preço Aquisição<br><span>${recebimento.PRECO_DE_AQUISICAO}</span></div>
                        <div class="cell">Quantidade<br><span>${recebimento.QUANT}</span></div>  
                    </div>
                    <div class="detailsRow">
                            <img src="${recebimento.IMAGEM}" alt="Imagem do Produto" />
                            <div class="detail-item"><strong>Fabricante</strong> <span>${recebimento.FABRICANTE}</span></div>
                            <div class="detail-item"><strong>Preço de Venda</strong> <span>${recebimento.PRECO_DE_VENDA}</span></div>
                            <div class="detail-item"><strong>Fragilidade</strong> <span>${recebimento.FRAGILIDADE}</span></div>
                    </div>
                </div>   
                </div>
            `;

            tabelaRecebimentos.innerHTML += row;
        });
    } catch (error) {
        alert('Erro ao buscar recebimentos: ' + error.message);
    }
}

window.onload = fetchVerRecebimentos;


// document.addEventListener("DOMContentLoaded", () => {
//   const tableContainer = document.getElementById("table-container");

//   // Função para carregar os dados do servidor
//   async function loadTableData() {
//     try {
//       const response = await fetch("/Recebimento"); // URL da sua API
//       const data = await response.json();

//       // Gerar as linhas da tabela dinamicamente
//       data.forEach((item) => {
//         const mainRow = document.createElement("div");
//         mainRow.classList.add("row", "main-row");
//         mainRow.innerHTML = `
//                           <div class="cell">Data<br><span>${item.DATA_RECEB}</span></div>
//                           <div class="cell">Código<br><span>${item.CODIGO}</span></div>
//                           <div class="cell">Item<br><span>${item.NOME_BASICO}</span></div>
//                           <div class="cell">Fornecedor<br><span>${item.Fornecedor}</span></div>
//                           <div class="cell">Preço Aquisição<br><span>${item.PRECO_DE_AQUISICAO}</span></div>
//                           <div class="cell">Quantidade<br><span>${item.QUANT}</span></div>
//                       `;

//         // Linha de detalhes
//         const detailsRow = document.createElement("div");
//         detailsRow.classList.add("row", "details-row");
//         detailsRow.style.display = "none"; // Oculto por padrão
//         detailsRow.innerHTML = `
//                           <div class="details-left">
//                               <img src="${item.IMAGEM}" alt="Imagem do Produto" />
//                           </div>
//                           <div class="details-right">
//                               <div class="detail-item"><strong>Fabricante</strong> <span>${item.FABRICANTE}</span></div>
//                               <div class="detail-item"><strong>Preço de Venda</strong> <span>${item.PRECO_DE_VENDA}</span></div>
//                               <div class="detail-item"><strong>Fragilidade</strong> <span>${item.FRAGILIDADE}</span></div>
//                           </div>
//                       `;

//         // Adicionar as linhas à tabela
//         tableContainer.appendChild(mainRow);
//         tableContainer.appendChild(detailsRow);
//       });
//     } catch (error) {
//       console.error("Erro ao carregar dados:", error);
//     }
//   }

//   loadTableData(); // Chamar a função para carregar os dados
// });

// Adicionar funcionalidade de clique
mainRow.addEventListener("click", () => {
  if (detailsRow.style.display === "flex") {
    detailsRow.style.display = "none";
  } else {
    detailsRow.style.display = "flex";
  }
});


// ADICIONAR RECEBIMENTO FORMULARIO

// document.getElementById('registrationForm').addEventListener('submit', async function (event) {
//   event.preventDefault();

//   const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

//   const recebimento = {
//       nomeBasico: document.getElementById('productName').value,
//       fornecedor: document.getElementById('fornecedor').value,
//       codigo: document.getElementById('codigo').value,
//       quantidade: document.getElementById('quantityReceived').value,
//       numbLote: document.getElementById('numbLote').value,
//       dataRecebimento: document.getElementById('dataRecebimento').value,
//       validade: document.getElementById('validade').value,
//       inseridoPor: usuarioLogado.tipo === 'professor' ? SNProfessor : usuarioLogado.email,
//   };



//   try {
//       const response = await fetch('http://localhost:3000/adicionar-recebimento', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(recebimento),
//       });

//       if (response.ok) {
//           alert('recebimento adicionado com sucesso!');
//       } else {
//           const errorMessage = await response.text();
//           alert('Erro: ' + errorMessage);
//       }
//   } catch (error) {
//       alert('Erro ao adicionar recebimento ' + error.message);
//   }
// });
