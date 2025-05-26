import type { Component } from 'svelte';

/**
 * The command object to display in the command bar.
 */
export interface Command {
	/**
	 * The text to display in the command bar.
	 * @example
	 * ```ts
	 * 'Home'
	 * ```
	 */
	text: string;

	/**
	 * The hotkey to trigger the command.
	 * @example
	 * ```ts
	 * ['h', 'k']
	 * ```
	 */
	hotkey?: string[];

	/**
	 * The icon to display next to the command text.
	 * @example
	 * ```svelte
	 * <script lang="ts">
	 * import { House } from '@lucide/svelte';
	 *
	 * const commands = [
	 * 	{ text: 'Home', trigger: () => console.log('Home'), icon: House, category: 'navigation' }
	 * ];
	 * </script>
	 * ```
	 */
	icon?: Component;

	/**
	 * The category to group the command under.
	 * @example
	 * ```ts
	 * 'navigation'
	 * ```
	 */
	category: string;

	/**
	 * The function to trigger when the command is clicked.
	 * @example
	 * ```ts
	 * () => console.log('Home')
	 * ```
	 */
	trigger: (...args: unknown[]) => unknown;
}

/**
 * The props for the CommandBar component.
 */
export interface CommandBarProps {
	/**
	 * The commands to display in the command bar.
	 * @example
	 * ```ts
	 * [{ text: 'Home', trigger: () => console.log('Home'), icon: House, category: 'navigation' }]
	 * ```
	 */
	commands: Command[];

	/**
	 * The hotkey to trigger the command bar.
	 * @default (e) => e.key === 'k' && e.ctrlKey
	 */
	hotkey?: (e: KeyboardEvent) => boolean | string[];

	/**
	 * The maximum number of items to display in the command bar.
	 * @default 5
	 */
	maxItems?: number;
}
