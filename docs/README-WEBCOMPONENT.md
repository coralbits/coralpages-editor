# Page Editor Web Component

This project includes a web component that wraps the React-based Page Editor, allowing you to embed the editor in any HTML page.

## Features

- **Custom Element**: `<page-editor>` custom element
- **Path Attribute**: Set the page path via the `path` attribute
- **CSS Loading**: Load custom CSS files via the `css` attribute
- **Dynamic Updates**: Path and CSS changes are automatically reflected in the editor
- **Shadow DOM**: Isolated styling and DOM structure
- **React Integration**: Full React Editor functionality within a web component

## Usage

### 1. Build the Web Component

```bash
npm run build:webcomponent
```

This will create the compiled web component in the `dist/` directory.

### 2. Include in Your HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page with Editor</title>
  </head>
  <body>
    <!-- Include the web component script -->
    <script type="module" src="./dist/webcomponent.js"></script>

    <!-- Use the web component -->
    <page-editor path="/my-page" css="./styles.css"></page-editor>
  </body>
</html>
```

### 3. Dynamic Updates

You can change the path and CSS programmatically:

```javascript
const editor = document.querySelector("page-editor");

// Set a new path
editor.setAttribute("path", "/new-page");

// Set a new CSS file
editor.setAttribute("css", "./new-styles.css");

// Or use the property setters
editor.path = "/another-page";
editor.css = "./another-styles.css";

// Remove CSS
editor.removeAttribute("css");
```

### 4. Styling

The web component uses Shadow DOM, so you can style it from the outside:

```css
page-editor {
  display: block;
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
```

You can also load custom CSS files that will be applied within the Shadow DOM:

```html
<page-editor path="/my-page" css="./custom-styles.css"></page-editor>
```

The CSS file will be fetched and injected into the Shadow DOM, allowing you to customize the appearance of the editor components.

## API Reference

### Attributes

- `path` (string): The path of the page to edit
- `css` (string): URL to a CSS file to load and apply within the Shadow DOM

### Properties

- `path` (string): Getter/setter for the path attribute
- `css` (string): Getter/setter for the css attribute

### Methods

- Standard HTMLElement methods are available

## Example

See `src/webcomponent-example.html` for a complete working example. The example includes:

- Dynamic path input
- Dynamic CSS URL input
- Sample CSS file (`src/sample-styles.css`) with custom styling

## Development

To develop with the web component:

1. Start the development server: `npm start`
2. Open `src/webcomponent-example.html` in your browser
3. Make changes to the web component code
4. Refresh the page to see updates

## Browser Support

This web component uses modern web standards and requires:

- Custom Elements v1
- Shadow DOM v1
- ES2020+ features

Supported browsers:

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+
