    function cadastrarEstabelecimento(){
      var nome = $("#nome-restaurante").val();
      var cnpj = $("#cnpj-restaurante").val();
      var email = $("#email-restaurante").val();
      var telefone = $("#telefone-restaurante").val();
      var endereco = $("#endereco-restaurante").val();
      var estado = $("#estado-restaurante").val();
      var cidade = $("#cidade-restaurante").val();
      var dono = $("#nome-dono").val();
      var login = $("#login-dono").val();
      var senha = $("#senha-dono").val();
      var restaurante = {
        "nome": nome,
        "cnpj": cnpj,
        "email": email,
        "telefone": telefone,
        "endereco": endereco,
        "cidade": cidade,
        "estado": estado
      };
      var funcionario =
      {
        "nome": dono,
        "login": login,
        "senha": senha
      };
      debugger;
      $.get('/cadastrarEstabelecimento/' + JSON.stringify(restaurante)+'/'+JSON.stringify(funcionario), function(data){
        if(data== "Adicionado"){
          document.location.href = '/login';
        }
      });
    }
