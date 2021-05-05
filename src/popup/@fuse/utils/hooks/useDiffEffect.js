import { useEffect, useRef } from 'react';
import _ from '../lodash';

const useDiffEffect: typeof useEffect = (effect, deps) => {
	const isInitialMount = useRef(deps);
	useEffect(() => {
		if (!_.isEqual(isInitialMount.current.deps, deps)) {
			effect();
		}
		isInitialMount.current.deps = deps;
	}, deps);
};

export default useDiffEffect;
