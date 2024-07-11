// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
}

type ColorItem = {
    id: number;
    value: Color;
};

/**
 * https://github.com/isaacHagoel/svelte-dnd-action
 *
 * If you are using Typescript, you will need to add the following block to
 * your global.d.ts (at least until this svelte issue is resolved):
 */
declare type Item = import("svelte-dnd-action").Item;
declare type DndEvent<ItemType = Item> =
    import("svelte-dnd-action").DndEvent<ItemType>;
declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onconsider?: (
            event: CustomEvent<DndEvent<ItemType>> & {
                target: EventTarget & T;
            },
        ) => void;
        onfinalize?: (
            event: CustomEvent<DndEvent<ItemType>> & {
                target: EventTarget & T;
            },
        ) => void;
    }
}
