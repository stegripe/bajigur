# WhatsApp Sticker Bot

Simple WhatsApp bot for creating stickers from images sent or quoted from chat or groups

## Required things

-   A virtual machine/server with a LTS version of Node.JS
-   WhatsApp account already logged in on your smartphone

## Configuration

### How to change the prefix or the timezone?

[Docs for timezone](https://momentjs.com/timezone/docs/#/using-timezones)

```js
module.exports = {
timezone: "Asia/Jakarta", // example <Continet/Timezone>
prefix: "#" // if could be anything. example: "!", "," and "++"...
}
```

## Usage guide

1. Clone this repository
2. Install all required packages by typing
```bash
npm install
```
then
```bash
node .
```
3. Scan the QR code that appear on your console with your WhatsApp
4. The bot should be up and running.

> Add this bot in a group or chat directly to the number and send an image attachments with the caption #sticker then the image will turn into a sticker, you can also quote a picture from someone in the group!

> If you are using Ubuntu and find some error, try install some depencies below
```
$ sudo apt install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
```