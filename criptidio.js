// ==UserScript==
// @name         BingQuickSanchez
// @namespace    https://github.com/MarcosMakosu
// @version      1.5
// @description  Buscas aleatórias no Bing com termos dinâmicos (Wikipedia + Random Word)
// @author       MarcosMakosu
// @match        https://www.bing.com/*
// @grant        window.close
// @run-at       document-start
// ==/UserScript==

(() => {
    'use strict';

    const TOTAL_CICLOS = 50;
    const INTERVALO_FIXO = 400 * 1000; // 40 segundos

    let ciclosRealizados = 0;

    // Lista de fallback (caso as APIs falhem)
    const assuntosFallback = [
        "resultado lotofácil de hoje",
        "clima amanhã em São Paulo",
        "preço do bitcoin agora",
        "notícias sobre o Corinthians",
        "Palmeiras jogo hoje",
        "preço da gasolina hoje",
        "dólar turismo hoje",
        "BBB 2026",
        "Elon Musk Brasil",
        "Grok xAI",
        "iPhone 17 lançamento",
        "fórmula 1 classificação",
        "seleção brasileira convocação",
        "salário mínimo novo valor",
        "trânsito em São Paulo agora",
        "filmes em cartaz",
        "Marvel novo filme",
        "como investir em ações",
        "dicas de emagrecimento rápido",
        "viagem barata para o Nordeste"
    ];

    async function assuntoAleatorio() {
        // 70% de chance de usar API
        if (Math.random() < 0.70) {
            try {
                // 50% Wikipedia | 50% Random Word
                if (Math.random() < 0.5) {
                    // Wikipedia PT-BR (mais natural)
                    const res = await fetch('https://pt.wikipedia.org/api/rest_v1/page/random/summary');
                    const page = await res.json();
                    let titulo = page.title.split(' (')[0]; // Remove informações entre parênteses
                    return titulo;
                } else {
                    // Random Word API (2 palavras)
                    const res = await fetch('https://random-word-api.herokuapp.com/word?lang=pt-br&number=2');
                    const words = await res.json();
                    return words.join(" ");
                }
            } catch (e) {
                console.warn("⚠️ API falhou, usando fallback", e);
            }
        }

        // Fallback
        return assuntosFallback[Math.floor(Math.random() * assuntosFallback.length)];
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

    async function fazerBusca() {
        if (ciclosRealizados >= TOTAL_CICLOS) {
            console.log("%c✅ Todos os 50 ciclos concluídos!", "color: lime; font-size: 16px;");
            setTimeout(() => window.close(), 2000);
            return;
        }

        const termo = await assuntoAleatorio();
        const q = encodeURIComponent(termo);
        const pq = encodeURIComponent(termo);
        const sc = gerarSC();
        const cvid = gerarCvid();

        const url = `https://www.bing.com/search?q=${q}&qs=n&form=QBRE&sp=-1&ghc=1&lq=0&pq=${pq}&sc=${sc}&sk=&cvid=${cvid}`;

        console.log(` Ciclo ${ciclosRealizados + 1}/${TOTAL_CICLOS} → ${termo}`);

        window.location.href = url;
    }

    async function iniciarCiclo() {
        ciclosRealizados++;
        await fazerBusca();

        if (ciclosRealizados < TOTAL_CICLOS) {
            console.log(` Próxima busca em 40 segundos...`);
            setTimeout(iniciarCiclo, INTERVALO_FIXO);
        }
    }

    console.log("%c🚀 BQR iniciado (40s - 50 ciclos) | Modo Dinâmico", "color: cyan; font-weight: bold;");

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(iniciarCiclo, 3000));
    } else {
        setTimeout(iniciarCiclo, 3000);
    }
})();