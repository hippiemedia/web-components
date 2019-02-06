import {html, render, repeat} from './index.js';
import {Field} from './field.js';

export class AgentField extends HTMLElement {
    constructor() {
        super();
        this.root = this;
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            <h-field
                required=${this.field.required}
                type=${this.field.type}
                value=${this.field.value || ''}
                name=${this.field.name}
                title=${this.field.title || this.field.name }
                placeholder=${this.field.example || this.field.name}
                multiple=${this.field.multiple}
            />
        `, this.root);
    }
}

customElements.define('h-agent-field', AgentField);

