# mcp-server-v2ex

## 项目说明
`mcp-server-v2ex` 是一个面向 MCP-compatible agents 和开发工具的 MCP server，对 V2EX API 2.0 做了一层封装。它提供了结构化工具接口，可用于通知读取、token 管理、用户资料查询、节点浏览、主题内容获取、回复获取，以及今日热点摘要。

这个项目的定位是可复用的通用集成层，而不是某个单一客户端的专用插件，因此可以接入 Claude Desktop、Codex 以及其他支持 Model Context Protocol 的工具。

英文主文档见 [README.md](./README.md)。

## 可用工具
- `notifications`：获取最新提醒
- `delete_notifications`：删除指定提醒
- `member_profile`：获取当前 API token 对应用户的档案
- `token`：查看当前 API token
- `create_token`：创建新的 API token
- `nodes`：获取节点信息
- `node_topics`：获取指定节点下的话题列表
- `topic_detail`：获取指定话题的详细内容
- `topic_comments`：获取指定话题的回复
- `daily_summary`：生成近期热点话题摘要

## 安装
通过 npm 安装：

```bash
npm install -g mcp-server-v2ex
```

## 配置
先在 [V2EX token 设置页](https://www.v2ex.com/settings/tokens) 创建或获取自己的 API token。

然后在 MCP 客户端配置中加入类似下面的配置：

```json
{
  "v2ex": {
    "command": "%APP_DATA%\\Local\\nvm\\v22.14.0\\node.exe",
    "args": [
      "%APP_DATA%\\Local\\nvm\\v22.14.0\\node_modules\\mcp-server-v2ex\\dist\\index.js"
    ],
    "env": {
      "V2EX_API_KEY": "your-token-here",
      "NODE_TLS_REJECT_UNAUTHORIZED": "0"
    }
  }
}
```

`NODE_TLS_REJECT_UNAUTHORIZED=0` 只适用于少数本地网络场景，例如使用 MITM 代理工具时。除非你清楚它的安全影响，否则不要启用。

## 变更记录
- `v0.1.1` / `2025-04-02`
  - 新增今日热点摘要
  - ![img](./img/v2ex_today_summerize.png)
- `v0.1.0`
  - 完成首个功能完整版本

## 路线图
- 继续改进面向 agent workflow 的每日热点摘要能力
- 补充更多 MCP 客户端的接入文档
