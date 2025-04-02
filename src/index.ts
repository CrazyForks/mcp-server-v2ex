import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequest,
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
    ListPromptsRequestSchema,
    Prompt,
    GetPromptRequestSchema,
    GetPromptRequest,
    GetPromptResult,
} from "@modelcontextprotocol/sdk/types.js"

interface GetUserNotificationsArgs {
    page: number;
}

interface RemoveNotificationsArgs {
    notification_id: string;
}


interface CreateNewTokenArgs {
    scope: string;
    expiration: number;
}

interface GetNodeArgs {
    node_name: string;
}

interface GetNodeTopicArgs {
    node_name: string;
    page: number;
}

interface GetTopicArgs {
    topic_id: number;
}

interface GetTopicCommentsArgs {
    topic_id: number;
    page: number;
}

// set default settings prompts about v2ex
const prompt_get_today_new_topics_in_some_node: Prompt = {
    name: "get-today-new-topics-in-some-node",
        description: "from given nodes name get new topic in each node",
        arguments:[
            {
                name: "node-names",
                description: "list of node names",
                type: "string",
                required: true
            }
        ]
};

const prompt_summerize_today_news_topic: Prompt = {
    name: "summerize-today-news-topic",
    description: `您是一位专业的中文新闻总结助手，专门负责分析和总结新闻话题记录。您的主要任务是从繁杂的群聊中提取关键信息，生成一份全面、简洁且易读的群聊报告。这份报告旨在帮助群成员快速了解当天的主要讨论内容，不错过重要信息。在v2ex上获取 qna,share,create,ideas 四个节点的新话题，并获取每个话题的回复, 并总结
，仔细阅读每个话题的总结，并按照以下详细指南创建一份高质量的今日总结报告：

报告标题： "今日V2EX热点"

重要提醒（如果有）：

在报告最上方，使用"❗️重要提醒"标注任何置顶或 @所有人 这种需要所有成员注意的信息
简明扼要地陈述提醒内容，确保醒目
话题概要： 分析并总结，请提供以下信息：

今日热门话题

[话题标题] ☆☆☆
时间点：HH:MM - HH:MM
内容摘要： [100-140字的讨论内容概括] ☑ 点评：[20-30字的简短评论]
[重复上述格式，呈现5个主要话题]

· 趣味互动

[如有趣味性的互动，在此处简要描述]
· 工具及其观点看法

[如有人寻求推荐或者请求对某件事的看法，在此处简要描述问题和观点]
· 待跟进事项

[负责人]：[具体任务] (截止日期：MM月DD日) [列出所有需要跟进的事项]
· 其他讨论话题

· 发言人字数统计
【每日发言字数变化】：
[ASCII-art 统计图表]
【总体发言字数】：xxx字
【整体发言字数统计】
[成员 发言字数统计]

其中[ASCII-art 统计图表]使用以下示例形式:

· 发言人字数统计

【每日发言字数变化】：
2025-03-15 | ####### 7000字
2025-03-16 | ######## 8500字
2025-03-17 | ##### 5000字
2025-03-18 | ######### 9500字
2025-03-19 | ###### 6000字


[如果有更多话题，在此简要列出]
· 结语 [简短的总结语，鼓励继续积极参与讨论]

在分析记录时，请特别注意以下几点：
识别并关注高频词汇和反复出现的主题
留意群成员的情绪变化和互动模式
捕捉讨论中的转折点和关键决策时刻
在处理敏感话题时：
使用中性语言描述，避免偏袒任何一方
如果话题过于敏感，可以概括性地提及而不深入细节
必要时，可以咨询群管理员如何处理特定的敏感信息
提高报告的实用性：
对于技术性讨论，可以添加简短的解释或背景信息

为重要信息或关键结论添加醒目的标记，如"💡关键点"或"🌟亮点"
您的目标是创建一份既全面又易读、既专业又富有人情味的新闻话题总结报告。通过您的工作，帮助用户更好的了解v2ex动态`,
    arguments: []
};


const PROMPTS : {[key: string]: Prompt} = {
    "get-today-new-topics-in-some-node" : prompt_get_today_new_topics_in_some_node,
    "summerize-today-news-topic": prompt_summerize_today_news_topic,
};


