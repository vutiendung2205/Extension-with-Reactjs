/* eslint prefer-template: 0 */
/* eslint spaced-comment: 0 */
const REDUX_PORT_NAME = 'REACT_CHROE_EXTENSION_PEXGLE';
const PEXGLE_HOST = 'https://www.pexgle.com';
// const PEXGLE_HOST = "https://www.pexgle.dev"; //
// const PEXGLE_HOST = "http://pexda-pro.com"; //
const PEXGLE_HOST_PRICING = PEXGLE_HOST + '/pricing/';
const API_OVERVIEW = PEXGLE_HOST + '/wp-json/service/wa/api/free-user-extentions';
const API_CHECK_DOMAIN_EXISTS = PEXGLE_HOST + '/wp-json/myplugin/v1/without-auth/domain/checkExists';
const API_FOLLOW_A_DOMAIN = PEXGLE_HOST + '/wp-json/myplugin/v1/store/add';
const API_UN_FOLLOW_A_DOMAIN = PEXGLE_HOST + '/wp-json/service/api/delete-user-domain-by-domain-name';
const API_FOLLOW_A_FB_PAGE = PEXGLE_HOST + '/wp-json/myplugin/v1/fb-page/add';
const API_UN_FOLLOW_A_FB_PAGE = PEXGLE_HOST + '/wp-json/myplugin/v1/fb-page/delete-by-slug';
const API_GET_BEST_SELLING_PRODUCT = PEXGLE_HOST + '/wp-json/service/wa/api/recent-order?';
const API_GET_NEW_ADD = 'https://%DOMAIN%/products.json?page=%PAGE%&limit=%LIMIT%';
const API_GET_TRENDING = 'https://%DOMAIN%/collections/all?sort_by=best-selling&page=1';
const API_GET_TRENDING_PRODUCT = PEXGLE_HOST + '/wp-json/service/wa/api/trending/get-for-user-extentions?';

const API_GET_FREE_PAGING_FACEBOOK_ADS = PEXGLE_HOST + '/wp-json/myplugin/v1/without-auth/domain/getFreePagingProduct?';
const API_MARK_FAVORITE = PEXGLE_HOST + '/wp-json/service/api/change-favorite';
const API_GET_USER_ID = PEXGLE_HOST + '/wp-json/myplugin/v1/without-auth/info-dashboard/';
const API_MARK_FAVORITE_FACEBOOK_ADS = PEXGLE_HOST + '/wp-json/myplugin/v1/fb-ads/favorites/';
const API_ALIEXPRESS_VISIT_TRACKING = PEXGLE_HOST + '/wp-json/service/wa/api/aliexpress-visit-tracking';
const API_SAVE_FACEBOOK_ADS_TRACKING = PEXGLE_HOST + '/wp-json/service/wa/api/fb-sponsor';
const API_SAVE_TWITTER_ADS_TRACKING = PEXGLE_HOST + '/wp-json/service/wa/api/twitter-sponsor';
const API_SAVE_TWITTER_REPORT = PEXGLE_HOST + '/wp-json/service/wa/api/twitter-report';

const API_GET_CSS_SELECTOR_FACEBOOK_ADS = PEXGLE_HOST + '/wp-json/myplugin/v1/without-auth/facebook-ads/css-selector';
const API_GET_PEXGLE_SPONSOR_TEMPLATE = PEXGLE_HOST + '/wp-json/service/wa/api/get-list-pexgle-ads?isTest=true'; //?isTest=true
const API_GET_BLOCK_ADS_OPTION = PEXGLE_HOST + '/wp-json/service/wa/api/facebook-ads/bloked-option';
const API_GET_LIST_FACEBOOK_ADS = PEXGLE_HOST + '/wp-json/service/wa/api/fb-ads-extentions';
const API_WEB_DETECTION = PEXGLE_HOST + '/wp-json/service/wa/api/web-detection';
const API_ALIEXPRESS_PRODUCT_DETAIL = PEXGLE_HOST + '/wp-json/service/wa/api/aliexpress/product';
const API_ALIEXPRESS_PRODUCT_ANALYSIS = PEXGLE_HOST + '/wp-json/service/wa/api/aliexpress/product-analysis';
const API_GET_ALIEXPRESS_PRODUCT_PRICE = PEXGLE_HOST + '/wp-json/service/wa/api/get-product-advance-info';
const FOLLOW_STATUS = {
	FOLLOWED: 'followed',
	UN_FOLLOWED: 'unfollowed',
	LOADING: 'loading'
};
const FAVORITE_STATUS = {
	FAVORITE: 'favorite',
	UN_FAVORITE: 'unfavorite',
	LOADING: 'loading'
};

