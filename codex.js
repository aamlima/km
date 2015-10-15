JSoop.define('Codex.util.Config', {
  singleton: true,
  get: function (a) {
    return (AppParameters[a] || '')
  }
});
JSoop.define('Codex.util.DataDragon', {
  mixins: {
    observable: 'JSoop.mixins.Observable'
  },
  singleton: true,
  versionCache: {
  },
  callbackQueue: {
  },
  constructor: function () {
    var a = this;
    Riot.DDragon.addApp(['mastery'], function () {
      Riot.DDragon.fn.fire.plan('model', {
      }, JSoop.bind(a.onModelLoad, a))
    });
    a.initMixin('observable')
  },
  isLoaded: function (b, a) {
    var d = this,
    c;
    a = d.getVersion(a);
    c = Riot.DDragon.models[b + '_' + a];
    return !!c && !!c.keysLoaded
  },
  getModel: function (c) {
    var d = this,
    b,
    a;
    c.version = Codex.util.DataDragon.getVersion(c.version);
    a = c.model + '_' + c.version;
    b = Riot.DDragon.models[a];
    if (b && b.data) {
      c.callback.call(c.scope, b);
      return
    }
    if (!d.callbackQueue[a]) {
      d.callbackQueue[a] = [
      ]
    }
    d.callbackQueue[a].push(c);
    d.createDisplay(c.model, c.version);
    Riot.DDragon.useModel(c.model, c.version)
  },
  getTooltipImg: function (a) {
    var d = this,
    c = a.callback,
    b = a.scope;
    delete a.callback;
    delete a.scope;
    a.callback = function (e) {
      a.callback = c;
      a.scope = b;
      a.content = e;
      d.getTooltip(a)
    };
    d.getImg(a)
  },
  getTooltipImgMarkup: function (b) {
    var c = this,
    a = JSoop.clone(b);
    if (!c.isLoaded(b.model, b.version)) {
      return ''
    }
    a.content = c.getImgMarkup(b);
    return c.getTooltipMarkup(a)
  },
  getTooltipMarkup: function (c) {
    var e = this,
    a = e.getVersion(c.version),
    d = c.id,
    b;
    if (!e.isLoaded(c.model, c.version)) {
      return ''
    }
    b = Riot.DDragon.models[c.model + '_' + a];
    if (c.model !== 'rune' && c.model !== 'item') {
      d = e.getKeyFromId(b, d)
    }
    return ['<div ',
    'data-rg-name="' + c.model + '_' + a + '" ',
    'data-rg-id="' + d + '">',
    c.content,
    '</div>'].join('')
  },
  getImgMarkup: function (d) {
    var f = this,
    a = f.getVersion(d.version),
    e = d.id,
    c,
    b;
    if (!f.isLoaded(d.model, a)) {
      return ''
    }
    c = d.options ? JSoop.clone(d.options)  : {
    };
    b = Riot.DDragon.models[d.model + '_' + a];
    if (d.model !== 'rune' && d.model !== 'item') {
      e = f.getKeyFromId(b, e)
    }
    if (d.model !== 'mastery') {
      JSoop.applyIf(c, {
        src: 'full'
      })
    }
    return b.getImg(e, c)
  },
  getTooltip: function (a) {
    var d = this,
    c = a.callback,
    b = a.scope;
    delete a.callback;
    delete a.scope;
    a.callback = function (e) {
      var f = a.id;
      if (a.model !== 'rune' && a.model !== 'item') {
        f = d.getKeyFromId(e, f)
      }
      c.call(b, [
        '<div ',
        'data-rg-name="' + a.model + '_' + e.version + '" ',
        'data-rg-id="' + f + '">',
        a.content,
        '</div>'
      ].join(''))
    };
    d.getModel(a)
  },
  getImg: function (a) {
    var d = this,
    c = a.callback,
    b = a.scope;
    delete a.callback;
    delete a.scope;
    a.callback = function (f) {
      var g = a.id,
      e = a.options ? JSoop.clone(a.options)  : {
      };
      if (a.model !== 'rune' && a.model !== 'item') {
        g = d.getKeyFromId(f, g)
      }
      if (a.model !== 'mastery') {
        JSoop.applyIf(e, {
          src: 'full'
        })
      }
      c.call(b, f.getImg(g, e))
    };
    d.getModel(a)
  },
  getData: function (a) {
    var d = this,
    c = a.callback,
    b = a.scope;
    a.callback = function (e) {
      var f = a.id;
      if (a.model !== 'rune' && a.model !== 'item') {
        f = d.getKeyFromId(e, f)
      }
      c.call(b, e.data[f])
    };
    d.getModel(a)
  },
  getKeyFromId: function (a, c) {
    var b = false;
    JSoop.iterate(a.data, function (e, d) {
      if ((e.id + '') === (c + '') || e.key === (c + '')) {
        b = d;
        return false
      }
    });
    return b
  },
  createDisplay: function (b, a) {
    if (b !== 'mastery') {
      Riot.DDragon.addDisplay({
        type: b + '_' + a + '_tooltip',
        success: Riot.DDragon.display[b + '_tooltip'].success
      })
    }
  },
  getVersion: (function () {
    function a(f, e, d) {
      var c = - 1;
      if (f === null) {
        return e.latest
      }
      if (d === undefined) {
        d = 999
      }
      f = parseInt(f, 10);
      JSoop.each(e.versions, function (g) {
        if (g > c && g <= f && (g < d)) {
          c = g
        }
      });
      return c
    }
    function b(c) {
      var d = Codex.util.DataDragon.versionCache;
      if (c.major === - 1) {
        c.season = a(c.season, d, c.season);
        c.major = a(null, d[c.season]);
        c.minor = a(null, d[c.season][c.major])
      }
      if (c.minor === - 1) {
        c.minor = a(null, d[c.season][c.major])
      }
    }
    return function (d) {
      var f = Codex.util.DataDragon.versionCache,
      i = d ? d.split('.')  : [
        null,
        null,
        null
      ],
      h = a(i[0], f),
      e = a(i[1], f[h]),
      g = a(i[2], f[h][e]),
      c = {
        season: h,
        major: e,
        minor: g
      };
      b(c);
      return c.season + '.' + c.major + '.' + c.minor
    }
  }()),
  onModelLoad: function (e, c) {
    var d = this,
    a = c.name,
    b = Riot.DDragon.models[a];
    if (d.callbackQueue[a]) {
      JSoop.each(d.callbackQueue[a], function (f) {
        f.callback.call(f.scope, b)
      });
      d.callbackQueue[a] = [
      ]
    }
    d.fireEvent('load', c.name, Riot.DDragon.models[c.name])
  }
}, function (c) {
  var a = {
    versions: [
    ]
  };
  function b(d, e) {
    d = parseInt(d, 10);
    if (e.versions.indexOf(d) === - 1) {
      e.versions.push(d)
    }
    if (!e[d]) {
      e[d] = {
        versions: [
        ]
      }
    }
    e.versions.sort(function (g, f) {
      return f - g
    });
    e.latest = e.versions[0]
  }
  JSoop.each(Riot.DDragon.versions, function (d) {
    var e = d.split('.');
    if (d.indexOf('lolpatch') !== - 1) {
      return
    }
    b(e[0], a);
    b(e[1], a[e[0]]);
    b(e[2], a[e[0]][e[1]])
  });
  c.versionCache = a
});
JSoop.define('Codex.util.Analytics', {
  singleton: true,
  fire: function (a, c) {
    if (analytics === 'undefined') {
      return false
    }
    var d = Codex.util.Region.getRegion(),
    b = Riot.getCookie('PVPNET_ID_' + d);
    if (JSoop.isObject(c)) {
      c.region = d;
      c.account = b
    }
    analytics.track(a, c)
  }
});
JSoop.define('Codex.util.Assets', {
  singleton: true,
  eventIcon: function (a) {
    return CODEX_ASSET_PATH + '/images/normal/event_icons/' + a + '.png'
  }
});
JSoop.define('Codex.util.Formatters', {
  singleton: true,
  passThrough: function (a) {
    return a
  },
  numberToK: function (c, b) {
    var a = Codex.util.I18n.trans('thousand_format');
    if (b === undefined) {
      b = 1
    }
    c = c / 1000;
    return a.replace('{{ number }}', c.toFixed(b))
  },
  numberToM: function (c, b) {
    var a = Codex.util.I18n.trans('million_format');
    if (b === undefined) {
      b = 1
    }
    c = (c * 1000) / 1000000;
    return a.replace('{{ number }}', c.toFixed(b))
  },
  numberFormat: function (a) {
    return (a > 0) ? a : '-'
  },
  booleanFormat: function (a) {
    return a ? '●' : '○'
  },
  relicFormat: function (a) {
    return a / 3
  },
  timeFormatMs: function (a) {
    var b = d3.time.format((a < 3600000) ? '%-M:%S' : '%-H:%M:%S');
    return b(new Date(2014, 0, 1, 0, 0, 0, a))
  },
  gold: (function () {
    var a;
    return function (b) {
      if (!a) {
        a = Codex.util.I18n.trans('gold_format')
      }
      if (b >= 1000) {
        return a.replace('{{ gold }}', (b / 1000).toFixed(1))
      }
      return b
    }
  }())
});
JSoop.define('Codex.util.Region', {
  singleton: true,
  getRegion: function () {
    var a = window.RiotBar ? RiotBar.account.getRegion()  : Riot.getCookie('PVPNET_REGION');
    if (a) {
      a = a.toUpperCase()
    }
    return a
  }
});
JSoop.define('Codex.model.User', {
  extend: 'Ramen.data.Model',
  name: 'User',
  fields: [
    {
      name: 'type'
    },
    {
      name: 'region'
    },
    {
      name: 'id',
      mapping: 'accountId',
      type: 'int'
    }
  ],
  statics: {
    parseId: function (a) {
      a = parseInt(a, 10);
      return isNaN(a) ? undefined : a
    }
  },
  whereParticipant: function (b) {
    var c = this,
    a;
    if (c.get('type') === 'vapor') {
      a = b.find({
        currentAccount: c.get('id')
      })
    } else {
      if (c.get('type') === 'original') {
        a = b.find({
          account: c.get('id')
        })
      }
    }
    return a
  },
  findParticipant: function (b) {
    var c = this,
    a;
    if (c.get('type') === 'vapor') {
      a = b.findFirst({
        currentAccount: c.get('id')
      })
    } else {
      if (c.get('type') === 'original') {
        a = b.findFirst({
          account: c.get('id')
        })
      }
    }
    return a
  },
  isParticipant: function (a) {
    var b = this;
    if (b.get('type') === 'vapor') {
      if (a.get('currentAccount') === b.get('id')) {
        return true
      }
    } else {
      if (b.get('type') === 'original') {
        if (a.get('account') === b.get('id')) {
          return true
        }
      }
    }
    return false
  }
});
JSoop.define('Codex.model.Frame', {
  extend: 'Ramen.data.Model',
  name: 'Frame',
  fields: [
    {
      name: 'id',
      convert: function () {
        return Ramen.id('frame')
      }
    },
    {
      name: 'timestamp',
      type: 'int'
    },
    {
      name: 'currentGold',
      type: 'int'
    },
    {
      name: 'jungleMinionsKilled',
      type: 'int'
    },
    {
      name: 'level',
      type: 'int'
    },
    {
      name: 'minionsKilled',
      type: 'int'
    },
    {
      name: 'participantId',
      type: 'int'
    },
    {
      name: 'position'
    },
    {
      name: 'totalGold',
      type: 'int'
    },
    {
      name: 'xp',
      type: 'int'
    },
    {
      name: 'teamScore',
      type: 'int',
      defaultValue: 0
    },
    {
      name: 'dominionScore',
      type: 'int',
      defaultValue: 0
    }
  ]
});
JSoop.define('Codex.model.Rune', {
  extend: 'Ramen.data.Model',
  name: 'Rune',
  fields: [
    {
      name: 'id',
      convert: function () {
        return Ramen.id('rune')
      }
    },
    {
      name: 'participantId',
      type: 'int'
    },
    {
      name: 'count',
      mapping: 'rank'
    },
    {
      name: 'runeId',
      mapping: 'runeId'
    }
  ]
});
JSoop.define('Codex.common.view.Breadcrumbs', {
  mixins: {
    observable: 'JSoop.mixins.Observable'
  },
  singleton: true,
  crumbs: [
  ],
  constructor: function () {
    var a = this;
    a.container = jQuery('.breadcrumb');
    a.initMixin('observable')
  },
  addCrumb: function (h, g) {
    var d = this,
    f = g.split('/'),
    e = f.shift(),
    a,
    b,
    c;
    if (d.hasPage(e)) {
      a = d.getPageIndex(e);
      for (b = a, c = d.crumbs.length; b < c; b = b + 1) {
        d.crumbs[b].el.remove()
      }
      d.crumbs = d.crumbs.slice(0, a)
    }
    d.crumbs.push(d.renderCrumb({
      text: h,
      path: g,
      page: e
    }, d.crumbs.length))
  },
  renderCrumb: function (a) {
    var b = this;
    a.el = jQuery('<li><a href="#' + a.path + '">' + a.text + '</a></li>').appendTo(b.container);
    return a
  },
  setCrumbs: function (a) {
    var b = this;
    JSoop.each(b.crumbs, function (c) {
      c.el.remove()
    });
    b.crumbs = [
    ];
    JSoop.each(a, function (c) {
      b.addCrumb(c.text, c.path)
    })
  },
  hasPage: function (a) {
    return this.getPageIndex(a) !== - 1
  },
  getPageIndex: function (d) {
    var c = this,
    a = 0,
    b = c.crumbs.length;
    for (; a < b; a = a + 1) {
      if (c.crumbs[a].page === d) {
        return a
      }
    }
    return - 1
  }
}, function (a) {
  Codex.getBreadcrumbs = function () {
    return a
  }
});
JSoop.define('Codex.common.view.Tooltip', {
  extend: 'Ramen.view.Box',
  baseId: 'codex-tooltip',
  baseCls: 'codex-tooltip',
  showAt: function (c, a, f) {
    var b = this,
    e = (f && f.left || 0),
    d = (f && f.top || 0),
    g = jQuery(a).offset();
    b.offsetTop = parseFloat(jQuery('body').css('margin-top').replace('px'), 10) + 20;
    b.show(c, (g.left + e), (g.top + d))
  },
  show: function (c, a, d) {
    var b = this;
    if (c.isBox) {
      b.currentView = c;
      c.render(b.el)
    } else {
      b.el.html(c)
    }
    b.el.css('display', 'block');
    b.el.css('top', (d - (b.el.height() + b.offsetTop)) + 'px').css('left', (a - (b.el.width() / 2)) + 'px')
  },
  hide: function () {
    var a = this;
    if (a.currentView) {
      a.currentView.destroy();
      a.currentView = null
    } else {
      a.el.html('')
    }
    a.el.css('display', 'none')
  }
}, function () {
  var a = JSoop.create('Codex.common.view.Tooltip', {
    renderTo: 'body',
    autoRender: true
  });
  Codex.showTip = function (c, b, d) {
    a.showAt(c, b, d)
  };
  Codex.hideTip = function () {
    a.hide()
  }
});
JSoop.define('Codex.player.view.Search', {
  extend: 'Ramen.view.View',
  rtype: 'player-search',
  baseCls: 'player-search',
  baseId: 'player-search',
  tpl: '<div class="btn-input"> <input id="{{ id }}-name" type="text" placeholder="{{ trans(\'search_button_title\') }}" name="query"> <a id="{{ id }}-btn" class="btn-mini" href="#"> <em class="icon icon-search"></em> </a> </div>',
  childEls: {
    nameEl: 'name',
    buttonEl: 'btn'
  },
  domListeners: {
    nameEl: {
      keyup: 'onDomSearch'
    },
    buttonEl: {
      click: 'onDomSearch'
    }
  },
  onDomSearch: function (c) {
    if (c.type === 'keyup' && c.which !== 13) {
      return
    }
    var b = this,
    a = b.nameEl.val();
    if (a.trim()) {
      b.fireEvent('search', a)
    }
    c.preventDefault()
  }
});
JSoop.define('Codex.error.view.Default', {
  extend: 'Ramen.view.View',
  tpl: '<div class="default-4-7"> <h2 class="error-header-primary">Error: 500</h2> <h4 class="error-header-secondary"><h2>{{ trans(\'default_title\') }}</h2></h4> <div class="error-message"> {{ trans(\'default_msg\') }} </div> </div>',
});
JSoop.define('Codex.player.Controller', {
  extend: 'Ramen.app.Controller',
  routes: {
    'login?redirect=:fragment': 'onRouteLogin',
    'player-search/currentAccount/:region/:account': 'onRouteSearchAccount'
  },
  initController: function () {
    var a = this;
    a.control({
      'player-search': {
        search: a.onSearchSearch,
        scope: a
      }
    });
    a.callParent(arguments)
  },
  getPlayer: function (b, e, d) {
    var c = this,
    a = (b) ? Codex.util.ACS.getPlayer(b)  : Codex.util.ACS.getPlayerByAccount(d, e),
    f = Ramen.getCollection('Games');
    jQuery.ajax({
      url: a,
      headers: Codex.util.ACS.getHeaders(),
      dataType: 'json',
      success: function (h) {
        var g = 'match-history/' + h.platformId + '/' + h.accountId;
        if (g !== Ramen.app.History.getFragment()) {
          f.reinitialize();
          c.navigate(g)
        }
      },
      error: function (g) {
        if (g.status === 404) {
          c.app.controllers.Error.playerNotFound({
            missing_player_name: b,
            missing_player_region: e,
            missing_player_account: d
          })
        } else {
          c.app.controllers.Error.handle(g.status)
        }
      }
    })
  },
  onRouteLogin: function (b) {
    var c = this,
    f = decodeURIComponent(b),
    a = Riot.Sandworm.getSummonerName(),
    e = Ramen.getCollection('Games'),
    d = Codex.util.Region.getRegion();
    if (a === false) {
      switch (d) {
        case 'KR':
          Riot.KrPvpnetBar.showLoginLayer();
          break;
        default:
          if (window.RiotBar) {
            RiotBar.account.login()
          } else {
            Riot.Sandworm.pvpnetMenus.show('login')
          }
          break
      }
    }
    e.reinitialize();
    c.navigate(f)
  },
  onRouteSearchAccount: function (c, b) {
    var a = this;
    a.getPlayer(null, c, b)
  },
  onSearchSearch: function (a) {
    var b = this;
    Codex.util.Analytics.fire('search', {
      label: a
    });
    b.getPlayer(a)
  }
}); JSoop.define('Codex.common.layout.GridLayout', {
  extend: 'Ramen.view.layout.Layout',
  initContainer: function () {
    var b = this,
    a = b.owner.getTargetEl();
    a.addClass('gs-container');
    if (b.gutter) {
      a.addClass('gs-' + b.gutter + '-gutter')
    }
    b.callParent(arguments)
  },
  getWrapperClasses: function (b) {
    var a = this.callParent(arguments);
    if (b.gridSize) {
      a.push('default-' + b.gridSize)
    }
    return a
  }
}); JSoop.define('Codex.history.view.header.Player', {
  extend: 'Ramen.view.View',
  tpl: '<div class="content-border"> <div class="white-stone clearfix"> <div class="player-header-icon"><img src="//avatar.leagueoflegends.com/{{ currentRegion }}/{{ summonerName }}.png"></div> <div class="player-header-name">{{ summonerName }}</div> </div> </div>',
  rtype: 'history-header-player',
  baseId: 'history-header-player',
  baseCls: 'history-header-player',
  cls: 'player-header',
  initView: function () {
    var a = this;
    a.renderData = {
      summonerName: a.model.get('summonerName'),
      currentRegion: a.model.get('currentRegion')
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.page.view.Landing', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.player.view.Search'
  ],
  rtype: 'page-landing',
  baseId: 'page-landing',
  baseCls: 'page-landing',
  tpl: '<div class="gs-container landing"> <div class="default-2-3"> <div class="content-border"> <div class="white-stone"> <img src="{{ asset("/images/landing_splash.jpg") }}"/> </div> </div> </div> <div class="default-1-3 intro"> <div class="content-border"> <div class="white-stone clearfix"> <div class="gs-container"> <h2>{{ trans(\'landing_page_header\') }}</h2> <p>{{ trans(\'landing_page_intro\') }}</p> <div id="{{ id }}-search" class="player-search"></div> </div> </div> </div> {% if loginStatus %} <a class="forward-button btn-large btn-large-primary" href="#match-history"> {{ trans(\'landing_page_forward\') }} </a> {% else %} <div class="content-border"> <div class="white-stone clearfix"> <div class="gs-container"> <h2>{{ trans(\'landing_page_login_title\') }}</h2> <p>{{ trans(\'landing_page_login_description\') }}</p> <a class="login-button btn-large btn-large-primary" onclick="Riot.Sandworm.pvpnetMenus.show(\'login\');"> {{ trans(\'landing_page_login_button_text\') }} </a> </div> </div> </div> {% endif %} </div> </div>',
  childEls: {
    searchEl: 'search'
  },
  initView: function () {
    var a = this;
    a.renderData = {
      loginStatus: Codex.getCurrentUser().isLoggedIn()
    };
    a.callParent(arguments)
  },
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    a.search = JSoop.create('Codex.player.view.Search', {
      renderTo: a.searchEl,
      autoRender: true
    })
  },
  onDestroy: function () {
    var a = this;
    if (a.search) {
      a.search.destroy()
    }
    a.callParent(arguments)
  }
}); JSoop.define('Codex.page.view.Faq', {
  extend: 'Ramen.view.View',
  rtype: 'page-faq',
  baseId: 'page-faq',
  baseCls: 'page-faq',
  tpl: '<div class="content-border"> <header class="header-primary"><h2>{{ trans("faq_title") }}</h2></header> <ul class="grid-list gs-container default-1-col gs-no-gutter"> {% for i in 1..10 %} <li> <section class="question"> <header>{{ trans("faq_question_" ~ i) }}</header> <div class="answer"> <p>{{ trans("faq_answer_" ~ i) }}</p> </div> </section> </li> {% endfor %} </ul> </div>',
  childSelectors: {
    headers: 'section.question header'
  },
  domListeners: {
    headers: {
      click: 'onHeaderClick'
    }
  },
  onHeaderClick: function (a) {
    jQuery(a.target).next('.answer').eq(0).toggle()
  }
}); JSoop.define('Codex.page.Controller', {
  extend: 'Ramen.app.Controller',
  requires: [
    'Codex.page.view.Landing',
    'Codex.page.view.Faq'
  ],
  routes: {
    'page/landing-page': 'onRouteLanding',
    'page/faq': 'onRouteFaq',
    '*action': 'onRouteNoRoute'
  },
  onRouteLanding: function () {
    var a = this;
    a.getApp().viewport.replace({
      type: 'Codex.page.view.Landing'
    });
    Codex.util.Analytics.fire('view_landing_page');
    return false
  },
  onRouteFaq: function () {
    var a = this;
    a.getApp().viewport.replace({
      type: 'Codex.page.view.Faq'
    });
    return false
  },
  onRouteNoRoute: function () {
    var a = this;
    if (!Codex.getCurrentUser().isLoggedIn()) {
      a.navigate('page/landing-page');
      return false
    }
    a.navigate('match-history');
    return false
  }
}); JSoop.define('Codex.common.view.Loading', {
  extend: 'Ramen.view.View',
  rtype: 'loader',
  baseId: 'loader',
  baseCls: 'loader',
  tpl: '<img src="{{ asset("/images/loader.gif") }}">',
  hide: function () {
    var a = this;
    a.el.css('display', 'none')
  },
  show: function () {
    var a = this;
    a.el.css('display', 'block')
  }
}); JSoop.define('Codex.history.helper.View', {
  extend: 'Ramen.app.Helper',
  requires: [
    'Codex.common.view.Loading'
  ],
  initHelper: function () {
    var a = this;
    a.owner.control({
      'history-list': {
        next: a.onHistoryListNext,
        scope: a
      },
      'history-header-filter-select': {
        filter: a.onHistoryFilterSelectFilter,
        scope: a
      },
      'history-game-summary': {
        click: a.onHistoryGameSummaryClick,
        scope: a
      }
    })
  },
  onHistoryFilterSelectFilter: function (a) {
    var c = this,
    e = Ramen.getCollection('Games'),
    d = {
    },
    b;
    if (a.champion) {
      d.champion = a.champion
    }
    if (a.type !== 'default') {
      d.matchType = a.type
    }
    if (a.map !== 'default') {
      d.map = a.map
    }
    b = Codex.util.QueryString.getNewHashWithQuery(d);
    if (b === location.hash) {
      return
    }
    Codex.util.Analytics.fire('filter_match_history', {
      label: 'mode',
      value: a.type,
      champion: a.champion,
      map: a.map
    });
    e.reinitialize();
    e.removeAll();
    c.owner.navigate(b)
  },
  onHistoryListNext: function () {
    var b = Ramen.getCollection('Games'),
    a = Codex.getContextUser();
    b.next(a.get('region'), a.get('id'))
  },
  onHistoryGameSummaryClick: function (c, a) {
    var d = this,
    b = a.getGame(),
    g = b.get('id'),
    f = b.get('region'),
    e = Codex.getContextUser();
    a = e.findParticipant(b.getParticipants());
    d.getApp().viewport.replace({
      type: 'Codex.common.view.Loading'
    });
    jQuery('body').scrollTop(0);
    d.owner.navigate('match-details/' + f + '/' + g + '/' + a.get('currentAccount'))
  }
}); JSoop.define('Codex.common.view.ChampionNameplate', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'champion-nameplate',
  baseId: 'champion-nameplate',
  baseCls: 'champion-nameplate',
  tpl: '{% if not hideIcon %} <div class="{{ baseCls }}-icon">{{ championIcon }} {% if not hideLevel %} <span class="{{ baseCls }}-level">{{ champLevel }}</span> {% endif %} </div> {% endif %} {% if not hideName %} <div class="{{ baseCls }}-name"> {% if useSummonerName %} {{ summonerName }} {% else %} {{ championName }} {% endif %} </div> {% endif %}',
  bindings: {
    championIcon: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'champion'
    },
    championName: {
      field: 'name',
      model: 'champion'
    },
    champLevel: 'champLevel',
    summonerName: function (c, b) {
      var a = {
        html: c.get('summonerName') || ''
      };
      if (b.useSummonerLink) {
        a.tag = 'a';
        a.href = '#match-history/' + c.get('region') + '/' + c.get('account')
      } else {
        a.tag = 'span'
      }
      if (a.html.length > 12) {
        a.cls = 'summoner-long'
      }
      return Ramen.dom.Helper.markup(a)
    }
  },
  initView: function () {
    var a = this;
    a.champion = DragonRamen.get('champion', a.model.getGame().get('version'), a.model.get('champion'));
    a.renderData = {
    };
    a.bindings = JSoop.clone(a.bindings);
    if (!a.model.get('summonerName')) {
      a.bindings.summonerName = a.bindings.championName
    }
    JSoop.iterate({
      hideName: false,
      hideIcon: false,
      hideLevel: false,
      useSummonerName: true,
      useSummonerLink: false
    }, function (c, b) {
      if (a[b] === undefined) {
        a.renderData[b] = c;
        a[b] = c
      } else {
        a.renderData[b] = a[b]
      }
    });
    a.callParent(arguments)
  }
}); JSoop.define('Codex.history.view.list.Empty', {
  extend: 'Ramen.view.View',
  baseId: 'empty',
  baseCls: 'empty',
  tpl: '<div id="{{ id }}-no-filter" class="white-stone clearfix"> <h2>{{ trans("match_history_empty") }}</h2> <br /> <h4>{{ trans("match_history_empty_because") }}</h4> <br /> <ul> <li>{{ trans("match_history_empty_reason_no_ranked_games") }}</li> <li>{{ trans("match_history_empty_reason_not_friends") }}</li> <li>{{ trans("match_history_empty_reason_cutoff") }}</li> </ul> </div> <div id="{{ id }}-filter" class="white-stone clearfix"> {{ trans("match_history_empty_filtered") }} </div>',
  childEls: {
    noFilterEl: 'no-filter',
    filterEl: 'filter'
  },
  showFiltered: function () {
    var a = this;
    a.noFilterEl.css('display', 'none');
    a.filterEl.css('display', 'block')
  },
  showUnfiltered: function () {
    var a = this;
    a.filterEl.css('display', 'none');
    a.noFilterEl.css('display', 'block')
  }
}); JSoop.define('Codex.history.view.summary.ChampionPortrait', {
  extend: 'Codex.common.view.ChampionNameplate',
  config: {
    defaults: {
      cls: 'champion-icon',
      hideName: true
    }
  }
}); JSoop.define('Codex.common.binding.Duration', {
  extend: 'Ramen.view.binding.ModelBinding',
  formatter: function (c) {
    var b = (c.isGame) ? c : c.getGame(),
    e = b.get('duration'),
    d = Math.floor(e / 60),
    a = Math.floor(d / 60);
    d = d - (a * 60);
    e = e - ((a > 0) ? (a * 60 * 60) + (d * 60)  : (d * 60));
    e = JSoop.util.String.padLeft(e, 2, '0');
    if (a > 0) {
      d = JSoop.util.String.padLeft(d, 2, '0');
      return a + ':' + d + ':' + e
    }
    return d + ':' + e
  }
}); JSoop.define('Codex.common.binding.Gold', {
  extend: 'Ramen.view.binding.ModelBinding',
  formatter: function (a) {
    var b = a.get('goldEarned');
    if (b >= 1000) {
      return Codex.util.I18n.trans('gold_format').replace('{{ gold }}', (b / 1000).toFixed(1))
    }
    return b
  }
}); JSoop.define('Codex.common.binding.KDABadge', {
  extend: 'Ramen.view.binding.ModelBinding',
  formatter: function (e) {
    var c = e.get('kills'),
    f = e.get('deaths'),
    b = e.get('assists');
    if (f === 0) {
      return Codex.util.I18n.trans('kdabadge_perfect')
    }
    return ((c + b) / f).toFixed(2) + ':1'
  }
}); JSoop.define('Codex.common.binding.Mode', {
  extend: 'Ramen.view.binding.ModelBinding',
  statics: {
    modes: {
      CLASSIC: Codex.util.I18n.trans('mode_classic'),
      ARAM: Codex.util.I18n.trans('mode_aram'),
      ODIN: Codex.util.I18n.trans('mode_dominion'),
      ASCENSION: Codex.util.I18n.trans('mode_ascension')
    },
    hasScore: {
      ODIN: true,
      ASCENSION: true
    }
  },
  formatter: function (b) {
    var a = (b.isGame) ? b : b.getGame(),
    c = a.get('mode');
    return Codex.common.binding.Mode.modes[c]
  }
}); JSoop.define('Codex.history.view.summary.ResultMarker', {
  extend: 'Ramen.view.Box',
  rtype: 'history-result-marker',
  baseId: 'result-marker',
  baseCls: 'result-marker',
  initView: function () {
    var b = this,
    a = (b.model.get('win')) ? 'victory' : 'defeat';
    b.addCls('game-summary-' + a);
    b.callParent(arguments)
  }
}); JSoop.define('Codex.history.view.summary.SpellBook', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'history-spell-book',
  baseId: 'spell-book',
  baseCls: 'spell-book',
  tpl: '{{ spell1 }} {{ spell2 }}',
  bindings: {
    spell1: {
      type: 'DragonRamen.binding.spell.Icon',
      model: 'spell1'
    },
    spell2: {
      type: 'DragonRamen.binding.spell.Icon',
      model: 'spell2'
    }
  },
  initView: function () {
    var b = this,
    a = b.model.getGame().get('version');
    b.spell1 = DragonRamen.get('spell', a, b.model.get('spell1'));
    b.spell2 = DragonRamen.get('spell', a, b.model.get('spell2'));
    b.callParent(arguments)
  }
}); JSoop.define('Codex.common.binding.Queue', {
  extend: 'Ramen.view.binding.ModelBinding',
  statics: {
    queues: {
      0: Codex.util.I18n.trans('queue_custom'),
      7: Codex.util.I18n.trans('queue_coop_vs_ai'),
      2: Codex.util.I18n.trans('queue_normal_blind_pick'),
      14: Codex.util.I18n.trans('queue_normal_draft_mode'),
      4: Codex.util.I18n.trans('queue_ranked_draft_mode'),
      42: Codex.util.I18n.trans('queue_ranked_team'),
      61: Codex.util.I18n.trans('queue_normal_team_builder'),
      31: Codex.util.I18n.trans('queue_coop_vs_ai'),
      32: Codex.util.I18n.trans('queue_coop_vs_ai'),
      33: Codex.util.I18n.trans('queue_coop_vs_ai'),
      52: Codex.util.I18n.trans('queue_coop_vs_ai'),
      8: Codex.util.I18n.trans('queue_normal_blind_pick'),
      41: Codex.util.I18n.trans('queue_ranked_team'),
      25: Codex.util.I18n.trans('queue_coop_vs_ai'),
      16: Codex.util.I18n.trans('queue_normal_blind_pick'),
      17: Codex.util.I18n.trans('queue_normal_draft_mode'),
      65: Codex.util.I18n.trans('queue_aram'),
      100: Codex.util.I18n.trans('queue_aram'),
      70: Codex.util.I18n.trans('queue_one_for_all'),
      73: Codex.util.I18n.trans('queue_first_blood'),
      76: Codex.util.I18n.trans('queue_urf_mode'),
      78: Codex.util.I18n.trans('mode_one_for_all_mirror'),
      83: Codex.util.I18n.trans('queue_coop_vs_ai'),
      98: Codex.util.I18n.trans('queue_tt_hexakill'),
      300: Codex.util.I18n.trans('queue_king_poro'),
      313: Codex.util.I18n.trans('queue_bilge_water_brawl'),
      91: Codex.util.I18n.trans('queue_doom_bots_of_doom_1'),
      92: Codex.util.I18n.trans('queue_doom_bots_of_doom_2'),
      93: Codex.util.I18n.trans('queue_doom_bots_of_doom_5'),
      96: Codex.util.I18n.trans('queue_ascension'),
      9: Codex.util.I18n.trans('queue_ranked_team'),
      6: Codex.util.I18n.trans('queue_ranked_team')
    },
    types: {
      0: Codex.util.I18n.trans('mode_custom'),
      1: Codex.util.I18n.trans('queue_normal'),
      2: Codex.util.I18n.trans('queue_ranked'),
      3: Codex.util.I18n.trans('queue_coop_vs_ai')
    },
    mapping: {
      0: {
        type: 0
      },
      2: {
        type: 1,
        map: 1,
        mode: 'blind'
      },
      4: {
        type: 2,
        map: 1,
        mode: 'draft',
        ranked: 'solo'
      },
      7: {
        type: 3,
        map: 1,
        mode: 'blind'
      },
      14: {
        type: 1,
        map: 1,
        mode: 'draft'
      },
      42: {
        type: 2,
        map: 1,
        mode: 'draft',
        ranked: 'team'
      },
      61: {
        type: 1,
        map: 1,
        mode: 'teambuilder'
      },
      31: {
        type: 3,
        map: 1,
        mode: 'blind'
      },
      32: {
        type: 3,
        map: 1,
        mode: 'blind'
      },
      33: {
        type: 3,
        map: 1,
        mode: 'blind'
      },
      8: {
        type: 1,
        map: 10,
        mode: 'blind'
      },
      41: {
        type: 2,
        map: 10,
        mode: 'draft',
        ranked: 'team'
      },
      52: {
        type: 3,
        map: 10,
        mode: 'blind'
      },
      25: {
        type: 3,
        map: 8,
        mode: 'blind'
      },
      16: {
        type: 1,
        map: 8,
        mode: 'blind'
      },
      17: {
        type: 1,
        map: 8,
        mode: 'draft'
      },
      65: {
        type: 1,
        map: 12,
        mode: 'aram'
      },
      100: {
        type: 1,
        map: 14,
        mode: 'aram'
      },
      70: {
        type: 1,
        map: 1,
        mode: 'draft'
      },
      73: {
        type: 1,
        map: 12,
        mode: 'draft'
      },
      76: {
        type: 1,
        map: 1,
        mode: 'blind'
      },
      78: {
        type: 1,
        map: 12,
        mode: 'draft'
      },
      83: {
        type: 1,
        map: 1,
        mode: 'blind'
      },
      98: {
        type: 1,
        map: 10,
        mode: 'blind'
      },
      91: {
        type: 3,
        map: 1,
        mode: 'blind'
      },
      92: {
        type: 3,
        map: 1,
        mode: 'blind'
      },
      93: {
        type: 3,
        map: 1,
        mode: 'blind'
      },
      96: {
        type: 1,
        map: 8,
        mode: 'draft'
      },
      300: {
        type: 1,
        map: 12,
        mode: 'blind'
      },
      313: {
        type: 1,
        map: 1,
        mode: 'blind'
      }
    },
    getQueueTypes: function (b) {
      var c = Codex.common.binding.Queue,
      a = b.map(function (d) {
        if (c.mapping[d]) {
          return c.mapping[d].type
        } else {
          return undefined
        }
      });
      return a.filter(function (e, f, d) {
        return e !== undefined && d.indexOf(e) === f
      })
    }
  },
  formatter: function (c) {
    var b = (c.isGame) ? c : c.getGame(),
    a = b.get('queue');
    return Codex.common.binding.Queue.queues[a]
  }
}, function (a) {
  a.all = (function () {
    var b = [
    ];
    JSoop.iterate(a.queues, function (c, d) {
      b.push(d)
    });
    return b
  }())
}); JSoop.define('Codex.common.binding.Map', {
  extend: 'Ramen.view.binding.ModelBinding',
  statics: {
    maps: {
      1: Codex.util.I18n.trans('map_summoners_rift'),
      8: Codex.util.I18n.trans('map_crystal_scar'),
      10: Codex.util.I18n.trans('map_twisted_treeline'),
      11: Codex.util.I18n.trans('map_summoners_rift'),
      12: Codex.util.I18n.trans('map_howling_abyss'),
      14: Codex.util.I18n.trans('map_butchers_bridge')
    },
    objectives: {
      1: [
        {
          name: 'towerKills'
        },
        {
          name: 'dragonKills'
        },
        {
          name: 'baronKills'
        }
      ],
      8: [
        {
          name: 'dominionVictoryScore'
        }
      ],
      10: [
        {
          name: 'towerKills'
        },
        {
          name: 'vilemawKills'
        }
      ],
      11: [
        {
          name: 'towerKills'
        },
        {
          name: 'dragonKills'
        },
        {
          name: 'baronKills'
        }
      ],
      12: [
        {
          name: 'towerKills'
        }
      ],
      14: [
        {
          name: 'towerKills'
        }
      ]
    },
    hasWards: {
      1: true,
      8: false,
      10: false,
      11: true,
      12: false,
      14: false
    }
  },
  formatter: function (b) {
    var a = (b.isGame) ? b : b.getGame(),
    c = a.get('map');
    return Codex.common.binding.Map.maps[c]
  }
}); JSoop.define('Codex.history.view.summary.MapMode', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.binding.Map',
    'Codex.common.binding.Mode',
    'Codex.common.binding.Queue'
  ],
  rtype: 'history-map-mode',
  baseId: 'map-mode',
  baseCls: 'map-mode',
  cls: 'mode',
  tpl: '<span class="{{ baseCls }}-mode">{{ map }}</span> <span class="{{ baseCls }}-queue">{{ queue }}</span>',
  bindings: {
    map: {
      type: 'Codex.common.binding.Map'
    },
    mode: {
      type: 'Codex.common.binding.Mode'
    },
    queue: {
      type: 'Codex.common.binding.Queue'
    }
  }
}); JSoop.define('Codex.common.view.KDAPlate', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.binding.KDABadge'
  ],
  tpl: '<div class="{{ baseCls }}-kda">{{ kills }}/{{ deaths }}/{{ assists }}</div> {% if not hideBadge %} <div class="{{ baseCls }}-badge"> <span class="{% if deaths == 0 %}{{ baseCls }}-badge-perfect{% endif %}">{{ kdaBadge }}</span> KDA </div> {% endif %}',
  rtype: 'kda-plate',
  baseId: 'kda-plate',
  baseCls: 'kda-plate',
  bindings: {
    assists: 'assists',
    deaths: 'deaths',
    kills: 'kills',
    kdaBadge: {
      type: 'Codex.common.binding.KDABadge'
    }
  },
  initView: function () {
    var a = this;
    a.renderData = {
      hideBadge: (a.hideBadge === undefined) ? false : a.hideBadge
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.history.view.summary.KDA', {
  extend: 'Codex.common.view.KDAPlate',
  config: {
    defaults: {
      hideBadge: true
    }
  }
}); JSoop.define('Codex.history.view.summary.Income', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.binding.Gold'
  ],
  rtype: 'history-income',
  baseId: 'income',
  baseCls: 'income',
  tpl: '<div> <div class="{{ baseCls }}-minions"> {{ minions }} <img class="label" src="{{ asset("/css/resources/images/scoreboardicon_minion.png") }}"/> </div> <div class="{{ baseCls }}-gold"> {{ gold }} <img class="label" src="{{ asset("/css/resources/images/scoreboardicon_gold.png") }}"/> </div> </div>',
  bindings: {
    gold: {
      type: 'Codex.common.binding.Gold'
    },
    minions: 'totalMinionsKilled'
  }
}); JSoop.define('Codex.common.binding.Date', {
  extend: 'Ramen.view.binding.ModelBinding',
  requires: [
    'Codex.util.I18n'
  ],
  formatter: function (c) {
    var b = (c.isGame) ? c : c.getGame(),
    f = b.get('created'),
    a = f.getDate(),
    e = f.getMonth() + 1,
    d = f.getFullYear();
    return Codex.util.I18n.trans('date_format').replace('{{ day }}', a).replace('{{ month }}', e).replace('{{ year }}', d)
  }
}); JSoop.define('Codex.history.view.summary.DateDuration', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.binding.Date',
    'Codex.common.binding.Duration'
  ],
  rtype: 'history-date-duration',
  baseId: 'date-duration',
  baseCls: 'date-duration',
  tpl: '<span class="{{ baseCls }}-duration">{{ duration }}</span> <span class="{{ baseCls }}-date">{{ date }}</span>',
  bindings: {
    duration: {
      type: 'Codex.common.binding.Duration'
    },
    date: {
      type: 'Codex.common.binding.Date'
    }
  }
}); JSoop.define('Codex.history.view.summary.ChampionName', {
  extend: 'Codex.common.view.ChampionNameplate',
  config: {
    defaults: {
      cls: [
        'champ-role',
        'champion-name'
      ],
      hideIcon: true,
      useSummonerName: false
    }
  }
}); JSoop.define('Codex.common.view.Inventory', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout'
  ],
  rtype: 'inventory',
  baseId: 'inventory',
  baseCls: 'inventory',
  layout: {
    type: 'Codex.common.layout.GridLayout',
    gutter: 'no'
  },
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Ramen.view.container.Container',
        baseId: 'inventory-items',
        baseCls: 'inventory-items',
        gridSize: a.separateTrinket ? '3-4' : '6-7',
        cls: [
          'gs-container',
          'gs-no-gutter',
          a.separateTrinket ? 'default-3-col' : 'default-6-col'
        ],
        itemDefaults: {
          type: 'Ramen.view.binding.BindingView',
          tpl: '{{ item }}',
          bindings: {
            item: {
              type: 'DragonRamen.binding.item.Icon'
            }
          }
        },
        items: a.getItems()
      },
      {
        type: 'Ramen.view.binding.BindingView',
        baseId: 'inventory-trinket',
        baseCls: 'inventory-trinket',
        gridSize: a.separateTrinket ? '1-4' : '1-7',
        tpl: '{{ trinket }}',
        bindings: {
          trinket: {
            type: 'DragonRamen.binding.item.Icon'
          }
        },
        model: a.getTrinket()
      }
    ];
    a.callParent(arguments)
  },
  getItems: function () {
    var c = this,
    a,
    b;
    if (!c.inventoryItems) {
      b = [
      ];
      a = c.model.getGame().get('version');
      JSoop.each(c.model.get('inventory'), function (e, d) {
        if (d === 6) {
          return
        }
        b.push({
          model: DragonRamen.get('item', a, e)
        })
      });
      c.inventoryItems = b
    }
    return c.inventoryItems
  },
  getTrinket: function () {
    var a = this;
    if (!a.trinket) {
      a.trinket = DragonRamen.get('item', a.model.getGame().get('version'), a.model.get('inventory') [6])
    }
    return a.trinket
  },
  onDestroy: function () {
    var a = this;
    a.callParent(arguments);
    a.inventoryItems = null;
    a.trinket = null
  }
}); JSoop.define('Codex.history.view.summary.GameSummary', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.view.Inventory',
    'Codex.history.view.summary.ChampionName',
    'Codex.history.view.summary.ChampionPortrait',
    'Codex.history.view.summary.DateDuration',
    'Codex.history.view.summary.Income',
    'Codex.history.view.summary.KDA',
    'Codex.history.view.summary.MapMode',
    'Codex.history.view.summary.ResultMarker',
    'Codex.history.view.summary.SpellBook'
  ],
  rtype: 'history-game-summary',
  baseId: 'game-summary',
  baseCls: 'game-summary',
  tpl: '<div> <div> <div id="{{ id }}-container"> </div> </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  layout: {
    type: 'Ramen.view.layout.NoLayout'
  },
  domListeners: {
    el: {
      click: 'onElClick'
    }
  },
  initView: function () {
    var a = this;
    a.itemDefaults = {
      model: a.model
    };
    a.items = [
      {
        type: 'Codex.history.view.summary.ChampionPortrait'
      },
      {
        type: 'Codex.history.view.summary.SpellBook'
      },
      {
        type: 'Codex.history.view.summary.ChampionName'
      },
      {
        type: 'Codex.history.view.summary.MapMode'
      },
      {
        type: 'Codex.common.view.Inventory'
      },
      {
        type: 'Codex.history.view.summary.KDA'
      },
      {
        type: 'Codex.history.view.summary.Income'
      },
      {
        type: 'Codex.history.view.summary.DateDuration'
      },
      {
        type: 'Codex.history.view.summary.ResultMarker'
      }
    ];
    a.callParent(arguments)
  },
  onElClick: function () {
    var a = this;
    a.fireEvent('click', a, a.model)
  }
}); JSoop.define('Codex.history.view.list.List', {
  extend: 'Ramen.view.container.CollectionContainer',
  requires: [
    'Codex.common.binding.Queue',
    'Codex.common.view.Loading',
    'Codex.history.view.summary.GameSummary',
    'Codex.history.view.list.Empty'
  ],
  vtype: 'match-history-list',
  rtype: 'history-list',
  baseId: 'match-history-list',
  baseCls: 'match-history-list',
  tpl: '<div class="content-border"> <ul id="{{ id }}-list" class="grid-list gs-container gs-no-gutter default-1-col"></ul> </div>',
  childEls: {
    listEl: 'list'
  },
  targetEl: 'listEl',
  layout: {
    type: 'Ramen.view.layout.NoLayout'
  },
  itemDefaults: {
    type: 'Codex.history.view.summary.GameSummary',
    tag: 'li'
  },
  emptyView: {
    type: 'Codex.history.view.list.Empty'
  },
  suppressEmptyView: true,
  initView: function () {
    var b = this,
    a = Ramen.getCollection('Participants'),
    d = Ramen.getCollection('Games'),
    c = Codex.getContextUser();
    b.user = JSoop.create('Codex.model.User', {
      id: c.get('id'),
      region: c.get('region'),
      type: c.get('type')
    });
    b.collection = JSoop.create('Codex.collection.Participants', [
    ]);
    b.populateCollection();
    b.onWindowScroll = JSoop.bind(b.onWindowScroll, b);
    jQuery(window).on('scroll', b.onWindowScroll);
    b.callParent(arguments);
    b.initLoadingView();
    b.mon(a, 'add', b.onParticipantsAdd, b);
    b.mon(d, {
      'load:before': b.onGamesLoadBefore,
      'load:list': b.onGamesLoadList,
      reinitialize: b.onGamesReinitialize,
      scope: b
    })
  },
  onDestroy: function () {
    var a = this;
    jQuery(window).off('scroll', a.onWindowScroll);
    a.callParent(arguments);
    a.loadingView = null
  },
  gameCreatedComparator: function (d, c) {
    var b = d.getGame().get('created'),
    a = c.getGame().get('created');
    if (b > a) {
      return - 1
    }
    if (b < a) {
      return 1
    }
    return 0
  },
  initLoadingView: function () {
    var a = this;
    a.loadingView = Ramen.view.container.Container.prototype.initItem.call(a, {
      type: 'Codex.common.view.Loading',
      tag: 'li',
      listeners: {
        'render:during': a.hideLoadingView,
        scope: a,
        single: true
      }
    });
    a.items.add(a.loadingView)
  },
  showLoadingView: function () {
    var a = this;
    a.loadingView.show()
  },
  hideLoadingView: function () {
    var a = this;
    a.loadingView.hide()
  },
  populateCollection: function (e) {
    var d = this,
    h = function () {
      return true
    },
    g = Ramen.getCollection('Games'),
    c = [
    ],
    b = [
    ],
    f = [
    ],
    a = [
    ];
    if (e) {
      h = function (i, j) {
        return (e.champion.indexOf(i.get('champion').toString()) !== - 1 || e.champion.length === 0) && e.queue.indexOf(j.get('queue').toString()) !== - 1
      }
    }
    g.each(function (i) {
      i.getParticipants().each(function (j) {
        if (d.user.isParticipant(j) && h(j, i)) {
          c.push(j)
        }
      })
    });
    c.sort(d.gameCreatedComparator);
    JSoop.each(c, function (i) {
      a.push(i.get('id'));
      if (d.collection.indexOfKey(i.get('id')) === - 1) {
        b.push(i)
      }
    });
    d.collection.each(function (i) {
      if (a.indexOf(i.get('id')) === - 1) {
        f.push(i)
      }
    });
    d.collection.remove(f);
    d.collection.add(b);
    if (!d.collection.isSorted) {
      d.collection.sort(d.gameCreatedComparator)
    }
  },
  onWindowScroll: function () {
    var b = this,
    d = jQuery(window),
    c = d.scrollTop() + d.innerHeight(),
    a = b.el.offset().top + b.el.outerHeight(false);
    if (!b.isLoading && c > a) {
      b.fireEvent('next', b)
    }
  },
  onGamesLoadBefore: function () {
    var a = this;
    a.loading = true;
    a.showLoadingView()
  },
  onGamesLoadList: function (f, d, b) {
    var h = this,
    e = b.champion.length,
    i = b.map.length,
    c = b.queue.length,
    a = Codex.common.binding.Queue.all.length,
    g = e !== 0 || (c !== 0 && c !== a) || i !== 0;
    h.populateCollection(b);
    h.loading = false;
    h.hideLoadingView();
    h.hideEmptyView();
    if (h.collection.getCount() === 0) {
      if (g) {
        h.emptyView.showFiltered()
      } else {
        h.emptyView.showUnfiltered()
      }
      h.showEmptyView()
    }
  },
  onGamesReinitialize: function () {
    var a = this;
    a.collection.removeAll()
  },
  onParticipantsAdd: function (c, a) {
    var b = this;
    JSoop.each(a, function (d) {
      if (b.user.isParticipant(d)) {
        b.collection.add(d)
      }
    })
  }
}); JSoop.define('Codex.util.Filters', {
  singleton: true,
  requires: [
    'Codex.common.binding.Queue',
    'Codex.common.binding.Map'
  ],
  mapFilters: function (b, c) {
    var d = Codex.common.binding.Queue.mapping,
    a = Codex.common.binding.Queue.all;
    return a.filter(function (e) {
      return (b === 'default' || (d[e] !== undefined && d[e].type !== undefined && d[e].type === parseInt(b, 10))) && (c === 'default' || (d[e] !== undefined && d[e].map !== undefined && d[e].map === parseInt(c, 10)))
    })
  },
  getChampions: function () {
    var b = this,
    a = Riot.DDragon.models.champion.data,
    c = [
    ];
    JSoop.iterate(a, function (d) {
      c.push(d)
    });
    c.sort(b.championComparator);
    return c
  },
  championComparator: function (c, a) {
    var d = c.name,
    b = a.name;
    if (d < b) {
      return - 1
    }
    if (d > b) {
      return 1
    }
    return 0
  },
  getChampionIds: function () {
    var b = this,
    a = b.getChampions();
    return a.map(function (c) {
      return c.key
    })
  },
  getMapIds: function () {
    var a = this;
    return a.getObjectKeys(Codex.common.binding.Map.maps)
  },
  getMatchIds: function () {
    var a = this;
    return a.getObjectKeys(Codex.common.binding.Queue.types)
  },
  getObjectKeys: function (b) {
    var a = [
    ];
    JSoop.iterate(b, function (d, c) {
      a.push(c)
    });
    return a
  }
}); JSoop.define('Codex.util.QueryString', {
  singleton: true,
  requires: [
    'Codex.util.Filters'
  ],
  getValidURLParams: function () {
    var b = this,
    a = b.getObjectFromQuery(location.hash);
    b.nullIfNotPresent(a, 'champion', Codex.util.Filters.getChampionIds());
    b.nullIfNotPresent(a, 'map', Codex.util.Filters.getMapIds());
    b.nullIfNotPresent(a, 'matchType', Codex.util.Filters.getMatchIds());
    return a
  },
  getObjectFromQuery: function (e) {
    var a = {
    },
    c = e.split('?'),
    b,
    f;
    if (c.length !== 2) {
      return a
    }
    b = c[1].split('&');
    for (var d = 0; d < b.length; d = d + 1) {
      f = b[d].split('=');
      a[f[0]] = f[1]
    }
    return a
  },
  nullIfNotPresent: function (c, a, b) {
    if (c[a]) {
      if (jQuery.inArray(c[a], b) === - 1) {
        c[a] = null
      }
    }
  },
  getFiltersFromQuery: function () {
    var c = this,
    d,
    b,
    f,
    e,
    a = {
      champion: null,
      queue: null
    };
    d = c.getValidURLParams();
    b = d.champion ? d.champion : null;
    f = d.matchType ? d.matchType : 'default';
    e = d.map ? d.map : 'default';
    a.queue = Codex.util.Filters.mapFilters(f, e);
    if (b && jQuery.inArray(b, Codex.util.Filters.getChampionIds()) !== - 1) {
      a.champion = b
    }
    return a
  },
  getQueryFromObject: function (b) {
    var a = '';
    JSoop.iterate(b, function (d, c) {
      a = a.concat(c + '=' + d.toString() + '&')
    });
    return a.substr(0, a.length - 1)
  },
  getNewHashWithQuery: function (d) {
    var c = this,
    a = location.hash.split('?'),
    b = c.getQueryFromObject(d);
    if (b === '') {
      return a[0].replace('#', '')
    } else {
      return a[0].replace('#', '') + '?' + b
    }
  }
}); JSoop.define('Codex.history.view.header.filter.Select', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.util.Analytics',
    'Codex.util.Filters',
    'Codex.util.QueryString',
    'Codex.common.binding.Map',
    'Codex.common.binding.Queue'
  ],
  rtype: 'history-header-filter-select',
  baseId: 'history-header-filter-select',
  baseCls: 'history-header-filter-select',
  cls: 'match-filter-select',
  tpl: '<select id="{{ id }}-champion" name="champion"> <option value="default" selected>{{ trans("filter_default_champions") }}</option> {% for champion in champions %} <option value ="{{ champion.key }}" {{ champion.key == selectedChampion ? \'selected\' : null }}>{{ champion.name }}</option> {% endfor %} </select> <select id="{{ id }}-type" name="mode"> <option value="default" selected>{{ trans("filter_default_types") }}</option> {% for key,value in types %} <option value ="{{ key }}" {{ key == selectedQueue ? \'selected\' : null }}>{{ value }}</option> {% endfor %} </select> <select id="{{ id }}-map" name="map"> <option value="default" selected>{{ trans("filter_default_maps") }}</option> {% for key,value in maps %} <option value ="{{ key }}" {{ key == selectedMap ? \'selected\': null }}>{{ value }}</option> {% endfor %} </select> <button id="{{ id }}-submit" type="button">{{ trans("go_button") }}</button>',
  childEls: {
    championEl: 'champion',
    typeEl: 'type',
    mapEl: 'map',
    submitEl: 'submit'
  },
  domListeners: {
    submitEl: {
      click: 'onSubmit'
    }
  },
  initView: function () {
    var c = this,
    a = Codex.util.Filters.getChampions(),
    b = Codex.common.binding.Queue.types,
    d = Codex.common.binding.Map.maps;
    c.renderData = {
      champions: a,
      types: b,
      maps: d
    };
    c.callParent(arguments)
  },
  onRenderDuring: function () {
    var b = this,
    a = Codex.util.QueryString.getValidURLParams();
    b.callParent(arguments);
    if (a.champion) {
      b.championEl.val(a.champion)
    }
    if (a.matchType) {
      b.typeEl.val(a.matchType)
    }
    if (a.map) {
      b.mapEl.val(a.map)
    }
  },
  onSubmit: function () {
    var b = this,
    d = (b.championEl.val() !== 'default') ? b.championEl.val()  : null,
    a = b.typeEl.val(),
    c = b.mapEl.val();
    b.fireEvent('filter', {
      champion: d,
      type: a,
      map: c
    })
  }
}); JSoop.define('Codex.history.view.header.filter.Context', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.common.binding.Queue',
    'Codex.util.I18n'
  ],
  rtype: 'history-header-filter-context',
  baseId: 'history-header-filter-context',
  baseCls: 'history-header-filter-context',
  cls: 'match-filter-context',
  tpl: '<h4 class="match-filter-context-header">{{ trans("context_panel_game_visibility_label") }}</h4> <div class="match-filter-text-wrapper"> <div id="{{ id }}-warning" class="disabled-friends" style="display: {% if (showWarning and showWarning == true) %}block{% else %}none{% endif %};"> <img id="disabled-friends-img" src="{{ asset("/images/WarningYellow.png") }}"/> </div> <div class="match-filter-context-text"> {{ trans("context_panel_ranked_label") }}: <span id="{{ id }}-ranked" class="ranked-visibility match-filter-context-{{ rankedVisibility }}">{{ trans("context_panel_" ~ rankedVisibility ~ "_state") }}</span> <br /> {{ trans("context_panel_normal_label") }}: <span id="{{ id }}-normal" class="normal-visibility match-filter-context-{{ normalVisibility }}">{{ trans("context_panel_" ~ normalVisibility ~ "_state") }}</span> <br /> {{ trans("context_panel_custom_label") }}: <span id="{{ id }}-custom" class="custom-visibility match-filter-context-{{ customVisibility }}">{{ trans("context_panel_" ~ customVisibility ~ "_state") }}</span> <br /> </div> </div>',
  childEls: {
    rankedEl: 'ranked',
    normalEl: 'normal',
    customEl: 'custom',
    warningEl: 'warning'
  },
  initView: function () {
    var a = this;
    a.renderData = {
      customVisibility: 'hidden',
      normalVisibility: 'hidden',
      rankedVisibility: 'shown'
    };
    a.mon(Ramen.getCollection('Games'), 'load:list', a.onGamesLoad, a);
    a.callParent(arguments)
  },
  showReasonTips: function (h, e, d) {
    var c = this,
    b = Codex.util.I18n.trans('context_panel_friends_not_filtered_reason'),
    f = Codex.util.I18n.trans('context_panel_custom_visibility_reason'),
    a = Codex.util.I18n.trans('context_panel_ranked_visibility_reason'),
    g = c.getNormalVisibilityReason();
    if (d === 'shown') {
      c.showReasonTip(a, jQuery('.ranked-visibility'))
    }
    if (h === 'hidden') {
      f = Codex.util.I18n.trans('context_panel_custom_visibility_reason');
      c.showReasonTip(f, jQuery('.custom-visibility'))
    }
    if (e === 'hidden') {
      c.showReasonTip(g, jQuery('.normal-visibility'))
    }
    c.showReasonTip(b, jQuery('.disabled-friends>img'))
  },
  getNormalVisibilityReason: function () {
    var a = this,
    b;
    if (Codex.getCurrentUser().isLoggedIn()) {
      if (a.showWarning) {
        b = Codex.util.I18n.trans('context_panel_friends_not_filtered_reason')
      } else {
        b = Codex.util.I18n.trans('context_panel_normal_visibility_reason_not_friends')
      }
    } else {
      b = Codex.util.I18n.trans('context_panel_normal_visibility_reason_logged_out')
    }
    return b
  },
  showReasonTip: function (b, a) {
    a.off('mouseenter mouseleave');
    a.hover(function () {
      Codex.showTip(b, a)
    }, function () {
      Codex.hideTip()
    })
  },
  queueVisibility: function (c, b, a, d) {
    if (jQuery.inArray(c, b) !== - 1) {
      return 'shown'
    } else {
      if (jQuery.inArray(c, a) !== - 1) {
        return 'hidden'
      } else {
        if (jQuery.inArray(c, d) !== - 1) {
          return 'filtered'
        }
      }
    }
  },
  getVisibility: function (f, c) {
    var i = this,
    g = f.shownQueues,
    h = Codex.common.binding.Queue.getQueueTypes(g),
    e = c.queue.map(function (m) {
      return parseInt(m, 10)
    }),
    d = Codex.common.binding.Queue.getQueueTypes(e),
    j = Codex.common.binding.Queue.all,
    k = Codex.common.binding.Queue.getQueueTypes(j),
    a,
    b,
    l;
    a = jQuery(e).not(g).get();
    b = Codex.common.binding.Queue.getQueueTypes(a);
    if (e.length === j.length) {
      l = [
      ]
    } else {
      l = jQuery(k).not(d).get()
    }
    return {
      custom: i.queueVisibility(0, h, b, l),
      normal: i.queueVisibility(1, h, b, l),
      ranked: i.queueVisibility(2, h, b, l)
    }
  },
  onGamesLoad: function (g, c, e) {
    var d = this,
    f = (c.friendsFiltered === undefined) ? false : !c.friendsFiltered,
    b = d.getVisibility(c, e);
    function a(h, i) {
      h.removeClass('match-filter-context-shown');
      h.removeClass('match-filter-context-hidden');
      h.removeClass('match-filter-context-filtered');
      h.addClass('match-filter-context-' + i);
      h.html(Codex.util.I18n.trans('context_panel_' + i + '_state'))
    }
    if (f) {
      d.warningEl.css('display', 'block')
    } else {
      d.warningEl.css('display', 'none')
    }
    a(d.customEl, b.custom);
    a(d.normalEl, b.normal);
    a(d.rankedEl, b.ranked);
    d.showReasonTips(b.custom, b.normal, b.ranked)
  }
}); JSoop.define('Codex.history.view.header.filter.Filter', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.history.view.header.filter.Context',
    'Codex.history.view.header.filter.Select'
  ],
  vtype: 'match-filter',
  rtype: 'history-header-filter',
  baseId: 'history-header-filter',
  baseCls: 'history-header-filter',
  cls: 'match-filter',
  tpl: '<div class="content-border"> <div class="white-stone clearfix match-filter-container"> <div id="{{ id }}-container"></div> </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  layout: {
    type: 'Codex.common.layout.GridLayout'
  },
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.history.view.header.filter.Select',
        gridSize: '4-7'
      },
      {
        type: 'Codex.history.view.header.filter.Context',
        gridSize: '3-7'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.history.view.header.Header', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.history.view.header.Player',
    'Codex.history.view.header.filter.Filter'
  ],
  rtype: 'history-header',
  baseId: 'history-header',
  baseCls: 'history-header',
  cls: 'match-history-header',
  layout: {
    type: 'Codex.common.layout.GridLayout'
  },
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.history.view.header.Player',
        gridSize: '1-2',
        model: a.model
      },
      {
        type: 'Codex.history.view.header.filter.Filter',
        gridSize: '1-2'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.history.view.History', {
  extend: 'Ramen.view.container.Container',
  rtype: 'history',
  baseId: 'history',
  baseCls: 'history',
  requires: [
    'Codex.history.view.header.Header',
    'Codex.history.view.list.List'
  ],
  initView: function () {
    var c = this,
    d = Codex.getContextUser(),
    b = Ramen.getCollection('Participants'),
    a;
    b.each(function (e) {
      if (d.isParticipant(e)) {
        a = e;
        return false
      }
    });
    c.items = [
      {
        type: 'Codex.history.view.list.List'
      }
    ];
    if (a) {
      c.items.unshift({
        type: 'Codex.history.view.header.Header',
        model: a
      })
    } else {
      c.mon(b, 'add', c.onParticipantAdd, c)
    }
    c.callParent(arguments)
  },
  onParticipantAdd: (function () {
    var a;
    return function () {
      var b = this,
      c = Codex.getContextUser();
      clearTimeout(a);
      a = setTimeout(function () {
        var d = Ramen.getCollection('Participants').items.slice();
        d.sort(function (f, e) {
          return e.getGame().get('created') - f.getGame().get('created')
        });
        JSoop.each(d, function (e) {
          if (c.isParticipant(e)) {
            b.insert({
              type: 'Codex.history.view.header.Header',
              model: e
            }, 0);
            b.moff(Ramen.getCollection('Participants'), 'add', b.onParticipantAdd, b);
            return false
          }
        })
      }, 50)
    }
  }())
}); JSoop.define('Codex.history.helper.Route', {
  extend: 'Ramen.app.Helper',
  requires: [
    'Codex.history.view.History'
  ],
  updateAnonymousMatchHistory: function (b) {
    var d = this,
    f = Codex.getContextUser(),
    c,
    a,
    e;
    if (b.get('id') !== f.get('id')) {
      f.set('type', 'original')
    }
    a = b.findParticipant(Ramen.getCollection('Participants'));
    e = a.get('matchHistory').split('/');
    c = e.pop();
    e = e.pop();
    d.owner.navigate({
      fragment: 'match-history/' + e + '/' + c,
      silent: true,
      replace: true
    })
  },
  onRouteMatchHistory: function (c, a) {
    var b = this,
    d = Ramen.getCollection('Games');
    Codex.getBreadcrumbs().setCrumbs([]);
    a = Codex.model.User.parseId(a);
    if (a) {
      Codex.setContextUser(a, 'original')
    } else {
      Codex.getCurrentUser().on('change:region', b.updateAnonymousMatchHistory, b, {
        single: true
      });
      Codex.setContextUser()
    }
    b.owner.app.viewport.replace({
      type: 'Codex.history.view.History'
    });
    d.clearFilter();
    d.setFilters(Codex.util.QueryString.getFiltersFromQuery());
    d.getHistory(c, a);
    d.on('error', function (e) {
      if (e === 404) {
        b.owner.app.controllers.Error.playerNotFound({
          missing_player_account: a
        })
      } else {
        b.owner.app.controllers.Error.handle(e)
      }
    });
    Codex.util.Analytics.fire('view_match_history', {
      invokerId: Codex.getCurrentUser().get('id'),
      principleId: (typeof a !== 'undefined') ? a : Codex.getCurrentUser().get('id')
    });
    return false
  }
}); JSoop.define('Codex.history.Controller', {
  extend: 'Ramen.app.Controller',
  requires: [
    'Codex.history.helper.Route',
    'Codex.history.helper.View'
  ],
  helpers: {
    Route: 'Codex.history.helper.Route',
    View: 'Codex.history.helper.View'
  },
  routes: {
    'match-history/:region/:userId?:query': {
      fn: 'onRouteMatchHistory',
      scope: 'Route'
    },
    'match-history/:region/:userId': {
      fn: 'onRouteMatchHistory',
      scope: 'Route'
    },
    'match-history': {
      fn: 'onRouteMatchHistory',
      scope: 'Route'
    }
  }
}); JSoop.define('Codex.details.helper.View', {
  extend: 'Ramen.app.Helper',
  requires: [
    'Codex.util.Assets',
    'Codex.util.QueryString'
  ],
  initHelper: function () {
    var a = this;
    a.owner.control({
      'common-header-controls': {
        'colorblind:enable': function () {
          Codex.util.Assets.enableColorBlind()
        },
        'colorblind:disable': function () {
          Codex.util.Assets.disableColorBlind()
        }
      },
      'common-participant-selector': {
        select: a.onParticipantSelectorSelect,
        scope: a
      },
      'common-tab-panel': {
        select: a.onTabPanelSelect,
        scope: a
      }
    })
  },
  onParticipantSelectorSelect: function (a) {
    var b = this,
    c = Codex.util.QueryString.getObjectFromQuery(location.hash);
    c.participant = a;
    b.owner.navigate({
      fragment: Codex.util.QueryString.getNewHashWithQuery(c),
      silent: true,
      replace: true
    })
  },
  onTabPanelSelect: function (a, b) {
    var d = this,
    e = Codex.util.QueryString.getObjectFromQuery(location.hash),
    c = a.items.at(b),
    f = c ? c.id : null;
    if (!f) {
      return
    }
    e.tab = f;
    d.owner.navigate({
      fragment: Codex.util.QueryString.getNewHashWithQuery(e),
      silent: true,
      replace: true
    })
  }
}); JSoop.define('Codex.details.view.common.graph.stat.Tip', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-stat-tip',
  baseId: 'stat-tip',
  baseCls: 'stat-tip',
  tpl: '<div class="breakdown-tooltip">{{ icon }} {{ value }}</div>',
  bindings: {
    icon: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'getChampion'
    }
  },
  initView: function () {
    var a = this;
    a.renderData = {
      value: a.value
    };
    a.callParent(arguments)
  },
  getChampion: function () {
    var a = this;
    return DragonRamen.get('champion', a.version, a.champion)
  }
}); JSoop.define('Codex.common.view.graph.Graph', {
  extend: 'Ramen.view.View',
  rtype: 'graph',
  baseId: 'graph',
  baseCls: 'graph',
  getTargetEl: function () {
    var a = this;
    if (a.targetEl && a[a.targetEl]) {
      return a[a.targetEl]
    }
    return a.el
  },
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    if (a.fireEvent('render:graph:before', a) === false) {
      return
    }
    a.initGraph();
    a.fireEvent('render:graph:during', a)
  },
  onRenderAfter: function () {
    var a = this;
    a.callParent(arguments);
    a.fireEvent('render:graph:after')
  },
  createCanvas: function (b, a) {
    JSoop.applyIf(b, {
      padding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      cls: ''
    });
    return d3.select(a).append('svg:svg').attr('height', b.height).attr('width', b.width).attr('class', b.cls)
  },
  createLayer: function (b, a) {
    var d = a.el,
    c;
    JSoop.applyIf(b, {
      x: 0,
      y: 0
    });
    c = d.append('svg:g').attr('transform', 'translate(' + b.x + ', ' + b.y + ')');
    if (b.cls) {
      c.attr('class', b.cls)
    }
    if (b.clip) {
      c.attr('clip-path', 'url(#' + b.clip + ')')
    }
    return c
  },
  createRange: function (a) {
    return d3.scale.linear().domain([a.domain.min,
    a.domain.max]).range([a.range.min,
    a.range.max])
  },
  readConfig: function () {
    var c = this,
    a = c.lines,
    b = {
      x: {
        min: 0,
        max: 0
      },
      y: {
        min: 0,
        max: 0
      }
    };
    c.lines = [
    ];
    JSoop.each(a, function (e) {
      var f = d3.min(e.data),
      d = d3.max(e.data);
      if (!e.range) {
        e.range = {
        }
      }
      e.range.x = c.applyConfig(e.range.x, {
        domain: {
          min: 0,
          max: e.data.length - 1
        },
        range: {
          min: 0,
          max: c.graph.width
        }
      });
      e.range.y = c.applyConfig(e.range.y, {
        domain: {
          min: f,
          max: d
        },
        range: {
          min: 0,
          max: c.graph.height
        }
      });
      if ((e.data.length - 1) > b.x.max) {
        b.x.max = e.data.length - 1
      }
      if (f < b.y.min) {
        b.y.min = f
      }
      if (d > b.y.max) {
        b.y.max = d
      }
      c.lines.push(c.applyConfig(e.config, {
        data: e.data,
        container: c.graph,
        xRange: c.createRange(e.range.x),
        yRange: c.createRange(e.range.y)
      }))
    });
    c.axis.x.range = c.applyConfig(c.axis.x.range, {
      min: 0,
      max: c.graph.width
    });
    c.axis.x.domain = c.applyConfig(c.axis.x.domain, {
      min: b.x.min,
      max: b.x.max
    });
    c.axis.x.range = c.createRange(c.axis.x);
    c.axis.y.range = c.applyConfig(c.axis.y.range, {
      min: 0,
      max: c.graph.height
    });
    c.axis.y.domain = c.applyConfig(c.axis.y.domain, {
      max: b.y.min,
      min: b.y.max
    });
    c.axis.y.range = c.createRange(c.axis.y)
  },
  applyConfig: function (b, a) {
    return JSoop.applyIf(b || {
    }, a)
  },
  initGraph: JSoop.emptyFn,
  onRenderGraphBefore: JSoop.emptyFn,
  onRenderGraphDuring: JSoop.emptyFn,
  onRenderGraphAfter: JSoop.emptyFn
}); JSoop.define('Codex.details.view.common.graph.stat.StatGraph', {
  extend: 'Codex.common.view.graph.Graph',
  requires: [
    'Codex.details.view.common.graph.stat.Tip'
  ],
  rtype: 'common-stat',
  baseId: 'breakdown-item',
  baseCls: 'breakdown-item',
  initView: function () {
    var a = this;
    a.canvas = {
      height: 180,
      width: 160,
      padding: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 0
      },
      cls: 'breakdown-graph'
    };
    a.callParent(arguments)
  },
  onRenderGraphDuring: function () {
    var a = this;
    a.canvas.el = a.createCanvas(a.canvas, a.getTargetEl() [0]);
    a.renderGraph()
  },
  renderGraph: function () {
    var a = this;
    a.graph = JSoop.apply(a.graph || {
    }, {
      height: a.canvas.height - (a.canvas.padding.top + a.canvas.padding.bottom),
      width: a.canvas.width - (a.canvas.padding.left + a.canvas.padding.right),
      x: ((a.canvas.width / 2) + a.canvas.padding.left),
      y: ((a.canvas.height / 2) + a.canvas.padding.top)
    });
    a.graph.el = a.createLayer(a.graph, a.canvas);
    a.radius = Math.min(a.canvas.width, a.canvas.height) / 2;
    a.tooltipTpl = JSoop.create('Ramen.util.Template', a.toolTipTemplate);
    a.findNodes();
    a.addNodes();
    a.addHeader()
  },
  findNodes: function () {
    var d = this,
    b = [
      {
        name: 200,
        children: [
        ]
      },
      {
        name: 100,
        children: [
        ]
      }
    ],
    c = 1,
    a = 1;
    d.model.getParticipants().each(function (f) {
      var e = f.get('team');
      b[(e === 100) ? 1 : 0].children.push({
        name: 'player' + f.get('id'),
        val: f.get(d.field),
        player: (e === 100) ? c : a,
        championId: f.get('champion')
      });
      if (e === 100) {
        c = c + 1
      } else {
        a = a + 1
      }
    });
    d.nodes = {
      stat: d.name,
      children: b
    }
  },
  addNodes: function () {
    var e = this,
    f = e.nodes,
    d = e.radius,
    a = [
      0,
      0,
      (d / 1.8)
    ],
    h = [
      0,
      (d / 1.8),
      d
    ],
    b,
    c,
    g;
    b = d3.layout.partition().size([2 * Math.PI,
    d * d]).sort(function (j, i) {
      if (j.depth === 2 && j.parent.name === 100) {
        return d3.descending(i.val, j.val)
      } else {
        return d3.descending(j.val, i.val)
      }
    });
    c = d3.svg.arc().startAngle(function (i) {
      return i.x
    }).endAngle(function (i) {
      return i.x + i.dx
    }).innerRadius(function (i) {
      return a[i.depth]
    }).outerRadius(function (i) {
      return h[i.depth]
    });
    g = e.graph.el.datum(f).selectAll('path').data(b.nodes).enter().append('path').attr('display', function (i) {
      return i.depth ? null : 'none'
    }).attr('d', c).attr('class', function (i) {
      return (i.children) ? 'inner team-' + i.name : 'outer team-' + i.parent.name + ' player-' + i.player
    }).on('mouseover', function (i) {
      if (i.depth === 2) {
        e.mouseOver(jQuery(this), i, c.centroid(i))
      }
    }).on('mouseout', function (i) {
      if (i.depth === 2) {
        e.mouseOut()
      }
    });
    g.data(b.value(function (i) {
      return i.val
    }).nodes).attr('d', c);
    e.graph.el.datum(f).selectAll('text').data(b.nodes).enter().append('text').attr('transform', function (i) {
      var j = c.centroid(i);
      if (i.depth > 1) {
        j[0] = j[0] * 1.65;
        j[1] = j[1] * 1.55
      }
      return 'translate(' + j[0] + ',' + j[1] + ')'
    }).attr('dy', '.35em').style('text-anchor', 'middle').text(function (i) {
      return (i.depth === 1) ? Codex.util.Formatters[e.formatter](i.value)  : null
    })
  },
  addHeader: function () {
    var c = this,
    b = Codex.util.I18n.trans(c.name),
    e = (b.length > 26),
    a = 0,
    d = (c.canvas.height / 2) - (c.canvas.padding.top / 2);
    c.graph.el.append('text').attr('transform', 'translate(-' + a + ',-' + d + ')').attr('text-anchor', 'middle').attr('class', function () {
      return (e) ? 'label-small' : 'label'
    }).text(b)
  },
  mouseOver: function (b, m, n) {
    var o = this,
    a = o.radius,
    l = Math.sqrt(n[0] * n[0] + n[1] * n[1]),
    i = (n[0] / l * a),
    g = (n[1] / l * a),
    k = (o.canvas.width / 2 + a / 2),
    j = ((o.canvas.height / 2) + o.canvas.padding.top),
    f = 5,
    e = 10;
    if ((m.x - m.dx) > 2.2) {
      i = i - a - (f * 3.5 + (m.value.toString().length * 2))
    }
    Codex.showTip(JSoop.create('Codex.details.view.common.graph.stat.Tip', {
      champion: m.championId,
      version: o.model.get('version'),
      value: Codex.util.Formatters[o.formatter](m.value)
    }), b.parent(), {
      left: (k + f + i),
      top: (j + e + g)
    })
  },
  mouseOut: function () {
    Codex.hideTip()
  }
}); JSoop.define('Codex.common.plugin.TimelineView', {
  constructor: function (a) {
    var b = this;
    a.owner.on('render:before', b.onOwnerRenderBefore, a.owner)
  },
  onOwnerRenderBefore: function (d, a, c) {
    var b = d.model.isGame ? d.model : d.model.getGame();
    if (!b.timeline) {
      b.getTimeline(function () {
        d.render(a, c)
      });
      return false
    }
  }
}); JSoop.define('Codex.details.view.common.card.Stat', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-card-stat',
  baseId: 'breakdown-card',
  baseCls: 'breakdown-card',
  tpl: '<div class="card-name">{{ name }}</div> <div class="card-stat"> <div class="stat-player">{{ champion }}</div> <div class="stat-value">{{ value }}</div> </div> <div class="clearfix"></div>',
  bindings: {
    champion: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'getChampion'
    }
  },
  initView: function () {
    var a = this;
    a.findStat();
    a.renderData = {
      value: Codex.util.Formatters[a.formatter](a.value),
      name: Codex.util.I18n.trans(a.name)
    };
    a.callParent(arguments)
  },
  findStat: function () {
    var a = this;
    a.value = 0;
    a.participant = a.model.getParticipants().at(0);
    a.model.getParticipants().each(function (b) {
      if (b.get(a.field) > a.value) {
        a.value = b.get(a.field);
        a.participant = b
      }
    })
  },
  getChampion: function () {
    var a = this;
    return DragonRamen.get('champion', a.model.get('version'), a.participant.get('champion'))
  }
}); JSoop.define('Codex.details.view.common.grid.Cell', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.util.Formatters'
  ],
  rtype: 'common-grid-cell',
  baseId: 'grid-cell',
  baseCls: 'grid-cell',
  tpl: '{{ value }}',
  initView: function () {
    var b = this,
    a;
    if (JSoop.isString(b.formatter)) {
      a = function () {
        return Codex.util.Formatters[b.formatter](b.model.get(b.field))
      }
    }
    if (JSoop.isFunction(b.formatter)) {
      a = function () {
        return b.formatter(b.model)
      }
    }
    b.wrapperCls = [
      'team-' + b.model.get('team')
    ];
    if (Codex.getContextUser().isParticipant(b.model)) {
      b.wrapperCls.push('current-user')
    }
    b.renderData = {
      value: a()
    };
    b.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.grid.Row', {
  extend: 'Ramen.view.container.CollectionContainer',
  requires: [
    'Codex.details.view.common.grid.Cell'
  ],
  rtype: 'common-grid-row',
  baseId: 'grid-row',
  baseCls: 'grid-row',
  layout: {
    wrapperTag: 'td'
  },
  initView: function () {
    var a = this;
    a.itemDefaults = {
      type: 'Codex.details.view.common.grid.Cell',
      formatter: a.formatter || 'passThrough',
      field: a.field
    };
    a.callParent(arguments);
    a.items.insert(JSoop.create('Ramen.view.View', {
      tpl: '{{ value }}',
      wrapperCls: 'grid-label',
      renderData: {
        value: Codex.util.I18n.trans(a.label)
      }
    }), 0)
  }
}); JSoop.define('Codex.details.view.common.grid.HeaderCell', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-grid-header-cell',
  baseId: 'header-cell',
  baseCls: 'header-cell',
  tpl: [
    '{{ championIcon }}',
    '<div class="team-marker"></div>'
  ],
  bindings: {
    championIcon: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'getChampion'
    }
  },
  initView: function () {
    var a = this;
    a.wrapperCls = [
      'team-' + a.model.get('team')
    ];
    if (Codex.getContextUser().isParticipant(a.model)) {
      a.wrapperCls.push('current-user')
    }
    a.callParent(arguments)
  },
  getChampion: function () {
    var a = this;
    return DragonRamen.get('champion', a.model.getGame().get('version'), a.model.get('champion'))
  }
}); JSoop.define('Codex.details.view.common.grid.HeaderRow', {
  extend: 'Ramen.view.container.CollectionContainer',
  requires: [
    'Codex.details.view.common.grid.HeaderCell'
  ],
  rtype: 'common-grid-header-row',
  baseId: 'grid-header-row',
  baseCls: 'grid-header-row',
  layout: {
    wrapperTag: 'td'
  },
  initView: function () {
    var a = this;
    a.itemDefaults = {
      type: 'Codex.details.view.common.grid.HeaderCell'
    };
    a.callParent(arguments);
    a.items.insert(JSoop.create('Ramen.view.View', {
    }), 0)
  }
}); JSoop.define('Codex.details.view.urf.grid.Grid', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.grid.HeaderRow',
    'Codex.details.view.common.grid.Row'
  ],
  rtype: 'common-grid',
  baseId: 'game-grid',
  baseCls: 'game-grid',
  tpl: '<div class="content-border"> <div> <table class="table table-bordered"> <tbody id="{{ id }}-body"></tbody> </table> </div> </div>',
  layout: {
    type: 'Ramen.view.layout.NoLayout'
  },
  childEls: {
    bodyEl: 'body'
  },
  targetEl: 'bodyEl',
  initView: function () {
    var a = this;
    a.itemDefaults = {
      type: 'Codex.details.view.common.grid.Row',
      collection: a.collection,
      tag: 'tr'
    };
    a.items = [
      {
        type: 'Codex.details.view.common.grid.HeaderRow'
      }
    ];
    a.addSection('grid_section_combat', {
      kda: {
        formatter: a.kdaFormatter
      },
      largest_killing_spree: {
        formatter: a.killingSpreeFormatter
      },
      largest_multi_kill: {
        field: 'largestMultiKill'
      },
      first_blood_kill: {
        field: 'firstBloodKill',
        formatter: 'booleanFormat'
      }
    });
    a.addSection('grid_section_damage_dealt', {
      total_damage_to_champions: {
        field: 'totalDamageDealtToChampions',
        formatter: 'numberToM'
      },
      physical_damage_to_champions: {
        field: 'physicalDamageDealtToChampions',
        formatter: 'numberToM'
      },
      magic_damage_to_champions: {
        field: 'magicDamageDealtToChampions',
        formatter: 'numberToM'
      },
      true_damage_to_champions: {
        field: 'trueDamageDealtToChampions',
        formatter: 'numberToM'
      },
      damage_dealt: {
        field: 'totalDamageDealt',
        formatter: 'numberToM'
      },
      physical_damage_dealt: {
        field: 'physicalDamageDealt',
        formatter: 'numberToM'
      },
      magic_damage_dealt: {
        field: 'magicDamageDealt',
        formatter: 'numberToM'
      },
      true_damage_dealt: {
        field: 'trueDamageDealt',
        formatter: 'numberToM'
      },
      largest_critical_strike: {
        field: 'largestCriticalStrike',
        formatter: 'numberToM'
      }
    });
    a.addSection('grid_section_damage_taken', {
      damage_healed: {
        field: 'totalHeal',
        formatter: 'numberToM'
      },
      total_damage_taken: {
        field: 'totalDamageTaken',
        formatter: 'numberToM'
      },
      physical_damage_taken: {
        field: 'physicalDamageTaken',
        formatter: 'numberToM'
      },
      magic_damage_taken: {
        field: 'magicalDamageTaken',
        formatter: 'numberToM'
      },
      true_damage_taken: {
        field: 'trueDamageTaken',
        formatter: 'numberToM'
      }
    });
    a.addSection('grid_section_wards', {
      vision_items_placed: {
        field: 'wardsPlaced',
        formatter: 'numberFormat'
      },
      vision_items_destroyed: {
        field: 'wardsKilled',
        formatter: 'numberFormat'
      },
      sight_wards_purchased: {
        field: 'sightWardsBoughtInGame',
        formatter: 'numberFormat'
      },
      vision_wards_purchased: {
        field: 'visionWardsBoughtInGame',
        formatter: 'numberFormat'
      }
    });
    a.addSection('grid_section_income', {
      gold_earned: {
        field: 'goldEarned',
        formatter: 'numberToK'
      },
      gold_spent: {
        field: 'goldSpent',
        formatter: 'numberToK'
      },
      minions_killed: {
        field: 'minionsKilled',
        formatter: 'numberFormat'
      },
      neutral_minions_killed: {
        field: 'neutralMinionsKilled',
        formatter: 'numberFormat'
      },
      neutral_minions_killed_team_jungle: {
        field: 'neutralMinionsKilledTeamJungle',
        formatter: 'numberFormat'
      },
      neutral_minions_killed_enemy_jungle: {
        field: 'neutralMinionsKilledEnemyJungle',
        formatter: 'numberFormat'
      }
    });
    a.callParent(arguments)
  },
  addSection: function (c, a) {
    var b = this;
    b.items.push({
      type: 'Ramen.view.View',
      tpl: [
        '<td colspan="{{ columns }}">',
        '<div>{{ divider }}</div>',
        '</td>'
      ],
      renderData: {
        divider: Codex.util.I18n.trans(c),
        columns: b.collection.getCount() + 1
      }
    });
    JSoop.iterate(a, function (e, d) {
      e.label = d;
      b.items.push(e)
    })
  },
  kdaFormatter: function (a) {
    return a.get('kills') + '/' + a.get('deaths') + '/' + a.get('assists')
  },
  killingSpreeFormatter: function (a) {
    if (a.get('largestKillingSpree')) {
      return a.get('largestKillingSpree')
    }
    return a.get('kills')
  }
}); JSoop.define('Codex.common.view.ChampionList', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.view.ChampionNameplate'
  ],
  rtype: 'champion-list',
  baseId: 'champion-list',
  baseCls: 'champion-list',
  itemDefaults: {
    type: 'Codex.common.view.ChampionNameplate',
    hideName: true,
    hideLevel: true
  },
  initView: function () {
    var b = this,
    a = [
    ];
    JSoop.each(b.items, function (c) {
      if (c.isModel) {
        a.push({
          model: c
        })
      } else {
        a.push(c)
      }
    });
    b.items = a;
    b.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.card.FirstTower', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.view.ChampionList'
  ],
  rtype: 'common-card-first-tower',
  baseId: 'breakdown-card',
  baseCls: 'breakdown-card',
  tpl: '<div class="card-name">{{ trans("first_tower_destroyed") }}: {{ timestamp }}</div> <div id="{{ id }}-kill" class="card-building-kill"> <div id="{{ id }}-assists" class="assist"></div> <div class="killer">{{ killer }}</div> <div class="kill-icon"></div> <div class="victim">{{ victim }}</div> </div> <div class="clearfix"></div>',
  childEls: {
    assistEl: 'assists',
    killEl: 'kill'
  },
  initView: function () {
    var a = this,
    b = a.model.get('killer');
    a.renderData = {
      timestamp: Codex.util.Formatters.timeFormatMs(a.model.get('timestamp')),
      victim: a.getVictim()
    };
    if (b) {
      a.bindings = {
        killer: {
          type: 'DragonRamen.binding.champion.Icon',
          model: 'getKiller'
        }
      }
    } else {
      a.renderData.killer = '<img src="' + Codex.util.Assets.eventIcon('minion_' + a.model.get('team')) + '"/>'
    }
  },
  onRenderDuring: function () {
    var b = this,
    a = b.model.get('assists');
    b.callParent(arguments);
    if (a) {
      b.assists = JSoop.create('Codex.common.view.ChampionList', {
        items: a,
        renderTo: b.assistEl,
        autoRender: true
      });
      if (a.length > 2) {
        b.killEl.addClass('small-icons')
      }
    }
  },
  onDestroy: function () {
    var a = this;
    if (a.assists) {
      a.assists.destroy()
    }
    a.callParent(arguments)
  },
  getVictim: function () {
    var c = this,
    b = c.model.get('buildingType'),
    a = (c.model.get('team') === '100') ? '200' : '100';
    switch (b) {
      case 'TOWER_BUILDING':
        return '<img src="' + Codex.util.Assets.eventIcon('turret_' + a) + '"/>';
      case 'INHIBITOR_BUILDING':
        return '<img src="' + Codex.util.Assets.eventIcon('inhibitor_building_' + a) + '"/>';
      default:
        return Codex.util.I18n.trans(b)
    }
  },
  getKiller: function () {
    var b = this,
    a = b.model.get('killer').getGame();
    return DragonRamen.get('champion', a.get('version'), b.model.get('killer').get('champion'))
  }
}); JSoop.define('Codex.details.view.common.card.FirstBlood', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.view.ChampionList'
  ],
  rtype: 'common-card-first-blood',
  baseId: 'breakdown-card',
  baseCls: 'breakdown-card',
  tpl: '<div class="card-name">{{ trans("first_blood_kill") }}: {{ timestamp }}</div> <div id="{{ id }}-kill" class="card-champion-kill"> <div id="{{ id }}-assists" class="assist"></div> <div class="killer">{{ killer }}</div> <div class="kill-icon"></div> <div class="victim">{{ victim }}</div> </div> <div class="clearfix"></div>',
  childEls: {
    assistEl: 'assists',
    killEl: 'kill'
  },
  initView: function () {
    var a = this,
    b = a.model.get('killer');
    a.renderData = {
      timestamp: Codex.util.Formatters.timeFormatMs(a.model.get('timestamp'))
    };
    a.bindings = {
      victim: {
        type: 'DragonRamen.binding.champion.Icon',
        model: 'getVictim'
      }
    };
    if (b) {
      a.bindings.killer = {
        type: 'DragonRamen.binding.champion.Icon',
        model: 'getKiller'
      }
    } else {
      a.renderData.killer = '<img src="' + Codex.util.Assets.eventIcon('minion_' + a.model.get('team')) + '"/>'
    }
  },
  onRenderDuring: function () {
    var b = this,
    a = b.model.get('assists');
    b.callParent(arguments);
    if (a) {
      b.assists = JSoop.create('Codex.common.view.ChampionList', {
        items: a,
        renderTo: b.assistEl,
        autoRender: true
      });
      if (a.length > 2) {
        b.killEl.addClass('small-icons')
      }
    }
  },
  onDestroy: function () {
    var a = this;
    if (a.assists) {
      a.assists.destroy()
    }
    a.callParent(arguments)
  },
  getVictim: function () {
    var b = this,
    a = b.model.get('victim').getGame();
    return DragonRamen.get('champion', a.get('version'), b.model.get('victim').get('champion'))
  },
  getKiller: function () {
    var b = this,
    a = b.model.get('killer').getGame();
    return DragonRamen.get('champion', a.get('version'), b.model.get('killer').get('champion'))
  }
}); JSoop.define('Codex.details.view.common.card.FirstAscended', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-card-first-ascended',
  baseId: 'breakdown-card',
  baseCls: 'breakdown-card',
  tpl: '<div class="card-name">{{ trans("first_ascended") }}: {{ timestamp }}</div> <div class="card-ascended"> <div class="ascended">{{ ascended }}</div> </div> <div class="clearfix"></div>',
  initView: function () {
    var b = this,
    a = b.model.get('ascended');
    b.renderData = {
      timestamp: Codex.util.Formatters.timeFormatMs(b.model.get('timestamp')),
      ascended: a,
      marker: '<img src="' + Codex.util.Assets.eventIcon('champion_ascended_' + b.model.get('team')) + '"/>'
    };
    if (b.model.get('ascendedType') === 'CHAMPION_ASCENDED') {
      b.bindings = {
        ascended: {
          type: 'DragonRamen.binding.champion.Icon',
          model: 'getAscended'
        }
      }
    }
  },
  getAscended: function () {
    var b = this,
    a = b.model.get('ascended').getGame();
    return DragonRamen.get('champion', a.get('version'), b.model.get('ascended').get('champion'))
  }
}); JSoop.define('Codex.details.view.common.card.CardView', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.plugin.TimelineView',
    'Codex.details.view.common.card.FirstAscended',
    'Codex.details.view.common.card.FirstBlood',
    'Codex.details.view.common.card.FirstTower',
    'Codex.details.view.common.card.Stat'
  ],
  plugins: {
    timeline: 'Codex.common.plugin.TimelineView'
  },
  config: {
    defaults: {
      firstAscended: true,
      firstBlood: true,
      firstTower: true
    }
  },
  rtype: 'common-card',
  baseId: 'breakdown-cards',
  baseCls: 'breakdown-cards',
  onRenderDuring: function () {
    var a = this;
    if (a.firstBlood) {
      a.addCard(function (b) {
        return b.get('type') === 'CHAMPION_KILL' && b.get('killer')
      }, 'Codex.details.view.common.card.FirstBlood')
    }
    if (a.firstTower) {
      a.addCard('BUILDING_KILL', 'Codex.details.view.common.card.FirstTower')
    }
    if (a.firstAscended) {
      a.addCard(function (b) {
        return b.get('type') === 'ASCENDED_EVENT' && b.get('ascendedType') === 'CHAMPION_ASCENDED'
      }, 'Codex.details.view.common.card.FirstAscended')
    }
    JSoop.each(a.stats, function (b) {
      a.add({
        type: 'Codex.details.view.common.card.Stat',
        name: b.name,
        field: b.field,
        formatter: b.formatter,
        model: a.model
      })
    });
    a.callParent(arguments)
  },
  addCard: function (b, a) {
    var d = this,
    c;
    if (JSoop.isString(b)) {
      b = {
        type: b
      }
    }
    c = d.model.getEvents().findFirst(b);
    if (c) {
      d.add({
        type: a,
        model: c
      })
    }
  }
}); JSoop.define('Codex.details.view.common.breakdown.Breakdown', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.details.view.common.card.CardView',
    'Codex.details.view.common.graph.stat.StatGraph'
  ],
  rtype: 'classic-breakdown',
  baseId: 'match-breakdown',
  baseCls: 'match-breakdown',
  tpl: '<div class="content-border"> <div> <header class="header-primary"> <h1>{{ trans("breakdown_header") }}</h1> </header> <div id="{{ id }}-container" class="breakdown-area"></div> </div> </div>',
  layout: {
    type: 'Codex.common.layout.GridLayout'
  },
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Ramen.view.container.Container',
        cls: 'breakdown-graphs',
        gridSize: '3-5',
        itemDefaults: {
          type: 'Codex.details.view.common.graph.stat.StatGraph',
          model: a.model
        },
        items: JSoop.toArray(JSoop.clone(a.graphs))
      },
      {
        type: 'Codex.details.view.common.card.CardView',
        model: a.model,
        gridSize: '2-5',
        stats: JSoop.toArray(JSoop.clone(a.stats))
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.urf.breakdown.Breakdown', {
  extend: 'Codex.details.view.common.breakdown.Breakdown',
  rtype: 'classic-breakdown',
  graphs: [
    {
      name: 'champion_kills',
      formatter: 'numberFormat',
      field: 'kills'
    },
    {
      name: 'gold_earned',
      formatter: 'numberToK',
      field: 'goldEarned'
    },
    {
      name: 'total_damage_to_champions',
      formatter: 'numberToM',
      field: 'totalDamageDealtToChampions',
      cls: 'champion-damage-urf'
    },
    {
      name: 'vision_items_placed',
      formatter: 'numberFormat',
      field: 'wardsPlaced'
    }
  ],
  stats: [
    {
      name: 'largest_multi_kill',
      field: 'largestMultiKill',
      formatter: 'numberFormat'
    },
    {
      name: 'largest_killing_spree',
      field: 'largestKillingSpree',
      formatter: 'numberFormat'
    }
  ]
}); JSoop.define('Codex.details.view.common.scoreboard.team.Header', {
  extend: 'Ramen.view.View',
  rtype: 'common-team-header',
  baseId: 'team-header',
  baseCls: 'team-header',
  initView: function () {
    var b = this;
    function a(d) {
      var c = 0;
      b.model.getParticipants().each(function (e) {
        c = c + e.get(d)
      });
      return c
    }
    b.renderData = b.renderData || {
    };
    JSoop.applyIf(b.renderData, {
      teamId: b.model.get('id'),
      kills: a('kills'),
      gold: Codex.util.Formatters.numberToK(a('goldEarned')),
      win: b.model.get('win')
    });
    b.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.classic.scoreboard.team.Header', {
  extend: 'Codex.details.view.common.scoreboard.team.Header',
  rtype: 'classic-team-header',
  baseId: 'team-header',
  baseCls: 'team-header',
  cls: 'classic',
  tpl: '<div class="gs-container team-summary"> <div class="team"> <!-- {% if teamId == 100 %} {{  trans ("scoreboard_blue_team") }} {% else %} {{  trans ("scoreboard_purple_team") }} {% endif %} --> </div> <div class="game-conclusion"> {% if win %} {{  trans ("victory") }} {% else %} {{  trans ("defeat") }} {% endif %} </div> <div class="gold">{{ gold }}</div> <div class="kills">{{ kills }}</div> <div class="team-marker"></div> </div> <div class="vs"></div> <div class="gs-container gs-no-gutter icon-bar"> <div class="champion champion-col"></div> <div class="kills kills-col"></div> <div class="items items-col"></div> <div class="minions minions-col"></div> <div class="gold gold-col"></div> <div class="team-marker"></div> </div>',
}); JSoop.define('Codex.details.view.common.scoreboard.team.Footer', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.common.view.ChampionNameplate'
  ],
  rtype: 'common-team-footer',
  baseId: 'team-footer',
  baseCls: 'team-footer',
  childEls: {
    bansEl: 'bans'
  },
  initView: function () {
    var a = this;
    a.renderData = a.renderData || {
    };
    a.renderData.teamId = a.model.get('id');
    a.callParent(arguments)
  },
  onRenderDuring: function () {
    var b = this,
    a = b.model.get('bans');
    b.callParent(arguments);
    if (!a || !a.length) {
      b.bansEl.css('visibility', 'hidden');
      return
    }
    b.bans = [
    ];
    JSoop.each(a, function (d) {
      var c = JSoop.create('Ramen.data.Model', {
        champion: d.championId
      }, {
        name: 'Ban',
        fields: [
          'champion'
        ],
        getGame: function () {
          return b.model.getGame()
        }
      });
      b.bans.push(JSoop.create('Codex.common.view.ChampionNameplate', {
        model: c,
        hideLevel: true,
        hideName: true,
        renderTo: b.bansEl,
        autoRender: true
      }))
    })
  },
  onDestroy: function () {
    var a = this;
    if (a.bans) {
      JSoop.each(a.bans, function (b) {
        b.destroy()
      });
      a.bans = null
    }
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.classic.scoreboard.team.Footer', {
  extend: 'Codex.details.view.common.scoreboard.team.Footer',
  rtype: 'classic-team-footer',
  baseId: 'team-footer',
  baseCls: 'team-footer',
  cls: 'classic',
  tpl: '<div class="gs-container gs-half-gutter"> <div class="team-marker"></div> <div class="bans-container"> <div id="{{ id }}-bans" class="bans"> <div class="label">{{  trans ("bans") }}:</div> </div> </div> <div class="tower-kills"> <img src="{{ asset("/images/normal/event_icons/turret_" ~ teamId ~ ".png") }}"/> {{ trans(\'towers\') }}: <span>{{ towerKills }}</span> </div> <div class="dragon-kills"> <img src="{{ asset("/images/normal/event_icons/dragon_" ~ teamId ~ ".png") }}"/> {{ trans(\'dragons\') }}: <span>{{ dragonKills }}</span> </div> <div class="baron-kills"> <img src="{{ asset("/images/normal/event_icons/baron_nashor_" ~ teamId ~ ".png") }}"/> {{ trans(\'barons\') }}: <span>{{ baronKills }}</span> </div> </div>',
  initView: function () {
    var a = this;
    a.renderData = {
      baronKills: a.model.get('baronKills'),
      dragonKills: a.model.get('dragonKills'),
      towerKills: a.model.get('towerKills')
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.Name', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.view.ChampionNameplate',
    'Codex.history.view.summary.SpellBook',
    'Codex.common.view.ChampionNameplate'
  ],
  rtype: 'common-player-name',
  baseId: 'name',
  baseCls: 'name',
  cls: 'champion-col',
  initView: function () {
    var a = this,
    c = Codex.util.QueryString.getObjectFromQuery(location.hash).gameHash,
    b = c === undefined ? false : true;
    a.itemDefaults = {
      model: a.model
    };
    a.items = [
      {
        type: 'Codex.common.view.ChampionNameplate',
        hideName: true
      },
      {
        type: 'Codex.history.view.summary.SpellBook'
      },
      {
        type: 'Codex.common.view.ChampionNameplate',
        hideIcon: true,
        useSummonerLink: !b
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.KDA', {
  extend: 'Codex.common.view.KDAPlate',
  rtype: 'common-player-kda',
  baseId: 'kda',
  baseCls: 'kda',
  cls: 'kills-col',
  config: {
    defaults: {
      hideBadge: true
    }
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.Inventory', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.view.Inventory'
  ],
  rtype: 'common-player-inventory',
  baseId: 'inventory',
  baseCls: 'inventory',
  cls: 'items-col',
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.common.view.Inventory',
        model: a.model,
        separateTrinket: true
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.Gold', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.binding.Gold'
  ],
  rtype: 'common-player-gold',
  baseId: 'gold',
  baseCls: 'gold',
  cls: 'gold-col',
  tpl: '{{ gold }}',
  bindings: {
    gold: {
      type: 'Codex.common.binding.Gold'
    }
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.CS', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-player-cs',
  baseId: 'cs',
  baseCls: 'cs',
  cls: 'minions-col',
  tpl: '{{ totalMinionsKilled }}',
  bindings: {
    totalMinionsKilled: 'totalMinionsKilled'
  },
  onRenderDuring: function () {
    var b = this,
    a = JSoop.create('Ramen.util.Template', Codex.util.I18n.trans('cs_tooltip'));
    b.callParent(arguments);
    b.el.hover(function () {
      Codex.showTip(a.render({
        minions: b.model.get('minionsKilled'),
        jungle: b.model.get('neutralMinionsKilled')
      }), b.el, {
        left: 14,
        top: 20
      })
    }, function () {
      Codex.hideTip()
    })
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.Player', {
  extend: 'Ramen.view.container.Container',
  rtype: 'common-player',
  baseId: 'player',
  baseCls: 'player',
  initView: function () {
    var a = this;
    a.itemDefaults = {
      model: a.model
    };
    if (Codex.getContextUser().isParticipant(a.model)) {
      a.addCls('current-user')
    }
    a.callParent(arguments);
    a.add({
      cls: 'team-marker'
    })
  }
}); JSoop.define('Codex.details.view.classic.scoreboard.player.Player', {
  extend: 'Codex.details.view.common.scoreboard.player.Player',
  requires: [
    'Codex.details.view.common.scoreboard.player.CS',
    'Codex.details.view.common.scoreboard.player.Gold',
    'Codex.details.view.common.scoreboard.player.Inventory',
    'Codex.details.view.common.scoreboard.player.KDA',
    'Codex.details.view.common.scoreboard.player.Name'
  ],
  rtype: 'classic-player',
  baseId: 'player',
  baseCls: 'player',
  cls: 'classic',
  layout: {
    type: 'Ramen.view.layout.NoLayout'
  },
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.scoreboard.player.Name'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.KDA'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.Inventory'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.CS'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.Gold'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.scoreboard.team.Team', {
  extend: 'Ramen.view.container.CollectionContainer',
  requires: [
    'Codex.common.layout.GridLayout'
  ],
  config: {
    required: [
      'headerType',
      'footerType'
    ]
  },
  rtype: 'common-team',
  baseId: 'team',
  baseCls: 'team',
  tpl: '<header id="{{ id }}-header"></header> <ul id="{{ id }}-container" class="grid-list"></ul> <footer id="{{ id }}-footer"></footer>',
  layout: {
    type: 'Codex.common.layout.GridLayout',
    gutter: 'no',
    wrapperTag: 'li'
  },
  childEls: {
    containerEl: 'container',
    footerEl: 'footer',
    headerEl: 'header'
  },
  targetEl: 'containerEl',
  initView: function () {
    var a = this;
    a.collection = a.model.getParticipants();
    a.addCls('team-' + a.model.get('id'));
    if (!a.itemDefaults) {
      a.itemDefaults = {
      }
    } else {
      a.itemDefaults = JSoop.clone(a.itemDefaults)
    }
    a.itemDefaults.type = a.playerType;
    a.renderData = a.renderData || {
    };
    a.renderData.teamId = a.model.get('id');
    a.callParent(arguments)
  },
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    a.header = JSoop.create(a.headerType, {
      model: a.model,
      renderTo: a.headerEl,
      autoRender: true
    });
    a.footer = JSoop.create(a.footerType, {
      model: a.model,
      renderTo: a.footerEl,
      autoRender: true
    })
  },
  onDestroy: function () {
    var a = this;
    if (a.header) {
      a.header.destroy()
    }
    if (a.footer) {
      a.footer.destroy()
    }
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.classic.scoreboard.team.Team', {
  extend: 'Codex.details.view.common.scoreboard.team.Team',
  requires: [
    'Codex.details.view.classic.scoreboard.player.Player',
    'Codex.details.view.classic.scoreboard.team.Footer',
    'Codex.details.view.classic.scoreboard.team.Header'
  ],
  rtype: 'classic-team',
  baseId: 'team',
  baseCls: 'team',
  cls: 'classic',
  headerType: 'Codex.details.view.classic.scoreboard.team.Header',
  footerType: 'Codex.details.view.classic.scoreboard.team.Footer',
  playerType: 'Codex.details.view.classic.scoreboard.player.Player'
}); JSoop.define('Codex.details.view.common.scoreboard.Scoreboard', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout'
  ],
  config: {
    required: [
      'teamType'
    ]
  },
  rtype: 'common-scoreboard',
  baseId: 'scoreboard',
  baseCls: 'scoreboard',
  tpl: '<div class="content-border"> <div> <div id="{{ id }}-container"></div> </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  layout: {
    type: 'Codex.common.layout.GridLayout',
    gutter: 'no'
  },
  targetEl: 'containerEl',
  initView: function () {
    var a = this,
    b = a.model.getTeams();
    a.itemDefaults = {
      type: a.teamType,
      gridSize: '1-2'
    };
    a.items = [
      {
        model: b.findFirst({
          id: 100
        })
      },
      {
        model: b.findFirst({
          id: 200
        })
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.classic.scoreboard.Scoreboard', {
  extend: 'Codex.details.view.common.scoreboard.Scoreboard',
  requires: [
    'Codex.details.view.classic.scoreboard.team.Team'
  ],
  rtype: 'classic-scoreboard',
  baseId: 'scoreboard',
  baseCls: 'scoreboard',
  cls: 'classic',
  teamType: 'Codex.details.view.classic.scoreboard.team.Team'
}); JSoop.define('Codex.details.view.common.graph.ChampionPortrait', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-champion-portrait',
  baseId: 'champion-portrait',
  baseCls: 'champion-portrait',
  tpl: [
    '<div id="{{ id }}-icon" class="icon">{{ icon }}</div>',
    '<div class="champion-marker team-{{ team }} champion-{{ player }}"></div>'
  ],
  bindings: {
    icon: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'getChampion'
    }
  },
  childEls: {
    iconEl: 'icon'
  },
  domListeners: {
    iconEl: {
      click: 'onIconClick'
    }
  },
  initView: function () {
    var a = this;
    a.addCls(['team-' + a.model.get('team'),
    'champion-' + a.index]);
    a.renderData = {
      team: a.model.get('team'),
      player: a.playerIndex
    };
    a.isActive = true;
    a.callParent(arguments)
  },
  toggle: function () {
    var a = this;
    if (a.isActive) {
      a.deactivate()
    } else {
      a.activate()
    }
  },
  activate: function () {
    var a = this;
    a.removeCls('deactive');
    a.isActive = true;
    a.fireEvent('select', a, a.index)
  },
  deactivate: function () {
    var a = this;
    a.addCls('deactive');
    a.isActive = false;
    a.fireEvent('deselect', a, a.index)
  },
  getChampion: function () {
    var b = this,
    a = b.model.getGame();
    return DragonRamen.get('champion', a.get('version'), b.model.get('champion'))
  },
  onIconClick: function (b) {
    var a = this;
    if (b.ctrlKey || b.metaKey) {
      a.fireEvent('select:all')
    } else {
      if (b.shiftKey) {
        a.fireEvent('select:team')
      } else {
        a.toggle()
      }
    }
  }
}); JSoop.define('Codex.details.view.common.graph.TeamSelector', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.graph.ChampionPortrait'
  ],
  rtype: 'common-team-selector',
  baseId: 'team-selector',
  baseCls: 'team-selector',
  tpl: [
    '<div class="team-marker"></div>',
    '<div id="{{ id }}-container" class="champions"></div>'
  ],
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  initView: function () {
    var c = this,
    a = c.model.getParticipants(),
    e = a.getCount(),
    b = 0,
    d = Codex.getContextUser();
    if (!d.findParticipant(c.model.getGame().getParticipants())) {
      d = null
    }
    c.items = [
    ];
    c.itemDefaults = {
      type: 'Codex.details.view.common.graph.ChampionPortrait',
      listeners: {
        select: c.onChampionSelect,
        'select:team': c.onChampionSelectTeam,
        'select:all': c.onChampionSelectAll,
        deselect: c.onChampionDeselect,
        'render:during': {
          fn: function (f) {
            if (d && !d.isParticipant(f.model)) {
              f.deactivate()
            }
          },
          single: true
        },
        scope: c
      }
    };
    a.each(function (f, g) {
      var h = (c.teamIndex * e) + g;
      c.items.push({
        model: f,
        index: h,
        playerIndex: b
      });
      b = b + 1
    });
    c.callParent(arguments)
  },
  activate: function () {
    var a = this;
    a.items.each(function (b) {
      b.activate()
    })
  },
  deactivate: function () {
    var a = this;
    a.items.each(function (b) {
      b.deactivate()
    })
  },
  onChampionSelect: function (b, a) {
    this.fireEvent('select', b, a)
  },
  onChampionSelectTeam: function () {
    var a = this,
    b = 'deactivate';
    a.items.each(function (c) {
      if (!c.isActive) {
        b = 'activate';
        return false
      }
    });
    a[b]()
  },
  onChampionSelectAll: function () {
    this.fireEvent('select:all')
  },
  onChampionDeselect: function (b, a) {
    this.fireEvent('deselect', b, a)
  }
}); JSoop.define('Codex.details.view.common.graph.ChampionSelector', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.graph.TeamSelector'
  ],
  rtype: 'common-champion-selector',
  baseId: 'champion-selector',
  baseCls: 'champion-selector',
  initView: function () {
    var a = this;
    a.itemDefaults = {
      type: 'Codex.details.view.common.graph.TeamSelector',
      listeners: {
        select: a.onChampionSelect,
        'select:all': a.onSelectAll,
        deselect: a.onChampionDeselect,
        scope: a
      }
    };
    a.items = [
      {
        cls: 'team-100',
        teamIndex: 0,
        model: a.model.getTeams().get(100)
      },
      {
        cls: 'team-200',
        teamIndex: 1,
        model: a.model.getTeams().get(200)
      }
    ];
    a.callParent(arguments)
  },
  onSelectAll: function () {
    var b = this,
    a = true;
    b.items.each(function (c) {
      c.items.each(function (d) {
        if (!d.isActive) {
          a = false;
          return false
        }
      })
    });
    b.items.each(function (c) {
      c[a ? 'deactivate' : 'activate']()
    })
  },
  onChampionSelect: function (b, a) {
    this.fireEvent('select', b, a)
  },
  onChampionDeselect: function (b, a) {
    this.fireEvent('deselect', b, a)
  }
}); JSoop.define('Codex.common.view.graph.LineGraph', {
  extend: 'Codex.common.view.graph.Graph',
  rtype: 'line-graph',
  baseId: 'line-graph',
  baseCls: 'line-graph',
  initGraph: function () {
    var a = this;
    a.canvas.el = a.createCanvas(a.canvas, a.getTargetEl() [0]);
    a.callParent(arguments)
  },
  onRenderGraphDuring: function () {
    var a = this;
    a.graph = JSoop.apply(a.graph || {
    }, {
      height: a.canvas.height - (a.canvas.padding.top + a.canvas.padding.bottom),
      width: a.canvas.width - (a.canvas.padding.left + a.canvas.padding.right),
      x: a.canvas.padding.left,
      y: a.canvas.padding.top
    });
    a.graph.el = a.createLayer(a.graph, a.canvas);
    a.readConfig();
    a.renderBackground(a.graph);
    a.createClipPath({
      height: a.graph.height + 10,
      width: a.graph.width + 10,
      x: - 5,
      y: - 5,
      id: 'graph-clip'
    }, a.graph);
    a.renderXAxis(a.axis.x, a.graph);
    a.renderYAxis(a.axis.y, a.graph);
    a.renderMouseHover(a.graph);
    a.beforeLineRender();
    a.renderLines();
    a.callParent(arguments)
  },
  renderBackground: function (b) {
    var d = b.el,
    c = b.width,
    a = b.height;
    d.append('rect').attr('x', 0).attr('y', 0).attr('width', c).attr('height', a).attr('class', 'background')
  },
  renderMouseHover: function (b) {
    var c = b.el,
    a = b.height;
    c.on('mouseover', function () {
      jQuery('svg .slider').css('display', 'block')
    }).on('mouseout', function () {
      jQuery('svg .slider').css('display', 'none')
    }).on('mousemove', function () {
      var d = d3.mouse(this) [0];
      jQuery('svg .slider').attr('x1', d).attr('x2', d)
    });
    c.append('line').attr('class', 'slider').attr('y1', 0).attr('y2', a)
  },
  renderXAxis: function (d, a) {
    var h = this,
    b = d.range,
    g = d.count,
    c = d.label || '',
    f = d3.svg.axis().scale(b).ticks(g).tickSize(a.height).tickSubdivide(true).tickFormat(d.format || function (i) {
      return i
    }).tickPadding(5),
    e = h.createLayer({
      cls: 'axis axis-x'
    }, a);
    e.call(f);
    if (JSoop.isString(c)) {
      c = {
        text: c
      }
    }
    JSoop.applyIf(c, {
      x: 35,
      y: 5
    });
    e.append('text').attr('class', 'x label').attr('text-anchor', 'end').attr('x', a.width - c.x).attr('y', a.height - c.y).text(c.text)
  },
  renderYAxis: function (d, a) {
    var h = this,
    b = d.range,
    g = d.count,
    c = d.label || '',
    f = d3.svg.axis().scale(b).ticks(g).innerTickSize(6).tickSize( - a.width).tickSubdivide(true).tickFormat(d.format || function (i) {
      return i
    }).tickPadding(5).orient('left'),
    e = h.createLayer({
      cls: 'axis axis-y'
    }, a);
    e.append('svg:g').attr('transform', 'translate(0, 0)').append('svg:line').attr('x1', 0).attr('x2', a.width).attr('y1', 0).attr('y2', 0);
    e.append('svg:g').attr('transform', 'translate(0, ' + a.height + ')').append('svg:line').attr('x1', 0).attr('x2', a.width).attr('y1', 0).attr('y2', 0);
    e.call(f);
    if (JSoop.isString(c)) {
      c = {
        text: c
      }
    }
    JSoop.applyIf(c, {
      x: - 35,
      y: 13
    });
    e.append('text').attr('class', 'y label').attr('text-anchor', 'end').attr('y', c.y).attr('x', c.x).attr('transform', 'rotate(-90)').text(c.text)
  },
  renderPoints: function (j, c) {
    var g = this,
    e = j.data,
    a = j.xRange,
    d = j.yRange,
    b = j.container,
    h = (j.points || {
    }).cls || 'point',
    f = g.createLayer({
      cls: 'points',
      clip: c || undefined
    }, b),
    i;
    f.selectAll('points').data(e).enter().append('svg:circle').attr('cx', function (l, k) {
      return a(k)
    }).attr('cy', function (k) {
      return d(k)
    }).attr('r', 5).attr('class', h).on('mouseover', function () {
      d3.select(this).attr('r', 7).classed('hover', true)
    }).on('mouseout', function () {
      d3.select(this).attr('r', 5).classed('hover', false)
    });
    if (j.points && j.points.tooltip) {
      i = g.initTooltip(j.points.tooltip);
      jQuery('circle', f[0][0]).each(function (k) {
        var l = jQuery(this);
        l.hover(function () {
          Codex.showTip(i.fn.call(i.scope, j.data[k], k), l)
        }, function () {
          Codex.hideTip()
        })
      })
    }
  },
  initTooltip: function (b) {
    var a = this;
    if (!JSoop.isObject(b)) {
      b = {
        fn: b
      }
    }
    if (!b.scope) {
      b.scope = a
    }
    if (JSoop.isString(b.fn)) {
      b.fn = b.scope[b.fn]
    }
    return b
  },
  renderLine: function (b) {
    var d = this,
    c = d.createLayer({
      cls: 'line ' + (b.cls || ''),
      clip: b.clip || undefined
    }, b.container),
    a = d3.svg.line().interpolate('monotone').x(function (f, e) {
      return b.xRange(e)
    }).y(b.yRange);
    c.append('svg:path').attr('d', a(b.data))
  },
  createClipPath: function (b, a) {
    var c = a.el;
    c.append('clipPath').attr('id', b.id).append('rect').attr('x', b.x || 0).attr('y', b.y || 0).attr('height', b.height).attr('width', b.width)
  },
  renderLines: function () {
    var a = this;
    JSoop.each(a.lines, function (b) {
      a.renderLine(b);
      a.renderPoints(b, 'graph-clip')
    })
  },
  beforeLineRender: JSoop.emptyFn
}); JSoop.define('Codex.details.view.common.graph.TimelineGraph', {
  extend: 'Codex.common.view.graph.LineGraph',
  requires: [
    'Codex.util.Formatters',
    'Codex.common.plugin.TimelineView'
  ],
  plugins: {
    timeline: 'Codex.common.plugin.TimelineView'
  },
  rtype: 'timeline-graph',
  baseId: 'timeline-graph',
  baseCls: 'timeline-graph',
  initView: function () {
    var a = this;
    a.canvas = {
      height: 400,
      width: 930,
      padding: {
        left: 30,
        right: 20,
        top: 20,
        bottom: 20
      },
      cls: 'line-graph'
    };
    a.callParent(arguments)
  },
  formatGold: function (a) {
    return Codex.util.Formatters.gold(a)
  },
  formatDuration: function (a) {
    var b = d3.time.format((a < 60) ? '%-M:%S' : '%-H:%M:%S');
    return b(new Date(2014, 0, 1, 0, a))
  },
  getMin: function (a) {
    return d3.min(a)
  },
  getMax: function (a) {
    return d3.max(a)
  }
}); JSoop.define('Codex.details.view.common.graph.ChampionGold', {
  extend: 'Codex.details.view.common.graph.TimelineGraph',
  requires: [
    'Codex.util.Formatters',
    'Codex.util.I18n',
    'Codex.details.view.common.graph.ChampionSelector'
  ],
  baseCls: 'champion-gold',
  title: Codex.util.I18n.trans('champion_gold_title'),
  initGraph: function () {
    var g = this,
    h = g.getData(),
    e = g.getMin(h),
    a = g.getMax(h),
    d = g.model.getParticipants(),
    f = 0,
    b = 0,
    c;
    g.axis = {
      x: {
        format: g.formatDuration,
        count: (h[0].length < 60) ? h[0].length / 2 : h[0].length / 3,
        label: Codex.util.I18n.trans('axis_label_time')
      },
      y: {
        format: function (i) {
          return Codex.util.Formatters.numberToK(i, 0)
        },
        count: 11,
        domain: {
          max: e,
          min: a
        },
        label: Codex.util.I18n.trans('axis_label_total_gold')
      }
    };
    g.lines = [
    ];
    JSoop.each(h, function (i, j) {
      c = d.at(j).get('team');
      g.lines.push({
        data: i,
        config: {
          cls: 'champion-gold-' + j,
          clip: 'graph-clip',
          points: {
            cls: 'point champion-gold-' + j + ' team-' + c + ' player-' + ((c === 100) ? f : b),
            tooltip: function (l, n) {
              var k = g.formatGold(l),
              m = g.formatDuration(n);
              return Codex.util.I18n.trans('gold_at_time', {
                gold: k,
                time: m
              })
            }
          }
        },
        range: {
          y: {
            domain: {
              min: a,
              max: e
            }
          }
        }
      });
      if (c === 100) {
        f = f + 1
      } else {
        b = b + 1
      }
    });
    g.callParent(arguments)
  },
  getMin: function () {
    return 0
  },
  getMax: function (b) {
    var a = 0;
    JSoop.each(b, function (e) {
      var c = d3.max(e);
      if (c > a) {
        a = c
      }
    });
    return a
  },
  onRenderGraphAfter: function () {
    var a = this;
    a.championSelector = JSoop.create('Codex.details.view.common.graph.ChampionSelector', {
      model: a.model,
      cls: 'portrait-container',
      renderTo: a.el,
      autoRender: true,
      listeners: {
        select: function (c, b) {
          a.el.find('svg .champion-gold-' + b).css('display', 'block')
        },
        deselect: function (c, b) {
          a.el.find('svg .champion-gold-' + b).css('display', 'none')
        }
      }
    });
    a.callParent(arguments)
  },
  onDestroy: function () {
    var a = this;
    if (a.championSelector) {
      a.championSelector.destroy()
    }
    a.callParent(arguments)
  },
  getData: function () {
    var a = this,
    b = [
    ],
    c;
    a.model.getTeams().each(function (d) {
      d.getParticipants().each(function (e) {
        c = [
        ];
        e.getTimeline().each(function (f) {
          c.push(f.get('totalGold'))
        });
        b.push(c)
      })
    });
    return b
  }
}); JSoop.define('Codex.details.view.common.graph.TeamGold', {
  extend: 'Codex.details.view.common.graph.TimelineGraph',
  requires: [
    'Codex.util.Formatters',
    'Codex.util.I18n'
  ],
  title: Codex.util.I18n.trans('team_gold_title'),
  initGraph: function () {
    var c = this,
    d = c.getData(),
    b = c.getMin(d),
    a = c.getMax(d);
    c.axis = {
      x: {
        format: c.formatDuration,
        count: (d[0].length < 60) ? d[0].length / 2 : d[0].length / 3,
        label: Codex.util.I18n.trans('axis_label_time')
      },
      y: {
        format: c.formatYAxis,
        count: 11,
        label: Codex.util.I18n.trans('axis_label_total_gold')
      }
    };
    c.lines = [
      {
        data: d[0],
        config: {
          cls: 'team-1-gold',
          clip: 'graph-clip',
          points: {
            cls: 'point team-1',
            tooltip: {
              fn: c.formatTooltip,
              scope: c
            }
          }
        },
        range: {
          y: {
            domain: {
              min: a,
              max: b
            }
          }
        }
      },
      {
        data: d[1],
        config: {
          cls: 'team-2-gold',
          clip: 'graph-clip',
          points: {
            cls: 'point team-2',
            tooltip: {
              fn: c.formatTooltip,
              scope: c
            }
          }
        },
        range: {
          y: {
            domain: {
              min: a,
              max: b
            }
          }
        }
      }
    ];
    c.callParent(arguments)
  },
  getMin: function (a) {
    return d3.min([d3.min(a[0]),
    d3.min(a[1])])
  },
  getMax: function (a) {
    return d3.max([d3.max(a[0]),
    d3.max(a[1])])
  },
  formatTooltip: function (c, e) {
    var b = this,
    a = b.formatGold(c),
    d = b.formatDuration(e);
    return Codex.util.I18n.trans('gold_at_time', {
      gold: a,
      time: d
    })
  },
  formatYAxis: function (a) {
    a = Math.abs(a);
    if (a >= 1000) {
      return Codex.util.Formatters.numberToK(a, 0)
    }
    return a
  },
  getData: function () {
    var c = this,
    a = c.model,
    d = a.getTeams(),
    b = {
    };
    d.each(function (f) {
      var e = f.getParticipants();
      b[f.get('id')] = [
      ];
      f = b[f.get('id')];
      e.each(function (g) {
        var h = g.getTimeline();
        h.each(function (j, i) {
          if (f[i] === undefined) {
            f[i] = 0
          }
          f[i] = f[i] + j.get('totalGold')
        })
      })
    });
    return [b[100],
    b[200]]
  }
}); JSoop.define('Codex.details.view.common.graph.GoldAdvantage', {
  extend: 'Codex.details.view.common.graph.TimelineGraph',
  requires: [
    'Codex.util.Formatters',
    'Codex.util.I18n'
  ],
  title: Codex.util.I18n.trans('gold_advantage_title'),
  initGraph: function () {
    var d = this,
    e = d.getData(),
    c = d.getMin(e),
    a = d.getMax(e),
    b;
    if (Math.abs(c) > Math.abs(a)) {
      a = Math.abs(c)
    }
    a = (Math.ceil(a / 1000) + 1) * 1000;
    c = - a;
    b = a / 1000;
    d.axis = {
      x: {
        format: d.formatDuration,
        count: (e.length < 60) ? e.length / 2 : e.length / 3,
        label: Codex.util.I18n.trans('axis_label_time')
      },
      y: {
        format: d.formatYAxis,
        count: b,
        domain: {
          max: c,
          min: a
        },
        label: {
          text: Codex.util.I18n.trans('axis_label_side_gold'),
          x: - 10
        }
      }
    };
    d.lines = {
      data: e,
      config: {
        cls: 'gold-advantage',
        clip: 'graph-clip',
        points: {
          cls: d.getPointCls,
          tooltip: {
            fn: d.getTooltip,
            scope: d
          }
        }
      },
      range: {
        y: {
          domain: {
            min: a,
            max: c
          }
        }
      }
    };
    d.callParent(arguments)
  },
  beforeLineRender: function () {
    var a = this;
    a.renderAreas(a.graph);
    a.callParent(arguments)
  },
  getData: function () {
    var d = this,
    a = d.model,
    e = a.getTeams(),
    c = {
    },
    b = [
    ];
    e.each(function (g) {
      var f = g.getParticipants();
      c[g.get('id')] = [
      ];
      g = c[g.get('id')];
      f.each(function (h) {
        h.getTimeline().each(function (j, i) {
          if (g[i] === undefined) {
            g[i] = 0
          }
          g[i] = g[i] + j.get('totalGold')
        })
      })
    });
    JSoop.each(c['100'], function (g, f) {
      b[f] = g - c['200'][f]
    });
    return b
  },
  formatYAxis: function (a) {
    a = Math.abs(a);
    if (a >= 1000) {
      return Codex.util.Formatters.numberToK(a, 0)
    }
    return a
  },
  getPointCls: function (b) {
    var a = 'point ';
    if (b < 0) {
      a = a + 'team-2'
    } else {
      if (b > 0) {
        a = a + 'team-1'
      }
    }
    return a
  },
  getTooltip: function (e, g) {
    var c = this,
    a = c.formatGold(Math.abs(e)),
    f = c.formatDuration(g),
    d,
    b;
    if (e < 0) {
      b = Codex.util.I18n.trans('team_purple')
    } else {
      b = Codex.util.I18n.trans('team_blue')
    }
    d = Codex.util.I18n.trans('gold_advantage_tip', {
      ahead: b,
      gold: a,
      time: f
    });
    if (e === 0) {
      d = Codex.util.I18n.trans('even_tip', {
        time: f
      })
    }
    return d
  },
  renderAreas: function (c) {
    var f = this,
    b = f.lines[0],
    a = b.xRange,
    h = b.yRange,
    g = b.data,
    e = d3.svg.area().interpolate('monotone').x(function (k, j) {
      return a(j)
    }).y0(h(0)).y1(function (i) {
      return h(i)
    }),
    d;
    f.createClipPath({
      height: h(0),
      width: c.width,
      id: 'team-1-clip'
    }, c);
    f.createClipPath({
      height: c.height - h(0),
      width: c.width,
      x: 0,
      y: h(0),
      id: 'team-2-clip'
    }, c);
    d = f.createLayer({
      cls: 'area team-1',
      clip: 'team-1-clip'
    }, c);
    d.append('path').datum(g).attr('d', e);
    d = f.createLayer({
      cls: 'area team-2',
      clip: 'team-2-clip'
    }, c);
    d.append('path').datum(g).attr('d', e)
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.PoroKing', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-event-poroking',
  baseId: 'event-poroking',
  baseCls: 'event-poroking',
  tpl: '<div class="event-marker">{{ marker }}</div> <div class="clearfix"/>',
  initView: function () {
    var a = this;
    a.renderData = {
      marker: '<img src="' + Codex.util.Assets.eventIcon('poro_king_summon_' + a.model.get('team')) + '"/>'
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.EliteMonsterKill', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-event-elite-monster-kill',
  baseId: 'event-elite-monster-kill',
  baseCls: 'event-elite-monster-kill',
  tpl: '<div class="killer">{{ killer }}</div> <div class="kill-icon"/> <div class="victim"><img src="{{ asset("/images/normal/event_icons/" ~ monsterType ~ "_" ~ teamId ~ ".png") }}"/></div> <div class="clearfix"/>',
  bindings: {
    killer: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'getKiller'
    }
  },
  initView: function () {
    var a = this;
    a.renderData = {
      teamId: a.model.get('team'),
      monsterType: a.model.get('monsterType').toLowerCase()
    };
    a.callParent(arguments)
  },
  getKiller: function () {
    var a = this,
    b = a.model.get('killer');
    return DragonRamen.get('champion', b.getGame().get('version'), b.get('champion'))
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.ChampionKill', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-event-champion-kill',
  baseId: 'event-champion-kill',
  baseCls: 'event-champion-kill',
  tpl: '<div class="killer">{{ killer }}</div> <div class="kill-icon"/> <div class="victim">{{ victim }}</div> <div class="clearfix"/>',
  bindings: {
    killer: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'getKiller'
    },
    victim: {
      type: 'DragonRamen.binding.champion.Icon',
      model: 'getVictim'
    }
  },
  getKiller: function () {
    var a = this,
    b = a.model.get('killer');
    return DragonRamen.get('champion', b.getGame().get('version'), b.get('champion'))
  },
  getVictim: function () {
    var a = this,
    b = a.model.get('victim');
    return DragonRamen.get('champion', b.getGame().get('version'), b.get('champion'))
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.CapturePoint', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-event-capture-point',
  baseId: 'event-capture-point',
  baseCls: 'event-capture-point',
  tpl: '<div class="ascended">{{ champion }}</div> <div class="event-marker">{{ marker }}</div> <div class="clearfix"/>',
  initView: function () {
    var a = this;
    a.renderData = {
      marker: '<img src="' + Codex.util.Assets.eventIcon('captured_' + a.model.get('team')) + '"/>'
    };
    if (a.model.get('participant') && a.model.get('eventType') === 'CAPTURED') {
      a.bindings = {
        champion: {
          type: 'DragonRamen.binding.champion.Icon',
          model: 'getChampion'
        }
      }
    }
    a.callParent(arguments)
  },
  getChampion: function () {
    var b = this,
    a = b.model.get('participant');
    return DragonRamen.get('champion', a.getGame().get('version'), a.get('champion'))
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.BuildingKill', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.util.Assets'
  ],
  rtype: 'common-event-building-kill',
  baseId: 'event-building-kill',
  baseCls: 'event-building-kill',
  tpl: '<div class="killer">{{ killer }}</div> <div class="kill-icon"/> <div class="victim"><img src="{{ asset("/images/normal/event_icons/" ~ buildingType ~ "_" ~ teamId ~ ".png") }}"/></div> <div class="clearfix"/>',
  initView: function () {
    var a = this,
    b = a.model.get('killer');
    a.renderData = {
      buildingType: a.getBuildingType(),
      teamId: (a.model.get('team') === '100') ? '200' : '100'
    };
    if (b) {
      a.bindings = {
        killer: {
          type: 'DragonRamen.binding.champion.Icon',
          model: 'getKiller'
        }
      }
    } else {
      a.renderData.killer = '<img src="' + Codex.util.Assets.eventIcon('minion_' + a.model.get('team')) + '"/>'
    }
    a.callParent(arguments)
  },
  getKiller: function () {
    var a = this,
    b = a.model.get('killer');
    return DragonRamen.get('champion', b.getGame().get('version'), b.get('champion'))
  },
  getBuildingType: function () {
    var a = this;
    switch (a.model.get('buildingType')) {
      case 'TOWER_BUILDING':
        return 'turret';
      case 'INHIBITOR_BUILDING':
        return 'inhibitor_building'
    }
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.Ascended', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-event-ascended',
  baseId: 'event-ascended',
  baseCls: 'event-ascended',
  tpl: '<div class="ascended">{{ champion }}</div> <div class="event-marker">{{ marker }}</div> <div class="clearfix"/>',
  initView: function () {
    var a = this;
    a.renderData = {
      marker: '<img src="' + Codex.util.Assets.eventIcon('champion_ascended_' + a.model.get('team')) + '"/>'
    };
    if (a.model.get('ascendedType') === 'CHAMPION_ASCENDED') {
      a.bindings = {
        champion: {
          type: 'DragonRamen.binding.champion.Icon',
          model: 'getChampion'
        }
      }
    }
    a.callParent(arguments)
  },
  getChampion: function () {
    var b = this,
    a = b.model.get('ascended');
    return DragonRamen.get('champion', a.getGame().get('version'), a.get('champion'))
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.TeamSummary', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.graph.event.tip.Ascended',
    'Codex.details.view.common.graph.event.tip.BuildingKill',
    'Codex.details.view.common.graph.event.tip.CapturePoint',
    'Codex.details.view.common.graph.event.tip.ChampionKill',
    'Codex.details.view.common.graph.event.tip.EliteMonsterKill',
    'Codex.details.view.common.graph.event.tip.PoroKing'
  ],
  baseCls: 'team-summary',
  initView: function () {
    var a = this;
    a.items = [
      {
        cls: 'team-marker'
      }
    ];
    a.addCls('team-' + a.team);
    JSoop.each(a.timelineEvents, function (b) {
      a.items.push({
        type: a.getEventType(b.get('type')),
        model: b
      })
    });
    a.callParent(arguments)
  },
  getEventType: (function () {
    var a = {
      ASCENDED_EVENT: 'Codex.details.view.common.graph.event.tip.Ascended',
      BUILDING_KILL: 'Codex.details.view.common.graph.event.tip.BuildingKill',
      CAPTURE_POINT: 'Codex.details.view.common.graph.event.tip.CapturePoint',
      CHAMPION_KILL: 'Codex.details.view.common.graph.event.tip.ChampionKill',
      ELITE_MONSTER_KILL: 'Codex.details.view.common.graph.event.tip.EliteMonsterKill',
      PORO_KING_SUMMON: 'Codex.details.view.common.graph.event.tip.PoroKing'
    };
    return function (b) {
      return a[b]
    }
  }()),
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    if (a.items.getCount() === 1) {
      a.el.css('display', 'none')
    }
  }
}); JSoop.define('Codex.details.view.common.graph.event.tip.EventTip', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.graph.event.tip.TeamSummary'
  ],
  rtype: 'common-event-type',
  baseId: 'event-tip',
  baseCls: 'event-tip',
  itemDefaults: {
    type: 'Codex.details.view.common.graph.event.tip.TeamSummary'
  },
  initView: function () {
    var a = this;
    a.items = [
      {
        team: 100,
        timelineEvents: a.team1Events
      },
      {
        team: 200,
        timelineEvents: a.team2Events
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.graph.event.EventGraph', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.common.plugin.TimelineView',
    'Codex.details.view.common.graph.event.tip.EventTip'
  ],
  plugins: {
    timeline: 'Codex.common.plugin.TimelineView'
  },
  rtype: 'common-event-graph',
  baseId: 'event-graph',
  baseCls: 'event-graph',
  tpl: '<div class="team-100-kills-bg">{{ trans("KILLS") }}</div> <div class="team-100-objectives-bg">{{ trans("OBJECTIVES") }}</div> <div class="team-200-kills-bg">{{ trans("KILLS") }}</div> <div class="team-200-objectives-bg">{{ trans("OBJECTIVES") }}</div>',
  width: 880,
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    a.renderGraph();
    a.renderMouseHover();
    a.renderFrames()
  },
  renderFrames: function () {
    var b = this,
    c = b.model.getParticipants().at(0).getTimeline(),
    a = b.createLayer({
      cls: 'frames'
    }, b.canvas);
    c.each(function (f, d) {
      if (d === c.getCount() - 1) {
        return
      }
      var e = a.append('rect').attr('x', b.xRange(d)).attr('y', 0).attr('width', b.frameWidth).attr('height', 80).attr('fill', 'transparent');
      if (b.data['100'][d].events.length === 0 && b.data['200'][d].events.length === 0) {
        return
      }
      e.on('mouseover', function () {
        Codex.showTip(b.renderTip(d), this)
      });
      e.on('mouseout', function () {
        Codex.hideTip()
      })
    })
  },
  renderMouseHover: function () {
    var a = this;
    a.canvas.on('mouseover', function () {
      jQuery('svg .slider').css('display', 'block')
    }).on('mouseout', function () {
      jQuery('svg .slider').css('display', 'none')
    }).on('mousemove', function () {
      var b = d3.mouse(this) [0];
      jQuery('svg .slider').attr('x1', b).attr('x2', b)
    });
    a.canvas.append('line').attr('class', 'slider').attr('y1', 0).attr('x1', 50).attr('x2', 50).attr('y2', a.height)
  },
  renderGraph: function () {
    var c = this,
    d = c.getData(),
    b = 0,
    a = c.model.getParticipants().at(0).getTimeline().getCount() - 1;
    c.sectionHeight = 20;
    c.height = c.sectionHeight * 4;
    c.canvas = d3.select(c.el[0]).append('svg:svg').attr('height', c.height).attr('width', c.width);
    c.xRange = d3.scale.linear().domain([b,
    a]).range([0,
    c.width]);
    c.data = d;
    c.frameWidth = c.xRange(1) - c.xRange(0);
    c.renderTeamObjectives('100', 0);
    c.renderTeamKills('100', c.sectionHeight + (c.sectionHeight / 2));
    c.renderTeamKills('200', (c.sectionHeight * 2) + (c.sectionHeight / 2));
    c.renderTeamObjectives('200', c.sectionHeight * 3)
  },
  renderLines: function () {
    var e = this,
    a = e.xRange,
    d = e.data['100'].length / 2,
    c = d3.svg.axis().scale(a).ticks(d).tickSize(e.height).tickSubdivide(true).tickFormat(function () {
      return ''
    }).tickPadding(5),
    b = e.createLayer({
      cls: 'axis axis-x'
    }, e.canvas);
    b.call(c)
  },
  createLayer: function (b, a) {
    var d = a,
    c;
    JSoop.applyIf(b, {
      x: 0,
      y: 0
    });
    c = d.append('svg:g').attr('transform', 'translate(' + b.x + ', ' + b.y + ')');
    if (b.cls) {
      c.attr('class', b.cls)
    }
    if (b.clip) {
      c.attr('clip-path', 'url(#' + b.clip + ')')
    }
    return c
  },
  renderTeamKills: function (a, e) {
    var d = this,
    b = d.createLayer({
      cls: 'team-' + a + '-kills'
    }, d.canvas),
    c = d.sectionHeight / 2;
    b.selectAll('points').data(d.data[a]).enter().append('svg:circle').attr('cx', function (f) {
      return d.xRange(f.frame) - (d.frameWidth / 2)
    }).attr('cy', e).attr('r', function (f) {
      return d3.min([c * (f.kills.length / 5),
      c])
    }).attr('class', 'point kills team-' + a)
  },
  getObjectiveType: (function () {
    var a = {
      BUILDING_KILL: function (c) {
        var b = c.get('buildingType');
        if (b === 'TOWER_BUILDING') {
          return c.get('towerType')
        }
        return b
      },
      ELITE_MONSTER_KILL: function (b) {
        return b.get('monsterType')
      },
      ASCENDED_EVENT: function (b) {
        return b.get('ascendedType')
      },
      PORO_KING_SUMMON: function (b) {
        return b.get('type')
      },
      CAPTURE_POINT: function (b) {
        return b.get('eventType')
      }
    };
    return function (b) {
      var c = b.get('type');
      return a[c](b)
    }
  }()),
  getObjectivePriority: function (a) {
    var b = this;
    var c = {
      BARON_NASHOR: 3,
      VILEMAW: 3,
      DRAGON: 2,
      INHIBITOR_BUILDING: 1,
      CAPTURED: 1,
      NEXUS_TURRET: 0,
      OUTER_TURRET: 0,
      INNER_TURRET: 0,
      BASE_TURRET: 0
    };
    return c[b.getObjectiveType(a)]
  },
  getHighestPriorityObjective: function (a) {
    var b = this,
    c = a[0];
    JSoop.each(a, function (d) {
      if (b.getObjectivePriority(d) > b.getObjectivePriority(c)) {
        c = d
      }
    });
    return c
  },
  getObjectiveImage: function (b, e) {
    var c = this,
    a = b.get('team'),
    d = c.getObjectiveType(b).toLowerCase();
    if (d.indexOf('turret') !== - 1) {
      d = 'turret'
    }
    d = d + '_' + a;
    if (e) {
      d = d + '_plus'
    }
    d = Codex.util.Assets.eventIcon(d);
    return d
  },
  renderTeamObjectives: function (a, d) {
    var c = this,
    b = c.createLayer({
      cls: 'team-' + a + '-objectives'
    }, c.canvas);
    b.selectAll('points').data(c.data[a]).enter().append('svg:image').attr('x', function (e) {
      return c.xRange(e.frame - 1)
    }).attr('y', d).attr('width', c.frameWidth).attr('height', c.sectionHeight).attr('xlink:href', function (f) {
      if (f.objectives.length > 0) {
        var e = c.getHighestPriorityObjective(f.objectives);
        if (f.objectives.length > 1) {
          return c.getObjectiveImage(e, true)
        } else {
          return c.getObjectiveImage(e, false)
        }
      }
    }).attr('class', function (e) {
      if (e.objectives.length === 0) {
        return 'no-events'
      }
      return ''
    })
  },
  getData: function () {
    var c = this,
    d = {
      '100': [
      ],
      '200': [
      ]
    },
    e = c.model.getParticipants().at(0).getTimeline(),
    b = c.model.getEvents(),
    a = {
      BUILDING_KILL: true,
      ELITE_MONSTER_KILL: true,
      ASCENDED_EVENT: true,
      CAPTURE_POINT: true,
      PORO_KING_SUMMON: true
    };
    e.each(function (h, f) {
      var g = b.find({
        frameTimestamp: h.get('timestamp')
      });
      d['100'][f] = {
        frame: f,
        kills: [
        ],
        objectives: [
        ],
        events: [
        ]
      };
      d['200'][f] = {
        frame: f,
        kills: [
        ],
        objectives: [
        ],
        events: [
        ]
      };
      JSoop.each(g, function (j) {
        var i = j.get('team');
        if (i === undefined) {
          return
        }
        if (j.get('type') === 'CHAMPION_KILL') {
          if (!j.get('killer')) {
            return
          }
          d[i][f].kills.push(j)
        } else {
          if (a[j.get('type')]) {
            d[i][f].objectives.push(j)
          }
        }
        d[j.get('team')][f].events.push(j)
      })
    });
    d['100'].shift();
    d['200'].shift();
    return d
  },
  renderTip: function (b) {
    var a = this;
    return JSoop.create('Codex.details.view.common.graph.event.tip.EventTip', {
      team1Events: a.data['100'][b].events,
      team2Events: a.data['200'][b].events
    })
  }
}); JSoop.define('Codex.details.view.common.graph.Switcher', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.graph.event.EventGraph'
  ],
  rtype: 'common-graph-switcher',
  baseId: 'graph-switcher',
  baseCls: 'graph-switcher',
  tpl: '<div class="content-border"> <header class="header-primary"> <h1 id="{{ id }}-title"></h1> <nav id="map-switcher" class="header-links"> <ul> <li> <a id="{{ id }}-toggle" href="#"> <span>{{ trans("select_a_graph_title") }}</span> <div class="icon icon-arrow-down-light"><em></em></div> </a> <ul id="{{ id }}-menu" class="dropdown-menu"></ul> </li> </ul> </nav> <div id="{{ id }}-events" class="event-target"></div> </header> <div id="{{ id }}-container" class="white-stone"></div> </div>',
  childEls: {
    toggleEl: 'toggle',
    titleEl: 'title',
    menuEl: 'menu',
    eventsEl: 'events',
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  domListeners: {
    toggleEl: {
      click: 'onToggleClick'
    }
  },
  initView: function () {
    var a = this;
    a.itemDefaults = {
      model: a.model
    };
    if ('\v' === 'v') {
      a.svgNotSupported = true;
      a.svgNotSupportedString = Codex.util.I18n.trans('svg_not_supported_msg')
    }
    a.activeItem = 0;
    a.callParent(arguments)
  },
  initItem: function () {
    var b = this,
    a = b.callParent(arguments);
    b.mon(a, 'render:during', b.onItemRenderDuring, b, {
      single: true
    });
    return a
  },
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    a.eventsGraph = JSoop.create('Codex.details.view.common.graph.event.EventGraph', {
      model: a.model,
      renderTo: a.eventsEl,
      autoRender: true
    });
    if (a.svgNotSupported === true) {
      a.el.find('.content-border').append('<div class="is-ie-text"><p>' + (a.svgNotSupportedString || '') + '</p></div>')
    }
  },
  onDestroy: function () {
    var a = this;
    if (a.eventsGraph) {
      a.eventsGraph.destroy()
    }
    a.callParent(arguments)
  },
  onToggleClick: function (b) {
    var a = this;
    if (a.menuEl.css('display') === 'none') {
      a.menuEl.css('display', 'block')
    } else {
      a.menuEl.css('display', 'none')
    }
    b.preventDefault()
  },
  onItemRenderDuring: function (c) {
    var b = this,
    a = b.items.indexOf(c),
    d = jQuery('<li><a href="#">' + c.title + '</a></li>');
    d.appendTo(b.menuEl);
    d.on('click', function (f) {
      b.menuEl.css('display', 'none');
      b.items.at(b.activeItem).el.css('display', 'none');
      c.el.css('display', 'block');
      b.titleEl.html(c.title);
      b.activeItem = a;
      f.preventDefault()
    });
    if (a !== 0) {
      c.el.css('display', 'none')
    } else {
      b.titleEl.html(c.title)
    }
  }
}); JSoop.define('Codex.details.view.classic.graph.Switcher', {
  extend: 'Codex.details.view.common.graph.Switcher',
  requires: [
    'Codex.details.view.common.graph.GoldAdvantage',
    'Codex.details.view.common.graph.TeamGold',
    'Codex.details.view.common.graph.ChampionGold'
  ],
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.graph.GoldAdvantage'
      },
      {
        type: 'Codex.details.view.common.graph.TeamGold'
      },
      {
        type: 'Codex.details.view.common.graph.ChampionGold'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.tab.Tab', {
  extend: 'Ramen.view.View',
  tpl: '{{ trans(title) }}',
  rtype: 'common-tab',
  baseId: 'tab',
  baseCls: 'tab',
  domListeners: {
    el: {
      click: 'onElClick'
    }
  },
  initView: function () {
    var a = this;
    a.renderData = {
      title: a.title
    }
  },
  activate: function () {
    this.addCls('active')
  },
  deactivate: function () {
    this.removeCls('active')
  },
  onElClick: function () {
    var a = this;
    if (a.fireEvent('select:before', a) === false) {
      return
    }
    a.activate();
    a.fireEvent('select', a)
  }
}); JSoop.define('Codex.details.view.common.tab.TabPanel', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.tab.Tab'
  ],
  rtype: 'common-tab-panel',
  baseId: 'tab-panel',
  baseCls: 'tab-panel',
  tpl: '<div class="{{ baseCls }}-header" id="{{ id }}-header"></div> <div class="{{ baseCls }}-body" id="{{ id }}-body"></div>',
  childEls: {
    headerEl: 'header',
    bodyEl: 'body'
  },
  targetEl: 'bodyEl',
  initView: function () {
    var b = this,
    c = Codex.util.QueryString.getObjectFromQuery(location.hash),
    a = c.tab || null;
    if (b.activeTab === undefined) {
      b.activeTab = 0;
      JSoop.each(b.items, function (e, d) {
        if (e.id === a) {
          b.activeTab = d;
          return false
        }
      })
    }
    b.callParent(arguments);
    b.mon(b.items, {
      add: b.onTabInsert,
      remove: b.onTabRemove,
      scope: b
    });
    b.tabs = JSoop.create('Ramen.view.container.Container', {
      itemDefaults: {
        type: 'Codex.details.view.common.tab.Tab'
      }
    });
    b.onTabInsert(b.items, b.items.items);
    b.mon(b, 'render:during', b.onInitialRender, b)
  },
  onInitialRender: function () {
    var a = this;
    a.tabs.items.at(a.activeTab).onElClick()
  },
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    a.tabs.render(a.headerEl)
  },
  onDestroy: function () {
    var a = this;
    a.tabs.destroy();
    a.callParent(arguments)
  },
  onTabInsert: function (c, a) {
    var b = this;
    JSoop.each(a, function (e) {
      var d = b.items.indexOf(e);
      b.tabs.insert({
        title: e.title,
        tabId: e.getId(),
        listeners: {
          'select:before': b.onTabSelectBefore,
          select: b.onTabSelect,
          scope: b
        }
      }, d)
    })
  },
  onTabRemove: function (d, c) {
    var b = this,
    a = [
    ];
    JSoop.each(c, function (e) {
      var f = e.getId();
      b.tabs.items.each(function (g) {
        if (g.tabId === f) {
          a.push(g);
          return false
        }
      })
    });
    b.tabs.remove(a)
  },
  onTabSelectBefore: function (b) {
    var a = this;
    a.tabs.items.each(function (d, c) {
      if (d !== b) {
        d.deactivate()
      }
      a.layout.getWrapperEl(a.items.at(c)).css('display', 'none')
    })
  },
  onTabSelect: function (c) {
    var b = this,
    a = b.tabs.items.indexOf(c);
    b.layout.getWrapperEl(b.items.at(a)).css('display', 'block');
    b.fireEvent('select', b, a)
  }
}); JSoop.define('Codex.details.view.common.map.Map', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.common.view.ChampionNameplate'
  ],
  rtype: 'common-map',
  baseId: 'map',
  baseCls: 'map',
  tpl: '<div class="content-border"> <div> <header class="header-primary"> <h1>&nbsp;</h1> <nav class="header-links"> <ul> <li> <a id="{{ id }}-link" href="#"> <span id="{{ id }}-title">{{ trans("champion_kills") }}</span> <div class="icon icon-arrow-down-light"><em></em></div> </a> <ul id="{{ id }}-menu" class="dropdown-menu"> <li><a id="{{ id }}-champion-kills" href="#">{{ trans("champion_kills") }}</a></li> <li><a id="{{ id }}-building-kills" href="#">{{ trans("building_kills") }}</a></li> </ul> </li> </ul> </nav> </header> <div class="event-map"> </div> <div id="{{ id }}-champions" class="champions"> <div id="{{ id }}-team-100" class="team-100"></div> <div id="{{ id }}-team-200" class="team-200"></div> </div> </div> </div>',
  childEls: {
    linkEl: 'link',
    titleEl: 'title',
    menuEl: 'menu',
    team1El: 'team-100',
    team2El: 'team-200',
    championKillsEl: 'champion-kills',
    buildingKillsEl: 'building-kills',
    championsEl: 'champions'
  },
  domListeners: {
    linkEl: {
      click: 'toggleDropdown'
    },
    championKillsEl: {
      click: 'showChampionKills'
    },
    buildingKillsEl: {
      click: 'showBuildingKills'
    }
  },
  mapWidth: 289,
  mapHeight: 289,
  domains: {
    map1: {
      min: {
        x: - 650,
        y: - 83
      },
      max: {
        x: 14076,
        y: 14522
      }
    },
    map3: {
      min: {
        x: - 500,
        y: - 500
      },
      max: {
        x: 15000,
        y: 15000
      }
    },
    map8: {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: 13987,
        y: 13987
      }
    },
    map10: {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: 15398,
        y: 15398
      }
    },
    map11: {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: 14820,
        y: 14881
      }
    },
    map12: {
      min: {
        x: - 28,
        y: - 19
      },
      max: {
        x: 12849,
        y: 12858
      }
    },
    map14: {
      min: {
        x: - 28,
        y: - 19
      },
      max: {
        x: 12849,
        y: 12858
      }
    }
  },
  initView: function () {
    var a = this;
    if ('\v' === 'v') {
      a.svgNotSupported = true;
      a.svgNotSupportedString = Codex.util.I18n.trans('svg_not_supported_msg')
    }
    a.callParent(arguments)
  },
  onDestroy: function () {
    var a = this;
    if (a.championPortraits) {
      JSoop.each(a.championPortraits, function (b) {
        b.destroy()
      })
    }
  },
  toggleDropdown: function (b) {
    var a = this;
    if (a.menuEl.css('display') === 'none') {
      a.menuEl.css('display', 'block')
    } else {
      a.menuEl.css('display', 'none')
    }
    b.preventDefault()
  },
  showChampionKills: function (c) {
    var a = this,
    b = a.el.find('.event-map');
    b.find('.building-kills').hide();
    b.find('.champion-kills').show();
    a.championsEl.show();
    a.menuEl.css('display', 'none');
    a.titleEl.html(a.championKillsEl.text());
    if (c) {
      c.preventDefault()
    }
  },
  showBuildingKills: function (c) {
    var a = this,
    b = a.el.find('.event-map');
    a.championsEl.hide();
    b.find('.champion-kills').hide();
    b.find('.building-kills').show();
    a.menuEl.css('display', 'none');
    a.titleEl.html(a.buildingKillsEl.text());
    c.preventDefault()
  },
  toggleChampionKills: function (f) {
    var c = this,
    d = c.el.find('.event-map'),
    a = jQuery(f.target),
    b = a.parents('.champion-nameplate').attr('data-player');
    d.find('.champion-death').hide();
    if (a.hasClass('selected')) {
      a.removeClass('selected');
      d.find('.champion-kill').show()
    } else {
      jQuery('.champions img').removeClass('selected');
      a.addClass('selected');
      d.find('.champion-kill').hide();
      d.find('.player-' + b).show()
    }
  },
  onRenderDuring: function () {
    var g = this,
    f = g.model.getParticipants(),
    h = g.model.get('map'),
    e = g.domains['map' + h],
    a = CODEX_ASSET_PATH + '/images/maps/map' + h + '.png',
    c,
    i,
    d,
    b;
    g.callParent(arguments);
    c = g.el.find('.event-map');
    g.canvas = d3.select(c[0]).append('svg:svg').attr('width', g.mapWidth).attr('height', g.mapHeight);
    g.xScale = d3.scale.linear().domain([e.min.x,
    e.max.x]).range([0,
    g.mapWidth]);
    g.yScale = d3.scale.linear().domain([e.min.y,
    e.max.y]).range([g.mapHeight,
    0]);
    g.canvas.append('image').attr('xlink:href', a).attr('x', '0').attr('y', '0').attr('width', g.mapWidth).attr('height', g.mapHeight);
    i = g.canvas.append('svg:g').attr('class', 'champion-kills');
    b = i.append('svg:g').attr('class', 'champion-deaths');
    d = g.canvas.append('svg:g').attr('class', 'building-kills');
    g.model.getTimeline(function () {
      g.model.getEvents().each(function (k) {
        var j = k.get('team'),
        m = k.get('timestamp'),
        o,
        l,
        n;
        switch (k.get('type')) {
          case 'CHAMPION_KILL':
            o = k.get('killer');
            l = k.get('victim');
            if (o) {
              n = 'champion-kill team-' + j + ' champion-' + o.get('champion') + ' player-' + o.get('id');
              i.append('svg:circle').attr('cx', g.xScale(k.get('x'))).attr('cy', g.yScale(k.get('y'))).attr('r', 5).attr('class', n)
            }
            if (l) {
              n = 'champion-death champion-' + l.get('champion') + ' player-' + l.get('id');
              b.append('svg:image').attr('x', g.xScale(k.get('x')) - 12).attr('y', g.yScale(k.get('y')) - 12).attr('width', 24).attr('height', 24).attr('xlink:href', CODEX_ASSET_PATH + '/images/map_icons/kill.png').attr('style', 'display: none').attr('class', n)
            }
            break;
          case 'BUILDING_KILL':
            d.append('svg:circle').attr('cx', g.xScale(k.get('x'))).attr('cy', g.yScale(k.get('y'))).attr('r', 5).attr('class', 'building-kill').on('mouseover', function () {
              Codex.showTip(Codex.util.Formatters.timeFormatMs(m), jQuery(this), {
                left: 0,
                top: 5
              })
            }).on('mouseout', function () {
              Codex.hideTip()
            });
            break
        }
      })
    }); g.championPortraits = [
    ]; f.each(function (l) {
      var k = l.get('team'),
      j = l.get('id'),
      m = JSoop.create('Codex.common.view.ChampionNameplate', {
        model: l,
        tag: {
          tag: 'div',
          'data-team': k,
          'data-player': j
        },
        hideName: true,
        hideLevel: true,
        renderTo: (k === 100) ? g.team1El : g.team2El,
        autoRender: true
      });
      g.championPortraits.push(m)
    }); g.el.on('click', '.champions > div > div', JSoop.bind(g.toggleChampionKills, g)); g.showChampionKills(); if (g.svgNotSupported === true) {
      c.find('svg').css({
        width: c.attr('width'),
        height: c.attr('height')
      }).find('img').attr('src', c.find('img').attr('href')).parent().find('circle').each(function () {
        var j = jQuery(this);
        j.css({
          left: j.attr('cx') - 5,
          top: j.attr('cy') - 5
        })
      });
      g.el.findel.find('.content-border').append('<div class="is-ie-text"><p>' + g.svgNotSupportedString || '</p></div>')
    }
  }
}); JSoop.define('Codex.details.view.common.header.Player', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.binding.Date',
    'Codex.common.binding.Duration',
    'Codex.common.binding.Map',
    'Codex.common.binding.Queue'
  ],
  rtype: 'common-header-map',
  baseId: 'player-header',
  baseCls: 'player-header',
  tpl: '<div class="{{ baseCls }}-icon">{{ icon }}</div> <div class="{{ baseCls }}-content"> <div class="{{ baseCls }}-name">{{ summonerName }}</div> <div class="{{ baseCls }}-mode">{{ map }}</div> <div class="{{ baseCls }}-additional-details"> <span class="{{ baseCls }}-queue">{{ queue }}</span> <span class="{{ baseCls }}-duration">{{ duration }}</span> <span class="{{ baseCls }}-date">{{ date }}</span> </div> </div>',
  bindings: {
    duration: {
      type: 'Codex.common.binding.Duration'
    },
    date: {
      type: 'Codex.common.binding.Date'
    },
    queue: {
      type: 'Codex.common.binding.Queue'
    },
    map: {
      type: 'Codex.common.binding.Map'
    },
    summonerName: {
      field: 'summonerName',
      model: 'user'
    },
    icon: function (b, a) {
      var c = a.user.get('summonerName'),
      d = a.user.get('currentRegion');
      return Ramen.dom.Helper.markup({
        tag: 'img',
        src: '//avatar.leagueoflegends.com/' + d + '/' + c + '.png'
      })
    }
  }
}); JSoop.define('Codex.details.view.common.header.Map', {
  extend: 'Ramen.view.binding.BindingView',
  requires: [
    'Codex.common.binding.Date',
    'Codex.common.binding.Duration',
    'Codex.common.binding.Map',
    'Codex.common.binding.Queue'
  ],
  rtype: 'common-header-map',
  baseId: 'map-header',
  baseCls: 'map-header',
  tpl: '<div class="{{ baseCls }}-icon">{{ icon }}</div> <div class="{{ baseCls }}-content"> <div class="{{ baseCls }}-mode">{{ map }}</div> <div class="{{ baseCls }}-additional-details"> <span class="{{ baseCls }}-queue">{{ queue }}</span> <span class="{{ baseCls }}-duration">{{ duration }}</span> <span class="{{ baseCls }}-date">{{ date }}</span> </div> </div>',
  bindings: {
    duration: {
      type: 'Codex.common.binding.Duration'
    },
    date: {
      type: 'Codex.common.binding.Date'
    },
    queue: {
      type: 'Codex.common.binding.Queue'
    },
    map: {
      type: 'Codex.common.binding.Map'
    },
    icon: function (a) {
      return Ramen.dom.Helper.markup({
        tag: 'img',
        src: CODEX_ASSET_PATH + '/images/maps/map' + a.get('map') + '.png'
      })
    }
  }
}); JSoop.define('Codex.util.Share', {
  singleton: true,
  share: function (d) {
    var f = 640,
    a = 395,
    e = (window.screen.width / 2) - ((f / 2) + 10),
    c = (window.screen.height / 2) - ((a / 2) + 50),
    b = 'height=' + a + ',width=' + f + 'left=' + e + ',top=' + c + ',screenX=' + e + ',screenY=' + c + ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no';
    window.open(d, '_blank', b);
    return false
  },
  facebook: function (b) {
    var c = this,
    a = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(b);
    Codex.util.Analytics.fire('share_facebook');
    c.share(a)
  },
  twitter: function (a, c) {
    var b = this,
    d = 'https://twitter.com/share?text=' + encodeURIComponent(c + ' #LeagueOfLegends') + '&url=' + encodeURIComponent(a);
    Codex.util.Analytics.fire('share_twitter');
    b.share(d)
  },
  vk: function (b) {
    var c = this,
    a = 'http://vk.com/share.php?url=' + encodeURIComponent(b);
    Codex.util.Analytics.fire('share_vk');
    c.share(a)
  },
  mail: function () {
    Codex.util.Analytics.fire('share_mail')
  }
}); JSoop.define('Codex.util.RequestPromise', {
  mixins: {
    observable: 'JSoop.mixins.Observable',
    configurable: 'JSoop.mixins.Configurable'
  },
  isLoading: false,
  requestCount: 0,
  config: {
    defaults: {
      headers: {
      }
    }
  },
  constructor: function (a) {
    var b = this;
    b.initMixin('configurable', [
      a
    ]);
    b.initMixin('observable');
    if (b.autoLoad) {
      b.load()
    }
  },
  load: function () {
    var a = this;
    if (a.isLoading) {
      return
    }
    a.requestCount = a.requestCount + 1;
    jQuery.ajax({
      url: a.url,
      crossDomain: true,
      headers: a.headers,
      dataType: 'json',
      success: JSoop.bind(a.onXHRSuccess, a),
      error: JSoop.bind(a.onXHRError, a)
    })
  },
  destroy: function () {
    var a = this;
    a.removeAllListeners()
  },
  onXHRSuccess: function (c, a) {
    var b = this;
    b.fireEvent('load', b, c, a);
    b.fireEvent('complete', b)
  },
  onXHRError: function (d, a, b) {
    var c = this;
    if (!c.retryXHR()) {
      c.fireEvent('error', c, d.status, b)
    }
  },
  retryXHR: function () {
    var a = this;
    a.fireEvent('retry', a);
    if (a.retry && a.requestCount <= 8) {
      setTimeout(function () {
        a.load()
      }, (Math.min((Math.pow(2, a.requestCount) * 500), 60000)));
      return true
    }
    return false
  }
}); JSoop.define('Codex.util.ACS', {
  singleton: true,
  requires: [
    'Codex.util.RequestPromise',
    'Codex.util.Config',
    'Codex.util.QueryString'
  ],
  headers: null,
  promiseCache: {
  },
  setHeaders: function (a) {
    this.headers = a
  },
  getHeaders: function () {
    return this.headers
  },
  getGame: function (b) {
    var a = 'stats/game/' + b.region + '/' + b.id,
    d = Codex.util.QueryString.getObjectFromQuery(location.hash),
    e = {
    },
    c = false;
    if (b.visiblePlatformId !== undefined && b.visibleAccountId !== undefined) {
      e.visiblePlatformId = b.visiblePlatformId;
      e.visibleAccountId = b.visibleAccountId;
      c = true
    }
    if (d.gameHash !== undefined) {
      e.gameHash = d.gameHash;
      c = true
    }
    if (c) {
      return this.url + a + '?' + Codex.util.QueryString.getQueryFromObject(e)
    } else {
      return this.url + a
    }
  },
  getTimeline: function (d, b) {
    var c = Codex.util.QueryString.getObjectFromQuery(location.hash),
    e = {
    },
    a = this.url + 'stats/game/' + d + '/' + b + '/timeline';
    if (c.gameHash !== undefined) {
      e.gameHash = c.gameHash;
      return a + '?' + Codex.util.QueryString.getQueryFromObject(e)
    }
    return a
  },
  getPlayerHistory: function (b, d, c) {
    var a = this;
    c = c || '';
    if (!b && !d) {
      return a.url + 'stats/player_history/auth' + c
    }
    return a.url + 'stats/player_history/' + b + '/' + d + c
  },
  getPlayer: function (a) {
    var b = window.RiotBar ? RiotBar.account.getRegion()  : Riot.getCookie('PVPNET_REGION');
    if (b) {
      b = b.toUpperCase()
    }
    return this.url + 'players?name=' + encodeURIComponent(a) + '&region=' + b
  },
  getPlayerByAccount: function (b, a) {
    if (!a) {
      a = Codex.util.Region.getRegion()
    }
    return this.url + 'players/current?account=' + b + '&region=' + a
  },
  makeRequest: function (a) {
    var b = this,
    c = b.promiseCache[a.url];
    if (c) {
      b.listenToPromise(c, a)
    } else {
      c = b.promiseCache[a.url] = b.createPromise(a)
    }
    return c
  },
  createPromise: function (c) {
    var d = this,
    b = c.url,
    a = (c.retry || false),
    e = JSoop.create('Codex.util.RequestPromise', {
      url: b,
      headers: d.getHeaders(),
      autoLoad: true,
      listeners: {
        complete: d.destroyPromise,
        scope: d
      },
      retry: a
    });
    d.listenToPromise(e, c);
    return e
  },
  listenToPromise: function (b, a) {
    JSoop.applyIf(a, {
      listeners: {
        scope: b
      }
    });
    b.on(a.listeners)
  },
  destroyPromise: function (b) {
    var a = this;
    b.destroy();
    delete a.promiseCache[b.url]
  }
}, function (a) {
  a.url = Codex.util.Config.get('acs_url')
}); JSoop.define('Codex.util.OpenGraph', {
  singleton: true,
  requires: [
    'Codex.common.binding.Map',
    'Codex.util.ACS'
  ],
  getGameTitle: function (l) {
    var k = l.getUser(Codex.getContextUser()),
    g,
    e,
    i,
    c,
    b,
    a,
    f,
    d,
    j,
    h;
    if (k) {
      g = k.get('summonerName');
      e = k.get('kills');
      i = k.get('deaths');
      c = k.get('assists');
      b = k.get('champion');
      a = Codex.common.binding.Map.maps[l.get('map')];
      h = Riot.DDragon.useModel('champion');
      f = h.get(Codex.util.DataDragon.getKeyFromId(h, b)).name;
      return Codex.util.I18n.trans('opengraph_participant_title').replace('{{summonerName}}', g).replace('{{kills}}', e).replace('{{deaths}}', i).replace('{{assists}}', c).replace('{{champion}}', f).replace('{{map}}', a)
    } else {
      a = Codex.common.binding.Map.maps[l.get('map')];
      j = l.getTeams().items;
      if (j[0].get('win')) {
        d = j[0].get('id')
      } else {
        d = j[1].get('id')
      }
      return Codex.util.I18n.trans('opengraph_title').replace('{{team}}', Codex.util.I18n.trans('team_' + d)).replace('{{map}}', a)
    }
  },
  getGameDescription: function (b) {
    var a = b.getUser(Codex.getContextUser()),
    c,
    d;
    if (a) {
      c = a.get('summonerName');
      return Codex.util.I18n.trans('opengraph_participant_description').replace('{{summonerName}}', c)
    } else {
      d = Codex.common.binding.Map.maps[b.get('map')];
      return Codex.util.I18n.trans('opengraph_description').replace('{{map}}', d)
    }
  },
  getGameImage: function (c) {
    var a = c.getUser(Codex.getContextUser()),
    e = Riot.DDragon.models.champion,
    f,
    b,
    d;
    if (a) {
      f = a.get('champion');
      b = e.getImg(Codex.util.DataDragon.getKeyFromId(e, f), {
        src: 'full'
      });
      d = jQuery(b).first().attr('src');
      return d
    }
    return window.location.protocol + '//' + window.location.host + window.location.pathname + CODEX_ASSET_PATH + '/images/maps/map' + c.get('map') + '.png'
  },
  getGameUrl: function (b) {
    var d = this,
    g = d.getGameTitle(b),
    c = d.getGameDescription(b),
    f = d.getGameImage(b),
    e = b.get('region'),
    a = window.location.pathname + window.location.hash;
    return this.url + 'opengraph?title=' + encodeURIComponent(g) + '&description=' + encodeURIComponent(c) + '&image=' + encodeURIComponent(f) + '&platform=' + encodeURIComponent(e) + '&redirectPath=' + encodeURIComponent(a)
  }
}, function (a) {
  a.url = Codex.util.Config.get('acs_url')
}); JSoop.define('Codex.details.view.common.header.Controls', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.util.Assets',
    'Codex.util.OpenGraph',
    'Codex.util.Share'
  ],
  rtype: 'common-header-controls',
  baseId: 'controls',
  baseCls: 'controls',
  tpl: '<div class="{{ baseCls }}-share-call-to-action"> {{ trans(\'share_call_to_action\') }} </div> <div class="{{ baseCls }}-share-buttons"> <a id="{{ id }}-mail" class="share-button mail-button" href="mailto:?subject={{ gameTitle }}&amp;body={{ url }}"/></a> <a id="{{ id }}-tweet" class="share-button tweet-button" href="http://twitter.com/share?text={{ gameTitle }}&url={{ url }}" target="_blank"></a> <a id="{{ id }}-facebook" class="share-button facebook-share-button" href="http://www.facebook.com/share.php?u={{ opengraphUrl }}" target="_blank"></a> {% if region == "RU" %} <a id="{{ id }}-vk-button" class="share-button vk-button" href="http://vk.com/share.php?url={{ opengraphUrl }}" target="_blank"></a> {% endif %} </div>',
  childEls: {
    colorBlindEl: 'color-blind',
    facebookEl: 'facebook',
    mailEl: 'mail',
    tweetEl: 'tweet',
    vkEl: 'vk'
  },
  domListeners: {
    facebookEl: {
      click: 'onFacebookClick'
    },
    mailEl: {
      click: 'onMailClick'
    },
    tweetEl: {
      click: 'onTweetClick'
    },
    vkEl: {
      click: 'onVkClick'
    }
  },
  initView: function () {
    var a = this;
    a.renderData = {
      gameTitle: encodeURIComponent(Codex.util.OpenGraph.getGameTitle(a.model)),
      opengraphUrl: encodeURIComponent(Codex.util.OpenGraph.getGameUrl(a.model)),
      region: Codex.util.Region.getRegion(),
      url: encodeURIComponent(document.URL)
    };
    a.callParent(arguments)
  },
  onFacebookClick: function (c) {
    var b = this,
    a = Codex.util.OpenGraph.getGameUrl(b.model);
    Codex.util.Share.facebook(a);
    c.preventDefault()
  },
  onMailClick: function () {
    Codex.util.Share.mail()
  },
  onTweetClick: function (d) {
    var b = this,
    a = document.URL,
    c = Codex.util.OpenGraph.getGameTitle(b.model);
    Codex.util.Share.twitter(a, c);
    d.preventDefault()
  },
  onVkClick: function (c) {
    var b = this,
    a = Codex.util.OpenGraph.getGameUrl(b.model);
    Codex.util.Share.vk(a);
    c.preventDefault()
  }
}); JSoop.define('Codex.details.view.common.header.Header', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.details.view.common.header.Controls',
    'Codex.details.view.common.header.Map',
    'Codex.details.view.common.header.Player'
  ],
  rtype: 'common-header',
  baseId: 'game-header',
  baseCls: 'game-header',
  tpl: '<div class="content-border"> <div class="white-stone"> <div id="{{ id }}-container"> </div> </div> </div>',
  layout: {
    type: 'Codex.common.layout.GridLayout'
  },
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.header.Controls',
        model: a.game,
        gridSize: '1-3'
      }
    ];
    if (a.user) {
      a.items.unshift({
        type: 'Codex.details.view.common.header.Player',
        model: a.game,
        user: a.user,
        gridSize: '2-3'
      })
    } else {
      a.items.unshift({
        type: 'Codex.details.view.common.header.Map',
        model: a.game,
        gridSize: '2-3'
      })
    }
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.grid.Grid', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.grid.HeaderRow',
    'Codex.details.view.common.grid.Row'
  ],
  rtype: 'common-grid',
  baseId: 'game-grid',
  baseCls: 'game-grid',
  tpl: '<div class="content-border"> <div> <table class="table table-bordered"> <tbody id="{{ id }}-body"></tbody> </table> </div> </div>',
  layout: {
    type: 'Ramen.view.layout.NoLayout'
  },
  childEls: {
    bodyEl: 'body'
  },
  targetEl: 'bodyEl',
  initView: function () {
    var a = this;
    a.itemDefaults = {
      type: 'Codex.details.view.common.grid.Row',
      collection: a.collection,
      tag: 'tr'
    };
    a.items = [
      {
        type: 'Codex.details.view.common.grid.HeaderRow'
      }
    ];
    a.addSection('grid_section_combat', {
      kda: {
        formatter: a.kdaFormatter
      },
      largest_killing_spree: {
        formatter: a.killingSpreeFormatter
      },
      largest_multi_kill: {
        field: 'largestMultiKill'
      },
      first_blood_kill: {
        field: 'firstBloodKill',
        formatter: 'booleanFormat'
      }
    });
    a.addSection('grid_section_damage_dealt', {
      total_damage_to_champions: {
        field: 'totalDamageDealtToChampions',
        formatter: 'numberToK'
      },
      physical_damage_to_champions: {
        field: 'physicalDamageDealtToChampions',
        formatter: 'numberToK'
      },
      magic_damage_to_champions: {
        field: 'magicDamageDealtToChampions',
        formatter: 'numberToK'
      },
      true_damage_to_champions: {
        field: 'trueDamageDealtToChampions',
        formatter: 'numberToK'
      },
      damage_dealt: {
        field: 'totalDamageDealt',
        formatter: 'numberToK'
      },
      physical_damage_dealt: {
        field: 'physicalDamageDealt',
        formatter: 'numberToK'
      },
      magic_damage_dealt: {
        field: 'magicDamageDealt',
        formatter: 'numberToK'
      },
      true_damage_dealt: {
        field: 'trueDamageDealt',
        formatter: 'numberToK'
      },
      largest_critical_strike: {
        field: 'largestCriticalStrike',
        formatter: 'numberFormat'
      }
    });
    a.addSection('grid_section_damage_taken', {
      damage_healed: {
        field: 'totalHeal',
        formatter: 'numberToK'
      },
      total_damage_taken: {
        field: 'totalDamageTaken',
        formatter: 'numberToK'
      },
      physical_damage_taken: {
        field: 'physicalDamageTaken',
        formatter: 'numberToK'
      },
      magic_damage_taken: {
        field: 'magicalDamageTaken',
        formatter: 'numberToK'
      },
      true_damage_taken: {
        field: 'trueDamageTaken',
        formatter: 'numberToK'
      }
    });
    a.addSection('grid_section_wards', {
      vision_items_placed: {
        field: 'wardsPlaced',
        formatter: 'numberFormat'
      },
      vision_items_destroyed: {
        field: 'wardsKilled',
        formatter: 'numberFormat'
      },
      sight_wards_purchased: {
        field: 'sightWardsBoughtInGame',
        formatter: 'numberFormat'
      },
      vision_wards_purchased: {
        field: 'visionWardsBoughtInGame',
        formatter: 'numberFormat'
      }
    });
    a.addSection('grid_section_income', {
      gold_earned: {
        field: 'goldEarned',
        formatter: 'numberToK'
      },
      gold_spent: {
        field: 'goldSpent',
        formatter: 'numberToK'
      },
      minions_killed: {
        field: 'minionsKilled',
        formatter: 'numberFormat'
      },
      neutral_minions_killed: {
        field: 'neutralMinionsKilled',
        formatter: 'numberFormat'
      },
      neutral_minions_killed_team_jungle: {
        field: 'neutralMinionsKilledTeamJungle',
        formatter: 'numberFormat'
      },
      neutral_minions_killed_enemy_jungle: {
        field: 'neutralMinionsKilledEnemyJungle',
        formatter: 'numberFormat'
      }
    });
    a.callParent(arguments)
  },
  addSection: function (c, a) {
    var b = this;
    b.items.push({
      type: 'Ramen.view.View',
      tpl: [
        '<td colspan="{{ columns }}">',
        '<div>{{ divider }}</div>',
        '</td>'
      ],
      renderData: {
        divider: Codex.util.I18n.trans(c),
        columns: b.collection.getCount() + 1
      }
    });
    JSoop.iterate(a, function (e, d) {
      e.label = d;
      b.items.push(e)
    })
  },
  kdaFormatter: function (a) {
    return a.get('kills') + '/' + a.get('deaths') + '/' + a.get('assists')
  },
  killingSpreeFormatter: function (a) {
    if (a.get('largestKillingSpree')) {
      return a.get('largestKillingSpree')
    }
    return a.get('kills')
  }
}); JSoop.define('Codex.details.view.common.build.skill.Slot', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-skill-build-slot',
  baseId: 'skill-slot',
  baseCls: 'skill-slot',
  tpl: '{% if not isEmpty %} {% if evolution %} <div class="level"> <div class="evolution-icon">{{ icon }}</div> <div class="evolution-level">{{ level }}</div> </div> {% else %} <div class="level">{{ level }}</div> {% endif %} {% endif %}',
  initView: function () {
    var a = this,
    c = true,
    b = a.getEvolution();
    if (a.model && a.model.get('slot') === a.slot) {
      c = false
    }
    a.renderData = {
      level: a.level,
      isEmpty: c,
      evolution: b
    };
    if (a.evolution) {
      a.bindings = {
        icon: {
          type: 'DragonRamen.binding.skill.Icon',
          model: 'getSkill'
        }
      }
    }
    a.callParent(arguments)
  },
  getEvolution: function () {
    var a = this;
    if (!a.evolution && a.model && a.model.get('slot') === 4 && a.slot === 4 && a.evolutions && a.evolutions.length) {
      a.evolution = a.evolutions.shift()
    }
    return a.evolution
  },
  getSkill: function () {
    var e = this,
    a = e.evolution.get('source'),
    c = a.getGame(),
    b = c.get('version'),
    d = DragonRamen.get('champion', b, a.get('champion'));
    return d.getSkills().at(e.evolution.get('slot') - 1)
  }
}); JSoop.define('Codex.details.view.common.build.skill.Progression', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.build.skill.Slot'
  ],
  rtype: 'common-skill-build-progression',
  baseId: 'skill-progression',
  baseCls: 'skill-progression',
  tpl: '<div class="skill-description"> <div id="{{ id }}-icon" class="skill-icon">{{ icon }}</div> <div id="{{ id }}-name" class="skill-name">{{ name }}</div> </div> <div id="{{ id }}-container" class="skills clearfix"></div>',
  childEls: {
    containerEl: 'container',
    iconEl: 'icon',
    nameEl: 'name'
  },
  targetEl: 'containerEl',
  bindings: {
    icon: {
      type: 'DragonRamen.binding.skill.Icon',
      model: 'getSkill'
    },
    name: {
      field: 'name',
      model: 'getSkill'
    }
  },
  initView: function () {
    var b = this,
    a = 1;
    b.items = [
    ];
    b.itemDefaults = {
      type: 'Codex.details.view.common.build.skill.Slot',
      slot: b.slot
    };
    for (; a <= 18; a = a + 1) {
      b.items.push({
        level: a,
        model: b.skills[a - 1],
        evolutions: b.evolutions
      })
    }
    b.addCls('slot-' + b.slot);
    b.callParent(arguments)
  },
  getModel: JSoop.emptyFn,
  render: function () {
    var a = this;
    Ramen.view.binding.BindingView.prototype.initBindings.call(a);
    a.callParent(arguments)
  },
  onDestroy: function () {
    var a = this;
    JSoop.iterate(a.bindings, function (b) {
      b.destroy()
    });
    a.callParent(arguments)
  },
  getSkill: function () {
    var d = this,
    a = d.skills[0].get('source'),
    c = a.getGame(),
    b = c.get('version');
    return DragonRamen.get('champion', b, a.get('champion')).getSkills().at(d.slot - 1)
  },
  onRenderDuring: function () {
    var b = this,
    a = b.getSkill();
    b.getSkill().getChampion().getSkills().each(function (c) {
      if (c.get('name').length > 20) {
        b.longSkill = true;
        return false
      }
    });
    b.callParent(arguments);
    b.iconEl.attr({
      'data-rg-champion': a.getChampion().get('dragonId'),
      'data-rg-skill': b.slot,
      'data-rg-version': a.getChampion().get('version')
    });
    if (b.longSkill) {
      b.items.each(function (c) {
        c.addCls('long-skill-slot')
      });
      b.nameEl.addClass('long-skill-name')
    }
  }
}, function () {
  jQuery('body').on('mousemove', 'div[data-rg-skill]', function (g) {
    var f = jQuery(this),
    c = f.attr('data-rg-champion'),
    h = parseInt(f.attr('data-rg-skill'), 10) - 1,
    b = f.attr('data-rg-version'),
    a = Riot.DDragon.controllers.cont1,
    d = jQuery('.rg-box-tooltip');
    d.removeClass('rg-display-champion_tooltip').html(Riot.DDragon.models['champion_' + b].data[c].spells[h].description);
    a.move(g);
    d.removeClass('ninja')
  }).on('mouseout', 'div[data-rg-skill]', function () {
    jQuery('.rg-box-tooltip').addClass('ninja')
  })
}); JSoop.define('Codex.details.view.common.build.skill.SkillBuild', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.build.skill.Progression'
  ],
  rtype: 'common-skill-build',
  baseId: 'skill-build',
  baseCls: 'skill-build',
  tpl: '<div class="content-border"> <div class="white-stone"> <h4>{{ trans("skills_header") }}</h4> <div id="{{ id }}-container" class="skills"></div> </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  initView: function () {
    var b = this,
    a = b.model.getGame();
    b.callParent(arguments);
    if (a.timeline) {
      b.addSkills()
    } else {
      b.mon(a, 'timeline:load', b.addSkills, b, {
        single: true
      })
    }
  },
  addSkills: function () {
    var c = this,
    a = c.getSkills(),
    b = c.getEvolutions();
    c.itemDefaults = {
      type: 'Codex.details.view.common.build.skill.Progression',
      skills: a
    };
    c.add([{
      slot: 1
    },
    {
      slot: 2
    },
    {
      slot: 3
    },
    {
      slot: 4,
      evolutions: b
    }
    ])
  },
  onRenderBefore: function (d, a, b) {
    var c = DragonRamen.get('champion', d.model.getGame().get('version'), d.model.get('champion'));
    if (!c.isLoadedFull) {
      d.mon(c, 'load:full', function () {
        d.render(a, b)
      }, d, {
        single: true
      });
      c.getFull();
      return false
    }
  },
  getSkills: function () {
    var b = this,
    a = [
    ];
    b.model.getGame().getEvents().each(function (c) {
      if (c.name === 'SkillUpEvent' && c.get('source').get('id') === b.model.get('id') && c.get('skillUpType') === 'NORMAL') {
        a.push(c)
      }
    });
    a.sort(function (d, c) {
      return d.get('timestamp') - c.get('timestamp')
    });
    return a
  },
  getEvolutions: function () {
    var b = this,
    a = [
    ];
    if (b.model.get('champion') !== 121) {
      return []
    }
    b.model.getGame().getEvents().each(function (c) {
      if (c.name === 'SkillUpEvent' && c.get('source').get('id') === b.model.get('id') && c.get('skillUpType') === 'EVOLVE') {
        a.push(c)
      }
    });
    a.sort(function (d, c) {
      return d.get('timestamp') - c.get('timestamp')
    });
    return a
  }
}); JSoop.define('Codex.details.view.common.build.rune.Rune', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-rune-build-rune',
  baseId: 'rune',
  baseCls: 'rune',
  cls: 'build-rune',
  tpl: '<span class="build-rune-count">{{ count }} X</span> <div class="build-rune-icon">{{ icon }}</div> <span class="build-rune-desc">{{ desc }}</span>',
  bindings: {
    icon: {
      type: 'DragonRamen.binding.rune.Icon',
      model: 'getRune'
    },
    desc: {
      field: 'description',
      model: 'getRune'
    },
    count: 'count'
  },
  getRune: function () {
    var a = this;
    return DragonRamen.get('rune', a.model.getParticipant().getGame().get('version'), a.model.get('runeId'))
  }
}); JSoop.define('Codex.details.view.common.build.rune.RuneBuild', {
  extend: 'Ramen.view.container.CollectionContainer',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.details.view.common.build.rune.Rune'
  ],
  rtype: 'common-rune-build',
  baseId: 'runes',
  baseCls: 'runes',
  tpl: '<div class="content-border"> <div class="white-stone"> <div class="build-runes-header"><h4>{{ trans("runes_header") }}</h4></div> <div id="{{ id }}-container"></div> </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  layout: {
    type: 'Codex.common.layout.GridLayout'
  },
  itemDefaults: {
    type: 'Codex.details.view.common.build.rune.Rune'
  },
  initView: function () {
    var a = this;
    a.collection = a.model.getRunes();
    a.callParent(arguments)
  },
  onRenderBefore: function (d, b, c) {
    var a = DragonRamen.getCollection('rune', d.model.getGame().get('version'));
    if (a.getCount() <= d.collection.getCount()) {
      d.mon(a, 'add', function () {
        d.render(b, c)
      }, d, {
        single: true
      });
      return false
    } else {
      d.collection.sort(d.runeTypeComparator)
    }
    return d.callParent(arguments)
  },
  runeTypeComparator: (function () {
    var a = {
      black: 1,
      red: 2,
      yellow: 3,
      blue: 4
    };
    return function (d, b) {
      var c = d.getParticipant().getGame().get('version'),
      f,
      e;
      d = DragonRamen.get('rune', c, d.get('runeId'));
      b = DragonRamen.get('rune', c, b.get('runeId'));
      f = a[d.get('type')];
      e = a[b.get('type')];
      return f - e
    }
  }())
}); JSoop.define('Codex.details.view.common.build.mastery.Mastery', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.util.DataDragon'
  ],
  rtype: 'common-mastery-build-mastery',
  baseCls: 'mastery-mastery',
  baseId: 'mastery-mastery',
  tpl: '<div class="mastery-{{ masteryState }}"> <span class="content-border"> <div id="mastery-img-{{ masteryId }}"></div> {{ grayImg }} <div id="{{ baseId }}-rank-container" class="{{ baseCls }}-rank-container">{{ rank }}/{{ maxRank }}</div> {% if prereq %} <div class="{{ baseCls }}-prereq {{ baseCls }}-prereq-{{ prereq }}"></div> {% endif %} </span> </div>',
  initView: function () {
    var d = this,
    b = d.mastery.masteryId,
    c = Riot.DDragon.models.mastery.get(b).ranks,
    f = d.rank,
    a = d.mastery.prereq === '0' ? false : 1,
    e;
    if (f === c) {
      e = 'maxxed'
    } else {
      if (f > 0) {
        e = 'rank'
      } else {
        e = 'empty'
      }
    }
    d.renderData = {
      masteryId: b,
      rank: f,
      maxRank: c,
      prereq: a,
      masteryState: e
    };
    d.callParent(arguments)
  },
  onRenderDuring: function () {
    var e = this,
    d = e.mastery.masteryId,
    b = e.model.getGame().get('version'),
    a = e.rank === 0,
    c = {
      model: 'mastery',
      version: b,
      id: d,
      options: {
        gray: a,
        classes: a ? 'img-gray' : '',
        attrs: 'data-rg-id="' + d + '" data-rg-name="mastery"'
      },
      callback: function (f) {
        e.el.find('#mastery-img-' + d).html(f)
      }
    };
    e.callParent(arguments);
    Codex.util.DataDragon.getImg(c)
  }
}); JSoop.define('Codex.details.view.common.build.mastery.Empty', {
  extend: 'Ramen.view.View',
  rtype: 'common-mastery-build-mastery',
  baseId: 'mastery-mastery',
  baseCls: 'mastery-mastery',
  tpl: '&nbsp;'
}); JSoop.define('Codex.details.view.common.build.mastery.Tier', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.details.view.common.build.mastery.Empty',
    'Codex.details.view.common.build.mastery.Mastery'
  ],
  rtype: 'common-mastery-build-tier',
  baseId: 'mastery-tier',
  baseCls: 'mastery-tier',
  tpl: '<div id="{{ id }}-container" class="clearfix"></div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  layout: {
    type: 'Codex.common.layout.GridLayout',
    gutter: 'no'
  },
  initView: function () {
    var b = this,
    a = b.tier,
    d = b.masteries,
    c;
    b.items = [
    ];
    JSoop.each(a, function (e) {
      if (e) {
        if (d[e.masteryId] !== undefined) {
          c = d[e.masteryId].get('rank')
        } else {
          c = 0
        }
        b.items.push({
          type: 'Codex.details.view.common.build.mastery.Mastery',
          gridSize: '1-4',
          mastery: e,
          rank: c,
          model: b.model
        })
      } else {
        b.items.push({
          type: 'Codex.details.view.common.build.mastery.Empty',
          gridSize: '1-4'
        })
      }
    });
    b.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.build.mastery.TierContainer', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.build.mastery.Tier'
  ],
  rtype: 'common-mastery-build-tier-container',
  baseId: 'mastery-tier-container',
  baseCls: 'mastery-tier-container',
  initView: function () {
    var a = this;
    a.items = [
    ];
    JSoop.each(a.tiers, function (b) {
      a.items.push({
        type: 'Codex.details.view.common.build.mastery.Tier',
        tier: b,
        masteries: a.masteries,
        model: a.model
      })
    });
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.build.mastery.Header', {
  extend: 'Ramen.view.View',
  rtype: 'common-mastery-build-header',
  baseCls: 'mastery-tree-header',
  baseId: 'mastery-tree-header',
  tpl: '<header class="header"><h3>{{ name }} (<span id="mastery-tree-rank">{{ rank }}</span>)</h3></header>',
  initView: function () {
    var a = this,
    b = 0;
    JSoop.each(a.tiers, function (c) {
      JSoop.each(c, function (d) {
        if (d && a.masteries[d.masteryId] !== undefined) {
          b = b + a.masteries[d.masteryId].get('rank')
        }
      })
    });
    a.renderData = {
      name: Codex.util.I18n.trans('mastery_tree_' + a.tree.toLowerCase()),
      rank: b
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.build.mastery.Tree', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.details.view.common.build.mastery.Header',
    'Codex.details.view.common.build.mastery.TierContainer'
  ],
  rtype: 'common-mastery-build-tree',
  baseId: 'tree',
  baseCls: 'tree',
  tpl: '<div id="{{ id }}-container" class="content-border"></div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.build.mastery.Header',
        tree: a.tree,
        tiers: a.tiers,
        masteries: a.masteries,
        model: a.model
      },
      {
        type: 'Codex.details.view.common.build.mastery.TierContainer',
        tiers: a.tiers,
        masteries: a.masteries,
        model: a.model
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.build.mastery.MasteryBuild', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.details.view.common.build.mastery.Tree'
  ],
  rtype: 'common-mastery-build',
  baseId: 'masteries',
  baseCls: 'masteries',
  tpl: '<div class="content-border"> <div class="white-stone"> <div class="default-1-1 mastery-header"> <h4>{{ trans(\'mastery_header\') }}</h4> </div> <div id="{{ id }}-container"> </div> </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  layout: {
    type: 'Codex.common.layout.GridLayout'
  },
  initView: function () {
    var c = this,
    a = Riot.DDragon.models.mastery.tree,
    d = c.masteryArrayToHash(c.model.getMasteries().items);
    c.items = [
    ];
    for (var b in a) {
      if (a.hasOwnProperty(b)) {
        c.items.push({
          type: 'Codex.details.view.common.build.mastery.Tree',
          gridSize: '1-3',
          tree: b,
          tiers: a[b],
          masteries: d,
          model: c.model
        })
      }
    }
    c.callParent(arguments)
  },
  masteryArrayToHash: function (b) {
    var a = {
    };
    JSoop.each(b, function (c) {
      a[c.get('id')] = c
    });
    return a
  }
}); JSoop.define('Codex.details.view.common.build.item.Item', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-item-build-item',
  baseId: 'build-item',
  baseCls: 'build-item',
  tpl: '{{ item }} {% if count > 1 %} <div class="count">{{ count }}</div> {% endif %}',
  bindings: {
    item: {
      type: 'DragonRamen.binding.item.Icon',
      model: 'getItem'
    }
  },
  initView: function () {
    var a = this;
    a.renderData = {
      count: a.count,
      type: a.transactionType
    };
    if (a.transactionType === 'sell') {
      a.addCls(a.baseCls + '-item-sell')
    }
    a.callParent(arguments)
  },
  getItem: function () {
    var a = this;
    return DragonRamen.get('item', a.version, a.item)
  }
}); JSoop.define('Codex.details.view.common.build.item.Step', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.util.Formatters',
    'Codex.details.view.common.build.item.Item'
  ],
  rtype: 'common-item-build-step',
  baseId: 'build-step',
  baseCls: 'build-step',
  tpl: '<div class="connector"></div> <div class="{{ baseCls }}-container clearfix"> <div id="{{ id }}-container" class="{{ baseCls }}-items clearfix content-border"></div> <div class="{{ baseCls }}-time clearfix"> {{ timestamp }} </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  initView: function () {
    var a = this;
    a.itemDefaults = {
      type: 'Codex.details.view.common.build.item.Item',
      version: a.model.get('version')
    };
    a.renderData = {
      timestamp: Codex.util.Formatters.timeFormatMs(a.items[0].timestamp)
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.util.BuildParser', {
  singleton: true,
  startingThreshold: 120000,
  stepThreshold: 30000,
  getItemEvents: function (a) {
    var b = a.getGame().getEvents().find(function (c) {
      if (c.get('type') === 'ITEM_PURCHASED' || c.get('type') === 'ITEM_SOLD' || c.get('type') === 'ITEM_UNDO') {
        if (c.get('source').get('id') === a.get('id')) {
          return true
        }
      }
      return false
    });
    b.sort(function (d, c) {
      return d.get('timestamp') - c.get('timestamp')
    });
    return b
  },
  getStartingStep: function (a) {
    var c = this,
    b = [
    ];
    while (a.length) {
      if (a[0].get('timestamp') < c.startingThreshold) {
        b.push(a.shift())
      } else {
        return c.processStep(b)
      }
    }
    return c.processStep(b)
  },
  getStep: function (a) {
    var c = this,
    b = [
    ],
    d;
    if (a.length) {
      b.push(a.shift());
      d = b[0].get('timestamp')
    } else {
      return false
    }
    while (a.length) {
      if (a[0].get('timestamp') < (d + c.stepThreshold)) {
        b.push(a.shift());
        d = b[b.length - 1].get('timestamp')
      } else {
        return c.processStep(b)
      }
    }
    return c.processStep(b)
  },
  processStep: function (e) {
    var d = this,
    b = {
      buy: {
      },
      sell: {
      }
    },
    f;
    function c(h, g, i) {
      if (!i.hasOwnProperty(h)) {
        i[h] = g
      } else {
        i[h] = i[h] + g
      }
    }
    function a(g, h) {
      if (g === 'buy') {
        c(h, - 1, b.buy)
      } else {
        c(h, - 1, b.sell)
      }
    }
    JSoop.each(e, function (j) {
      var h = j.get('type'),
      i = j.get('item'),
      g = j.get('undoType');
      if (!f) {
        f = j.get('timestamp')
      }
      if (h === 'ITEM_PURCHASED') {
        c(i, 1, b.buy)
      } else {
        if (h === 'ITEM_UNDO') {
          a(g, i)
        } else {
          if (h === 'ITEM_SOLD') {
            c(i, 1, b.sell)
          }
        }
      }
    });
    e = [
    ];
    JSoop.iterate(b.sell, function (h, g) {
      d.addItem({
        step: e,
        count: h,
        item: g,
        timestamp: f,
        transactionType: 'sell'
      })
    });
    JSoop.iterate(b.buy, function (h, g) {
      d.addItem({
        step: e,
        count: h,
        item: g,
        timestamp: f,
        transactionType: 'buy'
      })
    });
    return e
  },
  addItem: function (a) {
    var f = a.step,
    e = a.count,
    d = a.item,
    g = a.timestamp,
    c = a.transactionType,
    b;
    if (!Riot.DDragon.models.item.get(d).consumed) {
      for (b = e; b > 0; b = b - 1) {
        f.push({
          item: d,
          count: 1,
          transactionType: c,
          timestamp: g
        })
      }
    } else {
      f.push({
        item: d,
        count: e,
        transactionType: c,
        timestamp: g
      })
    }
  },
  getBuildSteps: function (a) {
    var e = this,
    c = e.getItemEvents(a),
    b = [
    ],
    d = e.getStartingStep(c);
    if (d.length) {
      b.push(d)
    } else {
      return b
    }
    while (true) {
      d = e.getStep(c);
      if (d) {
        if (d.length) {
          b.push(d)
        }
      } else {
        return b
      }
    }
  }
}); JSoop.define('Codex.details.view.common.build.item.ItemBuild', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.util.BuildParser',
    'Codex.details.view.common.build.item.Step'
  ],
  rtype: 'common-item-build',
  baseId: 'item-build',
  baseCls: 'item-build',
  cls: 'clearfix',
  tpl: '<div class="content-border"> <div class="white-stone build-items"> <h4>{{ trans(\'items_header\') }}</h4> <div id="{{ id }}-container" class="build-container clearfix"> </div> </div> </div>',
  childEls: {
    containerEl: 'container'
  },
  targetEl: 'containerEl',
  layout: {
    type: 'Ramen.view.layout.NoLayout'
  },
  initView: function () {
    var b = this,
    a = b.model.getGame();
    b.itemDefaults = {
      type: 'Codex.details.view.common.build.item.Step',
      model: b.model
    };
    b.callParent(arguments);
    if (a.timeline) {
      b.addSteps()
    } else {
      b.mon(a, 'timeline:load', b.addSteps, b, {
        single: true
      })
    }
  },
  addSteps: function () {
    var c = this,
    b = Codex.util.BuildParser.getBuildSteps(c.model),
    a = [
    ];
    JSoop.each(b, function (e, d) {
      a.push({
        items: e,
        index: d
      })
    });
    c.add(a)
  }
}); JSoop.define('Codex.details.view.common.build.ParticipantSelector', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.common.view.ChampionNameplate',
    'Codex.util.QueryString'
  ],
  rtype: 'common-participant-selector',
  baseCls: 'participant-selector',
  baseId: 'participant-selector',
  tpl: '<div class="content-border participant-sel"> <header class="header-primary"> <h1>{{ trans("builds_section_header") }}</h1> </header> <span class="champions"> <span id="{{ id }}-team-100" class="team-100"></span> <span id="{{ id }}-team-200" class="team-200"></span> </span> </div>',
  childEls: {
    team1El: 'team-100',
    team2El: 'team-200',
    containerEl: 'container'
  },
  selectParticipant: function (d) {
    var c = this,
    a = jQuery(d.target).parents('.champion-nameplate'),
    b = a.attr('player-id');
    if (!a.hasClass('selected')) {
      c.el.find('.champion-nameplate.selected').removeClass('selected').addClass('unselected');
      a.addClass('selected').removeClass('unselected');
      c.fireEvent('select', b)
    }
  },
  onRenderDuring: function () {
    var c = this,
    b = c.model.getParticipants(),
    d = Codex.util.QueryString.getObjectFromQuery(location.hash),
    e,
    a;
    c.callParent(arguments);
    if (d.participant) {
      e = d.participant
    } else {
      a = Codex.getContextUser().findParticipant(c.model.getParticipants());
      if (!a) {
        a = c.model.getParticipants().at(0)
      }
      e = a.get('participantId')
    }
    c.participants = [
    ];
    b.each(function (i) {
      var h = i.get('team'),
      g = i.get('participantId'),
      f = JSoop.create('Codex.common.view.ChampionNameplate', {
        tag: {
          tag: 'div',
          'player-id': g,
          'data-team': h
        },
        cls: (g === parseInt(e, 10)) ? 'selected' : 'unselected',
        model: i,
        hideName: true,
        hideLevel: true,
        renderTo: (h === 100) ? c.team1El : c.team2El,
        autoRender: true
      });
      c.participants.push(f)
    });
    c.el.on('click', '.champions img', JSoop.bind(c.selectParticipant, c))
  },
  onDestroy: function () {
    var a = this;
    if (a.participants) {
      JSoop.each(a.participants, function (b) {
        b.destroy()
      })
    }
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.build.Build', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.plugin.TimelineView',
    'Codex.details.view.common.build.ParticipantSelector',
    'Codex.details.view.common.build.item.ItemBuild',
    'Codex.details.view.common.build.mastery.MasteryBuild',
    'Codex.details.view.common.build.rune.RuneBuild',
    'Codex.details.view.common.build.skill.SkillBuild'
  ],
  plugins: {
    timeline: 'Codex.common.plugin.TimelineView'
  },
  rtype: 'common-build',
  baseId: 'build',
  baseCls: 'build',
  initView: function () {
    var b = this,
    c = Codex.util.QueryString.getObjectFromQuery(location.hash),
    a = c.participant;
    b.game = b.model;
    if (a !== undefined) {
      a = parseInt(a, 10);
      b.model = b.game.getParticipants().findFirst({
        participantId: a
      })
    } else {
      b.model = b.game.getUser(Codex.getContextUser())
    }
    if (!b.model) {
      b.model = b.game.getParticipants().at(0)
    }
    b.itemDefaults = {
      model: b.model
    };
    b.items = [
      {
        type: 'Codex.details.view.common.build.ParticipantSelector',
        model: b.model.getGame(),
        listeners: {
          select: b.onParticipantSelect,
          scope: b
        }
      },
      {
        type: 'Codex.details.view.common.build.item.ItemBuild'
      },
      {
        type: 'Codex.details.view.common.build.skill.SkillBuild'
      },
      {
        type: 'Codex.details.view.common.build.rune.RuneBuild'
      },
      {
        type: 'Codex.details.view.common.build.mastery.MasteryBuild'
      }
    ];
    b.callParent(arguments)
  },
  onParticipantSelect: function (b) {
    var a = this;
    a.items.each(function (c) {
      if (c.rtype !== 'common-participant-selector') {
        a.remove(c)
      }
    });
    b = parseInt(b, 10);
    a.itemDefaults = {
      model: a.model.getGame().getParticipants().findFirst({
        participantId: b
      })
    };
    a.add([{
      type: 'Codex.details.view.common.build.item.ItemBuild'
    },
    {
      type: 'Codex.details.view.common.build.skill.SkillBuild'
    },
    {
      type: 'Codex.details.view.common.build.rune.RuneBuild'
    },
    {
      type: 'Codex.details.view.common.build.mastery.MasteryBuild'
    }
    ])
  }
}); JSoop.define('Codex.details.view.common.Details', {
  extend: 'Ramen.view.container.Container',
  requires: [
    'Codex.common.layout.GridLayout',
    'Codex.details.view.common.build.Build',
    'Codex.details.view.common.grid.Grid',
    'Codex.details.view.common.header.Header',
    'Codex.details.view.common.map.Map',
    'Codex.details.view.common.tab.TabPanel'
  ],
  vtype: 'common-details',
  baseId: 'details',
  baseCls: 'details',
  breakdownView: '',
  graphView: '',
  scoreboardView: '',
  gridView: 'Codex.details.view.common.grid.Grid',
  initView: function () {
    var b = this,
    a = Codex.getContextUser();
    b.items = [
      {
        type: 'Codex.details.view.common.header.Header',
        game: b.model,
        user: b.model.getUser(a)
      },
      {
        type: b.scoreboardView,
        model: b.model
      },
      {
        type: 'Codex.details.view.common.tab.TabPanel',
        itemDefaults: {
          type: 'Ramen.view.View'
        },
        items: [
          {
            title: 'tab_overview',
            type: 'Ramen.view.container.Container',
            id: 'overview',
            items: [
              {
                type: b.graphView,
                model: b.model
              },
              {
                type: 'Ramen.view.container.Container',
                cls: 'match-breakdown-area',
                layout: {
                  type: 'Codex.common.layout.GridLayout'
                },
                items: [
                  {
                    type: b.breakdownView,
                    model: b.model,
                    gridSize: '2-3'
                  },
                  {
                    type: 'Codex.details.view.common.map.Map',
                    model: b.model,
                    gridSize: '1-3'
                  }
                ]
              }
            ]
          },
          {
            title: 'tab_builds',
            type: 'Codex.details.view.common.build.Build',
            id: 'builds',
            model: b.model
          },
          {
            title: 'tab_stats',
            type: b.gridView,
            id: 'stats',
            collection: b.model.getParticipants()
          }
        ]
      }
    ];
    if (!b.model.hasBuilds()) {
      b.items[2].items.splice(1, 1)
    }
    b.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.urf.Details', {
  extend: 'Codex.details.view.common.Details',
  requires: [
    'Codex.details.view.classic.graph.Switcher',
    'Codex.details.view.classic.scoreboard.Scoreboard',
    'Codex.details.view.urf.breakdown.Breakdown',
    'Codex.details.view.urf.grid.Grid'
  ],
  vtype: 'urf-details',
  cls: 'urf',
  breakdownView: 'Codex.details.view.urf.breakdown.Breakdown',
  graphView: 'Codex.details.view.classic.graph.Switcher',
  scoreboardView: 'Codex.details.view.classic.scoreboard.Scoreboard',
  gridView: 'Codex.details.view.urf.grid.Grid'
}); JSoop.define('Codex.details.view.common.graph.TeamScore', {
  extend: 'Codex.details.view.common.graph.TimelineGraph',
  requires: [
    'Codex.util.Formatters',
    'Codex.util.I18n'
  ],
  title: Codex.util.I18n.trans('team_score_title'),
  initGraph: function () {
    var c = this,
    d = c.getData(),
    b = c.getMin(d),
    a = c.getMax(d);
    c.axis = {
      x: {
        format: c.formatDuration,
        count: (d[0].length < 60) ? d[0].length / 2 : d[0].length / 3,
        label: Codex.util.I18n.trans('axis_label_time')
      },
      y: {
        format: function (e) {
          return Math.abs(e)
        },
        count: 11,
        label: Codex.util.I18n.trans('axis_label_total_score')
      }
    };
    c.lines = [
      {
        data: d[0],
        config: {
          cls: 'team-1-score',
          clip: 'graph-clip',
          points: {
            cls: 'point team-1',
            tooltip: {
              fn: c.formatTooltip,
              scope: c
            }
          }
        },
        range: {
          y: {
            domain: {
              min: a,
              max: b
            }
          }
        }
      },
      {
        data: d[1],
        config: {
          cls: 'team-2-score',
          clip: 'graph-clip',
          points: {
            cls: 'point team-2',
            tooltip: {
              fn: c.formatTooltip,
              scope: c
            }
          }
        },
        range: {
          y: {
            domain: {
              min: a,
              max: b
            }
          }
        }
      }
    ];
    c.callParent(arguments)
  },
  getMin: function (a) {
    return d3.min([d3.min(a[0]),
    d3.min(a[1])])
  },
  getMax: function (a) {
    return d3.max([d3.max(a[0]),
    d3.max(a[1])])
  },
  formatTooltip: function (b, e) {
    var a = this,
    d = b,
    c = a.formatDuration(e);
    return Codex.util.I18n.trans('score_at_time', {
      score: d,
      time: c
    })
  },
  getData: function () {
    var b = this,
    a = b.model,
    c = a.getTeams(),
    d = {
    };
    c.each(function (f) {
      var e = f.getParticipants();
      d[f.get('id')] = [
      ];
      f = d[f.get('id')];
      e.each(function (g) {
        var h = g.getTimeline();
        h.each(function (j, i) {
          if (f[i] === undefined) {
            f[i] = j.get('teamScore')
          } else {
            return
          }
        })
      })
    });
    return [d[100],
    d[200]]
  }
}); JSoop.define('Codex.details.view.poroking.graph.Switcher', {
  extend: 'Codex.details.view.common.graph.Switcher',
  requires: [
    'Codex.details.view.common.graph.GoldAdvantage',
    'Codex.details.view.common.graph.TeamGold',
    'Codex.details.view.common.graph.ChampionGold',
    'Codex.details.view.common.graph.TeamScore'
  ],
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.graph.GoldAdvantage'
      },
      {
        type: 'Codex.details.view.common.graph.TeamGold'
      },
      {
        type: 'Codex.details.view.common.graph.ChampionGold'
      },
      {
        type: 'Codex.details.view.common.graph.TeamScore'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.abyss.scoreboard.team.Header', {
  extend: 'Codex.details.view.classic.scoreboard.team.Header',
  rtype: 'abyss-team-header',
  cls: 'abyss'
}); JSoop.define('Codex.details.view.abyss.scoreboard.team.Footer', {
  extend: 'Codex.details.view.common.scoreboard.team.Footer',
  rtype: 'abyss-team-footer',
  baseId: 'team-footer',
  baseCls: 'team-footer',
  cls: 'abyss',
  tpl: '<div class="gs-container gs-half-gutter"> <div class="team-marker"></div> <div class="bans-container"> <div id="{{ id }}-bans" class="bans"> <div class="label">{{  trans ("bans") }}:</div> </div> </div> <div class="tower-kills"> <img src="{{ asset("/images/normal/event_icons/turret_" ~ teamId ~ ".png") }}"/> {{ trans(\'towers\') }}: <span>{{ towerKills }}</span> </div> </div>',
  initView: function () {
    var a = this;
    a.renderData = {
      towerKills: a.model.get('towerKills')
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.abyss.scoreboard.player.Player', {
  extend: 'Codex.details.view.classic.scoreboard.player.Player',
  rtype: 'abyss-player',
  cls: 'abyss'
}); JSoop.define('Codex.details.view.abyss.scoreboard.team.Team', {
  extend: 'Codex.details.view.common.scoreboard.team.Team',
  requires: [
    'Codex.details.view.abyss.scoreboard.player.Player',
    'Codex.details.view.abyss.scoreboard.team.Footer',
    'Codex.details.view.abyss.scoreboard.team.Header'
  ],
  rtype: 'abyss-team',
  baseId: 'team',
  baseCls: 'team',
  cls: 'abyss',
  headerType: 'Codex.details.view.abyss.scoreboard.team.Header',
  footerType: 'Codex.details.view.abyss.scoreboard.team.Footer',
  playerType: 'Codex.details.view.abyss.scoreboard.player.Player'
}); JSoop.define('Codex.details.view.abyss.scoreboard.Scoreboard', {
  extend: 'Codex.details.view.common.scoreboard.Scoreboard',
  requires: [
    'Codex.details.view.abyss.scoreboard.team.Team'
  ],
  rtype: 'abyss-scoreboard',
  baseId: 'scoreboard',
  baseCls: 'scoreboard',
  cls: 'abyss',
  teamType: 'Codex.details.view.abyss.scoreboard.team.Team'
}); JSoop.define('Codex.details.view.abyss.breakdown.Breakdown', {
  extend: 'Codex.details.view.common.breakdown.Breakdown',
  rtype: 'abyss-breakdown',
  graphs: [
    {
      name: 'champion_kills',
      formatter: 'numberFormat',
      field: 'kills'
    },
    {
      name: 'gold_earned',
      formatter: 'numberToK',
      field: 'goldEarned'
    },
    {
      name: 'total_damage_to_champions',
      formatter: 'numberToK',
      field: 'totalDamageDealtToChampions'
    },
    {
      name: 'damage_dealt',
      formatter: 'numberToK',
      field: 'totalDamageDealt'
    }
  ],
  stats: [
    {
      name: 'largest_multi_kill',
      field: 'largestMultiKill',
      formatter: 'numberFormat'
    },
    {
      name: 'largest_killing_spree',
      field: 'largestKillingSpree',
      formatter: 'numberFormat'
    }
  ]
}); JSoop.define('Codex.details.view.poroking.Details', {
  extend: 'Codex.details.view.common.Details',
  requires: [
    'Codex.details.view.abyss.breakdown.Breakdown',
    'Codex.details.view.abyss.scoreboard.Scoreboard',
    'Codex.details.view.poroking.graph.Switcher'
  ],
  vtype: 'poroking-details',
  cls: 'poroking',
  breakdownView: 'Codex.details.view.abyss.breakdown.Breakdown',
  graphView: 'Codex.details.view.poroking.graph.Switcher',
  scoreboardView: 'Codex.details.view.abyss.scoreboard.Scoreboard'
}); JSoop.define('Codex.details.view.treeline.scoreboard.team.Header', {
  extend: 'Codex.details.view.common.scoreboard.team.Header',
  rtype: 'treeline-team-header',
  baseId: 'team-header',
  baseCls: 'team-header',
  cls: 'treeline',
  tpl: '<div class="gs-container team-summary"> <div class="team"> <!-- {% if teamId == 100 %} {{  trans ("scoreboard_blue_team") }} {% else %} {{  trans ("scoreboard_purple_team") }} {% endif %} --> </div> <div class="game-conclusion"> {% if win %} {{  trans ("victory") }} {% else %} {{  trans ("defeat") }} {% endif %} </div> <div class="gold">{{ gold }}</div> <div class="kills">{{ kills }}</div> <div class="team-marker"></div> </div> <div class="vs"></div> <div class="gs-container gs-no-gutter icon-bar"> <div class="champion champion-col"></div> <div class="kills kills-col"></div> <div class="items items-col"></div> <div class="minions minions-col"></div> <div class="gold gold-col"></div> <div class="team-marker"></div> </div>',
}); JSoop.define('Codex.details.view.treeline.scoreboard.team.Footer', {
  extend: 'Codex.details.view.common.scoreboard.team.Footer',
  rtype: 'treeline-team-footer',
  baseId: 'team-footer',
  baseCls: 'team-footer',
  cls: 'treeline',
  tpl: '<div class="gs-container gs-half-gutter"> <div class="team-marker"></div> <div class="bans-container"> <div id="{{ id }}-bans" class="bans"> <div class="label">{{  trans ("bans") }}:</div> </div> </div> <div class="tower-kills"> <img src="{{ asset("/images/normal/event_icons/turret_" ~ teamId ~ ".png") }}"/> {{ trans(\'towers\') }}: <span>{{ towerKills }}</span> </div> <div class="vilemaw-kills"> <img src="{{ asset("/images/normal/event_icons/vilemaw_" ~ teamId ~ ".png") }}"/> {{ trans(\'vilemaws\') }}: <span>{{ vilemawKills }}</span> </div> </div>',
  initView: function () {
    var a = this;
    a.renderData = {
      vilemawKills: a.model.get('vilemawKills'),
      towerKills: a.model.get('towerKills')
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.treeline.scoreboard.player.Player', {
  extend: 'Codex.details.view.common.scoreboard.player.Player',
  requires: [
    'Codex.details.view.common.scoreboard.player.CS',
    'Codex.details.view.common.scoreboard.player.Gold',
    'Codex.details.view.common.scoreboard.player.Inventory',
    'Codex.details.view.common.scoreboard.player.KDA',
    'Codex.details.view.common.scoreboard.player.Name'
  ],
  rtype: 'treeline-player',
  baseId: 'player',
  baseCls: 'player',
  cls: 'treeline',
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.scoreboard.player.Name'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.KDA'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.Inventory'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.CS'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.Gold'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.treeline.scoreboard.team.Team', {
  extend: 'Codex.details.view.common.scoreboard.team.Team',
  requires: [
    'Codex.details.view.treeline.scoreboard.player.Player',
    'Codex.details.view.treeline.scoreboard.team.Footer',
    'Codex.details.view.treeline.scoreboard.team.Header'
  ],
  rtype: 'treeline-team',
  baseId: 'team',
  baseCls: 'team',
  cls: 'treeline',
  headerType: 'Codex.details.view.treeline.scoreboard.team.Header',
  footerType: 'Codex.details.view.treeline.scoreboard.team.Footer',
  playerType: 'Codex.details.view.treeline.scoreboard.player.Player'
}); JSoop.define('Codex.details.view.treeline.scoreboard.Scoreboard', {
  extend: 'Codex.details.view.common.scoreboard.Scoreboard',
  requires: [
    'Codex.details.view.treeline.scoreboard.team.Team'
  ],
  rtype: 'treeline-scoreboard',
  baseId: 'scoreboard',
  baseCls: 'scoreboard',
  cls: 'treeline',
  teamType: 'Codex.details.view.treeline.scoreboard.team.Team'
}); JSoop.define('Codex.details.view.treeline.breakdown.Breakdown', {
  extend: 'Codex.details.view.common.breakdown.Breakdown',
  rtype: 'classic-breakdown',
  graphs: [
    {
      name: 'champion_kills',
      formatter: 'numberFormat',
      field: 'kills'
    },
    {
      name: 'gold_earned',
      formatter: 'numberToK',
      field: 'goldEarned'
    },
    {
      name: 'total_damage_to_champions',
      formatter: 'numberToK',
      field: 'totalDamageDealtToChampions'
    },
    {
      name: 'damage_dealt',
      formatter: 'numberToK',
      field: 'totalDamageDealt'
    }
  ],
  stats: [
    {
      name: 'largest_multi_kill',
      field: 'largestMultiKill',
      formatter: 'numberFormat'
    },
    {
      name: 'largest_killing_spree',
      field: 'largestKillingSpree',
      formatter: 'numberFormat'
    }
  ]
}); JSoop.define('Codex.details.view.treeline.Details', {
  extend: 'Codex.details.view.common.Details',
  requires: [
    'Codex.details.view.classic.graph.Switcher',
    'Codex.details.view.treeline.breakdown.Breakdown',
    'Codex.details.view.treeline.scoreboard.Scoreboard'
  ],
  vtype: 'treeline-details',
  cls: 'treeline',
  breakdownView: 'Codex.details.view.treeline.breakdown.Breakdown',
  graphView: 'Codex.details.view.classic.graph.Switcher',
  scoreboardView: 'Codex.details.view.treeline.scoreboard.Scoreboard'
}); JSoop.define('Codex.details.view.common.graph.ScoreAdvantage', {
  extend: 'Codex.details.view.common.graph.TimelineGraph',
  requires: [
    'Codex.util.Formatters',
    'Codex.util.I18n'
  ],
  title: Codex.util.I18n.trans('score_advantage_title'),
  initGraph: function () {
    var c = this,
    d = c.getData(),
    b = c.getMin(d),
    a = c.getMax(d);
    if (Math.abs(b) > Math.abs(a)) {
      a = Math.abs(b)
    }
    a = (Math.ceil(a / 5)) + a;
    b = - a;
    c.axis = {
      x: {
        format: c.formatDuration,
        count: (d.length < 60) ? d.length / 2 : d.length / 3,
        label: Codex.util.I18n.trans('axis_label_time')
      },
      y: {
        format: function (e) {
          return Math.abs(e)
        },
        domain: {
          max: a,
          min: b
        },
        label: {
          text: Codex.util.I18n.trans('axis_label_side_score'),
          x: - 10
        }
      }
    };
    c.lines = {
      data: d,
      config: {
        cls: 'score-advantage',
        clip: 'graph-clip',
        points: {
          cls: c.getPointCls,
          tooltip: {
            fn: c.getTooltip,
            scope: c
          }
        }
      },
      range: {
        y: {
          domain: {
            min: a,
            max: b
          }
        }
      }
    };
    c.callParent(arguments)
  },
  beforeLineRender: function () {
    var a = this;
    a.renderAreas(a.graph);
    a.callParent(arguments)
  },
  getPointCls: function (b) {
    var a = 'point ';
    if (b < 0) {
      a = a + 'team-2'
    } else {
      if (b > 0) {
        a = a + 'team-1'
      }
    }
    return a
  },
  getTooltip: function (d, g) {
    var b = this,
    f = Math.abs(d),
    e = b.formatDuration(g),
    c,
    a;
    if (d < 0) {
      a = Codex.util.I18n.trans('team_purple')
    } else {
      a = Codex.util.I18n.trans('team_blue')
    }
    c = Codex.util.I18n.trans('score_advantage_tip', {
      ahead: a,
      score: f,
      time: e
    });
    if (d === 0) {
      c = Codex.util.I18n.trans('even_tip', {
        time: e
      })
    }
    return c
  },
  getData: function () {
    var b = this,
    a = b.model,
    c = a.getTeams(),
    e = {
    },
    d = [
    ];
    c.each(function (g) {
      var f = g.getParticipants();
      e[g.get('id')] = [
      ];
      g = e[g.get('id')];
      f.each(function (h) {
        h.getTimeline().each(function (j, i) {
          if (g[i] === undefined) {
            g[i] = j.get('teamScore')
          } else {
            return
          }
        })
      })
    });
    JSoop.each(e['100'], function (g, f) {
      d[f] = g - e['200'][f]
    });
    return d
  },
  renderAreas: function (c) {
    var f = this,
    b = f.lines[0],
    a = b.xRange,
    h = b.yRange,
    g = b.data,
    e = d3.svg.area().interpolate('monotone').x(function (k, j) {
      return a(j)
    }).y0(h(0)).y1(function (i) {
      return h(i)
    }),
    d;
    f.createClipPath({
      height: h(0),
      width: c.width,
      id: 'team-1-clip'
    }, c);
    f.createClipPath({
      height: c.height - h(0),
      width: c.width,
      x: 0,
      y: h(0),
      id: 'team-2-clip'
    }, c);
    d = f.createLayer({
      cls: 'area team-1',
      clip: 'team-1-clip'
    }, c);
    d.append('path').datum(g).attr('d', e);
    d = f.createLayer({
      cls: 'area team-2',
      clip: 'team-2-clip'
    }, c);
    d.append('path').datum(g).attr('d', e)
  }
}); JSoop.define('Codex.details.view.common.graph.ChampionScore', {
  extend: 'Codex.details.view.common.graph.TimelineGraph',
  requires: [
    'Codex.util.I18n',
    'Codex.details.view.common.graph.ChampionSelector'
  ],
  baseCls: 'champion-score',
  title: Codex.util.I18n.trans('champion_score_title'),
  initGraph: function () {
    var g = this,
    h = g.getData(),
    e = g.getMin(h),
    a = g.getMax(h),
    d = g.model.getParticipants(),
    f = 0,
    b = 0,
    c;
    g.axis = {
      x: {
        format: g.formatDuration,
        count: (h[0].length < 60) ? h[0].length / 2 : h[0].length / 3,
        label: Codex.util.I18n.trans('axis_label_time')
      },
      y: {
        count: 11,
        domain: {
          max: e,
          min: a
        },
        label: Codex.util.I18n.trans('axis_label_total_score')
      }
    };
    g.lines = [
    ];
    JSoop.each(h, function (i, j) {
      c = d.at(j).get('team');
      g.lines.push({
        data: i,
        config: {
          cls: 'champion-score-' + j,
          clip: 'graph-clip',
          points: {
            cls: 'point champion-score-' + j + ' team-' + c + ' player-' + ((c === 100) ? f : b),
            tooltip: function (k, n) {
              var m = k,
              l = g.formatDuration(n);
              return Codex.util.I18n.trans('score_at_time', {
                score: m,
                time: l
              })
            }
          }
        },
        range: {
          y: {
            domain: {
              min: a,
              max: e
            }
          }
        }
      });
      if (c === 100) {
        f = f + 1
      } else {
        b = b + 1
      }
    });
    g.callParent(arguments)
  },
  getMin: function () {
    return 0
  },
  getMax: function (b) {
    var a = 0;
    JSoop.each(b, function (e) {
      var c = d3.max(e);
      if (c > a) {
        a = c
      }
    });
    return a
  },
  onRenderGraphAfter: function () {
    var a = this;
    a.championSelector = JSoop.create('Codex.details.view.common.graph.ChampionSelector', {
      model: a.model,
      cls: 'portrait-container',
      renderTo: a.el,
      autoRender: true,
      listeners: {
        select: function (c, b) {
          a.el.find('svg .champion-score-' + b).css('display', 'block')
        },
        deselect: function (c, b) {
          a.el.find('svg .champion-score-' + b).css('display', 'none')
        }
      }
    });
    a.callParent(arguments)
  },
  onDestroy: function () {
    var a = this;
    if (a.championSelector) {
      a.championSelector.destroy()
    }
    a.callParent(arguments)
  },
  getData: function () {
    var a = this,
    b = [
    ],
    c;
    a.model.getTeams().each(function (d) {
      d.getParticipants().each(function (e) {
        c = [
        ];
        e.getTimeline().each(function (f) {
          c.push(f.get('dominionScore'))
        });
        b.push(c)
      })
    });
    return b
  }
}); JSoop.define('Codex.details.view.dominion.graph.Switcher', {
  extend: 'Codex.details.view.common.graph.Switcher',
  requires: [
    'Codex.details.view.common.graph.ChampionScore',
    'Codex.details.view.common.graph.ScoreAdvantage',
    'Codex.details.view.common.graph.TeamScore'
  ],
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.graph.ScoreAdvantage'
      },
      {
        type: 'Codex.details.view.common.graph.TeamScore'
      },
      {
        type: 'Codex.details.view.common.graph.ChampionScore'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.dominion.scoreboard.team.Header', {
  extend: 'Codex.details.view.common.scoreboard.team.Header',
  rtype: 'dominion-team-header',
  baseId: 'team-header',
  baseCls: 'team-header',
  cls: 'dominion',
  tpl: '<div class="gs-container team-summary"> <div class="team"> <!-- {% if teamId == 100 %} {{  trans ("scoreboard_blue_team") }} {% else %} {{  trans ("scoreboard_purple_team") }} {% endif %} --> </div> <div class="game-conclusion"> {% if win %} {{  trans ("victory") }} {% else %} {{  trans ("defeat") }} {% endif %} </div> <div class="gold">{{ gold }}</div> <div class="kills">{{ kills }}</div> <div class="team-marker"></div> </div> <div class="vs"></div> <div class="gs-container gs-no-gutter icon-bar"> <div class="champion champion-col"></div> <div class="kills kills-col"></div> <div class="items items-col"></div> <div class="score score-col"></div> <div class="rank rank-col"></div> <div class="team-marker"></div> </div>',
}); JSoop.define('Codex.details.view.dominion.scoreboard.team.Footer', {
  extend: 'Codex.details.view.common.scoreboard.team.Footer',
  rtype: 'dominion-team-footer',
  baseId: 'team-footer',
  baseCls: 'team-footer',
  cls: 'dominion',
  tpl: '<div class="gs-container gs-half-gutter"> <div class="team-marker"></div> <div class="bans-container"> <div id="{{ id }}-bans" class="bans"> <div class="label">{{  trans ("bans") }}:</div> </div> </div> <div class="dominion-victory-score"> {{  trans ("dominion_victory_score") }}: <span>{{ dominionVictoryScore }}</span> </div> </div>',
  initView: function () {
    var a = this;
    a.renderData = {
      dominionVictoryScore: a.model.get('dominionVictoryScore')
    };
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.Score', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-player-score',
  baseId: 'score',
  baseCls: 'score',
  cls: 'score-col',
  tpl: '{{ score }}',
  bindings: {
    score: 'totalPlayerScore'
  }
}); JSoop.define('Codex.details.view.common.scoreboard.player.Rank', {
  extend: 'Ramen.view.binding.BindingView',
  rtype: 'common-player-rank',
  baseId: 'rank',
  baseCls: 'rank',
  cls: 'rank-col',
  tpl: '{{ rank }}',
  bindings: {
    rank: 'totalScoreRank'
  }
}); JSoop.define('Codex.details.view.dominion.scoreboard.player.Player', {
  extend: 'Codex.details.view.common.scoreboard.player.Player',
  requires: [
    'Codex.details.view.common.scoreboard.player.Inventory',
    'Codex.details.view.common.scoreboard.player.KDA',
    'Codex.details.view.common.scoreboard.player.Name',
    'Codex.details.view.common.scoreboard.player.Rank',
    'Codex.details.view.common.scoreboard.player.Score'
  ],
  rtype: 'dominion-player',
  baseId: 'player',
  baseCls: 'player',
  cls: 'dominion',
  initView: function () {
    var a = this;
    a.items = [
      {
        type: 'Codex.details.view.common.scoreboard.player.Name'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.KDA'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.Inventory'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.Score'
      },
      {
        type: 'Codex.details.view.common.scoreboard.player.Rank'
      }
    ];
    a.callParent(arguments)
  }
}); JSoop.define('Codex.details.view.dominion.scoreboard.team.Team', {
  extend: 'Codex.details.view.common.scoreboard.team.Team',
  requires: [
    'Codex.details.view.dominion.scoreboard.player.Player',
    'Codex.details.view.dominion.scoreboard.team.Footer',
    'Codex.details.view.dominion.scoreboard.team.Header'
  ],
  rtype: 'dominion-team',
  baseId: 'team',
  baseCls: 'team',
  cls: 'dominion',
  headerType: 'Codex.details.view.dominion.scoreboard.team.Header',
  footerType: 'Codex.details.view.dominion.scoreboard.team.Footer',
  playerType: 'Codex.details.view.dominion.scoreboard.player.Player'
}); JSoop.define('Codex.details.view.dominion.scoreboard.Scoreboard', {
  extend: 'Codex.details.view.common.scoreboard.Scoreboard',
  requires: [
    'Codex.details.view.dominion.scoreboard.team.Team'
  ],
  rtype: 'dominion-scoreboard',
  baseId: 'scoreboard',
  baseCls: 'scoreboard',
  cls: 'dominion',
  teamType: 'Codex.details.view.dominion.scoreboard.team.Team'
}); JSoop.define('Codex.details.view.dominion.breakdown.Breakdown', {
  extend: 'Codex.details.view.common.breakdown.Breakdown',
  rtype: 'dominion-breakdown',
  graphs: [
    {
      name: 'champion_kills',
      formatter: 'numberFormat',
      field: 'kills'
    },
    {
      name: 'total_damage_to_champions',
      formatter: 'numberToK',
      field: 'totalDamageDealtToChampions'
    },
    {
      name: 'points_captured',
      formatter: 'numberFormat',
      field: 'objectivePlayerScore'
    },
    {
      name: 'champion_score_title',
      formatter: 'numberFormat',
      field: 'totalPlayerScore'
    }
  ],
  stats: [
    {
      name: 'largest_multi_kill',
      field: 'largestMultiKill',
      formatter: 'numberFormat'
    },
    {
      name: 'largest_killing_spree',
      field: 'largestKillingSpree',
      formatter: 'numberFormat'
    }
  ]
}); JSoop.define('Codex.details.view.dominion.Details', {
  extend: 'Codex.details.view.common.Details',
  requires: [
    'Codex.details.view.dominion.breakdown.Breakdown',
    'Codex.details.view.dominion.scoreboard.Scoreboard',
    'Codex.details.view.dominion.graph.Switcher'
  ],
  vtype: 'classic-details',
  cls: 'dominion',
  breakdownView: 'Codex.details.view.dominion.breakdown.Breakdown',
  graphView: 'Codex.details.view.dominion.graph.Switcher',
  scoreboardView: 'Codex.details.view.dominion.scoreboard.Scoreboard'
}); JSoop.define('Codex.details.view.classic.breakdown.Breakdown', {
  extend: 'Codex.details.view.common.breakdown.Breakdown',
  rtype: 'classic-breakdown',
  graphs: [
    {
      name: 'champion_kills',
      formatter: 'numberFormat',
      field: 'kills'
    },
    {
      name: 'gold_earned',
      formatter: 'numberToK',
      field: 'goldEarned'
    },
    {
      name: 'total_damage_to_champions',
      formatter: 'numberToK',
      field: 'totalDamageDealtToChampions'
    },
    {
      name: 'vision_items_placed',
      formatter: 'numberFormat',
      field: 'wardsPlaced'
    }
  ],
  stats: [
    {
      name: 'largest_multi_kill',
      field: 'largestMultiKill',
      formatter: 'numberFormat'
    },
    {
      name: 'largest_killing_spree',
      field: 'largestKillingSpree',
      formatter: 'numberFormat'
    }
  ]
}); JSoop.define('Codex.details.view.classic.Details', {
  extend: 'Codex.details.view.common.Details',
  requires: [
    'Codex.details.view.classic.breakdown.Breakdown',
    'Codex.details.view.classic.graph.Switcher',
    'Codex.details.view.classic.scoreboard.Scoreboard'
  ],
  vtype: 'classic-details',
  cls: 'classic',
  breakdownView: 'Codex.details.view.classic.breakdown.Breakdown',
  graphView: 'Codex.details.view.classic.graph.Switcher',
  scoreboardView: 'Codex.details.view.classic.scoreboard.Scoreboard'
}); JSoop.define('Codex.details.view.abyss.Details', {
  extend: 'Codex.details.view.common.Details',
  requires: [
    'Codex.details.view.abyss.breakdown.Breakdown',
    'Codex.details.view.abyss.scoreboard.Scoreboard',
    'Codex.details.view.classic.graph.Switcher'
  ],
  vtype: 'abyss-details',
  cls: 'abyss',
  breakdownView: 'Codex.details.view.abyss.breakdown.Breakdown',
  graphView: 'Codex.details.view.classic.graph.Switcher',
  scoreboardView: 'Codex.details.view.abyss.scoreboard.Scoreboard'
}); JSoop.define('Codex.details.view.ascension.Details', {
  extend: 'Codex.details.view.dominion.Details',
  vtype: 'details-ascension',
  cls: 'ascension'
}); JSoop.define('Codex.details.helper.Route', {
  extend: 'Ramen.app.Helper',
  requires: [
    'Codex.details.view.ascension.Details',
    'Codex.details.view.abyss.Details',
    'Codex.details.view.classic.Details',
    'Codex.details.view.dominion.Details',
    'Codex.details.view.treeline.Details',
    'Codex.details.view.poroking.Details',
    'Codex.details.view.urf.Details'
  ],
  typeMap: {
    1: 'classic',
    11: function (a) {
      if (a.get('queue') === 76) {
        return 'urf'
      }
      return 'classic'
    },
    8: function (a) {
      if (a.get('mode') === 'ASCENSION') {
        return 'ascension'
      }
      return 'dominion'
    },
    10: 'treeline',
    12: function (a) {
      if (a.get('mode') === 'KINGPORO') {
        return 'poroking'
      }
      return 'abyss'
    },
    14: 'abyss'
  },
  createMatchDetails: function (a) {
    var c = this,
    b = c.typeMap[a.model.get('map')];
    if (JSoop.isFunction(b)) {
      b = b(a.model)
    }
    return JSoop.create('Codex.details.view.' + b + '.Details', a)
  },
  updateCrumbs: function (b) {
    var a = Codex.getContextUser().findParticipant(b.getParticipants());
    if (a) {
      Codex.getBreadcrumbs().setCrumbs([{
        text: a.get('summonerName'),
        path: 'match-history/' + a.get('region') + '/' + a.get('account')
      }
      ])
    }
  },
  onRouteMatchDetails: function (e, g, b, c) {
    g = parseInt(g, 10);
    var d = this,
    f = Ramen.getCollection('Games'),
    a = f.get(g);
    b = Codex.model.User.parseId(b);
    Codex.setContextUser(b, 'vapor');
    Ramen.getCollection('Participants').clearFilters();
    if (!a) {
      a = JSoop.create('Codex.model.Game', {
        gameId: g,
        platformId: e,
        visiblePlatformId: e,
        visibleAccountId: b
      });
      f.add(a)
    }
    if (a.isLoadedFull) {
      d.onGameLoadFull(a)
    } else {
      a.on({
        'load:full': d.onGameLoadFull,
        'load:retry': d.onGameLoadRetry,
        'load:error': d.onGameLoadError,
        scope: d
      });
      a.getFull(!!c, JSoop.emptyFn)
    }
    Codex.util.Analytics.fire('view_match_details', {
      invokerId: Codex.getCurrentUser().get('id'),
      principleId: (typeof b !== 'undefined') ? b : Codex.getCurrentUser().get('id')
    });
    return false
  },
  onRouteEndOfGame: function (c, d, a) {
    var b = this;
    a = Codex.model.User.parseId(a);
    b.onRouteMatchDetails(c, d, a, true);
    b.owner.navigate({
      fragment: 'match-details/' + c + '/' + d + ((a) ? '/' + a : ''),
      silent: true,
      replace: true
    });
    return false
  },
  onGameLoadFull: function (a) {
    var b = this;
    b.getApp().viewport.replace(b.createMatchDetails({
      model: a
    }));
    b.updateCrumbs(a);
    a.off({
      'load:full': b.onGameLoadFull,
      'load:retry': b.onGameLoadRetry,
      'load:error': b.onGameLoadError,
      scope: b
    })
  },
  onGameLoadRetry: function () {
    var a = this;
    a.getApp().controllers.Error.gameProcessing()
  },
  onGameLoadError: function (b, a) {
    var c = this;
    if (a === 404) {
      c.getApp().controllers.Error.gameNotFound({
        missing_game: b.attributes
      })
    } else {
      c.getApp().controllers.Error.handle(a)
    }
  }
}); JSoop.define('Codex.details.Controller', {
  extend: 'Ramen.app.Controller',
  requires: [
    'Codex.details.helper.Route',
    'Codex.details.helper.View'
  ],
  helpers: {
    Route: 'Codex.details.helper.Route',
    View: 'Codex.details.helper.View'
  },
  routes: {
    'match-details/:region/:id/:userId?:query': {
      fn: 'onRouteMatchDetails',
      scope: 'Route'
    },
    'match-details/:region/:id?:query': {
      fn: 'onRouteMatchDetails',
      scope: 'Route'
    },
    'match-details/:region/:id/:userId': {
      fn: 'onRouteMatchDetails',
      scope: 'Route'
    },
    'match-details/:region/:id': {
      fn: 'onRouteEndOfGame',
      scope: 'Route'
    },
    'match-details/:region/:id/:userId/eog': {
      fn: 'onRouteEndOfGame',
      scope: 'Route'
    },
    'match-details/:region/:id/eog': {
      fn: 'onRouteEndOfGame',
      scope: 'Route'
    }
  }
}); JSoop.define('Codex.error.view.GameNotFound', {
  extend: 'Ramen.view.View',
  tpl: '<div class="default-4-7"> <h2 class="error-header-primary">Error: 404</h2> <h4 class="error-header-secondary"><h2>{{ trans(\'game_not_found_title\') }}</h2></h4> <div class="error-message"> {{ trans(\'game_not_found_msg\') }} </div> </div>',
}); JSoop.define('Codex.error.view.PlayerNotFound', {
  extend: 'Ramen.view.View',
  tpl: '<div class="default-4-7"> <h2 class="error-header-primary">Error: 404</h2> <h4 class="error-header-secondary"><h2>{{ trans(\'player_not_found_title\') }}</h2></h4> <div class="error-message"> {{ trans(\'player_not_found_msg\') }} </div> </div>',
}); JSoop.define('Codex.error.view.Unauthorized', {
  extend: 'Ramen.view.View',
  tpl: '<div class="default-4-7"> <h2 class="error-header-primary">Error: 401</h2> <h4 class="error-header-secondary"><h2>{{ trans(\'unauthorized_title\') }}</h2></h4> <div class="error-message"> {{ trans(\'unauthorized_msg\') }} </div> </div>',
}); JSoop.define('Codex.error.view.GameProcessing', {
  extend: 'Ramen.view.View',
  requires: [
    'Codex.common.view.Loading'
  ],
  tpl: '<div class="default-4-7"> <h2 class="error-header-primary">{{ trans(\'game_processing_title\') }}</h2> <div class="error-message"> {{ trans(\'game_processing_msg\') }} </div> </div>',
  onRenderDuring: function () {
    var a = this;
    a.callParent(arguments);
    a.loading = JSoop.create('Codex.common.view.Loading', {
      renderTo: a.el,
      autoRender: true
    })
  },
  onDestroy: function () {
    var a = this;
    if (a.loading) {
      a.loading.destroy()
    }
    a.callParent(arguments)
  }
}); JSoop.define('Codex.error.Controller', {
  extend: 'Ramen.app.Controller',
  requires: [
    'Codex.error.view.Default',
    'Codex.error.view.GameProcessing',
    'Codex.error.view.GameNotFound',
    'Codex.error.view.PlayerNotFound',
    'Codex.error.view.Unauthorized'
  ],
  routes: {
    error: 'misc',
    'error/game-not-found': 'gameNotFound',
    'error/player-not-found': 'playerNotFound',
    'error/unauthorized': 'unauthorized'
  },
  handle: function (a) {
    var b = this;
    if (a === undefined) {
      a = 500
    }
    switch (a) {
      case 401:
        b.unauthorized();
        break;
      default:
        b.misc()
    }
  },
  misc: function () {
    var a = this;
    a.getApp().viewport.replace({
      type: 'Codex.error.view.Default'
    });
    Codex.util.Analytics.fire('error_500')
  },
  gameProcessing: function () {
    var a = this;
    a.getApp().viewport.replace({
      type: 'Codex.error.view.GameProcessing'
    })
  },
  gameNotFound: function (b) {
    var a = this;
    a.getApp().viewport.replace({
      type: 'Codex.error.view.GameNotFound'
    });
    Codex.util.Analytics.fire('error_404_game_not_found', b)
  },
  playerNotFound: function (b) {
    var a = this;
    a.getApp().viewport.replace({
      type: 'Codex.error.view.PlayerNotFound'
    });
    Codex.util.Analytics.fire('error_404_player_not_found', b)
  },
  unauthorized: function () {
    var a = this;
    a.getApp().viewport.replace({
      type: 'Codex.error.view.Unauthorized'
    })
  }
}); JSoop.define('Codex.model.Mastery', {
  extend: 'Ramen.data.Model',
  name: 'Mastery',
  fields: [
    {
      name: 'id',
      mapping: 'masteryId'
    },
    {
      name: 'rank'
    }
  ]
}); JSoop.define('Codex.model.Participant', {
  extend: 'Ramen.data.Model',
  name: 'Participant',
  isParticipant: true,
  requires: [
    'Codex.model.Frame',
    'Codex.model.Mastery',
    'Codex.model.Rune'
  ],
  fields: [
    {
      name: 'id',
      mapping: 'gameId',
      convert: function (c, b, a) {
        if (a.id) {
          return a.id
        }
        if (a.player && a.player.currentAccountId) {
          return c + '-' + a.player.currentAccountId
        }
        return c + '-' + a.participantId
      }
    },
    {
      name: 'gameId'
    },
    {
      name: 'participantId',
      type: 'int'
    },
    {
      name: 'team',
      mapping: 'teamId'
    },
    {
      name: 'win',
      mapping: 'stats.win'
    },
    {
      name: 'lane',
      mapping: 'timeline.lane'
    },
    {
      name: 'summonerName',
      mapping: 'player.summonerName'
    },
    {
      name: 'account',
      mapping: 'player.accountId'
    },
    {
      name: 'region',
      mapping: 'player.platformId'
    },
    {
      name: 'currentAccount',
      mapping: 'player.currentAccountId'
    },
    {
      name: 'currentRegion',
      mapping: 'player.currentPlatformId'
    },
    {
      name: 'matchHistory',
      mapping: 'player.matchHistoryUri'
    },
    {
      name: 'champion',
      mapping: 'championId'
    },
    {
      name: 'champLevel',
      mapping: 'stats.champLevel'
    },
    {
      name: 'skin',
      mapping: 'skinId'
    },
    {
      name: 'spell1',
      mapping: 'spell1Id'
    },
    {
      name: 'spell2',
      mapping: 'spell2Id'
    },
    {
      name: 'item0',
      mapping: 'stats.item0'
    },
    {
      name: 'item1',
      mapping: 'stats.item1'
    },
    {
      name: 'item2',
      mapping: 'stats.item2'
    },
    {
      name: 'item3',
      mapping: 'stats.item3'
    },
    {
      name: 'item4',
      mapping: 'stats.item4'
    },
    {
      name: 'item5',
      mapping: 'stats.item5'
    },
    {
      name: 'trinket',
      mapping: 'stats.item6'
    },
    {
      name: 'inventory',
      mapping: 'stats.item0',
      convert: function (c, b, a) {
        if (c === undefined || a.stats === undefined) {
          return
        }
        return [c,
        a.stats.item1,
        a.stats.item2,
        a.stats.item3,
        a.stats.item4,
        a.stats.item5,
        a.stats.item6]
      }
    },
    {
      name: 'kills',
      mapping: 'stats.kills'
    },
    {
      name: 'deaths',
      mapping: 'stats.deaths'
    },
    {
      name: 'assists',
      mapping: 'stats.assists'
    },
    {
      name: 'largestKillingSpree',
      mapping: 'stats.largestKillingSpree'
    },
    {
      name: 'largestMultiKill',
      mapping: 'stats.largestMultiKill'
    },
    {
      name: 'killingSprees',
      mapping: 'stats.killingSprees'
    },
    {
      name: 'doubleKills',
      mapping: 'stats.doubleKills'
    },
    {
      name: 'tripleKills',
      mapping: 'stats.tripleKills'
    },
    {
      name: 'quadraKills',
      mapping: 'stats.quadraKills'
    },
    {
      name: 'pentaKills',
      mapping: 'stats.pentaKills'
    },
    {
      name: 'totalDamageDealt',
      mapping: 'stats.totalDamageDealt'
    },
    {
      name: 'totalDamageDealtToChampions',
      mapping: 'stats.totalDamageDealtToChampions'
    },
    {
      name: 'magicDamageDealt',
      mapping: 'stats.magicDamageDealt'
    },
    {
      name: 'magicDamageDealtToChampions',
      mapping: 'stats.magicDamageDealtToChampions'
    },
    {
      name: 'physicalDamageDealt',
      mapping: 'stats.physicalDamageDealt'
    },
    {
      name: 'physicalDamageDealtToChampions',
      mapping: 'stats.physicalDamageDealtToChampions'
    },
    {
      name: 'trueDamageDealt',
      mapping: 'stats.trueDamageDealt'
    },
    {
      name: 'trueDamageDealtToChampions',
      mapping: 'stats.trueDamageDealtToChampions'
    },
    {
      name: 'largestCriticalStrike',
      mapping: 'stats.largestCriticalStrike'
    },
    {
      name: 'totalTimeCrowdControlDealt',
      mapping: 'stats.totalTimeCrowdControlDealt'
    },
    {
      name: 'totalHeal',
      mapping: 'stats.totalHeal'
    },
    {
      name: 'totalUnitsHealed',
      mapping: 'stats.totalUnitsHealed'
    },
    {
      name: 'totalDamageTaken',
      mapping: 'stats.totalDamageTaken'
    },
    {
      name: 'physicalDamageTaken',
      mapping: 'stats.physicalDamageTaken'
    },
    {
      name: 'magicalDamageTaken',
      mapping: 'stats.magicalDamageTaken'
    },
    {
      name: 'trueDamageTaken',
      mapping: 'stats.trueDamageTaken'
    },
    {
      name: 'goldEarned',
      mapping: 'stats.goldEarned'
    },
    {
      name: 'goldSpent',
      mapping: 'stats.goldSpent'
    },
    {
      name: 'turretKills',
      mapping: 'stats.turretKills'
    },
    {
      name: 'inhibitorKills',
      mapping: 'stats.inhibitorKills'
    },
    {
      name: 'minionsKilled',
      mapping: 'stats.totalMinionsKilled'
    },
    {
      name: 'neutralMinionsKilled',
      mapping: 'stats.neutralMinionsKilled'
    },
    {
      name: 'neutralMinionsKilledEnemyJungle',
      mapping: 'stats.neutralMinionsKilledEnemyJungle'
    },
    {
      name: 'neutralMinionsKilledTeamJungle',
      mapping: 'stats.neutralMinionsKilledTeamJungle'
    },
    {
      name: 'totalMinionsKilled',
      mapping: 'stats.totalMinionsKilled',
      convert: function (c, a, b) {
        if (c === undefined || b.stats === undefined) {
          return
        }
        return c + b.stats.neutralMinionsKilled
      }
    },
    {
      name: 'sightWardsBoughtInGame',
      mapping: 'stats.sightWardsBoughtInGame'
    },
    {
      name: 'visionWardsBoughtInGame',
      mapping: 'stats.visionWardsBoughtInGame'
    },
    {
      name: 'wardsPlaced',
      mapping: 'stats.wardsPlaced'
    },
    {
      name: 'wardsKilled',
      mapping: 'stats.wardsKilled'
    },
    {
      name: 'firstBloodKill',
      mapping: 'stats.firstBloodKill'
    },
    {
      name: 'firstBloodAssist',
      mapping: 'stats.firstBloodAssist'
    },
    {
      name: 'firstTowerKill',
      mapping: 'stats.firstTowerKill'
    },
    {
      name: 'firstTowerAssist',
      mapping: 'stats.firstTowerAssist'
    },
    {
      name: 'firstInhibitorKill',
      mapping: 'stats.firstInhibitorKill'
    },
    {
      name: 'firstInhibitorAssist',
      mapping: 'stats.firstInhibitorAssist'
    },
    {
      name: 'combatPlayerScore',
      mapping: 'stats.combatPlayerScore'
    },
    {
      name: 'objectivePlayerScore',
      mapping: 'stats.objectivePlayerScore'
    },
    {
      name: 'totalPlayerScore',
      mapping: 'stats.totalPlayerScore'
    },
    {
      name: 'totalScoreRank',
      mapping: 'stats.totalScoreRank'
    },
    {
      name: 'relicsCaptured',
      mapping: 'stats.objectivePlayerScore',
      convert: function (c, a, b) {
        if (c === undefined || b.stats === undefined) {
          return
        }
        return c / 3
      }
    },
    {
      name: 'longestTimeSpentLiving',
      mapping: 'stats.longestTimeSpentLiving'
    },
    {
      name: 'totalTimeSpentDead',
      mapping: 'stats.totalTimeSpentDead'
    },
    {
      name: 'masteriesField',
      mapping: 'masteries'
    },
    {
      name: 'runesField',
      mapping: 'runes'
    }
  ],
  associations: [
    {
      type: 'hasMany',
      name: 'Timeline',
      model: 'Codex.model.Frame',
      foreignKey: 'participantId',
      mapping: 'frames'
    },
    {
      type: 'hasMany',
      name: 'Masteries',
      model: 'Codex.model.Mastery',
      foreignKey: 'participantId',
      mapping: 'masteries'
    },
    {
      type: 'hasMany',
      name: 'Runes',
      model: 'Codex.model.Rune',
      foreignKey: 'participantId',
      mapping: 'runes'
    }
  ],
  hasMasteries: function () {
    var a = this;
    return a.get('masteriesField') !== undefined
  },
  hasRunes: function () {
    var a = this;
    return a.get('runesField') !== undefined
  },
  hasSkillEvents: function () {
    var e = this,
    a = e.getGame().get('version'),
    c = a.split('.'),
    b = parseInt(c[0], 10),
    d = parseInt(c[1], 10);
    return b >= 5 || (b === 4 && d >= 14)
  }
}); JSoop.define('Codex.collection.Participants', {
  extend: 'Ramen.data.Collection',
  requires: [
    'Codex.model.Participant'
  ],
  model: 'Codex.model.Participant'
}); JSoop.define('Codex.model.Team', {
  extend: 'Ramen.data.Model',
  name: 'Team',
  isTeam: true,
  fields: [
    {
      name: 'id',
      mapping: 'teamId'
    },
    {
      name: 'gameId'
    },
    {
      name: 'win',
      convert: function (a) {
        return a !== 'Fail'
      }
    },
    {
      name: 'firstBlood',
      type: 'bool'
    },
    {
      name: 'firstTower',
      type: 'bool'
    },
    {
      name: 'firstInhibitor',
      type: 'bool'
    },
    {
      name: 'firstBaron',
      type: 'bool'
    },
    {
      name: 'firstDragon',
      type: 'bool'
    },
    {
      name: 'towerKills',
      type: 'int'
    },
    {
      name: 'inhibitorKills',
      type: 'int'
    },
    {
      name: 'baronKills',
      type: 'int'
    },
    {
      name: 'dragonKills',
      type: 'int'
    },
    {
      name: 'vilemawKills',
      type: 'int'
    },
    {
      name: 'dominionVictoryScore',
      type: 'int'
    },
    {
      name: 'bans'
    }
  ],
  associations: [
    {
      type: 'hasMany',
      name: 'Participants',
      model: 'Codex.model.Participant',
      mapping: 'participants',
      foreignKey: 'team',
      prepare: 'prepareParticipants'
    }
  ],
  prepareParticipants: function (b) {
    var c = this,
    a;
    if (c.getGame) {
      a = c.getGame();
      b.participants = a.getParticipants().find({
        team: b.teamId
      })
    } else {
      b.participants = Ramen.getCollection('Participants').find({
        team: b.teamId,
        gameId: b.gameId
      })
    }
  }
}); JSoop.define('Codex.model.event.Event', {
  extend: 'Ramen.data.Model',
  name: 'Event',
  fields: [
    {
      name: 'id',
      convert: function () {
        return Ramen.id('event')
      }
    },
    {
      name: 'type'
    },
    {
      name: 'timestamp',
      type: 'int'
    },
    {
      name: 'frameTimestamp',
      type: 'int'
    },
    {
      name: 'x',
      mapping: 'position.x',
      type: 'int'
    },
    {
      name: 'y',
      mapping: 'position.y',
      type: 'int'
    }
  ]
}); JSoop.define('Codex.model.event.BuildingKillEvent', {
  extend: 'Codex.model.event.Event',
  name: 'BuildingKillEvent',
  fields: [
    {
      name: 'buildingType'
    },
    {
      name: 'lane',
      mapping: 'laneType'
    },
    {
      name: 'killer',
      mapping: 'killerId',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'team',
      mapping: 'teamId',
      convert: function (a) {
        return (a === 100) ? '200' : '100'
      }
    },
    {
      name: 'towerType'
    },
    {
      name: 'assists',
      mapping: 'assistingParticipantIds',
      convert: function (d, b) {
        var a = b.getGame().getParticipants(),
        c = [
        ];
        JSoop.each(d, function (e) {
          a.each(function (f) {
            if (f.get('participantId') === e) {
              c.push(f)
            }
          })
        });
        return c
      }
    }
  ]
}); JSoop.define('Codex.model.event.ChampionKillEvent', {
  extend: 'Codex.model.event.Event',
  name: 'ChampionKillEvent',
  fields: [
    {
      name: 'killer',
      mapping: 'killerId',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'assists',
      mapping: 'assistingParticipantIds',
      convert: function (d, b) {
        var a = b.getGame().getParticipants(),
        c = [
        ];
        JSoop.each(d, function (e) {
          a.each(function (f) {
            if (f.get('participantId') === e) {
              c.push(f)
            }
          })
        });
        return c
      }
    },
    {
      name: 'victim',
      mapping: 'victimId',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'team',
      mapping: 'victimId',
      convert: function (c, b) {
        var a = b.getGame().getParticipants().findFirst({
          participantId: c
        }).get('team');
        return (a === 100) ? '200' : '100'
      }
    }
  ]
}); JSoop.define('Codex.model.event.EliteMonsterKillEvent', {
  extend: 'Codex.model.event.Event',
  name: 'EliteMonsterKillEvent',
  fields: [
    {
      name: 'monsterType'
    },
    {
      name: 'killer',
      mapping: 'killerId',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'team',
      mapping: 'killerId',
      convert: function (c, b) {
        var a = b.getGame().getParticipants().findFirst({
          participantId: c
        }).get('team');
        return (a === 100) ? '100' : '200'
      }
    },
    {
      name: 'assists',
      mapping: 'assistingParticipantIds',
      convert: function (d, b) {
        var a = b.getGame().getParticipants(),
        c = [
        ];
        JSoop.each(d, function (e) {
          a.each(function (f) {
            if (f.get('participantId') === e) {
              c.push(f)
            }
          })
        });
        return c
      }
    }
  ]
}); JSoop.define('Codex.model.event.ItemEvent', {
  extend: 'Codex.model.event.Event',
  name: 'ItemEvent',
  fields: [
    {
      name: 'item',
      mapping: 'itemId',
      type: 'int'
    },
    {
      name: 'source',
      mapping: 'participantId',
      type: 'int',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    }
  ]
}); JSoop.define('Codex.model.event.ItemPurchaseEvent', {
  extend: 'Codex.model.event.ItemEvent',
  name: 'ItemPurchaseEvent'
}); JSoop.define('Codex.model.event.ItemSellEvent', {
  extend: 'Codex.model.event.ItemEvent',
  name: 'ItemSellEvent'
}); JSoop.define('Codex.model.event.ItemUndoEvent', {
  extend: 'Codex.model.event.Event',
  name: 'ItemUndoEvent',
  fields: [
    {
      name: 'item',
      mapping: 'beforeId',
      type: 'int',
      convert: function (c, a, b) {
        return c === 0 ? b.afterId : c
      }
    },
    {
      name: 'source',
      mapping: 'participantId',
      type: 'int',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'undoType',
      convert: function (c, a, b) {
        return b.beforeId !== 0 ? 'buy' : 'sell'
      }
    }
  ]
}); JSoop.define('Codex.model.event.SkillUpEvent', {
  extend: 'Codex.model.event.Event',
  name: 'SkillUpEvent',
  fields: [
    {
      name: 'source',
      mapping: 'participantId',
      type: 'int',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'slot',
      mapping: 'skillSlot',
      type: 'int'
    },
    {
      name: 'skillUpType',
      mapping: 'levelUpType'
    }
  ]
}); JSoop.define('Codex.model.event.AscendedEvent', {
  extend: 'Codex.model.event.Event',
  name: 'AscendedEvent',
  fields: [
    {
      name: 'ascended',
      mapping: 'participantId',
      type: 'int',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'team',
      mapping: 'participantId',
      convert: function (c, b) {
        var a = b.getGame().getParticipants().findFirst({
          participantId: c
        });
        if (a === undefined) {
          return undefined
        }
        a = a.get('team');
        return (a === 100) ? '100' : '200'
      }
    },
    {
      name: 'ascendedType',
      mapping: 'ascendedType'
    }
  ]
}); JSoop.define('Codex.model.event.CapturePointEvent', {
  extend: 'Codex.model.event.Event',
  name: 'CapturePointEvent',
  fields: [
    {
      name: 'eventType',
      mapping: 'eventType'
    },
    {
      name: 'participant',
      mapping: 'participantId',
      convert: function (b, a) {
        return a.getGame().getParticipants().findFirst({
          participantId: b
        })
      }
    },
    {
      name: 'pointCaptured',
      mapping: 'pointCaptured'
    },
    {
      name: 'team',
      mapping: 'participantId',
      convert: function (c, b) {
        var a = b.getGame().getParticipants().findFirst({
          participantId: c
        });
        if (a === undefined) {
          return undefined
        }
        a = a.get('team');
        return (a === 100) ? '100' : '200'
      }
    }
  ]
}); JSoop.define('Codex.model.event.PoroKingSummonEvent', {
  extend: 'Codex.model.event.Event',
  name: 'PoroKingSummonEvent',
  fields: [
    {
      name: 'team',
      mapping: 'teamId',
      convert: function (a) {
        return (a === 100) ? '100' : '200'
      }
    }
  ]
}); JSoop.define('Codex.model.Game', {
  extend: 'Ramen.data.Model',
  requires: [
    'Codex.util.ACS',
    'Codex.model.Participant',
    'Codex.model.Team',
    'Codex.model.event.Event',
    'Codex.model.event.BuildingKillEvent',
    'Codex.model.event.ChampionKillEvent',
    'Codex.model.event.EliteMonsterKillEvent',
    'Codex.model.event.ItemEvent',
    'Codex.model.event.ItemPurchaseEvent',
    'Codex.model.event.ItemSellEvent',
    'Codex.model.event.ItemUndoEvent',
    'Codex.model.event.SkillUpEvent',
    'Codex.model.event.AscendedEvent',
    'Codex.model.event.CapturePointEvent',
    'Codex.model.event.PoroKingSummonEvent'
  ],
  isGame: true,
  name: 'Game',
  fields: [
    {
      name: 'id',
      mapping: 'gameId'
    },
    {
      name: 'version',
      mapping: 'gameVersion'
    },
    {
      name: 'map',
      mapping: 'mapId'
    },
    {
      name: 'created',
      mapping: 'gameCreation',
      convert: function (a) {
        if (JSoop.isString(a)) {
          a = parseInt(a, 10)
        } else {
          if (a instanceof Date) {
            return a
          }
        }
        return new Date(a)
      }
    },
    {
      name: 'duration',
      mapping: 'gameDuration',
      type: 'int'
    },
    {
      name: 'queue',
      mapping: 'queueId'
    },
    {
      name: 'season',
      mapping: 'seasonId'
    },
    {
      name: 'region',
      mapping: 'platformId'
    },
    {
      name: 'mode',
      mapping: 'gameMode'
    },
    {
      name: 'type',
      mapping: 'gameType'
    },
    {
      name: 'visiblePlatformId'
    },
    {
      name: 'visibleAccountId'
    }
  ],
  associations: [
    {
      type: 'hasMany',
      name: 'Participants',
      model: 'Codex.model.Participant',
      mapping: 'participants',
      foreignKey: 'gameId',
      globalCollection: 'Participants',
      prepare: 'prepareParticipants'
    },
    {
      type: 'hasMany',
      name: 'Teams',
      model: 'Codex.model.Team',
      mapping: 'teams',
      foreignKey: 'gameId'
    },
    {
      type: 'hasMany',
      name: 'Events',
      model: 'Codex.model.event.Event',
      mapping: 'events',
      foreignKey: 'gameId',
      prepare: 'prepareTimeline'
    }
  ],
  hasUser: function (a) {
    var b = this;
    return !!b.getUser(a)
  },
  getUser: function (a) {
    var b = this;
    return a.findParticipant(b.getParticipants())
  },
  hasBuilds: function () {
    var b = this,
    a = b.getParticipants().items[0];
    return a.hasMasteries() && a.hasRunes() && a.hasSkillEvents()
  },
  getFull: function (a, c, b) {
    var d = this;
    if (d.isLoadedFull) {
      c.call(b, d);
      return
    }
    if (!d.fullPromise) {
      d.fullPromise = Codex.util.ACS.makeRequest({
        url: Codex.util.ACS.getGame({
          region: d.get('region'),
          id: d.get('id'),
          visiblePlatformId: d.get('visiblePlatformId'),
          visibleAccountId: d.get('visibleAccountId')
        }),
        listeners: {
          load: d.onFullLoad,
          error: d.onPromiseError,
          retry: d.onGamePromiseRetry,
          scope: d
        },
        retry: a
      })
    }
    d.fullPromise.on('load', d.createPromiseCallback(c, b))
  },
  getTimeline: function (b, a) {
    var c = this;
    if (c.timeline) {
      b.call(a, c);
      return
    }
    if (!c.timelinePromise) {
      c.timelinePromise = Codex.util.ACS.makeRequest({
        url: Codex.util.ACS.getTimeline(c.get('region'), c.get('id')),
        listeners: {
          load: c.onTimelinePromiseLoad,
          error: c.onTimelinePromiseError,
          retry: c.onTimelinePromiseRetry,
          scope: c
        },
        retry: true
      })
    }
    c.timelinePromise.on('load', c.createPromiseCallback(b, a))
  },
  createPromiseCallback: function (b, a) {
    var c = this;
    return function () {
      b.call(a, c)
    }
  },
  prepareParticipants: function (a) {
    var c = this,
    b,
    d;
    if (!a.participants) {
      return
    }
    if (c.getParticipants) {
      b = Ramen.getCollection('Participants');
      d = c.getParticipants();
      d.each(function (e) {
        b.remove(e);
        d.remove(e)
      })
    }
    JSoop.each(a.participants || [], function (e) {
      var f;
      JSoop.each(a.participantIdentities, function (g) {
        if (g.participantId === e.participantId) {
          f = g;
          return false
        }
      });
      JSoop.apply(e, f || {
      });
      e.gameId = a.gameId
    })
  },
  hasValidMonster: function (a) {
    return a.type === 'ELITE_MONSTER_KILL' && (a.monsterType === 'DRAGON' || a.monsterType === 'BARON_NASHOR' || a.monsterType === 'VILEMAW')
  },
  prepareTimeline: function (b) {
    var f = this,
    c = {
    },
    d = [
    ],
    g = b.frames || [],
    e = function () {
      return f
    },
    a = {
      CHAMPION_KILL: 'Codex.model.event.ChampionKillEvent',
      BUILDING_KILL: 'Codex.model.event.BuildingKillEvent',
      ITEM_PURCHASED: 'Codex.model.event.ItemPurchaseEvent',
      ITEM_SOLD: 'Codex.model.event.ItemSellEvent',
      ITEM_UNDO: 'Codex.model.event.ItemUndoEvent',
      SKILL_LEVEL_UP: 'Codex.model.event.SkillUpEvent',
      ASCENDED_EVENT: 'Codex.model.event.AscendedEvent',
      CAPTURE_POINT: 'Codex.model.event.CapturePointEvent',
      PORO_KING_SUMMON: 'Codex.model.event.PoroKingSummonEvent'
    };
    if (g.length === 0) {
      return
    }
    JSoop.each(g, function (i) {
      JSoop.each(i.events, function (j) {
        j.frameTimestamp = i.timestamp;
        if (a[j.type]) {
          j = JSoop.create(a[j.type], j, {
            getGame: e
          })
        } else {
          if (f.hasValidMonster(j)) {
            j = JSoop.create('Codex.model.event.EliteMonsterKillEvent', j, {
              getGame: e
            })
          }
        }
        if (j.isModel) {
          d.push(j)
        }
      });
      var h = [
      ];
      JSoop.iterate(i.participantFrames, function (j) {
        h.push(j)
      });
      JSoop.each(h, function (k) {
        var l = k.participantId,
        j;
        if (!c[l]) {
          c[l] = [
          ]
        }
        j = c[l];
        k.timestamp = i.timestamp;
        j.push(k)
      })
    });
    f.getParticipants().each(function (h) {
      h.set({
        frames: c[h.get('participantId')]
      })
    });
    b.events = d
  },
  set: function () {
    var a = this;
    a.isLoadedFull = false;
    a.callParent(arguments)
  },
  onFullLoad: function (c, b) {
    var a = this;
    a.set(b);
    a.isLoadedFull = true;
    delete a.fullPromise;
    a.fireEvent('load:full', a)
  },
  onPromiseError: function (c, a, b) {
    this.fireEvent('error', a, b);
    this.fireEvent('load:error', this, a, b)
  },
  onGamePromiseRetry: function () {
    this.fireEvent('retry');
    this.fireEvent('load:retry', this)
  },
  onTimelinePromiseLoad: function (c, b) {
    var a = this;
    a.set(b);
    a.timeline = true;
    delete a.timelinePromise;
    a.fireEvent('load-timeline');
    a.fireEvent('timeline:load', a)
  },
  onTimelinePromiseError: function (d, a, b) {
    var c = this;
    c.timeline = false;
    delete c.timelinePromise;
    c.fireEvent('error-timeline', a, b);
    c.fireEvent('timeline:error', c, a, b)
  },
  onTimelinePromiseRetry: function () {
    this.fireEvent('retry-timeline');
    this.fireEvent('timeline:retry', this)
  }
}); JSoop.define('Codex.collection.Games', {
  extend: 'Ramen.data.Collection',
  requires: [
    'Codex.util.ACS',
    'Codex.model.Game'
  ],
  model: 'Codex.model.Game',
  pager: {
    perPage: 15,
    page: 0,
    start: 0,
    end: 0
  },
  constructor: function () {
    var a = this;
    a.historyCache = {
    };
    a._filter = {
      champion: [
      ],
      map: [
      ],
      queue: [
      ]
    };
    a.callParent(arguments)
  },
  comparator: function (a) {
    return - a.get('created')
  },
  setFilters: function (a) {
    var b = this;
    JSoop.iterate(a, function (c, d) {
      if (c && d in b._filter) {
        JSoop.each(c, function (e) {
          if (jQuery.inArray(e, b._filter[d]) === - 1) {
            b._filter[d].push(e)
          }
        })
      }
    });
    b.clearFilters();
    b.addFilter('queueFilter', function (c) {
      return b._filter.queue.indexOf(c.get('queue') + '') !== - 1
    })
  },
  getFilters: function () {
    var a = this,
    b = [
    ];
    JSoop.iterate(a._filter, function (c, d) {
      if (c) {
        JSoop.each(c, function (e) {
          b.push((e) ? d + '=' + e : '')
        })
      }
    });
    return b.join('&')
  },
  shouldLoad: function (a) {
    var b = this;
    return b.historyCache[a] !== undefined || b.fireEvent('beforeload', b) === false || b.fireEvent('load:before', b) === false
  },
  getHistory: function (j, b) {
    var h = this,
    c = h.pager.page * h.pager.perPage,
    e = c + h.pager.perPage,
    g = '?begIndex=' + c + '&endIndex=' + e + '&' + h.getFilters(),
    a = Codex.util.ACS.getPlayerHistory(j, b, g),
    d = h.historyCache[a],
    f;
    if (h.shouldLoad(a)) {
      h.readPager(d.gameData);
      for (f = d.gameData.games.length - 1; f >= 0; f = f - 1) {
        if (h.find({
          id: d.gameData.games[f].gameId
        }).length === 0) {
          h.insert(d.gameData.games[f])
        }
      }
      h.fireEvent('listLoad', h, d, h._filter);
      h.fireEvent('load:list', h, d, h._filter);
      return
    }
    h.historyCache[a] = Codex.util.ACS.makeRequest({
      url: a,
      listeners: {
        load: h.onHistoryLoad,
        error: h.onPromiseError,
        scope: h
      }
    })
  },
  next: function (b, c) {
    var a = this;
    if ((a.pager.page + 1) < a.pager.pages) {
      a.pager.page = a.pager.page + 1;
      if (a.pager.page === 1) {
        Codex.util.Analytics.fire('view_match_history_more')
      }
      a.getHistory(b, c)
    }
  },
  clearPager: function () {
    var a = this;
    a.pager.page = 0;
    a.pager.pages = 0;
    a.pager.start = 0;
    a.pager.end = 0;
    a.pager.total = 0
  },
  clearFilter: function () {
    var a = this;
    a._filter.champion = [
    ];
    a._filter.queue = [
    ];
    a._filter.map = [
    ]
  },
  reinitialize: function () {
    var a = this;
    a.clearFilter();
    a.clearPager();
    a.fireEvent('reinitialize', a);
    a.removeAllListeners()
  },
  findByUser: function (a) {
    var b = this,
    c = [
    ];
    b.each(function (d) {
      if (a.findParticipant(d.getParticipants())) {
        c.push(d)
      }
    });
    return c
  },
  readPager: function (b) {
    var a = this;
    a.pager.total = b.gameCount;
    a.pager.start = b.gameIndexBegin;
    a.pager.end = b.gameIndexEnd;
    a.pager.page = Math.floor(a.pager.start / a.pager.perPage);
    a.pager.pages = Math.ceil(a.pager.total / a.pager.perPage)
  },
  onHistoryLoad: function (d, c) {
    var b = this,
    a = {
      shownQueues: c.shownQueues,
      friendsFiltered: c.friendsFiltered,
      gameData: c.games
    };
    b.add(c.games.games);
    b.readPager(c.games);
    b.fireEvent('load', b);
    b.fireEvent('listLoad', b, a, b._filter);
    b.fireEvent('load:list', b, a, b._filter);
    b.historyCache[d.url] = JSoop.clone(a)
  },
  onPromiseError: function (c, a, b) {
    this.fireEvent('error', a, b)
  }
}); JSoop.define('Codex.model.CurrentUser', {
  extend: 'Codex.model.User',
  requires: [
    'Codex.util.ACS'
  ],
  constructor: function (c, d) {
    var e = this,
    f = e.getVaporRegion(),
    h = Riot.getCookie('PVPNET_ID_' + f),
    g,
    a;
    c = c || {
    };
    c.accountId = h;
    g = {
      Region: f
    };
    if (e.isLoggedIn()) {
      g.Authorization = 'Vapor ' + e.getToken()
    }
    Codex.util.ACS.setHeaders(g);
    e.callParent([c,
    d]);
    e.set('type', 'vapor');
    function b() {
      setTimeout(function () {
        if (!Ramen.getCollection('Participants')) {
          b();
          return
        }
        a = e.findParticipant(Ramen.getCollection('Participants'));
        if (a && a.get('region')) {
          e.set('region', a.get('region'))
        } else {
          Ramen.getCollection('Participants').on('add', e.onParticipantsAdd, e)
        }
      }, 10)
    }
    b()
  },
  onParticipantsAdd: function (d, b) {
    var c = this,
    a;
    JSoop.each(b, function (e) {
      if (c.isParticipant(e)) {
        a = e;
        return false
      }
    });
    if (!a) {
      return
    }
    c.set('region', a.get('region'));
    d.off('add', c.onParticipantsAdd, c)
  },
  getToken: function () {
    if (window.RiotBar) {
      return Riot.getCookie(RiotBar.account.cookies.token)
    } else {
      return Riot.getCookie('PVPNET_TOKEN_' + this.getVaporRegion())
    }
  },
  getVaporRegion: function () {
    return Codex.util.Region.getRegion()
  },
  isLoggedIn: function () {
    if (window.RiotBar) {
      return !!Riot.getCookie(RiotBar.account.cookies.token)
    } else {
      return !!Riot.getCookie('PVPNET_TOKEN_' + this.getVaporRegion())
    }
  }
}, function () {
  Codex.getCurrentUser = function () {
    return Codex.model.CurrentUser
  }
}); JSoop.namespace('Codex'); Codex.setup = function () {
  Codex.model.CurrentUser = JSoop.create('Codex.model.CurrentUser');
  Riot.DDragon.addApp(['item',
  'champion',
  'summoner'], function () {
    Ramen.application({
      requires: [
        'Codex.util.Config',
        'Codex.util.DataDragon',
        'Codex.util.I18n',
        'Codex.util.Analytics',
        'Codex.util.Assets',
        'Codex.util.Formatters',
        'Codex.util.Region',
        'Codex.model.CurrentUser',
        'Codex.collection.Games',
        'Codex.collection.Participants',
        'Codex.common.view.Breadcrumbs',
        'Codex.common.view.Tooltip',
        'Codex.player.view.Search',
        'Codex.error.Controller',
        'Codex.player.Controller',
        'Codex.details.Controller',
        'Codex.history.Controller',
        'Codex.page.Controller'
      ],
      collections: {
        Games: 'Codex.collection.Games',
        Participants: 'Codex.collection.Participants'
      },
      controllers: {
        Details: 'Codex.details.Controller',
        Error: 'Codex.error.Controller',
        History: 'Codex.history.Controller',
        Page: 'Codex.page.Controller',
        Player: 'Codex.player.Controller'
      },
      run: function () {
        var a = this;
        a.viewport = JSoop.create('Ramen.view.container.Viewport', {
          renderTo: '#main',
          autoRender: true
        });
        Twig.extendFunction('trans', function (b) {
          return Codex.util.I18n.trans(b)
        });
        Twig.extendFunction('asset', function (b) {
          return CODEX_ASSET_PATH + b
        });
        JSoop.create('Codex.player.view.Search', {
          renderTo: '#search',
          autoRender: true
        })
      }
    });
    JSoop.iterate(Riot.DDragon.models, function (a, b) {
      Riot.DDragon.models[b + '_' + a.version] = a;
      if (b !== 'mastery' && b !== 'language') {
        Riot.DDragon.addDisplay({
          type: b + '_' + a.version + '_tooltip',
          success: Riot.DDragon.display[b + '_tooltip'].success
        })
      }
    });
    JSoop.iterate(Riot.DDragon.display, function (b, a) {
      if (a.indexOf('champion') !== - 1 && a.indexOf('tooltip') !== - 1) {
        Riot.DDragon.addDisplay({
          type: a,
          success: function (c) {
            return '<div class="info"><div class="name">' + c.name + '</div></div>'
          }
        })
      }
    })
  })
};
