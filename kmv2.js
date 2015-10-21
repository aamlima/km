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
        kmv2.asc.innerHTML = "Crescente:<br>";
        kmv2.desc.innerHTML = "Decrescente:<br>";
        kmv2.qtd.innerHTML = "Partidas encontradas/total: " + kmv2.games.length + "/" + kmv2.gamesCodex.pager.total;
        var result = [{ game: undefined, html: "" }, { game: undefined, html: "" }];
        for (var i = 0; i < kmv2.games.length; i++) {
            result[0].game = kmv2.games[kmv2.games.length - i - 1];
            result[1].game = kmv2.games[i];
            for (var j = 0; j < result.length; j++) {
                result[j].html +=
                "<a style=\"color: white;\" href=\"#match-details/BR1/" + result[j].game.gameId + "/" + result[j].game.player.currentAccountId +
                "\" title=\"" + (result[j].game.stats.win ? "V" : "D") + ": " + result[j].game.championName + " | " +
                (result[j].game.timeline.role === "NONE" ? "" : result[j].game.timeline.role) + " " + result[j].game.timeline.lane + " | " +
                result[j].game.stats.champLevel + " | " + result[j].game.stats.kills + "/" + result[j].game.stats.deaths + "/" +
                result[j].game.stats.assists + " | " + result[j].game.mapName + " | " + result[j].game.modeName + " | " + result[j].game.queueName +
                " | " + result[j].game.gameDurationString + " | " + result[j].game.gameCreationString + " | " + result[j].game.gameVersion + " | " +
                result[j].game.player.summonerName + "\">" + result[j].game.championName[0] + "</a>";
            }
        }

        kmv2.asc.innerHTML += result[0].html;
        kmv2.desc.innerHTML += result[1].html;
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
        var d = document.createElement("div");
        d.innerHTML = "(V)itória/(D)errota: Campeão | Lane | Level | K/D/A | Mapa | Modo | Fila | Duração | Data criação | Patch | Nome";
        div.appendChild(d);
        div.appendChild(kmv2.asc);
        div.appendChild(kmv2.desc);
        div.appendChild(kmv2.qtd);
        kmv2.resultDiv = div;
        kmv2.gamesCodex = Ramen.getCollection("Games");
        return true;
    },
    DestroySelf: function () {
        document.body.removeChild(kmv2.menuDiv);
        document.body.removeChild(kmv2.resultDiv);
        kmv2 = undefined;
    },
    Test: function () {
        kmv2.games = [];
        kmv2.update.disabled = true;
        kmv2.start.disabled = true;
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
        kmv2.games = kmv2.games.concat(c.games.games);
        kmv2.update.disabled = false;
        kmv2.start.disabled = false;
        kmv2.start.setAttribute("value", (kmv2.games.length / kmv2.gamesCodex.pager.total) * 100 + "%");
    },
    onPromiseError: function (c, a, b) {
        kmv2.start.setAttribute("value", a + " - " + b);
        kmv2.start.disabled = false;
    }
};

kmv2.Attach();
