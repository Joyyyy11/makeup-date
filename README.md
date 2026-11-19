# MAKEUP DATE · 约妆预约网站

一个移动端优先的全品类约妆平台前端演示站点。18 个页面，纯 HTML / CSS / JavaScript，无需构建工具。

## 打开方式（三种）

### ★ 完全离线：双击直接看（推荐）

打开 `standalone/` 目录里的 **`打开网站.html`**，双击即可浏览整站。

**不需要服务器，也不需要联网**——样式、脚本、图片全部在本地：

- `standalone/` 里 18 个页面已内联全部 CSS / JS
- 全部 479 张图片在 `images/`（约 31 MB），页面通过 `../images/` 引用

⚠️ `standalone/` 与 `images/` 需保持同级目录关系，一起拷贝即可。

### 方式二：本地服务器（开发调试）

```bash
python3 -m http.server 8899
# 打开 http://localhost:8899/打开网站.html
```

### 方式三：直接双击根目录页面

根目录的 18 个 html 也可直接双击运行（图片走 `images/`），适合调试。

## 重新生成

```bash
python3 fetch_images.py        # 下载/补齐 images/ 并生成 images/map.js
python3 build_single_file.py   # 内联 CSS/JS → standalone/
python3 make_landing.py        # 生成两份导航页
```

## 设计规范

| Token | 值 | 用途 |
|---|---|---|
| 主背景 | `#FFFFFF` | 主体内容区 |
| 暖浅灰 | `#F7F6F4` | 筛选栏、功能卡片底色 |
| 曜石黑 | `#18181B` | 主按钮、选中态、标题 |
| 香槟金 | `#C5A059` | 认证勋章、新娘高定、星级评分 |
| 珊瑚红 | `#E11D48` / `#F43F5E` | 档期紧张、限时提醒 |

字体：Inter（正文）+ Cormorant Garamond（大标题衬线体）
断点：390 / 700 / 900 / 1000 / 1100 / 1200 / 1600 px

## 页面清单（对应需求表 18 页）

| 页码 | 文件 | 页面名称 | 关键模块 |
|---|---|---|---|
| 01 | `index.html` | Home 首页 | Hero 胶囊搜索、场景 Tab、双模式切换（瀑布流 / 列表）、信任专区、地区、流程、评价跑马灯 |
| 02 | `about.html` | About Us 关于我们 | 创立背景、服务对象、平台特色、团队、数据背书 |
| 03 | `styles.html` | Styles 妆造风格总览 | 6 张风格大卡 + 按场合快速匹配 |
| 04 | `style-daily.html` | 清透日常妆 | 主视觉、妆容特点三栏、更多示例瀑布流、相关妆娘 |
| 05 | `style-guofeng.html` | 古风妆 | 全幅古风主视觉、朝代妆造示例、汉服配色对应 |
| 06 | `style-cos.html` | Cosplay / 韩系妆 | 双区块（Cos / 韩系）、特效字段、示例四宫格 |
| 07 | `artists.html` | 妆娘列表 | 左侧固定筛选栏、横向大卡片（3–4 张代表作）、地图预览 |
| 08 | `artist-yuki.html` | 妆娘详情 A | 首屏画廊、Before/After 滑块、套餐矩阵、实时日历、带图评价、右侧预约卡 |
| 09 | `artist-mia.html` | 妆娘详情 B | 与 A 同结构，套餐 / 档期 / 评价不同，便于横向比较 |
| 10 | `portfolio.html` | Portfolio 作品集 | 分类筛选、妆前妆后对照、瀑布流 + Lightbox 大图 |
| 11 | `search.html` | Search Results 搜索结果 | 复合搜索框、关键词高亮、结果列表、相关风格推荐 |
| 12 | `location.html` | Location 地区筛选 | 16 区选择器、地图模式（可覆盖交通圈）、浮动卡片列表 |
| 13 | `budget.html` | Budget 预算筛选 | 四档预算卡、自定义滑块、即时过滤、费用说明 |
| 14 | `booking.html` | Booking 预约表单 | 四段式分区表单、套餐单选、实时费用摘要、跳转确认页 |
| 15 | `booking-confirmation.html` | 预约确认 | 成功提示、订单号、资料摘要（回填表单数据）、后续三步 |
| 16 | `booking-guide.html` | 预约须知 | 侧边目录、预约步骤、定金表、改期取消梯度、卫生与路费 |
| 17 | `reviews.html` | Community & Reviews 客户评价 | 多维评分、筛选 chips、瀑布流评价 + 返图、评价表单 |
| 18 | `faq.html` | FAQ 常见问题 | 六类 FAQ 手风琴、侧边分类、联系入口 |

## 文件结构

```
makeup_date/
├── 打开网站.html                  # 导航入口（服务器版）
├── index.html … faq.html          # 18 个页面（模块化版）
├── build_single_file.py           # 打包脚本：内联 CSS/JS → standalone/
├── make_landing.py                # 生成导航页脚本
├── standalone/                    # ★ 双击即可打开的单文件版
│   ├── 打开网站.html              #   导航入口（离线版）
│   └── index.html … faq.html      #   18 个已内联资源的页面
└── assets/
    ├── style.css                  # 设计系统（变量、导航、按钮、瀑布流、卡片、页脚）
    ├── page.css                   # 页面组件（Hero、日历、套餐、评价、地图、表单）
    ├── artist-page.css            # 妆娘详情页专用布局
    ├── artist-booking.css         # 预约卡 / 右侧栏
    ├── photos.js                  # 图片工具：photo() / img() / avatar() + SVG 占位兜底
    ├── data.js                    # 12 位化妆师数据、风格 Tab、图标
    ├── layout.js                  # 导航 / 页脚 / 底部悬浮条 / 卡片组件
    ├── hydrate.js                 # 数据渲染（瀑布流、列表、相关妆娘）
    ├── hydrate-form.js            # 预约表单逻辑与费用计算
    └── app.js                     # 通用交互（Tab、滑块、日历、FAQ、地图、收藏）
```

## 已实现的关键交互

- **Before / After 滑动对比**：鼠标与触屏拖拽，实时裁剪
- **实时档期日历**：可约 / 仅剩晚间 / 已满三态，点击选择
- **双模式浏览**：作品瀑布流 ↔ 化妆师横向列表，一键切换
- **场景 Tab 过滤**：点击分类即时筛选瀑布流
- **套餐品类自适应字段**：新娘看试妆/造型数，日常看耗时/睫毛
- **费用实时计算**：套餐 + 上门路费联动，提交后带入确认页
- **预算 / 地区筛选**：即时过滤化妆师卡片
- **地图模式**：位置 pin、可覆盖半径、联动卡片列表
- **作品集 Lightbox**：点击看大图，Esc 关闭
- **移动端底部双按钮**：私信咨询 + 立即预约，常驻悬浮

## 图片说明

所有图片已下载到本地 `images/`（479 个文件，约 31 MB），通过 `images/map.js` 的 URL 映射表供 `photo()` 查询，实现**完全离线**。

每张 `<img>` 仍保留 `onerror` 兜底 SVG，即使图片缺失也不会出现裂图。

> 仅用于课程 / 作品集演示，非真实化妆师作品；原图来源 Unsplash。
