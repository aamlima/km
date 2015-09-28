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
    //match-history-list-9-list
    GetMatchsDate: function () {
        var dates = document.getElementsByClassName("date-duration-date");
        var datesList = [];
        var i;
        for (i = 0; i < dates.length; i++) {
            datesList.push(dates[i].childNodes[0].childNodes[0].nodeValue);
        }
        return datesList;
    },
    GetLastMatchDate: function () {
        var dates = document.getElementsByClassName("date-duration-date");
        var lastDateElem = dates[dates.length - 1];
        return lastDateElem.childNodes[0].childNodes[0].nodeValue;
    },
    GetChampionsName: function () {
        var names = document.getElementsByClassName("champion-nameplate-name");
        var namesList = [];
        var i;
        for (i = 0; i < names.length; i++) {
            namesList.push(names[i].childNodes[1].childNodes[0].nodeValue);
        }
        km.matchsQtd = namesList.length;
        return namesList;
    },
    GetChampionsFirstLetter: function(){
        var nameList = km.GetChampionsName();
        var letters = "";
        var i;
        for (i = 0; i < nameList.length; i++) {
            letters += nameList[i].charAt(0);
        }
        return letters;
    },
    GetReverseChampionsLetter: function(){
        var letters = km.GetChampionsFirstLetter();
        var reverseLetters = "";
        var i;
        for (i = letters.length - 1; i >= 0; i--) {
            reverseLetters += letters[i];
        }
        return reverseLetters;
    },
    GetAscendingHTML: function () {
        var names = document.getElementsByClassName("champion-nameplate-name");
        var dates = document.getElementsByClassName("date-duration-date");
        var ascendingHTML = "";
        var i;
        for (i = names.length - 1; i >= 0; i--) {
            var name = names[i].childNodes[1].childNodes[0].nodeValue;
            var date = dates[i].childNodes[0].childNodes[0].nodeValue;
            ascendingHTML += '<span title="' + name + ' - ' + date + '">' + name.charAt(0) + '</span>';
            //<a href="https://support.riotgames.com/hc/pt-br">Suporte</a>
        }
        km.matchsQtd = names.length;
        return ascendingHTML;
    },
    GetDescendingHTML: function () {
        var names = document.getElementsByClassName("champion-nameplate-name");
        var dates = document.getElementsByClassName("date-duration-date");
        var descendingHTML = "";
        var i;
        for (i = 0; i < names.length; i++) {
            var name = names[i].childNodes[1].childNodes[0].nodeValue;
            var date = dates[i].childNodes[0].childNodes[0].nodeValue;
            descendingHTML += '<span title="' + name + ' - ' + date + '">' + name.charAt(0) + '</span>';
            //<a href="https://support.riotgames.com/hc/pt-br">Suporte</a>
        }
        km.matchsQtd = names.length;
        return descendingHTML;
    },
    LoopScroll: function () {
        var date = km.GetLastMatchDate()
        if (date === "1/5/2014" || date === "30/4/2014") {
            km.start.disabled = false;
            km.stop.disabled = true;
            km.msg = "Desc:\n";
            km.msg += km.GetChampionsFirstLetter();
            km.msg += "\nAsc:\n";
            km.msg += km.GetReverseChampionsLetter();
            km.msg += "\nMatchs found: " + km.matchsQtd;
            var msg = "Desc:\n";
            msg += km.GetChampionsFirstLetter();
            km.desc.innerHTML = msg;
            msg = "\nAsc:\n";
            msg += km.GetReverseChampionsLetter();
            km.asc.innerHTML = msg;
            msg = "\nMatchs found: " + km.matchsQtd;
            km.qtd.innerHTML = msg;
        } else {
            window.scrollTo(0, document.body.scrollHeight);
            km.start.disabled = true;
            km.stop.disabled = false;
            km.timeout = setTimeout(km.LoopScroll, 1000);
        }
    },
    ClearScroll: function () {
        km.start.disabled = false;
        km.stop.disabled = true;
        clearTimeout(km.timeout);
    },
    UpdateShow: function () {
        var msg = "Asc: ";
        msg += km.GetReverseChampionsLetter();
        km.asc.innerHTML = msg;
        msg = "Desc: ";
        msg += km.GetChampionsFirstLetter();
        km.desc.innerHTML = msg;
        msg = "Matchs found: " + km.matchsQtd;
        km.qtd.innerHTML = msg;
    },
    UpdateShow2: function () {
        var msg = "Asc: ";
        msg += km.GetAscendingHTML();
        km.asc.innerHTML = msg;
        msg = "Desc: ";
        msg += km.GetDescendingHTML();
        km.desc.innerHTML = msg;
        msg = "Matchs found: " + km.matchsQtd;
        km.qtd.innerHTML = msg;
    },
    Attach: function () {
        var div = document.createElement("div");
        div.setAttribute("style", "position: fixed; top: 5px; left: 5px; border: 2px solid black; padding: 2px; z-index: 3000001; background-color: white;");
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Start");
        btn.addEventListener("click", km.LoopScroll);
        div.appendChild(btn);
        km.start = btn;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Stop");
        btn.addEventListener("click", km.ClearScroll);
        div.appendChild(btn);
        km.stop = btn;
        km.stop.disabled = true;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Update Text");
        btn.addEventListener("click", km.UpdateShow2);
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

km.Attach();
