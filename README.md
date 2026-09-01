# MySpinPick

16 个免费随机工具集合站，单页纯静态（HTML + CSS + JS，无框架、无构建）。

## 工具列表

| # | 工具 | 路径 |
|---|---|---|
| 1 | Wheel Spinner | /wheel-spinner/ |
| 2 | Random Group Generator | /random-group-generator/ |
| 3 | Random Number Generator | /random-number-generator/ |
| 4 | Decision Wheel Spinner | /decision-wheel-spinner/ |
| 5 | What to Eat Wheel | /what-to-eat-wheel/ |
| 6 | Yes No Wheel | /yes-no-wheel/ |
| 7 | Random Draft Order Generator | /random-draft-order-generator/ |
| 8 | Secret Santa Name Picker | /secret-santa-name-picker/ |
| 9 | Random Letter Picker | /random-letter-picker/ |
| 10 | Duck Race | /duck-race/ |
| 11 | Coin Flip | /coin-flip/ |
| 12 | Dice Roller | /dice-roller/ |
| 13 | Color Picker | /color-picker/ |
| 14 | Metronome | /metronome/ |
| 15 | Bubble Level | /bubble-level/ |

## 技术说明

- 纯静态：每页独立 `<style>` + `<script>`，无外部依赖（无 CDN 库）
- 动画过程式反馈：转盘、骰子、字母跳动、鸭子赛跑等均有过程动画与按钮防连点
- SEO：每页独立 title/description/canonical/OG/JSON-LD；站点地图 sitemap.xml
- 统计：GA4（G-4W9M7STTLM）
- 部署：GitHub Pages + 自定义域 myspinpick.com

## 本地预览

```bash
python -m http.server 8000
```
