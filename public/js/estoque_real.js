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

//----------SCRIPT PRINCIPAL

    async function fetchEstoqueReal() {
        try {
            const response = await fetch('/estoque-real');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos: ' + response.statusText);
            }

            const produtos = await response.json();

            const tbody = document.querySelector('#tabela-estoque tbody');
            tbody.innerHTML = '';

            if (produtos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8">Nenhum produtos encontrado</td></tr>';
                return;
            }

            produtos.forEach(produtos => {

const row = `
<tr>
    <td>${produtos.CODIGO}</td>
    <td>${produtos.NOME_BASICO}</td>
    <td>50</td>
    <td>${produtos.QUANT_RECENTE}</td>
    <td>${produtos.QUANTIDADE}</td>
    <td>${produtos.QUANTIDADE}</td>
    <td>100%</td>
    <td>OK</td>
</tr>

    `;
tbody.innerHTML += row;
});
            } catch (error) {
                alert('Erro ao buscar usuários: ' + error.message);
            }
    }

    window.onload = fetchEstoqueReal;
