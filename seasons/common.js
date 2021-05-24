/**
 * 通用新闻来源
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
module.exports = async function(host) {
    const { prepareSeason, addSource, wip, dryRun, hideFromRss } = host;

    await prepareSeason({
        id: "common",
        name: "通用新闻来源",
        schedule: "every_30m",
        status: "正在收录来源",
        scenarioLink: "https://rss.projectxero.top/scenarios/20/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/common.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2Fcommon.xml",
        maxCount: 1000,
        rss: {
            "icon": "https://rss.projectxero.top/bangumi/icon/common.jpg",
            "title": "常见番剧网站新闻聚合",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "https://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com"
        }
    });

    await addSource({
        name: "animateTimes",
        guidPrefix: "animatetimes",
        url: "https://www.animatetimes.com/index.php?p=1",
        index: {
            url: "div#pagetop>div.container>div.l-content>section.l-content-main>div.l-box>div.l-article>div.c-headline>ul.c-headline-list>li.c-headline-item>a.c-headline-link",
            idTemplate: "{{ url | remove: 'https://www.animatetimes.com/news/details.php?id=' }}",
            title: "div#pagetop>div.container>div.l-content>section.l-content-main>div.l-box>div.l-article>div.c-headline>ul.c-headline-list>li.c-headline-item>a.c-headline-link>div.c-headline-meta>div.c-headline-text",
            date: "div#pagetop>div.container>div.l-content>section.l-content-main>div.l-box>div.l-article>div.c-headline>ul.c-headline-list>li.c-headline-item>a.c-headline-link>div.c-headline-meta>div.c-headline-date",
            image: {
                css: "div#pagetop>div.container>div.l-content>section.l-content-main>div.l-box>div.l-article>div.c-headline>ul.c-headline-list>li.c-headline-item>a.c-headline-link>div.c-headline-img",
                template: "body"
            }
        },
        description: {
            body: ["div.news-content", "{{image}}<br />{{body}}"]
        }
    });

    await addSource({
        name: "AnimeAnime",
        comment: "使用 GMT +8 时区",
        guidPrefix: "animeanime",
        url: "https://animeanime.jp/article/?page=1",
        index: {
            url: ["div.news-list>section.item a.link", "https://animeanime.jp{{url}}"],
            idTemplate: "{{url}}",
            title: "div.news-list>section.item h2.title",
            date: { css: "div.news-list>section.item time.date", value: "@datetime" },
            image: { css: "div.news-list>section.item img.figure", value: "." }
        },
        description: {
            body: ["article.arti-body", "{{image}}<br />{{body}}"]
        }
    });
}