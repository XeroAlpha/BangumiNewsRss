module.exports = async function(host) {
    const { prepareSeason, addSource, wip, dryRun, hideFromRss } = host;

    await prepareSeason({
        id: "202104",
        schedule: "every_30m",
        maxCount: 20 * 63,
        rss: {
            "self": "http://rss.projectxero.top/bangumi/2021-04.xml",
            "icon": "http://rss.projectxero.top/bangumi/icon/2021-04.jpg",
            "title": "2021年春季番剧新闻",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "http://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com",
        }
    });

    await addSource({
        name: "通灵王(第2作)",
        guidPrefix: "shamanking",
        url: "https://shamanking-project.com/news",
        index: {
            url: "div.md-newslist>ul li>a",
            idTemplate: "{{url}}",
            title: "div.md-newslist>ul li h3",
            date: "div.md-newslist>ul li em.date",
        },
        description: {
            body: "main.news--detail__main"
        }
    });

    await addSource({
        name: "伊甸星原",
        guidPrefix: "eden-zero",
        url: "https://edens-zero.net/news/",
        index: {
            title: "ul.modNewsList__list li.item p.text",
            date: "ul.modNewsList__list li.item time",
            url: "ul.modNewsList__list li.item>a",
            category: "ul.modNewsList__list li.item span.tag"
        },
        getExtractor: function(url) {
            if (url.startsWith("#")) {
                let id = url.slice(1);
                return {
                    url: "https://edens-zero.net/news/" + url,
                    id: id,
                    bodySelector: `div#${id} div.content`,
                    bodyXPath: "./node()"
                };
            } else {
                return {
                    id: url
                };
            }
        },
        merge: {
            title: "[{{category}}]{{title}}"
        }
    });

    await addSource({
        name: "我的英雄学院",
        guidPrefix: "heroaca",
        url: "https://heroaca.com/news/",
        season: "201604",
        index: {
            title: "ul.newsLists li.cBorderWrap_w5 p.newsList__title",
            date: "ul.newsLists li.cBorderWrap_w5 p.newsList__date>time",
            url: ["ul.newsLists li.cBorderWrap_w5>a", "https://heroaca.com{{url}}"],
            idTemplate: "{{url}}"
        },
        description: {
            body: "div.newsDetail__text"
        },
        hideFromRss
    });

    await addSource({
        name: "王者天下3",
        guidPrefix: "kingdom",
        url: "https://kingdom-anime.com/news/",
        season: "202004",
        index: {
            url: ["ul#news_list li>a", "https://kingdom-anime.com/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul#news_list li p.newsTitle",
            date: "ul#news_list li p.newsDate"
        },
        description: {
            body: "p#newsDetailText"
        }
    });

    await addSource({
        name: "水果篮子",
        guidPrefix: "fruba",
        url: "https://fruba.jp/news/",
        season: "201904",
        index: {
            url: ["ul.news_archive__list li.news_archive__list__item>a", "https://fruba.jp/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul.news_archive__list li.news_archive__list__item p.ttl",
            date: "ul.news_archive__list li.news_archive__list__item p.date"
        },
        description: {
            body: "div.c-single_cont"
        }
    });

    await addSource({
        name: "哥斯拉 奇异点",
        guidPrefix: "godzillasp",
        url: "https://godzilla-sp.jp/news/",
        season: "201904",
        index: {
            url: ["ul.subNews__lists li.subNews__list a.subNews__list__link", "https://godzilla-sp.jp/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul.subNews__lists li.subNews__list span.subNews__list__link--title",
            date: "ul.subNews__lists li.subNews__list span.subNews__list__link--date>time"
        },
        description: {
            body: "div.subNews__detal__textArea"
        }
    });

    await addSource({
        name: "大运动会 ReSTART!",
        guidPrefix: "daiundoukai",
        url: "https://daiundoukai-restart.jp/news.php",
        index: {
            url: ["div.text-farame table.news-list>tr>td>a", "https://daiundoukai-restart.jp/{{url}}"],
            idTemplate: "{{url}}",
            title: "div.text-farame table.news-list>tr>td>a",
            date: "div.text-farame table.news-list>tr>th"
        },
        description: {
            body: "div.text-farame"
        }
    });
}