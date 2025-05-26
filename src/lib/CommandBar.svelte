<script lang="ts">
	import type { CommandBarProps } from './types.js';
	import {
		query,
		isOpen,
		selectedIndex,
		close,
		clear,
		toggle,
		setIndex,
		setQuery
	} from './state.svelte.js';

	const {
		commands = [],
		hotkey = (e) => e.key === 'k' && e.ctrlKey,
		maxItems = 5
	}: CommandBarProps = $props();

	// TODO: Port to own library
	function jaroWinklerDistance(a: string, b: string) {
		a = a.toLowerCase();
		b = b.toLowerCase();

		if (a === b) return 1.0;

		const m = a.length;
		const n = b.length;

		if (m === 0 || n === 0) return 0.0;

		const distance = Math.max(m, n) >>> 1;
		const range = distance > 0 ? distance - 1 : 0;

		let matches = 0;
		const am = new Uint8Array(m);
		const bm = new Uint8Array(n);

		for (let i = 0; i < m; i++) {
			const start = Math.max(0, i - range);
			const end = Math.min(n, i + range + 1);

			for (let j = start; j < end; j++) {
				if (bm[j] || a[i] !== b[j]) continue;

				am[i] = 1;
				bm[j] = 1;
				matches++;
				break;
			}
		}

		if (matches === 0) return 0.0;

		let transpositions = 0;
		let k = 0;

		for (let i = 0; i < m; i++) {
			if (!am[i]) continue;

			while (!bm[k]) k++;
			if (a[i] !== b[k]) transpositions++;

			k++;
		}

		return (matches / m + matches / n + (matches - (transpositions >>> 1)) / matches) / 3.0;
	}

	function groupBy<T>(items: T[], fn: (item: T) => string) {
		return items.reduce(
			(acc, item) => {
				const key = fn(item);
				acc[key] = [...(acc[key] ?? []), item];
				return acc;
			},
			{} as Record<string, T[]>
		);
	}

	const sorted = $derived(
		groupBy(
			commands
				.map((command) => ({ command, score: jaroWinklerDistance(command.text, query()) }))
				.sort((a, b) => b.score - a.score)
				.slice(0, maxItems)
				.map(({ command }) => command),
			(command) => command.category
		)
	);

	const flattened = $derived(Object.values(sorted).flat());

	$effect(() => {
		if (flattened.length > 0 && selectedIndex() >= flattened.length) setIndex(0);
	});

	function matchHotkey(event: KeyboardEvent, hotkey: string[]): boolean {
		const key = event.key.toLowerCase();

		const mods = {
			ctrl: event.ctrlKey,
			alt: event.altKey,
			shift: event.shiftKey,
			meta: event.metaKey
		};

		const matched = {
			ctrl: false,
			alt: false,
			shift: false,
			meta: false,
			key: ''
		};

		for (const part of hotkey) {
			const low = part.toLowerCase();

			if (low === 'ctrl' || low === 'control') matched.ctrl = true;
			else if (low === 'alt') matched.alt = true;
			else if (low === 'shift') matched.shift = true;
			else if (low === 'meta' || low === 'cmd' || low === 'command') matched.meta = true;
			else matched.key = low;
		}

		for (const mod of ['ctrl', 'alt', 'shift', 'meta'] as const)
			if (mods[mod] !== matched[mod]) return false;

		return key === matched.key;
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
			clear();
			return;
		}

		if (Array.isArray(hotkey) && matchHotkey(e, hotkey)) {
			e.preventDefault();
			toggle();
			clear();
			return;
		} else if (hotkey?.(e)) {
			e.preventDefault();
			toggle();
			clear();
			return;
		}

		if (!isOpen())
			for (const command of commands)
				if (command.hotkey && matchHotkey(e, command.hotkey)) {
					e.preventDefault();
					command.trigger();
					return;
				}
	}

	function onHover(e: MouseEvent) {
		if (e.target instanceof HTMLElement && e.target.closest('[data-command-bar-item]'))
			setIndex(Number(e.target.dataset.commandIndex));
	}

	function onSearchInput(e: KeyboardEvent) {
		const { value } = e.target as HTMLInputElement;
		setQuery(value);

		if (e.key === 'Enter') {
			e.preventDefault();

			const selectedCommand = flattened[selectedIndex()];
			if (selectedCommand) {
				selectedCommand.trigger();
				close();
				clear();
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			setIndex(Math.min(selectedIndex() + 1, flattened.length - 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setIndex(Math.max(selectedIndex() - 1, 0));
		}
	}

	function onClickOutside(e: MouseEvent) {
		if (
			e.target instanceof HTMLElement &&
			(e.target.closest('[data-command-bar]') || e.target.closest('[data-command-bar-trigger]'))
		)
			return;

		close();
		clear();
	}
</script>

<svelte:window onkeydown={onKeyDown} onclick={onClickOutside} />

{#if isOpen()}
	<div
		data-command-bar-overlay
		data-state={isOpen() ? 'open' : 'closed'}
		class="fixed top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center px-4 md:px-0"
	>
		<div
			data-command-bar
			data-state={isOpen() ? 'open' : 'closed'}
			class="flex w-full max-w-md flex-col"
		>
			<div data-command-bar-search class="flex items-center gap-2 p-4">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					data-command-bar-search-input
					type="text"
					placeholder="Search..."
					class="w-full"
					autofocus
					value={query()}
					onkeydown={onSearchInput}
				/>
			</div>

			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<div
				data-command-bar-content
				onmouseover={onHover}
				role="listbox"
				tabindex="0"
				class="flex flex-col gap-2 p-4"
			>
				{#each Object.entries(sorted) as [category, items] (category)}
					<div data-command-bar-category-title>
						{category}
					</div>

					{#each items as command (`${category}-${command.text}`)}
						{@const onclick = () => (close(), clear(), command.trigger())}
						<button
							data-command-bar-item
							data-command-index={flattened.indexOf(command)}
							class="flex flex-row gap-2"
							{onclick}
							class:selected={flattened[selectedIndex()] === command}
						>
							{#if command.icon}
								{@const Icon = command.icon}
								<Icon data-command-bar-icon />
							{/if}
							<span data-command-bar-text>
								{command.text}
							</span>

							{#if command.hotkey}
								<kbd data-command-bar-hotkey>
									{#each command.hotkey as key (key)}
										{key}
									{/each}
								</kbd>
							{/if}
						</button>
					{/each}
				{/each}
			</div>
		</div>
	</div>
{/if}
