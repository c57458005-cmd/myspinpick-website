# MySpinPick 修复包（基于线上最新代码，2026-10-12 抓取）

改动基于 myspinpick.com 线上 24 页实抓快照，共 **17 个文件**（16 个 crypto 修复页 + 首页，其中 what-to-eat-wheel 同时含内容扩写），直接可用原文覆盖部署。
改动仅涉及：① 新增一段 `<script>` 助手；② JS 调用点替换；③ HTML 内容区块与 JSON-LD 新增。**未改动任何现有 CSS / 布局 / 工具逻辑。**

## 一、Crypto 随机数修复（16 页 / 44 处）

**方案**：每页 `<head>` 起始处注入 `cryptoRandom()` 助手（Web Crypto API `getRandomValues`，返回与 `Math.random()` 语义完全一致的 [0,1) 均匀分布，带降级回退），然后把全部 `Math.random()` 调用点替换为 `cryptoRandom()`。洗牌、抽奖、转盘落点、骰子、硬币、抽奖号码等所有决定结果的随机源全部走 CSPRNG，动画随机也一并覆盖。

| 页面 | 替换处数 |
|---|---|
| name-picker | 15 |
| random-letter-picker | 4 |
| random-number-generator | 3 |
| dice-roller | 3 |
| coin-flip / decision-wheel-spinner / wheel-spinner / yes-no-wheel / wheel-of-colors / wheel-of-fate / what-to-eat-wheel | 各 2 |
| secret-santa / random-group / random-draft-order / lottery-number / duck-race | 各 1 |

校验：16 页均已无裸 `Math.random` 调用（仅保留助手内降级回退一处）。

## 二、首页（home.html）

1. **新增 FAQPage JSON-LD**（6 问，与页面可见 FAQ 逐字一致，符合 Google 结构化数据规范）。
2. **可见 FAQ 从 3 问扩到 6 问**，新增：How random are the results?（顺势把 crypto 卖点写成信任信号）/ Can I use MySpinPick for giveaways and raffles? / Do I need to install anything?
3. **内容扩写 574 → 1009 词**：新增 "How People Use MySpinPick" 场景区块（教师课堂 / 抽奖 / 团队 / 家庭四个 H3，含内链到 group generator、name picker、draft order、what to eat wheel 等工具页）；About 区块新增一段（Web Crypto 随机性 + 隐私 + 速度）。
4. 现有 4 个 JSON-LD（WebSite+Org、3 个 ItemList）保留不动。

## 三、What to Eat Wheel（what-to-eat-wheel.html）

1. **内容扩写 752 → 1514 词**：#about 首段新增 40–60 词直接答案段（AI 提取友好）；新增 5 个内容区块——
   - What to Eat Tonight: Ideas for Every Situation（忙碌工作日 / 挑食家庭 / 情侣室友 / 学生合租）
   - House Rules That Keep the Spin Fun（三转规则、否决权、输家做饭）
   - Why Spinning Works Better Than Asking（决策疲劳、选择瘫痪）
   - Beyond Dinner: Lunches, Snacks and Meal Prep
   - Tips for a Better Food Wheel（5 条实操清单）
2. 页面原有 WebApplication / BreadcrumbList / FAQPage 三组 schema 均未动（FAQ 可见内容未改，schema 无需同步）。
3. crypto 修复已同步包含在本文件（2 处）。

## 四、部署提示

- 直接覆盖同名文件即可；部署后用浏览器控制台跑一遍各工具确认功能正常。
- 部署后记得：① 在 Bing Webmaster Tools / GSC 请求重新抓取首页与 what-to-eat-wheel；② 更新 llms.txt 中的随机数表述（现在与事实一致了）；③ Roboto：JSON-LD 可用 Rich Results Test 验证。
- 其余 8 个无 Math.random 的页面（privacy-policy、about、contact、metronome、bubble-level、color-picker、password-generator 等）无需改动，不在本包内。
