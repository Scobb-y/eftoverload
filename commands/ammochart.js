import { SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('ammochart')
    .setDescription("Displays Tarkov Ammo Chart"),
  async execute(interaction) {
    await interaction.reply('Seen');
  }
};