const FEATURES_ID = {
	OVER_VIEW: 'pg-main-overview',
	BEST_SELLING: 'pg-main-best-selling',
	TRENDING: 'pg-main-trending',
	FACEBOOK_ADS: 'pg-main-fb-ads',
	SUPPLIERS_AND_COMPETITORS: 'pg-main-store-selling',
	ORDER_AND_TOP_COUNTRY: 'pg-main-order-and-top-country',
	VIEW_ALL_FACEBOOK_PAGE: 'pg-view-all-facebook-page'
};

const SEARCH_TYPE = {
	BEST_SELLING: 'search-best-sell',
	TRENDING: 'search-trending',
	FACEBOOK_ADS: 'search-fb-ads'
};

const PLATFORM = {
	ALIEXPRESS: 'ALIEXPRESS',
	SHOPIFY: 'SHOPIFY'
};

const COLOR_CHART = {
	DEFAULT: '#69bda9',
	UNDER_5: '#69bda9',
	UNDER_10: '#a9dca2',
	UNDER_15: '#A9DCA2',
	UNDER_20: '#E0F3A1',
	UNDER_25: '#E0F3A1',
	UNDER_30: '#FBF8B0',
	UNDER_35: '#FEDD8D',
	UNDER_40: '#FCAC63',
	UNDER_45: '#F0AC4A',
	UNDER_50: '#D13C4B'
};

