
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

async function carregarSellers() {
    const response = await fetch("./data/sellers.json");
    sellers = await response.json();

    renderSellers();
    renderSellerDetail();
    renderTotalSellers();
    renderRevenueChart();
    renderYearlyRevenueChart();
    renderTotalRevenue();
    renderTopSellers();
    renderCardInvestimentoAnoAtual();
}

carregarSellers();

/*calcular o total de sellers*/
function getTotalSellersUnicos() {
    const nomesUnicos = new Set(                        //<------remove nomes duplicados automaticamente.//
        sellers.map(seller => seller.nome)          //<-----pega somente o nome de cada seller.// 
    );

    return nomesUnicos.size;        //<-----conta quantos nomes únicos sobraram.//
}

function renderTotalSellers() {

    const total =
        getTotalSellersUnicos();

    // Card na página sellers.html
    const totalSellersCard =
        document.getElementById("totalSellersCard");

    if (totalSellersCard) {
        totalSellersCard.textContent = total;
    }

    // Card na página dashmidiakit.html
    const totalSellersDashboard =
        document.getElementById("totalSellersDashboard");

    if (totalSellersDashboard) {
        totalSellersDashboard.textContent = total;
    }

}


/* =========================
   PÁGINA DE DETALHE
========================= */


function renderSellerDetail() {

    const params =
        new URLSearchParams(window.location.search);

    const sellerId =
        params.get("seller");

    // Acha o objeto inicial pra descobrir o nome
    const sellerBase =
        sellers.find(
            seller => seller.id === sellerId
        );

    if (!sellerBase) return;

    // Junta TODOS os objetos com o mesmo NOME
    const sellersDoMesmoNome =
        sellers.filter(
            seller => seller.nome === sellerBase.nome
        );

    const seller = {
        ...sellerBase,
        investimentos: sellersDoMesmoNome.flatMap(
            s => s.investimentos
        )
    };


    if (sellerName) {
        sellerName.textContent = seller.nome;
    }
    const breadcrumbSellerName =
    document.getElementById("breadcrumbSellerName");

    if (breadcrumbSellerName) {
    breadcrumbSellerName.textContent = seller.nome;
    }

    if (sellerNameCard) {
        sellerNameCard.textContent = seller.nome;
    }


    /* TOTAL */

    const total =
        seller.investimentos.reduce(
            (soma, investimento) =>
                soma + investimento.valor,
            0
        );


    if (totalInvestment) {

        totalInvestment.textContent =
            total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

    }
    
    

    /* FILTRO DE SERVIÇO */

    const filterService =
        document.getElementById("filterService");


    if (filterService) {

        const servicos = [
            ...new Set(
                seller.investimentos
                    .map(investimento => investimento.servico)
                    .filter(servico => servico)
            )
        ];


        servicos.forEach(servico => {

            const option =
                document.createElement("option");

            option.value = servico;

            option.textContent = servico;

            filterService.appendChild(option);

        });

    }


    /* HISTÓRICO */

    const history =
        document.getElementById("investmentHistory");


    function renderInvestmentHistory() {

        if (!history) return;


        const detailYear =
            document.getElementById("detailYear");

        const detailMonth =
            document.getElementById("detailMonth");

        const detailService =
            document.getElementById("filterService");


        const selectedYear =
            detailYear
                ? detailYear.value
                : "all";


        const selectedMonth =
            detailMonth
                ? detailMonth.value
                : "all";


        const selectedService =
            detailService
                ? detailService.value
                : "all";


        const investimentosFiltrados =
            seller.investimentos.filter(
                investimento => {

                    const anoOK =
                        selectedYear === "all" ||
                        investimento.ano.toString() === selectedYear;


                    const mesOK =
                        selectedMonth === "all" ||
                        investimento.mes === selectedMonth;


                    const servicoOK =
                        selectedService === "all" ||
                        investimento.servico === selectedService;


                    return anoOK &&
                           mesOK &&
                           servicoOK;

                }
            );


        history.innerHTML = "";


        investimentosFiltrados.forEach(
            investimento => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${investimento.ano}
                    </td>

                    <td>
                        ${investimento.mes}
                    </td>

                    <td>
                        ${investimento.servico || "—"}
                    </td>

                    <td>

                        <strong>
                            ${investimento.valor.toLocaleString(
                                "pt-BR",
                                {
                                    style: "currency",
                                    currency: "BRL"
                                }
                            )}
                        </strong>

                    </td>

                `;


                history.appendChild(row);

            }
        );

    }


    /* EVENTOS DOS FILTROS */

    const detailYear =
        document.getElementById("detailYear");

    const detailMonth =
        document.getElementById("detailMonth");

    const detailService =
        document.getElementById("filterService");


    if (detailYear) {

        detailYear.addEventListener(
            "change",
            renderInvestmentHistory
        );

    }


    if (detailMonth) {

        detailMonth.addEventListener(
            "change",
            renderInvestmentHistory
        );

    }


    if (detailService) {

        detailService.addEventListener(
            "change",
            renderInvestmentHistory
        );

    }


    renderInvestmentHistory();

}



/* =========================
   LISTA DE SELLERS
========================= */

const sellersList =
    document.getElementById("sellersList");

const filterYear =
    document.getElementById("filterYear");

const filterMonth =
    document.getElementById("filterMonth");

const sellerSearch =
    document.getElementById("sellerSearch");

function getDataMaisRecente(investimentos) {
    if (!investimentos || investimentos.length === 0) return -Infinity;

    return investimentos.reduce((maisRecente, investimento) => {
        const dataAtual = Number(investimento.ano) * 12 + meses.indexOf(investimento.mes);
        return Math.max(maisRecente, dataAtual);
    }, -Infinity);
}


function renderSellers() {

    if (!sellersList) return;


    sellersList.innerHTML = "";


    const selectedYear =
        filterYear
            ? filterYear.value
            : "all";


    const selectedMonth =
        filterMonth
            ? filterMonth.value
            : "all";
    
    const searchTerm =
    sellerSearch
        ? sellerSearch.value.trim().toLowerCase()
            : "";
    const sellersOrdenados = [...sellers].sort((a, b) => {
        return getDataMaisRecente(b.investimentos) - getDataMaisRecente(a.investimentos);
    });

     sellersOrdenados.forEach(seller => {

        console.log(
        seller.nome,
        seller.investimentos
        );

        const sellerName =
            seller.nome.toLowerCase();

        if (
            searchTerm &&
            !sellerName.includes(searchTerm)
        ) {
            return;
        }


        const investimentosFiltrados =
            seller.investimentos.filter(
                investimento => {

                    const anoOK =
                        selectedYear === "all" ||
                        investimento.ano.toString() === selectedYear;


                    const mesOK =
                        selectedMonth === "all" ||
                        investimento.mes === selectedMonth;


                    return anoOK && mesOK;

                }
            );


        if (investimentosFiltrados.length === 0) {
            return;
        }


        const total =
            investimentosFiltrados.reduce(
                (soma, investimento) =>
                    soma + investimento.valor,
                0
            );


        const ultimoInvestimento =
            [...investimentosFiltrados].sort((a, b) => {

                if (Number(a.ano) !== Number(b.ano)) {
                    return Number(b.ano) - Number(a.ano);
                }

                return (
                    meses.indexOf(b.mes) -
                    meses.indexOf(a.mes)
                );

            }
            )[0];



        const row =
            document.createElement("tr");


        row.classList.add("seller-row");


        row.onclick = function () {

            window.location.href =
                `seller-detail.html?seller=${seller.id}`;

        };


        row.innerHTML = `

            <td>

                <div class="seller-name">

                    <div class="seller-avatar">
                        ${seller.nome.charAt(0)}
                    </div>


                    <div>

                        <strong>
                            ${seller.nome}
                        </strong>
                        
                        <!-- <span> se quiser mostrar o ID do seller, descomente o bloco
                            Seller ${seller.id}
                        </span> -->
                        
                    </div>

                </div>

            </td>


            <td>

                <strong>

                    ${total.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    )}

                </strong>

            </td>


            <td>

                ${ultimoInvestimento
                    ? `${ultimoInvestimento.mes}/${ultimoInvestimento.ano}`
                    : "—"
                }

            </td>


            <td class="arrow">
                →
            </td>

        `;


        sellersList.appendChild(row);

    });

}


/* FILTROS DA LISTA */

if (filterYear) {

    filterYear.addEventListener(
        "change",
        renderSellers
    );

}


if (filterMonth) {

    filterMonth.addEventListener(
        "change",
        renderSellers
    );

}

if (sellerSearch) {
    sellerSearch.addEventListener(
        "input",
        renderSellers
    );
}

/* =========================
   Grafico faturamento linear
========================= */
function renderRevenueChart() {

    const canvas =
        document.getElementById("revenueChart");

    if (!canvas) return;


    const nomesDosMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const abreviacoes = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    const anos = [2024, 2025, 2026];


    // Junta todos os investimentos de todos os sellers
    const todosInvestimentos =
        sellers.flatMap(seller => seller.investimentos);


    const labels = [];
    const totaisPorMes = [];


    anos.forEach(ano => {

        nomesDosMeses.forEach((nomeMes, index) => {

            labels.push(`${abreviacoes[index]}/${ano}`);


            const totalDoMes = todosInvestimentos
                .filter(inv =>
                    inv.ano === ano &&
                    inv.mes === nomeMes
                )
                .reduce((soma, inv) =>
                    soma + (inv.valor || 0), 0
                );

            totaisPorMes.push(totalDoMes);

        });

    });


    new Chart(canvas, {

        type: "line",

        data: {
            labels: labels,
            datasets: [{
                label: "Faturamento",
                data: totaisPorMes,
                borderColor: "#FFD700",
                backgroundColor: "rgba(255, 215, 0, 0.15)",
                fill: true,
                tension: 0.3,
                pointRadius: 3
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value =>
                            "R$ " + (value / 1000) + "k"
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 90,
                        minRotation: 45
                    }
                }
            }
        }

    });

}

/* =========================
   grafico faturamento por ano
========================= */
function renderYearlyRevenueChart() {

    const canvas =
        document.getElementById("yearlyRevenueChart");

    if (!canvas) return;


    const anos = [2023, 2024, 2025, 2026];

    const todosInvestimentos =
        sellers.flatMap(seller => seller.investimentos);


    const totaisPorAno =
        anos.map(ano => {

            return todosInvestimentos
                .filter(inv => inv.ano === ano)
                .reduce((soma, inv) =>
                    soma + (inv.valor || 0), 0
                );

        });


    new Chart(canvas, {

        type: "bar",

        data: {
            labels: anos,
            datasets: [{
                label: "Faturamento",
                data: totaisPorAno,
                backgroundColor: "#FFD700",
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value =>
                            "R$ " + (value / 1000) + "k"
                    }
                }
            }
        }

    });

}

/* =========================
   Atualiza o card de faturamento total
========================= */
function renderTotalRevenue() {

    const card =
        document.getElementById("totalRevenue");

    if (!card) return;


    const todosInvestimentos =
        sellers.flatMap(seller => seller.investimentos);

    const total =
        todosInvestimentos.reduce((soma, inv) =>
            soma + (inv.valor || 0), 0
        );


    card.textContent =
        "R$ " + total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

}

/* =========================
    Top 5 sellers
========================= */
function renderTopSellers() {

    const tbody =
        document.getElementById("topSellersBody");

    if (!tbody) return;


    const sellersComTotal =
        sellers.map(seller => {

            const total =
                seller.investimentos.reduce((soma, inv) =>
                    soma + (inv.valor || 0), 0
                );

            return {
                nome: seller.nome,
                total: total
            };

        });


    const top5 =
        sellersComTotal
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);


    tbody.innerHTML = "";

    top5.forEach(seller => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><strong>${seller.nome}</strong></td>
            <td>R$ ${seller.total.toLocaleString("pt-BR")}</td>
            <td></td>
        `;

        tbody.appendChild(tr);

    });

}

