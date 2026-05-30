import { SlashCommandBuilder } from 'discord.js'
import fetch from 'node-fetch'

export default {
  data: new SlashCommandBuilder()
    .setName('ammochart')
    .setDescription("Displays Tarkov Ammo Chart")
    .addStringOption(option =>
      option
        .setName('caliber')
        .setDescription('Example: 5.56x45')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const caliberQuery = interaction.options.getString('caliber');

    const query = `
      {
        ammo {
          caliber
          damage
          penetrationPower
          item {
            name
          }
        }
      }
    `;

    try {
      const response = await fetch("https://api.tarkov.dev/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      const ammoList = data.data.ammo;

      const match = ammoList.filter(a =>
        a.item.name.toLowerCase().includes(caliberQuery.toLowerCase())
      );

      if (match.length === 0) {
        return interaction.editReply(`No matching ammo types for **${caliberQuery}**`);
      }

      let output = `**Ammo for caliber ${caliberQuery}:**\n\n`;

      for (const a of match) {
        output += `• **${a.item.name}** — Damage: ${a.damage}, Pen: ${a.penetrationPower}\n`;
      }

      await interaction.editReply(output);

    } catch (error) {
      await interaction.editReply(`Encountered an unexpected error: ${error.message}`);
    }
  }
};
