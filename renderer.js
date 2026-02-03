/**
 * Galgame Renderer - 主渲染逻辑
 * 
 * 解析 URL 参数，渲染 galgame 界面
 */

class GalgameRenderer {
    constructor() {
        // DOM 元素
        this.container = document.getElementById('galgame-container');
        this.backgroundLayer = document.getElementById('background-layer');
        this.charLeft = document.getElementById('char-left');
        this.charCenter = document.getElementById('char-center');
        this.charRight = document.getElementById('char-right');
        this.speakerName = document.getElementById('speaker-name');
        this.dialogText = document.getElementById('dialog-text');
        this.clickIndicator = document.getElementById('click-indicator');
        
        // 音频元素
        this.bgmPlayer = document.getElementById('bgm-player');
        this.sfxPlayer = document.getElementById('sfx-player');
        
        // 状态
        this.history = [];
        this.isTyping = false;
        this.isAutoMode = false;
        this.autoTimer = null;
        this.currentText = '';
        this.typingIndex = 0;
        this.typingTimer = null;
        
        // 设置
        this.settings = {
            textSpeed: CONFIG.defaults.textSpeed,
            autoSpeed: CONFIG.defaults.autoSpeed,
            bgmVolume: CONFIG.defaults.bgmVolume
        };
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化渲染器
     */
    init() {
        // 解析 URL 参数
        const params = this.parseURLParams();
        
        // 加载保存的设置
        this.loadSettings();
        
        // 绑定事件
        this.bindEvents();
        
        // 渲染场景
        if (params.scene || params.char || params.text) {
            this.render(params);
        } else {
            // 显示欢迎信息
            this.showWelcome();
        }
    }
    
    /**
     * 解析 URL 参数
     */
    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        return {
            scene: urlParams.get('scene') || '',
            char: urlParams.get('char') || '',
            exp: urlParams.get('exp') || 'normal',
            pos: urlParams.get('pos') || 'center',
            text: urlParams.get('text') || '',
            speaker: urlParams.get('speaker') || urlParams.get('char') || '',
            bgm: urlParams.get('bgm') || ''
        };
    }
    
    /**
     * 渲染场景
     */
    render(params) {
        // 设置背景
        if (params.scene) {
            this.setBackground(params.scene);
        }
        
        // 设置角色
        if (params.char) {
            this.setCharacters(params.char, params.exp, params.pos);
        }
        
        // 设置对话
        if (params.text) {
            this.setDialog(params.speaker || params.char, params.text);
        }
        
        // 播放 BGM
        if (params.bgm) {
            this.playBGM(params.bgm);
        }
    }
    
    /**
     * 设置背景
     */
    setBackground(sceneName) {
        const scene = CONFIG.scenes[sceneName];
        
        if (scene) {
            const imagePath = CONFIG.basePath + scene.image;
            
            // 淡入效果
            this.backgroundLayer.classList.add('fade');
            
            setTimeout(() => {
                this.backgroundLayer.style.backgroundImage = `url('${imagePath}')`;
                this.backgroundLayer.classList.remove('fade');
                
                // 如果场景有 BGM，播放它
                if (scene.bgm && !this.bgmPlayer.src) {
                    this.playBGM(scene.bgm);
                }
            }, 300);
        } else {
            // 尝试直接使用场景名作为图片路径
            const imagePath = `${CONFIG.basePath}backgrounds/${sceneName}.jpg`;
            this.backgroundLayer.style.backgroundImage = `url('${imagePath}')`;
        }
    }
    
