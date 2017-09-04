---
title: 苹果 App 转移主体遇到的问题
date: 2017-09-01 17:24:18
tags: [iOS, Transfering, 坑, Apple Pay]
categories: [经验, iOS]

---



最近因为一些原因，公司决定另外申请一个 Apple 开发者账号，把 App 转移到新的开发者账号里面。中间遇到了一些坑，特此记下血泪史。

<!-- more -->

## 申请邓白氏码

申请邓白氏码是申请 Apple 开发者公司账号的必要步骤，其中稍微有点难度的是提供加盖公司公章的营业执照，在经历了繁琐的步骤以后，大概花了三天时间搞定了。

## 申请 Apple 开发者账号

之前收到邓白氏码的时候，提示两周后可以使用，如果急的话，7天以后就可以尝试使用。我是正好七天以后使用的，没有遇到问题。

## 转移 App 到新的账号

转移 App 要在 iTunes Connect 里面完成，会提示你要开始转移需要提前做什么，具体到我这里大概做了两件事:

* 删除 App 中的所有测试人员
* 确保 App 没有版本在测试中

## 转移的结果
App 转移到了新的 iTunes Connect 账号里面，App 的 ID 也转移到了新的开发者账号里面了。

## 转移完成后还需要搞事情
**开发者账户里，真的除了 Apple ID 啥都没有转过来啊！摔**
1. 设备需要重新导入 <br>收集好设备信息以后，[Fastlane Match](https://github.com/fastlane/fastlane/tree/master/match) 一键导入，还好。
2. 证书和 Provision Profile 需要重新生成 <br>如果之前工程有用 [Fastlane Match](https://github.com/fastlane/fastlane/tree/master/match)  管理证书的话，其实重新生成也就是一个命令。
3. 推送的证书要重新生成 <br> [Fastlane PEM](https://github.com/fastlane/fastlane/tree/master/pem) 看也是一键生成。
4. Merchant ID 重新创建，用新的 CSR 证书绑定，然后绑定到 Aple  <br> ***如果你的 App 有用到 Apple Pay 的话，之前的 Apple 开发者账号里面的 Merchant ID 你千万不要动，下面会说为什么***



## 挖的坑🤦‍♂️

前面说不要动之前 Apple 开发者账号里的 Merchant ID，是因为我脑子一抽，把之前的 Apple 开发者账号里的 Merchant ID 的证书给 Revoke 了。经历一晚上以后，公司的 App 的 Apple Pay 不能用了！支付的时候会提示错误！然后，发现 [苹果的文档](https://developer.apple.com/library/content/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/TransferringAndDeletingApps.html) 有这么一句话:

>If you transfer an app that uses ApplePay, the merchant ID is not transferred along with the app. Transactions continue to be successful as long as the original certificates are valid. However, when you submit an update, the recipient needs to create a new merchant ID on his or her account.

看到这里我先哭一会儿🤦‍♂️

## 结尾 ##

打了银联的电话，说是需要财务人员在他们的后台里面提一个工单，重新申请一个 CSR 证书，然后就 OK 了。然后，我就在苦逼的等待着财务人员的好消息。<br>我的心在等待，永远在等待😭
