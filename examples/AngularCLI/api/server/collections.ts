

import { Todo } from './models';
import { MongoObservable } from 'meteor-rxjs';

export const Todos = new MongoObservable.Collection<Todo>('todos');
