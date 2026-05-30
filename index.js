import dotenv from 'dotenv'
dotenv.config()

import { ButtonBuilder, ButtonStyle, Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
});

const btn = new ButtonBuilder()
    .setCustomId('ammoChart')
    .setLabel('Ammo Chart')
    .setStyle(ButtonStyle.Primary)

client.login(process.env.DISCORD_TOKEN);

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ammochart') {
    await interaction.reply('Seen');
  }
})