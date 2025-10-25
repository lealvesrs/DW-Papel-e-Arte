const axios = require("axios");

const homeController = async (req, res) => { 
  const token = req.session.token;

  let vencidas_count = 0;
  let a_pagar_count = 0;
  let remoteMSG = null;

  try {

    const contasResp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllContasPagar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (contasResp.data.registro && Array.isArray(contasResp.data.registro)) {
      const dataAtual = new Date();
      
      contasResp.data.registro.forEach((conta) => {
        const dataVencimento = new Date(conta.data_vencimento);
        
        if (dataVencimento < dataAtual) {
          vencidas_count++;
        } 
        else{
          a_pagar_count++;
        }
      });
    }
    

  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      remoteMSG = "Servidor backend indisponível";
    } else if (error.response && error.response.status === 401) {
      remoteMSG = "Sessão expirada. Faça login novamente.";
    } else {
      remoteMSG = "Erro desconhecido ao carregar dados do painel.";
      console.error(remoteMSG, error.message);
    }
  }


  const parametros = { 
    title: "Página Inicial",
    erro: remoteMSG, 
    vencidas_count: vencidas_count, 
    a_pagar_count: a_pagar_count, 
    fornecedores_count: await totalFornecedores(token), 
  };

  res.render("home/view/index.njk", { parametros });
};

async function totalFornecedores(token){
  const fornResp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllFornecedores", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  return fornResp.data.registro.length;
}

module.exports = {
  homeController,
};