import OrderStatisticTab from './components/OrderStatistic/OrderStatisticTab';
import SuppliersAndCompetitorsTab from '../Common/SuppliersAndCompetitors/SuppliersAndCompetitorsTab';
import iconBuyer from '../../../images/img/icon_buyer.svg';
import iconSupplierAndStore from '../../../images/img/icon-cart.svg';
import { FEATURES_ID } from '../../@fuse/config/constants';
/**
 * Config component của các tab và các config mặc định
 */
export default [
	{
		component: OrderStatisticTab,
		title: 'Daily Orders Chart',
		icon: iconBuyer,
		currentFeature: FEATURES_ID.ORDER_AND_TOP_COUNTRY,
		header: {
			isShowLogo: false,
			title: 'Order Statistic',
			isShowBack: false,
			isShowSearch: false
		}
	},
	{
		component: SuppliersAndCompetitorsTab,
		title: 'Suppliers And Competitors',
		icon: iconSupplierAndStore,
		currentFeature: FEATURES_ID.SUPPLIERS_AND_COMPETITORS,
		header: {
			isShowLogo: false,
			title: 'Suppliers And Competitors',
			isShowBack: false,
			isShowSearch: false
		}
	}
];
