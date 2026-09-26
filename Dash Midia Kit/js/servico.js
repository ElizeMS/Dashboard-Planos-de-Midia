const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

let sellers = [];

let servicesRevenueChart = null;
let servicesComparisonChart = null;


// =========================================================
// CARREGAR DADOS
// =========================================================

async function carregarServicos() {

    try {

        const response = await fetch("./data/sellers.json");

        if (!response.ok) {
            throw new Error("Não foi possível carregar sellers.json");
        }

        sellers = await response.json();

        preencherFiltroAno();
        preencherFiltroServico();

        atualizarServicos();

    } catch (error) {

        console.error("Erro ao carregar os dados:", error);

    }

}


// =========================================================
// FORMATAR MOEDA
// =========================================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// =========================================================
// PEGAR ANOS DISPONÍVEIS
// =========================================================

function getAnosDisponiveis() {

    const anos = new Set();

    sellers.forEach(seller => {

        seller.investimentos.forEach(investimento => {

            if (
                investimento.servico !== null &&
                investimento.servico !== undefined &&
                investimento.servico !== ""
            ) {

                anos.add(Number(investimento.ano));

            }

        });

    });

    return [...anos].sort((a, b) => a - b);

}


// =========================================================
// PREENCHER FILTRO DE ANO
// =========================================================

function preencherFiltroAno() {

    const filtroAno = document.getElementById("serviceYear");

    filtroAno.innerHTML = "";

    const anos = getAnosDisponiveis();

    anos.forEach(ano => {

        const option = document.createElement("option");

        option.value = ano;
        option.textContent = ano;

        filtroAno.appendChild(option);

    });

    const anoAtual = new Date().getFullYear();

    if (anos.includes(anoAtual)) {

        filtroAno.value = anoAtual;

    } else if (anos.length > 0) {

        filtroAno.value = anos[anos.length - 1];

    }

}


// =========================================================
// PEGAR SERVIÇOS DISPONÍVEIS
// =========================================================

function getServicosDisponiveis() {

    const servicos = new Set();

    sellers.forEach(seller => {

        seller.investimentos.forEach(investimento => {

            if (
                investimento.servico !== null &&
                investimento.servico !== undefined &&
                investimento.servico !== ""
            ) {

                servicos.add(investimento.servico);

            }

        });

    });

    return [...servicos].sort();

}


// =========================================================
// PREENCHER FILTRO DE SERVIÇO
// =========================================================

function preencherFiltroServico() {

    const filtroServico = document.getElementById("serviceFilter");

    filtroServico.innerHTML = "";

    const optionTodos = document.createElement("option");

    optionTodos.value = "todos";
    optionTodos.textContent = "Todos";

    filtroServico.appendChild(optionTodos);

    const servicos = getServicosDisponiveis();

    servicos.forEach(servico => {

        const option = document.createElement("option");

        option.value = servico;
        option.textContent = servico;

        filtroServico.appendChild(option);

    });

}


// =========================================================
// PEGAR INVESTIMENTOS DOS SERVIÇOS
// =========================================================

function getInvestimentosServicos(ano, servico) {

    const investimentos = [];

    sellers.forEach(seller => {

        seller.investimentos.forEach(investimento => {

            // Ignora investimentos que não possuem serviço

            if (
                investimento.servico === null ||
                investimento.servico === undefined ||
                investimento.servico === ""
            ) {

                return;

            }

            // Filtra pelo ano

            if (Number(investimento.ano) !== Number(ano)) {

                return;

            }

            // Filtra pelo serviço

            if (
                servico !== "todos" &&
                investimento.servico !== servico
            ) {

                return;

            }

            investimentos.push(investimento);

        });

    });

    return investimentos;

}


// =========================================================
// ATUALIZAR PÁGINA
// =========================================================

