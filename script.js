const cardContainer = document.querySelector(".card-container");
const botaoBusca = document.getElementById('botao-busca');
const searchInput = document.getElementById('search-input');
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

// Função que inicia a busca quando o botão é clicado
function iniciaBusca(evento) {
    // Previne o comportamento padrão do botão, caso ele esteja em um form
    evento.preventDefault(); 

    const termoBusca = searchInput.value.toLowerCase().trim();

    // Se não houver termo de busca, exibe tudo
    if (!termoBusca) {
        renderizarCards(dadosOriginais);
        return;
    }

    // Filtra o array de golpes
    const dadosFiltrados = dadosOriginais.filter(golpe => {
        const nome = golpe.nome.toLowerCase();
        const descricao = golpe.descricao.toLowerCase();
        const tipo = golpe.tipo.toLowerCase();

        return nome.includes(termoBusca) ||
               descricao.includes(termoBusca) ||
               tipo.includes(termoBusca);
    });

    renderizarCards(dadosFiltrados);
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

// Adiciona o evento de clique ao botão, chamando a função iniciaBusca
botaoBusca.addEventListener('click', iniciaBusca);

// Adiciona um evento que escuta a digitação no campo de busca
searchInput.addEventListener('input', () => {
    // Se o campo de busca estiver vazio, renderiza todos os cards novamente
    if (searchInput.value.trim() === '') {
        renderizarCards(dadosOriginais);
    }
});

// Carrega os dados assim que o script é executado
carregarDados();
