const {exec} = require('child_process');
const {SlashCommandBuilder} = require('discord.js')

// TODO: inserir clusters dinâmicos:

module.exports = class PingCommand {

    constructor(app) {
        this.app = app
    }

    execute(interaction) {
        const created = Date.now() - interaction.createdTimestamp
        const ping = this.app.client.ws.ping

        function emoji(number) {
            return number > 0 ? (number > 99 ? (number > 999 ? '<:offline:1082847464639442984>' : '<:restarting:975008482468200449>') : '<:online:975008476059291738>') : '<:unavailable:975008474612264972>'
        }

        interaction.send([
            `${emoji(created)} Latência atual: ${created}ms`,
            `${emoji(ping)} Latência do Discord: ${ping}ms`,
            ``,
            `:flag_br: BRA`,
            `   <:online:975008476059291738> Cluster-5: 10ms`,
            ``,
            `:flag_us: USA`,
            `    <:offline:1082847464639442984> Cluster-1: 1200ms`,
            `    <:restarting:975008482468200449> Cluster-2: 145ms`,
            `    <:restarting:975008482468200449> Cluster-3: 120ms`,
            `    <:unavailable:975008474612264972> Cluster-4: 0ms`,
            ``,
            `<:clock_2:975008443121405992> **Última verificação:** 08/03/2023 00:05`
        ].join('\n'))
    }

    ping(address) {
        return new Promise((resolve) => {
            const platform = process.platform;

            const command = (platform === 'win32') ? `ping -n 1 ${address}` : `ping -c 1 ${address}`;
            const regex = (platform === 'win32') ? /Tempo=([\d\.]+)ms/ : /time=([\d\.]+) ms/;

            exec(command, (error, stdout) => {
                resolve(error ? parseFloat(stdout.match(regex)[1]) : 0)
            });
        });
    }

    props() {
        return new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Teste a velocidade de resposta.')
    }
}