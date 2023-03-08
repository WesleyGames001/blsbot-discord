const {Client, REST, Routes} = require('discord.js')
const {readdirSync} = require('node:fs')

class App {

    constructor() {
        this.client = new Client({intents: [7796]})
        this.client.login('ODczNjA4MjQ4MjE1ODcxNTI4.G8XUrp._g4ryXf1JrwBhzyWWaa8Nkw_aSRqTQRMklKF0k')

        this.registerCommands()
        this.registerEvents()

        console.log('[Grupo BLS] [App]: A aplicação fez sua conexão ao Discord.')
    }

    registerCommands() {
        this.commands = new Map()

        readdirSync('./src/commands/').forEach(name => {
            const Command = require(`./commands/${name}`)
            const command = new Command(this)

            this.commands.set(command.props().name, command)
        })

        console.log('[Grupo BLS] [App]: Os comandos foram pré-carregados com sucesso.')
    }

    registerEvents() {
        readdirSync('./src/events/').forEach(name => {
            const Event = require(`./events/${name}`)
            const event = new Event(this)

            this.client.on(event.constructor.name, (...args) => event.execute(...args))
        })

        console.log('[Grupo BLS] [App]: Os eventos foram pré-carregados com sucesso.')
    }

    async update() {
        const rest = new REST({version: '10'})
            .setToken('ODczNjA4MjQ4MjE1ODcxNTI4.G8XUrp._g4ryXf1JrwBhzyWWaa8Nkw_aSRqTQRMklKF0k')

        await rest.put(
            Routes.applicationCommands('873608248215871528'),
            {
                body: [...this.commands.values()].map(command => command.props().toJSON())
            }
        )
    }
}

new App()