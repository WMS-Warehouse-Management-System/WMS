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

