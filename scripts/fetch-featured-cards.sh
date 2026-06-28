#!/bin/bash

# Featured cards for Summer 2016 Legacy
cards=(
  "Gitaxian Probe"
  "Sensei's Divining Top"
  "Deathrite Shaman"
)

# Start JSON array
echo "[" > src/data/featured-cards.json

count=0
total=${#cards[@]}

for card in "${cards[@]}"; do
  count=$((count + 1))
  echo "Fetching ($count/$total): $card"

  # Fetch card data - search for oldest printing
  encoded=$(echo "$card" | sed 's/ /%20/g' | sed "s/'/%27/g")
  data=$(curl -s -H "User-Agent: Pre-Brexit-Legacy/1.0" -H "Accept: application/json" \
    "https://api.scryfall.com/cards/search?q=!%22${encoded}%22&order=released&dir=asc&unique=prints")

  # Extract fields from first result (oldest printing)
  name=$(echo "$data" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
  image_uri=$(echo "$data" | grep -o '"normal":"[^"]*"' | head -1 | cut -d'"' -f4)
  scryfall_uri=$(echo "$data" | grep -o '"scryfall_uri":"[^"]*"' | head -1 | cut -d'"' -f4)
  set=$(echo "$data" | grep -o '"set":"[^"]*"' | head -1 | cut -d'"' -f4)
  set_name=$(echo "$data" | grep -o '"set_name":"[^"]*"' | head -1 | cut -d'"' -f4)

  # Add to JSON
  if [ $count -lt $total ]; then
    comma=","
  else
    comma=""
  fi

  cat >> src/data/featured-cards.json <<CARDEOF
  {
    "name": "$name",
    "image_uri": "$image_uri",
    "scryfall_uri": "$scryfall_uri",
    "set": "$set",
    "set_name": "$set_name"
  }$comma
CARDEOF

  # Rate limit: wait 1 second between requests
  if [ $count -lt $total ]; then
    sleep 1
  fi
done

# Close JSON array
echo "]" >> src/data/featured-cards.json

echo "Done! Saved $count cards to src/data/featured-cards.json"
