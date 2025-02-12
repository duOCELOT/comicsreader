async function listarQuadrinhos() {
    try {
        const response = await fetch("pages.json");
        if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível carregar os quadrinhos`);

        const quadrinhos = await response.json();
        gerarCarrossel(quadrinhos);
    } catch (error) {
        console.error("Erro ao listar quadrinhos:", error);
        console.warn("Usando dados locais como fallback...");

        // Fallback com quadrinhos locais caso o JSON falhe
        const quadrinhosLocais = [
            { nome: "Quadrinho 1", capa: "img/quadrinho1.jpg", descricao: "Descrição do quadrinho 1" },
            { nome: "Quadrinho 2", capa: "img/quadrinho2.jpg", descricao: "Descrição do quadrinho 2" }
        ];
        gerarCarrossel(quadrinhosLocais);
    }
}

function gerarCarrossel(quadrinhos) {
    const container = document.getElementById("carrossel");
    if (!container) {
        console.error("Elemento #carrossel não encontrado no HTML");
        return;
    }

    container.innerHTML = quadrinhos.map(q => `
        <div class="quadrinho">
            <img src="${q.capa}" alt="${q.nome}">
            <h3>${q.nome}</h3>
            <p>${q.descricao}</p>
        </div>
    `).join("\n");
}

document.addEventListener("DOMContentLoaded", listarQuadrinhos);
