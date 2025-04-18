  /**
   * Text Scrambler Library
   * ------------------------
   * This library animates the text content of a DOM element by gradually
   * revealing or dissolving its text through a scramble animation.
   *
   * ASCII Overview:
   *
   *        +-------------------------------+
   *        |         DOM Element           |
   *        +-------------------------------+
   *                    │
   *                    ▼
   *        +-------------------------------+
   *        | Gather Text Nodes             |
   *        |  (using TreeWalker for speed) |
   *        +-------------------------------+
   *                    │
   *                    ▼
   *        +-------------------------------+
   *        |  Initialize Original Text &   |
   *        |       Non‑breaking Mask       |
   *        +-------------------------------+
   *                    │
   *                    ▼
   *        +-------------------------------+
   *        | Animate using requestAnimationFrame |
   *        +-------------------------------+
   *                    │
   *                    ▼
   *        +-------------------------------+
   *        | Scramble / Reveal Characters  |
   *        +-------------------------------+
   *                    │
   *                    ▼
   *        +-------------------------------+
   *        | Update DOM Text Nodes         |
   *        +-------------------------------+
   *
   * Usage:
   *   const evolution = new TextEvolution(element, {
   *     duration: 1500,
   *     reverse: false,
   *     scrambleSymbols: "#$@!*&",
   *     randomThreshold: 0.85,
   *     // ... other config options
   *   });
   *   evolution.start();
   *
   * Config options:
   *   - duration: number (animation duration in ms)
   *   - delay: number (initial delay in ms)
   *   - reverse: boolean (animation direction; reverse dissolves text)
   *   - absolute: boolean (set element style position to absolute)
   *   - pointerEvents: boolean (enable/disable pointer events on element)
   *   - scrambleSymbols: string (symbols used for scrambling)
   *   - randomThreshold: number (probability threshold for random replacement)
   */

  /**
   * Efficiently gathers all non‑empty text nodes from the given root using TreeWalker.
   * @param {HTMLElement} root - The root element.
   * @returns {Text[]} An array of text nodes.
   */
  function gatherTextNodes(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) =>
          node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
      }
    );
    const nodes = [];
    while (walker.nextNode()) {
      // Clean the node's value by removing newlines, carriage returns, and tabs.
      walker.currentNode.nodeValue = walker.currentNode.nodeValue.replace(/(\n|\r|\t)/gm, "");
      nodes.push(walker.currentNode);
    }
    return nodes;
  }

  /**
   * Replaces the character at the specified index in the string.
   * @param {string} str - The original string.
   * @param {number} idx - The index at which to replace.
   * @param {string} ch - The new character.
   * @returns {string} The updated string.
   */
  function replaceAt(str, idx, ch) {
    if (idx < 0 || idx >= str.length) return str;
    return str.substring(0, idx) + ch + str.substring(idx + 1);
  }

  /**
   * Returns a scramble character.
   * For reverse mode, it always returns "x"; otherwise, it randomly selects a character
   * from the provided scrambleSymbols.
   * @param {boolean} isReverse - Whether reverse mode is active.
   * @param {string} scrambleSymbols - String of scramble characters.
   * @returns {string} A scramble character.
   */
  function getRandomScrambleChar(isReverse, scrambleSymbols) {
    return isReverse ? "x" : scrambleSymbols[Math.floor(Math.random() * scrambleSymbols.length)];
  }

  /**
   * TextScrambler class that performs the scramble text animation.
   */
export default class TextScrambler {
    /**
     * Creates an instance of TextEvolution.
     * @param {HTMLElement} el - The DOM element whose text is animated.
     * @param {Object} config - Configuration options.
     */
    constructor(el, config = {}) {
      this.el = el;
      const defaults = {
        duration: 1000,
        delay: 0,
        reverse: false,
        absolute: false,
        pointerEvents: true,
        scrambleSymbols: "—~±§|[].+$^@*()•x%!?#",
        randomThreshold: null, // If null, will be set based on reverse mode.
      };
      this.config = Object.assign({}, defaults, config);
      if (this.config.randomThreshold === null) {
        this.config.randomThreshold = this.config.reverse ? 0.1 : 0.8;
      }

      // Gather text nodes using an optimized TreeWalker.
      this.textNodes = gatherTextNodes(this.el);
      // Store lengths of each text node to distribute output later.
      this.nodeLengths = this.textNodes.map((node) => node.nodeValue.length);
      // Save the complete original text.
      this.originalText = this.textNodes.map((node) => node.nodeValue).join("");

      // Create a mask of non-breaking spaces matching the original text.
      this.mask = this.originalText
        .split(" ")
        .map((word) => " ".repeat(word.length))
        .join(" ");
      // Mutable copy for random substitutions.
      this.currentMask = this.mask;

      // Total number of characters.
      this.totalChars = this.originalText.length;
      // Determine scramble range based on animation mode.
      this.scrambleRange = Math.floor(
        this.totalChars * (this.config.reverse ? 0.25 : 1.5)
      );

      // Direction factor: +1 for forward, -1 for reverse.
      this.direction = this.config.reverse ? -1 : 1;

      // Optionally adjust CSS styles.
      if (this.config.absolute) {
        this.el.style.position = "absolute";
        this.el.style.top = "0";
      }
      if (!this.config.pointerEvents) {
        this.el.style.pointerEvents = "none";
      }

      // Internal animation state.
      this._animationFrame = null;
      this._startTime = null;
      this._running = false;
    }

