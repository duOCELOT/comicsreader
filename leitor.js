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
        if (!pastaQuadrinho) throw new Error('Quadrinho não especificado.');

        // Carregar informações do quadrinho
        const infoPath = `quadrinhos/${pastaQuadrinho}/info.json`;
        const infoResponse = await fetch(infoPath);
        const info = await infoResponse.json();
        document.getElementById('titulo-quadrinho').textContent = info.name;

        // Carregar páginas do quadrinho
        const paginas = await carregarPaginas(pastaQuadrinho);
        const comicPage = document.getElementById('comic-page');
        if (paginas.length > 0) comicPage.src = paginas[0];

        // Carregar lista de quadrinhos na sidebar
        carregarSidebar();
    } catch (error) {
        console.error('Erro ao carregar o quadrinho:', error);
        alert('Erro ao carregar o quadrinho. Verifique o console para mais detalhes.');
    } finally {
        esconderSpinner();
    }
}

async function carregarPaginas(pasta) {
    const paginas = [];
    for (let i = 1; ; i++) {
        const paginaBase = `quadrinhos/${pasta}/pag (${i})`;
        const paginaPath = await detectImageFormat(paginaBase);
        if (paginaPath) paginas.push(paginaPath);
        else break;
    }
    return paginas;
}

async function carregarSidebar() {
    try {
        const response = await fetch('comics-list.json');
        const data = await response.json();
        const quadrinhos = await Promise.all(data.quadrinhos.map(async (pasta) => {
            const infoPath = `quadrinhos/${pasta}/info.json`;
            const infoResponse = await fetch(infoPath);
            const info = await infoResponse.json();
            const capaPath = await detectImageFormat(`quadrinhos/${pasta}/capa`);
            return { pasta, capa: capaPath, info };
        }));

        const sidebarContent = document.getElementById('sidebar-content');
        sidebarContent.innerHTML = quadrinhos.map(quadrinho => `
            <div class="sidebar-item" onclick="abrirQuadrinho('${quadrinho.pasta}')">
                <img src="${quadrinho.capa}" alt="${quadrinho.info.name}">
                <p>${quadrinho.info.name}</p>
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