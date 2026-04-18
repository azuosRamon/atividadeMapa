export const pegarNomenclatura = () => {
    try {
        const modelo = JSON.parse(localStorage.getItem("modelo")) || {};
        return {
            categorias: modelo.categorias || "Categorias",
            produtos: modelo.produtos || "Produtos / Serviços",
            imoveis: modelo.imoveis || "Imóveis",
            comodos: modelo.comodos || "Cômodos"
        };
    } catch {
        return {
            categorias: "Categorias",
            produtos: "Produtos / Serviços",
            imoveis: "Imóveis",
            comodos: "Cômodos"
        };
    }
};
