# JustFocus Chrome Extension

A simple and effective Chrome extension to help you stay focused by blocking distracting websites. When you try to access a blocked site, you'll be redirected to a clean, distraction-free page.

## Features

- Block specific websites by domain name
- Quick access to common distracting sites (Facebook, Instagram, Twitter, etc.)
- Clean, distraction-free focus page
- Persistent blocking across browser sessions
- Easy to unblock sites when needed
- No timer or complex settings - just simple blocking

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Add custom sites by entering their domain (e.g., "facebook.com")
3. Check/uncheck common distracting sites from the list
4. When you try to access a blocked site, you'll be redirected to the focus page
5. To unblock a site, simply uncheck it from the list or remove it from the custom sites

## How It Works

- Uses Chrome's declarativeNetRequest API to block sites
- Stores your blocked sites list locally in your browser
- Persists your settings across browser sessions
- Works offline
- No data is sent to any servers

## Privacy

- All data is stored locally in your browser
- No tracking or analytics
- No external connections
- Your blocked sites list is private to your browser

## Development

The extension is built with vanilla JavaScript and uses Chrome's Extension APIs. The main components are:

- `manifest.json`: Extension configuration
- `background.js`: Handles site blocking logic
- `popup.html/js`: User interface for managing blocked sites
- `focus.html/js`: The page shown when accessing blocked sites
- `rules.json`: Dynamic rules for site blocking

## License

MIT License - feel free to use and modify as needed. 