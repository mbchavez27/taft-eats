# Set your API endpoint URL
API_URL="http://localhost:3000/api/users/register"

echo "Starting bulk creation of 20 owners and restaurants with randomized data..."

PRICES=('$' '$$' '$$$' '$$$$')
TAGS=("Filipino" "Japanese" "Vegan" "Cafe" "Fast Food" "Seafood" "Dessert" "BBQ" "Fine Dining" "Halal" "Street Food" "Italian" "Spicy" "Family-Friendly" "Late Night")

for i in {1..20}
do
  USERNAME="owner_user_$i"
  EMAIL="owner$i@example.com"
  REST_NAME="Bulk Restaurant $i"
  REST_DESC="This is a randomly generated restaurant for testing filters."
  
  LAT="14.$((5500 + RANDOM % 100))"
  LONG="121.$((0200 + RANDOM % 100))"

  RANDOM_PRICE=${PRICES[$RANDOM % ${#PRICES[@]}]}
  RANDOM_TAG_1=${TAGS[$RANDOM % ${#TAGS[@]}]}
  RANDOM_TAG_2=${TAGS[$RANDOM % ${#TAGS[@]}]}

  # Add a location field
  LOCATION="Barangay $((RANDOM % 20 + 1)), Manila"

  JSON_PAYLOAD=$(cat <<EOF
{
  "email": "$EMAIL",
  "username": "$USERNAME",
  "password": "Password123!",
  "name": "Owner $i",
  "bio": "I am the proud owner of restaurant $i",
  "role": "owner",
  "restaurantName": "$REST_NAME",
  "restaurantDescription": "$REST_DESC",
  "latitude": $LAT,
  "longitude": $LONG,
  "location": "$LOCATION",
  "price_range": "$RANDOM_PRICE",
  "restaurantBanner": "https://example.com/banner$i.jpg",
  "tags": [
    { "id": 0, "label": "$RANDOM_TAG_1" },
    { "id": 0, "label": "$RANDOM_TAG_2" }
  ]
}
EOF
)

  echo "Creating: $REST_NAME | Price: $RANDOM_PRICE | Tags: $RANDOM_TAG_1, $RANDOM_TAG_2 | Location: $LOCATION"

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