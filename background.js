chrome.runtime.onMessage.addListener(function (message, sender, sendResponse  ) {
    if (message.name === "request_recording") {
        // Get the URL of the HTML file in your extension's directory
        
        
        
        const htmlFileURL = chrome.runtime.getURL("empty.html");
        
        // Create a new tab and navigate to the HTML file
        chrome.tabs.create({ url: htmlFileURL , pinned: true,
            active: true}, function (newTab) {
            console.log("New tab created and navigated to the HTML file");

            // Listen for tab updates
            chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
                // Check if the tab has completed loading
                if (tabId === newTab.id && changeInfo.status === "complete") {
                    console.log("New tab has completed loading");
                                     

                     chrome.tabs.sendMessage(tabId, {
                        name: 'startRecordingOnBackground' 
                     })

                    // Inject the content script into the new tab
                    // chrome.scripting.executeScript({
                    //     target: { tabId: newTab.id },
                    //   // files: ["content.js"]
                    // }, function () {
                    //     console.log("Content script injected into the new tab");
                    // });

                    // Remove the listener to avoid injecting multiple times
                    chrome.tabs.onUpdated.removeListener(this);

                    // Send a response back to the sender
                    sendResponse({ message: "Starting video..." });
                }
            });
        });
    }
});
