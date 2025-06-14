<script lang="ts">
	import { CommandBar } from '$lib/index.js';
	import type { Command } from '$lib/types.js';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';

	import { House, Info, Contact, Plus, Save, Trash, Code, Github } from '@lucide/svelte';

	injectAnalytics();

	let { children } = $props();

	const commands: Command[] = [
		{ text: 'Home', trigger: () => console.log('Home'), icon: House, category: 'navigation' },
		{ text: 'About', trigger: () => console.log('About'), icon: Info, category: 'navigation' },
		{
			text: 'Contact',
			trigger: () => console.log('Contact'),
			icon: Contact,
			category: 'navigation',
			hotkey: ['c']
		},
		{ text: 'New', trigger: () => console.log('New'), icon: Plus, category: 'actions' },
		{
			text: 'Save',
			trigger: () => console.log('Save'),
			icon: Save,
			category: 'actions',
			hotkey: ['ctrl', 's']
		},
		{ text: 'Delete', trigger: () => console.log('Delete'), icon: Trash, category: 'actions' },
		{
			text: 'SourceHut',
			trigger: () => (window.location.href = 'https://git.sr.ht/~pixie'),
			icon: Code,
			category: 'socials',
			hotkey: ['s', 'h']
		},
		{
			text: 'GitHub',
			trigger: () => (window.location.href = 'https://github.com/drainpixie'),
			icon: Github,
			category: 'socials'
		}
	];
</script>

<CommandBar {commands} />

<svelte:head>
	<title>Moji 文字</title>
	<meta name="description" content="a cute and modular svelte kbar" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link
		rel="icon"
		href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎛️</text></svg>"
	/>
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<main
	class="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-8 md:px-0 dark:bg-neutral-950"
>
	{@render children()}
</main>

<style lang="postcss">
	@reference "../app.css";

	:global {
		[data-command-bar-overlay] {
			@apply flex items-center justify-center bg-black/20 backdrop-blur-sm;
		}

		[data-command-bar] {
			@apply w-full max-w-md rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900;
		}

		[data-command-bar-content] {
			@apply flex flex-col p-2;
		}

		[data-command-bar-item] {
			@apply flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800;
		}

		[data-command-bar-item].selected {
			@apply bg-neutral-100 dark:bg-neutral-800;
		}

		[data-command-bar-icon] {
			@apply flex h-4 w-4 items-center text-neutral-500 dark:text-neutral-400;
		}

		[data-command-bar-text] {
			@apply flex-1 leading-none;
		}

		[data-command-bar-hotkey] {
			@apply rounded-md border border-neutral-200 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400;
		}

		[data-command-bar-category-title] {
			@apply pl-1 text-xs font-semibold text-neutral-500 capitalize dark:text-neutral-400;
		}

		[data-command-bar-search-input] {
			@apply w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200;
		}
	}
</style>
