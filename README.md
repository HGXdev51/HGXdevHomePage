# HGXdev 个人网站

一个多文件的个人网站，包含首页、关于、项目、时间线和联系五个页面。样式与交互拆分为独立的 `css/style.css` 和 `js/main.js`，没有把所有内容塞进单个 HTML。

## 文件结构

```text
HGXdev-site/
├─ index.html      首页
├─ about.html      关于
├─ projects.html   项目
├─ timeline.html   时间线
├─ contact.html    联系
├─ favicon.svg
├─ css/
│  └─ style.css    全站样式与响应式
└─ js/
   └─ main.js      滚动动效、页面过渡、终端打字、时钟等
```

## 本地预览

直接双击 `index.html` 可以打开；若希望更接近部署环境，可以在本目录启动一个本地静态服务器：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 说明

- 时间线页面把“AI 近年发展”和“个人兴趣/开发方式变化”做成左右两条轨道。
- 联系页面已配置 GitHub、邮箱、QQ 与微信号，未使用表单。
- 项目页中的 Electron 桌面应用可跳转到抖音视频查看具体信息。
- 项目页新增“那个追不到的女孩”私密站点，访问密码为 0902。
