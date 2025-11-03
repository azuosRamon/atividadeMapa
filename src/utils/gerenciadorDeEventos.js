
class GerenciadorDeEventos {
    constructor() {
        this.observadores = {};
    }

    inscrever(evento, callback) {
        if (!this.observadores[evento]){
            this.observadores[evento] = [];
        }
        this.observadores[evento].push(callback);
        return () => this.desinscrever(evento, callback);
    }
    desinscrever(evento, callback){
        if (!this.observadores[evento]) return;
        this.observadores[evento] = this.observadores[evento].filter((funcao) => funcao !== callback);
    }
    disparar(evento, dados) {
        const listaDeObservadores = this.observadores[evento];
        if (!listaDeObservadores) return;
        for (const callback of listaDeObservadores) {
            callback(dados);
        }
    }
}

export const gerenciadorDeEventos = new GerenciadorDeEventos();