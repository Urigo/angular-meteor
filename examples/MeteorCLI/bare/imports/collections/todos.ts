import { MongoObservable } from 'meteor-rxjs';

import { Todo } from '../models/todo';

export const Todos = new MongoObservable.Collection<Todo>('todos');
