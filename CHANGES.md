# MySpinPick P0 更新包（2026-10-12）— Wheel of Fate 分享 / 嵌入 / 万圣节

本轮完成 wheel-of-fate 的三个 P0：① 上线 `/embed/wheel-of-fate/`；② 分享链接闭环；③ 万圣节内容与预设列表。
**另已并入两批「本地已完成、尚未上传」的 wheel-of-fate 改动**（详见第三节「版本关系」）。本包该页为超集，上传不会丢任何已有改动。

## 一、本包文件（4 个，按仓库相对路径覆盖上传）

| 文件 | 类型 | 说明 |
|---|---|---|
| `wheel-of-fate/index.html` | 更新 | 主页面：分享按钮 + Embed 板块 + 万圣节区块 + 3 条新 FAQ |
| `embed/wheel-of-fate/index.html` | **新增** | 可嵌入部件页（`noindex, follow`，canonical 指向主页面） |
| `llms.txt` | 更新 | Wheel of Fate 条目补充 share / embed / Halloween 事实 |
| `CHANGES.md` | 说明 | 本文件，覆盖仓库根旧版 |

上传方式：GitHub 网页端解压后，把 `wheel-of-fate/` 与 `embed/` 两个目录、以及 `llms.txt`、`CHANGES.md` 拖进仓库对应位置。`embed/` 目录已存在，拖入为**合并**上传，不会影响其它 embed 子页。

## 二、改动明细

### 1. 分享链接（新功能）
- 列表按钮行新增 `🔗 Share`，交互与 wheel-spinner 待上线实现同款：`#l=<encodeURIComponent(列表)>`。
- 点击后把 `https://myspinpick.com/wheel-of-fate/#l=...` 复制到剪贴板，状态行提示 "Share link copied — paste it anywhere."；剪贴板 API 不可用时自动降级为 execCommand 复制。
- 打开带 `#l=` 的链接会自动载入该列表（优先于 localStorage 上次状态），状态行提示 "… loaded from a shared link — press Spin."。
- 埋点：`share`（含选项数）、`share_view`。

### 2. /embed/wheel-of-fate/（新页面）
- 基于 `/embed/wheel-spinner/` 模板改造：`noindex, follow`、canonical → `/wheel-of-fate/`、页脚 "Wheel of Fate by MySpinPick" 回链、`embed_view` 埋点（记录被哪些父域嵌入）。
- 默认列表与主页面一致（Yes/No/Maybe…）；localStorage key 与主页面共享（`myspinpick.wheelOfFate.*`），与 wheel-spinner 主/嵌共用 key 的既有约定一致。
- **本页自诞生即使用 `cryptoRandom()`（CSPRNG）**——注：其它已上线 embed 页仍是 `Math.random`（历史批次遗漏），建议后续单独补一轮。
- iframe 建议高度按实测校准为 **1020**（420 / 760 / 980px 三档宽度实测 scrollHeight 最大 1019）。

### 3. 主页面 Embed 板块
- 新增 `#embed` 板块（版式与 wheel-spinner 一致）：iframe 代码框 + "Copy embed code" 按钮 + "Preview the widget" 链接 + 高度说明。

### 4. 万圣节内容卡位（Q4 季节性）
- 新增 `Halloween Fate Challenges` H2 区块 + 3 个一键预设列表：🎃 Halloween Dares（8 项）/ 🍬 Trick or Treat（6 项）/ 🍿 Spooky Movie Night（8 项）。
- 点击预设：载入列表 → 重置结果与历史 → 平滑滚动回工具区 → 状态行提示 `Loaded "xxx" — N options.`；埋点 `load_preset`。

### 5. FAQ 与结构化数据
- 可见 FAQ 12 → 15 条，新增 share / embed / Halloween 三问；JSON-LD FAQPage 同步为 15 问（与可见文案逐字一致，已通过 JSON 解析校验）。

### 6. 并入的既有改动（来自本地未上传批次）
- **CSPRNG 降级分支递归修复**：`return cryptoRandom();` → `return Math.random();`（含上方注释两行）。
- **Remove Winner**：按钮 "Remove" → "Remove Winner"，逻辑从"删最后一个"改为"删刚命中的那个"；未转先点则回退删最后一项，状态行 "Removed winner "X". N options left."。

### 7. 顺手修正
- `og:title` 原误为 "Name Wheel Picker — …"（复制粘贴遗留）→ 改为 "Wheel of Fate — Spin to Let Fate Decide | MySpinPick"。

## 三、版本关系（上传前必读）

你本地存在两批包含 wheel-of-fate、尚未上传的改动，本包**已全部并入**，避免上传顺序互相覆盖：

1. **16 页 CSPRNG 递归修复批次**（未上传）——其中 wheel-of-fate 部分已并入本包。上传那批时，wheel-of-fate 请用本包版本（或跳过该页）；其余 15 页与本包无关，照常上传。
2. **6 文件 "Remove Winner" 批次**（未上传）——其中 wheel-of-fate 部分已并入本包。上传那批时，wheel-of-fate 请用本包版本（或跳过该页）；其余 5 页照常上传。

本包的 `wheel-of-fate/index.html` = 线上当前版本 + 上述两批中 wheel-of-fate 的全部改动 + 本轮 P0。**建议最后上传本包，且上传后不要再用旧版 wheel-of-fate 覆盖。**

## 四、验证记录（本机真实浏览器，系统 Chrome）

44/44 项通过（截图存档于工作区 `shots/`）：

- 主页面：无 JS 报错；Spin 出结果 "Fate says: …"；Remove Winner 8→7；Share 链接往返一致（编码→解码→新页面载入同列表）；三个预设各 8 / 6 / 8 项且状态行文案正确；Embed 代码复制成功；可见 FAQ 15 = schema 15；390px 无横向溢出、按钮行自动换行。
- Embed 页：无 JS 报错；默认列表 / 标题 / 页脚回链 / robots / canonical 正确；Spin 正常（走 CSPRNG 路径）。

## 五、上线后自查（2 分钟）

1. `https://myspinpick.com/wheel-of-fate/?cb=1` → 列表按钮行有 `🔗 Share`，点击出现 "Share link copied…"。
2. `https://myspinpick.com/embed/wheel-of-fate/` → 200 可转，页脚 "Wheel of Fate by MySpinPick"。
3. 页面底部有 "Embed the Wheel of Fate on Your Site" 板块；万圣节区块三个按钮可一键载入列表。
