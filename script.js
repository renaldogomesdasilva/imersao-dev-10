const cardContainer = document.querySelector(".card-container");
const botaoBusca = document.getElementById('botao-busca');
const searchInput = document.getElementById('search-input');
let dadosOriginais = {};

// Função para carregar os dados do JSON quando a página carregar
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dadosOriginais = await resposta.json();
        renderizarCard(dadosOriginais); // Exibe tudo inicialmente
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar o conteúdo.</p>";
    }
}

// Função que inicia a busca quando o botão é clicado
function iniciaBusca(evento) {
    // Previne o comportamento padrão do botão, caso ele esteja em um form
    evento.preventDefault(); 

    const termoBusca = searchInput.value.toLowerCase().trim();

    // Se não houver termo de busca, exibe tudo
    if (!termoBusca) {
        renderizarCard(dadosOriginais);
        return;
    }

    // Cria um novo objeto para armazenar os resultados da busca
    const dadosFiltrados = {};
    
    // Itera sobre as chaves do objeto de dados original (ex: "dojo", "sobre-dojo")
    for (const chave in dadosOriginais) {
        const valor = dadosOriginais[chave].toLowerCase();
        if (valor.includes(termoBusca)) {
            // Se o valor contém o termo de busca, adiciona o par chave-valor correspondente
            // Por exemplo, se "sobre-dojo" contém o termo, adicionamos "dojo" e "sobre-dojo"
            if (chave.startsWith('sobre-')) {
                const chavePrincipal = chave.replace('sobre-', '');
                dadosFiltrados[chavePrincipal] = dadosOriginais[chavePrincipal];
                dadosFiltrados[chave] = dadosOriginais[chave];
            } else {
                 dadosFiltrados[chave] = dadosOriginais[chave];
            }
        }
    }

    renderizarCard(dadosFiltrados);
}

function renderizarCard(dadosParaRenderizar){
    cardContainer.innerHTML = ''; 

    // Se nenhum dado corresponder à busca, exibe uma mensagem
    if (Object.keys(dadosParaRenderizar).length === 0) {
        cardContainer.innerHTML = '<p class="card">Nenhum resultado encontrado.</p>';
        return;
    }

    const article = document.createElement("article");
    article.classList.add("card");

    // Adiciona o conteúdo dinamicamente se ele existir nos dados filtrados
    let htmlConteudo = '';
    if (dadosParaRenderizar.dojo) {
        htmlConteudo += `<h2>${dadosParaRenderizar.dojo}</h2>`;
    }
    if (dadosParaRenderizar['sobre-dojo']) {
        htmlConteudo += `<p>${dadosParaRenderizar['sobre-dojo']}</p>`;
    }
    if (dadosParaRenderizar.treinamentos) {
        htmlConteudo += `<h2>${dadosParaRenderizar.treinamentos}</h2>`;
    }
    if (dadosParaRenderizar['sobre-treinamentos']) {
        htmlConteudo += `<p>${dadosParaRenderizar['sobre-treinamentos']}</p>`;
    }
    
    article.innerHTML = htmlConteudo;

    cardContainer.appendChild(article);
}

// Adiciona o evento de clique ao botão, chamando a função iniciaBusca
botaoBusca.addEventListener('click', iniciaBusca);

// Carrega os dados assim que o script é executado
carregarDados();
