/**
 * 2021年冬季番剧新闻
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
module.exports = function(host) {
    const { mockSeason, prepareSeason, addSource } = host;

    mockSeason({
        id: "202101",
        name: "2021年冬季",
        status: "来源收录已完成",
        schedule: "1am",
        scenarioLink: "https://rss.projectxero.top/scenarios/6/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/2021-01.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2F2021-01.xml",
        sources: [
            {
                name: "工作细胞!!",
                page: "https://hataraku-saibou.com/news_gekijou/"
            },
            {
                name: "工作细胞BLACK",
                page: "https://saibou-black.com/news/"
            },
            {
                name: "摇曳露营△ SEASON2",
                page: "https://yurucamp.jp/news/",
                comment: "系列共用源"
            },
            {
                name: "悠哉日常大王 Nonstop",
                page: "https://nonnontv.com/tvanime/news/",
                comment: "系列共用源"
            },
            {
                name: "进击的巨人 The Final Season",
                page: "https://shingeki.tv/news/",
                comment: "系列共用源"
            },
            {
                name: "五等分的新娘∬",
                page: "https://www.tbs.co.jp/anime/5hanayome/news/"
            },
            {
                name: "约定的梦幻岛 2期",
                page: "https://neverland-anime.com/news/",
                comment: "系列共用源"
            },
            {
                name: "Dr.STONE STONE WARS",
                page: "https://dr-stone.jp/news/",
                comment: "系列共用源"
            },
            {
                name: "BEASTARS 2期",
                page: "https://bst-anime.com/",
                comment: "系列共用源"
            },
            {
                name: "七大罪 愤怒的审判",
                page: "https://7-taizai.net/news/",
                comment: "系列共用源"
            },
            {
                name: "境界触发者 2nd season",
                page: "http://www.toei-anim.co.jp/tv/wt/news/"
            },
            {
                name: "厨神小当家 第二期",
                page: "http://cookingmaster-anime.jp/news",
                comment: "系列共用源"
            },
            {
                name: "Re:从零开始的异世界生活 2nd season(后半)",
                page: "http://re-zero-anime.jp/tv/news/",
                comment: "系列共用源"
            },
            {
                name: "关于我转生变成史莱姆这档事 第2期第1部",
                page: "https://www.ten-sura.com/news/anime/",
                comment: "系列共用源"
            },
            {
                name: "赛马娘 Pretty Derby Season 2",
                page: "https://anime-umamusume.jp/news/"
            },
            {
                name: "我是蜘蛛又怎样?",
                page: "https://kumo-anime.com/news.html"
            },
            {
                name: "无职转生～到了异世界就拿出真本事～(前半)",
                page: "https://mushokutensei.jp/news/"
            },
            {
                name: "弱角友崎同学",
                page: "http://tomozaki-koushiki.com/news/"
            },
            {
                name: "魔术士欧菲流浪之旅 基姆拉克篇",
                page: "http://ssorphen-anime.com/news/"
            },
            {
                name: "里世界郊游",
                page: "https://www.othersidepicnic.com/news/"
            },
            {
                name: "SHOW BY ROCK!!STARS!!",
                page: "https://showbyrock-anime-m.com/news/",
                comment: "系列共用源"
            },
            {
                name: "VLAD LOVE",
                page: "https://www.vladlove.com/news.html"
            },
            {
                name: "WIXOSS DIVA(A)LIVE",
                page: "http://wixoss-diva.com/news/"
            },
            {
                name: "堀与宫村",
                page: "https://horimiya-anime.com/news/"
            },
            {
                name: "怪物事变",
                page: "https://kemonojihen-anime.com/news/"
            },
            {
                name: "EX-ARM",
                page: "https://www.exarm-anime.com/news/"
            },
            {
                name: "天空侵犯",
                page: "https://high-rise-invasion.com/news/"
            },
            {
                name: "B: The Beginning Succession",
                page: "http://www.b-animation.jp/news"
            },
            {
                name: "怪病医拉姆尼",
                page: "https://ramune-anime.com/news/"
            },
            {
                name: "天地创造设计部",
                page: "https://tendebu.jp/news/"
            },
            {
                name: "比方说，这是个出身魔王关附近的少年在新手村生活的故事",
                page: "https://lasdan.com/news/list00010000.html"
            },
            {
                name: "回复术士的重启人生",
                page: "http://kaiyari.com/news.html"
            },
            {
                name: "只有我能进入的隐藏迷宫",
                page: "https://kakushidungeon-anime.jp/news/index.html"
            },
            {
                name: "2.43 清阴高中男子排球社",
                page: "https://243anime.com/news/"
            },
            {
                name: "WONDER EGG PRIORITY",
                page: "https://wonder-egg-priority.com/news/"
            },
            {
                name: "BACK ARROW",
                page: "https://back-arrow.com/news/"
            },
            {
                name: "SK∞",
                page: "https://sk8-project.com/news/"
            },
            {
                name: "Skate-Leading☆Stars",
                page: "https://skateleadingstars.com/news/"
            },
            {
                name: "WAVE!!～来冲浪吧!!～",
                page: "https://wave-anime.com/"
            },
            {
                name: "IDOLY PRIDE",
                page: "https://anime.idolypride.jp/news/"
            },
            {
                name: "演剧偶像",
                page: "https://gekidol.com/news/"
            },
            {
                name: "偶像活动Planet!",
                page: "http://www.aikatsu.net/news/"
            },
            {
                name: "I★CHU 偶像进行曲",
                page: "https://etoile-anime.jp/news/"
            },
            {
                name: "苍之骑士团",
                page: "https://animehorsaga.jp/news/"
            },
            {
                name: "装甲娘战机",
                page: "http://soukou-musume-senki.com/news/"
            },
            {
                name: "重创的伤口",
                page: "https://project-scard.com/news/",
                comment: "PROJECT SCARD共用源"
            },
            {
                name: "IDOLLS!",
                page: "https://wsy-idolls.com/archives"
            },
            {
                name: "文豪野犬 汪!",
                page: "https://bungo-stray-dogs-wan.com/news/"
            },
            {
                name: "世界魔女出发!",
                page: "http://w-witch.jp/ww_takeoff/news/"
            },
            {
                name: "碧蓝航线 微速前行",
                page: "https://www.azurlane-bisoku.jp/news/"
            },
            {
                name: "八十龟观察日记 第3册",
                page: "https://yatogame.nagoya/news/",
                comment: "系列共用源"
            },
            {
                name: "突如其来埃及神",
                page: "https://to-to2ni-anime.jp/news/"
            },
            {
                name: "濒危物种。",
                page: "https://kigushun.com/news/"
            },
            {
                name: "大人的防具店II",
                page: "https://ganma.jp/g/anime/otonabougu/news.html",
                comment: "系列共用源"
            },
            {
                name: "幼女社长",
                page: "https://www.mujina-company.com/news.html"
            },
            {
                name: "暗芝居 8期",
                page: "https://www.tv-tokyo.co.jp/anime/yamishibai8/news/"
            },
            {
                name: "ABCiee修业日记",
                page: "https://abciee.abc-anime.co.jp/"
            },
            {
                name: "PUI PUI 天竺鼠车车",
                page: "https://molcar-anime.com/news/"
            },
            {
                name: "Puchimiku♪ D4DJ Petit Mix",
                page: "https://anime.d4dj-pj.com/petit-mix/"
            }
        ],
        skippedSources: [
            {
                name: "舞伎家的料理人",
                page: "https://www3.nhk.or.jp/nhkworld/maikosan/",
                reason: "不存在新闻页"
            },
            {
                name: "记录的地平线 圆桌崩坏",
                page: "https://www6.nhk.or.jp/anime/program/detail.html?i=loghorizon3",
                reason: "不存在新闻页"
            },
            {
                name: "金塔马尼犬",
                page: "https://kintamani-dog.com/",
                reason: "不存在新闻页"
            },
            {
                name: "俗女纯爱大作战",
                page: "https://jimihen.cf-anime.com/",
                reason: "R18不收录"
            }
        ]
    });

    return; // 待补完

    prepareSeason({
        id: "202101",
        schedule: "every_30m",
        maxCount: 20 * 59,
        rss: {
            "self": "https://rss.projectxero.top/bangumi/2021-01.xml",
            "icon": "https://rss.projectxero.top/bangumi/icon/2021-01.jpg",
            "title": "2021年冬季番剧新闻",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "https://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com",
        }
    });

    addSource({
        name: "工作细胞!!",
        guidPrefix: "hataraku-saibou",
        url: "https://hataraku-saibou.com/news_gekijou/",
        index: {
            id: "div.news_in section.news_item",
            title: "div.news_in div.news_item_title h3.title",
            date: "div.news_in div.news_item_title p.date",
            body: "div.news_in div.news_txt"
        }
    });

    addSource({
        name: "工作细胞BLACK",
        guidPrefix: "saibou-black",
        url: "https://saibou-black.com/news/",
        index: {
            title: "ul.news_list li p.ttl",
            date: "ul.news_list li p.date",
            url: ["ul.news_list li a", "https://saibou-black.com/news/{{url}}"]
        },
        description: {
            body: "div.news_detail_body"
        }
    });
}