/**
 * RSS 索引
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
module.exports = function(host) {
    // 2021年春季番剧新闻
    host.log("Loading 2021-04");
    require("./2021-04")(host);

    // 2021年冬季番剧新闻（补全中）
    host.log("Loading 2021-01");
    require("./2021-01")(host);

    // 旧新闻来源
    require("./older")(host);

    // 通用
    host.log("Loading Common");
    require("./common")(host);

    // 番剧列表
    host.log("Loading BangumiList");
    require("./bangumiList")(host);

    host.defineShortcut({
        id: "current",
        name: "本季",
        rssLink: "https://rss.projectxero.top/bangumi/current.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2Fcurrent.xml",
        season: "202104"
    });

    // host.defineShortcut({
    //     id: "next",
    //     name: "下季",
    //     rssLink: "https://rss.projectxero.top/bangumi/next.xml",
    //     viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2Fnext.xml",
    //     season: "202107"
    // });

    host.defineShortcut({
        id: "prev",
        name: "上季",
        rssLink: "https://rss.projectxero.top/bangumi/prev.xml",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2Fprev.xml",
        season: "202101"
    });
}