import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequest,
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool

} from "@modelcontextprotocol/sdk/types.js"
import { object } from "zod";

interface GetMemberArgs {
    user_id: string;
}

interface GetUserNotificationsArgs {
    page: number;
}

interface RemoveNotificationsArgs {
    notification_id: string;
}

interface GetCurrentTokenArgs {

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
                description: "page number for current node topics, default is 1",
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


class V2exClient {
    
}



