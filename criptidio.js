// ==UserScript==
// @name         BingQuickSanchez 
// @namespace    https://github.com/MarcosMakosu/BingQuickSanchez
// @version      1.6
// @description  Buscas automáticas no Bing para Microsoft Rewards PC
// @author       MarcosMakosu
// @match        https://www.bing.com/*
// @grant        window.close
// @run-at       document-start
// ==/UserScript==

(() => {
    'use strict';

    const TOTAL_CICLOS = 30;                    // Quantidade de buscas
    const INTERVALO_MIN = 65 * 1000;            // 65 segundos
    const INTERVALO_MAX = 95 * 1000;            // 95 segundos

    let ciclosRealizados = 0;

    // Lista de fallback caso as APIs falhem
    const assuntosFallback = [
        "resultado lotofácil de hoje",
        "clima amanhã em São Paulo",
        "preço do bitcoin agora",
        "notícias sobre o Corinthians",
        "preço da gasolina hoje",
        "dólar turismo hoje",
        "BBB 2026",
        "Elon Musk Brasil",
        "iPhone 17 lançamento",
        "fórmula 1 classificação",
        "seleção brasileira convocação",
        "salário mínimo novo valor",
        "trânsito em São Paulo agora",
        "filmes em cartaz",
        "Marvel novo filme",
        "como investir em ações",
        "viagem barata para o Nordeste",
        "Grok xAI",
        "previsão do tempo Rio de Janeiro"
    ];

    async function assuntoAleatorio() {
        if (Math.random() < 0.70) {
            try {
                if (Math.random() < 0.5) {
                    // Wikipedia PT-BR
                    const res = await fetch('https://pt.wikipedia.org/api/rest_v1/page/random/summary');
                    const page = await res.json();
                    let titulo = page.title.split(' (')[0];
                    return titulo;
                } else {
                    // Random Word API
                    const res = await fetch('https://random-word-api.herokuapp.com/word?lang=pt-br&number=2');
                    const words = await res.json();
                    return words.join(" ");
                }
            } catch (e) {
                console.warn("⚠️ API falhou, usando fallback");
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

    function getIntervaloAleatorio() {
        return Math.floor(Math.random() * (INTERVALO_MAX - INTERVALO_MIN + 1)) + INTERVALO_MIN;
    }

    async function fazerBusca() {
        if (ciclosRealizados >= TOTAL_CICLOS) {
            console.log("%c✅ Todos os 30 ciclos concluídos!", "color: lime; font-size: 16px;");
            setTimeout(() => window.close(), 3000);
            return;
        }

        const termo = await assuntoAleatorio();
        const q = encodeURIComponent(termo);
        const pq = encodeURIComponent(termo);
        const sc = gerarSC();
        const cvid = gerarCvid();

        const url = `https://www.bing.com/search?q=${q}&qs=n&form=QBRE&sp=-1&ghc=1&lq=0&pq=${pq}&sc=${sc}&sk=&cvid=${cvid}`;

        console.log(`🔎 Ciclo ${ciclosRealizados + 1}/${TOTAL_CICLOS} → ${termo}`);

        window.location.href = url;
    }

    async function iniciarCiclo() {
        ciclosRealizados++;
        await fazerBusca();

        if (ciclosRealizados < TOTAL_CICLOS) {
            const proximaEm = getIntervaloAleatorio();
            const segundos = Math.floor(proximaEm / 1000);
            
            console.log(`⏳ Próxima busca em ${segundos} segundos...`);
            setTimeout(iniciarCiclo, proximaEm);
        }
    }

    console.log("%c🚀 BingQuickSanchez iniciado - Modo Seguro (30 buscas)", "color: cyan; font-weight: bold;");
    console.log("%cIntervalo aleatório: 65 a 95 segundos", "color: gray;");

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(iniciarCiclo, 4000));
    } else {
        setTimeout(iniciarCiclo, 4000);
    }
})();