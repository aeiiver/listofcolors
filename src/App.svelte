<script lang="ts">
  import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
  import { max } from "lodash";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";

  const darkDelta = 2;

  let model = [] as Array<string>;
  let light = 100 - darkDelta;
  let tArea: HTMLTextAreaElement;

  $: if (tArea) {
    let newCols = max(model.map((l) => l.length)) ?? 0;
    tArea.cols = newCols >= tArea.cols ? newCols : tArea.cols;
  }

  onMount(() => {
    model = load();
    let med = window.matchMedia("(prefers-color-scheme: dark)");
    if (med.matches) light = darkDelta;
  });

  function writeText(
    event: Event & { currentTarget: EventTarget & HTMLTextAreaElement },
  ) {
    model = event.currentTarget.value.split("\n");
    save();
  }

  function save() {
    localStorage.setItem("colors", JSON.stringify(model));
  }

  function load() {
    return JSON.parse(localStorage.getItem("colors") ?? "[]") as Array<string>;
  }

  function setLight(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    light = Number.parseFloat(event.currentTarget.value) ?? 100 - darkDelta;
  }
</script>

<div class="fixed bottom-2 right-2 flex items-center gap-2">
  <Fa icon={faLightbulb} primaryColor="hsl(0, 0%, {100 - light}%)" /><input
    class="inline"
    type="range"
    min="0"
    max="100"
    step="1"
    value={light}
    on:input={setLight}
  />
</div>
<main
  class="flex items-center justify-center w-full h-screen"
  style:background-color="hsl(0, 0%, {light}%)"
>
  <div class="relative">
    <div class="absolute w-full h-full">
      <pre class="font-mono">{#each model as l}<code style:color={l}
            >{l}<br /></code
          >{/each}</pre>
    </div>
    <div class="relative w-full h-full">
      <textarea
        class="font-mono text-transparent bg-transparent caret-white resize-none z-50"
        rows={model.length}
        spellcheck="false"
        bind:this={tArea}
        on:input={writeText}>{model.join("\n")}</textarea
      >
    </div>
  </div>
</main>

<style>
  :global(:root) {
    box-sizing: border-box;
  }

  @media (prefers-color-scheme: dark) {
    :global(:root) {
      color-scheme: dark;
    }
  }
</style>
