# WhatsSummarize Chrome Extension

POC Implementation for WhatsApp Web integration via Chrome extension.

## Features

- Extract chat messages from WhatsApp Web
- Send conversations to WhatsSummarize for AI summarization
- Secure authentication with WhatsSummarize account
- Real-time status indicator

## Installation (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `apps/chrome-extension` directory

## Usage

1. Open [WhatsApp Web](https://web.whatsapp.com)
2. Log in to your WhatsApp account
3. Click the WhatsSummarize extension icon
4. Sign in with your WhatsSummarize account
5. Navigate to any chat
6. Click "Extract Current Chat" or use the floating button

## Development

### Project Structure

```
apps/chrome-extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup/
│   ├── popup.html        # Extension popup UI
│   └── popup.js          # Popup functionality
├── src/
│   ├── background.js     # Service worker
│   ├── content.js        # WhatsApp Web content script
│   └── content.css       # Content script styles
└── icons/                # Extension icons (TODO: add)
```

### Building for Production

TODO: Add build process for:
- Icon generation (16, 32, 48, 128px)
- Minification
- Source map generation
- Chrome Web Store packaging

## Security Considerations

- All data is transmitted securely over HTTPS
- Authentication tokens stored in `chrome.storage.local`
- No data is stored without user consent
- Content script only activates on WhatsApp Web

## TODO: Production Hardening

- [ ] Add proper icons
- [ ] Implement secure token refresh
- [ ] Add offline queuing
- [ ] Implement proper error handling
- [ ] Add user consent flows
- [ ] Chrome Web Store listing
- [ ] Firefox/Edge versions
