#!/bin/bash
# Script to send bot information to local server

API_URL="${BOT_INFO_URL:?BOT_INFO_URL must be set}"
BOT_INFO_JSON=$(curl -s "${BOT_INFO_SOURCE_URL:-http://localhost:3000/bot-info}") # Fetch bot info from local service

# Send bot info to local server
curl -X POST -H "Content-Type: application/json" -d "$BOT_INFO_JSON" "$API_URL"

