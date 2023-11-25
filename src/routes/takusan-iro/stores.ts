import { writable } from "svelte/store";

export let colors = writable<{ latestId: number; values: ColorItem[] }>({
    latestId: 0,
    values: [],
});
