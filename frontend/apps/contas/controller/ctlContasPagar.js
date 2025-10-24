const axios = require("axios");
const moment = require("moment");


const manutContasPagar = async (req, res) =>
  (async () => {
    //@ Abre o formulário de manutenção de contas
    const userName = req.session.userName;
    const token = req.session.token;
    //console.log("[ctlContasPagar|ManutContasPagar] Valor token:" + token)
    // try {
    let remoteMSG = null;
    let resp = null;
    try {
        resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllContasPagar", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Set JWT token in the header
            }
        });
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            remoteMSG = "Servidor indisponível"
        } else if (error.response && error.response.status === 401) {
            remoteMSG = "Usuário não autenticado";
        } else {
            remoteMSG = error.message;
        }

        res.render("contas/view/vwManutContasPagar.njk", {
            title: "Manutenção de Contas a Pagar",
            data: null,
            erro: remoteMSG, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
            userName: userName,
        });
        return; // Sai se houver erro
    }

    res.render("contas/view/vwManutContasPagar.njk", {
      title: "Manutenção de Contas a Pagar",
      data: resp.data.registro,
      erro: remoteMSG,
      userName: userName,
    });
  })();

const insertContasPagar = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      //@ Busca os fornecedores disponíveis
      let fornecedores = null;
      try {
        fornecedores = await axios.get(
          process.env.SERVIDOR_DW3Back + "/GetAllFornecedores", { // MUDANÇA: /GetAllCursos -> /GetAllFornecedores
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Set JWT token in the header
          }
        });
      } catch (error) {
        console.error('Erro ao buscar fornecedores no servidor backend:', error.message);
        // Pode-se tratar o erro aqui, por exemplo, renderizando a página sem a lista
        // Ou com uma mensagem de erro específica para o formulário
        return res.render("contas/view/vwFCrContasPagar.njk", {
            title: "Cadastro de Contas a Pagar",
            data: null,
            erro: `Erro ao carregar fornecedores: ${error.message}`,
            fornecedores: null, // MUDANÇA: conta -> fornecedores
            userName: null,
          });
      }


      return res.render("contas/view/vwFCrContasPagar.njk", {
        title: "Cadastro de Contas a Pagar",
        data: null,
        erro: null, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
        fornecedor: fornecedores.data.registro, // MUDANÇA: conta -> fornecedor (no frontend)
        userName: null,
      });

    } else {
      //@ POST
      const regData = req.body;
      const token = req.session.token;

      try {
        // @ Enviando dados para o servidor Backend
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertContasPagar", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000, // @ 5 segundos de timeout
        });

        //console.log('[ctlContasPagar|InsertContasPagar] Dados retornados:', response.data);

        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        let msg = 'Erro ao inserir dados no servidor backend';
        if (error.response && error.response.data && error.response.data.msg) {
          msg = error.response.data.msg;
        } else if (error.message) {
          msg = error.message;
        }
        console.error('[ctlContasPagar|InsertContasPagar] Erro ao inserir dados no servidor backend:', msg);
        res.json({
          status: "Error",
          msg: msg,
          data: null,
          erro: null,
        });
      }
    }
  })();

const ViewContasPagar = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    let response = null;
    let oper = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getContaPagarByID",
          {
            contaPagarid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log('[ctlContasPagar|ViewContasPagar] Dados retornados:', response.data);
        if (response.data.status == "ok") {
          //@ Busca os fornecedores disponíveis
          const fornecedores = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllFornecedores", { // MUDANÇA: /GetAllCursos -> /GetAllFornecedores
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].data_vencimento = moment(response.data.registro[0].data_vencimento).format(
            "YYYY-MM-DD"
          );

          res.render("contas/view/vwFRUDrContasPagar.njk", {
            title: "Visualização de Contas a Pagar", // MUDANÇA: contas -> Contas a Pagar
            data: response.data.registro[0],
            disabled: true,
            fornecedores: fornecedores.data.registro, // MUDANÇA: conta -> fornecedor (no frontend)
            userName: userName,
          });
        } else {
          console.log("[ctlContasPagar|ViewContasPagar] ID de Conta não localizada!");
          res.json({ status: "[ctlContasPagar.js|ViewContasPagar] Conta não localizada!" });
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlContasPagar.js|ViewContasPagar] Conta não localizada!" });
      console.log(
        "[ctlContasPagar.js|ViewContasPagar] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

const UpdateContaPagar = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    let response = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getContaPagarByID",
          {
            contaPagarid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log('[ctlContasPagar|UpdateContaPagar] Dados retornados:', response.data);
        if (response.data.status == "ok") {
          //@ Busca os fornecedores disponíveis
          const fornecedores = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllFornecedores", { // MUDANÇA: /GetAllCursos -> /GetAllFornecedores
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].data_vencimento = moment(response.data.registro[0].data_vencimento).format(
            "YYYY-MM-DD"
          );

          res.render("contas/view/vwFRUDrContasPagar.njk", {
            title: "Atualização de dados de Contas a Pagar", // MUDANÇA: contas -> Contas a Pagar
            data: response.data.registro[0],
            disabled: false,
            fornecedor: fornecedores.data.registro, // MUDANÇA: conta -> fornecedor (no frontend)
            userName: userName,
          });
        } else {
          console.log("[ctlContasPagar|UpdateContaPagar] Dados não localizados");
          res.json({ status: "[ctlContasPagar.js|UpdateContaPagar] Conta não localizada!" });
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        // console.log("[ctlContasPagar|UpdateContaPagar] Valor regData:", JSON.stringify(regData));
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateContasPagar", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000, // @ 5 segundos de timeout
          });

          //console.log('[ctlContasPagar|InsertContasPagar] Dados retornados:', response.data);

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          let msg = 'Erro ao atualizar dados de contas no servidor backend';
          if (error.response && error.response.data && error.response.data.msg) {
            msg = error.response.data.msg;
          } else if (error.message) {
            msg = error.message;
          }
          console.error('[ctlContasPagar.js|UpdateContaPagar] Erro ao atualizar dados de contas no servidor backend:', msg);
          res.json({
            status: "Error",
            msg: msg,
            data: null,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlContasPagar.js|UpdateContaPagar] Conta não localizada!" });
      console.log(
        "[ctlContasPagar.js|UpdateContaPagar] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteContaPagar = async (req, res) =>
  (async () => {
    //@ POST
    const regData = req.body;
    const token = req.session.token;
    //console.log("[ctlContasPagar|DeleteContaPagar] Valor regData:", JSON.stringify(regData));

    try {
      // @ Enviando dados para o servidor Backend
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteContasPagar", regData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000, // @ 5 segundos de timeout
      });

      //console.log('[ctlContasPagar|DeleteContaPagar] Dados retornados:', response.data);

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      let msg = 'Erro ao deletar dados de contas no servidor backend';
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      } else if (error.message) {
        msg = error.message;
      }
      console.error('[ctlContasPagar.js|DeleteContaPagar] Erro ao deletar dados de contas no servidor backend:', msg);
      res.json({
        status: "Error",
        msg: msg,
        data: null,
        erro: null,
      });
    }
  })();

module.exports = {
  manutContasPagar,
  insertContasPagar,
  ViewContasPagar,
  UpdateContaPagar,
  DeleteContaPagar
};