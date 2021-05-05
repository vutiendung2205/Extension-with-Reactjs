import { useEffect, useRef } from 'react';
import _ from '../lodash';

const useDiffUpdateEffect: typeof useEffect = (effect, deps) => {
	const isInitialMount = useRef({ isFirst: true, deps: null });
	useEffect(
		isInitialMount.current.isFirst
			? () => {
					isInitialMount.current.isFirst = false;
					isInitialMount.current.deps = deps;
			  }
			: () => {
					if (!_.isEqual(isInitialMount.current.deps, deps)) {
						effect();
					}
					isInitialMount.current.deps = deps;
			  },
		deps
	);
};

export default useDiffUpdateEffect;
