const {exec} = require('child_process');
const {SlashCommandBuilder} = require('discord.js')

module.exports = class PingCommand {

    constructor(app) {
        this.app = app
    }

    async execute(interaction) {
        const message = [
            await this.pingAndStatus('Latência atual', Date.now() - interaction.createdTimestamp),
            await this.pingAndStatus('Latência do Discord', this.app.client.ws.ping)
        ]

        const clusters = await this.app.database.fetchClusters()

        for (let country of new Set(clusters.map(v => v.country))) {
            message.push('')
            message.push(country)

            for (let {address} of clusters.filter(v => v.country === country)) {
                message.push(`   ${await this.pingAndStatus(address)}`)
            }
        }

        interaction.send(message.join('\n'))
    }

    async ping(address) {
        return new Promise((resolve) => {
            const platform = process.platform;

            const command = (platform === 'win32') ? `ping -n 1 ${address}` : `ping -c 1 ${address}`;
            const regex = (platform === 'win32') ? /tempo=(\d+)ms/ : /time=(\d+) ms/;

            exec(command, (error, stdout) => {
                resolve(!error ? stdout.match(regex)[1] : 0)
            });
        });
    }

    async pingAndStatus(address, defaultPing) {
        const ping = defaultPing ?? await this.ping(address)

        return `${this.status(ping)} ${address}: ${ping}ms`
    }

    status(ping) {
        return ping > 0 ? (ping > 120 ? (ping > 999 ? '<:offline:1082847464639442984>' : '<:restarting:975008482468200449>') : '<:online:975008476059291738>') : '<:unavailable:975008474612264972>'
    }

    props() {
        return new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Teste a velocidade de resposta.')
    }
}