const mdlContasPagar = require("../model/mdlContas_Pagar");

// GetAllContasPagar
const getAllContasPagar = (req, res) =>
  (async () => {
    const registro = await mdlContasPagar.getAllContasPagar();
    res.json({ status: "ok", registro });
  })();

// GetContaPagarByID
const getContaPagarByID = (req, res) =>
  (async () => {
    const contaPagarID = parseInt(req.body.contapagarid);
    const registro = await mdlContasPagar.getContaPagarByID(contaPagarID);
    res.json({ status: "ok", registro });
  })();

// InsertContasPagar
const insertContasPagar = (req, res) =>
  (async () => {
    const registro = req.body; // fornecedor_id, descricao, valor, data_vencimento (YYYY-MM-DD)
    const { msg, linhasAfetadas } = await mdlContasPagar.insertContasPagar(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdateContasPagar
const updateContasPagar = (req, res) =>
  (async () => {
    const registro = req.body; // contapagarid, fornecedor_id, descricao, valor, data_vencimento
    const { msg, linhasAfetadas } = await mdlContasPagar.updateContasPagar(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeleteContasPagar 
const deleteContasPagar = (req, res) =>
  (async () => {
    const registro = req.body; // contapagarid
    const { msg, linhasAfetadas } = await mdlContasPagar.deleteContasPagar(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  getAllContasPagar,
  getContaPagarByID,
  insertContasPagar,
  updateContasPagar,
  deleteContasPagar,
};
