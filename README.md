# Telegram bot: trackLife

My Telegram Event Bot is a Node.js-based Telegram bot that allows you to track various events and activities in your life. You can categorize and record these events, such as drinking water or tracking how many times you play the guitar. 

This bot was created not only for personal use, as a tool to track personal activities, but also as a learning experience to explore Node.js and MongoDB. It was developed with the assistance of ChatGPT to help facilitate the development process and expand the my knowledge.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Commands](#commands)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This Telegram bot, built using Node.js, Mongoose, and Telegraf, enables you to easily record and categorize events or activities in your life. Whether it's tracking your daily water intake or recording how often you play your guitar, this bot can help you manage and organize your activities by populating a database with the data you input.

## Features

- **Event Logging:** Record various events or activities.
- **Categorization:** Categorize events into different categories for better organization.
- **Timestamps:** Automatically capture the start and, if you want, the end times of events.
- **Multilingual Support:** Use commands like `/en` and `/it` to switch between English and Italian.
- **Edit Messages:** Edited Telegram messages are ignored.
- **Number Messages:** Messages consisting only of numbers will be rejected.
- **User Access Control:** You need to add your user to the database for access. It's not open for everyone (right now).
- **Category Buttons:** All written categories are converted into buttons and replaced in the keyboard. The buttons are also ordered based on their usage in the last month, with the most frequently used category appearing first.

## Commands

- `/start`: Start the bot.
- `/help`: Get instructions on how to use the bot.
- `/en`: Switch to English language mode.
- `/it`: Switch to Italian language mode.

## Buttons
- `Category`: Use buttons to add an event for a specific category.
- `Delete Event`: Delete the last recorded event.
- `Until Now`: Automatically set the end time of the last event.
- `List Category`: List all available categories.
- `See logs`: This option is available only to administrators, allowing them to download the log file.
- Example messages:
  - "drink": Add an event in the "drink" category starting now.
  - "health.drink": Add an event in the "drink" category under the "health" parent category.
  - "guitar 10": Record a 10-minute guitar session starting 10 minutes ago.

## Getting Started

To get started with the Telegram Event Bot, follow these steps:

1. Clone this repository.
2. Install the required dependencies using `npm install`.
3. Create a Telegram bot and obtain the API token.
4. Create a file named `config.env` in the root directory of the project.
5. In `config.env`, specify the following variables and replace them with your actual values:

   ```
   # Telegram Bot Token
   TELEGRAM_TOKEN=your_bot_token_here

   # Database User
   DATABASE_USER=your_database_username_here

   # Database Password
   DATABASE_PASS=your_database_password_here

   # Database URL
   DATABASE_URL=your_database_url_here

   # Log File Path
   LOG_FILE_PATH=your_log_file_path_here
6. Add your user to the database for access control. You can do this by running the following MongoDB query, replacing `*chatId number*` and `*username*` with the appropriate values. You can obtain these values from some Telegram bot.

   ```javascript
   db.users.insertOne({
     idTelegram: *chatId number*,
     username: '*username*',
     language: 'en', // You can change the language if needed in 'it'
     role: 'ADMIN'
   })
7. Run the bot using `npm start`.

## License
This project is released under the [Unlicense](LICENSE).
