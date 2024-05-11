import {
    Client,
    Collection,
    CommandInteraction,
    IntentsBitField,
    Interaction,
    REST,
    SlashCommandBuilder
} from "discord.js";
import {Routes} from "discord-api-types/v9"
import fs from "fs";
import {ModifiedClient} from "./types/modifiedClient";
import {Command} from "./types/command";

class DiscordClient {
    private readonly client: ModifiedClient;
    private readonly commands: any[] = []
    private readonly token: string = "token"

    public constructor() {
        this.client = new Client({
            intents: [IntentsBitField.Flags.Guilds]
        })
    }

    public async login(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await this.client.login(this.token).then(_ => {this.setHandlers();resolve(true)}).catch(e => reject(e))
        })
    }

    private setHandlers(): void {
        this.client.on('interactionCreate', async (interaction: Interaction) => {
            if (!interaction.isCommand()) return;
            if (this.client.commands) {
                const command: Command | undefined = this.client.commands.get(interaction.commandName);
                if (!command) return;
                try {
                    await command.execute(interaction as CommandInteraction);
                } catch (error) {
                    if (error) console.error(error);
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        ephemeral: true
                    });
                }
            }
        });
    }

    public async start(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const commandFiles: string[] = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));
            Object.defineProperty(this.client, "commands", {
                value: new Collection(),
                writable: true,
                configurable: true,
                enumerable: true
            })
            for (const file of commandFiles) {
                const command: Command = await import(`./commands/${file}`);
                this.client.commands!.set(command.data.name, command);
                if (command.data instanceof SlashCommandBuilder) {
                    this.commands.push(command.data.toJSON());
                } else {
                    this.commands.push(command.data)
                }
            }
            this.client.once('ready', async () => {
                const rest = new REST({
                    version: '9'
                }).setToken(this.token);
                try {
                    await rest.put(
                        Routes.applicationCommands(this.client.user!.id), {
                            body: this.commands
                        },
                    );
                    resolve(true)
                } catch (error) {
                    if (error) reject(error)
                }
            })
        })
    }
}

const b = new DiscordClient()
b.login().then(_ => {
    b.start().then(async r => {
        console.log('Successfully registered application commands globally');
    })
})


