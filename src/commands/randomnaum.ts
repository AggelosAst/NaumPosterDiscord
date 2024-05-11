import {AttachmentBuilder, CommandInteraction, EmbedBuilder} from "discord.js";
import axios from "axios";
import {randomInRange } from "make-random";

const allowed: string[] = ["973926908276400198", "918891952009801798", "1189650607854858273", "1187428301321551963", "344927927047028767", "1120091874636603463", "1238551516382760970", "1219761319344078972", "1093609255623475270"]

const data = {
    name: "randomnaum",
    description: "Returns a random image from the gallery",
    integration_types: [1],
    contexts: [1, 2],

}

const loadingEmbed = new EmbedBuilder()
    .setAuthor({
        iconURL: "https://bignutty.gitlab.io/webstorage4/v2/assets/icons/core/ico_notice_loading.gif?r=0",
        name: "Fetching..."
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
    const loading = await interaction.reply({
        embeds: [loadingEmbed]
    })

    await axios.get("https://sorlion.lol/getimages").then(async r => {
        const images: {timestamp: string; src: string; id: string}[] = r.data
        const randomImage: number = await randomInRange(0, images.length - 1)
        const randomImageInstance = images[randomImage]
        let buffer: Buffer = Buffer.from(randomImageInstance.src.split(',')[1], 'base64')
        const file: AttachmentBuilder = new AttachmentBuilder("naum.png");
        file.setFile(buffer)
        return await interaction.editReply({
            embeds: [successEmbed],
            files: [file]
        })
    }).catch(async e => {
        console.log(e)
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