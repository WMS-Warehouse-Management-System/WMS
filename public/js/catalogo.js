

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