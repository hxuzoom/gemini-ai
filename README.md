# Discord Gemini AI Bot

A Discord bot powered by Google's Gemini AI that can answer questions and analyze images through simple slash commands.

## Features

- **Text-based AI Responses**: Ask questions and get intelligent responses from Gemini AI
- **Image Analysis**: Upload images along with questions for AI-powered visual analysis
- **Message Management**: Clear bot messages from the last hour with a simple command
- **Automatic Welcome Message**: Sends a detailed welcome message with usage instructions when added to a new server

## Commands

- `/gemini question:[your question] image:[optional image]` - Ask Gemini AI a question, optionally including an image for analysis
- `/clear` - Remove bot messages from the last hour in the current channel

## Setup

1. **Prerequisites**
   - Node.js (v16.9.0 or higher)
   - npm (Node Package Manager)
   - A Discord Bot Token
   - A Google Gemini API Key

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd discord-gemini-bot

   # Install dependencies
   npm install
   ```

3. **Configuration**
   Create a `.env` file in the root directory with the following:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Optional Setup**
   - Place a welcome banner image at `images/image.png` for the welcome message
   - The image will be displayed when the bot joins a new server

5. **Running the Bot**
   ```bash
   npm start
   ```

## Dependencies

- discord.js - Discord API wrapper
- @google/generative-ai - Google's Gemini AI API
- dotenv - Environment variable management
- node-fetch - Fetch API for Node.js

## Bot Permissions

The bot requires the following Discord permissions:
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Manage Messages (for clearing messages)
- Use Slash Commands

## Error Handling

- The bot includes comprehensive error handling for API failures
- Fallback mechanisms for welcome messages if image loading fails
- Message size handling with automatic splitting for large responses

## Notes

- Messages older than 14 days cannot be bulk deleted (Discord limitation)
- Image analysis supports PNG, JPG, JPEG, and GIF formats
- Large responses are automatically split into multiple messages
- The bot requires proper permissions in the channels it operates in

## Support

For issues, questions, or contributions, please:
1. Check the existing issues on the repository
2. Create a new issue if needed
3. Contact the server administrators for server-specific problems

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Note: This project uses the Google Gemini API which has its own terms of service and usage restrictions. Please refer to [Google's Gemini API Terms of Service](https://ai.google.dev/terms) for more information. 

PS: This is my first time creating a discord bot so there might be some mess-ups, but it is what it is.
