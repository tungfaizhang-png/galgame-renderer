# ⚡ 快速开始指南

这是一份简化的快速开始指南，帮你在 10 分钟内完成部署。

---

## 📦 你会得到什么

当 AI 在 SillyTavern 中输出：
```
[gal:scene=教室,char=小明,exp=smile]你好！[/gal]
```

会自动变成这样的 Galgame 界面：
- 🖼️ 教室背景
- 👤 小明的微笑立绘
- 💬 对话框显示「你好！」

---

## 🚀 5 步完成部署

### Step 1: Fork 或下载

把整个 `galgame-renderer` 文件夹上传到你的 GitHub。

### Step 2: 添加素材

在文件夹中添加：
- `characters/角色名/表情.png` - 角色立绘
- `backgrounds/场景名.jpg` - 场景背景

### Step 3: 修改配置

编辑 `config.js`，添加你的角色和场景（参考现有示例）。

### Step 4: 启用 GitHub Pages

仓库 Settings → Pages → 选择 main branch → Save

等待 1-2 分钟，你会得到网址：
`https://你的用户名.github.io/galgame-renderer/`

### Step 5: 配置 SillyTavern

在 SillyTavern 的 Regex 设置中添加：

**查找：**
```
\[gal:scene=([^,\]]*),?char=([^,\]]*),?exp=([^\]]*)\]([\s\S]*?)\[\/gal\]
```

**替换：**（把 `你的用户名` 换成你的）
```html
<iframe src="https://你的用户名.github.io/galgame-renderer/?scene=$1&char=$2&exp=$3&text=$4" style="width:100%;height:400px;border:none;border-radius:12px;"></iframe>
```

---

## ✅ 测试

让 AI 输出：
```
[gal:scene=教室,char=小明,exp=smile]测试成功！[/gal]
```

如果看到 Galgame 界面，恭喜你成功了！🎉

---

## 📖 详细教程

查看 [README.md](README.md) 获取完整说明。
