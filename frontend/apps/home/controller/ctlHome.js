const axios = require("axios"); // <--- AQUI DEVE ESTAR A IMPORTAÇÃO

const homeController = async (req, res) => { // Removido o embrulho desnecessário (async () => { ... })()
  const token = req.session.token;

  // Variáveis que virão do banco/API
  let contas_count = 0; // Contagem de contas
  let vencidas_count = 0;
  let a_pagar_count = 0;
  let remoteMSG = null;

  try {
    // 1. Chamada para Contagem de ContasPagar (Fornecedores Cadastrados)
    const contasResp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllContasPagar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    // 2. CONTAGEM
    if (contasResp.data.registro && Array.isArray(contasResp.data.registro)) {
      contas_count = contasResp.data.registro.length;
    }
    

  } catch (error) {
    // Tratamento de erros
    if (error.code === "ECONNREFUSED") {
      remoteMSG = "Servidor backend indisponível";
    } else if (error.response && error.response.status === 401) {
      remoteMSG = "Sessão expirada. Faça login novamente.";
    } else {
      remoteMSG = "Erro desconhecido ao carregar dados do painel.";
      console.error(remoteMSG, error.message);
    }
  }

  // 3. Renderiza o template da Home, PASSANDO AS VARIÁVEIS CALCULADAS
  const parametros = { 
    title: "Página Inicial",
    erro: remoteMSG, 
    vencidas_count: vencidas_count, 
    a_pagar_count: a_pagar_count, 
    fornecedores_count: contas_count, 
  };

  res.render("home/view/index.njk", { parametros });
};

module.exports = {
  homeController,
};