const isoCountries = {
	AF: 'Afghanistan',
	AX: 'Aland Islands',
	AL: 'Albania',
	DZ: 'Algeria',
	AS: 'American Samoa',
	AD: 'Andorra',
	AO: 'Angola',
	AI: 'Anguilla',
	AQ: 'Antarctica',
	AG: 'Antigua And Barbuda',
	AR: 'Argentina',
	AM: 'Armenia',
	AW: 'Aruba',
	AU: 'Australia',
	AT: 'Austria',
	AZ: 'Azerbaijan',
	BS: 'Bahamas',
	BH: 'Bahrain',
	BD: 'Bangladesh',
	BB: 'Barbados',
	BY: 'Belarus',
	BE: 'Belgium',
	BZ: 'Belize',
	BJ: 'Benin',
	BM: 'Bermuda',
	BT: 'Bhutan',
	BO: 'Bolivia',
	BA: 'Bosnia And Herzegovina',
	BW: 'Botswana',
	BV: 'Bouvet Island',
	BR: 'Brazil',
	IO: 'British Indian Ocean Territory',
	BN: 'Brunei Darussalam',
	BG: 'Bulgaria',
	BF: 'Burkina Faso',
	BI: 'Burundi',
	KH: 'Cambodia',
	CM: 'Cameroon',
	CA: 'Canada',
	CV: 'Cape Verde',
	KY: 'Cayman Islands',
	CF: 'Central African Republic',
	TD: 'Chad',
	CL: 'Chile',
	CN: 'China',
	CX: 'Christmas Island',
	CC: 'Cocos (Keeling) Islands',
	CO: 'Colombia',
	KM: 'Comoros',
	CG: 'Congo',
	CD: 'Congo, Democratic Republic',
	CK: 'Cook Islands',
	CR: 'Costa Rica',
	CI: "Cote D'Ivoire",
	HR: 'Croatia',
	CU: 'Cuba',
	CY: 'Cyprus',
	CZ: 'Czech Republic',
	DK: 'Denmark',
	DJ: 'Djibouti',
	DM: 'Dominica',
	DO: 'Dominican Republic',
	EC: 'Ecuador',
	EG: 'Egypt',
	SV: 'El Salvador',
	GQ: 'Equatorial Guinea',
	ER: 'Eritrea',
	EE: 'Estonia',
	ET: 'Ethiopia',
	FK: 'Falkland Islands (Malvinas)',
	FO: 'Faroe Islands',
	FJ: 'Fiji',
	FI: 'Finland',
	FR: 'France',
	GF: 'French Guiana',
	PF: 'French Polynesia',
	TF: 'French Southern Territories',
	GA: 'Gabon',
	GM: 'Gambia',
	GE: 'Georgia',
	DE: 'Germany',
	GH: 'Ghana',
	GI: 'Gibraltar',
	GR: 'Greece',
	GL: 'Greenland',
	GD: 'Grenada',
	GP: 'Guadeloupe',
	GU: 'Guam',
	GT: 'Guatemala',
	GG: 'Guernsey',
	GN: 'Guinea',
	GW: 'Guinea-Bissau',
	GY: 'Guyana',
	HT: 'Haiti',
	HM: 'Heard Island & Mcdonald Islands',
	VA: 'Holy See (Vatican City State)',
	HN: 'Honduras',
	HK: 'Hong Kong',
	HU: 'Hungary',
	IS: 'Iceland',
	IN: 'India',
	ID: 'Indonesia',
	IR: 'Iran, Islamic Republic Of',
	IQ: 'Iraq',
	IE: 'Ireland',
	IM: 'Isle Of Man',
	IL: 'Israel',
	IT: 'Italy',
	JM: 'Jamaica',
	JP: 'Japan',
	JE: 'Jersey',
	JO: 'Jordan',
	KZ: 'Kazakhstan',
	KE: 'Kenya',
	KI: 'Kiribati',
	KR: 'Korea',
	KS: 'Kosovo',
	KW: 'Kuwait',
	KG: 'Kyrgyzstan',
	LA: "Lao People's Democratic Republic",
	LV: 'Latvia',
	LB: 'Lebanon',
	LS: 'Lesotho',
	LR: 'Liberia',
	LY: 'Libyan Arab Jamahiriya',
	LI: 'Liechtenstein',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	MO: 'Macao',
	MK: 'Macedonia',
	MG: 'Madagascar',
	MW: 'Malawi',
	MY: 'Malaysia',
	MV: 'Maldives',
	ML: 'Mali',
	MT: 'Malta',
	MH: 'Marshall Islands',
	MQ: 'Martinique',
	MR: 'Mauritania',
	MU: 'Mauritius',
	YT: 'Mayotte',
	MX: 'Mexico',
	FM: 'Micronesia, Federated States Of',
	MD: 'Moldova',
	MC: 'Monaco',
	MN: 'Mongolia',
	MNE: 'Montenegro',
	MS: 'Montserrat',
	MA: 'Morocco',
	MZ: 'Mozambique',
	MM: 'Myanmar',
	NA: 'Namibia',
	NR: 'Nauru',
	NP: 'Nepal',
	NL: 'Netherlands',
	AN: 'Netherlands Antilles',
	NC: 'New Caledonia',
	NZ: 'New Zealand',
	NI: 'Nicaragua',
	NE: 'Niger',
	NG: 'Nigeria',
	NU: 'Niue',
	NF: 'Norfolk Island',
	MP: 'Northern Mariana Islands',
	NO: 'Norway',
	OM: 'Oman',
	PK: 'Pakistan',
	PW: 'Palau',
	PS: 'Palestinian Territory, Occupied',
	PA: 'Panama',
	PG: 'Papua New Guinea',
	PY: 'Paraguay',
	PE: 'Peru',
	PH: 'Philippines',
	PN: 'Pitcairn',
	PL: 'Poland',
	PT: 'Portugal',
	PR: 'Puerto Rico',
	QA: 'Qatar',
	RE: 'Reunion',
	RO: 'Romania',
	RU: 'Russian Federation',
	RW: 'Rwanda',
	BL: 'Saint Barthelemy',
	SH: 'Saint Helena',
	KN: 'Saint Kitts And Nevis',
	LC: 'Saint Lucia',
	MF: 'Saint Martin',
	PM: 'Saint Pierre And Miquelon',
	VC: 'Saint Vincent And Grenadines',
	WS: 'Samoa',
	SM: 'San Marino',
	ST: 'Sao Tome And Principe',
	SA: 'Saudi Arabia',
	SN: 'Senegal',
	SRB: 'Serbia',
	SC: 'Seychelles',
	SL: 'Sierra Leone',
	SG: 'Singapore',
	SK: 'Slovakia',
	SI: 'Slovenia',
	SB: 'Solomon Islands',
	SO: 'Somalia',
	ZA: 'South Africa',
	GS: 'South Georgia And Sandwich Isl.',
	ES: 'Spain',
	LK: 'Sri Lanka',
	SD: 'Sudan',
	SR: 'Suriname',
	SJ: 'Svalbard And Jan Mayen',
	SZ: 'Swaziland',
	SE: 'Sweden',
	CH: 'Switzerland',
	SY: 'Syrian Arab Republic',
	TW: 'Taiwan',
	TJ: 'Tajikistan',
	TZ: 'Tanzania',
	TH: 'Thailand',
	TL: 'Timor-Leste',
	TG: 'Togo',
	TK: 'Tokelau',
	TO: 'Tonga',
	TT: 'Trinidad And Tobago',
	TN: 'Tunisia',
	TR: 'Turkey',
	TM: 'Turkmenistan',
	TC: 'Turks And Caicos Islands',
	TV: 'Tuvalu',
	UG: 'Uganda',
	UA: 'Ukraine',
	AE: 'United Arab Emirates',
	UK: 'United Kingdom',
	US: 'United States',
	UM: 'United States Outlying Islands',
	UY: 'Uruguay',
	UZ: 'Uzbekistan',
	VU: 'Vanuatu',
	VE: 'Venezuela',
	VN: 'Viet Nam',
	VG: 'Virgin Islands, British',
	VI: 'Virgin Islands, U.S.',
	WF: 'Wallis And Futuna',
	EH: 'Western Sahara',
	YE: 'Yemen',
	ZM: 'Zambia',
	ZW: 'Zimbabwe'
};

