import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import {generateHTML404,generateStyles} from "./errorpage";

function App() {
  const [blocked, setBlocked] = useState(false);  
  const [urlToBlock, setUrlToBlock] = useState("");
  


const isValidURL = (url) => {
    const urlPattern = new RegExp(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/
    );
  

    console.log('approved site',urlPattern.test(url))
    return urlPattern.test(url) 

  };

// Declare a variable to store the blocked websites
let blockedWebsites = {};

const blockSite = () => {
  /* eslint-disable no-undef */
  const urlToBlockFormatted = urlToBlock.trim();

  if (!isValidURL(urlToBlockFormatted)) {
    alert("Invalid URL. Please enter a valid website URL.");
    return;
  }

  // Check if the website is already blocked
  if (urlToBlockFormatted in blockedWebsites) {
    alert(`${urlToBlockFormatted} is already blocked.`);
    return;
  }

  const blockRuleId = Math.floor(Math.random() * 1000);

  const blockRule = {
    id: blockRuleId,
    priority: 1,
    action: {
      type: "block",
    },
    condition: {
      urlFilter: urlToBlockFormatted,
    },
  };

  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [blockRuleId],
    },
    () => {
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          addRules: [blockRule],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              "An unexpected error occurred",
              chrome.runtime.lastError.message
            );
          } else {
            if (isValidURL(urlToBlockFormatted) === true) {
              chrome.tabs.query({ url: urlToBlockFormatted }, (tabs) => {
                if (tabs.length === 0) {
                  alert(`The website you are trying to block is not open.`);
                  return;
                }
                const activeTab = tabs[0];
                const activeTabId = activeTab.id;
                console.log('this is the length of active tabs', tabs.length);
                console.log('this is the generated id for site i want to block', blockRuleId);
                console.log('this is the current tab id', activeTabId);
                console.log('this the is the current tab url', activeTab);

                chrome.scripting.executeScript(
                  {
                    target: { tabId: activeTabId },
                    func: () => {
                      document.body.innerHTML = generateHTML404();
                      document.head.innerHTML = generateStyles();
                    },
                  },
                  () => {
                    alert(`${urlToBlock} is currently blocked`);
                    
                    blockedWebsites[urlToBlockFormatted] = blockRuleId;
                    setBlocked(true);
                  }
                );
              });
            }
          }
        }
      );
    }
  );
};

  const unblockSite = () => {
    /* eslint-disable no-undef */
    const urlToBlockFormatted = urlToBlock.trim();

    if (!isValidURL(urlToBlockFormatted)) {
      alert("Invalid URL. Please enter a valid website URL.");
      return;
    };
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      const blockedWebsites = rules.reduce((acc, rule) => {
        if (rule.action.type === "block") {
          acc[rule.condition.urlFilter] = rule.id;
        }
        return acc;
      }, {});
  
      if (!(urlToBlockFormatted in blockedWebsites)) {
        alert(`${urlToBlockFormatted} is not blocked`);
        return;
      }
  
      const unblockRuleId = blockedWebsites[urlToBlockFormatted];
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: [unblockRuleId],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              "An unexpected error occurred:",
              chrome.runtime.lastError.message
            );
          } else {
            alert(`${urlToBlockFormatted} is now unblocked! Reload this page!`);
            setBlocked(false);
          }
        }
      );
    });
  };
  
  const injectErrorPage = (tabId) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
          document.body.innerHTML = generateHTML404();
          document.head.innerHTML = generateStyles();
        },
      },
      () => {
        setBlocked(true);
      }
    );
  };


  useEffect(() => {
    chrome.webNavigation.onCommitted.addListener((details) => {
      if (blocked && details.tabId && details.url === urlToBlock) {
        injectErrorPage(details.tabId);
      }
    });

    return () => {
      chrome.webNavigation.onCommitted.removeListener((details) => {
        if (blocked && details.tabId && details.url === urlToBlock) {
          injectErrorPage(details.tabId);
        }
      });
    };
  }, [blocked, urlToBlock]);

  

  return (
    <div className="App">
      <input
        type="text"
        value={urlToBlock}
        onChange={(e) => setUrlToBlock(e.target.value)}
        placeholder="Enter URL to block"
      />
      <button onClick={blockSite}>Block</button>
      <button onClick={unblockSite}>Unblock</button>
    </div>
  );
}

export default App;
