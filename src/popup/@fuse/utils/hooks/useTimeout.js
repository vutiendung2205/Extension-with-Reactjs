import { useEffect, useRef } from 'react';

export default function useTimeout(callback, delay) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay && callback && typeof callback === 'function') {
			const timer = setTimeout(callbackRef.current, delay || 0);
			return () => {
				if (timer) {
					clearTimeout(timer);
				}
			};
		}
		return true;
	}, [callback, delay]);
}
