import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { handleGeminiCommand } from './commands/gemini.js';
import { handleClearCommand } from './commands/clear.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('GatewayIntentBits:', GatewayIntentBits);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

const commands = [
    new SlashCommandBuilder()
        .setName('gemini')
        .setDescription('Ask Gemini AI a question (can include an image)')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to ask')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Optional image to analyze')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear bot messages from the specified time period')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time period to clear messages from')
                .setRequired(true)
                .addChoices(
                    { name: '15 minutes', value: '15' },
                    { name: '30 minutes', value: '30' },
                    { name: '1 hour', value: '60' }
                ))
];

client.on('guildCreate', async guild => {
    const channel = guild.channels.cache.find(
        channel => channel.type === 0 && channel.permissionsFor(guild.members.me).has('SendMessages')
    );

    if (!channel) return;

    try {
        const imagePath = join(__dirname, 'images', 'image.png');
        console.log('Attempting to load image from:', imagePath);

        const welcomeImage = new AttachmentBuilder(imagePath, { 
            name: 'image.png',
            description: 'Welcome banner for Gemini AI Bot'
        });

        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('👋 Hello! I\'m Gemini AI Bot')
            .setDescription('Thank you for adding me to your server! I\'m powered by Google\'s Gemini AI and I\'m here to help answer your questions.')
            .setImage('attachment://image.png')
            .addFields(
                { 
                    name: '🤔 How to Use Me', 
                    value: 'Use the `/gemini` command followed by your question. You can also include an image for analysis!' 
                },
                {
                    name: '📝 Text Questions',
                    value: '`/gemini question:What is the capital of France?`'
                },
                {
                    name: '🖼️ Image Analysis',
                    value: '`/gemini question:What\'s in this image? image:[Upload or drag & drop an image]`'
                },
                {
                    name: '💡 Tips',
                    value: [
                        '• Be specific with your questions for better results',
                        '• For image analysis, make sure the image is clear and relevant',
                        '• You can ask follow-up questions about the same topic',
                        '• The bot supports most image formats (PNG, JPG, JPEG, GIF)',
                    ].join('\n')
                },
                {
                    name: '⚠️ Important Notes',
                    value: [
                        '• Responses are generated by AI and may not always be 100% accurate',
                        '• Large responses will be split into multiple messages',
                        '• Image analysis may take a few seconds to process',
                    ].join('\n')
                }
            )
            .setFooter({ text: 'For additional help or issues, contact the server administrators.' })
            .setTimestamp();

        await channel.send({ 
            embeds: [welcomeEmbed],
            files: [welcomeImage]
        });
    } catch (error) {
        console.error('Error sending welcome message:', error);
        try {
            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('👋 Hello! I\'m Gemini AI Bot')
                .setDescription('Thank you for adding me to your server! I\'m powered by Google\'s Gemini AI and I\'m here to help answer your questions.')
                .addFields(
                    { 
                        name: '🤔 How to Use Me', 
                        value: 'Use the `/gemini` command followed by your question. You can also include an image for analysis!' 
                    },
                    {
                        name: '📝 Text Questions',
                        value: '`/gemini question:What is the capital of France?`'
                    },
                    {
                        name: '🖼️ Image Analysis',
                        value: '`/gemini question:What\'s in this image? image:[Upload or drag & drop an image]`'
                    },
                    {
                        name: '💡 Tips',
                        value: [
                            '• Be specific with your questions for better results',
                            '• For image analysis, make sure the image is clear and relevant',
                            '• You can ask follow-up questions about the same topic',
                            '• The bot supports most image formats (PNG, JPG, JPEG, GIF)',
                        ].join('\n')
                    },
                    {
                        name: '⚠️ Important Notes',
                        value: [
                            '• Responses are generated by AI and may not always be 100% accurate',
                            '• Large responses will be split into multiple messages',
                            '• Image analysis may take a few seconds to process',
                        ].join('\n')
                    }
                )
                .setFooter({ text: 'For additional help or issues, contact the server administrators.' })
                .setTimestamp();

            await channel.send({ embeds: [welcomeEmbed] });
        } catch (fallbackError) {
            console.error('Error sending fallback message:', fallbackError);
        }
    }
});

client.once('ready', async () => {
    console.log('Bot is ready!');
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    try {
        if (interaction.commandName === 'gemini') {
            await handleGeminiCommand(interaction);
        } else if (interaction.commandName === 'clear') {
            await handleClearCommand(interaction);
        }
    } catch (error) {
        console.error('Error handling command:', error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
