import {html, render, repeat} from './index.js';

export class UriTemplate extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});

        this.link = null;
        this.resource = null;
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            <form action="${this.link.href}" method="GET" @submit=${this.onSubmit.bind(this)}>
                <h3>${this.link.title}</h3>
                <p>${this.link.description}</p>
                <fieldset>
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
                </fieldset>
                <input type="submit" />
            </form>
            <br/>
            ${this.resource && html`<h-endpoint .resource=${this.resource}>`}
        `, this.shadow);
    }

    async onSubmit(event)
    {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        let params = Array.from(data.entries()).filter(([key, value]) => value).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {})
        this.resource = await this.link.follow(params, true);
        this.dispatchEvent(new CustomEvent('uri-template-followed', {
            detail: this.resource,
            bubbles: false,
            composed: true,
        }));
        this.render();
    }
}

customElements.define('h-uri-template', UriTemplate);
