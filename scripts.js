document.addEventListener("DOMContentLoaded", () => {
    carregarQuadrinhos();
});

async function carregarQuadrinhos() {
    try {
        const response = await fetch("quadrinhos/");
        if (!response.ok) throw new Error("Erro ao acessar a pasta de quadrinhos");
        
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a"))
            .map(a => a.href)
            .filter(href => href.includes("quadrinhos/"));
        
        console.log("Pastas de quadrinhos encontradas:", links);
        
        const quadrinhos = [];
        for (let link of links) {
            const folderName = link.split("/").slice(-2, -1)[0];
            const jsonPath = `quadrinhos/${folderName}/info.json`;
            
            try {
                const jsonResponse = await fetch(jsonPath);
                if (!jsonResponse.ok) throw new Error("JSON não encontrado");
                
                const data = await jsonResponse.json();
                const capaPath = await detectImageFormat(`quadrinhos/${folderName}/capa`);
                
                quadrinhos.push({ nome: data.nome, descricao: data.descricao, capa: capaPath, pasta: folderName });
            } catch (err) {
                console.warn(`Erro ao carregar JSON de ${folderName}:`, err);
            }
        }
        
        console.log("Quadrinhos carregados:", quadrinhos);
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
