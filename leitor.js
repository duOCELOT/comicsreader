document.addEventListener('DOMContentLoaded', () => {
    carregarQuadrinho();
    setupZoom();
    setupSidebar();
    setupNavigation();
});

let currentPage = 0;
let paginas = [];

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
        paginas = await carregarPaginas(pastaQuadrinho);
        if (paginas.length > 0) {
            exibirPagina(currentPage);
        }

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

function exibirPagina(index) {
    const container = document.querySelector('.full-page-view');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    const img = document.createElement('img');
    img.src = paginas[index];
    img.alt = `Página ${index + 1}`;
    img.classList.add('comic-page');
    container.appendChild(img);
}

function setupNavigation() {
    document.getElementById('next').addEventListener('click', () => {
        if (currentPage < paginas.length - 1) {
            currentPage++;
            exibirPagina(currentPage);
        }
    });

    document.getElementById('previous').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            exibirPagina(currentPage);
        }
    });
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
    const comicPage = document.querySelector('.comic-page');
    const zoomBox = document.querySelector('.zoom-box');

    if (comicPage && zoomBox) {
        comicPage.addEventListener('mousemove', (e) => {
            const rect = comicPage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Ajusta o zoom para seguir o mouse
            zoomBox.style.left = `${x - 50}px`;
            zoomBox.style.top = `${y - 50}px`;

            // Aplica o zoom na imagem
            comicPage.style.transformOrigin = `${x}px ${y}px`;
            comicPage.style.transform = 'scale(2)'; // Aumenta a imagem em 2x
        });

        comicPage.addEventListener('mouseleave', () => {
            // Remove o zoom quando o mouse sai da imagem
            comicPage.style.transform = 'scale(1)';
            document.querySelector('.zoom-area').style.display = 'none';
        });

        comicPage.addEventListener('mouseenter', () => {
            document.querySelector('.zoom-area').style.display = 'block';
        });
    }
}

function setupSidebar() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
}

async function detectImageFormat(basePath) {
    const formats = ['.jpg', '.png', '.jpeg'];
    for (const format of formats) {
        const imgPath = `${basePath}${format}`;
        try {
            const response = await fetch(imgPath, { method: 'HEAD' });
            if (response.ok) return imgPath;
        } catch (error) {
            console.error(`Erro ao verificar imagem: ${imgPath}`, error);
        }
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

async function carregarPaginas(pasta) {
    const paginas = [];
    for (let i = 1; i <= 100; i++) { // Limite de 100 páginas por quadrinho
        const paginaBase = `quadrinhos/${pasta}/pag (${i})`;
        const paginaPath = await detectImageFormat(paginaBase);
        if (paginaPath) paginas.push(paginaPath);
        else break;
    }
    return paginas;
}