import {html, render, repeat, agent} from './index.js';
import {StaticEndpoint} from './static-endpoint.js';
import {Link} from './link.js';
import {Operation} from './operation.js';

export class Endpoint extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});

        this.agent = agent();
        this.resource = null;
    }

    async connectedCallback() {
        if (this.hasAttribute('root') && window.location.hash) {
            this.resource = await this.agent.follow(window.location.hash.substring(1));
        }
        this.render();
    }

    render() {
        render(html`
            ${this.resource && html`<h-static-endpoint url="${this.resource.url}" title="${this.resource.title}">
                <div slot="state">${this.resource.response.body}</div>
                <div slot="links">
                    ${repeat(
                        this.resource.links,
                        (link, key) => key,
                        link => html`<h-link .link=${link} />`
                    )}
                </div>
                <div slot="operations">
                    ${repeat(
                        this.resource.operations,
                        (operation, key) => key,
                        operation => html`<h-operation .operation=${operation} />`
                    )}
                </div>
            </h-static-endpoint>`}
        `, this.root);
    }
}

customElements.define('h-endpoint', Endpoint);
