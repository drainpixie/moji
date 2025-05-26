<script lang="ts">
	import { open } from '$lib/state.svelte.js';
</script>

<div>
	<p class="pb-4 text-neutral-500 dark:text-neutral-400">
		Please press <kbd
			class="rounded-lg border border-neutral-200 bg-neutral-100 px-2 py-1.5 text-xs font-semibold text-neutral-800 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100"
			>Ctrl</kbd
		>
		+
		<kbd
			class="rounded-lg border border-neutral-200 bg-neutral-100 px-2 py-1.5 text-xs font-semibold text-neutral-800 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100"
			>K</kbd
		>
		to open the command bar.
	</p>

	<pre
		class="rounded-lg border border-neutral-200 bg-white p-2 font-mono text-sm leading-relaxed text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
<code>
<span class="text-neutral-600 dark:text-neutral-300">  $ pnpm install</span> <span
				class="text-cyan-600 dark:text-cyan-300">@drainpixie/moji</span
			>
</code>
</pre>

	<p class="pt-4 text-neutral-500 dark:text-neutral-400">
		For theming, see the <a class="underline" href="/styling">styling page</a>.
	</p>

	<button
		data-command-bar-trigger
		class="mt-2 cursor-pointer rounded-lg border border-neutral-200 bg-neutral-100 px-2 py-1.5 text-sm text-neutral-800 transition-colors duration-200
			  ease-in-out hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
		onclick={() => open()}
		type="button"
	>
		Mobile Trigger
	</button>
</div>
