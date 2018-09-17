针对[欧陆风云4字节码补丁](https://github.com/matanki-saito/EU4dll)的文本处理程序
============================

## 所含功能
- 补丁所用文本本的转码和解码
- 低版本语言本地化文件的升级<br>
  高版本英文原版+低版本中文译文 => 高版本中文译文[(高版未翻译的文本不做处理)

## 目录结构
```
应用目录
├── decoding.js 解码程序
├── decoding.config.json 解码程序配置
├── encoding.js 转码程序
├── encoding.config.json 转码程序配置
├── translate.js 低版本语言本地化文件的升级程序
├── translate.config.json 转化配置
├── source  源文件 （默认）
|    ├── en  高版本语言本地化文件英文原版
|    |   └── localisation 
|    └── zh  语言本地化文件中文译文
|        └── localisation
└── dist （默认）
     ├── localisation 高版本中文译文目录
     ├── decoding  解码后文本生成目录
     |   └── localisation 
     └── encoding 转码后文本生成目录
         └── localisation

```

## 关联库
[EU4dll](https://github.com/matanki-saito/EU4dll/)
[EU4SpecialEscape](https://github.com/matanki-saito/EU4SpecialEscape/)