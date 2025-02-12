// scripts.js atualizado
async function carregarQuadrinhos() {
    try {
        const response = await fetch("list.json");
        if (!response.ok) throw new Error("Erro ao acessar a pasta de quadrinhos");
        const quadrinhos = await response.json();
        gerarCarrossel(quadrinhos);
    } catch (error) {
        console.error("Erro ao carregar quadrinhos:", error);
    }
}

async function detectImageFormat(basePath) {
    const formatos = ["jpg", "png", "jpeg"];
    for (let ext of formatos) {
        const response = await fetch(`${basePath}.${ext}`);
        if (response.ok) return `${basePath}.${ext}`;
    }
    console.warn("Nenhuma imagem encontrada para:", basePath);
    return "placeholder.jpg";
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

document.addEventListener("DOMContentLoaded", carregarQuadrinhos);
