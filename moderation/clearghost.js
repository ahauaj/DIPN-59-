const Discord = require("discord.js");

module.exports = {
    name: "clearghost",
    usage: "clearghost <ID_utilisateur>",
    description: "Supprime tous les messages d'un utilisateur qui n'est plus sur le serveur.",
    async execute(client, message, args) {
        // Vérification des permissions
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("❌ Tu n'as pas la permission de gérer les messages.");
        }

        // Vérification de l'argument (ID utilisateur)
        if (!args[0] || isNaN(args[0])) {
            return message.reply("❌ Utilisation correcte : `clearghost <ID_utilisateur>`");
        }

        let userID = args[0];

        try {
            let deletedMessages = 0;

            // Récupérer les derniers messages du salon (max 100 à la fois)
            let messages = await message.channel.messages.fetch({ limit: 100 });

            // Filtrer les messages de l'utilisateur supprimé
            let userMessages = messages.filter(msg => msg.author.id === userID);

            while (userMessages.size > 0) {
                await message.channel.bulkDelete(userMessages, true);
                deletedMessages += userMessages.size;

                // Récupérer encore 100 messages
                messages = await message.channel.messages.fetch({ limit: 100 });
                userMessages = messages.filter(msg => msg.author.id === userID);
            }

            return message.reply(`✅ ${deletedMessages} messages supprimés de l'utilisateur **${userID}**.`);

        } catch (error) {
            console.error("❌ Erreur lors de la suppression :", error);
            return message.reply("❌ Impossible de supprimer les messages. Vérifie mes permissions.");
        }
    }
};