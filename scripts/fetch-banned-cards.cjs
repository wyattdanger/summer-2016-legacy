const fs = require('fs');
const https = require('https');

// List of banned cards - Legacy banlist as of July 2016
// Based on research of bans through September 2015 (Dig Through Time)
const bannedCardNames = [
  // Dexterity cards
  'Chaos Orb',
  'Falling Star',
  // Ante cards
  'Amulet of Quoz',
  'Bronze Tablet',
  'Contract from Below',
  'Darkpact',
  'Demonic Attorney',
  'Jeweled Bird',
  'Rebirth',
  'Tempest Efreet',
  'Timmerian Fiends',
  // Subgame card
  'Shahrazad',
  // Power 9
  'Ancestral Recall',
  'Black Lotus',
  'Mox Emerald',
  'Mox Jet',
  'Mox Pearl',
  'Mox Ruby',
  'Mox Sapphire',
  'Time Walk',
  'Timetwister',
  // Fast mana
  'Channel',
  'Fastbond',
  'Mana Crypt',
  'Mana Drain',
  'Mana Vault',
  'Sol Ring',
  // Powerful lands
  'Bazaar of Baghdad',
  'Library of Alexandria',
  'Strip Mine',
  'Tolarian Academy',
  // Tutors
  'Demonic Consultation',
  'Demonic Tutor',
  'Imperial Seal',
  'Mystical Tutor',
  'Tinker',
  'Vampiric Tutor',
  // Card draw / advantage
  'Dig Through Time', // Banned September 2015
  'Frantic Search',
  'Gush',
  'Memory Jar',
  'Necropotence',
  'Skullclamp',
  'Treasure Cruise', // Banned January 2015
  'Wheel of Fortune',
  'Windfall',
  "Yawgmoth's Bargain",
  // Combo pieces
  'Balance',
  'Earthcraft',
  'Flash', // Banned 2007
  'Goblin Recruiter',
  'Hermit Druid',
  'Mental Misstep', // Banned 2011
  'Mind Twist',
  "Mind's Desire",
  'Oath of Druids',
  'Survival of the Fittest', // Banned 2010
  'Time Vault',
  "Yawgmoth's Will"
];

function fetchCard(cardName) {
  return new Promise((resolve, reject) => {
    // Get oldest printing by using search with unique=prints and order=released
    // This ensures we get the actual first printing, not just the first card
    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(`!"${cardName}"`)}&unique=prints&order=released&dir=asc`;

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

      // Rate limit: wait 150ms between requests (max ~6 requests/sec, well under the 10/sec limit)
      await new Promise(resolve => setTimeout(resolve, 150));
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
