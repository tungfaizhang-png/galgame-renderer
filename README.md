# 🎮 Galgame Renderer for SillyTavern

一个可以在 SillyTavern 中使用的 Galgame 风格前端渲染器。

当 AI 输出特定格式的关键词时，自动渲染成视觉小说/Galgame 风格的界面。

## 📋 目录

- [快速开始](#快速开始)
- [部署到 GitHub Pages](#部署到-github-pages)
- [添加素材](#添加素材)
- [配置 SillyTavern](#配置-sillytavern)
- [AI 提示词模板](#ai-提示词模板)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 方式一：GitHub Pages（推荐，免费）

适合跨设备使用，一次部署，所有设备都能用。

### 方式二：本地使用

直接双击 `index.html` 打开（部分功能可能受限）。

---

## 📤 部署到 GitHub Pages

### 第一步：创建 GitHub 账号

如果没有账号，访问 [github.com](https://github.com) 注册。

### 第二步：创建仓库

1. 登录 GitHub
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - Repository name: `galgame-renderer`（或任意名称）
   - 选择 **Public**（公开，GitHub Pages 免费版需要）
   - ✅ 勾选 "Add a README file"
4. 点击 **Create repository**

### 第三步：上传文件

**方法 A：网页上传（简单）**

1. 在仓库页面点击 **Add file** → **Upload files**
2. 将以下文件拖入：
   - `index.html`
   - `style.css`
   - `config.js`
   - `renderer.js`
   - `characters/` 文件夹（你的角色立绘）
   - `backgrounds/` 文件夹（你的场景背景）
3. 点击 **Commit changes**

**方法 B：Git 命令行（推荐）**

```bash
# 克隆仓库
git clone https://github.com/你的用户名/galgame-renderer.git
cd galgame-renderer

# 复制所有文件到仓库目录
# ... 复制文件 ...

# 提交并推送
git add .
git commit -m "Initial commit"
git push origin main
```

### 第四步：启用 GitHub Pages

1. 进入仓库 → **Settings** → 左侧 **Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选择 **main**，文件夹选 **/ (root)**
4. 点击 **Save**
5. 等待 1-2 分钟，刷新页面
6. 你会看到："Your site is live at https://你的用户名.github.io/galgame-renderer/"

✅ 完成！记下这个网址，后面配置 SillyTavern 要用。

---

## 🎨 添加素材

### 目录结构

```
galgame-renderer/
├── index.html
├── style.css
├── config.js
├── renderer.js
├── characters/              ← 角色立绘
│   ├── 小明/
│   │   ├── normal.png       ← 普通表情
│   │   ├── smile.png        ← 微笑
│   │   ├── sad.png          ← 悲伤
│   │   └── angry.png        ← 生气
│   ├── 小红/
│   │   └── ...
│   └── 老师/
│       └── ...
├── backgrounds/             ← 场景背景
│   ├── 教室.jpg
│   ├── 操场.jpg
│   ├── 家.jpg
│   └── 街道.jpg
└── audio/                   ← 音频（可选）
    ├── bgm/
    │   └── school.mp3
    └── sfx/
        └── click.mp3
```

### 添加新角色

1. 在 `characters/` 下创建角色文件夹（如：`characters/新角色/`）
2. 放入立绘图片，命名为表情名（如：`normal.png`, `smile.png`）
3. 编辑 `config.js`，添加角色配置：

```javascript
"新角色": {
    name: "新角色",                       // 显示名称
    folder: "characters/新角色",          // 素材文件夹
    color: "#颜色代码",                   // 名字颜色（如 #4a90d9）
    expressions: {
        "normal": "normal.png",
        "smile": "smile.png",
        "sad": "sad.png"
    },
    defaultExpression: "normal"
}
```

### 添加新场景

1. 将背景图片放入 `backgrounds/` 文件夹
2. 编辑 `config.js`，添加场景配置：

```javascript
"新场景": {
    image: "backgrounds/新场景.jpg",
    bgm: "audio/bgm/xxx.mp3"    // 可选
}
```

### 素材要求

| 类型 | 推荐尺寸 | 格式 | 说明 |
|------|----------|------|------|
| 角色立绘 | 800×1200 | PNG（透明背景） | 建议去背景 |
| 场景背景 | 1920×1080 | JPG/PNG | 16:9 比例 |
| BGM | - | MP3 | 文件不要太大 |

### 素材来源建议

- **立绘**：可以用 AI 生成（如 Stable Diffusion、NovelAI）
- **背景**：搜索 "Visual Novel Background" 或 AI 生成
- **音乐**：免版权音乐网站（如 FreePD、Incompetech）

---

## ⚙️ 配置 SillyTavern

### 第一步：打开正则设置

1. 在 SillyTavern 界面，点击右上角 **⚙ 设置图标**
2. 找到 **Extensions** 或 **扩展**
3. 点击 **Regex** 或 **正则表达式**

### 第二步：添加正则规则

点击 **Add Regex** 或 **新建规则**，填入：

**名称（Name）：**
```
Galgame Renderer
```

**查找（Find Pattern）：**
```regex
\[gal:scene=([^,\]]*),?char=([^,\]]*),?exp=([^\]]*)\]([\s\S]*?)\[\/gal\]
```

**替换（Replace With）：**
```html
<div style="width:100%;max-width:800px;margin:10px auto;">
<iframe src="https://你的用户名.github.io/galgame-renderer/?scene=$1&char=$2&exp=$3&text=$4" 
        style="width:100%;height:400px;border:none;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.3);"></iframe>
</div>
```

⚠️ **重要**：将 `你的用户名` 替换为你的 GitHub 用户名！

**其他设置：**
- ✅ 启用（Enable）
- Affects: AI output（影响 AI 输出）

### 第三步：保存并测试

让 AI 输出以下格式测试：

```
[gal:scene=教室,char=小明,exp=smile]你好，欢迎来到学校！[/gal]
```

如果看到 galgame 风格的界面，说明配置成功！

---

## 📝 AI 提示词模板

在角色卡的 **System Prompt** 或 **Jailbreak** 中添加：

```
当你描述场景时，请使用以下格式，系统会自动渲染为视觉小说界面：

[gal:scene=场景名,char=角色名,exp=表情]
对话内容
[/gal]

## 可用场景
- 教室、操场、家、街道、公园、夜晚

## 可用角色
- 小明、小红、老师

## 可用表情
- normal（普通）、smile（微笑）、sad（悲伤）、angry（生气）、shy（害羞）

## 示例
[gal:scene=教室,char=小明,exp=smile]
早上好！今天的天气真不错呢～
[/gal]

请在适当的时候使用这个格式来增强叙事效果。
```

---

## 🔧 高级用法

### 多角色场景

使用 `|` 分隔多个角色：

```
[gal:scene=教室,char=小明|小红,exp=smile|normal,pos=left|right]
两人一起聊天
[/gal]
```

### 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| scene | 场景名称 | 教室 |
| char | 角色名称 | 小明 |
| exp | 表情 | smile |
| pos | 位置 | left/center/right |
| speaker | 说话者（可选） | 小明 |

---

## ❓ 常见问题

### Q: 图片不显示？

1. 检查文件路径是否正确
2. 确认 GitHub Pages 已启用
3. 检查 `config.js` 中的路径配置
4. 浏览器控制台（F12）查看错误信息

### Q: 中文文件名无法加载？

建议使用英文或拼音命名文件，然后在 `config.js` 中配置中文显示名。

### Q: 正则不生效？

1. 确认 SillyTavern 的正则功能已启用
2. 检查正则表达式是否正确复制
3. 确认替换中的 URL 正确

### Q: BGM 不播放？

浏览器安全策略要求用户交互后才能播放音频。首次需要点击页面。

### Q: 如何自定义样式？

编辑 `style.css` 文件，可以修改：
- 对话框样式
- 字体大小
- 动画效果
- 配色方案

---

## 📄 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主页面 |
| `style.css` | 样式表 |
| `renderer.js` | 渲染逻辑 |
| `config.js` | 配置文件（角色、场景、表情） |

---

## 🆘 获取帮助

如果遇到问题，可以：
1. 检查浏览器控制台（F12）的错误信息
2. 确认所有文件都已正确上传
3. 访问 GitHub Issues 提问

---

## 📜 许可证

MIT License - 可自由使用、修改、分发。
