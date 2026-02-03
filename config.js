/**
 * Galgame Renderer - 配置文件
 * 
 * 在这里配置你的角色、场景和素材路径
 * 修改这个文件来添加新的角色和场景
 */

const CONFIG = {
    // ========================================
    // 基础设置
    // ========================================
    
    // 素材基础路径（如果素材在子目录，修改这里）
    // 例如：'./assets/' 或 'https://cdn.example.com/'
    basePath: './',
    
    // 默认设置
    defaults: {
        textSpeed: 50,      // 文字显示速度 (ms/字符)
        autoSpeed: 3000,    // 自动播放间隔 (ms)
        bgmVolume: 0.5,     // BGM 音量 (0-1)
        sfxVolume: 0.8      // 音效音量 (0-1)
    },
    
    // ========================================
    // 角色配置
    // ========================================
    // 
    // 添加新角色：
    // 1. 在 characters 文件夹中创建角色文件夹（如：characters/小明/）
    // 2. 放入不同表情的立绘图片（如：normal.png, smile.png）
    // 3. 在下方添加角色配置
    //
    characters: {
        // 角色：小明
        "小明": {
            name: "小明",                           // 显示名称
            folder: "characters/小明",              // 素材文件夹
            color: "#4a90d9",                       // 名字颜色
            expressions: {
                "normal": "normal.png",             // 普通表情
                "smile": "smile.png",               // 微笑
                "sad": "sad.png",                   // 悲伤
                "angry": "angry.png",               // 生气
                "surprised": "surprised.png",       // 惊讶
                "shy": "shy.png"                    // 害羞
            },
            defaultExpression: "normal"             // 默认表情
        },
        
        // 角色：小红
        "小红": {
            name: "小红",
            folder: "characters/小红",
            color: "#e74c3c",
            expressions: {
                "normal": "normal.png",
                "smile": "smile.png",
                "sad": "sad.png",
                "angry": "angry.png",
                "shy": "shy.png"
            },
            defaultExpression: "normal"
        },
        
        // 角色：老师
        "老师": {
            name: "老师",
            folder: "characters/老师",
            color: "#9b59b6",
            expressions: {
                "normal": "normal.png",
                "smile": "smile.png",
                "serious": "serious.png"
            },
            defaultExpression: "normal"
        }
        
        // 添加更多角色...
        // "新角色": {
        //     name: "新角色",
        //     folder: "characters/新角色",
        //     color: "#颜色代码",
        //     expressions: {
        //         "表情名": "文件名.png"
        //     },
        //     defaultExpression: "normal"
        // }
    },
    
    // ========================================
    // 场景/背景配置
    // ========================================
    //
    // 添加新场景：
    // 1. 在 backgrounds 文件夹中放入背景图片
    // 2. 在下方添加场景配置
    //
    scenes: {
        // 场景：教室
        "教室": {
            image: "backgrounds/教室.jpg",
            bgm: "audio/bgm/school.mp3"             // 可选：场景 BGM
        },
        
        // 场景：操场
        "操场": {
            image: "backgrounds/操场.jpg",
            bgm: "audio/bgm/outdoor.mp3"
        },
        
        // 场景：家
        "家": {
            image: "backgrounds/家.jpg",
            bgm: "audio/bgm/home.mp3"
        },
        
        // 场景：街道
        "街道": {
            image: "backgrounds/街道.jpg",
            bgm: "audio/bgm/city.mp3"
        },
        
        // 场景：公园
        "公园": {
            image: "backgrounds/公园.jpg",
            bgm: "audio/bgm/park.mp3"
        },
        
        // 场景：夜晚
        "夜晚": {
            image: "backgrounds/夜晚.jpg",
            bgm: "audio/bgm/night.mp3"
        }
        
        // 添加更多场景...
        // "新场景": {
        //     image: "backgrounds/新场景.jpg",
        //     bgm: "audio/bgm/xxx.mp3"  // 可选
        // }
    },
    
    // ========================================
    // 表情别名映射
    // ========================================
    // 
    // AI 可能输出不同的表情描述，这里映射到标准表情名
    //
    expressionAliases: {
        // 微笑相关
        "微笑": "smile",
        "开心": "smile",
        "高兴": "smile",
        "笑": "smile",
        "happy": "smile",
        
        // 悲伤相关
        "悲伤": "sad",
        "难过": "sad",
        "伤心": "sad",
        "哭": "sad",
        
        // 生气相关
        "生气": "angry",
        "愤怒": "angry",
        "恼火": "angry",
        
        // 惊讶相关
        "惊讶": "surprised",
        "吃惊": "surprised",
        "震惊": "surprised",
        
        // 害羞相关
        "害羞": "shy",
        "脸红": "shy",
        "羞涩": "shy",
        
        // 普通
        "普通": "normal",
        "平静": "normal",
        "默认": "normal"
    },
    
    // ========================================
    // 音效配置
    // ========================================
    sfx: {
        click: "audio/sfx/click.mp3",
        transition: "audio/sfx/transition.mp3"
    }
};

// 不要修改这行 - 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
