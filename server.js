const express = require('express');
const { cifrar, decifrar, quebrar } = require('./cesar');

const app = express();
app.use(express.json());

const erro = (res, mensagem) => res.status(400).json({ erro: mensagem });

const textoValido = (v) => typeof v === 'string' && v.length > 0;
const deslocamentoValido = (v) => Number.isInteger(v);

// POST /cifrar  { textoClaro, deslocamento } -> { textoCifrado }
app.post('/cifrar', (req, res) => {
  const { textoClaro, deslocamento } = req.body || {};
  if (!textoValido(textoClaro)) return erro(res, 'O campo "textoClaro" é obrigatório e deve ser uma string.');
  if (!deslocamentoValido(deslocamento)) return erro(res, 'O campo "deslocamento" é obrigatório e deve ser um número inteiro.');
  res.status(200).json({ textoCifrado: cifrar(textoClaro, deslocamento) });
});

// POST /decifrar  { textoCifrado, deslocamento } -> { textoClaro }
app.post('/decifrar', (req, res) => {
  const { textoCifrado, deslocamento } = req.body || {};
  if (!textoValido(textoCifrado)) return erro(res, 'O campo "textoCifrado" é obrigatório e deve ser uma string.');
  if (!deslocamentoValido(deslocamento)) return erro(res, 'O campo "deslocamento" é obrigatório e deve ser um número inteiro.');
  res.status(200).json({ textoClaro: decifrar(textoCifrado, deslocamento) });
});

// POST /decifrarForcaBruta  { textoCifrado } -> { textoClaro }
app.post('/decifrarForcaBruta', (req, res) => {
  const { textoCifrado } = req.body || {};
  if (!textoValido(textoCifrado)) return erro(res, 'O campo "textoCifrado" é obrigatório e deve ser uma string.');
  res.status(200).json({ textoClaro: quebrar(textoCifrado) });
});

// JSON malformado
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return erro(res, 'JSON inválido.');
  next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API da Cifra de César rodando em http://localhost:${PORT}`));
