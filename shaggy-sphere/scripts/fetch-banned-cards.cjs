const fs = require('fs');
const https = require('https');

// List of banned cards - from the banlist in the HTML
const bannedCardNames = [
  'Ancestral Recall',
  'Balance',
  'Bazaar of Baghdad',
  'Black Lotus',
  'Bronze Tablet',
  'Channel',
  'Chaos Orb',
  'Contract from Below',
  'Darkpact',
  'Demonic Consultation',
  'Earthcraft',
  'Falling Star',
  'Fastbond',
  'Goblin Recruiter',
  'Hermit Druid',
  'Imperial Seal',
  'Jeweled Bird',
  'Library of Alexandria',
  'Mana Crypt',
  'Mana Vault',
  'Mind Twist',
  "Mind's Desire",
  'Mox Emerald',
  'Mox Jet',
  'Mox Pearl',
  'Mox Ruby',
  'Mox Sapphire',
  'Rebirth',
  'Shahrazad',
  'Skullclamp',
  'Sol Ring',
  'Strip Mine',
  'Survival of the Fittest',
  'Tempest Efreet',
  'Time Walk',
  'Timmerian Fiends',
  'Timetwister',
  'Vampiric Tutor',
  'Windfall',
  "Yawgmoth's Bargain",
  "Yawgmoth's Will"
];

function fetchCard(cardName) {
  return new Promise((resolve, reject) => {
    // Get oldest printing by using search with order=released
    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(`!"${cardName}"`)}&order=released&dir=asc`;

    const options = {
      headers: {
        'User-Agent': 'Pre-Brexit-Legacy/1.0',
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          // Get the first card (oldest printing)
          if (result.data && result.data.length > 0) {
            resolve(result.data[0]);
          } else {
            reject(new Error(`No results for ${cardName}`));
          }
        } else {
          console.error(`Status ${res.statusCode} for ${cardName}: ${data}`);
          reject(new Error(`Failed to fetch ${cardName}: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function fetchAllBannedCards() {
  const cards = [];

  for (const cardName of bannedCardNames) {
    try {
      console.log(`Fetching ${cardName}...`);
      const card = await fetchCard(cardName);

      cards.push({
        name: card.name,
        image_uri: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal,
        scryfall_uri: card.scryfall_uri,
        set: card.set,
        set_name: card.set_name,
        collector_number: card.collector_number
      });

      // Rate limit: wait 200ms between requests (max 5 requests/sec)
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching ${cardName}:`, error.message);
    }
  }

  return cards;
}

async function main() {
  console.log('Fetching banned cards from Scryfall...');
  const cards = await fetchAllBannedCards();

  const outputPath = './src/data/banned-cards.json';
  fs.writeFileSync(outputPath, JSON.stringify(cards, null, 2));

  console.log(`\nSaved ${cards.length} banned cards to ${outputPath}`);
}

main().catch(console.error);
