

function abrirLinha() {
    let btnAbrirLinha = document.querySelector(".btnAbrirLinha"); 
    let linhaDetalhe = document.getElementById("linhaDetalhe"); 

    if (btnAbrirLinha && linhaDetalhe) { 
        btnAbrirLinha.addEventListener("click", function () {

        if (displayAtual === 'none') {
            linhaDetalhe.style.display = 'table-row'; 
           
        } else {
            linhaDetalhe.style.display = 'none'; 
            
            }
        });


        if(btnAbrirLinha.textContent.includes("+")){
            btnAbrirLinha.innerHTML = "-"; 
        }
        else{
            btnAbrirLinha.innerHTML = "+";
        }

}
}

function teste(){
    alert('teste12234')
}


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