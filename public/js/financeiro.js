document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");

    // Abrir o menu
    menuBtn.addEventListener("click", () => {
        sidebar.style.left = "0";
    });

    // Fechar o menu
    closeBtn.addEventListener("click", () => {
        sidebar.style.left = "-350px";
    });
});



document.getElementById('showFormButton').addEventListener('click', function() {
    document.getElementById('formContainer').style.display = 'block';
});

// Função para processar o envio do recebimento(apenas para demonstração)
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do recebimento
    alert('Formulário enviado com sucesso!');
});

document.getElementById('formContainer').addEventListener('submit', async (event) => {
    event.preventDefault();

    const produto = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: parseFloat(document.getElementById('preco').value),
        categoria: document.getElementById('categoria').value
    };

    try {
        const response = await fetch('http://localhost:3000/adicionar-produto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });
        const message = await response.text();
        alert(message);
    } catch (error) {
        alert('Erro ao enviar dados: ' + error.message);
    }
});
