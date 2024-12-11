
  
  //--------------------------------------------------------------Aparecer os saldos na tela
  async function fetchVerSaldos() {
    try {
      const response = await fetch('/Saldos');
  
      if (!response.ok) {
        throw new Error('Erro ao buscar saldos: ' + response.statusText);
      }
  
      const saldos = await response.json();
  
      const tabelaRecebimentos = document.querySelector('.table-container');
      if (!tabelaRecebimentos) {
        throw new Error('Elemento com a classe "table-container" não encontrado no DOM.');
      }
  
      tabelaRecebimentos.innerHTML = ''; // Limpa o conteúdo anterior
  
      if (saldos.length === 0) {
        tabelaRecebimentos.innerHTML = '<div class="nenhum-recebimento">Nenhum saldo encontrado</div>';
        return;
      }
  
      const saldosAcumulados = {}; // Armazenará os saldos por produto e lote
  
      saldos.forEach((saldo) => {
        const key = `${saldo.CODIGO}-${saldo.LOTE}`; // Chave para identificar produto e lote
        if (!saldosAcumulados[key]) {
          saldosAcumulados[key] = {
            NOME_BASICO: saldo.NOME_BASICO,
            CODIGO: saldo.CODIGO,
            LOTE: saldo.LOTE,
            QUANT_RECEBIMENTO: 0,
            QUANT_SAIDA: 0,
            saldo: 0
          };
        }
  
        // Converte as quantidades para números antes de somar
        const quantRecebida = Number(saldo.QUANT_RECEBIMENTO);
        const quantSaida = Number(saldo.QUANT_SAIDA);
  
        // Atualiza o saldo acumulado (Recebimento - Saída)
        saldosAcumulados[key].QUANT_RECEBIMENTO += quantRecebida;
        saldosAcumulados[key].QUANT_SAIDA += quantSaida;
        saldosAcumulados[key].saldo += quantRecebida - quantSaida;
      });
  
      // Criação da tabela com os saldos acumulados
      Object.values(saldosAcumulados).forEach((saldo) => {
        const mainRow = document.createElement('div');
        mainRow.classList.add('row', 'main-row');
        mainRow.innerHTML = `
          <div class="cell"><strong>Item</strong><span>${saldo.NOME_BASICO}</span></div>
          <div class="cell"><strong>Código</strong><span>${saldo.CODIGO}</span></div>
          <div class="cell"><strong>Lote</strong><span>${saldo.LOTE}</span></div>
          <div class="cell"><strong>Quantidade Recebida</strong><span>${saldo.QUANT_RECEBIMENTO}</span></div>
          <div class="cell"><strong>Quantidade Saída</strong><span>${saldo.QUANT_SAIDA}</span></div>
          <div class="cell"><strong>Saldo</strong><span>${saldo.saldo}</span></div>
        `;
  
        // Adiciona a linha à tabela
        tabelaRecebimentos.appendChild(mainRow);
      });
    } catch (error) {
      alert('Erro ao buscar saldos: ' + error.message);
    }
  }
  
  // Chama a função ao carregar a página
  window.onload = fetchVerSaldos;
  
  
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