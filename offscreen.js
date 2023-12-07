chrome.runtime.onMessage.addListener(handleMessages);

async function handleMessages(message) {
  if (message.target !== 'offscreen-doc') {
    return;
  }

	switch (message.type) {
    case 'download-mindmap':
			return downloadMindmap(message.data, message.filename);
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
}

const textEl = document.querySelector('#text');

async function downloadMindmap(data, filename) {
  try {
		const blob = new Blob([data], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
  } finally {
    window.close();
  }
}