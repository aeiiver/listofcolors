<script lang="ts">
  import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
  import { clamp, max } from "lodash";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";

  const VERSION = "v0";
  const DARK_DELTA = 5;
  const WHITE_DELTA = 95;
  const DEFAULT_CFG = {
    text: [] as Array<string>,
    light: DARK_DELTA,
    version: VERSION,
    firstRun: true,
  };

  let M = DEFAULT_CFG;
  let tArea: HTMLTextAreaElement;
  let ready = false;

  onMount(() => {
    M = load();

    if (M.firstRun) {
      loadExample().then(
        (text) => {
          M.text = text.split("\n");
          save();
        },
        (err) => {
          throw new Error(err);
        },
      );
      M.firstRun = false;
    }

    ready = true;
    return () => save();
  });

  $: if (ready) {
    let newCols = max(M.text.map((l) => l.length)) ?? 0;
    tArea.cols = clamp(newCols, 32, 54); // Arbitrary cols
    document.body.style.backgroundColor = `hsl(0, 0%, ${M.light}%)`;
    if (M.light === WHITE_DELTA)
      document.documentElement.style.setProperty("color-scheme", "light");
    else document.documentElement.style.setProperty("color-scheme", "dark");
  }

  function writeText(
    event: Event & { currentTarget: EventTarget & HTMLTextAreaElement },
  ) {
    M.text = event.currentTarget.value.split("\n");
    save();
  }

  function save() {
    localStorage.setItem("colors", JSON.stringify(M));
  }

  function load() {
    let stored = localStorage.getItem("colors");
    if (!stored) return DEFAULT_CFG;
    let loaded = JSON.parse(stored) as typeof DEFAULT_CFG;
    if (loaded?.version !== VERSION) return DEFAULT_CFG;
    return loaded;
  }

  async function loadExample() {
    let data = await fetch("./example.css");
    let text = await data.text();
    return text;
  }

  function toggleLight(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    M.light = event.currentTarget.checked ? WHITE_DELTA : DARK_DELTA;

    if (M.light === WHITE_DELTA)
      document.documentElement.style.setProperty("color-scheme", "light");
    else document.documentElement.style.setProperty("color-scheme", "dark");

    document.body.style.backgroundColor = `hsl(0, 0%, ${M.light}%)`;
    save();
  }
</script>

<header class="flex flex-col items-center justify-center w-full">
  <div class="md:size-2/3 lg:size-1/2">
    <h1 class="text-5xl font-bold py-16 text-center">List of colors</h1>
    <p class="mb-2 text-xl">
      Try to write some CSS color values below! If you don't know what that
      means, definitely go check <a
        class="text-orange-600 font-bold active:text-cyan-100 active:underline visited:text-blue-500 hover:underline"
        href="https://www.w3schools.com/colors/">W3School's Colors Tutorial!</a
      > I created this webpage because I got fed up of looking up what a certain
      color value looks like, so I figure just pasting it in here will make my life
      way easier.
    </p>
    <p class="mb-16 text-xl">
      See source code at <a
        class="text-orange-600 font-bold active:text-cyan-100 active:underline visited:text-blue-500 hover:underline"
        href="https://github.com/aeiiver/listofcolors"
        >github.com/aeiiver/listofcolors</a
      >.
    </p>
  </div>
</header>
<main
  class="flex items-center justify-center w-full mt-4 text-2xl font-bold mb-36"
>
  <div class="relative">
    <div class="absolute w-full h-full">
      <pre
        class="font-mono p-4 rounded-xl bg-cyan-50 bg-opacity-5 shadow-[0_0_12px_12px_rgba(0,0,0,0.1)] selection:text-white">{#each M.text as l}<code
            style:color={l}>{l}<br /></code
          >{/each}</pre>
    </div>
    <div class="relative w-full h-full">
      <textarea
        class="font-mono text-transparent bg-transparent caret-gray-400 resize-x z-50 rounded-xl p-4 outline-none"
        rows={max([M.text.length, 1])}
        spellcheck="false"
        bind:this={tArea}
        on:input={writeText}>{M.text.join("\n")}</textarea
      >
    </div>
  </div>
</main>
<div
  class="fixed bottom-5 right-4 flex items-center justify-center scale-150 cursor-pointer"
>
  <label
    for="lightRange"
    class="flex items-center justify-center gap-1 me-2 cursor-pointer"
    ><Fa
      icon={faLightbulb}
      primaryColor="hsl(0, 0%, {120 - M.light}%)"
    /></label
  ><input
    class="invert hidden"
    id="lightRange"
    type="checkbox"
    checked={M.light === WHITE_DELTA}
    on:input={toggleLight}
  />
</div>

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
