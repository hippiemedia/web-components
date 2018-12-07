import {html, render, repeat} from './index.js';

export class Field extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});

        this.field = null;
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            <p>${this.field.description}</p>
            <label>
                ${this.field.name}
                <input
                    required=${this.field.required}
                    type=${this.field.type}
                    value=${this.field.value || ''}
                    name=${this.field.name}
                    placeholder=${this.field.example || this.field.name}
                    multiple=${this.field.multiple}
                />
            </label>
        `, this.shadow);
    }
}

customElements.define('h-field', Field);

