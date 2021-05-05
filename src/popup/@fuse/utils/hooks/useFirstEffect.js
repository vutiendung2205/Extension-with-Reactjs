import { useEffect, useRef } from 'react';

const useFirstEffect: typeof useEffect = (effect, deps) => {
	const isInitialMount = useRef(false);
	if (!isInitialMount.current) {
		isInitialMount.current = true;
	} else {
		effect = () => {};
	}
	useEffect(effect, deps);
};

export default useFirstEffect;