    /**
     * 设置角色
     * 支持多角色：char=小明|小红, exp=smile|normal, pos=left|right
     */
    setCharacters(charStr, expStr, posStr) {
        // 先隐藏所有角色
        this.charLeft.classList.remove('visible', 'speaking', 'dim');
        this.charCenter.classList.remove('visible', 'speaking', 'dim');
        this.charRight.classList.remove('visible', 'speaking', 'dim');
        
        // 解析多角色
        const chars = charStr.split('|');
        const exps = expStr.split('|');
        const positions = posStr.split('|');
        
        chars.forEach((charName, index) => {
            const character = CONFIG.characters[charName];
            if (!character) {
                console.warn(`角色 "${charName}" 未在配置中找到`);
                return;
            }
            
            // 获取表情
            let expression = exps[index] || exps[0] || character.defaultExpression;
            
            // 表情别名映射
            if (CONFIG.expressionAliases[expression]) {
                expression = CONFIG.expressionAliases[expression];
            }
            
            // 获取位置
            const position = positions[index] || positions[0] || 'center';
            
            // 构建图片路径
            const expFile = character.expressions[expression] || 
                           character.expressions[character.defaultExpression];
            const imagePath = `${CONFIG.basePath}${character.folder}/${expFile}`;
            
            // 选择角色容器
            let charElement;
            switch (position.toLowerCase()) {
                case 'left':
                case '左':
                    charElement = this.charLeft;
                    break;
                case 'right':
                case '右':
                    charElement = this.charRight;
                    break;
                default:
                    charElement = this.charCenter;
            }
            
            // 设置角色图片并显示
            charElement.style.backgroundImage = `url('${imagePath}')`;
            charElement.classList.add('visible');
            
            // 第一个角色标记为说话状态
            if (index === 0) {
                charElement.classList.add('speaking');
            } else {
                charElement.classList.add('dim');
            }
        });
    }
    
    /**
     * 设置对话
     */
    setDialog(speaker, text) {
        // 设置说话者名字
        if (speaker) {
            const character = CONFIG.characters[speaker];
            this.speakerName.textContent = character ? character.name : speaker;
            
            if (character && character.color) {
                this.speakerName.style.background = 
                    `linear-gradient(135deg, ${character.color} 0%, ${this.darkenColor(character.color, 20)} 100%)`;
            }
        } else {
            this.speakerName.textContent = '';
        }
        
        // 打字机效果显示文字
        this.typeText(text);
        
        // 添加到历史记录
        this.addToHistory(speaker, text);
    }
    
    /**
     * 打字机效果
     */
    typeText(text) {
        // 停止之前的打字
        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }
        
        this.currentText = text;
        this.typingIndex = 0;
        this.isTyping = true;
        this.dialogText.innerHTML = '';
        this.clickIndicator.style.opacity = '0';
        
        const typeNext = () => {
            if (this.typingIndex < this.currentText.length) {
                this.dialogText.innerHTML += this.currentText.charAt(this.typingIndex);
                this.typingIndex++;
                this.typingTimer = setTimeout(typeNext, this.settings.textSpeed);
            } else {
                this.isTyping = false;
                this.clickIndicator.style.opacity = '1';
                
                // 自动模式
                if (this.isAutoMode) {
                    this.autoTimer = setTimeout(() => {
                        this.onNext();
                    }, this.settings.autoSpeed);
                }
            }
        };
        
