class MyTitle extends HTMLElement {
  constructor() {
    super()
    /** shadow DOM */
    const shadow = this.attachShadow({ mode: 'open' })

    const myTemplate = document.getElementById('my-title')

    shadow.appendChild(myTemplate.content.cloneNode(true))
  }
}
customElements.define('my-title', MyTitle)