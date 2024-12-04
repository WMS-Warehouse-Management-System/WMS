// Abrir/Fechar Sidebar
document.getElementById('menu-btn').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = '0';
  });
  
  document.getElementById('close-btn').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = '-350px'; // Esconde a sidebar
  });
  
  // Fechar sidebar quando clicar fora dela
  document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
      sidebar.style.left = '-350px'; // Esconde a sidebar
    }
  });
  