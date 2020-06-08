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

var MouseButtons = Object.freeze({"Left":1, "Middle":2, "Right":3,});

var mousedown = [false, false, false];
var moved = false;
var rocker = false;
var mx, my, nx, ny, lx, ly, phi;
var move = '', omove = '';
var tau = 2 * Math.PI;
var quarterPi = Math.PI / 4.0;
var suppress = true;
var myGestures, gestures_inv;
var loaded = false;
var rocked = false;
var link = null;

function invertHash(hash) {
    inv = {};
    for (var key in hash)
        inv[hash[key]] = key;
    return inv;
}

document.onmousedown = function(event) {
    mousedown[event.which] = true;
    if (false === loaded) {
        loadOptions();
        loaded = true;
    }

    // left rock
    if (event.which === MouseButtons.Left && mousedown[MouseButtons.Right] && rocker) {
        move = 'back';
        exeRock();
    }

    // right mouse click
    else if (event.which === MouseButtons.Right) {

        // right rock
        if (mousedown[MouseButtons.Left] && rocker) {
            move = 'forward';
            exeRock();
        }
        else {
            my = event.pageX;
            mx = event.pageY;
            lx = my;
            ly = mx;
            move = '';
            omove = '';
            moved = false;
            if (event.target.href) {
                link = event.target.href;
            }
            else if (event.target.parentElement.href) {
                link = event.target.parentElement.href;
            }
            else {
                link = null;
            }
        }
    }
};

document.onmousemove = function(event) {
    // track the mouse if we are holding the right button
    if (mousedown[MouseButtons.Right]) {
        ny = event.pageX;
        nx = event.pageY;
        var distance2 = Math.pow(nx - mx, 2) + Math.pow(ny - my, 2);

        if (distance2 > 256) {
            var tmove = '';
            phi = Math.atan2(ny - my, nx - mx);
            if (phi < 0)
                phi += tau;
            if (phi >= quarterPi && phi < 3.0 * quarterPi)
                tmove = 'R';
            else if (phi >= 3.0 * quarterPi && phi < 5.0 * quarterPi)
                tmove = 'U';
            else if (phi >= 5.0 * quarterPi && phi < 7.0 * quarterPi)
                tmove = 'L';
            else if (phi >= 7.0 * quarterPi || phi < quarterPi)
                tmove = 'D';

            if (tmove != omove) {
                move += tmove;
                omove = tmove;
            }

            moved = true;

            mx = nx;
            my = ny;
        }
    }
};

document.onmouseup = function(event) {
    mousedown[event.which] = false;

    // right mouse release
    if (event.which === MouseButtons.Right) {
        if (moved) {
            exeFunc(); // perform right click gesture
        }
        else if (rocked) {
            rocked = false;
        }
        else {
            suppress = false;
            document.getElementById('target').mousedown({which: 3});
        }
    }
};

function exeRock() {
    if (move === "back") {
        window.history.back();
    }
    else if (move === "forward") {
        window.history.forward();
    }

    rocked = true;
    suppress = true;
}

function exeFunc() {
    
    if (gestures_inv[move]) {
        action = gestures_inv[move];
        if (action === "back") {
            window.history.back();
        }
        else if (action === "forward") {
            window.history.forward();
        }
        else if (action === "newtab") {
            if (link === null) {
                browser.runtime.sendMessage({msg: "newtab"}, function(response) {
                    if (response !== null) {
                        console.log(response.resp);
                    }
                    else {
                        console.log('problem executing open tab');
                        if (chrome.extension.lastError) {
                            console.log(chrome.extension.lastError.message);
                        }
                    }
                });
            }
            else {
                window.open(link);
            }
        }
        else if (action === "scrolltop") {
            window.scrollTo(0, 0);
        }
        else if (action === "scrollbottom") {
            window.scrollTo(0, document.body.scrollHeight);
        }
        else if (action === "reload") {
            window.location.reload();
        }
        else if (action === "stop") {
            window.stop();
        }

        // if nothing else, pass action on to background.js
        else {
            browser.runtime.sendMessage({msg: action});
        }
    }
}

document.oncontextmenu = function(e) {
    if (suppress) {
        console.log('oncontextmenu suppress');
        e.preventDefault();
        return false;
    }
    else {
        console.log('oncontextmenu allow');
        suppress = true;
        return true;
    }
};

function loadOptions(name) {

    browser.runtime.sendMessage({msg: "gestures"}, function(response) {
        if (response) {
            gestures_inv = invertHash(response.resp);
        }
    });

    browser.runtime.sendMessage({msg: "rocker"}, function(response) {
        rocker = response && response.resp == 'true';
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
