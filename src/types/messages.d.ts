import type { PlasmoMessaging } from "@plasmohq/messaging";

export type GTAMessageType = "ADD" | "GET_RECENTS" | "GET_ONE" | "GET_ALL" | "DELETE_ONE" | "DELETE_ALL"

interface MessageBase {
    type: MessageType;
}

interface MessageAdd extends MessageBase {
    type: "ADD",
    tabName: string;
    tabContent: string;
}

interface MessageQueryOne extends MessageBase {
    type: "GET_ONE";
    tabName: string;
}

interface MessageQueryAll extends MessageBase {
    type: "GET_ALL";
}


interface MessageQueryRecents extends MessageBase {
    type: "GET_RECENTS";
}

interface MessageDeleteOne extends MessageBase {
    type: "DELETE_ONE";
    tabName: string;
}

interface MessageDeleteAll extends MessageBase {
    type: "DELETE_ALL";
}

export type GTAMessage = MessageAdd | MessageQueryOne | MessageQueryAll | MessageQueryRecents | MessageDeleteOne | MessageDeleteAll

type MessageResultQueryOne = string
type MessageResultQueryAll = string[]

export type GTAMessageResult = MessageResultQueryAll | MessageResultQueryOne
