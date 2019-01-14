import {html, render, repeat} from './index.js';

export class Link extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
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
            <link rel="stylesheet" href="/css/shared.css"/>
            <link rel="stylesheet" href="/css/link.css"/>
            <form novalidate action="${this.getAttribute('href')}" method="GET" @submit=${this.onFollow.bind(this)}>
                <h3>${this.getAttribute('title')}</h3>
                <span class="method GET">GET</span>
                <span class="url">${this.getAttribute('href')}</span>
                <slot="description"></slot>
                <slot name="fields"></slot>
                <input type="submit" value="Follow" />
            </form>
            <slot name="resource"></slot>
        `, this.root);
    }

    onFollow(event)
    {
        event.preventDefault();
        let slot = this.root.querySelector('slot[name=fields]');
        let params = Array.from(slot.assignedNodes()[0].querySelectorAll('input')).filter(input => input.value).reduce((acc, input) => ({
            ...acc,
            [input.name]: input.value,
        }), {});

        this.dispatchEvent(new CustomEvent('link-followed', {
            detail: params,
            bubbles: false,
            composed: true,
        }));
    }
}

customElements.define('h-link', Link);
