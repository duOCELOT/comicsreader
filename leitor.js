document.addEventListener('DOMContentLoaded', () => {
    carregarQuadrinho();
    setupZoom();
    setupSidebar();
});

async function carregarQuadrinho() {
    mostrarSpinner();

    try {
        const params = new URLSearchParams(window.location.search);
        const pastaQuadrinho = params.get('quadrinho');
        console.log(`Carregando quadrinho: ${pastaQuadrinho}`);

        if (!pastaQuadrinho) {
            throw new Error('Nenhum quadrinho especificado na URL.');
        }

        // Carregar informações do quadrinho
        const infoPath = `quadrinhos/${pastaQuadrinho}/info.json`;
        console.log(`Carregando info.json: ${infoPath}`);
        const response = await fetch(infoPath);

        if (!response.ok) {
            throw new Error(`Erro ao carregar info.json: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Info carregada:', data);
        document.getElementById('titulo-quadrinho').textContent = data.titulo;

        // Carregar páginas do quadrinho
        const paginas = await carregarPaginas(pastaQuadrinho);
        console.log('Páginas carregadas:', paginas);

        // Exibir a primeira página
        const comicPage = document.getElementById('comic-page');
        if (paginas.length > 0) {
            comicPage.src = paginas[0];
        }

        // Carregar lista de quadrinhos na sidebar
        carregarSidebar();
    } catch (error) {
        console.error('Erro ao carregar o quadrinho:', error);
    } finally {
        esconderSpinner();
    }
}

async function carregarPaginas(pasta) {
    const paginas = [];

    for (let i = 1; ; i++) {
        const paginaBase = `quadrinhos/${pasta}/pag (${i})`;
        const paginaPath = await detectImageFormat(paginaBase);

        if (paginaPath) {
            paginas.push(paginaPath);
        } else {
            break;
        }
    }

    return paginas;
}

async function carregarSidebar() {
    try {
        // Buscar a lista de pastas de quadrinhos
        const response = await fetch('quadrinhos/');
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const folders = Array.from(htmlDoc.querySelectorAll('a'))
            .map(link => link.href)
            .filter(href => href.endsWith('/')) // Filtra apenas pastas
            .map(href => href.replace('/quadrinhos/', '').replace('/', '')); // Extrai o nome da pasta

        console.log('Pastas de quadrinhos encontradas:', folders);

        // Carregar os dados de cada quadrinho
        const quadrinhos = await Promise.all(folders.map(async (pasta) => {
            const infoPath = `quadrinhos/${pasta}/info.json`;
            const capaPath = await detectImageFormat(`quadrinhos/${pasta}/capa`);
            return { pasta, capa: capaPath, info: infoPath };
        }));

        console.log('Quadrinhos carregados:', quadrinhos);

        // Exibir os quadrinhos na sidebar
        const sidebarContent = document.getElementById('sidebar-content');
        sidebarContent.innerHTML = quadrinhos.map(quadrinho => `
            <div class="sidebar-item" onclick="abrirQuadrinho('${quadrinho.pasta}')">
                <img src="${quadrinho.capa}" alt="${quadrinho.titulo}">
                <p>${quadrinho.titulo}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar a sidebar:', error);
    }
}

function setupZoom() {
    const comicPage = document.getElementById('comic-page');
    const zoomBox = document.querySelector('.zoom-box');

    comicPage.addEventListener('mousemove', (e) => {
        const rect = comicPage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        zoomBox.style.left = `${x - 50}px`;
        zoomBox.style.top = `${y - 50}px`;
    });

    comicPage.addEventListener('mouseenter', () => {
        document.querySelector('.zoom-area').style.display = 'block';
    });

    comicPage.addEventListener('mouseleave', () => {
        document.querySelector('.zoom-area').style.display = 'none';
    });
}

function setupSidebar() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
}

// Função para detectar o formato da imagem (jpg, png, etc.)
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
    return null;
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