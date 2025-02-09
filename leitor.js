const params = new URLSearchParams(window.location.search);
const pastaQuadrinho = params.get('quadrinho');

async function carregarQuadrinho() {
    // Carregar informações do quadrinho
    const response = await fetch(`quadrinhos/${pastaQuadrinho}/info.json`);
    const data = await response.json();
    document.getElementById('titulo-quadrinho').textContent = data.titulo;

    // Carregar páginas do quadrinho
    const paginasContainer = document.getElementById('paginas-container');
    const paginas = [];

    // Simular a leitura dos arquivos de página (pag(1).jpg, pag(2).jpg, etc.)
    for (let i = 1; ; i++) {
        const pagina = `quadrinhos/${pastaQuadrinho}/pag(${i}).jpg`;
        const img = new Image();
        img.src = pagina;

        // Verificar se a imagem existe
        await new Promise((resolve) => {
            img.onload = () => {
                paginas.push(pagina);
                resolve();
            };
            img.onerror = () => resolve(false); // Parar o loop se a imagem não existir
        });

        if (!img.complete) break; // Parar o loop se a imagem não existir
    }

    // Exibir as páginas
    paginasContainer.innerHTML = paginas.map(pagina => `
        <img src="${pagina}" alt="Página">
    `).join('');
}

carregarQuadrinho();