function atualizarServicos() {

    const filtroAno = document.getElementById("serviceYear");
    const filtroServico = document.getElementById("serviceFilter");

    if (!filtroAno || !filtroServico) {
        return;
    }

    const ano = filtroAno.value;
    const servico = filtroServico.value;

    const investimentos = getInvestimentosServicos(
        ano,
        servico
    );

    renderCards(investimentos);

    renderServicesRevenueChart(investimentos);

    renderServicesComparisonChart(investimentos);

    renderServicesTable(investimentos);

}


// =========================================================
// CARDS
// =========================================================


function renderCards(investimentos) {

    // ==========================================
    // RECEITA TOTAL
    // ==========================================

    const total = investimentos.reduce(
        (soma, investimento) => {
            return soma + Number(investimento.valor || 0);
        },
        0
    );

    document.getElementById("totalServiceRevenue").textContent =
        formatarMoeda(total);


    // ==========================================
    // CARD 2
    // TODOS = MAIOR RECEITA
    // SERVIÇO = PARTICIPAÇÃO NA RECEITA
    // ==========================================

    const filtroServico = document.getElementById("serviceFilter").value;

    const cardTitle =
        document.getElementById("secondServiceCardTitle");

    const cardValue =
        document.getElementById("secondServiceCardValue");

    const cardFooter =
        document.getElementById("secondServiceCardFooter");


    // Quando estiver em "Todos"
    if (filtroServico === "todos") {

        const receitaPorServico = {};

        investimentos.forEach(investimento => {

            const servico = investimento.servico;

            if (!receitaPorServico[servico]) {
                receitaPorServico[servico] = 0;
            }

            receitaPorServico[servico] +=
                Number(investimento.valor || 0);
        });


        const servicosOrdenados =
            Object.entries(receitaPorServico)
                .sort((a, b) => b[1] - a[1]);


        cardTitle.textContent =
            "Serviço com maior receita";

        if (servicosOrdenados.length > 0) {

            cardValue.textContent =
                servicosOrdenados[0][0];

            cardFooter.textContent =
                formatarMoeda(servicosOrdenados[0][1]) +
                " de receita no período.";

        } else {

            cardValue.textContent = "-";

            cardFooter.textContent =
                "Nenhum serviço registrado no período.";
        }


    // Quando um serviço específico estiver selecionado
    } else {

        // Receita do serviço filtrado
        const receitaServico = investimentos.reduce(
            (soma, investimento) => {
                return soma + Number(investimento.valor || 0);
            },
            0
        );


        // Receita total de TODOS os serviços do ano
        const ano = Number(
            document.getElementById("serviceYear").value
        );

        const todosInvestimentos =
            getInvestimentosServicos(ano, "todos");

        const receitaTotalAno =
            todosInvestimentos.reduce(
                (soma, investimento) => {
                    return soma + Number(investimento.valor || 0);
                },
                0
            );


        const participacao =
            receitaTotalAno > 0
                ? (receitaServico / receitaTotalAno) * 100
                : 0;


        cardTitle.textContent =
            "Participação na receita";

        cardValue.textContent =
            participacao.toFixed(2).replace(".", ",") + "%";

        cardFooter.textContent =
            "Participação do serviço na receita total do ano.";
    }


    // ==========================================
    // SERVIÇOS REALIZADOS
    // ==========================================

    document.getElementById("totalServices").textContent =
        investimentos.length;


    // ==========================================
    // CLIENTES
    // ==========================================

    const clientes = new Set();

    sellers.forEach(seller => {

        seller.investimentos.forEach(investimento => {

            if (
                investimento.servico === null ||
                investimento.servico === undefined ||
                investimento.servico === ""
            ) {
                return;
            }

            const anoSelecionado =
                Number(
                    document.getElementById("serviceYear").value
                );

            if (Number(investimento.ano) !== anoSelecionado) {
                return;
            }

            if (
                filtroServico !== "todos" &&
                investimento.servico !== filtroServico
            ) {
                return;
            }

            clientes.add(seller.id);
        });

    });

    document.getElementById("totalClients").textContent =
        clientes.size;
}




