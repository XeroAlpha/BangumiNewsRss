# 番剧新闻聚合计划

本项目从当季的番剧官网上收集新闻并打包为RSS源发布。目前基于 [Huginn](https://github.com/huginn/huginn) 实现。

## 包含番剧

请参阅 [项目主页](https://github.com/XeroAlpha/BangumiNewsRss/blob/main/index.md) 。

## 项目原理

本项目由在 Huginn 上的数个 Agent 组成。通过一定的配置可使这些 Agent 定时向番剧官网拉取新闻。详见 [结构说明](https://github.com/XeroAlpha/BangumiNewsRss/blob/main/structure.md) 。

## 仓库结构

本仓库存储了上述 Agent 的描述文件（见 `seasons` 目录）与相应的 Agent 生成与导出工具。

## 如何配置

创建 `lib/conf.json` 文件，格式可参考 [lib/conf.example.json](https://github.com/XeroAlpha/BangumiNewsRss/blob/main/lib/conf.example.json) 。此文件存储了 Huginn 站点的地址、用户名与密码。

## 如何导出

运行 `npm run generate` 。

## 待解决问题

较难处理在多个季度播放的且使用同一个新闻来源的番剧。例如连续2季度放送和分割放送。

## 协议

本项目基于 [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/) 开源。