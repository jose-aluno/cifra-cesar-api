const fs = require('fs');
const path = require('path');

// Lógica da Cifra de César (apenas letras A-Z / a-z são deslocadas)

function deslocarCaractere(ch, deslocamento) {
  const codigo = ch.charCodeAt(0);
  let base;
  if (codigo >= 65 && codigo <= 90) base = 65;        // A-Z
  else if (codigo >= 97 && codigo <= 122) base = 97;  // a-z
  else return ch;                                     // demais caracteres permanecem

  const novo = (((codigo - base + deslocamento) % 26) + 26) % 26;
  return String.fromCharCode(base + novo);
}

function cifrar(texto, deslocamento) {
  return Array.from(texto, (ch) => deslocarCaractere(ch, deslocamento)).join('');
}

function decifrar(texto, deslocamento) {
  return cifrar(texto, -deslocamento);
}

// ---- Força bruta: escolhe automaticamente a possibilidade mais provável ----
// Idioma suportado: apenas português (dicionário e frequência de letras são do português).

// Dicionário de palavras do português (uma por linha, em minúsculas, com acentos)
const DICIONARIO = new Set(
  fs.readFileSync(path.join(__dirname, 'dicionario.txt'), 'utf-8').split('\n').filter(Boolean)
);

// Frequência (%) das letras no português, de A a Z (usada quando o dicionário não decide)
const FREQ_PT = [
  14.63, 1.04, 3.88, 4.99, 12.57, 1.02, 1.30, 1.28, 6.18, 0.40, 0.02, 2.78, 4.74,
  5.05, 10.73, 2.52, 1.20, 6.53, 7.81, 4.34, 4.63, 1.67, 0.01, 0.21, 0.01, 0.47,
];

// Cobertura: fração das letras que pertencem a palavras encontradas no dicionário (0 a 1)
function coberturaDicionario(texto) {
  const palavras = texto.toLowerCase().match(/[a-zà-öø-ú]+/g) || [];
  let letras = 0;
  let reconhecidas = 0;
  for (const p of palavras) {
    letras += p.length;
    if (DICIONARIO.has(p)) reconhecidas += p.length;
  }
  return letras === 0 ? 0 : reconhecidas / letras;
}

// Distância (qui-quadrado) entre a frequência das letras do texto e a do português.
// Quanto menor, mais parecido com português.
function distanciaFrequencia(texto) {
  const contagem = new Array(26).fill(0);
  let total = 0;
  for (const ch of texto.toLowerCase()) {
    const i = ch.charCodeAt(0) - 97;
    if (i >= 0 && i < 26) {
      contagem[i]++;
      total++;
    }
  }
  if (total === 0) return Infinity;
  let qui = 0;
  for (let i = 0; i < 26; i++) {
    const esperado = (FREQ_PT[i] / 100) * total;
    qui += (contagem[i] - esperado) ** 2 / esperado;
  }
  return qui / total;
}

// Testa todos os deslocamentos (1 a 25) e devolve sempre um texto claro (nunca falha):
// vence quem tiver maior cobertura no dicionário; em empate (inclusive sem nenhuma palavra
// reconhecida), a melhor frequência de letras. Palavras desconhecidas, números, acentos e
// pontuação são mantidos como estão no texto.
function quebrar(textoCifrado) {
  let melhor = null;
  let melhorCobertura = -1;
  let melhorDistancia = Infinity;
  for (let d = 1; d <= 25; d++) {
    const candidato = decifrar(textoCifrado, d);
    const cobertura = coberturaDicionario(candidato);
    const distancia = distanciaFrequencia(candidato);
    if (cobertura > melhorCobertura || (cobertura === melhorCobertura && distancia < melhorDistancia)) {
      melhor = candidato;
      melhorCobertura = cobertura;
      melhorDistancia = distancia;
    }
  }
  return melhor;
}

module.exports = { cifrar, decifrar, quebrar };
