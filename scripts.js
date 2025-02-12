document.addEventListener('DOMContentLoaded', () => {
    carregarQuadrinhos();
});

async function carregarQuadrinhos() {
    mostrarSpinner();

    try {
        // Buscar a lista de pastas de quadrinhos
        const response = await fetch('quadrinhos/');
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const folders = Array.from(htmlDoc.querySelectorAll('a'))
            .map(link => link.href)
            .filter(href => href.endsWith('/')) // Filtra apenas pastas
            .map(href => href.replace('/quadrinhos/', '').replace('/', '')) // Extrai o nome da pasta
            .filter(folder => !folder.includes('://')); // Filtra URLs inválidas

        console.log('Pastas de quadrinhos encontradas:', folders);

        // Verifique se as pastas de quadrinhos estão acessíveis
        for (const folder of folders) {
            console.log(`Pasta encontrada: ${folder}`);
            const infoPath = `quadrinhos/${folder}/info.json`;
            const capaPath = await detectImageFormat(`quadrinhos/${folder}/capa`);
            console.log(`Info JSON: ${infoPath}, Capa: ${capaPath}`);
        }

        // Carregar os dados de cada quadrinho
        const quadrinhos = await Promise.all(folders.map(async (pasta) => {
            const infoPath = `quadrinhos/${pasta}/info.json`;
            const capaPath = await detectImageFormat(`quadrinhos/${pasta}/capa`);
            return { pasta, capa: capaPath, info: infoPath };
        }));

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

async function detectImageFormat(basePath) {
    const formats = ['.jpg', '.png', '.jpeg']; // Adicione mais formatos se necessário
    for (const format of formats) {
        const imgPath = `${basePath}${format}`;
        const img = new Image();
        img.src = imgPath;

        const exists = await new Promise((resolve) => {
            img.onload = () => resolve(imgPath);
            img.onerror = () => resolve(null);
        });

        if (exists) {
            return exists;
        }
    }
    console.error(`Nenhuma imagem encontrada para: ${basePath}`);
    return null;
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