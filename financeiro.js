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

