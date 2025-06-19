# text-scrambler.js

[![CI](https://github.com/tizee/text-scrambler.js/actions/workflows/ci.yml/badge.svg)](https://github.com/tizee/text-scrambler.js/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/text-scrambler.js.svg)](https://www.npmjs.com/package/text-scrambler.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/text-scrambler.js.svg)](https://bundlephobia.com/package/text-scrambler.js)
![last commit](https://img.shields.io/github/last-commit/tizee/text-scrambler.js/main)

A lightweight, performant JavaScript library for creating text scramble animations. Smoothly reveal or dissolve text with customizable scramble effects.

## Features

- 🚀 **Performant**: Uses `requestAnimationFrame` and optimized DOM operations
- 🎨 **Customizable**: Control animation duration, symbols, direction, and more
- 📦 **Lightweight**: Minimal dependencies and small bundle size
- 🔄 **Bidirectional**: Support for both reveal and dissolve animations
- 🌐 **Universal**: Works in all modern browsers
- 📱 **Responsive**: Handles dynamic content and resizing

## Installation

```bash
# Using npm
npm install text-scrambler.js

# Using pnpm
pnpm add text-scrambler.js

# Using yarn
yarn add text-scrambler.js
```

## Quick Start

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Text Scrambler Demo</title>
  </head>
  <body>
    <h1 id="title">Hello World!</h1>

    <script type="module">
      import TextScrambler from 'text-scrambler.js'

      const element = document.getElementById('title')
      const scrambler = new TextScrambler(element, {
        duration: 2000,
        scrambleSymbols: '@#$%&*',
      })

      scrambler.start()
    </script>
  </body>
</html>
```

## Usage

### Basic Usage

```javascript
import TextScrambler from 'text-scrambler.js'

const element = document.querySelector('.my-text')
const scrambler = new TextScrambler(element)
scrambler.start()
```

### With Configuration

```javascript
const scrambler = new TextScrambler(element, {
  duration: 1500, // Animation duration in milliseconds
  delay: 500, // Initial delay before animation starts
  reverse: false, // false: reveal text, true: dissolve text
  scrambleSymbols: '#$@!*&', // Characters used for scrambling
  randomThreshold: 0.85, // Probability of showing original vs scramble chars
  absolute: false, // Set element position to absolute
  pointerEvents: true, // Enable/disable pointer events during animation
})

scrambler.start()
```

### API Methods

```javascript
// Start the animation
scrambler.start()

// Stop the animation
scrambler.stop()

// Reset to initial state
scrambler.initialize()
```

## Configuration Options

| Option            | Type      | Default                           | Description                                             |
| ----------------- | --------- | --------------------------------- | ------------------------------------------------------- |
| `duration`        | `number`  | `1000`                            | Animation duration in milliseconds                      |
| `delay`           | `number`  | `0`                               | Initial delay before animation starts                   |
| `reverse`         | `boolean` | `false`                           | Animation direction (false: reveal, true: dissolve)     |
| `scrambleSymbols` | `string`  | `"—~±§\|[].+$^@*()•x%!?#"`        | Characters used for scrambling effect                   |
| `randomThreshold` | `number`  | `0.8` (forward) / `0.1` (reverse) | Probability threshold for showing original character    |
| `autoInitialize`  | `boolean` | `true`                            | Automatically set initial state based on animation mode |
| `absolute`        | `boolean` | `false`                           | Set element CSS position to absolute                    |
| `pointerEvents`   | `boolean` | `true`                            | Enable pointer events on the element                    |

### Auto-Initialize Feature

By default, `autoInitialize: true` automatically sets the correct initial state:

- **Forward mode** (reveal): Text starts hidden (spaces), ready to be revealed
- **Reverse mode** (dissolve): Text starts visible, ready to dissolve

```javascript
// No need to manually hide text - autoInitialize handles it!
const scrambler = new TextScrambler(element, {
  duration: 2000,
  autoInitialize: true, // default
})
scrambler.start() // Text will smoothly reveal from hidden state
```

To disable auto-initialization and manage initial state manually:

```javascript
const scrambler = new TextScrambler(element, {
  autoInitialize: false, // You handle initial state
})
```

## Examples

### Reveal Animation (Default)

```javascript
const scrambler = new TextScrambler(element, {
  duration: 2000,
  scrambleSymbols: '01',
})
scrambler.start()
```

### Dissolve Animation

```javascript
const scrambler = new TextScrambler(element, {
  duration: 1500,
  reverse: true,
  scrambleSymbols: 'x',
})
scrambler.start()
```

### Matrix-style Effect

```javascript
const scrambler = new TextScrambler(element, {
  duration: 3000,
  scrambleSymbols: '01',
  randomThreshold: 0.9,
})
scrambler.start()
```

## Browser Support

- Chrome 61+
- Firefox 55+
- Safari 10.1+
- Edge 79+

## Performance

The library is optimized for performance:

- Uses `TreeWalker` for efficient DOM text node collection
- Batches DOM updates to minimize reflows
- Leverages `requestAnimationFrame` for smooth animations
- Minimal memory footprint with efficient string operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Inspired by the beautiful text effects on [Music for Programming](https://musicforprogramming.net/).

## License

MIT © [tizee](https://github.com/tizee)
