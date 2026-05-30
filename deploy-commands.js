import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import 'dotenv/config';

const commands = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands },
  );

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
