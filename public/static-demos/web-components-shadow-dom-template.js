class MyComponent extends HTMLElement {
  constructor() {
    super()
    /** shadow DOM */
    const shadow = this.attachShadow({ mode: 'open' })

    const myTemplate = document.getElementById('my-template')

    shadow.appendChild(myTemplate.content.cloneNode(true))
  }
}
customElements.define('my-component', MyComponent)