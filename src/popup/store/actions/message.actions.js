export const TOGGLE_EXTENSION = 'TOGGLE_EXTENSION';

export function toggleExtension(isExtensionOpen) {
	return {
		type: TOGGLE_EXTENSION,
		payload: isExtensionOpen
	};
}
