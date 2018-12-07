import {html, render, repeat} from './index.js';

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
        render(html`
            <form novalidate action="${this.link.href}" method="GET" @submit=${this.onFollow.bind(this)}>
                <h3>${this.link.title}</h3>
                <span>GET</span>
                <span class="url">${this.link.href}</span>
                <p>${this.link.description}</p>
                ${repeat(
                    this.link.fields,
                    (field, key) => key,
                    field => html`
                        <p>${field.description}</p>
                        <label>
                            ${field.name}
                            <input
                                required=${field.required}
                                type=${field.type}
                                value=${field.value || ''}
                                name=${field.name}
                                placeholder=${field.example || field.name}
                                multiple=${field.multiple}
                            />
                        </label>`
                )}
                <input type="submit" value="Follow" />
            </form>
            <br/>
            ${this.resource && html`
                <a @click=${this.onClose.bind(this)}>Close</a>
                <h-endpoint .resource=${this.resource}>
            `}
        `, this.shadow);
    }

    onClose(event) {
        this.resource = null;
        this.render();
    }

    async onFollow(event)
    {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        let params = Array.from(data.entries()).filter(([key, value]) => value).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {});

        this.resource = await this.link.follow(params, !this.link.isResolved());
        this.render();

        this.dispatchEvent(new CustomEvent('link-followed', {
            detail: this.resource,
            bubbles: false,
            composed: true,
        }));
    }
}

customElements.define('h-link', Link);
