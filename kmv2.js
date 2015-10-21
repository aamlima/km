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
                "<a style=\"color: white;\" href=\"#match-details/BR1/" + result[j].game.gameId + "/" +
                result[j].game.participantIdentities[0].player.currentAccountId + "\" title=\"" + (result[j].game.participants[0].stats.win ? "V" : "D") +
                ": " + Riot.DDragon.models.champion.remapKeys[result[j].game.participants[0].championId] + " | " +
                (result[j].game.participants[0].timeline.role === "NONE" ? "" : result[j].game.participants[0].timeline.role) + " " +
                result[j].game.participants[0].timeline.lane + " | " + result[j].game.participants[0].stats.champLevel + " | " +
                result[j].game.participants[0].stats.kills + "/" + result[j].game.participants[0].stats.deaths + "/" +
                result[j].game.participants[0].stats.assists + " | " + Codex.common.binding.Map.maps[result[j].game.mapId] + " | " +
                Codex.common.binding.Mode.modes[result[j].game.gameMode] + " | " + Codex.common.binding.Queue.queues[result[j].game.queueId] + " | " +
                Math.floor(result[j].game.gameDuration / 60) + ":" + (result[j].game.gameDuration - (Math.floor(result[j].game.gameDuration / 60) * 60)) +
                " | " + new Date(result[j].game.gameCreation).toLocaleString() + " | " + result[j].game.gameVersion + " | " +
                result[j].game.participantIdentities[0].player.summonerName + "\">" +
                Riot.DDragon.models.champion.remapKeys[result[j].game.participants[0].championId][0] + "</a>";
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
    },
    onPromiseError: function (c, a, b) {
        console.log(a + " - " + b);
    }
};

kmv2.Attach();
