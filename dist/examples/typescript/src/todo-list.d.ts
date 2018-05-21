export interface Todo {
    name: string;
    priority: string;
}
export declare class TodoList {
    items: Todo[];
    add(todo: Todo): void;
}
