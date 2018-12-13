import {html, render, repeat} from './index.js';

import {StaticLink} from './static-link.js';
import {Field} from './field.js';

export class Link extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});

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
        render(html`<h-static-link href="${this.link.href}" title="${this.link.title}" @link-followed=${this.onFollow.bind(this)}>
            <div slot="fields">
                ${repeat(
                    this.link.fields,
                    (field, key) => key,
                    field => html`<h-field .field=${field} />`
                )}
            </div>
            ${this.resource && html`<h-endpoint .resource=${this.resource} slot="resource" />`}
        </h-static-link>`, this.shadow);
    }

    async onFollow(event)
    {
        this.resource = await this.link.follow(event.detail, !this.link.isResolved());
        this.render();
    }
}

customElements.define('h-link', Link);
