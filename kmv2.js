var kmv2 = {
    start: undefined,
    update: undefined,
    asc: undefined,
    desc: undefined,
    qtd: undefined,
    menuDiv: undefined,
    resultDiv: undefined,
    gamesCodex: undefined,
    games: undefined,
    UpdateShow: function () {
        kmv2.games.sort(function (a, b) { return b.gameCreation - a.gameCreation; });
        kmv2.asc.innerHTML = "";
        kmv2.desc.innerHTML = "";
        kmv2.qtd.innerHTML = kmv2.games.length;
        for (var i = 0; i < kmv2.games.length; i++) {
            kmv2.asc.innerHTML += Riot.DDragon.models.champion.remapKeys[kmv2.games[kmv2.games.length - i - 1].participants[0].championId][0];
            kmv2.desc.innerHTML += Riot.DDragon.models.champion.remapKeys[kmv2.games[i].participants[0].championId][0];
        }
    },
    Attach: function () {
        var div = document.createElement("div");
        div.setAttribute("style", "position: fixed; top: 5px; left: 5px; border: 2px solid black; padding: 2px; z-index: 3000001; background-color: white;");
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Pegar partidas");
        btn.addEventListener("click", kmv2.Test);
        div.appendChild(btn);
        kmv2.start = btn;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Mostrar resultado");
        btn.addEventListener("click", kmv2.UpdateShow);
        div.appendChild(btn);
        kmv2.update = btn;
        kmv2.update.disabled = true;
        document.body.appendChild(div);
        kmv2.menuDiv = div;
        div = document.createElement("div");
        div.setAttribute("style", "margin: 5px; color: white; z-index: 100; background-color: black;");
        $("body").prepend(div);
        kmv2.asc = document.createElement("div");
        kmv2.desc = document.createElement("div");
        kmv2.qtd = document.createElement("div");
        div.appendChild(document.createElement("br"));
        div.appendChild(kmv2.asc);
        div.appendChild(kmv2.desc);
        div.appendChild(kmv2.qtd);
        kmv2.resultDiv = div;
        kmv2.gamesCodex = Ramen.getCollection("Games");
        return kmv2.SetHeaders();
    },
    DestroySelf: function () {
        document.body.removeChild(kmv2.menuDiv);
        document.body.removeChild(kmv2.resultDiv);
        kmv2 = undefined;
    },
    Test: function () {
        kmv2.games = [];
        var user = Codex.getContextUser();
        var region = user.get('region');
        var id = user.get('id');

        for (var i = 0; i < Math.ceil(kmv2.gamesCodex.pager.total / 20) ; i++) {
            var startIndex = i * 20;
            var endIndex = startIndex + 20;
            var queryString = '?begIndex=' + startIndex + '&endIndex=' + endIndex + '&' + kmv2.gamesCodex.getFilters();
            var url = Codex.util.ACS.getPlayerHistory(region, id, queryString);

            Codex.util.ACS.makeRequest({
                url: url,
                listeners: {
                    load: kmv2.onHistoryLoad,
                    error: kmv2.onPromiseError,
                    scope: kmv2
                }
            });
        }
        kmv2.start.disabled = true;

    },
    onHistoryLoad: function (d, c) {
        kmv2.games = kmv2.games.concat(c.games.games);
        kmv2.update.disabled = false;
        kmv2.start.setAttribute("value", (kmv2.games.length / kmv2.gamesCodex.pager.total) * 100 + "%");
        Codex.util.ACS.destroyPromise(d);
    },
    onPromiseError: function (c, a, b) {
        console.log("Error kmv2 onPromiseError - " + a + " - " + b);
        kmv2.start.disabled = false;
        kmv2.start.setAttribute("value", "Pegar partidas");
        Codex.util.ACS.destroyPromise(c);
    },
    SetHeaders: function () {
        
        var token = prompt("Insira o token: ");
        if (token === "") return false;

        var user = Codex.model.CurrentUser,
        vaporRegion = user.getVaporRegion(),
        header;

        header = {
            Region: vaporRegion
        };

        header.Authorization = 'Vapor ' + token;

        Codex.util.ACS.setHeaders(header);

        user = Codex.getContextUser();
        var region = user.get('region');
        var id = user.get('id');
        var startIndex = 5;
        var endIndex = 15;
        var queryString = '?begIndex=' + startIndex + '&endIndex=' + endIndex + '&' + kmv2.gamesCodex.getFilters();
        var url = Codex.util.ACS.getPlayerHistory(region, id, queryString);

        Codex.util.ACS.makeRequest({
            url: url,
            listeners: {
                load: kmv2.onHeaderUpdate,
                error: kmv2.onPromiseError,
                scope: kmv2
            }
        });
        kmv2.start.disabled = true;
        return true;
    },
    onHeaderUpdate: function (d, c) {
        kmv2.start.disabled = false;
        kmv2.start.setAttribute("value", "Pegar partidas");
        kmv2.gamesCodex.readPager(c.games);
        Codex.util.ACS.destroyPromise(d);
    },
    GetToken: function () {
        return Codex.model.CurrentUser.getToken();
    }
};

kmv2.Attach();
