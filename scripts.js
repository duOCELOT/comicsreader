// Lista de quadrinhos (subpastas dentro de "quadrinhos")
const quadrinhos = [
    {
        pasta: 'quadrinho1',
        capa: 'quadrinhos/quadrinho1/capa.jpg', // ou capa.png
        info: 'quadrinhos/quadrinho1/info.json'
    },
    {
        pasta: 'quadrinho2',
        capa: 'quadrinhos/quadrinho2/capa.jpg', // ou capa.png
        info: 'quadrinhos/quadrinho2/info.json'
    },
    // Adicione mais quadrinhos conforme necessário
];

// Função para carregar os dados de um quadrinho
async function carregarQuadrinho(quadrinho) {
    try {
        const response = await fetch(quadrinho.info);
        const data = await response.json();
        return { ...quadrinho, ...data };
    } catch (error) {
        console.error(`Erro ao carregar o quadrinho ${quadrinho.pasta}:`, error);
        return null;
    }
}

// Função para gerar o carrossel
function gerarCarrossel(quadrinhos) {
    const carrosselContainer = document.getElementById('carrossel-container');
    carrosselContainer.innerHTML = quadrinhos.map((quadrinho, index) => `
        <div class="carrossel-item" data-index="${index}">
            <img src="${quadrinho.capa}" alt="${quadrinho.titulo}">
        </div>
    `).join('');
}

// Função para gerar os thumbnails
function gerarThumbnails(quadrinhos) {
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    thumbnailsContainer.innerHTML = quadrinhos.map((quadrinho, index) => `
        <div class="thumbnail-item" data-index="${index}">
            <img src="${quadrinho.capa}" alt="${quadrinho.titulo}" onclick="abrirQuadrinho('${quadrinho.pasta}')">
            <p>${quadrinho.titulo}</p>
        </div>
    `).join('');
}

// Função para abrir um quadrinho
function abrirQuadrinho(pasta) {
    window.location.href = `leitor.html?quadrinho=${pasta}`;
}

// Função principal para carregar a página
async function carregarPagina() {
    const quadrinhosCarregados = await Promise.all(quadrinhos.map(carregarQuadrinho));
    const quadrinhosValidos = quadrinhosCarregados.filter(q => q !== null); // Filtra quadrinhos válidos
    gerarCarrossel(quadrinhosValidos);
    gerarThumbnails(quadrinhosValidos);
}

// Inicializar
carregarPagina();