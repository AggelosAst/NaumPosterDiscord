import {CommandInteraction, EmbedBuilder} from "discord.js";
import axios from "axios";

const allowed: string[] = ["973926908276400198", "918891952009801798", "1238551516382760970", "1189650607854858273", "1187428301321551963", "344927927047028767", "1120091874636603463", "1219761319344078972"]

const data = {
    name: "upload",
    description: "Upload an image to Naum gallery. Supply a discord image url (e.g cdn.discordapp.com)",
    integration_types: [1],
    contexts: [0, 1, 2],
    options: [
        {
            autocomplete: undefined,
            type: 3,
            choices: undefined,
            name: 'imageurl',
            name_localizations: undefined,
            description: 'The discord url of the image/gif/video',
            description_localizations: undefined,
            required: true,
            max_length: undefined,
            min_length: undefined
        }
    ],

}

const loadingEmbed = new EmbedBuilder()
    .setAuthor({
        iconURL: "https://bignutty.gitlab.io/webstorage4/v2/assets/icons/core/ico_notice_loading.gif?r=0",
        name: "Uploading..."
    })
const errorEmbed = new EmbedBuilder()
    .setAuthor({
        iconURL: "https://media.discordapp.net/attachments/1238907518932095047/1238907656274579576/4934-error.png?ex=6640fe2b&is=663facab&hm=ab238dc9c437f25e05ca719db8e1e7bc61acca2006c459182ca22ca4dd28a087&",
        name: "Error!",
    })
const successEmbed = new EmbedBuilder()
    .setAuthor({
        iconURL: "https://media.discordapp.net/attachments/1238907518932095047/1238907655993430027/4569-ok.png?ex=6640fe2a&is=663facaa&hm=9bd274a8474edc7a1b25aca3c15ee94f4a23dff2c71744e41ae5bdc3ffe58921&",
        name: "Success!"
    })

async function execute(interaction: CommandInteraction): Promise<void> {
    const authorId: string = interaction.user.id
    if (!allowed.includes(authorId)) {
        await interaction.reply({
            content: "Cant use this!",
            ephemeral: true
        })
        return
    }
    const imageURL: string = interaction.options.get("imageurl")!.value as string
    const loading = await interaction.reply({
        embeds: [loadingEmbed]
    })

    await axios.post("https://sorlion.lol/upload", {
        image: imageURL
    }).then(async r => {
        successEmbed.setDescription("```xml\n" + r.data + "```" + "\n**TIP**: https://sorlion.lol/gallery",)
        return await interaction.editReply({
            embeds: [successEmbed]
        })
    }).catch(async e => {
        errorEmbed.setDescription("```xml\n" + e.response.data + "```" + "\n")
        return await interaction.editReply({
            embeds: [errorEmbed]
        })
    })
}

export {
    data,
    execute
}