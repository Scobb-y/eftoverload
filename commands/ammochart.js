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
    ).addStringOption(option =>
      option
      .setName('type')
      .setDescription('Example: BS, BP, 7N40')
      .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const caliberQuery = interaction.options.getString('caliber');
    const typeQuery = interaction.options.getString('type');

    const query = `
      {
        ammo {
          caliber
          damage
          penetrationPower
          fragmentationChance
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

      const match = ammoList.filter(a => {
        const name = a?.item?.name?.toLowerCase() ?? "";

        const caliberMatch = name.includes(caliberQuery.toLowerCase());
        const typeMatch = typeQuery
          ? name.includes(typeQuery.toLowerCase())
          : true;

        return caliberMatch && typeMatch;
      });

      
      match.sort((a,b) => b.penetrationPower - a.penetrationPower);

      if (match.length === 0) {
        return interaction.editReply(`No matching ammo types for **${caliberQuery}**`);
      }

      let table = "```";
      table += "Name                 DMG   PEN   Frag %\n";
      table += match.map(a =>
        `${a.item.name.slice(0,17).padEnd(20)} ${String(a.damage).padEnd(5)} ${String(a.penetrationPower).padEnd(5)} ${a.fragmentationChance*100}`
      ).join("\n");
      table += "```";

      await interaction.editReply(table);



    } catch (error) {
      await interaction.editReply(`Encountered an unexpected error: ${error.message}`);
    }
  }
};
