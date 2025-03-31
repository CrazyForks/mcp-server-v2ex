import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequest,
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool
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
            `https://www.v2ex.com/api/v2/nodes/${node_name}/topics?p=${page}`,{headers: this.botHeader},
        );
        return response.json();
    }

    async GetTopic (topic_id: number): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/topics/${topic_id}`,{headers: this.botHeader},
        );
        return response.json();
    }

    async GetTopicComments (topic_id: number, page: number): Promise<any> {
        const response = await fetch(
            `https://www.v2ex.com/api/v2/topics/${topic_id}/replies?p=${page}`,{headers: this.botHeader},
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

    const transport = new StdioServerTransport();
    console.error("Connect server to transport...");
    await server.connect(transport);

    console.error("V2ex MCP server Running in stdio.");
}


main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

