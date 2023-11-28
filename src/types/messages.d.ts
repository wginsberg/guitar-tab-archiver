import type { PlasmoMessaging } from "@plasmohq/messaging";

export type GTAMessageType = "ADD" | "GET_RECENTS" | "GET_ONE" | "GET_ALL" | "GET_COUNT" | "DELETE_ONE" | "DELETE_ALL"

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

interface MessageQueryCount extends MessageBase {
    type: "GET_COUNT"
}

interface MessageDeleteOne extends MessageBase {
    type: "DELETE_ONE";
    tabName: string;
}

interface MessageDeleteAll extends MessageBase {
    type: "DELETE_ALL";
}

export type GTAMessage = MessageAdd | MessageQueryOne | MessageQueryAll | MessageQueryRecents | MessageQueryCount | MessageDeleteOne | MessageDeleteAll

type MessageResultQueryOne = string
type MessageResultQueryAll = string[]
type MessageResultQueryCount = Number

export type GTAMessageResult = MessageResultQueryAll | MessageResultQueryOne | MessageResultQueryCount