/* =========================
   Calcular o total de investimento no ano atual
========================= */

function renderCardInvestimentoAnoAtual() {

    const anoAtual = new Date().getFullYear();

    const totalInvestimentosAnoAtual = sellers.reduce(
        (total, seller) => {

            const investimentosDoAno =
                seller.investimentos.filter(
                    investimento =>
                        Number(investimento.ano) === anoAtual
                );

            const totalSeller =
                investimentosDoAno.reduce(
                    (soma, investimento) =>
                        soma + Number(investimento.valor),
                    0
                );

            return total + totalSeller;
        },
        0
    );


    // =========================
    // CARD FATURAMENTO ANO ATUAL
    // =========================

    const cardTotal =
        document.getElementById("totalInvestimentosAnoAtual");

    if (cardTotal) {

        cardTotal.textContent =
            totalInvestimentosAnoAtual.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );
    }


    // =========================
    // CARD META ANO ATUAL
    // =========================

    const metaAno = 500000;

    const cardMetaAno =
        document.getElementById("cardMetaAno");

    const valorMetaAno =
        document.getElementById("valorMetaAno");


    if (cardMetaAno && valorMetaAno) {

        cardMetaAno.addEventListener("mouseenter", () => {

            const falta =
                metaAno - totalInvestimentosAnoAtual;


            if (falta > 0) {

                valorMetaAno.textContent =
                    "Faltam " +
                    falta.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );

            } else {

                valorMetaAno.textContent =
                    "Meta atingida!";

            }
        });


        cardMetaAno.addEventListener("mouseleave", () => {

            valorMetaAno.textContent =
                metaAno.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );
        });
    }
}