// =========================================================
// GRÁFICO — RECEITA MENSAL
// =========================================================

function renderServicesRevenueChart(investimentos) {

    const valoresMensais = meses.map(mes => {

        return investimentos
            .filter(investimento => investimento.mes === mes)
            .reduce(
                (soma, investimento) => {

                    return soma + Number(
                        investimento.valor || 0
                    );

                },
                0
            );

    });


    const canvas = document.getElementById(
        "servicesRevenueChart"
    );

    if (!canvas) {
        return;
    }


    const ctx = canvas.getContext("2d");


    if (servicesRevenueChart) {

        servicesRevenueChart.destroy();

    }


    servicesRevenueChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: meses,

            datasets: [

                {
                    label: "Receita",

                    data: valoresMensais,

                    borderColor: "#FCFC30",

                    backgroundColor: "rgba(252, 252, 48, 0.15)",

                    borderWidth: 3,

                    tension: 0.35,

                    fill: true,

                    pointRadius: 4,

                    pointHoverRadius: 6
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return formatarMoeda(
                                context.raw
                            );

                        }

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(value) {

                            return formatarMoeda(value);

                        }

                    }

                }

            }

        }

    });

}


// =========================================================
// GRÁFICO — RECEITA POR SERVIÇO
// =========================================================

function renderServicesComparisonChart(investimentos) {

    const receitaPorServico = {};

    investimentos.forEach(investimento => {

        const servico = investimento.servico;

        if (!receitaPorServico[servico]) {

            receitaPorServico[servico] = 0;

        }

        receitaPorServico[servico] += Number(
            investimento.valor || 0
        );

    });


    const servicos = Object.keys(receitaPorServico);

    const valores = servicos.map(
        servico => receitaPorServico[servico]
    );


    const canvas = document.getElementById(
        "servicesComparisonChart"
    );

    if (!canvas) {
        return;
    }


    const ctx = canvas.getContext("2d");


    if (servicesComparisonChart) {

        servicesComparisonChart.destroy();

    }


    servicesComparisonChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: servicos,

            datasets: [

                {
                    label: "Receita",

                    data: valores,

                    backgroundColor: "#465EFF",

                    borderRadius: 10
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return formatarMoeda(
                                context.raw
                            );

                        }

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(value) {

                            return formatarMoeda(value);

                        }

                    }

                },

                x: {

                    ticks: {

                        autoSkip: false

                    }

                }

            }

        }

    });

}


// =========================================================
// TABELA
// =========================================================

function renderServicesTable(investimentos) {

    const tbody = document.getElementById(
        "servicesTableBody"
    );

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";


    const receitaPorServico = {};

    investimentos.forEach(investimento => {

        const servico = investimento.servico;

        if (!receitaPorServico[servico]) {

            receitaPorServico[servico] = 0;

        }

        receitaPorServico[servico] += Number(
            investimento.valor || 0
        );

    });


    const servicosOrdenados = Object.entries(
        receitaPorServico
    ).sort((a, b) => b[1] - a[1]);


    servicosOrdenados.forEach(
        ([servico, receita]) => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${servico}</td>
                <td>${formatarMoeda(receita)}</td>
            `;

            tbody.appendChild(tr);

        }
    );


    // Total

    const total = investimentos.reduce(
        (soma, investimento) => {

            return soma + Number(
                investimento.valor || 0
            );

        },
        0
    );


    const trTotal = document.createElement("tr");

    trTotal.innerHTML = `
        <td>Total</td>
        <td>${formatarMoeda(total)}</td>
    `;

    tbody.appendChild(trTotal);

}


// =========================================================
// EVENTOS DOS FILTROS
// =========================================================

document
    .getElementById("serviceYear")
    .addEventListener(
        "change",
        atualizarServicos
    );


document
    .getElementById("serviceFilter")
    .addEventListener(
        "change",
        atualizarServicos
    );


// =========================================================
// INICIAR
// =========================================================

carregarServicos();

