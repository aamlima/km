
"use strict";
var km = {
    timeout: undefined,
    matchsQtd: 0,
    msg: "",
    start: undefined,
    stop: undefined,
    update: undefined,
    asc: undefined,
    desc: undefined,
    qtd: undefined,
    getLastMatchDate: function () {
        var dates = document.getElementsByClassName("date-duration-date");
        var lastDateElem = dates[dates.length - 1];
        return lastDateElem.childNodes[0].childNodes[0].nodeValue;
    },
    getChampionsName: function () {
        var names = document.getElementsByClassName("champion-nameplate-name");
        var namesList = [];
        var i;
        for (i = 0; i < names.length; i++) {
            namesList.push(names[i].childNodes[1].childNodes[0].nodeValue);
        }
        km.matchsQtd = namesList.length;
        return namesList;
    },
    getChampionsFirstLetter: function(){
        var nameList = km.getChampionsName();
        var letters = "";
        var i;
        for (i = 0; i < nameList.length; i++) {
            letters += nameList[i].charAt(0);
        }
        return letters;
    },
    getReverseChampionsLetter: function(){
        var letters = km.getChampionsFirstLetter();
        var reverseLetters = "";
        var i;
        for (i = letters.length - 1; i >= 0; i--) {
            reverseLetters += letters[i];
        }
        return reverseLetters;
    },
    loopScroll: function () {
        var date = km.getLastMatchDate()
        if (date === "1/5/2014" || date === "30/4/2014") {
            km.start.disabled = false;
            km.stop.disabled = true;
            km.msg = "Desc:\n";
            km.msg += km.getChampionsFirstLetter();
            km.msg += "\nAsc:\n";
            km.msg += km.getReverseChampionsLetter();
            km.msg += "\nMatchs found: " + km.matchsQtd;
            var msg = "Desc:\n";
            msg += km.getChampionsFirstLetter();
            km.desc.innerHTML = msg;
            msg = "\nAsc:\n";
            msg += km.getReverseChampionsLetter();
            km.asc.innerHTML = msg;
            msg = "\nMatchs found: " + km.matchsQtd;
            km.qtd.innerHTML = msg;
        } else {
            window.scrollTo(0, document.body.scrollHeight);
            km.start.disabled = true;
            km.stop.disabled = false;
            km.timeout = setTimeout(km.loopScroll, 1000);
        }
    },
    clearScroll: function () {
        km.start.disabled = false;
        km.stop.disabled = true;
        clearTimeout(km.timeout);
    },
    updateShow: function() {
        var msg = "Desc:\n";
        msg += km.getChampionsFirstLetter();
        km.desc.innerHTML = msg;
        msg = "\nAsc:\n";
        msg += km.getReverseChampionsLetter();
        km.asc.innerHTML = msg;
        msg = "\nMatchs found: " + km.matchsQtd;
        km.qtd.innerHTML = msg;
    },
    attach: function () {
        var div = document.createElement("div");
        div.setAttribute("style", "position: fixed; top: 5px; left: 5px; border: 2px solid black; padding: 2px; z-index: 100; background-color: white;");
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Start");
        btn.addEventListener("click", km.loopScroll);
        div.appendChild(btn);
        km.start = btn;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Stop");
        btn.addEventListener("click", km.clearScroll);
        div.appendChild(btn);
        km.stop = btn;
        km.stop.disabled = true;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Update");
        btn.addEventListener("click", km.updateShow);
        div.appendChild(btn);
        km.update = btn;
        document.body.appendChild(div);
        div = document.createElement("div");
        div.setAttribute("style", "margin: 5px; color:white; z-index: 100; background-color: black;");
        document.body.appendChild(div);
        km.asc = document.createElement("div");
        km.desc = document.createElement("div");
        km.qtd = document.createElement("div");
        div.appendChild(km.asc);
        div.appendChild(km.desc);
        div.appendChild(km.qtd);
    }
};

km.attach();
