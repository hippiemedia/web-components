import {html, render, repeat} from './index.js';

export class Field extends HTMLElement {
    constructor() {
        super();
        this.root = this;
    }

    async connectedCallback() {
        this.render();
    }

    static get observedAttributes() { return ['href', 'name', 'description', 'type', 'value', 'required', 'example', 'multiple']; }

    attributeChangedCallback(name, old, val) {
        this.render();
    }

    render() {
        render(html`
            <p class="description">${this.getAttribute('description')}</p>
            <label>
                ${this.getAttribute('name')}
                <input
                    required=${this.getAttribute('required')}
                    type=${this.getAttribute('type')}
                    value=${this.getAttribute('value') || ''}
                    name=${this.getAttribute('name')}
                    placeholder=${this.getAttribute('example') || this.getAttribute('name')}
                    multiple=${this.getAttribute('multiple')}
                />
            </label>
        `, this.root);
    }
}

customElements.define('h-field', Field);

