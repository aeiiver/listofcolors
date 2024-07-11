<script lang="ts">
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import { flip } from "svelte/animate";

    import Color from "color";

    import { colors } from "./stores";
    import ColorListItem from "./ColorListItem.svelte";

    // Drop-n-drag
    let dragDisabled = true;
    const flipDurationMs = 100;
    function dndConsider(e: CustomEvent<DndEvent<ColorItem>>) {
        const {
            items: newItems,
            info: { source, trigger },
        } = e.detail;
        $colors.values = newItems;

        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            dragDisabled = true;
        }
    }
    function dndFinalize(e: CustomEvent<DndEvent<ColorItem>>) {
        const {
            items: newItems,
            info: { source, trigger },
        } = e.detail;
        $colors.values = newItems;

        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }
    function startDrag(e: Event) {
        e.preventDefault();
        dragDisabled = false;
    }
    function handleKeyDown(e: KeyboardEvent) {
        if (["Enter", " "].includes(e.key) && dragDisabled)
            dragDisabled = false;
    }

    function randomColorHexString() {
        return "#" + crypto.randomUUID().substring(0, 6);
    }
    function addColor() {
        let newColor: ColorItem = {
            id: $colors.latestId,
            value: Color(randomColorHexString()),
        };
        $colors.latestId = $colors.latestId + 1;
        $colors.values.push(newColor);
    }
    function removeColor(id: number) {
        $colors.values = $colors.values.filter((color) => color.id !== id);
    }
    function updateColor(e: Event, id: number) {
        if (e.type === "keydown" && (e as KeyboardEvent).code !== "Enter") {
            return;
        }
        console.log("ok");

        let target = e.target as HTMLInputElement;

        try {
            let maybeUnsafe = Color(target.value);
            $colors.values.find((c) => c.id === id)!.value = maybeUnsafe;
            $colors = $colors;
        } catch (error) {
            // Error means the color string wasn't parsable, so we do nothing
            return;
        }
    }
    function itemStyle(color: Color) {
        // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
        let rgb = color.rgb().object();
        let textColor =
            rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186
                ? "#000000"
                : "#ffffff";

        let style = `background-color: ${color.hexa()}; color: ${textColor};`;
        return style;
    }
</script>

<ul
    use:dndzone={{ items: $colors.values, flipDurationMs, dragDisabled }}
    on:consider={dndConsider}
    on:finalize={dndFinalize}
    class="h-full flex flex-col justify-evenly"
>
    {#each $colors.values as color (color.id)}
        <li
            animate:flip={{ duration: flipDurationMs }}
            style={itemStyle(color.value)}
            class="grid grid-cols-[4rem_1fr_1fr_1fr_4rem] p-2"
        >
            <div
                tabindex={dragDisabled ? 0 : -1}
                aria-label="drag-handle"
                style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
                on:mousedown={startDrag}
                on:touchstart={startDrag}
                on:keydown={handleKeyDown}
                class="bg-slate-200 w-full h-full"
            />
            <ColorListItem
                color={color.value}
                hexString={color.value.hexa()}
                on:click={() => removeColor(color.id)}
                on:focusout={(e) => updateColor(e, color.id)}
                on:keydown={(e) => updateColor(e, color.id)}
            />
        </li>
    {/each}
    <li
        class="p-2 bg-gray-600 text-white text-center cursor-pointer"
        on:click={addColor}
    >
        +
    </li>
</ul>
