// ALTERADO: Importar o model correto
const mdlFornecedores = require("../model/mdlFornecedores");

// GetAllFornecedores
const getAllFornecedores = (req, res) =>
  (async () => {
    // ALTERADO: Chamar a função do model de fornecedores
    const registro = await mdlFornecedores.getAllFornecedores();
    res.json({ status: "ok", registro });
  })();

// GetFornecedorByID
const getFornecedorByID = (req, res) =>
  (async () => {
    // ALTERADO: Parâmetro para fornecedorid
    const fornecedorID = parseInt(req.body.fornecedorid);
    // ALTERADO: Chamar a função do model de fornecedores
    const registro = await mdlFornecedores.getFornecedorByID(fornecedorID);
    res.json({ status: "ok", registro });
  })();

// InsertFornecedores
const insertFornecedores = (req, res) =>
  (async () => {
    const registro = req.body;
    // ALTERADO: Chamar a função do model de fornecedores
    const { msg, linhasAfetadas } = await mdlFornecedores.insertFornecedores(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdateFornecedores
const updateFornecedores = (req, res) =>
  (async () => {
    const registro = req.body; // deve conter fornecedorid, nome, telefone, endereco
    // ALTERADO: Chamar a função do model de fornecedores
    const { msg, linhasAfetadas } = await mdlFornecedores.updateFornecedores(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeleteFornecedores (soft delete)
const deleteFornecedores = (req, res) =>
  (async () => {
    const registro = req.body; // deve conter fornecedorid
    // ALTERADO: Chamar a função do model de fornecedores
    const { msg, linhasAfetadas } = await mdlFornecedores.deleteFornecedores(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  // ALTERADO: Nomes das funções exportadas
  getAllFornecedores,
  getFornecedorByID,
  insertFornecedores,
  updateFornecedores,
  deleteFornecedores,
};
