/* =====================================================================
   DADOS DA LOJA. O que estiver vazio ("") não foi encontrado: preencher.
   O nome "Keep Steps" foi deduzido do utilizador do Instagram (keep_steps):
   confirmar a grafia oficial.
   ===================================================================== */
const CONFIG = {
  storeName: "Keep Steps",
  tagline: "Cada passo, com estilo e conforto.",   // TODO: confirmar/ajustar
  about: [],                                        // TODO: parágrafos do "Sobre nós"
  whatsapp: "",                                     // TODO: indicativo + número, só dígitos (ex.: "244900000000")
  phone: "",                                        // TODO
  instagram: "https://www.instagram.com/keep_steps/",
  location: "",                                     // TODO
  hours: "",                                        // TODO
  currency: "Kz",                                   // TODO: moeda dos preços
  categories: ["Masculino", "Feminino", "Ténis", "Sandálias", "Sapatos sociais", "Outros"]
};

/* =====================================================================
   PRODUTOS (cada um tem a sua página: produto.html?id=<id>)
   id          : único, sem espaços (ex.: "tenis-classico")
   featured    : true = aparece em "Novidades" na página inicial
   price       : número ou null (null = "Preço sob consulta")
   image       : "assets/images/ficheiro.jpg" ou "" (mostra ícone)
   sizes       : tamanhos oferecidos; unavailableSizes : os que estão esgotados
   colors      : [{name:"Preto", hex:"#111111"}]; unavailableColors : nomes esgotados
   available   : false = produto esgotado
   Os itens abaixo são EXEMPLOS de estrutura (placeholder): substituir pelos reais.
   ===================================================================== */
const PRODUCTS = [
  { id: "produto-1", placeholder: true, name: "Produto 1 (adicionar nome)", category: "Masculino",       featured: true,  price: null, image: "", description: "", available: true,
    sizes: ["40", "41", "42", "43"], unavailableSizes: [], colors: [{ name: "Cor 1", hex: "#1c1a1f" }, { name: "Cor 2", hex: "#6b4a35" }], unavailableColors: [] },
  { id: "produto-2", placeholder: true, name: "Produto 2 (adicionar nome)", category: "Feminino",        featured: true,  price: null, image: "", description: "", available: true,
    sizes: ["36", "37", "38", "39"], unavailableSizes: [], colors: [{ name: "Cor 1", hex: "#1c1a1f" }], unavailableColors: [] },
  { id: "produto-3", placeholder: true, name: "Produto 3 (adicionar nome)", category: "Ténis",           featured: true,  price: null, image: "", description: "", available: true,
    sizes: ["38", "39", "40", "41"], unavailableSizes: ["39"], colors: [{ name: "Cor 1", hex: "#ffffff" }, { name: "Cor 2", hex: "#6b1f2e" }], unavailableColors: ["Cor 2"] },
  { id: "produto-4", placeholder: true, name: "Produto 4 (adicionar nome)", category: "Sandálias",       featured: false, price: null, image: "", description: "", available: false,
    sizes: ["36", "37", "38"], unavailableSizes: [], colors: [], unavailableColors: [] },
  { id: "produto-5", placeholder: true, name: "Produto 5 (adicionar nome)", category: "Sapatos sociais", featured: false, price: null, image: "", description: "", available: true,
    sizes: ["40", "41", "42"], unavailableSizes: [], colors: [], unavailableColors: [] },
  { id: "produto-6", placeholder: true, name: "Produto 6 (adicionar nome)", category: "Outros",          featured: false, price: null, image: "", description: "", available: true,
    sizes: [], unavailableSizes: [], colors: [], unavailableColors: [] }
];
