/**
 * 2021年春季番剧新闻
 * @param { import("../lib/loaderHost") } host 加载器宿主对象
 */
module.exports = async function(host) {
    const { prepareSeason, addSource, wip, dryRun, hideFromRss } = host;

    await prepareSeason({
        id: "202104",
        schedule: "every_30m",
        maxCount: 20 * 63,
        rss: {
            "self": "https://rss.projectxero.top/bangumi/2021-04.xml",
            "icon": "https://rss.projectxero.top/bangumi/icon/2021-04.jpg",
            "title": "2021年春季番剧新闻",
            "description": "本RSS源自动从番剧网站上收集新闻并打包为RSS",
            "link": "https://rss.projectxero.top",
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
            title: "ul.modNewsList__list.all_case li.item p.text",
            date: "ul.modNewsList__list.all_case li.item time",
            url: "ul.modNewsList__list.all_case li.item>a",
            category: "ul.modNewsList__list.all_case li.item span.tag"
        },
        getExtractor: function(url) {
            if (url.startsWith("#")) {
                let id = url.slice(1);
                return {
                    url: "https://edens-zero.net/news/" + url,
                    id: id,
                    bodySelector: `div#${id} div.content`
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

    await addSource({
        name: "佐贺偶像是传奇 Revenge",
        guidPrefix: "zombielandsaga_revenge",
        url: "https://zombielandsaga.com/news/",
        index: {
            url: ["ul.article__lists li.article__list a.article__list--link", "https://zombielandsaga.com/news/{{url}}"],
            idTemplate: "{{url}}",
            title: "ul.article__lists li.article__list p.article__list--title",
            date: "ul.article__lists li.article__list time.article__list--time"
        },
        description: {
            body: "div.article__main"
        }
    });

    await addSource({
        name: "SSSS.GRIDMAN", // SSSS系列通用
        season: "201810",
        guidPrefix: "gridman",
        url: "https://gridman.net/news/",
        index: {
            url: ["section.c-entry-list article.c-entry-item a.c-entry-item__link", "https://gridman.net{{url}}"],
            idTemplate: "{{url}}",
            title: "section.c-entry-list article.c-entry-item h1.c-entry-item__title",
            date: "section.c-entry-list article.c-entry-item span.c-entry-date",
            tag: "section.c-entry-list article.c-entry-item span.c-entry-tag",
            category: "section.c-entry-list article.c-entry-item span.c-entry-category"
        },
        description: {
            body: "div.c-entry-body"
        },
        merge: {
            title: "[{{category}}]{{title}}",
            category: "SSSS.{{tag}}"
        }
    });

    await addSource({
        name: "86 -不存在的战区-",
        guidPrefix: "anime-86",
        url: "https://anime-86.com/news/",
        index: {
            url: ["ul.c-list li.c-list__item a", "{{ url | to_uri: 'https://anime-86.com/news/' }}"],
            idTemplate: "{{url}}",
            title: "ul.c-list li.c-list__item div.c-list__item-title",
            date: "ul.c-list li.c-list__item div.c-list__item-date>p"
        },
        description: {
            body: "div.p-news__detail"
        }
    });

    await addSource({
        name: "美少年侦探团",
        guidPrefix: "bishonen_tanteidan",
        url: "https://bishonen-tanteidan.com/news/",
        index: {
            url: ["ul.c-newsList li.c-newsList__item a.c-newsList__link", "https://bishonen-tanteidan.com/news/{{url}}"],
            id: "ul.c-newsList li.c-newsList__item",
            title: "ul.c-newsList li.c-newsList__item p.c-newsList__head",
            date: "ul.c-newsList li.c-newsList__item p.c-newsList__date"
        },
        description: {
            body: "div.c-article__body"
        }
    });

    await addSource({
        name: "Tropical-Rouge!光之美少女",
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

    // TODO: 添加转生史莱姆日记（链接形式）

    await addSource({
        name: "影宅",
        guidPrefix: "shadowshouse",
        url: "https://shadowshouse-anime.com/news/",
        index: {
            url: ["ul.p-news__list li.p-news__item a.p-news__link", "{{ url | to_uri: 'https://shadowshouse-anime.com/news/' }}"],
            idTemplate: "{{url}}",
            title: "ul.p-news__list li.p-news__item div.p-news__title",
            date: "ul.p-news__list li.p-news__item div.p-news__date"
        },
        description: {
            body: "div.c-article__body"
        }
    });

    await addSource({
        name: "真白之音",
        guidPrefix: "mashironooto",
        url: "https://mashironooto-official.com/news/",
        index: {
            url: "div.news-lineup article.news-lineup__block>a",
            idTemplate: "{{url}}",
            title: "div.news-lineup article.news-lineup__block>h2.ttl",
            date: "div.news-lineup article.news-lineup__block>span.date"
        },
        description: {
            body: "div.post-style__cont"
        }
    });

    await addSource({
        name: "再见我的克拉默",
        guidPrefix: "sayonara_cramer",
        url: "https://sayonara-cramer.com/news/",
        index: {
            url: "div.news-main article.news-main__block>a.link",
            idTemplate: "{{url}}",
            title: "div.news-main article.news-main__block>div.news-main__block--ttl>div.ttl",
            date: "div.news-main article.news-main__block>div.news-main__block--date>span"
        },
        description: {
            body: "div.news-article__main"
        }
    });

    await addSource({
        name: "致不灭的你", // 《论模块化网站结构的重要性》
        guidPrefix: "fumetsunoanatae",
        page: "https://www.anime-fumetsunoanatae.com/",
        url: "https://www.anime-fumetsunoanatae.com/assets/data/topics-ja.json",
        indexFormat: "json",
        index: {
            topics: "topics"
        },
        merge: {
            link: "{{url}}"
        },
        pipe: [
            "index",
            {
                name: "DateFiller",
                type: "Agents::JavaScriptAgent",
                schedule: "never",
                options: JSON.stringify({
                    expected_update_period_in_days: 7,
                    language: "JavaScript",
                    code: "Agent.receive = " + (function(){
                        let events = this.incomingEvents();
                        events.forEach(event => {
                            let i, lastDate = event.created_at;
                            let uniqueEvents = this.memory("unique_events") || [];
                            let topics = event.payload.topics;
                            for (i = 0; i < topics.length; i++) {
                                let topic = topics[i];
                                let isNotUnique = uniqueEvents.find(ev => ev.text == topic.text && ev.url == topic.url);
                                topic.date = topic.date || lastDate;
                                if (!isNotUnique) {
                                    let url;
                                    if (topic.url) {
                                        url = "https://www.anime-fumetsunoanatae.com" + topic.url;
                                    } else {
                                        url = "https://www.anime-fumetsunoanatae.com/#" + topic.text;
                                    }
                                    this.createEvent({
                                        id: topic.text,
                                        url,
                                        title: topic.text,
                                        date: topic.date,
                                        body: "请在浏览器里打开"
                                    });
                                    uniqueEvents.push(topic);
                                }
                                lastDate = topic.date;
                            }
                            this.memory("unique_events", uniqueEvents);
                        });
                    }).toString().replace(/^\s+/mg, "")
                })
            },
            "merge"
        ], wip: "clean"
    });
}