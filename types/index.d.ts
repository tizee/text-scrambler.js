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
 *   const evolution = new TextScrambler(element, {
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
interface TextScramblerConfig {
  duration?: number
  delay?: number
  reverse?: boolean
  absolute?: boolean
  pointerEvents?: boolean
  scrambleSymbols?: string
  randomThreshold?: number | null
  autoInitialize?: boolean
}
/**
 * TextScrambler class that performs the scramble text animation.
 */
declare class TextScrambler {
  private el
  private config
  private textNodes
  private nodeLengths
  private originalText
  private mask
  private currentMask
  private totalChars
  private scrambleRange
  private direction
  private _animationFrame
  private _startTime
  private _running
  /**
   * Creates an instance of TextScrambler.
   * @param el - The DOM element whose text is animated.
   * @param config - Configuration options.
   */
  constructor(el: HTMLElement, config?: TextScramblerConfig)
  /**
   * Sets the initial display state based on animation mode.
   * For reverse mode: show original text (ready to dissolve)
   * For forward mode: show mask (ready to reveal)
   * @private
   */
  private _setInitialState
  /**
   * Reinitializes the animation state.
   * @returns The instance.
   */
  initialize(): TextScrambler
  /**
   * Computes an eased value based on the progress.
   * @param progress - The linear progress (0 to 1).
   * @returns The eased progress value.
   */
  private _getEased
  /**
   * Randomly updates scramble characters in the transition region.
   * @param progress - The current progress (0 to 1).
   * @param revealCount - Number of characters that have been revealed.
   * @param offset - Width of the scramble transition region.
   */
  private _updateScramble
  /**
   * Composes the final output string from the original text, scrambled mask, and blank mask.
   * @param progress - The current progress (0 to 1).
   * @param revealCount - Number of characters revealed.
   * @param offset - Width of the scramble region.
   * @returns The output string to display.
   */
  private _composeOutput
  /**
   * Updates the DOM text nodes with the given output string.
   * @param output - The composed output string.
   */
  private _updateTextNodes
  /**
   * Internal tick function called on each animation frame.
   * @param timestamp - The current time.
   */
  private _tick
  /**
   * Starts the text scrambler animation.
   */
  start(): void
  /**
   * Stops the animation if it's running.
   */
  stop(): void
  /**
   * Gets the current running state of the animation.
   */
  get isRunning(): boolean
}

export { type TextScramblerConfig, TextScrambler as default }
