// ==UserScript==
// @name         Bing Quick Search 40/50
// @namespace    https://github.com/MarcosMakosu
// @version      1.4
// @description  Buscas aleatórias no Bing com URL realista
// @author       MarcosMakosu
// @match        https://www.bing.com/*
// @grant        window.close
// @run-at       document-start
// ==/UserScript==

(() => {
    'use strict';

    const TOTAL_CICLOS = 50;
    const INTERVALO_FIXO = 400 * 1000; 

    const assuntos = [
        "resultado lotofácil de hoje",
        "clima amanhã em São Paulo",
        "preço do bitcoin agora",
        "notícias sobre o Corinthians",
        "Palmeiras jogo hoje",
        "preço da gasolina hoje",
        "dólar turismo hoje",
        "novelas da Globo",
        "BBB 2026",
        "Anitta últimas notícias",
        "Elon Musk Brasil",
        "Grok xAI",
        "ChatGPT novo modelo",
        "iPhone 17 lançamento",
        "Samsung Galaxy novo",
        "fórmula 1 classificação",
        "Libertadores 2026",
        "seleção brasileira convocação",
        "inflação brasil 2026",
        "salário mínimo novo valor",
        "trânsito em São Paulo agora",
        "previsão do tempo Rio de Janeiro",
        "filmes em cartaz",
        "série mais assistida Netflix",
        "Marvel novo filme",
        "Dragon Ball novo capítulo",
        "One Piece atual",
        "como investir em ações",
        "renda extra em casa",
        "dicas de emagrecimento rápido",
        "receita de bolo de chocolate",
        "dieta low carb cardápio",
        "exercícios para abdômen",
        "viagem barata para o Nordeste",
        "Disney Orlando preços 2026",
        "cruzeiro nacional barato",
        "carros mais vendidos 2026",
        "motos Honda nova",
        "eleições municipais 2028",
        "Bolsonaro últimas notícias",
        "Lula agenda hoje",
        "economia brasil 2026",
        "IA no mercado de trabalho"
    ];

    let ciclosRealizados = 0;

    function assuntoAleatorio() {
        return assuntos[Math.floor(Math.random() * assuntos.length)];
    }

    function gerarCvid() {
        const hex = () => Math.floor(Math.random() * 16).toString(16).toUpperCase();
        let cvid = '';
        for (let i = 0; i < 32; i++) cvid += hex();
        return cvid;
    }

    function gerarSC() {
        const num1 = Math.floor(Math.random() * 15) + 8;
        const num2 = Math.floor(Math.random() * 9) + 3;
        return `${num1}-${num2}`;
    }

    function fazerBusca() {
        if (ciclosRealizados >= TOTAL_CICLOS) {
            console.log("%c✅ Todos os 50 ciclos concluídos!", "color: lime; font-size: 16px;");
            setTimeout(() => window.close(), 2000);
            return;
        }

        const termo = assuntoAleatorio();
        const q = encodeURIComponent(termo);
        const pq = encodeURIComponent(termo);
        const sc = gerarSC();
        const cvid = gerarCvid();

        const url = `https://www.bing.com/search?q=${q}&qs=n&form=QBRE&sp=-1&ghc=1&lq=0&pq=${pq}&sc=${sc}&sk=&cvid=${cvid}`;

        console.log(`🔎 Ciclo ${ciclosRealizados + 1}/${TOTAL_CICLOS} → ${termo}`);

        window.location.href = url;
    }

    function iniciarCiclo() {
        ciclosRealizados++;
        fazerBusca();

        if (ciclosRealizados < TOTAL_CICLOS) {
            console.log(`⏳ Próxima busca em 40 segundos...`);
            setTimeout(iniciarCiclo, INTERVALO_FIXO);
        }
    }

    console.log("%c BQR iniciado (40s - 50 ciclos)", "color: cyan; font-weight: bold;");

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(iniciarCiclo, 3000));
    } else {
        setTimeout(iniciarCiclo, 3000);
    }
})();