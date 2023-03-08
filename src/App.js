const Database = require('./Database.js')
const Discord = require('discord.js')
const {readdirSync} = require('node:fs')

const {DISCORD_TOKEN} = require('../config.json')

class App {

    constructor() {
        this.client = new Discord.Client({intents: [7796]})

        this.database = new Database(this)
        this.database.connect()

        this.registerCommands()
        this.registerEvents()

        this.client.login(DISCORD_TOKEN).then(() => {
            console.log('[Grupo BLS] [App]: A aplicação fez sua conexão ao Discord.')
        })
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
        const rest = new Discord.REST({version: '10'})
            .setToken(DISCORD_TOKEN)

        await rest.put(
            Discord.Routes.applicationCommands('873608248215871528'),
            {
                body: [...this.commands.values()].map(command => command.props().toJSON())
            }
        )
    }
}

new App()