/**
 * 2021年夏季番剧新闻
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
 module.exports = function(host) {
    const { prepareSeason, addSource, skipSource, stubSource, wip, dryRun, hideFromRss, testAndReport } = host;

    prepareSeason({
        id: "202107",
        name: "2021年夏季",
        schedule: "every_30m",
        status: "来源收录进行中",
        maxCount: 20 * 44,
        scenarioLink: "https://rss.projectxero.top/scenarios/22/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/2021-07.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2F2021-07.xml",
        rss: {
            "icon": "https://rss.projectxero.top/bangumi/icon/2021-07.jpg",
            "title": "2021年夏季番剧新闻",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "https://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com",
        }
    });

    addSource({
        name: "LoveLive!Superstar!!",
        guidPrefix: "llsuperstar",
        url: "https://www.lovelive-anime.jp/yuigaoka/news/",
        index: {
            url: ["ul.listbox>li>div>a", "{{ url | to_uri: 'https://www.lovelive-anime.jp/yuigaoka/news/' }}"],
            idTemplate: "{{url}}",
            title: "ul.listbox>li>div>a>p.title",
            date: "ul.listbox>li>div>a>p.date",
        },
        description: {
            body: "div.txt"
        }
    });
    
    addSource({
        name: "寒蝉鸣泣之时(第2作)",
        guidPrefix: "higurashianime",
        season: "202010",
        comment: "系列共用源：寒蝉鸣泣之时 卒",
        url: "https://higurashianime.com/news.html",
        index: {
            url: ["div.newsPaging article a.title_link", "https://higurashianime.com/{{url}}"],
            idTemplate: "{{url}}",
            title: "div.newsPaging article div.title",
            date: [{
                year: "div.newsPaging article div.year",
                day: "div.newsPaging article div.day"
            }, "{{year}}.{{day}}"]
        },
        getExtractor: function(url) {
            if (url.startsWith("https://higurashianime.com/news/")) {
                return { bodySelector: "div.kiji_wrap" };
            }
        }
    });
    
    addSource({
        name: "小林家的龙女仆",
        guidPrefix: "maidragon",
        season: "201701",
        comment: "系列共用源：小林家的龙女仆S",
        url: "https://maidragon.jp/news/",
        index: {
            url: ["section.news-list article.c-news-item a.c-news-item__link", "https://maidragon.jp{{url}}"],
            idTemplate: "{{url}}",
            title: "section.news-list article.c-news-item span.c-news-item__title",
            date: "section.news-list article.c-news-item span.c-news-item__date"
        },
        description: {
            body: "section.c-article-body"
        }
    });
    
    addSource({
        name: "魔法纪录 魔法少女小圆外传",
        guidPrefix: "magireco",
        season: "202001",
        comment: "系列共用源：魔法纪录 魔法少女小圆外传 2nd SEASON -觉醒前夜-",
        url: "https://anime.magireco.com/news/",
        index: {
            url: ["div.news_list>ul li>a", "{{ url | to_uri: 'https://anime.magireco.com/news/' }}"],
            idTemplate: "{{url}}",
            title: "div.news_list>ul li p.news_ttl",
            date: "div.news_list>ul li p.news_date"
        },
        description: {
            body: "div.news_text"
        }
    });
    
    addSource({
        name: "桃子男孩渡海而来",
        guidPrefix: "peachboyriverside",
        url: "https://peachboyriverside.com/news/",
        index: {
            url: "ul.md--articleblock li a.linkwrap",
            idTemplate: "{{url}}",
            title: "ul.md--articleblock li h4.ttl",
            date: "ul.md--articleblock li div.inner>dl>dt>h3"
        },
        description: {
            body: "main.md--articlewrap--main"
        }
    });
    
    addSource({
        name: "平稳世代的韦驮天们",
        url: "https://news.noitamina.tv/idaten/",
        guidPrefix: "idaten",
        index: {
            url: "ul.modListNews li>a",
            idTemplate: "{{url}}",
            title: "ul.modListNews li>a>div.unitText>h3",
            date: "ul.modListNews li>a>p.date>time"
        },
        description: {
            body: "article.modArticle"
        }
    });
    
    addSource({
        name: "关于我转生变成史莱姆这档事",
        season: "201810",
        includedSeasons: [ "202101", "202104" ],
        comment: "系列共用源：关于我转生变成史莱姆这档事 第2期第2部",
        url: "https://www.ten-sura.com/news/anime/",
        guidPrefix: "tensura",
        index: {
            url: "div.news-list a.news-list-item-link",
            idTemplate: "{{url}}",
            title: "div.news-list h3.title",
            date: { css: "div.news-list time", value: "@datetime" }
        },
        description: {
            body: "div.main-content-body"
        }
    });
    
    addSource({
        name: "白沙的水族馆",
        url: "https://aquatope-anime.com/news/",
        guidPrefix: "aquatope",
        index: {
            url: "div.news--main__lineup article.md-archive__news>a.linkwrap",
            idTemplate: "{{url}}",
            title: "div.news--main__lineup article.md-archive__news>div.txt>h3.txt--ttl",
            date: "div.news--main__lineup article.md-archive__news>div.txt>time.txt--date"
        },
        description: {
            body: "main.md-article__cont--main"
        }
    });
    
    addSource({
        name: "漂流少年",
        url: "https://anime.shochiku.co.jp/sonny-boy/news.html",
        guidPrefix: "sonny_boy",
        index: {
            id: "div.news-area>div[id]",
            title: "div.news-area>div.news-contents>div.news-title",
            date: [
                "div.news-area>div.news-contents>div.news-date",
                "{{ date | regex_replace: '(\\d+)年(\\d+)月(\\d+)日', '\\1.\\2.\\3' }}"
            ],
            body: "div.news-area>div.news-contents>div.news-tex"
        }
    });
    
    addSource({
        name: "盖塔机器人 ARC",
        url: "https://getterrobot-arc.com/news/",
        guidPrefix: "getterrobot_arc",
        index: {
            id: "div.article>p.kiji-box-margin",
            title: "div.article>section.kiji-box>h2",
            date: "div.article>section.kiji-box>p.kiji-date",
            body: "div.article>section.kiji-box div.kiji-txt"
        }
    });
    
    addSource({
        name: "范马刃牙",
        url: "https://baki-anime.jp/hb/news",
        guidPrefix: "bakihanma",
        index: {
            url: "div.arch-news-list>ul>li>a",
            idTemplate: "{{url}}",
            title: "div.arch-news-list>ul>li>a>p.arch-news-ttl",
            date: "div.arch-news-list>ul>li>a>p.arch-news-date"
        },
        description: {
            body: "div.sgl-news-txt"
        }
    });
    
    addSource({
        name: "魔法科高中的优等生",
        url: "https://mahouka-yuutousei.jp/news/",
        guidPrefix: "mahouka_yuutousei",
        index: {
            url: [
                "ul.p-news__list li.p-news__list-item a.p-news_data",
                "https://mahouka-yuutousei.jp{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "ul.p-news__list li.p-news__list-item div.p-news_data__title",
            date: [
                {
                    year: "ul.p-news__list li.p-news__list-item div.p-news_data__date-year",
                    month: "ul.p-news__list li.p-news__list-item div.p-news_data__date-month",
                    day: "ul.p-news__list li.p-news__list-item div.p-news_data__date-day"
                },
                "{{year}}.{{month}}.{{day}}"
            ]
        },
        description: {
            body: "div.p-news_single__text"
        }
    });
    
    addSource({
        name: "死神少爷与黑女仆",
        url: "https://bocchan-anime.com/news/",
        guidPrefix: "bocchan",
        index: {
            url: [
                "div#list_01>table tr div.title a",
                "{{ url | to_uri: 'https://bocchan-anime.com/news/' }}"
            ],
            idTemplate: "{{url}}",
            title: "div#list_01>table tr div.title a",
            date: "div#list_01>table tr td.day"
        },
        getExtractor: function(url) {
            if (url.startsWith("https://bocchan-anime.com/news/")) {
                return { bodySelector: "div#news_block>div:first-of-type" };
            }
        }
    });
    
    addSource({
        name: "阴晴不定大哥哥",
        url: "http://uramichi-anime.com/news/",
        guidPrefix: "uramichi",
        index: {
            id: "div#news>article",
            title: "div#news>article>div.title>h3",
            date: "div#news>article>div.title>time",
            body: "div#news>article>div.detail"
        }
    });
    
    addSource({
        name: "女友成双",
        url: "https://kanokano-anime.com/news/",
        guidPrefix: "kanokano",
        index: {
            url: [
                "div.news-lineup article.news-lineup__block>a",
                "https://kanokano-anime.com{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "div.news-lineup article.news-lineup__block>dl>dd>h2",
            date: "div.news-lineup article.news-lineup__block>dl>dt"
        },
        description: {
            body: "div.news-detail-body"
        }
    });
    
    addSource({
        name: "女神宿舍的管理员",
        url: "https://megamiryou.com/news/",
        guidPrefix: "megamiryou",
        index: {
            url: [
                "div#list_01>table tr div.title a",
                "{{ url | to_uri: 'https://megamiryou.com/news/' }}"
            ],
            idTemplate: "{{url}}",
            title: "div#list_01>table tr div.title a",
            date: "div#list_01>table tr td.day"
        },
        getExtractor: function(url) {
            if (url.startsWith("https://megamiryou.com/news/")) {
                return { bodySelector: "div#news_block>div:first-of-type" };
            }
        }
    });
    
    stubSource({
        name: "月光下的异世界之旅",
        page: "https://tsukimichi.com/news/"
    });
    
    stubSource({
        name: "RE-MAIN",
        page: "https://re-main.net/news/"
    });
    
    stubSource({
        name: "歌剧少女!!",
        page: "https://kageki-anime.com/news/"
    });
    
    stubSource({
        name: "瓦尼塔斯的手记",
        comment: "系列共用源：瓦尼塔斯的手记(前半)",
        page: "https://vanitas-anime.com/news/"
    });
    
    stubSource({
        name: "贾希大人不气馁",
        page: "https://jahysama-anime.com/news/"
    });
    
    stubSource({
        name: "见面5秒开始战斗",
        page: "https://dea5-anime.com/news"
    });
    
    stubSource({
        name: "异世界迷宫黑心企业",
        page: "https://meikyubc-anime.com/"
    });
    
    stubSource({
        name: "我立于百万生命之上",
        comment: "系列共用源：我立于百万生命之上 第2季",
        page: ""
    });
    
    stubSource({
        name: "NIGHT HEAD 2041",
        page: "https://nighthead2041.jp/news/"
    });
    
    stubSource({
        name: "转生成为了只有乙女游戏破灭Flag的邪恶大小姐X",
        page: "https://hamehura-anime.com/news/"
    });
    
    stubSource({
        name: "精灵幻想记",
        page: "https://seireigensouki.com/news-list/"
    });
    
    stubSource({
        name: "现实主义勇者的王国再建记",
        page: "https://genkoku-anime.com/news/"
    });
    
    stubSource({
        name: "我们的重制人生",
        page: "https://bokurema.com/news/"
    });
    
    stubSource({
        name: "侦探已经死了",
        page: "https://tanmoshi-anime.jp/news/" // getExtractor
    });
    
    stubSource({
        name: "开挂药师的异世界悠闲生活～在异世界开药店吧～",
        page: "https://www.cheat-kusushi.jp/"
    });
    
    skipSource({
        name: "生化危机 无尽暗黑",
        page: "https://www.netflix.com/title/80987064",
        reason: "无新闻网页"
    });
    
    stubSource({
        name: "绯红结系",
        page: "https://snx-anime.net/news/"
    });
    
    stubSource({
        name: "D_CIDE TRAUMEREI",
        page: "https://dctm-pj.com/news/"
    });
    
    skipSource({
        name: "Obey Me!",
        page: "https://shallwedate.jp/obeyme/",
        reason: "无新闻网页"
    });
    
    stubSource({
        name: "IDOLiSH7",
        season: "201801",
        page: "https://idolish7.com/aninana/news/",
        comment: "系列共用源：IDOLiSH7 Third BEAT! Part.1"
    });
    
    stubSource({
        name: "TSUKIPRO THE ANIMATION 2",
        page: "https://tsukipro-anime.com/news/"
    });
    
    stubSource({
        name: "我，小怼",
        page: "https://tsushima-anime.com/news/"
    });
    
    skipSource({
        name: "暗黑家族 笑美小姐",
        page: "https://smash-media.jp/channels/147",
        reason: "无新闻网页"
    });
    
    stubSource({
        name: "暗芝居 第9期",
        page: "https://www.tv-tokyo.co.jp/anime/yamishibai9/news/"
    });

    addSource({
        name: "卡片战斗先导者 overDress",
        season: "202104",
        includedSeasons: [ "202104" ],
        comment: "系列共用源：Mini卡片战斗先导者 Large",
        guidPrefix: "cf_vanguard_overdress",
        url: "https://anime.cf-vanguard.com/overdress/news/",
        index: {
            url: "div.nws-List article>a",
            idTemplate: "{{url}}",
            title: "div.nws-List article p.title",
            date: "div.nws-List article span.date"
        },
        description: {
            body: "div.body"
        }
    });
    
    skipSource({
        name: "指尖传出的真挚热情2-恋人是消防员-",
        page: "https://yubinetsu.cf-anime.com/",
        reason: "R18不收录"
    });
    
    stubSource({
        name: "加油啊同期酱",
        page: "https://doukichan-anime.com/news/list00010000.html"
    });

    stubSource({
        name: "星期一的丰满2",
        page: "https://tawawa2-anime.com/news/list00010000.html"
    });
    
    /*
    stubSource({
        name: "百万吨级武藏",
        page: "",
        comment: "？"
    });
    
    stubSource({
        name: "偶像乐园 美妙天堂",
        page: "https://pripara.jp/idolland/"
    });
    
    stubSource({
        name: "Assault Lily",
        season: "202010",
        page: "https://assaultlily-pj.com/news/",
        comment: "系列共用源：Assault Lily Fruits"
    });
    
    skipSource({
        name: "暗黑家族 蕨小姐",
        page: "https://smash-media.jp/channels/147",
        reason: "无新闻网页"
    });
    */
}