// define cycle time: get pexgle ads //
// const CYCLE_TIME_GET_PEXGLE_ADS = 24 * 60 * 60 * 1000; // 1 day
const CYCLE_TIME_GET_PEXGLE_ADS = 60 * 1000; // 1 minute

/**
 * Unit by country
 */
export function units_by_country_on_facebook() {
	return {
		so_SO: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		af_ZA: [
			{ unit: 'm', value: 1000000 },
			{ unit: 'k', value: 1000 }
		],
		az_AZ: [{ mln: 'm', value: 1000000 }],
		id_ID: [
			{ unit: 'jt', value: 1000000 },
			{ unit: 'rb', value: 1000 }
		],
		ms_MY: [
			{ unit: 'J', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		jv_ID: [
			{ unit: 'yt', value: 1000000 },
			{ unit: 'ewu', value: 1000 }
		],
		cx_PH: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		bs_BA: [
			{ unit: 'mil.', value: 1000000 },
			{ unit: 'hilj.', value: 1000 }
		],
		br_FR: [
			{ unit: 'mil', value: 1000000 },
			{ unit: 'hilj', value: 1000 }
		],
		ca_ES: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'mil', value: 1000 }
		],
		cs_CZ: [
			{ unit: 'mil', value: 1000000 },
			{ unit: 'tis.', value: 1000 }
		],
		co_FR: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		cy_GB: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		da_DK: [
			{ unit: 'mio.', value: 1000000 },
			{ unit: 'tusind', value: 1000 }
		],
		de_DE: [{ unit: 'Mio.', value: 1000000 }],
		et_EE: [
			{ unit: 'mln', value: 1000000 },
			{ unit: 'tuh', value: 1000 }
		],
		en_PI: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		en_GB: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		en_US: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		en_UD: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		es_LA: [
			{ unit: 'mill.', value: 1000000 },
			{ unit: 'mil', value: 1000 }
		],
		es_ES: [
			{ unit: 'mill.', value: 1000000 },
			{ unit: 'mil', value: 1000 }
		],
		eo_EO: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		eu_ES: [{ unit: 'M', value: 1000000 }],
		tl_PH: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		fo_FO: [
			{ unit: 'mió.', value: 1000000 },
			{ unit: 'tús.', value: 1000 }
		],
		fr_CA: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'k', value: 1000 }
		],
		fr_FR: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		fy_NL: [
			{ unit: 'mln.', value: 1000000 },
			{ unit: 't.', value: 1000 }
		],
		ff_NG: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		ga_IE: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'k', value: 1000 }
		],
		gl_ES: [
			{ unit: 'mill.', value: 1000000 },
			{ unit: 'mil.', value: 1000 }
		],
		gn_PY: [
			{ unit: 'millón', value: 1000000 },
			{ unit: 'mil', value: 1000 }
		],
		ha_NG: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'D', value: 1000 }
		],
		hr_HR: [
			{ unit: 'mil.', value: 1000000 },
			{ unit: 'tis.', value: 1000 }
		],
		rw_RW: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		is_IS: [
			{ unit: 'm.', value: 1000000 },
			{ unit: 'þ.', value: 1000 }
		],
		it_IT: [{ unit: 'mln', value: 1000000 }],
		sw_KE: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'elfu', value: 1000 }
		],
		ht_HT: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		ku_TR: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		lv_LV: [
			{ unit: 'milj.', value: 1000000 },
			{ unit: 'tūkst.', value: 1000 }
		],
		fb_LT: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		lt_LT: [
			{ unit: 'mln.', value: 1000000 },
			{ unit: 'tūkst.', value: 1000 }
		],
		la_VA: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		hu_HU: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'E', value: 1000 }
		],
		mg_MG: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		mt_MT: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'k', value: 1000 }
		],
		nl_NL: [
			{ unit: 'mln.', value: 1000000 },
			{ unit: 'd.', value: 1000 }
		],
		nl_BE: [
			{ unit: 'mln.', value: 1000000 },
			{ unit: 'd.', value: 1000 }
		],
		nb_NO: [
			{ unit: 'mill.', value: 1000000 },
			{ unit: 'k', value: 1000 }
		],
		nn_NO: [
			{ unit: 'mill.', value: 1000000 },
			{ unit: 'k', value: 1000 }
		],
		uz_UZ: [
			{ unit: 'mln', value: 1000000 },
			{ unit: 'ming', value: 1000 }
		],
		pl_PL: [
			{ unit: 'mln', value: 1000000 },
			{ unit: 'tys.', value: 1000 }
		],
		pt_BR: [
			{ unit: 'mi', value: 1000000 },
			{ unit: 'mil', value: 1000 }
		],
		pt_PT: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'mil', value: 1000 }
		],
		ro_RO: [
			{ unit: 'mil.', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		sc_IT: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		sn_ZW: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		sq_AL: [
			{ unit: 'mln', value: 1000000 },
			{ unit: 'mijë', value: 1000 }
		],
		sz_PL: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		sk_SK: [
			{ unit: 'mil.', value: 1000000 },
			{ unit: 'tis.', value: 1000 }
		],
		sl_SI: [
			{ unit: 'mio.', value: 1000000 },
			{ unit: 'tis.', value: 1000 }
		],
		fi_FI: [
			{ unit: 'milj.', value: 1000000 },
			{ unit: 't.', value: 1000 }
		],
		sv_SE: [
			{ unit: 'mn', value: 1000000 },
			{ unit: 'tn', value: 1000 }
		],
		vi_VN: [
			{ unit: 'triệu', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		tr_TR: [
			{ unit: 'Mn', value: 1000000 },
			{ unit: 'B', value: 1000 }
		],
		zz_TR: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'H', value: 1000 }
		],
		el_GR: [
			{ unit: 'εκ', value: 1000000, reverse: true },
			{ unit: 'χιλ', value: 1000, reverse: true }
		],
		be_BY: [
			{ unit: 'млн', value: 1000000, reverse: true },
			{ unit: 'тыс', value: 1000, reverse: true }
		],
		bg_BG: [
			{ unit: 'млн', value: 1000000, reverse: true },
			{ unit: 'хил', value: 1000, reverse: true }
		],
		ky_KG: [
			{ unit: 'млн', value: 1000000, reverse: true },
			{ unit: 'миӊ', value: 1000, reverse: true }
		],
		kk_KZ: [
			{ unit: 'млн', value: 1000000, reverse: true },
			{ unit: 'мың', value: 1000, reverse: true }
		],
		mk_MK: [
			{ unit: 'мил', value: 1000000, reverse: true },
			{ unit: 'илј', value: 1000, reverse: true }
		],
		mn_MN: [
			{ unit: 'C', value: 1000000 },
			{ unit: 'M', value: 1000 }
		],
		ru_RU: [
			{ unit: 'млн', value: 1000000, reverse: true },
			{ unit: 'тыс', value: 1000, reverse: true }
		],
		sr_RS: [
			{ unit: 'мил', value: 1000000, reverse: true },
			{ unit: 'хиљ', value: 1000, reverse: true }
		],
		tg_TJ: [
			{ unit: 'млн', value: 1000000, reverse: true },
			{ unit: 'ҳзр', value: 1000, reverse: true }
		],
		uk_UA: [
			{ unit: 'млн', value: 1000000, reverse: true },
			{ unit: 'тис', value: 1000, reverse: true }
		],
		ka_GE: [
			{ unit: 'მლნ', value: 1000000, reverse: true },
			{ unit: 'ათ', value: 1000, reverse: true }
		],
		hy_AM: [
			{ unit: 'մլն', value: 1000000, reverse: true },
			{ unit: 'հզր', value: 1000, reverse: true }
		],
		he_IL: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		ur_PK: [
			{ unit: 'لاکھ', value: 100000, reverse: true },
			{ unit: 'ہزار', value: 1000, reverse: true }
		],
		sy_SY: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		tz_MA: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		am_ET: [
			{ unit: 'ሚ እ', value: 1000000, reverse: true },
			{ unit: 'ሺ', value: 1000, reverse: true }
		],
		hi_IN: [
			{ unit: 'लाख', value: 100000, reverse: true },
			{ unit: 'हज़ार', value: 1000, reverse: true }
		],
		pa_IN: [
			{ unit: 'ਲੱਖ', value: 100000, reverse: true },
			{ unit: 'ਹਜ਼ਾਰ', value: 1000, reverse: true }
		],
		gu_IN: [
			{ unit: 'લાખ', value: 100000, reverse: true },
			{ unit: 'હજાર', value: 1000, reverse: true }
		],
		or_IN: [
			{ unit: 'ନି', value: 1000000, reverse: true },
			{ unit: 'ହ', value: 1000, reverse: true }
		],
		ta_IN: [
			{ unit: 'L', value: 100000 },
			{ unit: 'K', value: 1000 }
		],
		te_IN: [
			{ unit: 'మి', value: 1000000, reverse: true },
			{ unit: 'వే', value: 1000, reverse: true }
		],
		kn_IN: [
			{ unit: 'ಲ', value: 100000, reverse: true },
			{ unit: 'ಸಾ', value: 1000, reverse: true }
		],
		ml_IN: [
			{ unit: 'M', value: 1000000 },
			{ unit: 'K', value: 1000 }
		],
		si_LK: [
			{ unit: 'මි', value: 1000000, reverse: true },
			{ unit: 'ද', value: 1000, reverse: true }
		],
		th_TH: [
			{ unit: 'ล้าน ครั้ง', value: 1000000, reverse: true },
			{ unit: 'សែន', value: 100000, reverse: true },
			{ unit: 'មឺុន', value: 10000, reverse: true },
			{ unit: 'พัน', value: 1000, reverse: true }
		],
		lo_LA: [
			{ unit: 'ລ້ານ', value: 1000000, reverse: true },
			{ unit: 'ພັນ', value: 1000, reverse: true },
			{ unit: 'ກີບ', value: 1000, reverse: true }
		],
		km_KH: [
			{ unit: 'លាន', value: 1000000, reverse: true },
			{ unit: 'សែន', value: 100000, reverse: true },
			{ unit: '​មឺុន', value: 10000, reverse: true },
			{ unit: 'ពាន់', value: 1000, reverse: true }
		],
		ko_KR: [
			{ unit: '만', value: 10000, reverse: true },
			{ unit: '천', value: 1000, reverse: true }
		],
		zh_TW: [{ unit: '萬', value: 10000, reverse: true }],
		zh_CN: [{ unit: '万', value: 10000, reverse: true }],
		zh_HK: [{ unit: '萬', value: 10000, reverse: true }],
		ja_JP: [{ unit: '万', value: 10000, reverse: true }],
		ja_KS: [{ unit: '万', value: 10000, reverse: true }]
	};
}

