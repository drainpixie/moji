let _query = $state('');
let _isOpen = $state(false);
let _selectedIndex = $state(0);

/**
 * Get the query
 */
export const query = () => _query;

/**
 * Get the state
 */
export const isOpen = () => _isOpen;

/**
 * Get the selected index
 */
export const selectedIndex = () => _selectedIndex;

/**
 * Set the command bar to open
 */
export const open = () => (_isOpen = true);

/**
 * Set the command bar to closed
 */
export const close = () => (_isOpen = false);

/**
 * Toggle the command bar
 */
export const toggle = () => void (_isOpen = !_isOpen);

/**
 * Clear the query and selected index
 */
export const clear = () => {
	_query = '';
	_selectedIndex = 0;
};

/**
 * Set the selected index
 * @param index
 */
export const setIndex = (index: number) => (_selectedIndex = index);

/**
 * Set the query
 * @param input
 */
export const setQuery = (input: string) => (_query = input);
