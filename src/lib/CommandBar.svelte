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
	import { jaroWinkler } from '@drainpixie/jaro';

	const {
		commands = [],
		hotkey = (e) => e.key === 'k' && e.ctrlKey,
		maxItems = 5
	}: CommandBarProps = $props();

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
				.map((command) => ({ command, score: jaroWinkler(command.text, query()) }))
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
								{#each command.hotkey as key (key)}
									<kbd data-command-bar-hotkey>
										{key}
									</kbd>
								{/each}
							{/if}
						</button>
					{/each}
				{/each}
			</div>
		</div>
	</div>
{/if}
