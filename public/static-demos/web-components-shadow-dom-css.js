class MyComponent extends HTMLElement {
  constructor() {
    super()
    /** shadow DOM */
    const shadow = this.attachShadow({ mode: 'open' })
    const content = document.createElement('div')
    content.textContent = 'CSSStyleSheet Demo'

    const sheet = new CSSStyleSheet()
    sheet.replaceSync('div { color: red; font-size: 20px; }')

    shadow.adoptedStyleSheets.push(sheet)
    shadow.appendChild(content)
  }
}
customElements.define('my-component', MyComponent)