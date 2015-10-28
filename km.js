var Utils = {
    champions: undefined, maps: undefined, modes: undefined, queues: undefined, gamesCodex: undefined, summoners: undefined, items: undefined,
    Setup: function () {
        Utils.champions = Riot.DDragon.models.champion.remapKeys,
        Utils.maps = Codex.common.binding.Map.maps,
        Utils.modes = Codex.common.binding.Mode.modes,
        Utils.queues = Codex.common.binding.Queue.queues,
        Utils.gamesCodex = Ramen.getCollection("Games"),
        Utils.summoners = Riot.DDragon.models.summoner.remapKeys;
        Utils.items = Riot.DDragon.models.item.data;
    },
    GetSummonerSpellName: function (summonerSpellId) {
        return Riot.DDragon.models.summoner.data[Utils.summoners[summonerSpellId]].name;
    },
    GetVersion: function (version) {
        return DragonRamen.getVersion(version);
    },
    GetItemName: function (itemId, version) {
        if (itemId === 0) return "_";
        return DragonRamen.get('item', version, itemId).attributes.name;
    }
};

var KM = {
    main: undefined, menu: undefined, header: undefined, result: undefined, inspect: undefined, icons: undefined,
    Setup: function () {
        KM.main = document.createElement("div");
        KM.main.setAttribute('style', 'color: white; margin: 5px;');

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
        KM.header.props["Partidas"].innerHTML = "Partidas encontradas/total: 0/" + Utils.gamesCodex.pager.total;
        KM.header.appendChild(KM.header.props["Partidas"]);

        KM.header.props["Titulo"] = document.createElement("div");
        KM.header.props["Titulo"].innerHTML = " ";
        KM.header.appendChild(KM.header.props["Titulo"]);

        KM.main.appendChild(KM.header);


        KM.result = document.createElement("div");
        KM.main.appendChild(KM.result);

        KM.inspect = document.createElement("div");
        KM.inspect.setAttribute('style', 'z-index: 9999999; position: fixed; background-color: rgba(0, 0, 0, 0.667);');
        KM.inspect.props = {};

        KM.icons = document.createElement("div");
        KM.icons.props = {};

        KM.icons.props["Campeao"] = document.createElement("img");
        KM.icons.props["Campeao"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Campeao"]);

        KM.icons.props["Summoner1"] = document.createElement("img");
        KM.icons.props["Summoner1"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Summoner1"]);

        KM.icons.props["Summoner2"] = document.createElement("img");
        KM.icons.props["Summoner2"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Summoner2"]);

        KM.icons.props["Item0"] = document.createElement("img");
        KM.icons.props["Item0"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Item0"]);

        KM.icons.props["Item1"] = document.createElement("img");
        KM.icons.props["Item1"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Item1"]);

        KM.icons.props["Item2"] = document.createElement("img");
        KM.icons.props["Item2"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Item2"]);

        KM.icons.props["Item3"] = document.createElement("img");
        KM.icons.props["Item3"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Item3"]);

        KM.icons.props["Item4"] = document.createElement("img");
        KM.icons.props["Item4"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Item4"]);

        KM.icons.props["Item5"] = document.createElement("img");
        KM.icons.props["Item5"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Item5"]);

        KM.icons.props["Item6"] = document.createElement("img");
        KM.icons.props["Item6"].setAttribute('width', "64");
        KM.icons.appendChild(KM.icons.props["Item6"]);

        KM.inspect.appendChild(KM.icons);

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

        KM.inspect.props["Items"] = document.createElement("div");
        KM.inspect.props["Items"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Items"]);

        KM.inspect.props["Ouro"] = document.createElement("div");
        KM.inspect.props["Ouro"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Ouro"]);

        KM.inspect.props["KDA"] = document.createElement("div");
        KM.inspect.props["KDA"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["KDA"]);

        KM.inspect.props["Minions"] = document.createElement("div");
        KM.inspect.props["Minions"].innerHTML = " ";
        KM.inspect.appendChild(KM.inspect.props["Minions"]);

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
        KM.icons.style.backgroundColor = (game.stats.win ? "rgba(0, 255, 0, 0.25)" : "rgba(255, 0, 0, 0.25)");

        KM.inspect.props["Campeao"].innerHTML = "Campeão: " + game.championName;

        KM.inspect.props["Level"].innerHTML = "Level: " + game.stats.champLevel;

        KM.inspect.props["Lane"].innerHTML = "Lane: " + (game.timeline.role === "NONE" ? "" : game.timeline.role) + " " + game.timeline.lane;

        KM.inspect.props["Summoner"].innerHTML = "Summoners: " + game.spells[0] + " & " + game.spells[1];

        KM.inspect.props["Items"].innerHTML = "Items: " + game.items[0] + " & " + game.items[1] + " & " + game.items[2] + " & " + game.items[3] +
            " & " + game.items[4] + " & " + game.items[5] + " & " + game.items[6];

        KM.inspect.props["Ouro"].innerHTML = "Ouro gasto/ouro recebido: " + game.stats.goldSpent + "/" + game.stats.goldEarned;

        KM.inspect.props["KDA"].innerHTML = "K/D/A: " + game.stats.kills + "/" + game.stats.deaths + "/" + game.stats.assists;

        KM.inspect.props["Minions"].innerHTML = "Minions + Neutros: " + game.stats.totalMinionsKilled + " + " + game.stats.neutralMinionsKilled +
            " = " + (game.stats.totalMinionsKilled + game.stats.neutralMinionsKilled);

        KM.inspect.props["Mapa"].innerHTML = "Mapa: " + game.mapName;

        KM.inspect.props["Modo"].innerHTML = "Modo: " + game.modeName;

        KM.inspect.props["Fila"].innerHTML = "Fila: " + game.queueName;

        KM.inspect.props["Duracao"].innerHTML = "Duração: " + game.gameDurationString;

        KM.inspect.props["Criacao"].innerHTML = "Data de criação: " + game.gameCreationString;

        KM.inspect.props["Patch"].innerHTML = "Patch: " + game.gameVersion;

        KM.inspect.props["Nome"].innerHTML = "Nome: " + game.player.summonerName;
    },
    UpdateIcons:function(imgs){
        KM.icons.props["Campeao"].setAttribute('src', imgs.champion);

        KM.icons.props["Summoner1"].setAttribute('src', imgs.spells[0]);

        KM.icons.props["Summoner2"].setAttribute('src', imgs.spells[1]);

        KM.icons.props["Item0"].setAttribute('src', imgs.items[0]);

        KM.icons.props["Item1"].setAttribute('src', imgs.items[1]);

        KM.icons.props["Item2"].setAttribute('src', imgs.items[2]);

        KM.icons.props["Item3"].setAttribute('src', imgs.items[3]);

        KM.icons.props["Item4"].setAttribute('src', imgs.items[4]);

        KM.icons.props["Item5"].setAttribute('src', imgs.items[5]);

        KM.icons.props["Item6"].setAttribute('src', imgs.items[6]);
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
            c.games.games[i] = km.ProcessGame(c.games.games[i]);
        }
        km.games = km.games.concat(c.games.games);
        KM.SetButtonsState(false, false, false);
        KM.UpdatePartidas(km.games.length, Utils.gamesCodex.pager.total);
    },
    onPromiseError: function (c, a, b) {
        KM.SetButtonsState(false, true, true);
    },
    SetInfo: function (gameIndex) {
        KM.UpdateInspect(km.games[gameIndex]);
        KM.UpdateIcons(km.games[gameIndex].img);
    },
    ProcessGame: function (game) {
        game.championName = Utils.champions[game.participants[0].championId];
        game.gameVersion2 = Utils.GetVersion(game.gameVersion);
        game.stats = game.participants[0].stats;
        game.timeline = game.participants[0].timeline;
        game.player = game.participantIdentities[0].player;
        game.mapName = Utils.maps[game.mapId];
        game.modeName = Utils.modes[game.gameMode];
        game.queueName = Utils.queues[game.queueId];
        game.gameDurationString = Math.floor(game.gameDuration / 60) + ":" +
            (game.gameDuration - (Math.floor(game.gameDuration / 60) * 60));
        game.gameCreationString = new Date(game.gameCreation).toLocaleString();
        game.spells = [Utils.GetSummonerSpellName(game.participants[0].spell1Id),
            Utils.GetSummonerSpellName(game.participants[0].spell2Id)];
        game.items = [game.stats.item0, game.stats.item1, game.stats.item2,
        game.stats.item3, game.stats.item4, game.stats.item5, game.stats.item6];
        game.img = {
            champion: "http://ddragon.leagueoflegends.com/cdn/" + game.gameVersion2 + "/img/champion/" + game.championName + ".png",
            items: [],
            spells: ["http://ddragon.leagueoflegends.com/cdn/" + game.gameVersion2 + "/img/spell/" + Utils.summoners[game.participants[0].spell1Id] + ".png",
                "http://ddragon.leagueoflegends.com/cdn/" + game.gameVersion2 + "/img/spell/" + Utils.summoners[game.participants[0].spell2Id] + ".png"]
        };
        for (var j = 0; j < 7; j++) {
            game.img.items[j] = (game.items[j] === 0 ? "http://ddragon.leagueoflegends.com/cdn/" + game.gameVersion2 + "/img/champion/" + game.championName + ".png" :
                "http://ddragon.leagueoflegends.com/cdn/" + game.gameVersion2 + "/img/item/" + game.items[j] + ".png");
            game.items[j] = Utils.GetItemName(game.items[j], game.gameVersion);
        }
        return game;
    }
};

km.Attach();
