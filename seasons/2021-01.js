/**
 * 2021年冬季番剧新闻
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
module.exports = function (host) {
    const {
        prepareSeason,
        addSource,
        skipSource,
        stubSource,
        wip,
        dryRun,
        hideFromRss,
        testAndReport
    } = host;

    prepareSeason({
        id: "202101",
        name: "2021年冬季",
        schedule: "1am",
        status: "来源收录已完成",
        maxCount: 20 * 64,
        scenarioLink: "https://rss.projectxero.top/scenarios/6/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/2021-01.xml",
        viewerLink:
            "https://rss.projectxero.top/view/?src=bangumi%2F2021-01.xml",
        rss: {
            self: "https://rss.projectxero.top/bangumi/2021-01.xml",
            icon: "https://rss.projectxero.top/bangumi/icon/2021-01.jpg",
            title: "2021年冬季番剧新闻",
            description: "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            link: "https://rss.projectxero.top",
            copyright: "内容版权归原网站所有",
            webMaster: "projectxero@163.com"
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
            url: ["ul.news_list li a", "https://saibou-black.com/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul.news_list li p.ttl",
            date: "ul.news_list li p.date"
        },
        description: {
            body: "div.news_detail_body"
        }
    });

    addSource({
        name: "摇曳露营△",
        season: "201801",
        comment: "系列共用源：摇曳露营△ SEASON2",
        guidPrefix: "yuricamp",
        url: "https://yurucamp.jp/news/",
        index: {
            url: "ul#articleList>li>a",
            idTemplate: "{{url}}",
            title: "ul#articleList p.articleTitle",
            date: "ul#articleList p.articleTime"
        },
        description: {
            body: "div.articlein"
        }
    });

    addSource({
        name: "悠哉日常大王",
        season: "201310",
        comment: "系列共用源：悠哉日常大王 Nonstop",
        guidPrefix: "nonnontv",
        url: "https://nonnontv.com/tvanime/news/",
        index: {
            url: [
                "div.c-inner article.news__archive>a",
                "https://nonnontv.com/{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "div.c-inner article.news__archive h3.news__archive__ttl",
            date: "div.c-inner article.news__archive li.news__archive__date"
        },
        description: {
            body: "div.news__single＿_cont" // 某种意义上的反爬，注意single后面的短划线
        }
    });

    addSource({
        name: "进击的巨人",
        season: "201304",
        comment: "系列共用源：进击的巨人 The Final Season",
        guidPrefix: "shingeki",
        url: "https://shingeki.tv/news/",
        index: {
            url: [
                "section.c-entry-list a.c-entry-item__link",
                "https://shingeki.tv{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "section.c-entry-list h1.c-entry-item__title",
            date: [
                {
                    year: "section.c-entry-list span.c-entry-date__year",
                    day: "section.c-entry-list span.c-entry-date__day"
                },
                "{{year}}.{{day}}"
            ]
        },
        description: {
            body: "div.c-entry-body"
        }
    });

    addSource({
        name: "五等分的新娘∬",
        guidPrefix: "5hanayome",
        url: "https://www.tbs.co.jp/anime/5hanayome/2nd/news/",
        index: {
            url: [
                "div.newsall-wrap dd.newsall-text>a",
                "https://www.tbs.co.jp/anime/5hanayome/2nd/news/{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "div.newsall-wrap dd.newsall-text>a",
            date: "div.newsall-wrap dt.newsall-date"
        },
        getExtractor: function (url) {
            if (
                url.startsWith(
                    "https://www.tbs.co.jp/anime/5hanayome/2nd/news/news"
                )
            ) {
                return {
                    bodySelector: "div.news-block"
                };
            }
        }
    });

    addSource({
        name: "约定的梦幻岛",
        season: "201901",
        comment: "系列共用源：约定的梦幻岛 Season2",
        url: "https://neverland-anime.com/news/",
        guidPrefix: "neverland",
        index: {
            url: [
                "ul.p-news__list a.c-article__link",
                "https://neverland-anime.com{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "ul.p-news__list div.c-article__title"
        },
        description: {
            date: "div.p-news_single__date",
            body: "div.p-news_single__text"
        }
    });

    addSource({
        name: "石纪元",
        season: "201907",
        comment: "系列共用源：Dr.STONE STONE WARS",
        guidPrefix: "drstone",
        url: "https://dr-stone.jp/news/",
        index: {
            url: "ul.newsarea_body_list>li.newsarea_body_list_item>div.l_news>a.news",
            idTemplate: "{{url}}",
            title: "ul.newsarea_body_list div.news_body p",
            date: "ul.newsarea_body_list div.news_body_date"
        },
        description: {
            body: "div.newsdetail_body_main"
        }
    });

    addSource({
        name: "BEASTARS",
        season: "201910",
        comment: "系列共用源：BEASTARS 2期",
        url: "https://bst-anime.com/",
        guidPrefix: "beastars",
        index: {
            urlTemplate: "https://bst-anime.com/#{{title}}",
            idTemplate: "{{title}}",
            title: "section#news div.newsTitle h3",
            date: "section#news div.newsTitle span.pk",
            body: "section#news article.article, section#news article.last_article"
        }
    });

    addSource({
        name: "七大罪",
        season: "201410",
        comment: "系列共用源：七大罪 愤怒的审判",
        url: "https://7-taizai.net/news/",
        guidPrefix: "7taizai",
        index: {
            url: "ul#articleLists>li>a",
            idTemplate: "{{url}}",
            title: "ul#articleLists>li p.title",
            date: "ul#articleLists>li time"
        },
        description: {
            body: "div.articlein"
        }
    });

    addSource({
        name: "境界触发者 2nd season",
        url: "http://www.toei-anim.co.jp/tv/wt/news/",
        guidPrefix: "worldtrig2nd",
        index: {
            url: [
                "ul.news-page-list>li a",
                "http://www.toei-anim.co.jp{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "ul.news-page-list>li div.txt",
            date: "ul.news-page-list>li div.date"
        },
        description: {
            body: "section.news-page>article"
        }
    });

    addSource({
        name: "厨神小当家",
        season: "201910",
        comment: "系列共用源：厨神小当家 第二期",
        url: "http://cookingmaster-anime.jp/news",
        guidPrefix: "cookingmaster",
        index: {
            url: "div.news-list>article.news-list__post>a",
            idTemplate: "{{url}}",
            title: "div.news-list div.news-list__ttl>p:nth-of-type(1)",
            date: "div.news-list div.news-list__ttl time"
        },
        description: {
            body: "div.cnt"
        }
    });

    addSource({
        name: "Tropical-Rouge!光之美少女",
        season: "202104",
        guidPrefix: "precure",
        url: "https://www.toei-anim.co.jp/tv/precure/news/",
        index: {
            url: "ul.m-list-topics li .topics-link",
            title: "ul.m-list-topics li .topics-link>dl>dd",
            dateAndCategory: "ul.m-list-topics li .topics-link>dl>dt",
            category: "ul.m-list-topics li .topics-link>dl>dt>span.link-cat"
        },
        getExtractor: function(url, payload) {
            /**
             * @type { import("../lib/loaderHost").ExtractorGeneratorResult }
             */
            let result = { id: url };
            result.date = payload.dateAndCategory.replace(payload.category, "");
            if (url.startsWith("/tv/precure/news/")) {
                result.url = "https://www.toei-anim.co.jp" + url;
                result.bodySelector = "div.m-box-entry";
            } else if (url.startsWith("http")) {
                result.url = url;
            } else if (url != "") {
                result.url = "https://www.toei-anim.co.jp" + url;
            } else {
                result.id = payload.title;
                result.url = "https://www.toei-anim.co.jp/tv/precure/news/#" + encodeURIComponent(payload.title);
            }
            return result;
        }
    });

    addSource({
        name: "Re:从零开始的异世界生活",
        season: "202001",
        comment: "系列共用源：Re:从零开始的异世界生活 2nd season(后半)",
        url: "http://re-zero-anime.jp/tv/news/",
        guidPrefix: "re0new",
        index: {
            id: "div#Entries section.content-entry",
            urlTemplate: "http://re-zero-anime.jp/tv/news/#{{id}}",
            title: "div#Entries div.entry-title",
            date: "div#Entries div.entry-date",
            body: "div#Entries div.entry-body"
        }
    });

    addSource({
        name: "关于我转生变成史莱姆这档事",
        season: "201810",
        comment: "系列共用源：关于我转生变成史莱姆这档事 第2期第1部",
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

    skipSource({
        name: "记录的地平线 圆桌崩坏",
        page: "https://www6.nhk.or.jp/anime/program/detail.html?i=loghorizon3",
        reason: "不存在新闻页"
    });

    addSource({
        name: "赛马娘 Pretty Derby Season 2",
        url: "https://anime-umamusume.jp/news/",
        guidPrefix: "umamusume2",
        index: {
            url: [
                "ul.news__list>li>a",
                "https://anime-umamusume.jp/news/{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "ul.news__list div.news-text div.info",
            date: "ul.news__list div.news-text time"
        },
        description: {
            body: "div.news__contents"
        }
    });

    addSource({
        name: "我是蜘蛛，怎么了？",
        comment: "别名：我是蜘蛛又怎样？",
        url: "https://kumo-anime.com/news.html",
        guidPrefix: "kumo",
        index: {
            id: "div#Entries article.content-entry",
            urlTemplate: "https://kumo-anime.com/news.html#{{id}}",
            title: "div#Entries article.content-entry>h2.entry-title:nth-of-type(1)",
            date: "div#Entries div.entry-date>span",
            body: "div#Entries article.content-entry>div.entry-body:nth-of-type(1)"
        }
    });

    addSource({
        name: "无职转生～到了异世界就拿出真本事～",
        comment: "系列共用源：无职转生～到了异世界就拿出真本事～(前半)",
        url: "https://mushokutensei.jp/news/",
        guidPrefix: "mushokutensei",
        index: {
            url: "ul.l_news a.news",
            idTemplate: "{{url}}",
            title: "ul.l_news div.news_ttl",
            date: "ul.l_news div.news_date"
        },
        description: {
            body: "div.newsdetail_txt"
        }
    });

    addSource({
        name: "弱角友崎同学",
        url: "http://tomozaki-koushiki.com/news/",
        guidPrefix: "tomozaki",
        index: {
            urlTemplate: "http://tomozaki-koushiki.com/news/#{{title}}",
            idTemplate: "{{title}}",
            title: "div.boxWrap h3.box_title",
            date: "div.boxWrap p.date>time",
            body: "div.boxWrap div.box_txt"
        }
    });

    addSource({
        name: "魔术士欧菲流浪之旅", // 需要 getExtractor，如果存在第三期请加上
        season: "202001",
        comment: "系列公用源：魔术士欧菲流浪之旅 基姆拉克篇",
        url: "http://ssorphen-anime.com/news/",
        guidPrefix: "ssorphen",
        index: {
            url: [
                "div#list_01>table tr a",
                "{{ url | to_uri: 'http://ssorphen-anime.com/news/' }}"
            ],
            idTemplate: "{{url}}",
            title: "div#list_01>table tr a",
            date: "div#list_01>table tr td.day"
        },
        description: {
            body: "div#news_block>div"
        }
    });

    addSource({
        name: "里世界郊游",
        url: "https://www.othersidepicnic.com/news/",
        guidPrefix: "othersidepicnic",
        index: {
            url: "div.news_inner>dl>dd>a",
            idTemplate: "{{url}}",
            title: "div.news_inner>dl>dd>a",
            date: "div.news_inner>dl>dt"
        },
        description: {
            body: "div.newsText"
        }
    });

    addSource({
        name: "SHOW BY ROCK!!",
        season: "202001",
        comment: "系列共用源：SHOW BY ROCK!!STARS!!",
        url: "https://showbyrock-anime-m.com/news/",
        guidPrefix: "showbyrock",
        index: {
            url: "ul#newsList>li>a",
            idTemplate: "{{url}}",
            title: "ul#newsList p.articleTitle",
            date: "ul#newsList p.articleTime"
        },
        description: {
            body: "div.articlein"
        }
    });

    addSource({
        name: "VLAD LOVE",
        url: "https://www.vladlove.com/news.html",
        guidPrefix: "vladlove",
        index: {
            id: "ul.newsDetailList>li",
            urlTemplate: "https://www.vladlove.com/news.html#{{id}}",
            title: "ul.newsDetailList>li div.ttl",
            date: "ul.newsDetailList>li div.date",
            body: "ul.newsDetailList>li div.desp"
        }
    });

    addSource({
        name: "WIXOSS DIVA(A)LIVE",
        url: "http://wixoss-diva.com/news/",
        guidPrefix: "wixossdiva",
        index: {
            url: [
                "div#list_01 td.read div.title a",
                "{{ url | to_uri: 'http://wixoss-diva.com/news/' }}"
            ],
            idTemplate: "{{url}}",
            title: "div#list_01 td.read div.title a",
            date: "div#list_01 td.day"
        },
        urlInIndex: true,
        merge: {
            description: "请在浏览器里打开"
        }
    });

    addSource({
        name: "堀与宫村",
        url: "https://horimiya-anime.com/news/",
        guidPrefix: "horimiya",
        index: {
            url: [
                "ul.c-common-list a.c-common-list__link",
                "https://horimiya-anime.com{{url}}"
            ],
            id: "ul.c-common-list>li.c-common-list__item",
            title: "ul.c-common-list div.c-common-list__title",
            date: "ul.c-common-list div.c-common-list__date"
        },
        description: {
            body: "div.c-article__body"
        }
    });

    addSource({
        name: "怪物事变",
        url: "https://kemonojihen-anime.com/news/",
        guidPrefix: "kemonojihen",
        index: {
            url: [
                "section.news-list article.news-item a.news-item__link",
                "https://kemonojihen-anime.com{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "section.news-list article.news-item span.news-item__title",
            date: [
                {
                    year: "section.news-list article.news-item span.c-article-date__year",
                    day: "section.news-list article.news-item span.c-article-date__day"
                },
                "{{year}}.{{day}}"
            ]
        },
        description: {
            body: "div.c-article-body"
        }
    });

    addSource({
        name: "EX-ARM",
        url: "https://www.exarm-anime.com/news/",
        guidPrefix: "exarm",
        index: {
            url: { css: "ul#newsList>li", value: "./a/@href" }, // a 不一定存在,
            item: "ul#newsList>li"
        },
        merge: function (payload) {
            var match = payload.item.match(/^([\d.]+)\s+(\S.+)/);
            return {
                link: "https://www.exarm-anime.com" + (payload.url || ""),
                title: match[2],
                date: match[1],
                description: "请在浏览器里打开",
                guid: "202101_exarm#" + match[2],
                category: "EX-ARM"
            };
        }
    });

    addSource({
        name: "天空侵犯",
        url: "https://high-rise-invasion.com/news/",
        guidPrefix: "highriseinvasion",
        index: {
            url: [
                "ul.p-news__list a.p-news__item-link",
                "https://high-rise-invasion.com{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "ul.p-news__list div.p-news__item-title",
            date: "ul.p-news__list div.p-news__item-date"
        },
        description: {
            body: "div.c-article__body"
        }
    });

    addSource({
        name: "B: The Beginning",
        season: "201803",
        comment: "系列共用源：B: The Beginning Succession",
        url: "http://www.b-animation.jp/news",
        guidPrefix: "banimation",
        index: {
            title: "article.main>section>h2:nth-of-type(1)",
            idTemplate: "{{title}}",
            date: [
                "article.main>section>time",
                "{{ date | regex_replace: '(\\d+)年(\\d+)月(\\d+)日', '\\1.\\2.\\3' }}"
            ],
            body: "article.main>section"
        }
    });

    addSource({
        name: "怪病医拉姆尼",
        url: "https://ramune-anime.com/news/",
        guidPrefix: "ramune",
        index: {
            id: "div#news>article",
            urlTemplate: "https://ramune-anime.com/news/#{{id}}",
            title: "div#news>article>div.title>h3",
            date: "div#news>article>div.title>time",
            body: "div#news>article>div.detail"
        }
    });

    addSource({
        name: "天地创造设计部",
        url: "https://tendebu.jp/news/",
        guidPrefix: "tendebu",
        index: {
            url: [
                "ul.newsList a.newsList__list--link",
                "https://tendebu.jp/news/{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "ul.newsList p.newsList__list--title",
            date: "ul.newsList time.newsList__list--time"
        },
        description: {
            body: "div.news__detail"
        }
    });

    skipSource({
        name: "舞伎家的料理人",
        page: "https://www3.nhk.or.jp/nhkworld/maikosan/",
        reason: "不存在新闻页"
    });

    addSource({
        name: "比方说，这是个出身魔王关附近的少年在新手村生活的故事",
        comment: "别名：好比是最终迷宫前的少年到新手村生活一般的故事",
        url: "https://lasdan.com/news/list00010000.html",
        guidPrefix: "lasdan",
        index: {
            url: "div#list_01>table td.read>div.title a",
            idTemplate: "{{url}}",
            title: "div#list_01>table td.read>div.title a",
            date: "div#list_01>table td.day"
        },
        getExtractor: function (url) {
            let bodySelector, bodyXPath;
            if (url.match(/^\.\.\/news\//) || url.match(/^\.\.\/test_news\//)) {
                bodySelector = "div#news_block>div";
                bodyXPath = "./node()";
            } else if (url.match(/^\.\.\/special\//)) {
                bodySelector = "div#cms_block>div";
                bodyXPath = "./node()";
            }
            return {
                url: url.startsWith("../")
                    ? "https://lasdan.com/" + url.slice(3)
                    : url,
                bodySelector,
                bodyXPath
            };
        }
    });

    addSource({
        name: "回复术士的重启人生",
        url: "http://kaiyari.com/news.html",
        guidPrefix: "kaiyari",
        index: {
            id: "div#Entries article.content-entry",
            urlTemplate: "http://kaiyari.com/news.html#{{id}}",
            title: "div#Entries h2.entry-title>span",
            date: "div#Entries  div.entry-date>span",
            body: "div#Entries div.entry-body"
        }
    });

    addSource({
        name: "只有我能进入的隐藏迷宫",
        url: "https://kakushidungeon-anime.jp/news/index.html",
        guidPrefix: "kakushidungeon",
        index: {
            id: "div#Entries article.content-entry",
            urlTemplate:
                "https://kakushidungeon-anime.jp/news/index.html#{{id}}",
            title: "div#Entries h2.entry-title>span",
            date: "div#Entries  div.entry-date>span",
            body: "div#Entries div.entry-body"
        }
    });

    addSource({
        name: "2.43 清阴高中男子排球社",
        url: "https://243anime.com/news/",
        guidPrefix: "243anime",
        index: {
            url: "div.news-lineup article.news-lineup__block>a",
            idTemplate: "{{url}}",
            title: "div.news-lineup article.news-lineup__block dd",
            date: "div.news-lineup article.news-lineup__block dt"
        },
        description: {
            body: "div.md-poststyle__main"
        }
    });

    addSource({
        name: "WONDER EGG PRIORITY",
        url: "https://wonder-egg-priority.com/news/",
        guidPrefix: "wondereggpriority",
        index: {
            url: [
                "div.archives__main article.archives__item>a",
                "https://wonder-egg-priority.com/news/{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "div.archives__main article.archives__item h2.archives__item__title",
            date: "div.archives__main article.archives__item p.archives__item__date"
        },
        description: {
            body: "div.single__body"
        }
    });

    addSource({
        name: "BACK ARROW",
        url: "https://back-arrow.com/news/",
        guidPrefix: "backarrow",
        index: {
            url: [
                "ul.p-news_list li.p-news_list__item a.c-article__link",
                "https://back-arrow.com{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "ul.p-news_list li.p-news_list__item div.c-article__title",
            date: "ul.p-news_list li.p-news_list__item div.c-article__date"
        },
        description: {
            body: "div.p-single__text"
        }
    });

    addSource({
        name: "SK∞",
        url: "https://sk8-project.com/news/",
        guidPrefix: "sk8",
        index: {
            url: "ul.c-list li.c-list__item>a",
            idTemplate: "{{url}}",
            title: "ul.c-list li.c-list__item>div.c-list__title",
            date: "ul.c-list li.c-list__item>p.c-list__date>span"
        },
        description: {
            body: "div.p-news_article__txt"
        }
    });

    addSource({
        name: "Skate-Leading☆Stars",
        url: "https://skateleadingstars.com/news/",
        guidPrefix: "skateleadingstars",
        index: {
            url: "ul.p-news__card li.p-news__card__item>a",
            idTemplate: "{{url}}",
            title: "ul.p-news__card li.p-news__card__item p.p-news__card__txt",
            date: "ul.p-news__card li.p-news__card__item p.p-news__card__date"
        },
        description: {
            body: "div.p-news__article__txtArea"
        }
    });

    addSource({
        name: "WAVE!!～来冲浪吧!!～",
        url: "https://wave-anime.com/news/",
        guidPrefix: "waveanime",
        index: {
            url: [
                "div#news-list-container article.news-box a.news-link",
                "https://wave-anime.com{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "div#news-list-container article.news-box h4.news-ttl",
            date: "div#news-list-container article.news-box time.news-date"
        },
        description: {
            body: "div#news-detail-contents"
        }
    });

    addSource({
        name: "IDOLY PRIDE",
        url: "https://anime.idolypride.jp/news/",
        guidPrefix: "idolypride",
        index: {
            url: [
                "div#listsDetails>ul>li>p>a",
                "https://anime.idolypride.jp{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "div#listsDetails>ul>li>p>a>span.lists__details__title>span",
            date: "div#listsDetails>ul>li>p>a>span.lists__details__date>span"
        },
        description: {
            body: "div.detail__content"
        }
    });

    addSource({
        name: "演剧偶像",
        url: "https://gekidol.com/news/",
        guidPrefix: "gekidol",
        index: {
            id: "div#main_inner section.box",
            title: "div#main_inner section.box h3.ttl",
            date: "div#main_inner section.box p.date>time",
            body: "div#main_inner section.box div.txt"
        }
    });

    addSource({
        name: "偶像活动Planet!",
        url: "http://www.aikatsu.net/news/",
        guidPrefix: "aikatsu",
        index: {
            id: "div.sub-main>article div.main-frame",
            title: "div.sub-main>article div.main-frame li.main-title",
            date: "div.sub-main>article div.main-frame li.main-date",
            body: "div.sub-main>article div.main-frame li.main-text"
        }
    });

    addSource({
        name: "I★CHU 偶像进行曲",
        page: "https://etoile-anime.jp/news/",
        url: "https://www.etoile-anime-news.com/etoile-anime/",
        guidPrefix: "etoile",
        indexFormat: "json",
        index: {
            id: "$[*].id",
            urlTemplate: "https://etoile-anime.jp/news/detail/?news_id={{id}}",
            title: "$[*].title",
            date: "$[*].date",
            thumb: "$[*].thumb",
            body: "$[*].text"
        },
        urlInIndex: true,
        merge: {
            description:
                '{% if thumb %}<img src="{{ thumb | url_encode }}" />{% endif %}{{body}}'
        }
    });

    addSource({
        name: "苍之骑士团",
        url: "https://animehorsaga.jp/news/",
        guidPrefix: "horsaga",
        index: {
            id: "ul.p-news__list li.p-news__listItem",
            url: [
                "ul.p-news__list li.p-news__listItem a.p-news__listItem-link",
                "https://animehorsaga.jp/news/{{url}}"
            ],
            title: "ul.p-news__list li.p-news__listItem p.p-news__listItem-ttl",
            date: "ul.p-news__list li.p-news__listItem p.p-news__listItem-date"
        },
        description: {
            body: "div.p-news__article-text"
        }
    });

    addSource({
        name: "装甲娘战机",
        url: "http://soukou-musume-senki.com/news/",
        guidPrefix: "soukoumusumesenki",
        index: {
            url: "ul.l_newslist>li>a.newslist",
            idTemplate: "{{url}}",
            title: "ul.l_newslist>li div.newslist_ttl",
            date: "ul.l_newslist>li div.newslist_date"
        },
        description: {
            body: "div.newsdetail_inner_body"
        },
        merge: {
            date: "{{ date | regex_replace: '(\\d+\\.\\d+\\.\\d+).+', '\\1' }}"
        }
    });

    addSource({
        name: "PROJECT SCARD",
        comment: "系列共用源：重创的伤口",
        url: "https://project-scard.com/news/",
        guidPrefix: "prjscard",
        index: {
            url: "div.news-archive__inner--list>ul>li>a",
            idTemplate: "{{url}}",
            title: "div.news-archive__inner--list>ul>li>a>article>p",
            date: "div.news-archive__inner--list>ul>li>a>article>span",
            figure: {
                css: "div.news-archive__inner--list>ul>li>a>figure>img",
                template: "image"
            }
        },
        description: {
            body: "div.news-post__inner--content",
            figure_large: {
                css: "div.news-post__inner",
                value: '//div[@class="news-post__inner--mv"]/figure/img/@src'
            }
        },
        merge: {
            body:
                "{% assign figureUrl = figure_large | default: figure %}" +
                '{% unless figureUrl contains "thumb_no_image.png" %}<img src="{{ figureUrl | url_encode }}" />{% endunless %}' +
                "{{body}}"
        }
    });

    addSource({
        name: "IDOLLS!",
        url: "https://wsy-idolls.com/archives",
        guidPrefix: "idolls",
        index: {
            url: "ul.news-News_List li.news_item a.news_link",
            idTemplate: "{{url}}",
            title: "ul.news-News_List li.news_item h2.news_ttl",
            meta: "ul.news-News_List li.news_item div.news_meta"
        },
        description: {
            body: "div.news-Article_Body"
        },
        merge: {
            date: "{{ meta | regex_replace: '(\\d+\\.\\d+\\.\\d+).+', '\\1' }}"
        }
    });

    addSource({
        name: "文豪野犬 汪!",
        url: "https://bungo-stray-dogs-wan.com/news/",
        guidPrefix: "bungodogwan",
        index: {
            url: "ul.news-News_List li.news_item a.news_link",
            idTemplate: "{{url}}",
            title: "ul.news-News_List li.news_item h2.news_ttl",
            date: "ul.news-News_List li.news_item div.news_date"
        },
        description: {
            body: "div.news-Article_Body"
        }
    });

    addSource({
        name: "世界魔女出发!",
        url: "http://w-witch.jp/ww_takeoff/news/",
        guidPrefix: "wwtakeoff",
        index: {
            url: [
                "div.news-list a.news-li",
                "http://w-witch.jp/ww_takeoff/news/{{url}}"
            ],
            idTemplate: "{{url}}",
            title: "div.news-list a.news-li div.news_ttl",
            date: "div.news-list a.news-li p.date"
        },
        description: {
            body: "div.news_txt"
        }
    });

    addSource({
        name: "碧蓝航线 微速前行",
        url: "https://www.azurlane-bisoku.jp/news/",
        guidPrefix: "azurlane_bisoku",
        index: {
            url: "div.lists__list>ul li>a",
            idTemplate: "{{url}}",
            title: "div.lists__list>ul li span.lists__list__title",
            date: "div.lists__list>ul li span.desc--date"
        },
        description: {
            body: "div.detail__content"
        }
    });

    addSource({
        name: "八十龟观察日记",
        season: "201904",
        comment: "系列共用源：八十龟观察日记 第3册",
        url: "https://yatogame.nagoya/news/",
        guidPrefix: "yatogame",
        index: {
            url: "div.news-cols div.inline-box>div.main-news-table>a",
            idTemplate: "{{url}}",
            title: "div.news-cols div.inline-box div.main-news-title",
            date: "div.news-cols div.inline-box div.news-date"
        },
        description: {
            body: "div.article-content"
        }
    });

    addSource({
        name: "突如其来埃及神",
        url: "https://to-to2ni-anime.jp/news/",
        guidPrefix: "totsuni",
        index: {
            url: "section#news dl>dd>a",
            idTemplate: "{{url}}",
            title: "section#news dl>dd>a",
            date: "section#news dl>dt"
        },
        description: {
            body: "div.newsContents"
        }
    });

    addSource({
        name: "濒危物种。",
        url: "https://kigushun.com/news/",
        guidPrefix: "kigushun",
        index: {
            url: "div#loop-container div.post h2.post-title>a",
            idTemplate: "{{url}}",
            title: "div#loop-container div.post h2.post-title>a",
            date: "div#loop-container div.post div.post-content>p:first-child"
        },
        description: {
            body: "div.post-content"
        }
    });

    addSource({
        name: "大人的防具店",
        season: "201810",
        comment: "系列共用源：大人的防具店II",
        url: "https://ganma.jp/g/anime/otonabougu/news.html",
        guidPrefix: "otonabougu",
        index: {
            titleAndDate: "div#content div.box_info>h1:first-child",
            idTemplate: "{{titleAndDate}}",
            body: "div#content div.box_info"
        },
        merge: function(payload) {
            var match = /(.+)\(([\d\/]+)\([金木水火土日月]\)\)/.exec(payload.titleAndDate);
            return {
                "link": "https://ganma.jp/g/anime/otonabougu/news.html#" + payload.titleAndDate,
                "title": match[1],
                "date": match[2],
                "description": payload.body,
                "guid": "201810_otonabougu#" + payload.titleAndDate,
                "category": "大人的防具店"
            };
        }
    });

    addSource({
        name: "幼女社长",
        url: "https://www.mujina-company.com/news.html",
        guidPrefix: "mujina_company",
        index: {
            title: "div.news-contents div.news-t>:first-child",
            idTemplate: "{{title}}",
            date: "div.news-contents div.date",
            body: "div.news-contents div.news-t"
        }
    });

    addSource({
        name: "暗芝居 8期",
        url: "https://www.tv-tokyo.co.jp/anime/yamishibai8/news/",
        guidPrefix: "yamishibai8",
        index: {
            id: "div#contents_area>a",
            title: "div#contents_area div.entry.news>h3",
            date: "div#contents_area div.entry.news>div.date",
            body: "div#contents_area div.entry.news"
        },
        merge: {
            date: "{{ date | regex_replace: '(\\d+)年(\\d+)月(\\d+)日', '\\1.\\2.\\3' }}",
        }
    });

    addSource({
        name: "ABCiee修业日记",
        url: "https://abciee.abc-anime.co.jp/",
        guidPrefix: "abciee",
        index: {
            title: "div.p-news__body>ul li>div.p-news__title",
            idTemplate: "{{title}}",
            date: "div.p-news__body>ul li>div.p-news__data"
        },
        merge: {
            link: "https://abciee.abc-anime.co.jp/?_id={{ id | url_encode }}#NEWS",
            date: "{{ date | regex_replace: '(\\d+)年(\\d+)月(\\d+)日', '\\1.\\2.\\3' }}",
            description: "无正文"
        }
    });

    addSource({
        name: "PUI PUI 天竺鼠车车",
        url: "https://molcar-anime.com/news/",
        guidPrefix: "molcar",
        index: {
            id: "div.article>p.kiji-box-margin",
            title: "div.article>section.kiji-box>h2",
            date: "div.article>section.kiji-box>p.kiji-date",
            body: "div.article>section.kiji-box div.kiji-txt"
        }
    });

    skipSource({
        name: "金塔马尼犬",
        page: "https://kintamani-dog.com/",
        reason: "不存在新闻页"
    });

    addSource({
        name: "Puchimiku♪ D4DJ Petit Mix",
        url: "https://anime.d4dj-pj.com/petit-mix/",
        guidPrefix: "d4djpetitmix",
        index: {
            title: "div.news ul>li p.title",
            idTemplate: "{{title}}",
            date: "div.news ul>li p.date"
        },
        merge: {
            description: "无正文"
        }
    });

    skipSource({
        name: "俗女纯爱大作战",
        page: "https://jimihen.cf-anime.com/",
        reason: "R18不收录"
    });
};
