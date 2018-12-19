import {html, render, repeat} from './index.js';

import {StaticOperation} from './static-operation.js';
import {Field} from './field.js';

export class Operation extends HTMLElement {
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
        render(html`<h-static-operation href="${this.operation.href}" title="${this.operation.title}" method="${this.operation.method}" @operation-submitted=${this.onSubmit.bind(this)}>
            <div slot="description">${this.operation.description}</div>
            <div slot="fields">
                ${repeat(
                    this.operation.fields,
                    (field, key) => key,
                    field => html`<h-field .field=${field} />`
                )}
            </div>
            ${this.resource && html`<h-endpoint .resource=${this.resource} slot="resource" />`}
        </h-static-operation>`, this.root);
    }

    async onSubmit(event)
    {
        this.resource = await this.operation.submit(event.detail);
        this.render();
    }
}

customElements.define('h-operation', Operation);

