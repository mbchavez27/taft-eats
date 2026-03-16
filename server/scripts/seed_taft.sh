#!/bin/bash

# Set your API endpoint URL
API_URL="http://localhost:3000/api/users/register"

echo "Starting bulk creation of 20 Taft Avenue restaurants..."

# Array of 20 legit establishments around Taft Ave
RESTAURANTS=(
  "La Toca"
  "El Poco Cantina"
  "Jollibee"
  "McDonald's"
  "The Barn"
  "Ersao"
  "Piccolino"
  "Top Side"
  "24 Chicken"
  "Ate Rica's Bacsilog"
  "Dixie's"
  "Zark's Burgers"
  "Kanto Freestyle Breakfast"
  "Angrydobo"
  "Tinuhog ni Benny"
  "Chomp Chomp"
  "Tori Box"
  "Arabic House"
  "Crepeman"
  "Auro Chocolate Cafe"
)

PRICES=('$' '$$' '$$$' '$$$$')
TAGS=("Filipino" "Japanese" "Vegan" "Cafe" "Fast Food" "Seafood" "Dessert" "BBQ" "Fine Dining" "Halal" "Street Food" "Italian" "Spicy" "Family-Friendly" "Late Night")

# Loop from 0 to 19 to match the array indices
for i in {0..19}
do
  INDEX=$((i + 1))
  REST_NAME="${RESTAURANTS[$i]}"
  USERNAME="taft_owner_$INDEX"
  EMAIL="taft_owner$INDEX@example.com"
  REST_DESC="This is $REST_NAME, a popular spot around Taft Avenue for students and locals."
  
  # Adjusted coordinates to be roughly around Taft Ave / Malate area
  LAT="14.56$((RANDOM % 90))"
  LONG="120.99$((RANDOM % 90))"

  RANDOM_PRICE=${PRICES[$RANDOM % ${#PRICES[@]}]}
  RANDOM_TAG_1=${TAGS[$RANDOM % ${#TAGS[@]}]}
  RANDOM_TAG_2=${TAGS[$RANDOM % ${#TAGS[@]}]}

  # Set location to Taft
  LOCATION="Taft Avenue, Manila"

  JSON_PAYLOAD=$(cat <<EOF
{
  "email": "$EMAIL",
  "username": "$USERNAME",
  "password": "Password123!",
  "name": "Owner $INDEX",
  "bio": "I am the proud owner of $REST_NAME",
  "role": "owner",
  "restaurantName": "$REST_NAME",
  "restaurantDescription": "$REST_DESC",
  "latitude": $LAT,
  "longitude": $LONG,
  "location": "$LOCATION",
  "price_range": "$RANDOM_PRICE",
  "restaurantBanner": "https://example.com/banner$INDEX.jpg",
  "tags": [
    { "id": 0, "label": "$RANDOM_TAG_1" },
    { "id": 0, "label": "$RANDOM_TAG_2" }
  ]
}
EOF
)

  echo "Creating: $REST_NAME | Price: $RANDOM_PRICE | Tags: $RANDOM_TAG_1, $RANDOM_TAG_2"

  HTTP_STATUS=$(curl -s -o response.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$JSON_PAYLOAD" $API_URL)

  if [ "$HTTP_STATUS" -eq 201 ]; then
    echo "  ✅ Success!"
  else
    echo "  ❌ Failed with status $HTTP_STATUS."
    echo "  Response: $(cat response.json)"
  fi

  sleep 0.2
done

rm -f response.json
echo "Bulk creation script finished."