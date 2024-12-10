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
  document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById("formContainer");
    const registrationForm = document.getElementById("registrationForm");
  
    // Fetch fornecedores para preencher o select
    async function fetchFornecedores() {
      const response = await fetch("http://localhost:3000/fornecedores");
      const fornecedores = await response.json();
  
      const fornecedorSelect = document.getElementById("product_font");
      fornecedores.forEach((fornecedor) => {
        const option = document.createElement("option");
        option.value = fornecedor.id; // ou outro campo que represente o ID
        option.textContent = fornecedor.nome;
        fornecedorSelect.appendChild(option);
      });
    }
  
    // Fetch lotes para preencher o select
    async function fetchLotes(fornecedorId) {
      const response = await fetch(`http://localhost:3000/lotes?fornecedor=${fornecedorId}`);
      const lotes = await response.json();
  
      const loteSelect = document.getElementById("numb_lote");
      loteSelect.innerHTML = '<option value="" disabled selected>Selecione o lote</option>'; // Limpa as opções
      lotes.forEach((lote) => {
        const option = document.createElement("option");
        option.value = lote.id; // ou outro campo que represente o ID do lote
        option.textContent = `Lote ${lote.id} - Estoque: ${lote.estoqueDisponivel}`;
        option.setAttribute("data-quantity", lote.estoqueDisponivel);
        loteSelect.appendChild(option);
      });
    }
  
    document.getElementById("product_font").addEventListener("change", (e) => {
      fetchLotes(e.target.value);
    });
  
    document.getElementById("numb_lote").addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      const quantidadeDisponivel = selectedOption.getAttribute("data-quantity");
  
      const quantidadeInput = document.getElementById("quantity_received");
      quantidadeInput.max = quantidadeDisponivel;
  
      const quantityHint = document.getElementById("quantity_hint");
      quantityHint.textContent = `Estoque disponível: ${quantidadeDisponivel}`;
    });
  
    registrationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const data = document.getElementById("receiving_date").value;
      const quantidade = document.getElementById("quantity_received").value;
      const codigo = document.getElementById("product_code").value;
      const lote = document.getElementById("numb_lote").value;
      const fornecedor = document.getElementById("product_font").value;
  
      const response = await fetch("http://localhost:3000/adicionar-saida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fornecedor,
          codigo,
          quantidade,
          numbLote: lote,
          dataRecebimento: data,
        }),
      });
  
      if (response.ok) {
        alert("Saída registrada com sucesso!");
        registrationForm.reset();
        formContainer.style.display = "none";
      } else {
        const error = await response.json();
        alert("Erro ao registrar saída: " + error.message);
      }
    });
  });
  
  function toggleForm() {
    const formContainer = document.getElementById("formContainer");
    formContainer.style.display =
      formContainer.style.display === "block" ? "none" : "block";
  }
  //----------------------------------------------------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const productCodeInput = document.getElementById("product_code");
    const fornecedorSelect = document.getElementById("product_font");
    const loteSelect = document.getElementById("numb_lote");

    // Quando a página carregar, verifica se já existe código do produto inserido
    if (productCodeInput.value) {
        fetchFornecedoresPorProduto(productCodeInput.value);
    }

    // Quando o código do produto for alterado
    productCodeInput.addEventListener("change", (e) => {
        const codigoProduto = e.target.value;
        fetchFornecedoresPorProduto(codigoProduto);
    });

    // Quando o fornecedor for alterado
    fornecedorSelect.addEventListener("change", () => {
        const fornecedorId = fornecedorSelect.value;
        const codigoProduto = productCodeInput.value;
        if (fornecedorId && codigoProduto) {
            fetchLotes(fornecedorId, codigoProduto);
        }
    });

    // Quando o lote for alterado, ajusta a quantidade máxima
    loteSelect.addEventListener("change", function () {
        const selectedOption = this.options[this.selectedIndex];
        const quantidadeDisponivel = selectedOption.getAttribute("data-quantity");

        const quantidadeInput = document.getElementById("quantity_received");
        quantidadeInput.max = quantidadeDisponivel;

        const quantityHint = document.getElementById("quantity_hint");
        quantityHint.textContent = `Estoque disponível: ${quantidadeDisponivel}`;
    });
});

// Função para buscar fornecedores para um produto específico
async function fetchFornecedoresPorProduto(codigo) {
    try {
        const response = await fetch(`http://localhost:3000/fornecedores?codigo=${codigo}`);
        const fornecedores = await response.json();

        const fornecedorSelect = document.getElementById("product_font");
        fornecedorSelect.innerHTML = '<option value="" disabled selected>Selecione o fornecedor</option>';

        fornecedores.forEach(fornecedor => {
            const option = document.createElement("option");
            option.value = fornecedor.id;
            option.textContent = fornecedor.nome;
            fornecedorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
        alert("Erro ao carregar fornecedores. Verifique sua conexão com o servidor.");
    }
}

// Função para buscar os lotes de um fornecedor e produto específico
async function fetchLotes(fornecedorId, codigo) {
    try {
        const response = await fetch(`http://localhost:3000/lotes?fornecedor=${fornecedorId}&codigo=${codigo}`);
        const lotes = await response.json();

        const loteSelect = document.getElementById("numb_lote");
        loteSelect.innerHTML = '<option value="" disabled selected>Selecione o lote</option>';

        lotes.forEach(lote => {
            const option = document.createElement("option");
            option.value = lote.id;
            option.textContent = `Lote ${lote.id} - Estoque: ${lote.estoqueDisponivel}`;
            option.setAttribute("data-quantity", lote.estoqueDisponivel);
            loteSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar lotes:", error);
        alert("Erro ao carregar lotes. Verifique sua conexão com o servidor.");
    }
}
  
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