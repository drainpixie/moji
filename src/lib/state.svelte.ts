// Create state variables internally (not exported)
let _query = $state('');
let _isOpen = $state(false);
let _selectedIndex = $state(0);

export const query = () => _query;
export const isOpen = () => {
	console.log(_isOpen);
	return _isOpen;
};
export const selectedIndex = () => _selectedIndex;

export const open = () => (_isOpen = true);
export const close = () => (_isOpen = false);
export const toggle = () => (_isOpen = !_isOpen);
export const clear = () => {
	_query = '';
	_selectedIndex = 0;
};

export const setIndex = (index: number) => (_selectedIndex = index);
export const setQuery = (input: string) => (_query = input);
