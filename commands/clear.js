export async function handleClearCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        
        const botMessages = messages.filter(msg => 
            msg.author.id === interaction.client.user.id && 
            msg.createdTimestamp > oneHourAgo
        );

        if (botMessages.size === 0) {
            await interaction.editReply({ 
                content: 'No bot messages found from the last hour.',
                ephemeral: true 
            });
            return;
        }

        await interaction.channel.bulkDelete(botMessages, true);

        await interaction.editReply({ 
            content: `Successfully deleted ${botMessages.size} bot message(s) from the last hour.`,
            ephemeral: true 
        });
    } catch (error) {
        console.error('Error clearing messages:', error);
        await interaction.editReply({ 
            content: 'There was an error clearing messages. Ensure that the messages are not older than 14 days.',
            ephemeral: true 
        });
    }
} 