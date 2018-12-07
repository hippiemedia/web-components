import {html, render, repeat, agent} from './index.js';

export class Endpoint extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});

        this.agent = agent();
        this.resource = null;
    }

    async connectedCallback() {
        if (this.hasAttribute('root') && window.location.hash) {
            this.resource = await this.agent.follow(window.location.hash.substring(1));
            console.log(this.resource);
        }
        this.render();
    }

    render() {
        render(html`
            <link rel="stylesheet" href="/css/endpoint.css"/>

            ${this.resource && html`

                <pre><code>${try_json(this.resource.response.body)}</code></pre>

                ${repeat(
                    this.resource.links,
                    (link, key) => key,
                    link => html`<h-link .link=${link} @link-followed=${this.onResource.bind(this)} />`
                )}

                ${repeat(
                    this.resource.operations,
                    (operation, key) => key,
                    operation => html`<h-operation .operation=${operation} @operation-submitted=${this.onResource.bind(this)} />`
                )}
            `}
        `, this.shadow);
    }

    onResource(event) {
        console.log(event);
        window.history.pushState(undefined, undefined, `#${event.detail.url}`);
    }
}

function try_json(json) {
    try {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        return JSON.stringify(json, null, 2);
    }
    catch(e) {
        return json;
    }
}

customElements.define('h-endpoint', Endpoint);
