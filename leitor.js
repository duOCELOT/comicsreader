const params = new URLSearchParams(window.location.search);
const pastaQuadrinho = params.get('quadrinho');

async function carregarQuadrinho() {
    mostrarSpinner();

    try {
        // Carregar informações do quadrinho
        const infoPath = getCacheBustingUrl(`quadrinhos/${pastaQuadrinho}/info.json`);
        const response = await fetch(infoPath);
        const data = await response.json();
        document.getElementById('titulo-quadrinho').textContent = data.titulo;

        // Inicializar o array de páginas
        const paginas = [];

        // Carregar páginas do quadrinho
        for (let i = 1; ; i++) {
            const paginaBase = `quadrinhos/${pastaQuadrinho}/pag (${i})`;
            const paginaPath = await detectImageFormat(paginaBase);

            if (paginaPath) {
                paginas.push(paginaPath);
            } else {
                break; // Parar o loop se nenhuma página for encontrada
            }
        }

        // Exibir as páginas
        const paginasContainer = document.getElementById('paginas-container');
        paginasContainer.innerHTML = paginas.map(pagina => `
            <img src="${pagina}" alt="Página" class="comic-page">
        `).join('');
    } catch (error) {
        console.error(`Erro ao carregar o quadrinho ${pastaQuadrinho}:`, error);
    } finally {
        esconderSpinner();
    }
}

// Função para detectar o formato da imagem (jpg, png, etc.)
async function detectImageFormat(basePath) {
    const formats = ['.jpg', '.png', '.jpeg']; // Adicione mais formatos se necessário
    for (const format of formats) {
        const imgPath = getCacheBustingUrl(`${basePath}${format}`);
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

// Função para adicionar cache-busting
function getCacheBustingUrl(url) {
    const timestamp = new Date().getTime(); // Unique timestamp
    return `${url}?v=${timestamp}`;
}

// Funções para o loading spinner
function mostrarSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function esconderSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

// Inicializar
carregarQuadrinho();