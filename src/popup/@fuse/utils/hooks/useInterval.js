import { useRef, useEffect } from 'react';

function useInterval(callback, delay) {
	const savedCallback = useRef();

	useEffect(
		function () {
			savedCallback.current = callback;
		},
		[callback]
	);

	useEffect(
		function () {
			function tick() {
				savedCallback.current();
			}
			if (delay) {
				const id = setInterval(function () {
					tick();
				}, delay);
				return function () {
					return clearInterval(id);
				};
			}
			return true;
		},
		[delay]
	);
}

export default useInterval;
