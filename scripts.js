async function listarQuadrinhos() {
    try {
        const response = await fetch("pages.json");
        if (!response.ok) throw new Error("Erro ao acessar a pasta de quadrinhos");

        const quadrinhos = await response.json();
        gerarCarrossel(quadrinhos);
    } catch (error) {
        console.error("Erro ao listar quadrinhos:", error);
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
