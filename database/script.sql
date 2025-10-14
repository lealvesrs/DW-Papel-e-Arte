-- (Opcional) Cria o banco e conecta nele
CREATE DATABASE papelaria;
\c papelaria;

-- =========================
-- TABELAS
-- =========================

-- Fornecedores (1)
CREATE TABLE fornecedores (
  id         BIGSERIAL PRIMARY KEY,
  nome       TEXT NOT NULL CHECK (btrim(nome) <> ''),
  telefone   TEXT,              -- prefira TEXT para manter zeros/DDD/+
  endereco   TEXT,
  removido   BOOLEAN NOT NULL DEFAULT FALSE
);

-- Contas a pagar (N)
CREATE TABLE contas_pagar (
  id               BIGSERIAL PRIMARY KEY,
  fornecedor_id    BIGINT NOT NULL,
  descricao        TEXT NOT NULL CHECK (btrim(descricao) <> ''),
  valor            NUMERIC(15,2) NOT NULL CHECK (valor >= 0),
  data_vencimento  DATE NOT NULL,
  removido         BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_contas_pagar_fornecedor
    FOREIGN KEY (fornecedor_id)
    REFERENCES fornecedores(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- =========================
-- ÍNDICES ÚTEIS
-- =========================
CREATE INDEX idx_contas_pagar_fornecedor   ON contas_pagar (fornecedor_id);
CREATE INDEX idx_contas_pagar_vencimento   ON contas_pagar (data_vencimento);
CREATE INDEX idx_fornecedores_ativos       ON fornecedores (id) WHERE removido = FALSE;
CREATE INDEX idx_contas_pagar_ativas       ON contas_pagar (fornecedor_id, data_vencimento) WHERE removido = FALSE;

-- =========================
-- VIEWS (opcional) ignorando removidos
-- =========================
CREATE VIEW vw_fornecedores_ativos AS
  SELECT * FROM fornecedores WHERE removido = FALSE;

CREATE VIEW vw_contas_pagar_ativas AS
  SELECT * FROM contas_pagar WHERE removido = FALSE;
