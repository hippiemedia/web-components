import {html, render, repeat} from './index.js';

import {Link} from './link.js';
import {AgentField} from './agent-field.js';

export class AgentLink extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});

        this.link = null;
        this.resource = null;
    }

    async connectedCallback() {
        if (this.link.isResolved()) {
            this.resource = await this.link.follow();
        }
        this.render();
    }

    render() {
        render(html`<h-link href="${this.link.href}" title="${this.link.title}" @link-followed=${this.onFollow.bind(this)}>
            <div slot="fields">
                ${repeat(
                    this.link.fields,
                    (field, key) => key,
                    field => html`<h-agent-field .field=${field} />`
                )}
            </div>
            ${this.resource && html`<h-agent-endpoint .resource=${this.resource} slot="resource" />`}
        </h-link>`, this.root);
    }

    async onFollow(event)
    {
        this.resource = await this.link.follow(event.detail, !this.link.isResolved());
        this.render();
    }
}

customElements.define('h-agent-link', AgentLink);
