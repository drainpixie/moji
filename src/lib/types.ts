import type { Component } from 'svelte';

/**
 * The command object to display in the command bar.
 */
export interface Command {
	/**
	 * The text to display in the command bar.
	 */
	text: string;

	/**
	 * TODO: Add support for hotkey
	 * The hotkey to trigger the command.
	 */
	hotkey?: (e: KeyboardEvent) => boolean;

	/**
	 * The icon to display next to the command text.
	 */
	icon?: Component;

	/**
	 * The category to group the command under.
	 */
	category: string;

	/**
	 * The function to trigger when the command is clicked.
	 */
	trigger: (...args: unknown[]) => unknown;
}

/**
 * The props for the CommandBar component.
 */
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
