const array = [];

function clique() {
        let nome = document.getElementById("nome").value;
        let email = document.getElementById("email").value;
        let telefone = document.getElementById("telefone").value;

        if (!nome.trim || !email.trim || !telefone.trim()) {
            alert("Por favor, preencha todos os campos!");
            return;
        }
        const obj = {
            nome: nome,
            email: email,
            telefone: telefone
        };

        array.push(obj);

        let textoTabela = "";

        for (let i = 0; i < array.length; i++) {
            textoTabela += `<tr> 
                <td> ${array[i].nome} </td> 
                <td> ${array[i].email} </td> 
                <td> ${array[i].telefone} </td> 
            </tr>`;
        }

  
    // Atualiza a tabela instantaneamente
        document.getElementById("corpo_tabela").innerHTML = textoTabela;

        // Limpa os campos do formulário para o próximo preenchimento
        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
        document.getElementById("telefone").value = "";

        formulario.resert()
}



  

    


   

    

      