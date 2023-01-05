const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

const DISCORD_BOT_TOKEN = 'YOUR_DISCORD_BOT_TOKEN';
const DISCORD_CHANNEL_ID = 'YOUR_DISCORD_CHANNEL_ID';
const GITHUB_REPO_URL = 'https://github.com/USERNAME/REPO_NAME';

let previousCommitSHA = null;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(DISCORD_BOT_TOKEN);

setInterval(checkForNewCommit, 60 * 1000);

async function checkForNewCommit() {
  try {
    const response = await axios.get(`${GITHUB_REPO_URL}/commits`);

    const latestCommit = response.data[0];
    const latestCommitSHA = latestCommit.sha;
    const latestCommitMessage = latestCommit.commit.message;
    const previousCommitSHA = await getPreviousCommitSHA();

    if (latestCommitSHA !== previousCommitSHA) {
      await saveLatestCommitSHA(latestCommitSHA);

      const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
      const message = `New commit in repository: ${GITHUB_REPO_URL}\nCommit SHA: ${latestCommitSHA}\nCommit message: ${latestCommitMessage}`;

      channel.send(message);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getPreviousCommitSHA() {
  return previousCommitSHA;
}

async function saveLatestCommitSHA(latestCommitSHA) {
  previousCommitSHA = latestCommitSHA;
}
