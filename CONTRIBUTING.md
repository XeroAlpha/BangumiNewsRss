# 参与指南

## 项目的文件结构

本项目分为两个部分，`lib` 文件夹为生成器与上传模块，`seasons` 文件夹为各番剧网站的番剧新闻聚合收集器。

## 提交格式

提交格式类似 [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) 。生成器与上传模块对应 `scope` 为 `generator`，各个季度对应 `scope` 为该季度的 ID。

## 番剧新闻来源收集器格式

请参阅 [loaderHost.d.ts](https://github.com/XeroAlpha/BangumiNewsRss/blob/main/lib/loaderHost.d.ts)。

## Issue / Pull Request 相关

### 希望添加番剧新闻来源

请提交 Issue / Pull Request。标题为番剧名，并加上 `source request` 的标签。可以一次添加多个番剧。

### 认为番剧新闻来源数据不全/有误等

请提交 Issue / Pull Request。标题为番剧名，并加上 `bug` 的标签。可以一次添加多个番剧。