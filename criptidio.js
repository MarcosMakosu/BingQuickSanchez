// ==UserScript==
// @name         BingQuickSanchez
// @namespace    https://github.com/MarcosMakosu/BingQuickSanchez
// @version      2.2.0
// @description  Automação melhorada: fallback dinâmico de 30 palavras, API Dicionário Aberto + Wikipedia, sem erros de CORS
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

    // Lista estática definitiva (último recurso)
    const FALLBACK_ESTATICO = [
        "últimas notícias espaciais", "melhores destinos de viagem 2025", "como aprender python rápido",
        "receitas saudáveis para jantar", "história do império romano", "tendências de moda outono inverno",
        "melhores exercícios para costas", "curiosidades sobre o fundo do mar", "lançamentos netflix este mês",
        "como meditar para iniciantes", "evolução dos smartphones", "pontos turísticos em Portugal",
        "melhores jogos indie 2024", "benefícios do café para a saúde", "como organizar a casa",
        "biografia de Nikola Tesla", "dicas de fotografia com celular", "origem da língua portuguesa",
        "clima em Gramado hoje", "preço do grama do ouro", "inteligência artificial no cotidiano",
        "receitas de bolo de chocolate", "filmes de terror 2024", "como cuidar de plantas",
        "carreiras em tecnologia", "música clássica para relaxar", "lugares para visitar no Brasil",
        "dicas de produtividade", "história da aviação", "o que é blockchain"
    ];

    // Fallback dinâmico (populado antes do primeiro ciclo)
    let assuntosFallback = [...FALLBACK_ESTATICO];

    // --- PERSISTÊNCIA ---
    let ciclosRealizados = parseInt(localStorage.getItem('bing_ciclos')) || 0;

    /**
     * Função de espera com contagem regressiva no console
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

    /**
     * Tenta obter um termo usando a cadeia: Wikipedia → Dicionário Aberto.
     * Retorna o termo (string) ou null se todas falharem.
     */
    async function capturarTermoBruto() {
        // 1) Wikipedia (sumário aleatório)
        try {
            const res = await fetch('https://pt.wikipedia.org/api/rest_v1/page/random/summary');
            if (res.ok) {
                const page = await res.json();
                const term = page.title.split(' (')[0].trim();
                if (term) {
                    console.log(`%c🌐 [API] Wikipedia: "${term}"`, "color: #3498db;");
                    return term;
                }
            }
        } catch (e) {
            console.warn("%c⚠️ Wikipedia indisponível:", "color: #e67e22;", e.message);
        }

        // 2) Dicionário Aberto (palavra aleatória em português)
        try {
            const res = await fetch('https://api.dicionario-aberto.net/random');
            if (res.ok) {
                const data = await res.json();
                const term = (data.word || '').trim();
                if (term) {
                    console.log(`%c📖 [API] Dicionário Aberto: "${term}"`, "color: #3498db;");
                    return term;
                }
            }
        } catch (e) {
            console.warn("%c⚠️ Dicionário Aberto indisponível:", "color: #e67e22;", e.message);
        }

        return null;
    }

    /**
     * Gera dinamicamente uma lista de 30 palavras chamando as APIs.
     * Completa com a lista estática se não atingir 30.
     */
    async function gerarListaFallback() {
        const palavrasSet = new Set();
        const maxTentativas = 60;
        let tentativas = 0;

        console.log("%c🛠️ [FALLBACK] Gerando lista de 30 palavras (Wikipedia + Dicionário Aberto)...", "background: #8e44ad; color: white;");

        while (palavrasSet.size < 30 && tentativas < maxTentativas) {
            tentativas++;
            const term = await capturarTermoBruto();
            if (term && term.length > 1) {
                palavrasSet.add(term);
                console.log(`%c📥 [FALLBACK] Adicionada (${palavrasSet.size}/30): "${term}"`, "color: #2ecc71;");
            }
            if (palavrasSet.size < 30) {
                await new Promise(r => setTimeout(r, 600)); // pausa para não sobrecarregar
            }
        }

        if (palavrasSet.size < 30) {
            console.warn("%c⚠️ [FALLBACK] Não foi possível gerar 30 palavras. Completando com lista estática.", "color: #f1c40f;");
            for (const w of FALLBACK_ESTATICO) {
                palavrasSet.add(w);
                if (palavrasSet.size >= 30) break;
            }
        }

        return Array.from(palavrasSet).slice(0, 30);
    }

    /**
     * Inicializa a lista de fallback (cache em localStorage ou gera nova)
     */
    async function inicializarFallback() {
        const CACHE_KEY = 'bing_fallback_words';
        try {
            const stored = localStorage.getItem(CACHE_KEY);
            if (stored) {
                const arr = JSON.parse(stored);
                if (Array.isArray(arr) && arr.length >= 30) {
                    assuntosFallback = arr;
                    console.log("%c💾 [FALLBACK] Lista carregada do cache.", "color: #2ecc71;");
                    return;
                }
            }
        } catch (e) {}

        const novaLista = await gerarListaFallback();
        if (novaLista.length === 30) {
            assuntosFallback = novaLista;
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(novaLista));
            } catch (e) {}
            console.log("%c✅ [FALLBACK] Lista de 30 palavras gerada e armazenada.", "color: #2ecc71;");
        } else {
            assuntosFallback = [...FALLBACK_ESTATICO];
            console.warn("%c⚠️ [FALLBACK] Erro na geração. Usando lista estática.", "color: #f1c40f;");
        }
    }

    /**
     * Obtém um termo para busca: tenta APIs, senão usa o fallback.
     */
    async function obterTermoAleatorio() {
        console.log("%c🔍 Obtendo termo...", "color: #f39c12; font-weight: bold;");
        let termoFinal = await capturarTermoBruto();

        if (termoFinal) {
            console.log(`%c✅ Termo selecionado: "${termoFinal}"`, "color: #2ecc71; font-weight: bold;");
        } else {
            termoFinal = assuntosFallback[Math.floor(Math.random() * assuntosFallback.length)];
            console.log(`%c📦 FALLBACK: "${termoFinal}"`, "color: #9b59b6; font-weight: bold;");
        }

        await aguardar(TEMPO_VISUALIZACAO, "VISUALIZAÇÃO");
        return termoFinal;
    }

    function gerarCvid() {
        return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
    }

    async function executarCiclo() {
        if (ciclosRealizados >= TOTAL_CICLOS) {
            console.log("%c🎉 Meta atingida! Fechando...", "background: #27ae60; color: white; padding: 10px;");
            localStorage.removeItem('bing_ciclos');
            await aguardar(5000, "FECHAMENTO");
            window.close();
            return;
        }

        const termo = await obterTermoAleatorio();
        const cvid = gerarCvid();

        ciclosRealizados++;
        localStorage.setItem('bing_ciclos', ciclosRealizados);

        const url = `https://www.bing.com/search?q=${encodeURIComponent(termo)}&cvid=${cvid}&FORM=QBRE`;
        const delaySeguranca = Math.floor(Math.random() * 2000 + 1500);

        console.log(`%c🚀 Ciclo ${ciclosRealizados} → ${url}`, "color: #2ecc71;");
        await aguardar(delaySeguranca, "REDIRECIONAMENTO");
        window.location.href = url;
    }

    async function agendarProxima() {
        const espera = Math.floor(Math.random() * (INTERVALO_MAX - INTERVALO_MIN + 1)) + INTERVALO_MIN;
        await aguardar(espera, "PRÓXIMA BUSCA");
        executarCiclo();
    }

    // --- INICIALIZAÇÃO ---
    console.log("%c[SISTEMA] BingQuickSanchez v2.2.0", "background: #34495e; color: #ecf0f1; padding: 5px;");

    (async () => {
        await inicializarFallback();

        if (window.location.search.includes("q=")) {
            agendarProxima();
        } else {
            await aguardar(3000, "INÍCIO");
            executarCiclo();
        }
    })();
})();