    /**
     * Reinitializes the animation state.
     * @returns {TextEvolution} The instance.
     */
    initialize() {
      this.currentMask = this.mask;
      return this;
    }

    /**
     * Computes an eased value based on the progress.
     * @param {number} progress - The linear progress (0 to 1).
     * @returns {number} The eased progress value.
     */
    _getEased(progress) {
      let eased = -(Math.cos(Math.PI * progress) - 1) / 2;
      eased = Math.pow(eased, 2);
      return this.config.reverse ? 1 - eased : eased;
    }

    /**
     * Randomly updates scramble characters in the transition region.
     * @param {number} progress - The current progress (0 to 1).
     * @param {number} revealCount - Number of characters that have been revealed.
     * @param {number} offset - Width of the scramble transition region.
     */
    _updateScramble(progress, revealCount, offset) {
      if (Math.random() < 0.5 && progress > 0 && progress < 1) {
        for (let t = 0; t < 20; t++) {
          const factor = t / 20;
          let idx;
          if (this.config.reverse) {
            // In reverse: modify indices in region [revealCount - offset, revealCount)
            idx = revealCount - Math.floor((1 - Math.random()) * this.scrambleRange * factor);
          } else {
            // In forward: modify indices in region [revealCount, revealCount + offset)
            idx = revealCount + Math.floor((1 - Math.random()) * this.scrambleRange * factor);
          }
          if (idx < 0 || idx >= this.totalChars) continue;
          if (this.currentMask[idx] !== " ") {
            const newChar =
              Math.random() > this.config.randomThreshold
                ? this.originalText[idx]
                : getRandomScrambleChar(this.config.reverse, this.config.scrambleSymbols);
            this.currentMask = replaceAt(this.currentMask, idx, newChar);
          }
        }
      }
    }

    /**
     * Composes the final output string from the original text, scrambled mask, and blank mask.
     * @param {number} progress - The current progress (0 to 1).
     * @param {number} revealCount - Number of characters revealed.
     * @param {number} offset - Width of the scramble region.
     * @returns {string} The output string to display.
     */
    _composeOutput(progress, revealCount, offset) {
      let output = "";
      if (this.config.reverse) {
        // Reverse mode: left part blank, middle scrambled, right intact.
        const leftEnd = Math.max(revealCount - offset, 0);
        output =
          this.mask.slice(0, leftEnd) +
          this.currentMask.slice(leftEnd, revealCount) +
          this.originalText.slice(revealCount);
      } else {
        // Forward mode: left part revealed, middle scrambled, right blank.
        output =
          this.originalText.slice(0, revealCount) +
          this.currentMask.slice(revealCount, revealCount + offset) +
          this.mask.slice(revealCount + offset);
      }
      return output;
    }

    /**
     * Updates the DOM text nodes with the given output string.
     * @param {string} output - The composed output string.
     */
    _updateTextNodes(output) {
      let pos = 0;
      for (let i = 0; i < this.textNodes.length; i++) {
        const len = this.nodeLengths[i];
        this.textNodes[i].nodeValue = output.slice(pos, pos + len);
        pos += len;
      }
    }

    /**
     * Internal tick function called on each animation frame.
     * @param {DOMHighResTimeStamp} timestamp - The current time.
     */
    _tick = (timestamp) => {
      if (!this._startTime) this._startTime = timestamp;
      const elapsed = timestamp - this._startTime;
      const progress = Math.min(elapsed / this.config.duration, 1);

      const eased = this._getEased(progress);
      const revealCount = Math.floor(this.totalChars * progress);
      const offset = Math.floor(2 * (0.5 - Math.abs(progress - 0.5)) * this.scrambleRange);

      // Update scramble characters in the transition region.
      this._updateScramble(progress, revealCount, offset);

      // Compose the output string.
      const output = this._composeOutput(progress, revealCount, offset);

      // Update the DOM text nodes.
      this._updateTextNodes(output);

      if (progress < 1) {
        this._animationFrame = requestAnimationFrame(this._tick);
      } else {
        this._running = false;
      }
    };

    /**
     * Starts the text evolution animation.
     */
    start() {
      this._running = true;
      this._startTime = null;
      if (this.config.delay) {
        setTimeout(() => {
          this._animationFrame = requestAnimationFrame(this._tick);
        }, this.config.delay);
      } else {
        this._animationFrame = requestAnimationFrame(this._tick);
      }
    }

    /**
     * Stops the animation if it's running.
     */
    stop() {
      if (this._animationFrame) {
        cancelAnimationFrame(this._animationFrame);
        this._animationFrame = null;
      }
      this._running = false;
    }
  }
