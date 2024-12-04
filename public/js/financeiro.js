
  // Alternar exibição do formulário de recebimento
  function toggleForm() {
    const formContainer = document.getElementById('formContainer');
    if (formContainer.style.display === 'block') {
      formContainer.style.display = 'none';
    } else {
      formContainer.style.display = 'block';
    }
  }
  document.getElementById('formContainer').addEventListener('click', (event) => {
  const formContent = document.getElementById('formContent');
  if (!formContent.contains(event.target)) {
    document.getElementById('formContainer').style.display = 'none';
  }
});





  function submitForm() {
    const productName = document.getElementById('productName').value;
    const productFont = document.getElementById('productFont').value;
    const productCode = document.getElementById('productCode').value;
    const quantityReceived = document.getElementById('quantityReceived').value;
    const numbLote = document.getElementById('numbLote').value;
    const receivingDate = document.getElementById('receivingDate').value;
    const productValidade = document.getElementById('productValidade').value;

    // Validar os dados
    if (!productName || !productFont || !productCode || !quantityReceived || !numbLote || !receivingDate || !productValidade) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Enviar os dados para o back-end
    const formData = {
        productName: productName,
        productFont: productFont,
        productCode: productCode,
        quantityReceived: quantityReceived,
        numbLote: numbLote,
        receivingDate: receivingDate,
        productValidade: productValidade
    };

    // Usar Fetch API para enviar os dados
    fetch('http://localhost:3000/financeiro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cadastro realizado com sucesso!');
            document.getElementById('registrationForm').reset(); // Limpar formulário
        } else {
            alert('Erro ao cadastrar. Tente novamente.');
        }
    })
    .catch(error => {
        alert('Erro de conexão. Tente novamente.');
        console.error('Erro:', error);
    });
}


