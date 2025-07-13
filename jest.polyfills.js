// jest.polyfills.js
require('cross-fetch');

// Add TextEncoder and TextDecoder polyfills
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Add TransformStream polyfill for MSW
if (typeof TransformStream === 'undefined') {
  const { TransformStream } = require('web-streams-polyfill');
  global.TransformStream = TransformStream;
}

// Mock BroadcastChannel for MSW
if (typeof BroadcastChannel === 'undefined') {
  class MockBroadcastChannel {
    constructor() {
      this.listeners = [];
    }
    postMessage() {}
    addEventListener(_, listener) {
      this.listeners.push(listener);
    }
    removeEventListener(_, listener) {
      this.listeners = this.listeners.filter(l => l !== listener);
    }
    close() {}
  }
  global.BroadcastChannel = MockBroadcastChannel;
}

// Ensure fetch API globals are available
const fetchGlobals = require('node-fetch');

// Set up Request, Response, and Headers globals
if (typeof Request === 'undefined') {
  global.Request = fetchGlobals.Request;
}

if (typeof Response === 'undefined') {
  global.Response = fetchGlobals.Response;
}

if (typeof Headers === 'undefined') {
  global.Headers = fetchGlobals.Headers;
}

// Ensure fetch is available globally
if (typeof fetch === 'undefined') {
  const fetch = require('node-fetch');
  global.fetch = fetch;
}
