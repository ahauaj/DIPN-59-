module.exports = {
    name: "deluser",
    description: "Supprime manuellement un certain nombre de messages d'un utilisateur",
    usage: "deluser <ID_utilisateur> <Nombre>",
    async execute(client, message, args) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("❌ Tu n'as pas la permission de gérer les messages.");
        }

        let userID = args[0];
        let limit = parseInt(args[1]);

        if (!userID || isNaN(limit) || limit <= 0) {
            return message.reply("❌ Utilisation : `!deluser <ID_utilisateur> <Nombre>`");
        }

        try {
            let messages = await message.channel.messages.fetch({ limit: 100 });
            let userMessages = messages.filter(m => m.author.id === userID).first(limit);

            if (userMessages.length === 0) {
                return message.reply("❌ Aucun message récent de cet utilisateur trouvé.");
            }

            for (let msg of userMessages) {
                await msg.delete();
            }

            message.channel.send(`✅ ${userMessages.length} messages de l'utilisateur **${userID}** supprimés.`);
        } catch (error) {
            console.error("❌ Erreur :", error);
            message.reply("❌ Impossible de supprimer les messages. Discord impose des limites.");
        }
    }
};