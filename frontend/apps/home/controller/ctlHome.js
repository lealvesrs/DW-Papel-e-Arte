const axios = require("axios"); // <--- AQUI DEVE ESTAR A IMPORTAÇÃO

const homeController = async (req, res) => { // Removido o embrulho desnecessário (async () => { ... })()
  const token = req.session.token;

  // Variáveis que virão do banco/API
  let alunos_count = 0; // Contagem de alunos
  let vencidas_count = 0;
  let a_pagar_count = 0;
  let remoteMSG = null;

  try {
    // 1. Chamada para Contagem de Alunos (Fornecedores Cadastrados)
    const alunosResp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllAlunos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    // 2. CONTAGEM
    if (alunosResp.data.registro && Array.isArray(alunosResp.data.registro)) {
      alunos_count = alunosResp.data.registro.length;
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
    fornecedores_count: alunos_count, 
  };

  res.render("home/view/index.njk", { parametros });
};

module.exports = {
  homeController,
};