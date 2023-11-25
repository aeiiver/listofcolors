<script lang="ts">
    import type Color from "color";

    export let color: Color;
    export let hexString: string;

    $: rgb = color.rgb().object();
    $: rgbString =
        "rgb(" +
        [
            rgb.r.toFixed(),
            rgb.g.toFixed(),
            rgb.b.toFixed(),
            ...(rgb.alpha ? [rgb.alpha.toPrecision(2)] : []),
        ].join(", ") +
        ")";

    $: hsl = color.hsl().object();
    $: hslString =
        "hsl(" +
        [
            hsl.h.toFixed(),
            hsl.s.toPrecision(3) + "%",
            hsl.l.toPrecision(3) + "%",
            ...(hsl.alpha ? [hsl.alpha.toPrecision(2)] : []),
        ].join(", ") +
        ")";

    function copyToClipboard(e: Event) {
        let target = e.target as HTMLElement;
        let colorString = target.textContent!;
        navigator.clipboard.writeText(colorString);
    }
</script>

<div>
    <input
        type="text"
        bind:value={hexString}
        on:focusout
        on:keydown
        class="text-center bg-[#00000040] outline-none rounded-xl p-1"
    />
</div>
<div on:click={copyToClipboard} class="cursor-pointer">{rgbString}</div>
<div on:click={copyToClipboard} class="cursor-pointer">{hslString}</div>
<div on:click class="cursor-pointer">Remove</div>

<style>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
