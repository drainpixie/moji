import type { Component } from 'svelte';

export interface Command {
	text: string;

	// TODO: Add support for hotkey
	hotkey?: (e: KeyboardEvent) => boolean;

	icon?: Component;
	category: string;
	trigger: (...args: unknown[]) => unknown;
}

export interface CommandBarProps {
	/**
	 * The commands to display in the command bar.
	 */
	commands: Command[];

	/**
	 * The hotkey to trigger the command bar.
	 * @default (e) => e.key === 'k' && e.ctrlKey
	 */
	hotkey?: (e: KeyboardEvent) => boolean;

	/**
	 * The maximum number of items to display in the command bar.
	 * @default 5
	 */
	maxItems?: number;
}
