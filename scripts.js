document.addEventListener('DOMContentLoaded', () => {
    carregarQuadrinhos();
    setupThemeToggle();
});

async function carregarQuadrinhos() {
    mostrarSpinner();

    try {
        // Carregar a lista de quadrinhos
        const response = await fetch('comics-list.json');
        const data = await response.json();
        const quadrinhos = await Promise.all(data.quadrinhos.map(async (pasta) => {
            const infoPath = `quadrinhos/${pasta}/info.json`;
            const infoResponse = await fetch(infoPath);
            const info = await infoResponse.json();
            const capaPath = await detectImageFormat(`quadrinhos/${pasta}/capa`);
            return { pasta, capa: capaPath, info };
        }));

        // Gerar o carrossel e os thumbnails
        gerarCarrossel(quadrinhos);
        gerarThumbnails(quadrinhos);
    } catch (error) {
        console.error('Erro ao carregar quadrinhos:', error);
    } finally {
        esconderSpinner();
    }
}

function gerarCarrossel(quadrinhos) {
    const carrosselContainer = document.getElementById('carrossel-container');
    carrosselContainer.innerHTML = quadrinhos.map((quadrinho, index) => `
        <div class="carrossel-item" data-index="${index}">
            <img src="${quadrinho.capa}" alt="${quadrinho.info.name}" class="carrossel-image">
        </div>
    `).join('');
}

function gerarThumbnails(quadrinhos) {
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    thumbnailsContainer.innerHTML = quadrinhos.map((quadrinho, index) => `
        <div class="thumbnail-item" data-index="${index}">
            <img src="${quadrinho.capa}" alt="${quadrinho.info.name}" onclick="abrirQuadrinho('${quadrinho.pasta}')" class="thumbnail-image">
            <p>${quadrinho.info.name}</p>
        </div>
    `).join('');
}

function abrirQuadrinho(pasta) {
    window.location.href = `leitor.html?quadrinho=${pasta}`;
}

function setupThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
}

async function detectImageFormat(basePath) {
    const formats = ['.jpg', '.png', '.jpeg'];
    for (const format of formats) {
        const imgPath = `${basePath}${format}`;
        const img = new Image();
        img.src = imgPath;

        const exists = await new Promise((resolve) => {
            img.onload = () => resolve(imgPath);
            img.onerror = () => resolve(null);
        });

        if (exists) return exists;
    }
    return null;
}

function mostrarSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'block';
}

function esconderSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
}