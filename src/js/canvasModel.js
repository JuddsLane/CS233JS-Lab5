/**
 * @file canvasModel.js
 * Plain data model holding all settings needed to render the canvas.
 */

/**
 * Stores the current state of the canvas rendering parameters and draws itself.
 */

const STORAGE_KEY = 'mememaker-model';

export default class CanvasModel {
    constructor() {
        /** @type {HTMLImageElement|null} The image to draw on the canvas. */
        this.image = null;
        /** @type {string} */
        this.topText = '';
        /** @type {string} */
        this.bottomText = '';
        this.textColor = 'white';
        this.strokeColor = 'none';
        this.strokeWidth = 0;
        this.filter = 'none';
        this.fontName = 'Arial';
        this.fontSize = 30;
    }

    storeInLocalStorage() {
        const { image, ...serializable } = this;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
        } catch {
            // QuotaExceededError: data URL too large — silently skip
        }
    }

    /**
     * Returns the previously saved model state, or null if none exists.
     * @returns {object|null}
     */
    static loadFromLocalStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    /**
     * Clears the canvas, draws the current image stretched to fill it, then
     * layers the top and bottom text on top.
     * @param {HTMLCanvasElement} canvasElement
     */
    render(canvasElement) {
        const ctx = canvasElement.getContext('2d');
        const { width, height } = canvasElement;
        ctx.clearRect(0, 0, width, height);
        this.filter == 'none' ? ctx.filter = 'none' : ctx.filter = this.filter + '(100%)';
        if (this.image) {
            ctx.roundRect(0,0,width,height,40);
            ctx.clip();
            ctx.drawImage(this.image, 0, 0, width, height);
        }
        this.#drawText(ctx, canvasElement);
    }

    /**
     * Draws top and bottom text onto the canvas with a stroked outline for legibility.
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvasElement
     */
    #drawText(ctx, canvasElement) {
        ctx.font = `bold ${this.fontSize}px ${this.fontName}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = this.textColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.fontSize / 20;

        if (this.topText) {
            ctx.fillText(this.topText, canvasElement.width / 2, this.fontSize);
            if (this.strokeWidth != 0)
                ctx.strokeText(this.topText, canvasElement.width / 2, this.fontSize);
        }
        if (this.bottomText) {
            ctx.fillText(this.bottomText, canvasElement.width / 2, canvasElement.height - this.fontSize / 4);
            if (this.strokeWidth != 0)
                ctx.strokeText(this.bottomText, canvasElement.width / 2, canvasElement.height - this.fontSize / 4);
        }
    }
}
