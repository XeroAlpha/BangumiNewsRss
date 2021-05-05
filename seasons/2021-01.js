/**
 * 2021年冬季番剧新闻
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
module.exports = async function(host) {
    const { prepareSeason, addSource } = host;

    // 待补完

    await prepareSeason({
        id: "202101",
        schedule: "every_30m",
        maxCount: 20 * 59,
        rss: {
            "self": "http://rss.projectxero.top/bangumi/2021-01.xml",
            "icon": "http://rss.projectxero.top/bangumi/icon/2021-01.jpg",
            "title": "2021年冬季番剧新闻",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "http://rss.projectxero.top",
            "copyright": "内容版权归原网站所有",
            "webMaster": "projectxero@163.com",
        }
    });

    await addSource({
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

    await addSource({
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