        typeNext();
    }
    
    /**
     * 立即显示全部文字
     */
    showFullText() {
        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }
        this.dialogText.innerHTML = this.currentText;
        this.isTyping = false;
        this.clickIndicator.style.opacity = '1';
    }
    
    /**
     * 播放 BGM
     */
    playBGM(bgmPath) {
        const path = bgmPath.startsWith('http') ? bgmPath : CONFIG.basePath + bgmPath;
        
        if (this.bgmPlayer.src !== path) {
            this.bgmPlayer.src = path;
            this.bgmPlayer.volume = this.settings.bgmVolume;
            
            // 用户交互后才能播放音频
            this.bgmPlayer.play().catch(() => {
                // 等待用户点击后播放
                document.addEventListener('click', () => {
                    this.bgmPlayer.play();
                }, { once: true });
            });
        }
    }
    
    /**
     * 播放音效
     */
    playSFX(sfxName) {
        const sfxPath = CONFIG.sfx[sfxName];
        if (sfxPath) {
            this.sfxPlayer.src = CONFIG.basePath + sfxPath;
            this.sfxPlayer.play();
        }
    }
    
    /**
     * 添加到历史记录
     */
    addToHistory(speaker, text) {
        this.history.push({ speaker, text, time: new Date() });
        this.updateHistoryPanel();
    }
    
    /**
     * 更新历史记录面板
     */
    updateHistoryPanel() {
        const historyContent = document.getElementById('history-content');
        historyContent.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="speaker">${item.speaker || '旁白'}</div>
                <div class="text">${item.text}</div>
            </div>
        `).join('');
        
        // 滚动到底部
        historyContent.scrollTop = historyContent.scrollHeight;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 点击对话框继续
        document.getElementById('dialog-box').addEventListener('click', () => {
            if (this.isTyping) {
                this.showFullText();
            }
        });
        
        // 自动模式按钮
        document.getElementById('btn-auto').addEventListener('click', () => {
            this.toggleAutoMode();
        });
        
        // 跳过按钮
        document.getElementById('btn-skip').addEventListener('click', () => {
            this.showFullText();
        });
        
        // 历史记录按钮
        document.getElementById('btn-log').addEventListener('click', () => {
            this.toggleHistory();
        });
        
        // 设置按钮
        document.getElementById('btn-settings').addEventListener('click', () => {
            this.toggleSettings();
        });
        
        // 设置滑块
        document.getElementById('text-speed').addEventListener('input', (e) => {
            this.settings.textSpeed = 110 - e.target.value; // 反转滑块方向
            this.saveSettings();
        });
        
        document.getElementById('auto-speed').addEventListener('input', (e) => {
            this.settings.autoSpeed = parseInt(e.target.value);
            this.saveSettings();
        });
        
        document.getElementById('bgm-volume').addEventListener('input', (e) => {
            this.settings.bgmVolume = e.target.value / 100;
            this.bgmPlayer.volume = this.settings.bgmVolume;
            this.saveSettings();
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                case 'Enter':
                    if (this.isTyping) {
                        this.showFullText();
                    }
                    break;
                case 'a':
                case 'A':
                    this.toggleAutoMode();
                    break;
                case 'h':
                case 'H':
                    this.toggleHistory();
                    break;
                case 'Escape':
                    this.closeAllPanels();
                    break;
            }
        });
    }
    
    /**
     * 切换自动模式
     */
    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        const btn = document.getElementById('btn-auto');
        
        if (this.isAutoMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
            if (this.autoTimer) {
                clearTimeout(this.autoTimer);
            }
        }
    }
    
    /**
     * 切换历史记录面板
     */
    toggleHistory() {
        const panel = document.getElementById('history-panel');
        panel.classList.toggle('hidden');
    }
    
    /**
     * 切换设置面板
     */
    toggleSettings() {
        const panel = document.getElementById('settings-panel');
        panel.classList.toggle('hidden');
    }
    
    /**
     * 关闭所有面板
     */
    closeAllPanels() {
        document.getElementById('history-panel').classList.add('hidden');
        document.getElementById('settings-panel').classList.add('hidden');
    }
    
    /**
     * 保存设置到 localStorage
     */
    saveSettings() {
        localStorage.setItem('galgame-settings', JSON.stringify(this.settings));
    }
    
    /**
     * 加载设置
     */
    loadSettings() {
        const saved = localStorage.getItem('galgame-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            
            // 更新 UI
            document.getElementById('text-speed').value = 110 - this.settings.textSpeed;
            document.getElementById('auto-speed').value = this.settings.autoSpeed;
            document.getElementById('bgm-volume').value = this.settings.bgmVolume * 100;
        }
    }
    
    /**
     * 显示欢迎信息
     */
    showWelcome() {
        this.speakerName.textContent = '系统';
        this.typeText('欢迎使用 Galgame Renderer！请通过 URL 参数传入场景、角色和对话内容。');
    }
    
    /**
     * 工具函数：加深颜色
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        
        return '#' + (0x1000000 + 
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
    
    /**
     * 下一步（用于自动模式）
     */
    onNext() {
        // 在独立页面中无需实现
        // 如果需要多页对话，可以在这里扩展
    }
}

// 全局函数供 HTML 调用
function toggleHistory() {
    if (window.galgame) {
        window.galgame.toggleHistory();
    }
}

function toggleSettings() {
    if (window.galgame) {
        window.galgame.toggleSettings();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.galgame = new GalgameRenderer();
});
