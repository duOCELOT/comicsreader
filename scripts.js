async function listarQuadrinhos() {
    const comicListContainer = document.getElementById('comic-list');
    
    try {
        const response = await fetch('quadrinhos/list.json'); // Assuming list.json contains all comic names
        const comics = await response.json();

        comics.forEach(async (comic) => {
            const comicCard = document.createElement('div');
            comicCard.classList.add('comic-card');

            // Load the comic's JSON data
            const comicDataResponse = await fetch(`quadrinhos/${comic}/pages.json`);
            const comicData = await comicDataResponse.json();

            const coverImage = document.createElement('img');
            coverImage.src = `quadrinhos/${comic}/capa.jpg`;
            coverImage.alt = `Capa de ${comicData.name}`;
            
            const title = document.createElement('h2');
            title.textContent = comicData.name;

            const description = document.createElement('p');
            description.textContent = comicData.description;

            const link = document.createElement('a');
            link.href = `leitor.html?quadrinho=${comic}`;
            link.textContent = 'Ler Quadrinho';

            comicCard.appendChild(coverImage);
            comicCard.appendChild(title);
            comicCard.appendChild(description);
            comicCard.appendChild(link);
            
            comicListContainer.appendChild(comicCard);
        });

    } catch (error) {
        console.error("Erro ao carregar quadrinhos:", error);
    }
}

async function carregarQuadrinho(pasta) {
    mostrarSpinner();
    const readerContainer = document.getElementById('comic-reader-container');
    
    try {
        const response = await fetch(`quadrinhos/${pasta}/pages.json`);
        if (!response.ok) throw new Error("JSON não encontrado");

        const comicData = await response.json();

        const title = document.createElement('h1');
        title.textContent = comicData.name;
        readerContainer.appendChild(title);

        const description = document.createElement('p');
        description.textContent = comicData.description;
        readerContainer.appendChild(description);

        const coverImage = document.createElement('img');
        coverImage.src = `quadrinhos/${pasta}/capa.jpg`;
        coverImage.alt = 'Capa do Quadrinho';
        readerContainer.appendChild(coverImage);

        comicData.pages.forEach(page => {
            const img = document.createElement('img');
            img.src = `quadrinhos/${pasta}/${page}`;
            img.alt = `Página ${page}`;
            readerContainer.appendChild(img);
        });

    } catch (error) {
        console.error("Erro ao carregar quadrinho:", error);
        alert("Erro ao carregar quadrinho!");
    } finally {
        esconderSpinner();
    }
}

function mostrarSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function esconderSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}