export {
	REDUX_PORT_NAME,
	PEXGLE_HOST,
	API_OVERVIEW,
	FEATURES_ID,
	API_CHECK_DOMAIN_EXISTS,
	API_FOLLOW_A_DOMAIN,
	API_UN_FOLLOW_A_DOMAIN,
	API_FOLLOW_A_FB_PAGE,
	API_UN_FOLLOW_A_FB_PAGE,
	API_GET_BEST_SELLING_PRODUCT,
	API_GET_FREE_PAGING_FACEBOOK_ADS,
	PEXGLE_HOST_PRICING,
	API_MARK_FAVORITE,
	API_MARK_FAVORITE_FACEBOOK_ADS,
	FOLLOW_STATUS,
	API_GET_USER_ID,
	FAVORITE_STATUS,
	API_ALIEXPRESS_VISIT_TRACKING,
	API_SAVE_FACEBOOK_ADS_TRACKING,
	API_GET_CSS_SELECTOR_FACEBOOK_ADS,
	API_GET_PEXGLE_SPONSOR_TEMPLATE,
	SEARCH_TYPE,
	API_GET_BLOCK_ADS_OPTION,
	API_GET_LIST_FACEBOOK_ADS,
	COLOR_CHART,
	API_WEB_DETECTION,
	API_ALIEXPRESS_PRODUCT_DETAIL,
	API_ALIEXPRESS_PRODUCT_ANALYSIS,
	isoCountries,
	CYCLE_TIME_GET_PEXGLE_ADS,
	API_GET_ALIEXPRESS_PRODUCT_PRICE,
	PLATFORM,
	API_GET_NEW_ADD,
	API_GET_TRENDING,
	API_GET_TRENDING_PRODUCT,
	API_SAVE_TWITTER_ADS_TRACKING,
	API_SAVE_TWITTER_REPORT
};
