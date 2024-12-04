function abrirLinha(){
    let btnAbrirLinha = document.getQuerySelector("btnAbrirLinha");
    let linhaDetalhe = document.getElementById("linhaDetalhe"); 
    btnAbrirLinha.addEventListener("click", function(){
        if (linhaDetalhe.style.display == 'none') {
        linhaDetalhe.style.display = 'table-row';
        } else {
        linhaDetalhe.style.display = 'none';
    }
    })
}

