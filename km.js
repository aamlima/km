var km = {
    start: undefined,
    update: undefined,
    asc: undefined,
    desc: undefined,
    qtd: undefined,
    menuDiv: undefined,
    resultDiv: undefined,
    infoDiv: undefined,
    gamesCodex: undefined,
    games: undefined,
    UpdateShow: function () {
        km.games.sort(function (a, b) { return b.gameCreation - a.gameCreation; });
        km.asc.innerHTML = "Crescente:<br>";
        km.desc.innerHTML = "Decrescente:<br>";
        km.qtd.innerHTML = "Partidas encontradas/total: " + km.games.length + "/" + km.gamesCodex.pager.total;
        var result = [{ game: undefined, html: "", index: undefined }, { game: undefined, html: "", index: undefined }];
        for (var i = 0; i < km.games.length; i++) {
            result[0].index = km.games.length - i - 1;
            result[1].index = i;
            result[0].game = km.games[km.games.length - i - 1];
            result[1].game = km.games[i];
            for (var j = 0; j < result.length; j++) {
                result[j].html +=
                "<a style=\"color: white;\" href=\"#match-details/BR1/" + result[j].game.gameId + "/" + result[j].game.player.currentAccountId +
                "\" onmouseover=\"km.SetInfo("+result[j].index+");\" onmouseout=\"km.HideInfo();\">" + result[j].game.championName[0] + "</a>";
            }
        }

        km.asc.innerHTML += result[0].html;
        km.desc.innerHTML += result[1].html;
    },
    Attach: function () {
        var div = document.createElement("div");
        div.setAttribute("style", "position: fixed; top: 5px; left: 5px; border: 2px solid black; padding: 2px; z-index: 3000001; background-color: white;");
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Pegar partidas");
        btn.addEventListener("click", km.Test);
        div.appendChild(btn);
        km.start = btn;
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Mostrar resultado");
        btn.addEventListener("click", km.UpdateShow);
        div.appendChild(btn);
        km.update = btn;
        km.update.disabled = true;
        document.body.appendChild(div);
        km.menuDiv = div;
        div = document.createElement("div");
        div.setAttribute("style", "margin: 5px; color: white; z-index: 100; background-color: black;");
        $("body").prepend(div);
        km.asc = document.createElement("div");
        km.desc = document.createElement("div");
        km.qtd = document.createElement("div");
        div.appendChild(km.asc);
        div.appendChild(km.desc);
        div.appendChild(km.qtd);
        km.resultDiv = div;
        var div = document.createElement("div");
        div.setAttribute("style", "position: fixed; top: 250px; left: 5px; border: 2px solid black; padding: 2px; z-index: 3000001; background-color: white;");
        document.body.appendChild(div);
        km.infoDiv = div;
        km.infoDiv.hidden = true;
        km.gamesCodex = Ramen.getCollection("Games");
        return true;
    },
    DestroySelf: function () {
        document.body.removeChild(km.menuDiv);
        document.body.removeChild(km.resultDiv);
        document.body.removeChild(km.infoDiv);
        km = undefined;
    },
    Test: function () {
        km.games = [];
        km.update.disabled = true;
        km.start.disabled = true;
        var user = Codex.getContextUser();
        var region = user.get('region');
        var id = user.get('id');

        for (var i = 0; i < Math.ceil(km.gamesCodex.pager.total / 20) ; i++) {
            var startIndex = i * 20;
            var endIndex = startIndex + 20;
            var queryString = '?begIndex=' + startIndex + '&endIndex=' + endIndex + '&' + km.gamesCodex.getFilters();
            var url = Codex.util.ACS.getPlayerHistory(region, id, queryString);

            Codex.util.ACS.makeRequest({
                url: url,
                listeners: {
                    load: km.onHistoryLoad,
                    error: km.onPromiseError,
                    scope: km
                }
            });
        }
    },
    onHistoryLoad: function (d, c) {
        for (var i = 0; i < c.games.games.length; i++) {            
            c.games.games[i].championName = Riot.DDragon.models.champion.remapKeys[c.games.games[i].participants[0].championId];
            c.games.games[i].stats = c.games.games[i].participants[0].stats;
            c.games.games[i].timeline = c.games.games[i].participants[0].timeline;
            c.games.games[i].player = c.games.games[i].participantIdentities[0].player;
            c.games.games[i].mapName = Codex.common.binding.Map.maps[c.games.games[i].mapId];
            c.games.games[i].modeName = Codex.common.binding.Mode.modes[c.games.games[i].gameMode];
            c.games.games[i].queueName = Codex.common.binding.Queue.queues[c.games.games[i].queueId];
            c.games.games[i].gameDurationString = Math.floor(c.games.games[i].gameDuration / 60) + ":" +
                (c.games.games[i].gameDuration - (Math.floor(c.games.games[i].gameDuration / 60) * 60));
            c.games.games[i].gameCreationString = new Date(c.games.games[i].gameCreation).toLocaleString();
        }
        km.games = km.games.concat(c.games.games);
        km.update.disabled = false;
        km.start.disabled = false;
        km.start.setAttribute("value", (km.games.length / km.gamesCodex.pager.total) * 100 + "%");
    },
    onPromiseError: function (c, a, b) {
        km.start.setAttribute("value", a + " - " + b);
        km.start.disabled = false;
    },
    SetInfo: function (gameIndex) {
        var game = km.games[gameIndex];
        km.infoDiv.style.top = (km.resultDiv.clientHeight+ 50) + "px";
        km.infoDiv.hidden = false;
        km.infoDiv.innerHTML = "(V)itória/(D)errota: Campeão | Lane | Level | K/D/A | Mapa | Modo | Fila | Duração | Data criação | Patch | Nome<br>" +
        (game.stats.win ? "V" : "D") + ": " + game.championName + " | " +
        (game.timeline.role === "NONE" ? "" : game.timeline.role) + " " + game.timeline.lane + " | " +
        game.stats.champLevel + " | " + game.stats.kills + "/" + game.stats.deaths + "/" +
        game.stats.assists + " | " + game.mapName + " | " + game.modeName + " | " + game.queueName +
        " | " + game.gameDurationString + " | " + game.gameCreationString + " | " + game.gameVersion + " | " +
        game.player.summonerName;
    },
    HideInfo: function () {
        km.infoDiv.hidden = true;
    }
};

km.Attach();
