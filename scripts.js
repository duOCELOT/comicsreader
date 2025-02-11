// Lista de quadrinhos (subpastas dentro de "quadrinhos")
const quadrinhos = [
    {
        pasta: 'quadrinho1',
        capa: 'quadrinhos/quadrinho1/capa.jpg',
        info: 'quadrinhos/quadrinho1/info.json'
    },
    {
        pasta: 'quadrinho2',
        capa: 'quadrinhos/quadrinho2/capa.png',
        info: 'quadrinhos/quadrinho2/info.json'
    },
    {
        pasta: 'quadrinho3',
        capa: 'quadrinhos/quadrinho3/capa.jpg',
        info: 'quadrinhos/quadrinho3/info.json'
    },
    {
        pasta: 'quadrinho4',
        capa: 'quadrinhos/quadrinho4/capa.png',
        info: 'quadrinhos/quadrinho4/info.json'
    },
    // Adicione mais quadrinhos conforme necessário
];

let currentIndex = 0;

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
    thumbnailsContainer.innerHTML = quadrinhos.map((quadrinho, index) => {
        const capaPath = quadrinho.capa.endsWith('.jpg') || quadrinho.capa.endsWith('.png') ? quadrinho.capa : `${quadrinho.capa}.jpg`;
        return `
            <div class="thumbnail-item" data-index="${index}">
                <img src="${capaPath}" alt="${quadrinho.titulo}" onclick="abrirQuadrinho('${quadrinho.pasta}')">
                <p>${quadrinho.titulo}</p>
            </div>
        `;
    }).join('');
}

// Função para abrir um quadrinho
function abrirQuadrinho(pasta) {
    window.location.href = `leitor.html?quadrinho=${pasta}`;
}

// Função principal para carregar a página
async function carregarPagina() {
    mostrarSpinner();
    const quadrinhosCarregados = await Promise.all(quadrinhos.map(carregarQuadrinho));
    const quadrinhosValidos = quadrinhosCarregados.filter(q => q !== null);
    gerarCarrossel(quadrinhosValidos);
    gerarThumbnails(quadrinhosValidos);
    criarDots(quadrinhosValidos.length);
    esconderSpinner();
}

// Funções para o carrossel
function moverCarrossel(direction) {
    const carrosselContainer = document.querySelector('.carrossel-container');
    const items = document.querySelectorAll('.carrossel-item');
    const totalItems = items.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
        currentIndex = 0;
    }

    const offset = -currentIndex * 100;
    carrosselContainer.style.transform = `translateX(${offset}%)`;
    atualizarDots();
}

function criarDots(totalItems) {
    const dotsContainer = document.querySelector('.carrossel-dots');
    dotsContainer.innerHTML = '';

    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('span');
        dot.className = 'carrossel-dot';
        dot.addEventListener('click', () => pularParaSlide(i));
        dotsContainer.appendChild(dot);
    }

    atualizarDots();
}

function pularParaSlide(index) {
    currentIndex = index;
    const carrosselContainer = document.querySelector('.carrossel-container');
    const offset = -currentIndex * 100;
    carrosselContainer.style.transform = `translateX(${offset}%)`;
    atualizarDots();
}

function atualizarDots() {
    const dots = document.querySelectorAll('.carrossel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Funções para o loading spinner
function mostrarSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function esconderSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

// Função para o tema dark/light
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLightTheme = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
});

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
}

// Inicializar
carregarPagina();