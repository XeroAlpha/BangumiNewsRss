/**
 * 旧新闻来源
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
 module.exports = function(host) {
    const { mockSeason } = host;

    mockSeason({
        id: "202010",
        name: "2020年秋季",
        status: "不再添加新的来源",
        scenarioLink: "https://rss.projectxero.top/scenarios/2/export.json",
        rssLink: "https://rss.projectxero.top/bangumi/2020-10.xml ",
        viewerLink: "https://rss.projectxero.top/view/?src=bangumi%2F2020-10.xml",
        schedule: "midnight",
        sources: [
            {   
                name: "总之就是非常可爱",
                page: "http://tonikawa.com/news/"
            },
            {
                name: "魔女之旅",
                page: "https://majotabi.jp/news.html"
            },
            {
                name: "熊熊勇闯异世界",
                page: "https://kumakumakumabear.com/news/"
            },
            {
                name: "这是你与我最后的战场，或是开创世界的圣战",
                page: "https://kimisentv.com/news/"
            },
            {
                name: "我立于百万生命之上",
                page: "http://1000000-lives.com/#news"
            },
            {
                name: "在魔王城说晚安",
                page: "https://maoujo-anime.com/news/"
            },
            {
                name: "战翼的希格德莉法",
                page: "https://sigururi.com/news/?p=1"
            },
            {
                name: "安达与岛村",
                page: "https://www.tbs.co.jp/anime/adashima/news/"
            }
        ]
    });
 }