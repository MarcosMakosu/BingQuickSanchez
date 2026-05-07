// ==UserScript==
// @name         BingQuickSanchez 
// @namespace    https://github.com/MarcosMakosu/BingQuickSanchez
// @version      1.9.2
// @description  Automação com rastreamento detalhado e persistência de dados
// @author       MarcosMakosu
// @match        https://www.bing.com/*
// @grant        window.close
// @run-at       document-idle
// ==/UserScript==

(() => {
    'use strict';

    // --- CONFIGURAÇÕES ---
    const TOTAL_CICLOS = 30;
    const INTERVALO_MIN = 60000; 
    const INTERVALO_MAX = 95000;
    
    // --- PERSISTÊNCIA ---
    let ciclosRealizados = parseInt(localStorage.getItem('bing_ciclos')) || 0;

    // Mantida conforme solicitado
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
        "receita de bolo de chocolate",
        "previsão do tempo Rio de Janeiro"
    ];

    async function obterTermoAleatorio() {
        console.log("%c🔍 [DECISÃO] Escolhendo fonte do termo...", "color: #f39c12; font-weight: bold;");
        
        const sorteio = Math.random();
        
        try {
            if (sorteio < 0.35) {
                console.log("%c🌐 [API] Solicitando resumo à Wikipedia...", "color: #3498db;");
                const res = await fetch('https://pt.wikipedia.org/api/rest_v1/page/random/summary');
                if (!res.ok) throw new Error("Status " + res.status);
                const page = await res.json();
                const titulo = page.title.split(' (')[0];
                console.log(`%c✅ [WIKI] Termo obtido: "${titulo}"`, "color: #2ecc71;");
                return titulo;
            } 
            else if (sorteio < 0.70) {
                console.log("%c🌐 [API] Solicitando palavras aleatórias...", "color: #3498db;");
                const res = await fetch('https://random-word-api.herokuapp.com/word?lang=pt-br&number=2');
                if (!res.ok) throw new Error("Status " + res.status);
                const words = await res.json();
                const termo = words.join(" ");
                console.log(`%c✅ [RANDOM] Termo obtido: "${termo}"`, "color: #2ecc71;");
                return termo;
            }
        } catch (error) {
            console.error(`%c❌ [ERRO API] ${error.message}. Recorrendo ao Fallback.`, "color: #e74c3c;");
        }

        // Caso as APIs falhem ou o sorteio caia aqui
        const termoF = assuntosFallback[Math.floor(Math.random() * assuntosFallback.length)];
        console.log(`%c📦 [FALLBACK] Usando lista interna: "${termoF}"`, "color: #9b59b6;");
        return termoF;
    }

    function gerarCvid() {
        const cvid = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
        console.log(`%c🆔 [SESSION] CVID Gerado: ${cvid}`, "color: #7f8c8d; font-size: 10px;");
        return cvid;
    }

    async function executarCiclo() {
        if (ciclosRealizados >= TOTAL_CICLOS) {
            console.log("%c🎉 [FINALIZADO] Todas as 30 buscas foram concluídas!", "background: #27ae60; color: white; padding: 10px; border-radius: 5px;");
            localStorage.removeItem('bing_ciclos');
            console.log("%c🗑️ [STORAGE] Contador resetado para amanhã.", "color: #7f8c8d;");
            setTimeout(() => window.close(), 5000);
            return;
        }

        const termo = await obterTermoAleatorio();
        const cvid = gerarCvid();
        
        ciclosRealizados++;
        localStorage.setItem('bing_ciclos', ciclosRealizados);
        console.log(`%c💾 [STORAGE] Progresso salvo: ${ciclosRealizados}/${TOTAL_CICLOS}`, "color: #d35400;");

        const url = `https://www.bing.com/search?q=${encodeURIComponent(termo)}&cvid=${cvid}&FORM=QBRE`;
        
        const delaySeguranca = Math.floor(Math.random() * 2000 + 1500);
        console.log(`%c🚀 [NAVEGAÇÃO] Preparando redirecionamento em ${(delaySeguranca/1000).toFixed(1)}s...`, "color: #2ecc71; font-weight: bold;");
        
        setTimeout(() => {
            console.log("%c✈️ [PULO] Indo para a busca agora!", "color: #2ecc71;");
            window.location.href = url;
        }, delaySeguranca);
    }

    function agendarProxima() {
        const espera = Math.floor(Math.random() * (INTERVALO_MAX - INTERVALO_MIN + 1)) + INTERVALO_MIN;
        console.log("%c------------------------------------------------", "color: #bdc3c7;");
        console.log(`%c⏱️ [TIMER] Próxima busca em ${(espera / 1000).toFixed(0)} segundos...`, "color: #34495e; font-style: italic;");
        console.log("%c------------------------------------------------", "color: #bdc3c7;");
        setTimeout(executarCiclo, espera);
    }

    // --- INICIALIZAÇÃO ---
    console.log("%c[SISTEMA] BingQuickSanchez v1.9.2 Carregado", "background: #34495e; color: #ecf0f1; padding: 5px;");

    // Verifica se é uma página de busca (após o redirecionamento) ou a inicial
    if (window.location.search.includes("q=")) {
        console.log("%c📍 [ESTADO] Página de resultados detectada.", "color: #16a085;");
        agendarProxima();
    } else {
        console.log("%c🏠 [ESTADO] Fora de busca. Iniciando rotina...", "color: #16a085;");
        // Aguarda o Bing carregar seus elementos básicos antes de agir
        setTimeout(executarCiclo, 3000);
    }
})();