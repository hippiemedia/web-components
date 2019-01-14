import {html, render, repeat} from './index.js';

import {Operation} from './operation.js';
import {AgentField} from './agent-field.js';

export class AgentOperation extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});

        this.operation = null;
        this.resource = null;
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        render(html`<h-operation href="${this.operation.href}" title="${this.operation.title}" method="${this.operation.method}" @operation-submitted=${this.onSubmit.bind(this)}>
            <div slot="description">${this.operation.description}</div>
            <div slot="fields">
                ${repeat(
                    this.operation.fields,
                    (field, key) => key,
                    field => html`<h-agent-field .field=${field} />`
                )}
            </div>
            ${this.resource && html`<h-agent-endpoint .resource=${this.resource} slot="resource" />`}
        </h-operation>`, this.root);
    }

    async onSubmit(event)
    {
        this.resource = await this.operation.submit(event.detail);
        this.render();
    }
}

customElements.define('h-agent-operation', AgentOperation);
