module.exports = {
    name: "softban",
    description: "Bannir et débannir un utilisateur pour supprimer ses messages récents.",
    usage: "softban <ID_utilisateur>",
    async execute(client, message, args) {
        // Vérifier les permissions
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.reply("❌ Vous n'avez pas la permission de bannir des membres.");
        }

        // Vérifier si l'ID de l'utilisateur est fourni
        const userID = args[0];
        if (!userID) {
            return message.reply("❌ Veuillez fournir l'ID de l'utilisateur à bannir.");
        }

        try {
            // Bannir l'utilisateur en supprimant ses messages des 7 derniers jours
            await message.guild.members.ban(userID, { days: 7, reason: 'Suppression des messages récents' });
            message.reply(`✅ L'utilisateur avec l'ID ${userID} a été banni et ses messages récents ont été supprimés.`);

            // Débannir l'utilisateur immédiatement
            await message.guild.members.unban(userID, 'Réintégration après softban');
            message.channel.send(`✅ L'utilisateur avec l'ID ${userID} a été débanni.`);
        } catch (error) {
            console.error("❌ Erreur lors du softban :", error);
            message.reply("❌ Impossible de bannir ou débannir l'utilisateur. Vérifiez que l'ID est correct et que j'ai les permissions nécessaires.");
        }
    }
};