import {html, render, repeat} from './index.js';
import {Endpoint} from './endpoint.js';
import {AgentLink} from './agent-link.js';
import {AgentOperation} from './agent-operation.js';

export function agent() {
    return window['@hippiemedia/agent'](client => (method, url, params, headers) => {
        return client(method, url, params, {Authorization: 'Bearer ', ...headers})
    });
}

export class AgentEndpoint extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});

        this.agent = agent();
        this.resource = null;
    }

    static get observedAttributes() { return ['url']; }

    async attributeChangedCallback(name, old, val) {
        this.resource = await this.agent.follow(val);
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            ${this.resource && html`<h-endpoint
                method="${this.resource.method}"
                url="${this.resource.url}"
                title="${this.resource.title}"
                description="${this.resource.description}"
            >
                <code slot="response-body">${this.resource.response.body}</code>
                <div slot="links">
                    ${repeat(
                        this.resource.links,
                        (link, key) => key,
                        link => html`<h-agent-link .link=${link} />`
                    )}
                </div>
                <div slot="operations">
                    ${repeat(
                        this.resource.operations,
                        (operation, key) => key,
                        operation => html`<h-agent-operation .operation=${operation} />`
                    )}
                </div>
            </h-endpoint>`}
        `, this.root);
    }
}

customElements.define('h-agent-endpoint', AgentEndpoint);
