#!/bin/bash

# Set your API endpoint URL
API_URL="http://localhost:3000/api/users/register"

# Admin user info
ADMIN_EMAIL="admin@example.com"
ADMIN_USERNAME="admin_user"
ADMIN_NAME="Admin User"

JSON_PAYLOAD=$(cat <<EOF
{
  "email": "$ADMIN_EMAIL",
  "username": "$ADMIN_USERNAME",
  "password": "Password123!",
  "name": "$ADMIN_NAME",
  "bio": "I am the system administrator",
  "role": "admin"
}
EOF
)

echo "Creating admin user: $ADMIN_USERNAME"

HTTP_STATUS=$(curl -s -o response.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$JSON_PAYLOAD" $API_URL)

if [ "$HTTP_STATUS" -eq 201 ]; then
  echo "✅ Admin created successfully!"
else
  echo "❌ Failed with status $HTTP_STATUS."
  echo "Response: $(cat response.json)"
fi

rm -f response.json