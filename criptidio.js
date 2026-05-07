// ==UserScript==
// @name         BingQuickSanchez 
// @namespace    https://github.com/MarcosMakosu/BingQuickSanchez
// @version      2.0.0
// @description  Automação com nova lista fallback e pausa de 10s para visualização
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
    const TEMPO_VISUALIZACAO = 10000; 
    
    // --- PERSISTÊNCIA ---
    let ciclosRealizados = parseInt(localStorage.getItem('bing_ciclos')) || 0;

    // --- NOVA LISTA DE ASSUNTOS (Fallback) ---
    const assuntosFallback = [
        "últimas notícias espaciais", "melhores destinos de viagem 2025", "como aprender python rápido",
        "receitas saudáveis para jantar", "história do império romano", "tendências de moda outono inverno",
        "melhores exercícios para costas", "curiosidades sobre o fundo do mar", "lançamentos netflix este mês",
        "como meditar para iniciantes", "evolução dos smartphones", "pontos turísticos em Portugal",
        "melhores jogos indie 2024", "benefícios do café para a saúde", "como organizar a casa",
        "biografia de Nikola Tesla", "dicas de fotografia com celular", "origem da língua portuguesa",
        "clima em Gramado hoje", "preço do grama do ouro"
    ];

    /**
     * Função que aguarda um tempo determinado e mostra a contagem regressiva.
     * Retorna uma Promise para ser usada com 'await'.
     */
    function aguardar(ms, rotulo) {
        return new Promise(resolve => {
            let segundosRestantes = Math.floor(ms / 1000);
            
            const cronometro = setInterval(() => {
                if (segundosRestantes % 5 === 0 || segundosRestantes <= 5) {
                    if (segundosRestantes > 0) {
                        console.log(`%c⏳ [${rotulo}] Faltam ${segundosRestantes} segundos...`, "color: #f39c12;");
                    }
                }
                segundosRestantes--;

                if (segundosRestantes < 0) {
                    clearInterval(cronometro);
                    resolve();
                }
            }, 1000);
        });
    }

    async function obterTermoAleatorio() {
        console.log("%c🔍 [DECISÃO] Solicitando termo às APIs...", "color: #f39c12; font-weight: bold;");
        
        const sorteio = Math.random();
        let termoFinal = "";
        
        try {
            if (sorteio < 0.35) {
                const res = await fetch('https://pt.wikipedia.org/api/rest_v1/page/random/summary');
                if (!res.ok) throw new Error("Erro Wikipedia");
                const page = await res.json();
                termoFinal = page.title.split(' (')[0];
                console.log(`%c✅ [WIKI] Termo recebido: "${termoFinal}"`, "color: #2ecc71; font-weight: bold; font-size: 14px;");
            } 
            else if (sorteio < 0.70) {
                const res = await fetch('https://random-word-api.herokuapp.com/word?lang=pt-br&number=2');
                if (!res.ok) throw new Error("Erro Random Word");
                const words = await res.json();
                termoFinal = words.join(" ");
                console.log(`%c✅ [RANDOM] Termo recebido: "${termoFinal}"`, "color: #2ecc71; font-weight: bold; font-size: 14px;");
            }
        } catch (error) {
            console.error(`%c❌ [ERRO API] ${error.message}.`, "color: #e74c3c;");
        }

        if (!termoFinal) {
            termoFinal = assuntosFallback[Math.floor(Math.random() * assuntosFallback.length)];
            console.log(`%c📦 [FALLBACK] Usando: "${termoFinal}"`, "color: #9b59b6; font-weight: bold; font-size: 14px;");
        }

        // --- PAUSA DE 10 SEGUNDOS PARA VISUALIZAÇÃO ---
        await aguardar(TEMPO_VISUALIZACAO, "VISUALIZAÇÃO DO TERMO");
        
        return termoFinal;
    }

    function gerarCvid() {
        return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
    }

    async function executarCiclo() {
        if (ciclosRealizados >= TOTAL_CICLOS) {
            console.log("%c🎉 [FINALIZADO] Meta atingida!", "background: #27ae60; color: white; padding: 10px;");
            localStorage.removeItem('bing_ciclos');
            await aguardar(5000, "FECHAMENTO");
            window.close();
            return;
        }

        const termo = await obterTermoAleatorio(); // A pausa de 10s acontece aqui dentro agora
        const cvid = gerarCvid();
        
        ciclosRealizados++;
        localStorage.setItem('bing_ciclos', ciclosRealizados);
        
        const url = `https://www.bing.com/search?q=${encodeURIComponent(termo)}&cvid=${cvid}&FORM=QBRE`;
        const delaySeguranca = Math.floor(Math.random() * 2000 + 1500);

        console.log(`%c🚀 [NAVEGAÇÃO] Preparando redirecionamento para o Ciclo ${ciclosRealizados}...`, "color: #2ecc71;");
        
        await aguardar(delaySeguranca, "REDIRECIONAMENTO");
        window.location.href = url;
    }

    async function agendarProxima() {
        const espera = Math.floor(Math.random() * (INTERVALO_MAX - INTERVALO_MIN + 1)) + INTERVALO_MIN;
        await aguardar(espera, "PRÓXIMA BUSCA");
        executarCiclo();
    }

    // --- INICIALIZAÇÃO ---
    console.log("%c[SISTEMA] BingQuickSanchez v2.1.0 Carregado", "background: #34495e; color: #ecf0f1; padding: 5px;");

    if (window.location.search.includes("q=")) {
        agendarProxima();
    } else {
        // Início inicial
        (async () => {
            await aguardar(3000, "INÍCIO");
            executarCiclo();
        })();
    }
})();