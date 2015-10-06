var km = {
    timeout: undefined,
    matchesQtd: 0,
    start: undefined,
    stop: undefined,
    update: undefined,
    asc: undefined,
    desc: undefined,
    qtd: undefined,
    menuDiv: undefined,
    resultDiv: undefined,
    checkboxSpoiler: undefined,
    GetMatchesResult: function(){
        var results = document.getElementsByClassName("result-marker");
        var matchesResult = [];
        for (var i = 0; i < results.length; i++) {
            if (results[i].classList[0] === "game-summary-defeat") {
                matchesResult.push("#A00");
            } else {
                matchesResult.push("#0A0");
            }
        }
        return matchesResult;
    },
    GetMatchesDate: function () {
        var dates = document.getElementsByClassName("date-duration-date");
        var datesList = [];
        for (var i = 0; i < dates.length; i++) {
            datesList.push(dates[i].childNodes[0].childNodes[0].nodeValue);
        }
        return datesList;
    },
    GetChampionsName: function () {
        var names = document.getElementsByClassName("champion-nameplate-name");
        var namesList = [];
        for (var i = 0; i < names.length; i++) {
            namesList.push(names[i].childNodes[1].childNodes[0].nodeValue);
        }
        km.matchesQtd = namesList.length;
        return namesList;
    },
    GetMatchesInfo: function () {
        var names = km.GetChampionsName();
        var dates = km.GetMatchesDate();
        var results = km.GetMatchesResult();
        var matches = [];
        for (var i = 0; i < names.length; i++) {
            matches.push({
                champion: names[i],
                championLetter: names[i].charAt(0),
                date: dates[i],
                result: (results[i] === "#0A0"),
                resultColor: results[i]
            });
        }

        return matches;
    },
    GetAscendingHTML: function () {
        var matches = km.GetMatchesInfo();
        var html = "";
        for (var i = matches.length - 1; i >= 0; i--) {
            var style = km.checkboxSpoiler.checked ? 'style="background-color: ' + matches[i].resultColor + ';"' : '';
            var color = km.checkboxSpoiler.checked ? matches[i].resultColor : "#000";
            html += '<span ' + style +
                'onmouseout="this.style.backgroundColor = \'' + color + '\';" ' +
                'onmouseover="this.style.backgroundColor = \'#00A\';" ' +
                'onclick="document.getElementsByClassName(\'game-summary\')[' + i + '].click()" ' +
                ' title="' + (matches[i].result ? 'W: ' : 'L: ') + matches[i].champion + ' - ' + matches[i].date + ' ">' +
                matches[i].championLetter + '</span>';
        }
        km.matchesQtd = matches.length;
        return html;
    },
    GetDescendingHTML: function () {
        var matches = km.GetMatchesInfo();
        var html = "";
        for (var i = 0; i < matches.length; i++) {
            var style = km.checkboxSpoiler.checked ? 'style="background-color: ' + matches[i].resultColor + ';"' : '';
            var color = km.checkboxSpoiler.checked ? matches[i].resultColor : "#000";
            html += '<span ' + style +
                'onmouseout="this.style.backgroundColor = \'' + color + '\';" ' +
                'onmouseover="this.style.backgroundColor = \'#00A\';" ' +
                'onclick="document.getElementsByClassName(\'game-summary\')[' + i + '].click()" ' +
                ' title="' + (matches[i].result ? 'W: ' : 'L: ') + matches[i].champion + ' - ' + matches[i].date + ' ">' +
                matches[i].championLetter + '</span>';
        }
        km.matchesQtd = matches.length;
        return html;
    },
    LoopScroll: function () {
        var date = km.GetMatchesDate().pop();
        if (date === "1/5/2014" || date === "30/4/2014") {
            km.start.disabled = false;
            km.stop.disabled = true;
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
        msg += km.GetAscendingHTML();
        km.asc.innerHTML = msg;
        msg = "Desc: ";
        msg += km.GetDescendingHTML();
        km.desc.innerHTML = msg;
        msg = "Matches found: " + km.matchesQtd;
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
        btn.addEventListener("click", km.UpdateShow);
        div.appendChild(btn);
        km.update = btn;
        btn = document.createElement("input");
        btn.setAttribute("type", "checkbox");
        div.appendChild(btn);
        km.checkboxSpoiler = btn;
        document.body.appendChild(div);
        km.menuDiv = div;
        div = document.createElement("div");
        div.setAttribute("style", "margin: 5px; color: white; z-index: 100; background-color: black;");
        document.body.appendChild(div);
        km.asc = document.createElement("div");
        km.desc = document.createElement("div");
        km.qtd = document.createElement("div");
        div.appendChild(km.asc);
        div.appendChild(km.desc);
        div.appendChild(km.qtd);
        km.resultDiv = div;
    },
    DestroySelf: function () {
        document.body.removeChild(km.menuDiv);
        document.body.removeChild(km.resultDiv);
        km = undefined;
    }
};

km.Attach();