const GetNotificationTool: Tool  = {
    name: "v2ex_notification",
    description: "get v2ex user notification",
    inputSchema: {
        type: "object",
        properties: {
            page: {
                type: "number",
                description: "page number, notification Pagination number, default is 1",
                default: 1
            }
        },
        required: ["page"]
    },
};

const RemoveNotificationTool: Tool  = {
    name: "v2ex_remove_notification",
    description: "remove v2ex user notification",
    inputSchema: {
        type: "object",
        properties: {
            notification_id: {
                type: "string",
                description: "notification id",
            }
        },
        required: ["notification_id"]
    },
};


const GetProfileTool: Tool  = {
    name: "v2ex_member_profile",
    description: "get v2ex user profile",
    inputSchema: {
        type: "object",
        properties: {
            
        },
        required: []
    },
};

const GetNodeTool: Tool  = {
    name: "v2ex_node",
    description: "get v2ex node",
    inputSchema: {
        type: "object",
        properties: {
            node_name: {
                type: "string",
                description: "v2ex node name",
            }
        },
        required: ["node_name"]
    }
};

const GetNodeTopicTool: Tool  = {
    name: "v2ex_node_topic",
    description: "get v2ex node topic",
    inputSchema: {
        type: "object",
        properties: {
            node_name: {
                type: "string",
                description: "v2ex node name",
            },
            page: {
                type: "number",
                description: "page number for current node topics list, default is 1",
                default: 1
            }
        },
        required: ["node_name"]
    }
};

const GetTopicTool : Tool = {
    name: "v2ex_topic",
    description: "get v2ex topic",
    inputSchema: {
        type: "object",
        properties: {
            topic_id: {
                type: "number",
                description: "v2ex topic id",
                }
            },
        required: ["topic_id"]
    }
};

const GetTopicComentsTool : Tool = {
    name: "v2ex_topic_comments",
    description: "get v2ex topic comments",
    inputSchema: {
        type: "object",
        properties: {
            topic_id: {
                type: "number",
                description: "v2ex topic id",
                },
            page: {
                type: "number",
                description: "page number for current topic comments, default is 1",
                default: 1
            }
        },
        required: ["topic_id"]
    }
};

const GetCurrentTokenTool : Tool = {
    name: "v2ex_current_token",
    description: "get v2ex current user token",
    inputSchema: {
        type: "object",
        properties: {
            
        },
        required: []
    }
};

const CreateNewTokenTool : Tool = {
    name: "v2ex_create_new_token",
    description: "create v2ex user new token",
    inputSchema: {
        type: "object",
        properties: {
            scope: {
                type: "string",
                description: "v2ex token scope",
                default: "everything",
            },
            expiration: {
                type: "number",
                description: "v2ex token expiration",
            }
        },
        required: ["scope", "expiration"]
    }
};



class V2exClient {
    private botHeader : { Authorization: string, "Content-Type": string};
    
    constructor (botToken: string){
        this.botHeader = {
            Authorization: `Bearer ${botToken}`,
            "Content-Type": "application/json",
        };
    }

