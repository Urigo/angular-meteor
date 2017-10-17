export enum MessageType {
  TEXT = <any>'text'
}

export interface Chat {
  _id?: string;
  title?: string;
  picture?: string;
  lastMessage?: Message;
  memberIds?: string[];
}

export interface Message {
  _id?: string;
  chatId?: string;
  senderId?: string;
  content?: string;
  createdAt?: Date;
  type?: MessageType
  ownership?: string;
}
