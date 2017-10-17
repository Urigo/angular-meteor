import { MongoObservable } from 'meteor-rxjs';
import { Chat } from '../models';

export const Chats = new MongoObservable.Collection<Chat>('chats');