    async GetMember(): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/member`,{headers: this.botHeader},
        );

        return response.json();
    }

    async GetNotification(page: number): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/notifications?p=${page}`,{headers: this.botHeader},
        );

        return response.json();
    }

    async RemoveNotification(notification_id: string): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/notifications/${notification_id}`,{headers: this.botHeader},
        );

        return response.json();
    }

    async GetNode(node_name: string): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/nodes/${node_name}`,{headers: this.botHeader},
        );

        return response.json();
    }

    async GetNodeTopic(node_name: string, page: number): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/nodes/${node_name}/topics?p=${page.toString()}`,{headers: this.botHeader},
        );
        return response.json();
    }

    async GetTopic (topic_id: number): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/topics/${topic_id.toString()}`,{headers: this.botHeader},
        );
        return response.json();
    }

    async GetTopicComments (topic_id: number, page: number): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/topics/${topic_id}/replies?p=${page.toString()}`,{headers: this.botHeader},
            );
        return response.json();
    }
    
    async GetCurrentToken(): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/token`, {headers: this.botHeader},
        );
        return response.json();
    }

    async CreateNewToken(scope: string, expiration: number): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/tokens`,{headers: this.botHeader, method: "POST", body: JSON.stringify({scope: scope, expiration: expiration})},
        );
        return response.json();
    }
}

async function main() {
    const  botToken = process.env.V2EX_API_KEY;

    if (!botToken) {
        console.error("Please set V2EX_API_KEY environment variable in mcp config files.");
        process.exit(1);
    }

    console.error("start mcp server for v2ex");
    const server = new Server(
        {name: "V2ex MCP server", version: "0.1.0"},
        {
            capabilities: {
                tools: {},
                prompts: {}
            },
        },

    );

    const v2exClient = new V2exClient(botToken);
    server.setRequestHandler(
        CallToolRequestSchema,
        async(request: CallToolRequest) => {
            console.error("Recevied CallToolRequest:", request);
            try {
                // if (!request.params.arguments) {
                //     throw new Error("No argument provied");
                // }
                switch (request.params.name){
                    case "v2ex_notification": {
                        const args = request.params.arguments as unknown as GetUserNotificationsArgs;
                        const response = await v2exClient.GetNotification(
                            args.page
                        );
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_remove_notification": {
                        const args = request.params.arguments as unknown as RemoveNotificationsArgs;
                        const response = await v2exClient.RemoveNotification(
                            args.notification_id
                        );
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_member_profile": {
                        const response = await v2exClient.GetMember();
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_node": {
                        const args = request.params.arguments as unknown as GetNodeArgs;
                        const response = await v2exClient.GetNode(
                            args.node_name
                        );
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_node_topic": {
                        const args = request.params.arguments as unknown as GetNodeTopicArgs;
                        const response = await v2exClient.GetNodeTopic(
                            args.node_name,
                            args.page
                        );
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_topic": {
                        const args = request.params.arguments as unknown as GetTopicArgs;
                        const response = await v2exClient.GetTopic(
                            args.topic_id
                        );
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_topic_comments": {
                        const args = request.params.arguments as unknown as GetTopicCommentsArgs;
                        const response = await v2exClient.GetTopicComments(
                            args.topic_id,
                            args.page
                        );
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_current_token": {
                        const response = await v2exClient.GetCurrentToken();
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    case "v2ex_create_new_token": {
                        const args = request.params.arguments as unknown as CreateNewTokenArgs;
                        const response = await v2exClient.CreateNewToken(
                            args.scope,
                            args.expiration
                        );
                        return {
                            content: [{type:"text", text: JSON.stringify(response)}],
                        };
                    }
                    default: {
                        throw new Error("Unsupported tool name");
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                return {
                    content: [{type:"text", text: JSON.stringify({error: error instanceof Error ? error.message : String(error)})}],
                };
            }
        },
    );

    server.setRequestHandler(ListToolsRequestSchema, async() => {
        console.error("Recevied ListToolsRequest");

        return {
            tools: [
                GetNotificationTool,
                RemoveNotificationTool,
                GetProfileTool,
                GetNodeTool,
                GetNodeTopicTool,
                GetTopicTool,
                GetTopicComentsTool,
                GetCurrentTokenTool,
                CreateNewTokenTool,
                
            ],
        };
    });

    server.setRequestHandler(ListPromptsRequestSchema, async() => {
        console.error("Recevied ListPromptsRequest");
        return {
            prompts: Object.values(PROMPTS),
        };
    });

    server.setRequestHandler(GetPromptRequestSchema, async(request: GetPromptRequest): Promise<GetPromptResult> => {
        console.error("Recevied GetPromptRequest:", request);
        const prompt = PROMPTS[request.params.name];
        if (!prompt) {
            throw new Error(`Prompt not found: ${request.params.name}`);
        };
        switch (request.params.name){
            case "get-today-new-topics-in-some-node": {
                return {
                    messages: [{
                        role: "user",
                        content: {type:"text", text: JSON.stringify(prompt)},
                    }],
                };
            }
            case "summerize-today-news-topic": {
                return {
                    messages: [{
                        role: "user",
                        content: {type:"text", text: JSON.stringify(prompt)},
                    }],
                };
            }
            default: {
                throw new Error("Unsupported prompt name");
            };
        };
    });
    const transport = new StdioServerTransport();
    console.error("Connect server to transport...");
    await server.connect(transport);

    console.error("V2ex MCP server Running in stdio.");
}


main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

