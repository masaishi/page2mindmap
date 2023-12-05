const SYSTEM_CONTENT = `Summarize user input, and make markmap.
Do not include non-text parts in your abstract.
Generate a mind map suitable for memorization by creating branches with technical terms.

[MARKMAP FORMAT]
---
markmap:
  colorFreezeLevel: 2
---

# markmap

## Links

- <https://markmap.js.org/>
- [GitHub](https://github.com/gera2ld/markmap)

## Related Projects

- [coc-markmap](https://github.com/gera2ld/coc-markmap)
- [gatsby-remark-markmap](https://github.com/gera2ld/gatsby-remark-markmap)

## Features

- links
- **strong** ~~del~~ *italic* ==highlight==
- multiline
  text
- \`inline code\`
-
    \`\`\`js
    console.log('code block');
    \`\`\`
- Katex
  - $x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$
  - [More Katex Examples](#?d=gist:af76a4c245b302206b16aec503dbe07b:katex.md)
- Now we can wrap very very very very long text based on \`maxWidth\` option
`;

// This function handles the extension's icon click event.
async function onExtensionClick(tab) {
  const apiKey = await getApiKey();
  if (apiKey) {
    try {
      await processTabContent(tab, apiKey);
    } catch (error) {
      console.error("Error processing tab content:", error);
      notifyError('Please select some text on the page first!');
    }
  } else {
    promptForApiKey();
  }
}

// This function processes the content of the tab and generates a mind map.
async function processTabContent(tab, apiKey) {
  const content = await extractPageContent(tab.id);
  if (content) {
    const mindmap = await generateMindmap(content, apiKey);
    const sanitizedTitle = tab.title.replace(/[<>:"\/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_"); // Sanitize the title to be a valid filename
    await downloadMindmap(mindmap, `${sanitizedTitle}_markmap.md`);
    notifySuccess();
  } else {
    throw new Error('No content to summarize');
  }
}

// This function prompts the user to enter their API key.
function promptForApiKey() {
  chrome.windows.create({
    url: chrome.runtime.getURL("apikey_input.html"),
    type: "popup",
    width: 400,
    height: 200,
  });
}

// This function sends a success notification to the user.
function notifySuccess() {
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'images/icon48.png',
    title: 'Mindmap Copied',
    message: 'The mindmap has been copied to your clipboard!'
  });
}

// This function sends an error notification to the user.
function notifyError(errorMessage) {
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'images/icon48.png',
    title: 'Error',
    message: errorMessage
  });
}

// This function extracts the text content from the specified tab.
async function extractPageContent(tabId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    function: () => document.body.innerText,
  });
  return result?.result;
}

// This function interacts with the OpenAI API to generate a mind map.
async function generateMindmap(content, apiKey) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: SYSTEM_CONTENT },
        { role: "user", content },
      ],
    }),
  });

  const data = await response.json();
	console.log(data);
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No mindmap received from GPT-4');
  }

  console.log("Mindmap generated:", data.choices[0].message.content);
  return data.choices[0].message.content;
}

// This function downloads the mind map to the user's computer.
async function downloadMindmap(mindmap, filename) {
	await chrome.offscreen.createDocument({
		url: 'offscreen.html',
		reasons: ['BLOBS'],
		justification: 'Download mindmap',
	});

	chrome.runtime.sendMessage({
		type: 'download-mindmap',
		target: 'offscreen-doc',
		data: mindmap,
		filename: filename,
	});
}

// This function shows a loading indicator using the browser action badge
function showLoadingIndicator() {
  chrome.action.setBadgeBackgroundColor({ color: '#4589ad' });
  chrome.action.setBadgeText({ text: '...' });
}

// This function hides the loading indicator
function hideLoadingIndicator() {
  chrome.action.setBadgeText({ text: '' });
}

// This function retrieves the API key from Chrome's local storage.
async function getApiKey() {
  const result = await chrome.storage.local.get(["apiKey"]);
  return result.apiKey;
}

// This function is called when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "setApiKey",
    title: "Set/Change API Key",
    contexts: ["action"],
  });
});

// Update context menu handler to show the loading indicator
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "setApiKey") {
    promptForApiKey();
  } else if (info.menuItemId === "text2mindmap") {
    showLoadingIndicator();
    chrome.storage.local.get(["apiKey"], async (result) => {
      if (result.apiKey && tab) {
        try {
          await processTabContent(tab, result.apiKey);
        } catch (error) {
          console.error("Error summarizing content:", error);
          notifyError('Please select some text on the page first!');
        } finally {
          hideLoadingIndicator();
        }
      } else {
        hideLoadingIndicator();
        promptForApiKey();
      }
    });
  }
});

chrome.action.onClicked.addListener(onExtensionClick);