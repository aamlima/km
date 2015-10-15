var kmv2 = {
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
    gamesCodex: undefined,
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
        kmv2.matchesQtd = namesList.length;
        return namesList;
    },
    GetMatchesInfo: function () {
        var names = kmv2.GetChampionsName();
        var dates = kmv2.GetMatchesDate();
        var results = kmv2.GetMatchesResult();
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
        var matches = kmv2.GetMatchesInfo();
        var html = "";
        for (var i = matches.length - 1; i >= 0; i--) {
            var style = kmv2.checkboxSpoiler.checked ? 'style="background-color: ' + matches[i].resultColor + ';"' : '';
            var color = kmv2.checkboxSpoiler.checked ? matches[i].resultColor : "#000";
            html += '<span ' + style +
                'onmouseout="this.style.backgroundColor = \'' + color + '\';" ' +
                'onmouseover="this.style.backgroundColor = \'#00A\';" ' +
                'onclick="document.getElementsByClassName(\'game-summary\')[' + i + '].click()" ' +
                ' title="' + (matches[i].result ? 'W: ' : 'L: ') + matches[i].champion + ' - ' + matches[i].date + ' ">' +
                matches[i].championLetter + '</span>';
        }
        kmv2.matchesQtd = matches.length;
        return html;
    },
    GetDescendingHTML: function () {
        var matches = kmv2.GetMatchesInfo();
        var html = "";
        for (var i = 0; i < matches.length; i++) {
            var style = kmv2.checkboxSpoiler.checked ? 'style="background-color: ' + matches[i].resultColor + ';"' : '';
            var color = kmv2.checkboxSpoiler.checked ? matches[i].resultColor : "#000";
            html += '<span ' + style +
                'onmouseout="this.style.backgroundColor = \'' + color + '\';" ' +
                'onmouseover="this.style.backgroundColor = \'#00A\';" ' +
                'onclick="document.getElementsByClassName(\'game-summary\')[' + i + '].click()" ' +
                ' title="' + (matches[i].result ? 'W: ' : 'L: ') + matches[i].champion + ' - ' + matches[i].date + ' ">' +
                matches[i].championLetter + '</span>';
        }
        kmv2.matchesQtd = matches.length;
        return html;
    },
    LoopScroll: function () {
        var date = kmv2.GetMatchesDate().pop();
        if (date === "1/5/2014" || date === "30/4/2014") {
            kmv2.start.disabled = false;
            kmv2.stop.disabled = true;
        } else {
            window.scrollTo(0, document.body.scrollHeight);
            kmv2.start.disabled = true;
            kmv2.stop.disabled = false;
            kmv2.timeout = setTimeout(kmv2.LoopScroll, 1000);
        }
    },
    ClearScroll: function () {
        kmv2.start.disabled = false;
        kmv2.stop.disabled = true;
        clearTimeout(kmv2.timeout);
    },
    UpdateShow: function () {
        var msg = "Asc: ";
        msg += kmv2.GetAscendingHTML();
        kmv2.asc.innerHTML = msg;
        msg = "Desc: ";
        msg += kmv2.GetDescendingHTML();
        kmv2.desc.innerHTML = msg;
        msg = "Matches found: " + kmv2.matchesQtd;
        kmv2.qtd.innerHTML = msg;
    },
    Attach: function () {
        var div = document.createElement("div");
        div.setAttribute("style", "position: fixed; top: 5px; left: 5px; border: 2px solid black; padding: 2px; z-index: 3000001; background-color: white;");
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Start");
        btn.addEventListener("click", kmv2.LoopScroll);
        div.appendChild(btn);
        kmv2.start = btn;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Stop");
        btn.addEventListener("click", kmv2.ClearScroll);
        div.appendChild(btn);
        kmv2.stop = btn;
        kmv2.stop.disabled = true;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Update Text");
        btn.addEventListener("click", kmv2.UpdateShow);
        div.appendChild(btn);
        kmv2.update = btn;
        btn = document.createElement("input");
        btn.setAttribute("type", "checkbox");
        div.appendChild(btn);
        kmv2.checkboxSpoiler = btn;
        document.body.appendChild(div);
        kmv2.menuDiv = div;
        div = document.createElement("div");
        div.setAttribute("style", "margin: 5px; color: white; z-index: 100; background-color: black;");
        document.body.appendChild(div);
        kmv2.asc = document.createElement("div");
        kmv2.desc = document.createElement("div");
        kmv2.qtd = document.createElement("div");
        div.appendChild(kmv2.asc);
        div.appendChild(kmv2.desc);
        div.appendChild(kmv2.qtd);
        kmv2.resultDiv = div;
        kmv2.gamesCodex = Ramen.getCollection("Games");
    },
    DestroySelf: function () {
        document.body.removeChild(kmv2.menuDiv);
        document.body.removeChild(kmv2.resultDiv);
        kmv2 = undefined;
    },
    Test: function () {
        var user = Codex.getContextUser();
        var region = user.get('region');
        var id = user.get('id');
        for (var i = kmv2.gamesCodex.pager.page; i < kmv2.gamesCodex.pager.pages; i++) {
            kmv2.gamesCodex.next(region, id);
        }
    }
};

kmv2.Attach();
