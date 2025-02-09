const params = new URLSearchParams(window.location.search);
const pastaQuadrinho = params.get('quadrinho');

async function carregarQuadrinho() {
    try {
        // Carregar informações do quadrinho
        const response = await fetch(`quadrinhos/${pastaQuadrinho}/info.json`);
        const data = await response.json();
        document.getElementById('titulo-quadrinho').textContent = data.titulo;

        // Carregar páginas do quadrinho
        const paginasContainer = document.getElementById('paginas-container');
        const paginas = [];

        // Simular a leitura dos arquivos de página (pag (1).jpg, pag (2).jpg, etc.)
        for (let i = 1; ; i++) {
            const pagina = `quadrinhos/${pastaQuadrinho}/pag (${i}).jpg`; // Note the space before "("
            const img = new Image();
            img.src = pagina;

            // Verificar se a imagem existe
            const imagemExiste = await new Promise((resolve) => {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
            });

            if (imagemExiste) {
                paginas.push(pagina);
            } else {
                break; // Parar o loop se a imagem não existir
            }
        }

        // Exibir as páginas
        paginasContainer.innerHTML = paginas.map(pagina => `
            <img src="${pagina}" alt="Página">
        `).join('');
    } catch (error) {
        console.error(`Erro ao carregar o quadrinho ${pastaQuadrinho}:`, error);
    }
}

carregarQuadrinho();