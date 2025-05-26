# 🎛️ moji 文字

a cute and modular svelte kbar

[live demo](https://moji.drainpixie.me)  
[check out the styling page](https://moji.drainpixie.me/styling)

## 🖥️ use

check `src/routes/+layout.svelte` and `src/routes/+page.svelte` for hands-on usage and basic styling using tailwindcss.

```sh
$ pnpm add @drainpixie/moji
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import CommandBar from '@drainpixie/moji';

	const commands = [
		{ text: 'Home', trigger: () => console.log('Home'), icon: House, category: 'navigation' },
		{ text: 'Create', trigger: () => console.log('Create'), icon: Plus, category: 'actions' }
	];
</script>

<!-- maxItems and hotkey are optional, these are the defaults -->
<CommandBar {commands} maxItems={5} hotkey={(e) => e.key === 'k' && e.ctrlKey} />

<!-- ... -->
```

```svelte
<!-- src/routes/+page.svelte -->

<script lang="ts">
	import { open } from '@drainpixie/moji';
</script>

<button data-command-bar-trigger onclick={() => open()} type="button">
	Manual Trigger or `CTRL + K`
</button>
```
