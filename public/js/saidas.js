// Alternar exibição do formulário de recebimento
/* TUDO CERTO */
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
      
      const data = document.getElementById("receiving_date").value;
      const quantidade = document.getElementById("quantity_received").value;
      const codigo = document.getElementById("product_code").value;
      const lote = document.getElementById("numb_lote").value;
      const fornecedor = document.getElementById("product_font").value;
  
  
      const formContainer = document.getElementById("formContainer");
  
      const response = await fetch("http://localhost:3000/Saidas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          
          Data: data,
          Quantidade: quantidade,
          Codigo: codigo,
          Lote: lote,
          Fornecedor: fornecedor,
        }),
      });
  
      if (response.ok) {
        alert("Saída adicionada com sucesso!");
        document.getElementById("productForm").reset(); // Limpa o formulário
        formContainer.style.display = "none";
  
      } else {
        alert("Erro ao adicionar saída!");
      }
    });
  
  
  
  //--------------------------------------------------------------Aparecer os recebimentos na tela
  async function fetchVerSaidas() {
    try {
      const response = await fetch('/Saidas');
  
      if (!response.ok) {
        throw new Error('Erro ao buscar saídas: ' + response.statusText);
      }
  
      const saidas = await response.json();
  
      const tabelaRecebimentos = document.querySelector('.table-container');
      if (!tabelaRecebimentos) {
        throw new Error('Elemento com a classe "table-container" não encontrado no DOM.');
      }
  
      tabelaRecebimentos.innerHTML = ''; // Limpa o conteúdo anterior
  
      if (saidas.length === 0) {
        tabelaRecebimentos.innerHTML = '<div class="nenhum-recebimento">Nenhuma saída encontrada</div>';
        return;
      }
  
     saidas.forEach((saida, index) => {
        // Cria uma linha principal
        const mainRow = document.createElement('div');
        mainRow.classList.add('row', 'main-row');
        mainRow.innerHTML = `
          <div class="cell"><strong>Data</strong><span>${saida.DATA_SAIDA}</span></div>
          <div class="cell"><strong>Código</strong><span>${saida.CODIGO}</span></div>
          <div class="cell"><strong>Item</strong><span>${saida.NOME_BASICO}</span></div>
          <div class="cell"><strong>Fornecedor</strong><span>${saida.FORNECEDOR}</span></div>
          <div class="cell"><strong>Preço Aquisição</strong><span>${saida.PRECO_DE_AQUISICAO} R$</span></div>
          <div class="cell"><strong>Quantidade</strong><span>${saida.QUANT}</span></div>
        `;
  
        // Cria a linha de detalhes
        const detailsRow = document.createElement('div');
        detailsRow.classList.add('row', 'details-row');
        detailsRow.style.display = 'none'; // Esconde inicialmente
        detailsRow.innerHTML = `
          <div class="details-left">
            <div class="image-placeholder">
              <img src="${saida.IMAGEM}" alt="Ícone de imagem">
            </div>
          </div>
          <div class="details-right">
            <div class="detail-item"><strong>Fragilidade:</strong><span>${saida.FRAGILIDADE}</span></div>
            <div class="detail-item"><strong>Fabricante:</strong><span>${saida.FABRICANTE}</span></div>
            <div class="detail-item"><strong>Lote:</strong><span>${saida.LOTE}</span></div>
            <div class="detail-item"><strong>Validade:</strong><span>${saida.VALIDADE}</span></div>
            <div class="detail-item"><strong>Preço Venda:</strong><span>${saida.PRECO_DE_VENDA} RS</span></div>
          </div>
        `;
  
        // Adiciona um evento de clique à linha principal
        mainRow.addEventListener('click', () => {
          detailsRow.style.display = detailsRow.style.display === 'none' ? 'flex' : 'none';
        });
  
        // Adiciona as linhas à tabela
        tabelaRecebimentos.appendChild(mainRow);
        tabelaRecebimentos.appendChild(detailsRow);
      });
    } catch (error) {
      alert('Erro ao buscar saídas: ' + error.message);
    }
  }
  
  // Chama a função ao carregar a página
  window.onload = fetchVerSaidas;
  
  
  
  
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const mainRows = document.querySelectorAll(".main-row"); // Seleciona todas as linhas principais
  
    mainRows.forEach((row) => {
        row.addEventListener("click", () => {
            const detailsRow = row.nextElementSibling; // Seleciona a linha de detalhes imediatamente após a linha clicada
            if (detailsRow && detailsRow.classList.contains("details-row")) {
                // Alterna visibilidade
                if (detailsRow.style.display === "flex") {
                    detailsRow.style.display = "none"; // Esconder detalhes
                } else {
                    detailsRow.style.display = "flex"; // Mostrar detalhes
                }
            }
        });
    });
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