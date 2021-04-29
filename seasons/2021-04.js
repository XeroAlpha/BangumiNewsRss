module.exports = async function(host) {
    const { prepareSeason, addSource, wip, dryRun } = host;

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
            title: "div.md-newslist>ul li h3",
            date: "div.md-newslist>ul li em.date",
            url: "div.md-newslist>ul li>a"
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
}