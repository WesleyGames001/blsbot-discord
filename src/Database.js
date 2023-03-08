// TODO: implementar o banco de dados

module.exports = class Database {

    constructor(app) {
        this.app = app;
    }

    connect() {
        console.log('[Grupo BLS] [App]: A aplicação fez sua conexão ao banco de dados.')
    }

    async fetchClusters() {
        return [
            {
                address: 'cluster-1.blasthost.com.br',
                country: ':flag_br: BRA'
            },
            {
                address: 'cluster-2.blasthost.com.br',
                country: ':flag_us: USA'
            },
            {
                address: 'cluster-3.blasthost.com.br',
                country: ':flag_br: BRA'
            },
            {
                address: 'cluster-4.blasthost.com.br',
                country: ':flag_us: USA'
            }
        ]
    }
}