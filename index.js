const fs = require('node:fs');
const path = require('node:path');
const config = require('dotenv').config();
const axios = require('axios');
const { ActivityType, Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const token = process.env.token
//const { token } = require('./config.json');
let guild = null;
const API = process.env.CRYPTO_API || 'https://api.crypto-api.com/api/';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, async () => {
	console.log('Ready!');
    const GUILD_ID = '1035489655296110592';
    guild =  client.guilds.cache.get(GUILD_ID).members.cache.find(member => member.id === client.user.id)
    client.user.setPresence({
        activities: [{ name: `empUP Price`, type: ActivityType.Watching }],
        status: 'active',
      }); 
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, guild);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function updatePrice() {
    console.log('getting price');
    await axios.get(API + 'up/price/emp').then(res => {
        data = res.data;
        price = formatter.format(toDec18(data.price));
        if (guild)
            guild.setNickname(price);
    })
}

client.login(token);

setTimeout(updatePrice, 30000); // wait 30 seconds to run it the first time
setInterval(updatePrice, 180000); // 3 minutes

function toDec18(num, decimals) {
    if (decimals)
      return num / (10 ** decimals);
    else
      return num / 1000000000000000000;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4, // ie $1.1234
  });
