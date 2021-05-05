import OverviewTab from '../Common/Overview/OverviewTab';
import iconHome from '../../../images/img/icon_home.svg';
import { FEATURES_ID } from '../../@fuse/config/constants';
/**
 * Config component của các tab và các config mặc định
 */
export default [
	{
		component: OverviewTab,
		title: 'Overview',
		icon: iconHome,
		currentFeature: FEATURES_ID.OVER_VIEW,
		header: {
			isShowLogo: true,
			title: '',
			isShowBack: false,
			isShowSearch: false
		}
	}
];
