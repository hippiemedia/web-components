import {html, render, repeat} from './index.js';

export class StaticLink extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() { return ['href', 'title']; }

    attributeChangedCallback(name, old, val) {
        this.render();
    }

    render() {
        render(html`
            <form novalidate action="${this.getAttribute('href')}" method="GET" @submit=${this.onFollow.bind(this)}>
                <h3>${this.getAttribute('title')}</h3>
                <span>GET</span>
                <span class="url">${this.getAttribute('href')}</span>
                <slot="description"/>
                <div slot="fields"></div>
                <input type="submit" value="Follow" />
            </form>
            <slot name="resource"/>
        `, this.shadow);
    }

    onFollow(event)
    {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        let params = Array.from(data.entries()).filter(([key, value]) => value).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {});

        this.dispatchEvent(new CustomEvent('link-followed', {
            detail: params,
            bubbles: false,
            composed: true,
        }));
    }
}

customElements.define('h-static-link', StaticLink);
