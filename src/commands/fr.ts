import {CommandInteraction, SlashCommandBuilder} from "discord.js";

const data = new SlashCommandBuilder()
    .setName('fr')
    .setDescription('fr')
    .addStringOption(option => option
        .setName("imageurl")
        .setDescription("The discord url of the image/gif/video")
        .setRequired(true)
    )

async function execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({content: "fr", ephemeral: true});
}

export {
    data,
    execute
}