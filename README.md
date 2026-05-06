# BingQuickSanchez
Script para realizar buscas automáticas no Bing com termos dinâmicos.

## Descrição

Este UserScript realiza buscas aleatórias no Bing de forma automatizada, simulando comportamento humano. A cada ciclo, ele gera um termo de pesquisa diferente utilizando fontes dinâmicas (Wikipedia em português e Random Word API), caindo para uma lista de fallback quando necessário.

Ideal para acumular pontos ou rewards em programas de busca do Bing.

## Funcionalidades

- Realiza 50 buscas por execução
- Intervalo de 40 segundos entre buscas
- Geração dinâmica de termos de pesquisa
- Duas fontes principais de termos:
  - Wikipedia PT-BR (páginas aleatórias)
  - Random Word API (palavras em português)
- Sistema de fallback com termos fixos
- Geração realista de parâmetros de URL (cvid, sc, etc.)
- Fechamento automático da aba ao finalizar

## Instalação

1. Instale a extensão **Tampermonkey** (ou Violentmonkey) no seu navegador
2. Clique no ícone do Tampermonkey → "Criar novo script"
3. Apague todo o conteúdo e cole o código completo do script
4. Salve (Ctrl + S)
5. Acesse qualquer página do Bing (`https://www.bing.com/*`)

O script iniciará automaticamente após 3 segundos.

## Configuração

Você pode ajustar as seguintes constantes no início do script:

```javascript
const TOTAL_CICLOS = 50;        // Quantidade de buscas
const INTERVALO_FIXO = 400 * 1000;  // 40 segundos (em milissegundos)