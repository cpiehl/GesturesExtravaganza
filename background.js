/*   
 *  Copyright (C) 2013  AJ Ribeiro
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.   
*/

var commands = {
    'newtab': function(request, sender, sendResponse) {
        chrome.tabs.create({});
        sendResponse({resp: 'tab open'});
    },
    'closetab': function(request, sender, sendResponse) {
        chrome.tabs.query({active: true}, function(tabs) {
            chrome.tabs.remove(tabs[0].id);
        });
        sendResponse({resp: 'tab closed'});
    },
    'clonetab': function(request, sender, sendResponse) {
        chrome.tabs.query({active: true}, function(tabs) {
            chrome.tabs.create({
                url: tabs[0].url,
                active: true, // TODO: should the clone be active?
            });
        });
        sendResponse({resp: 'tab cloned'});        
    },
    'gestures': function(request, sender, sendResponse) {
        gestures = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            gestures[key] = localStorage[key];
        }
        sendResponse({resp: gestures});
    },
    'rocker': function(request, sender, sendResponse) {
        sendResponse({resp: localStorage.rocker});
    },
    // 'lasttab': function(request, sender, sendResponse) {
    //     chrome.storage.local.get('lasturl', function(result) {
    //         chrome.tabs.create({'url': result.lasturl}, function(tab) {});
    //     });
    //     sendResponse({resp: 'tab opened'});
    // },
    // 'reloadall': function(request, sender, sendResponse) {
    //     chrome.tabs.getAllInWindow(null, function(tabs) {
    //         for(var i = 0; i < tabs.length; i++)
    //             chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
    //     });
    //     sendResponse({resp: 'tabs reloaded'});
    // },
    // 'nexttab': function(request, sender, sendResponse) {
    //     chrome.tabs.getSelected(null, function(tab) {
    //         chrome.tabs.getAllInWindow(null, function(tabs) {
    //             for(var i = 0; i < tabs.length; i++){
    //                 if(tabs[i].id === tab.id){
    //                     if (i === tabs.length - 1)
    //                         chrome.tabs.update(tabs[0].id, {active: true});
    //                     else
    //                         chrome.tabs.update(tabs[i + 1].id, {active: true});
    //                     break;
    //                 }
    //             }
    //         });
    //     });
    //     sendResponse({resp: 'tab switched'});
    // },
    // 'prevtab': function(request, sender, sendResponse) {
    //     chrome.tabs.getSelected(null, function(tab) {
    //         chrome.tabs.getAllInWindow(null, function(tabs) {
    //             for (var i = 0; i < tabs.length; i++) {
    //                 if (tabs[i].id === tab.id) {
    //                     if (i === 0)
    //                         chrome.tabs.update(tabs[tabs.length - 1].id, {active: true});
    //                     else
    //                         chrome.tabs.update(tabs[i - 1].id, {active: true});
    //                     break;
    //                 }
    //             }
    //         });
    //     });
    //     sendResponse({resp: 'tab switched'});
    // },
    // 'closeback': function(request, sender, sendResponse) {
    //     chrome.tabs.getSelected(null, function(tab) {
    //         chrome.tabs.getAllInWindow(null, function(tabs) {
    //             for (var i = 0; i < tabs.length; i++) {
    //                 if (tabs[i].id != tab.id)
    //                     chrome.tabs.remove(tabs[i].id);
    //             }
    //         });
    //     });
    //     sendResponse({resp: 'background closed'});
    // },
    // 'closeall': function(request, sender, sendResponse) {
    //     chrome.tabs.getAllInWindow(null, function(tabs) {
    //         for (var i = 0; i < tabs.length; i++)
    //             chrome.tabs.remove(tabs[i].id);
    //     });
    //     sendResponse({resp: 'tabs closed'});
    // },
};

// chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
//     chrome.tabs.get(tabId, function(tab) {
//         var x = tabId.toString();
//         chrome.storage.local.get(x, function(items) {
//             chrome.storage.local.set({'lasturl': items[x].slice(9)}, function() {});
//             chrome.storage.local.remove(x, function(Items) {});
//         });
//     });
// });

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     chrome.tabs.get(tabId, function(tab) {
//         var kk = tabId.toString();
//         var x = {};
//         x[kk] += tab.url;
//         // chrome.storage.local.set(x, function() {});
//         chrome.storage.local.set(kk, x);
//     });
// });

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (commands[request.msg]) {
        commands[request.msg](request, sender, sendResponse);
    }

    sendResponse({resp: "probs"});
});
