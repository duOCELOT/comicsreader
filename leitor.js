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
        paginasContainer.innerHTML = paginas.map(pagina => `
            <img src="${pagina}" alt="Página" class="comic-page">
        `).join('');

        // Simular a leitura dos arquivos de página (pag (1).jpg, pag (1).png, etc.)
        for (let i = 1; ; i++) {
            const paginaBase = `quadrinhos/${pastaQuadrinho}/pag (${i})`;
            const extensoes = ['.jpg', '.png']; // Suporta .jpg e .png

            let paginaEncontrada = false;

            // Tenta carregar a página com cada extensão
            for (const extensao of extensoes) {
                const pagina = `${paginaBase}${extensao}`;
                const img = new Image();
                img.src = pagina;

                // Verificar se a imagem existe
                const imagemExiste = await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                });

                if (imagemExiste) {
                    paginas.push(pagina);
                    paginaEncontrada = true;
                    break; // Sai do loop de extensões se a imagem for encontrada
                }
            }

            // Se nenhuma imagem for encontrada, para o loop
            if (!paginaEncontrada) {
                break;
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