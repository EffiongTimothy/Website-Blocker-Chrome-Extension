import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { generateHTML404, generateStyles } from "./errorpage";

function App() {
  const [blocked, setBlocked] = useState(false);
  const [urlToBlock, setUrlToBlock] = useState("");

  const isValidURL = (url) => {
    const urlPattern = new RegExp(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/
    );
    console.log("approved site", urlPattern.test(url));
    return urlPattern.test(url);
  };


const inject404Page = (tabId) => {
      /*eslint-disable no-undef */
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => {
            document.body.innerHTML = generateHTML404();
            document.head.innerHTML = generateStyles();
          },
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Script injection failed:", chrome.runtime.lastError);
          } else {
            console.log("Script injected successfully");
          }
        }
      );
      setBlocked(true);
};


const isURLBlocked = (url) => {
      /*eslint-disable no-undef */
  chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
    if (blockedWebsites && blockedWebsites.includes(url)) {
      console.log('the website is blocked in storage',blockedWebsites.includes(url))
      return blockedWebsites.includes(url);
    }})
};



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('tab object',tab);
  console.log('chang info',changeInfo);
  console.log('tab id that was found',tabId);
  if (changeInfo.status === "complete") {
    console.log('the tab is relaoded');
    const url  = tab.url;
    if (isURLBlocked(url)) {
      inject404Page(tabId);
    }
  }
});

function getDomainName(url) {
  const urlObj = new URL(url);
  console.log('url obj',);
  console.log('from get domain name host name ', urlObj.hostname);
  return urlObj.hostname;
}

  const blockSite = () => {
    /*eslint-disable no-undef */
    const urlToBlockFormatted = urlToBlock.trim();

    if (!isValidURL(urlToBlockFormatted)) {
      alert("Invalid URL. Please enter a valid website URL.");
      return;
    }

    chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
      if (blockedWebsites && blockedWebsites.includes(urlToBlockFormatted)) {
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
          addRules: [blockRule],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              "An unexpected error occurred",
              chrome.runtime.lastError.message
            );
          } else {
              chrome.tabs.query({ url: `*://${urlToBlockFormatted}/*` }, (tabs) => {
              if (tabs.some((tab) => tab.url.includes(urlToBlockFormatted))) {
                if (tabs.length === 0) {
                  alert(`The website you are trying to block is not open.`);
                  return;
                }
                const activeTab = tabs[0];
                const activeTabId = activeTab.id;
                console.log('first tab id from block',activeTabId)
                inject404Page(activeTabId)
            
                    alert(`${urlToBlockFormatted} is currently blocked`);
                    setBlocked(true);

                    chrome.storage.sync.get(
                      "blockedWebsites",
                      ({ blockedWebsites }) => {
                        if (!blockedWebsites) {
                          blockedWebsites = [];
                        }
                        blockedWebsites.push(urlToBlockFormatted);
                        chrome.storage.sync.set({ blockedWebsites });
                      }
                    );
              } else {
                alert(`The website you are trying to block is not open.`);
              }
            });
          }
        }
      );
    });
  };

  const unblockSite = () => {
    /*eslint-disable no-undef */
    const urlToUnblockFormatted = urlToBlock.trim();

    if (!isValidURL(urlToUnblockFormatted)) {
      alert("Invalid URL. Please enter a valid website URL.");
      return;
    }

    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      const blockedWebsites = rules.reduce((acc, rule) => {
        if (rule.action.type === "block") {
          acc[rule.condition.urlFilter] = rule.id;
        }
        return acc;
      }, {});

      if (!(urlToUnblockFormatted in blockedWebsites)) {
        alert(`${urlToUnblockFormatted} is not blocked`);
        return;
      }

      const unblockRuleId = blockedWebsites[urlToUnblockFormatted];
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
            alert(
              `${urlToUnblockFormatted} is now unblocked! Reload this page!`
            );
            setBlocked(false);

            chrome.storage.sync.get(
              "blockedWebsites",
              ({ blockedWebsites }) => {
                if (blockedWebsites) {
                  blockedWebsites.pop();
                  chrome.storage.sync.set({ blockedWebsites });
                }
              }
            );
          }
        }
      );
    });
  };

  // const injectErrorPage = (tabId) => {
  //   chrome.scripting.executeScript(
  //     {
  //       target: { tabId: tabId },
  //       func: () => {
  //         document.body.innerHTML = generateHTML404();
  //         document.head.innerHTML = generateStyles();
  //       },
  //     },
  //     () => {
  //       if (chrome.runtime.lastError) {
  //         console.error("Script injection failed:", chrome.runtime.lastError);
  //       } else {
  //         console.log("Script injected successfully");
  //       }
  //     }
  //   );
  //   setBlocked(true);
  // };

  // useEffect(() => {
  //   const navigationListener = (details) => {
  //     if (blocked && details.tabId && details.url === urlToBlock.trim()) {
  //       injectErrorPage(details.tabId);
  //     }
  //   };

  //   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //     console.log('tab object',tab);
  //     console.log('chang info',changeInfo);
  //     console.log('tab id that was found',tabId);
  //     if (changeInfo.status === "complete"|| changeInfo.status === "loading") {
  //       const url  = tab.url;
  //       if (isURLBlocked(url)) {
  //         inject404Page(tabId);
  //       }
  //     }
  //   });
  //   chrome.webNavigation.onCommitted.addListener(navigationListener);

  //   return () => {
  //     chrome.webNavigation.onCommitted.removeListener(navigationListener);
  //   };
  // }, [blocked, urlToBlock]);

  return (
    <div className="App">
      <h1>WBE</h1>
      <div className="inputs-box">
      <input
        type="text"
        value={urlToBlock}
        onChange={(e) => setUrlToBlock(e.target.value)}
        placeholder="Enter URL to block"
      />
      <div className="button-box">
        <button onClick={blockSite}>Block</button>
        <button onClick={unblockSite}>Unblock</button>
      </div>
    </div>
    </div>
  );
}

export default App;
