var Utils = {
    champions: undefined, maps: undefined, modes: undefined, queues: undefined, gamesCodex: undefined, summoner: undefined, items: undefined,
    Setup: function () {
        Utils.champions = Riot.DDragon.models.champion.remapKeys,
        Utils.maps = Codex.common.binding.Map.maps,
        Utils.modes = Codex.common.binding.Mode.modes,
        Utils.queues = Codex.common.binding.Queue.queues,
        Utils.gamesCodex = Ramen.getCollection("Games"),
        Utils.summoner = Riot.DDragon.models.summoner.remapKeys;
        Utils.items = Riot.DDragon.models.item.data;
    },
    GetSummonerSpellName: function (summonerSpellId) {
        return Riot.DDragon.models.summoner.data[Utils.summoner[summonerSpellId]].name;
    }
};

var KM = {
    main: undefined, menu: undefined, header: undefined, result: undefined, inspect: undefined,
    Setup: function () {
        KM.main = document.createElement("div");

        KM.menu = document.createElement("div");
        KM.menu.props = {};

        KM.menu.props["Remover"] = document.createElement("input");
        KM.menu.props["Remover"].setAttribute("type", "button");
        KM.menu.props["Remover"].setAttribute("value", "Remover tudo");
        KM.menu.props["Remover"].addEventListener("click", km.DestroySelf);
        KM.menu.appendChild(KM.menu.props["Remover"]);

        KM.menu.props["Partidas"] = document.createElement("input");
        KM.menu.props["Partidas"].setAttribute("type", "button");
        KM.menu.props["Partidas"].setAttribute("value", "Pegar partidas");
        KM.menu.props["Partidas"].addEventListener("click", km.GetGames);
        KM.menu.appendChild(KM.menu.props["Partidas"]);

        KM.menu.props["Crescente"] = document.createElement("input");
        KM.menu.props["Crescente"].setAttribute("type", "button");
        KM.menu.props["Crescente"].setAttribute("value", "Mostrar em ordem crescente");
        KM.menu.props["Crescente"].addEventListener("click", km.ShowAsc);
        KM.menu.appendChild(KM.menu.props["Crescente"]);

        KM.menu.props["Decrescente"] = document.createElement("input");
        KM.menu.props["Decrescente"].setAttribute("type", "button");
        KM.menu.props["Decrescente"].setAttribute("value", "Mostrar em ordem decrescente");
        KM.menu.props["Decrescente"].addEventListener("click", km.ShowDesc);
        KM.menu.appendChild(KM.menu.props["Decrescente"]);

        KM.main.appendChild(KM.menu);

        KM.header = document.createElement("div");
        KM.header.props = {};

        KM.header.props["Partidas"] = document.createElement("div");
        KM.header.props["Partidas"].innerHTML = "Partidas encontradas/total: ???/???";
        KM.header.appendChild(KM.header.props["Partidas"]);

        KM.header.props["Titulo"] = document.createElement("div");
        KM.header.props["Titulo"].innerHTML = " ";
        KM.header.appendChild(KM.header.props["Titulo"]);

        KM.main.appendChild(KM.header);


        KM.result = document.createElement("div");
        KM.main.appendChild(KM.result);

        KM.inspect = document.createElement("div");
        KM.inspect.props = {};

        KM.inspect.props["Header"] = document.createElement("div");
        KM.inspect.props["Header"].innerHTML = "&nbsp;";
        KM.inspect.appendChild(KM.inspect.props["Header"]);

        KM.inspect.props["Campeao"] = document.createElement("div");
        KM.inspect.props["Campeao"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Campeao"]);

        KM.inspect.props["Level"] = document.createElement("div");
        KM.inspect.props["Level"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Level"]);

        KM.inspect.props["Lane"] = document.createElement("div");
        KM.inspect.props["Lane"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Lane"]);

        KM.inspect.props["Summoner"] = document.createElement("div");
        KM.inspect.props["Summoner"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Summoner"]);

        KM.inspect.props["KDA"] = document.createElement("div");
        KM.inspect.props["KDA"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["KDA"]);

        KM.inspect.props["Mapa"] = document.createElement("div");
        KM.inspect.props["Mapa"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Mapa"]);

        KM.inspect.props["Modo"] = document.createElement("div");
        KM.inspect.props["Modo"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Modo"]);

        KM.inspect.props["Fila"] = document.createElement("div");
        KM.inspect.props["Fila"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Fila"]);

        KM.inspect.props["Duracao"] = document.createElement("div");
        KM.inspect.props["Duracao"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Duracao"]);

        KM.inspect.props["Criacao"] = document.createElement("div");
        KM.inspect.props["Criacao"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Criacao"]);

        KM.inspect.props["Patch"] = document.createElement("div");
        KM.inspect.props["Patch"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Patch"]);

        KM.inspect.props["Nome"] = document.createElement("div");
        KM.inspect.props["Nome"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Nome"]);

        KM.inspect.props["Footer"] = document.createElement("div");
        KM.inspect.props["Footer"].innerHTML = "&nbsp;";
        KM.inspect.appendChild(KM.inspect.props["Footer"]);

        KM.main.appendChild(KM.inspect);

        $("body").prepend(KM.main);
    },
    UpdateResult: function (title, result) {
        KM.header.props["Titulo"].innerHTML = title;
        KM.result.innerHTML = result;
    },
    UpdatePartidas:function (current, total){
        KM.header.props["Partidas"].innerHTML = "Partidas encontradas/total: " + current + "/" + total;
    },
    UpdateInspect: function (game) {
        KM.inspect.props["Header"].style.backgroundColor = (game.stats.win ? "rgba(0, 255, 0, 0.25)" : "rgba(255, 0, 0, 0.25)");
        KM.inspect.props["Footer"].style.backgroundColor = (game.stats.win ? "rgba(0, 255, 0, 0.25)" : "rgba(255, 0, 0, 0.25)");

        KM.inspect.props["Campeao"].innerHTML = "Campeão: " + game.championName;

        KM.inspect.props["Level"].innerHTML = "Level: " + game.stats.champLevel;

        KM.inspect.props["Lane"].innerHTML = "Lane: " + (game.timeline.role === "NONE" ? "" : game.timeline.role) + " " + game.timeline.lane;

        KM.inspect.props["Summoner"].innerHTML = "Summoners: " + game.spells[0] + " & " + game.spells[1];

        KM.inspect.props["KDA"].innerHTML = "K/D/A: " + game.stats.kills + "/" + game.stats.deaths + "/" + game.stats.assists;

        KM.inspect.props["Mapa"].innerHTML = "Mapa: " + game.mapName;

        KM.inspect.props["Modo"].innerHTML = "Modo: " + game.modeName;

        KM.inspect.props["Fila"].innerHTML = "Fila: " + game.queueName;

        KM.inspect.props["Duracao"].innerHTML = "Duração: " + game.gameDurationString;

        KM.inspect.props["Criacao"].innerHTML = "Data de criação: " + game.gameCreationString;

        KM.inspect.props["Patch"].innerHTML = "Patch: " + game.gameVersion;

        KM.inspect.props["Nome"].innerHTML = "Nome: " + game.player.summonerName;
        //goldSpent/goldEarned
    },
    SetButtonsState: function (match, asc, desc) {
        KM.menu.props["Partidas"].disabled = match;
        KM.menu.props["Crescente"].disabled = asc;
        KM.menu.props["Decrescente"].disabled = desc;
    },
    DestroySelf: function () {
        if (KM.main) document.body.removeChild(KM.main);
    }
}

var km = {
    games: undefined,
    ShowAsc: function(){
        km.games.sort(function (a, b) { return b.gameCreation - a.gameCreation; });
        var game = undefined,
            index = undefined,
            html = "";
        for (var i = 0; i < km.games.length; i++) {
            index = km.games.length - i - 1;
            game = km.games[index];
            html +=
            "<a style=\"color: white;\" href=\"#match-details/BR1/" + game.gameId + "/" + game.player.currentAccountId +
            "\" onmouseover=\"km.SetInfo("+index+");\" >" + game.championName[0] + "</a>";
        }
        KM.UpdateResult("Crescente", html);
    },
    ShowDesc: function () {
        km.games.sort(function (a, b) { return b.gameCreation - a.gameCreation; });
        var game = undefined,
            index = undefined,
            html = "";
        for (var i = 0; i < km.games.length; i++) {
            index = i;
            game = km.games[index];
                html +=
                "<a style=\"color: white;\" href=\"#match-details/BR1/" + game.gameId + "/" + game.player.currentAccountId +
                "\" onmouseover=\"km.SetInfo("+index+");\" >" + game.championName[0] + "</a>";
        }
        KM.UpdateResult("Decrescente", html);
    },
    Attach: function () {
        Utils.Setup();
        KM.Setup();
        KM.SetButtonsState(false, true, true);
        return true;
    },
    DestroySelf: function () {
        KM.DestroySelf();
        Utils = undefined;
        KM = undefined;
        km = undefined;
    },
    GetGames: function () {
        km.games = [];
        KM.SetButtonsState(true, true, true);

        var user = Codex.getContextUser();
        var region = user.get('region');
        var id = user.get('id');

        for (var i = 0; i < Math.ceil(Utils.gamesCodex.pager.total / 20) ; i++) {
            var startIndex = i * 20;
            var endIndex = startIndex + 20;
            var queryString = '?begIndex=' + startIndex + '&endIndex=' + endIndex + '&' + Utils.gamesCodex.getFilters();
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
            c.games.games[i].championName = Utils.champions[c.games.games[i].participants[0].championId];
            c.games.games[i].stats = c.games.games[i].participants[0].stats;
            c.games.games[i].timeline = c.games.games[i].participants[0].timeline;
            c.games.games[i].player = c.games.games[i].participantIdentities[0].player;
            c.games.games[i].mapName = Utils.maps[c.games.games[i].mapId];
            c.games.games[i].modeName = Utils.modes[c.games.games[i].gameMode];
            c.games.games[i].queueName = Utils.queues[c.games.games[i].queueId];
            c.games.games[i].gameDurationString = Math.floor(c.games.games[i].gameDuration / 60) + ":" +
                (c.games.games[i].gameDuration - (Math.floor(c.games.games[i].gameDuration / 60) * 60));
            c.games.games[i].gameCreationString = new Date(c.games.games[i].gameCreation).toLocaleString();
            c.games.games[i].spells = [Utils.GetSummonerSpellName(c.games.games[i].participants[0].spell1Id),
                Utils.GetSummonerSpellName(c.games.games[i].participants[0].spell2Id)];
            c.games.games[i].items = [c.games.games[i].stats.item0, c.games.games[i].stats.item1, c.games.games[i].stats.item2,
            c.games.games[i].stats.item3, c.games.games[i].stats.item4, c.games.games[i].stats.item5, c.games.games[i].stats.item6];
            //for (var j = 0; j < 7; j++) {
            //    c.games.games[i].items[j] = c.games.games[i].items[j] === 0 ? "" : Utils.items[c.games.games[i].items[j]];
            //}
        }
        km.games = km.games.concat(c.games.games);
        KM.SetButtonsState(false, false, false);
        KM.UpdatePartidas(km.games.length, Utils.gamesCodex.pager.total);
    },
    onPromiseError: function (c, a, b) {
        //km.start.setAttribute("value", a + " - " + b);
        KM.SetButtonsState(false, true, true);
    },
    SetInfo: function (gameIndex) {
        KM.UpdateInspect(km.games[gameIndex]);        
    }
};

km.Attach();
