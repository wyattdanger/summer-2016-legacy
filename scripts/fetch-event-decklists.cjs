const https = require('https');

const events = [
  { name: 'GP Prague', eventId: '12671' },
  { name: 'GP Columbus', eventId: '12681' },
  { name: 'SCG Worcester', eventId: '12947' },
  { name: 'Bazaar of Moxen - Strasbourg', eventId: '12908' },
  { name: 'SCG Dallas', eventId: '12863' },
  { name: 'BoM Annecy', eventId: '12303' },
  { name: 'MKM Frankfurt', eventId: '12433' },
  { name: 'SCG Indianapolis', eventId: '12443' }
];

function fetchEventPage(eventId) {
  return new Promise((resolve, reject) => {
    const url = `https://mtgtop8.com/event?e=${eventId}&f=LE`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Failed to fetch event ${eventId}: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

function extractDecklists(html) {
  const decklists = [];

  // Match deck links in the format: event?e=XXXXX&d=YYYYY&f=LE">Player Name</a>
  // The pattern captures player name and deck from the table structure
  const deckPattern = /event\?e=\d+&d=(\d+)&f=LE">([^<]+)<\/a>.*?<a[^>]*>([^<]+)<\/a>/gs;

  let match;
  while ((match = deckPattern.exec(html)) !== null) {
    const [, deckId, playerName, deckType] = match;
    if (playerName && deckType && deckId) {
      decklists.push({
        player: playerName.trim(),
        deck: deckType.trim(),
        id: deckId
      });
    }
  }

  return decklists.slice(0, 8); // Top 8 only
}

async function main() {
  console.log('Fetching Top 8 decklists from all events...\n');

  const allEvents = [];

  for (const event of events) {
    try {
      console.log(`Fetching ${event.name} (e=${event.eventId})...`);
      const html = await fetchEventPage(event.eventId);
      const decklists = extractDecklists(html);

      allEvents.push({
        name: event.name,
        eventId: event.eventId,
        decklists
      });

      console.log(`  Found ${decklists.length} decklists`);

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error fetching ${event.name}:`, error.message);
    }
  }

  console.log('\n=== RESULTS ===\n');

  for (const event of allEvents) {
    console.log(`\n${event.name} (e=${event.eventId}):`);
    event.decklists.forEach((deck, idx) => {
      console.log(`  ${idx + 1}. ${deck.player} - ${deck.deck} (d=${deck.id})`);
    });
  }

  // Output as JSON for easy copying
  console.log('\n\n=== JSON OUTPUT ===\n');
  console.log(JSON.stringify(allEvents, null, 2));
}

main().catch(console.error);
