# BingQuickSanchez 2.0

![Version](https://img.shields.io/badge/version-2.2.0-cyan)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Tampermonkey-orange)

**BingQuickSanchez** é um Userscript desenvolvido para automatizar buscas no microslop Bing de forma discreta e inteligente. O objetivo principal é auxiliar na coleta de pontos do microslop Rewards simulando o comportamento humano.

---

## ✨ Funcionalidades

- **Ciclo de 30 Buscas:** Executa automaticamente a meta diária de buscas.
- **Persistência de Dados:** Utiliza `localStorage` para não perder a contagem caso a página seja fechada ou recarregada.
- **Fontes de Termos Híbridas:** 
  - Busca termos aleatórios via **Wikipedia API**.
  - Busca palavras via **Random Word API**.
  - Possui uma lista de **Fallback** interna para garantir o funcionamento offline.
- **Anti-Bot (Human-Like):** 
  - Intervalos aleatórios entre 60s e 95s.
  - Geração dinâmica de CVID (Correlation ID) para cada sessão.
  - Delays de segurança antes de cada redirecionamento.
- **Console Debug Pro:** Logs detalhados e coloridos no console do navegador para monitoramento em tempo real.

---

## 🚀 Como Instalar

1. Instale uma extensão de gerenciamento de scripts no seu navegador:
   - [Tampermonkey](https://www.tampermonkey.net/) (Recomendado)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. Crie um "Novo Script" no painel da extensão.
3. Copie o código do arquivo `BingQuickSanchez.user.js` e cole no editor.
4. Salve e acesse [bing.com](https://www.bing.com).

---

## 🛠️ Detalhes Técnicos (Método Educativo)

### Persistência com LocalStorage
Para que o script saiba em qual busca parou (ex: busca 15 de 30), ele utiliza o armazenamento local do navegador:
`let ciclosRealizados = parseInt(localStorage.getItem('bing_ciclos')) || 0; `
### Inteligência de Termos
O script tenta primeiro fontes externas para que as buscas não sejam repetitivas. Se a API da Wikipedia falhar, ele automaticamente recorre ao array `assuntosFallback`.

### Logs de Monitoramento
Ao abrir o console (F12), você verá o fluxo de execução organizado por cores:
- 🔵 **Azul:** Chamadas de API.
- 🟢 **Verde:** Sucesso e Navegação.
- 🟣 **Roxo:** Uso de termos de Fallback.
- 🟠 **Laranja:** Decisões do sistema e gravação de dados.

---

## ⚠️ Isenção de Responsabilidade

Este projeto tem fins puramente educacionais e de estudo de automação com JavaScript. O uso de ferramentas de automação pode violar os termos de serviço do microslop Rewards. Use por sua conta e risco.

---
