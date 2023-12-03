# page2mindmap

This Chrome extension uses OpenAI's API to generate mind maps from the content of web pages and download them as markdown files. It is designed to help users create visual summaries of the information on web pages for easier understanding and memorization.

Based on usage, it costs OpenAI's API

## Features

- **Content Summarization**: Summarizes the text of a web page and creates a mind map.
- **Markmap Integration**: Uses the [Markmap](https://markmap.js.org/) library to visualize the mind map in markdown format.
- **Automatic Downloads**: Downloads the generated mind map as a markdown file, naming it after the web page's title.

## Set API Key
1. Copy your API key on the [OpenAI API keys](https://platform.openai.com/api-keys) to the clipboard.
2. Right-click on the extension icon in the Chrome toolbar.
3. Select the "Set/Change API Key" option from the context menu.
4. Paste your OpenAI API key in the text box.
5. Click "Save".

## Usage

1. Navigate to a web page you wish to summarize.
2. Click the Page2MindMap extension icon in your Chrome toolbar.
3. The extension will summarize the content of the current tab and download the mind map as a markdown file.

## About Markmap

Markmap is a library that generates mind maps from markdown files.

- [GitHub Repository](https://github.com/markmap/markmap): Contains the source code for the Markmap library.
- [Web View](https://markmap.js.org/repl): Paste markdown text into the text box and click "Render" to generate a mind map.
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode): Allows users to generate mind maps from markdown files in VS Code.