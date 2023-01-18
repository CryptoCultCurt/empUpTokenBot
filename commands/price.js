const { SlashCommandBuilder } = require('discord.js');
const API = process.env.CRYPTO_API || 'https://api.crypto-api.com/api/';
const axios = require('axios');
const { Client, Collection, Events, GatewayIntentBits, messageLink, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
	data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Latest Price of the upEMP Token'),
	async execute(interaction, guild) {
        let price = 0;
        console.log(`getting price from ${API}`);
        await axios.get(API + 'up/price/emp').then(res => {
            data = res.data;
            price = formatter.format(toDec18(data.price));
            guild.setNickname(price);
            return interaction.reply(price);
        }).catch(err => { // server down or some other issue with API
            return interaction.reply('Sorry, an error has occured.');
        })
		
	},
};
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

 

