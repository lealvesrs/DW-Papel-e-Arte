// ALTERADO: Importar o model correto
const mdlContasPagar = require("../model/mdlContasPagar");

// GetAllContasPagar
const getAllContasPagar = (req, res) =>
  (async () => {
    // ALTERADO: Chamar a função do model de contas a pagar
    const registro = await mdlContasPagar.getAllContasPagar();
    res.json({ status: "ok", registro });
  })();

// GetContaPagarByID
const getContaPagarByID = (req, res) =>
  (async () => {
    // ALTERADO: Parâmetro para contapagarid
    const contaPagarID = parseInt(req.body.contapagarid);
    // ALTERADO: Chamar a função do model de contas a pagar
    const registro = await mdlContasPagar.getContaPagarByID(contaPagarID);
    res.json({ status: "ok", registro });
  })();

// InsertContasPagar
const insertContasPagar = (req, res) =>
  (async () => {
    const registro = req.body; // fornecedor_id, descricao, valor, data_vencimento (YYYY-MM-DD)
    // ALTERADO: Chamar a função do model de contas a pagar
    const { msg, linhasAfetadas } = await mdlContasPagar.insertContasPagar(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdateContasPagar
const updateContasPagar = (req, res) =>
  (async () => {
    const registro = req.body; // contapagarid, fornecedor_id, descricao, valor, data_vencimento
    // ALTERADO: Chamar a função do model de contas a pagar
    const { msg, linhasAfetadas } = await mdlContasPagar.updateContasPagar(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeleteContasPagar (soft delete)
const deleteContasPagar = (req, res) =>
  (async () => {
    const registro = req.body; // contapagarid
    // ALTERADO: Chamar a função do model de contas a pagar
    const { msg, linhasAfetadas } = await mdlContasPagar.deleteContasPagar(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  // ALTERADO: Nomes das funções exportadas
  getAllContasPagar,
  getContaPagarByID,
  insertContasPagar,
  updateContasPagar,
  deleteContasPagar,
};
