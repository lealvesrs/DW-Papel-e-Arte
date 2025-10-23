----- Cria um banco de dados
-- =========================================================
-- EXTENSÕES ÚTEIS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- AUTENTICAÇÃO (necessária para o /Login dos testes)
-- =========================================================
CREATE TABLE IF NOT EXISTS usuarios (
  usuarioid BIGSERIAL CONSTRAINT pk_usuarios PRIMARY KEY,
  username  VARCHAR(50) UNIQUE,
  password  TEXT,
  deleted   BOOLEAN DEFAULT FALSE
);

INSERT INTO usuarios (username, password)
VALUES
  ('admin', crypt('admin', gen_salt('bf'))), 
  ('qwe',   crypt('qwe',   gen_salt('bf')))  
ON CONFLICT (username) DO NOTHING;

-- =========================================================
-- TABELAS DO MÓDULO (Fornecedores / Contas a Pagar)
-- =========================================================

-- Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id        BIGSERIAL CONSTRAINT pk_fornecedores PRIMARY KEY,
  nome      TEXT NOT NULL CHECK (btrim(nome) <> ''),
  telefone  TEXT,
  endereco  TEXT,
  removido  BOOLEAN NOT NULL DEFAULT FALSE
);

-- Contas a Pagar
CREATE TABLE IF NOT EXISTS contas_pagar (
  id               BIGSERIAL CONSTRAINT pk_contas_pagar PRIMARY KEY,
  fornecedor_id    BIGINT NOT NULL
                   CONSTRAINT fk_contas_pagar_fornecedor
                   REFERENCES fornecedores(id)
                   ON UPDATE CASCADE
                   ON DELETE RESTRICT,
  descricao        TEXT NOT NULL CHECK (btrim(descricao) <> ''),
  valor            NUMERIC(15,2) NOT NULL CHECK (valor >= 0),
  data_vencimento  DATE NOT NULL,
  removido         BOOLEAN NOT NULL DEFAULT FALSE
);

-- =========================================================
-- ÍNDICES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_fornecedores_ativos
  ON fornecedores (id) WHERE removido = FALSE;

CREATE INDEX IF NOT EXISTS idx_contas_pagar_fornecedor
  ON contas_pagar (fornecedor_id);

CREATE INDEX IF NOT EXISTS idx_contas_pagar_vencimento
  ON contas_pagar (data_vencimento);

CREATE INDEX IF NOT EXISTS idx_contas_pagar_ativas
  ON contas_pagar (fornecedor_id, data_vencimento) WHERE removido = FALSE;

-- =========================================================
-- DADOS DE EXEMPLO PARA RODAR OS TESTES
-- =========================================================

-- Insert Fornecedores 
INSERT INTO fornecedores (nome, telefone, endereco, removido)
VALUES
  ('Papel & Cia',        '+55 11 99999-0001', 'Rua das Flores, 100', FALSE),
  ('Suprimentos XYZ',    '+55 11 98888-0002', 'Av. Central, 200',    FALSE),
  ('Gráfica Alfa',       '+55 11 97777-0003', 'Rua Alfa, 300',        FALSE)
ON CONFLICT DO NOTHING;

-- Insert Contas a Pagar
INSERT INTO contas_pagar (fornecedor_id, descricao, valor, data_vencimento, removido)
VALUES
  ((SELECT id FROM fornecedores ORDER BY id ASC LIMIT 1), 'Compra de papel A4 (cx)',   450.90, CURRENT_DATE + INTERVAL '10 day', FALSE),
  ((SELECT id FROM fornecedores ORDER BY id ASC LIMIT 1), 'Toners impressora (2 un)',  870.00, CURRENT_DATE + INTERVAL '15 day', FALSE),
  ((SELECT id FROM fornecedores ORDER BY id ASC OFFSET 1 LIMIT 1), 'Cartuchos color',  320.50, CURRENT_DATE + INTERVAL '20 day', FALSE)
ON CONFLICT DO NOTHING;

-- =========================================================
-- CONSULTAS RÁPIDAS
-- =========================================================

-- Fornecedores ativos
SELECT * FROM fornecedores WHERE removido = FALSE ORDER BY nome;

-- Contas a pagar ativas (ordenadas por vencimento)
SELECT * FROM contas_pagar WHERE removido = FALSE ORDER BY data_vencimento ASC, id ASC;
