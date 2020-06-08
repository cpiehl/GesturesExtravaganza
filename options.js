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


defaultGestures = {
    "D" : "newtab",
    "R" : "forward",
    "L" : "back",
    "DR": "closetab",
    "DU": "clonetab",
};

commandTrans = {
    "History Back":"back",
    "History Forward":"forward",
    "Reload":"reload",
    "Stop Loading":"stop",
    "Open New Tab":"newtab",
    "Close Current Tab":"closetab",
    "Clone Current Tab":"clonetab",
    "Close Background Tabs":"closeback",
    "Close Window":"closeall",
    "Reload All Tabs":"reloadall",
    "Next Tab":"nexttab",
    "Previous Tab":"prevtab",
    "Scroll to Top":"scrolltop",
    "Scroll to Bottom":"scrollbottom",
    "Re-open Last Closed Tab":"lasttab",
};

function invertHash(hash) {
    inv = {};
    for (var key in hash)
        inv[hash[key]] = key;
    return inv;
}

function fillMenu() {
    var table, tr, td, inp;

    table = document.getElementById("optsTab");

    for (var key in commandTrans) {
        tr = table.insertRow(table.rows.length);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(key));
        tr.appendChild(td);
        td = document.createElement('td');
        inp = document.createElement('input');
        inp.type = 'text';

        if (gestures[commandTrans[key]]) {
            inp.value = gestures[commandTrans[key]];
        }

        td.align = 'center';
        tr.appendChild(td);
        td.appendChild(inp);
    }
}


// Saves options to localStorage.
function saveOptions() {
    var select;

    select = document.getElementById("width");
    localStorage.width = select.children[select.selectedIndex].value;

    var rocker = document.getElementById('rocker');
    localStorage.rocker = rocker.checked;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Configuration Saved";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        s = inputs[i].parentElement.parentElement.children[0].textContent;
        if (inputs[i].value.length > 0)
            localStorage.setItem(commandTrans[s], inputs[i].value);
        else
            localStorage.removeItem(commandTrans[s]);
    }

}

// Restores select box state to saved value from localStorage.
function restoreOptions() {
    var i;

	var rocker = document.getElementById("rocker");
    rocker.checked = localStorage.rocker == 'true';

    var select = document.getElementById('width');
	var value = localStorage.width;
	if (false === value) {
		value = 3;
	}
	for (i = 0; i < select.children.length; i++) {
		var child2 = select.children[i];
		if (child2.value === value) {
			child2.selected = "true";
			break;
		}
    }

    gestures = {};

    for (i = 0; i < localStorage.length; i++){
        // if (Object.keys(commandTrans).findIndex((c) => key === c) >= 0) {
        //     console.log(key);
        // }
        var key = localStorage.key(i);
        if (key === 'colorCode' || key === 'width') {
            continue;
        }
        gestures[key] = localStorage[key];
    }

    if (Object.keys(gestures).length === 0) {
        console.log("loading default gestures");
        gestures = invertHash(defaultGestures);
    }
    console.log(gestures);
}

function loadInfo() {
    restoreOptions();
    fillMenu();
}

document.addEventListener('DOMContentLoaded', loadInfo);
document.getElementById('save').addEventListener('click', saveOptions);
