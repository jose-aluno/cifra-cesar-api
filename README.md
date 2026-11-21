## Integrantes

- José Henrique Falsarella Lima Oliveira
- Ronaldo Silva Ramos Junior

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm

## Como executar

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar a API
npm start
```

A API ficará disponível em `http://localhost:3000`.

## Idioma

O único idioma aceito é o **português**. Os endpoints `/cifrar` e `/decifrar` funcionam com qualquer texto, mas o `/decifrarForcaBruta` considera que a mensagem original está em português: o dicionário e a frequência de letras usados para escolher o resultado são da língua portuguesa. Mensagens em outros idiomas não são suportadas e podem retornar um resultado incorreto.

## Endpoints

### POST `/cifrar`

Request:
```json
{ "textoClaro": "Ataque ao amanhecer", "deslocamento": 3 }
```
Response `200`:
```json
{ "textoCifrado": "Dwdtxh dr dpdqkhfhu" }
```

### POST `/decifrar`

Request:
```json
{ "textoCifrado": "Dwdtxh dr dpdqkhfhu", "deslocamento": 3 }
```
Response `200`:
```json
{ "textoClaro": "Ataque ao amanhecer" }
```

### POST `/decifrarForcaBruta`

Descobre o texto claro sem precisar do deslocamento. A API testa os 25 deslocamentos possíveis e escolhe o que tem mais palavras reconhecidas no dicionário de português (`dicionario.txt`). Em caso de empate, ou se nenhuma possibilidade tiver palavra reconhecida, usa a frequência das letras do português como desempate. A API sempre retorna um `textoClaro`, sem erro.

Request:
```json
{ "textoCifrado": "Dwdtxh dr dpdqkhfhu" }
```
Response `200`:
```json
{ "textoClaro": "Ataque ao amanhecer" }
```

> Palavras fora do dicionário (nomes próprios, siglas), números, acentos e pontuação não geram erro: aparecem no `textoClaro` como estão. Textos muito curtos podem resultar em uma escolha errada.

### Erros

Campos ausentes ou inválidos retornam `400`:
```json
{ "erro": "O campo \"textoClaro\" é obrigatório e deve ser uma string." }
```

## Observações

- Apenas letras de `A-Z` e `a-z` são deslocadas; espaços, números, pontuação e letras acentuadas permanecem iguais.
- O deslocamento aceita qualquer inteiro (inclusive negativo ou maior que 25); ele é normalizado módulo 26.
- O arquivo `dicionario.txt` (cerca de 268 mil palavras do português, em minúsculas) foi gerado a partir da lista [pythonprobr/palavras](https://github.com/pythonprobr/palavras).
