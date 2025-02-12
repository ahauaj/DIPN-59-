
module.exports = {
    name: "clearghost",
    description: "Supprime les messages récents d'un utilisateur sur tout le serveur.",
    usage: "clearghost <ID_utilisateur> <nombre>",
    async execute(client, message, args) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("❌ Tu n'as pas la permission de gérer les messages.");
        }

        let userID = args[0];
        let limit = parseInt(args[1]) || 100; // Par défaut, supprimer 100 messages

        if (!userID || isNaN(limit) || limit <= 0) {
            return message.reply("❌ Utilisation : `!clearghost <ID_utilisateur> <nombre>`");
        }

        let totalDeleted = 0;

        try {
            const textChannels = message.guild.channels.cache.filter(c => c.type === 0); // Récupère tous les salons textuels

            for (const [channelID, channel] of textChannels) {
                let deletedMessages = 0;
                let fetchedMessages;

                do {
                    fetchedMessages = await channel.messages.fetch({ limit: 100 }).catch(() => null);
                    if (!fetchedMessages) break;

                    let userMessages = fetchedMessages.filter(m => m.author.id === userID).first(limit - totalDeleted);
                    if (userMessages.length === 0) break;

                    await channel.bulkDelete(userMessages, true);
                    deletedMessages += userMessages.length;
                    totalDeleted += userMessages.length;

                } while (fetchedMessages.size > 0 && totalDeleted < limit);

                if (totalDeleted >= limit) break;
            }

            if (totalDeleted > 0) {
                message.channel.send(`✅ **${totalDeleted} messages** de l'utilisateur **${userID}** ont été supprimés sur le serveur.`);
            } else {
                message.reply("❌ Aucun message récent trouvé pour cet utilisateur.");
            }
        } catch (error) {
            console.error("❌ Erreur :", error);
            message.reply("❌ Impossible de supprimer tous les messages. Discord impose des restrictions.");
        }
    }
};