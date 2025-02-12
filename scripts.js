document.addEventListener('DOMContentLoaded', () => {
    carregarQuadrinhos();
});

async function carregarQuadrinhos() {
    mostrarSpinner();

    try {
        // Carregar o arquivo comics.json
        const response = await fetch('comics.json');
        const quadrinhos = await response.json();

        console.log('Quadrinhos carregados:', quadrinhos);

        // Gerar o carrossel e os thumbnails
        gerarCarrossel(quadrinhos);
        gerarThumbnails(quadrinhos);
    } catch (error) {
        console.error('Erro ao carregar quadrinhos:', error);
    } finally {
        esconderSpinner();
    }
}

// Função para gerar o carrossel
function gerarCarrossel(quadrinhos) {
    const carrosselContainer = document.getElementById('carrossel-container');
    carrosselContainer.innerHTML = quadrinhos.map((quadrinho, index) => `
        <div class="carrossel-item" data-index="${index}">
            <img src="${quadrinho.capa}" alt="${quadrinho.titulo}" class="carrossel-image">
        </div>
    `).join('');
}

// Função para gerar os thumbnails
function gerarThumbnails(quadrinhos) {
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    thumbnailsContainer.innerHTML = quadrinhos.map((quadrinho, index) => `
        <div class="thumbnail-item" data-index="${index}">
            <img src="${quadrinho.capa}" alt="${quadrinho.titulo}" onclick="abrirQuadrinho('${quadrinho.pasta}')" class="thumbnail-image">
            <p>${quadrinho.titulo}</p>
        </div>
    `).join('');
}

// Função para abrir um quadrinho
function abrirQuadrinho(pasta) {
    window.location.href = `leitor.html?quadrinho=${pasta}`;
}

// Funções para o loading spinner
function mostrarSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function esconderSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}
