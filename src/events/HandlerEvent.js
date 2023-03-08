const {inspect} = require('util')

module.exports = class interactionCreate {

    constructor(app) {
        this.app = app
    }

    async execute(interaction) {
        if (!this.inject(interaction)) return

        const command = this.app.commands.get(interaction.commandName)

        if (!command) {
            return interaction.send(`<:error:975008456631271464> O comando \`${interaction.commandName}\` foi movido para manutenção, tente novamente mais tarde.`)
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)

            await interaction.send(`<:error:975008456631271464> Ocorreu um problema ao executar o comando \`${interaction.commandName}\`, tente novamente mais tarde.`)

            if (interaction.user.id !== '277841139309084672') return

            await interaction.send(`\`\`\`js\n${inspect(error)}\`\`\``)
        }
    }

    inject(interaction) {
        if (!interaction.isCommand()) return false

        return interaction.send = async (content) => {
            if (typeof content !== 'object') {
                content = {content, ephemeral: true};
            }

            if (interaction.replied) {
                return await interaction.followUp(content)
            }

            return await interaction.reply(content)
        }
    }
}