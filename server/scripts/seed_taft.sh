#!/bin/bash

# Set your API endpoint URL
API_URL="http://localhost:3000/api/users/register"

echo "Starting bulk creation of 20 Taft Avenue restaurants with ACCURATE tags and cuisines..."

# Array mapping: 'Restaurant Name | Price | Tag 1 | Tag/Cuisine 2'
RESTAURANTS_DATA=(
  'La Toca|$$|Italian|Pasta'
  'El Poco Cantina|$$|Spicy|Tacos'
  'Jollibee|$|Fast Food|Chicken'
  'McDonalds|$|Fast Food|Burgers'
  'The Barn|$$|Late Night|Burgers'
  'Ersao|$$|Fast Food|Spicy'
  'Piccolino|$$|Italian|Pizza'
  'Top Side|$$|Filipino|Fries'
  '24 Chicken|$$|Late Night|Chicken'
  'Ate Ricas Bacsilog|$|Street Food|Fast Food'
  'Dixies|$$|Filipino|Chicken'
  'Zarks Burger|$$|Fast Food|Burgers'
  'Kanto Freestyle Breakfast|$$|Filipino|Late Night'
  'Angrydobo|$$|Filipino|Fast Food'
  'Tinuhog ni Benny|$|BBQ|Street Food'
  'Chomp Chomp|$$|Spicy|Fast Food'
  'Tori Box|$|Japanese|Chicken'
  'Arabic House|$$|Halal|Spicy'
  'Crepeman|$$|Dessert|Cake'
  'Auro Chocolate Cafe|$$$|Cafe|Cake'
)

# Loop through the array
for i in "${!RESTAURANTS_DATA[@]}"
do
  INDEX=$((i + 1))
  
  # Split the string by the pipe | character to get exact values
  IFS='|' read -r REST_NAME EXACT_PRICE EXACT_TAG_1 EXACT_TAG_2 <<< "${RESTAURANTS_DATA[$i]}"
  
  # Changed email prefix to 'taft_v4' to avoid 409 duplicates from the ones that succeeded
  USERNAME="taft_v4_owner_$INDEX"
  EMAIL="taft_v4_owner$INDEX@example.com"
  REST_DESC="This is $REST_NAME, a popular spot around Taft Avenue for students and locals."
  
  # Adjusted coordinates to be roughly around Taft Ave / Malate area
  LAT="14.56$((RANDOM % 90))"
  LONG="120.99$((RANDOM % 90))"

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
  "price_range": "$EXACT_PRICE",
  "restaurantBanner": "https://example.com/banner$INDEX.jpg",
  "tags": [
    { "id": 0, "label": "$EXACT_TAG_1" },
    { "id": 0, "label": "$EXACT_TAG_2" }
  ]
}
EOF
)

  echo "Creating: $REST_NAME | Price: $EXACT_PRICE | Tags: $EXACT_TAG_1, $EXACT_TAG_2"

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