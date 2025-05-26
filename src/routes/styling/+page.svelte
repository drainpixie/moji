<div id="styling" class="space-y-3 px-8 text-zinc-500 md:px-0 dark:text-zinc-400">
	<div>
		<p>data-command-bar-overlay</p>
		<p>Fixed overlay container that covers the entire screen when command bar is open</p>
	</div>

	<div>
		<p>data-command-bar</p>
		<p>Main command bar container</p>
	</div>

	<div>
		<p>data-command-bar-search</p>
		<p>Search section container</p>
	</div>

	<div>
		<p>data-command-bar-search-input</p>
		<p>Text input field for searching commands</p>
	</div>

	<div>
		<p>data-command-bar-content</p>
		<p>Container for the command list</p>
	</div>

	<div>
		<p>data-command-bar-category-title</p>
		<p>Title element for each command category grouping</p>
	</div>

	<div>
		<p>data-command-bar-item</p>
		<p>Individual command button</p>
	</div>

	<div>
		<p>data-command-bar-icon?</p>
		<p>Icon component displayed next to command text</p>
	</div>

	<div>
		<p>data-command-bar-text</p>
		<p>Text content of each command item</p>
	</div>

	<div>
		<p>data-command-index</p>
		<p>Numeric index attribute for tracking the command position</p>
	</div>

	<div>
		<p>data-state</p>
		<p>State attribute indicating if the command bar is "open" or "closed"</p>
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	#styling div {
		@apply mb-2 border-l border-zinc-200 pl-2 dark:border-zinc-700;
	}

	#styling div:last-child {
		@apply mb-0;
	}

	#styling div p:nth-child(1) {
		@apply text-sm font-semibold break-all text-zinc-800 dark:text-zinc-200;
	}

	#styling div p:nth-child(2) {
		@apply text-sm;
	}
</style>
