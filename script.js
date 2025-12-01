const cardContainer = document.querySelector(".card-container");
// Variáveis para os elementos de busca
const searchInput = document.getElementById('search-input');
const botaoBusca = document.getElementById('botao-busca');
const mainContent = document.querySelector('main');

let dadosOriginais = []; // Agora será um array de golpes

// Função para carregar os dados do JSON quando a página carregar
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dadosOriginais = await resposta.json();
        renderizarCards(dadosOriginais); // Exibe todos os cards inicialmente
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar o conteúdo.</p>";
    }
}

// Função auxiliar para extrair o ID do vídeo do YouTube
function extrairIdVideoYouTube(url) {
    try {
        const urlObj = new URL(url);
        // A maioria dos links do YouTube tem o ID no parâmetro 'v'
        return urlObj.searchParams.get('v');
    } catch (e) {
        console.error("URL do vídeo inválida:", url);
        return null;
    }
}

function renderizarCards(listaDeGolpes){
    cardContainer.innerHTML = ''; 

    // Se nenhum dado corresponder à busca, exibe uma mensagem
    if (listaDeGolpes.length === 0) {
        cardContainer.innerHTML = '<p class="card">Nenhum resultado encontrado.</p>';
        return;
    }

    // Itera sobre cada golpe e cria um card para ele
    listaDeGolpes.forEach(golpe => {
        const article = document.createElement("article");
        article.classList.add("card");

        const videoId = extrairIdVideoYouTube(golpe.video_link);

        // Cria o conteúdo HTML para o card do golpe
        article.innerHTML = `
            <div class="card-video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="card-info-container">
                <h2>${golpe.nome} <span class="tipo-golpe">(${golpe.tipo})</span></h2>
                <p>${golpe.descricao}</p>
            </div>
        `;

        cardContainer.appendChild(article);
    });
}

// --- NOVA LÓGICA DE BUSCA GLOBAL ---

function filtrarConteudoDaPagina() {
    const termoBusca = searchInput.value.toLowerCase().trim();

    // Filtra os cards de técnicas dinamicamente
    const golpesFiltrados = dadosOriginais.filter(golpe => 
        golpe.nome.toLowerCase().includes(termoBusca) || golpe.descricao.toLowerCase().includes(termoBusca)
    );
    renderizarCards(golpesFiltrados);

    // Seleciona as seções de conteúdo estático (tudo, exceto o container dos cards)
    const secoesEstaticas = mainContent.querySelectorAll('section:not(.card-section)');

    secoesEstaticas.forEach(elemento => {
        // Se a busca estiver vazia, mostra tudo
        if (termoBusca === '') {
            elemento.classList.remove('hidden-by-search');
            return;
        }

        const textoElemento = elemento.textContent.toLowerCase();
        const corresponde = textoElemento.includes(termoBusca);
        elemento.classList.toggle('hidden-by-search', !corresponde);
    });

    // Lógica especial para a seção de técnicas (cards)
    const secaoTecnicas = mainContent.querySelector('.card-section');

    if (secaoTecnicas) {
        // Se a busca estiver vazia, mostra a seção de técnicas
        if (termoBusca === '') {
            secaoTecnicas.classList.remove('hidden-by-search');
            return;
        }

        // Verifica se o título da seção ou algum card corresponde à busca
        const textoSecao = secaoTecnicas.textContent.toLowerCase();
        const corresponde = textoSecao.includes(termoBusca);

        // Mostra a seção de técnicas se o título corresponder OU se houver cards filtrados
        secaoTecnicas.classList.toggle('hidden-by-search', !corresponde && golpesFiltrados.length === 0);
    }
}

// Adiciona o evento de 'input' para buscar enquanto o usuário digita
searchInput.addEventListener('input', filtrarConteudoDaPagina);

// Adiciona evento ao botão para prevenir comportamento padrão e executar a busca
botaoBusca.addEventListener('click', (e) => {
    e.preventDefault(); // Previne o envio de formulário
    filtrarConteudoDaPagina();
});

// Carrega os dados assim que o script é executado
carregarDados();
