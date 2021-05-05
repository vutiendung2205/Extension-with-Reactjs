export const GET_LINK_PRODUCT = 'GET_LINK_PRODUCT';
export const GET_PRICE_LINK_PRODUCT = 'GET_PRICE_LINK_PRODUCT';
import { API_WEB_DETECTION } from '../../../../../@fuse/config/constants';
import * as ActionsLayout from '../../../../../layout/store/actions';
import 'babel-core/register';
import 'babel-polyfill';
import { helpers, api } from '../../../../../@fuse/utils';
import arrayCurrency from '../../../../../@fuse/config/currencies.json';
import cheerio from 'cheerio';

export function getLinkProduct(href) {
	return dispatch => {
		dispatch(ActionsLayout.onLoading(0));
		let platform = 1; //Shopify
		if (href.includes('aliexpress.com')) {
			platform = 2; //Aliexpress
		}

		let params = {};
		if (!href.includes('aliexpress.com')) {
			let { rid, pageurl } = new Function(`${__st.innerText} return __st`)();
			params = {
				platform,
				product_id: rid,
				link: pageurl
			};
		} else {
			params = getAliexpressProductId(href);
		}

		api.get(API_WEB_DETECTION, params).then(response => {
			dispatch(ActionsLayout.offLoading());
			dispatch({
				type: GET_LINK_PRODUCT,
				payload: response.data
			});
			if (response.data && response.data.resultv2) {
				getPriceOfLinkProduct(response.data.resultv2).then(data => {
					dispatch({
						type: GET_PRICE_LINK_PRODUCT,
						payload: {
							Shopify: data[0],
							Aliexpress: data[1]
						}
					});
				});
			}
		});
	};
}

const getPriceOfLinkProduct = listLinkAllPlatform => {
	return Promise.all([
		shopifyLinkToPrices(listLinkAllPlatform.shopifySource),
		aliexpressLinkToPrices(listLinkAllPlatform.aliexpressSource)
	]).then(values => {
		return values;
	});
};

const shopifyLinkToPrices = async links => {
	return Promise.all(
		links.map(async link => {
			return api
				.get(new URL(link.origin_link).origin + '/cart.js')
				.then(store => {
					let currency = store.currency;
					return api
						.get(
							link.origin_link + '.js',
							{},
							{
								'cache-control': 'no-cache',
								Pragma: 'no-cache',
								'Upgrade-Insecure-Requests': '1',
								From: 'googlebot(at)googlebot.com',
								'Accept-Encoding': 'gzip',
								'Accept-Language': 'en-US,en;q=0.5',
								Accept: 'application/xhtml+XMLDocument,application/XMLDocument;q=0.9,*/*;q=0.8',
								'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1;+http://www.google.com/bot.html)',
								'upgrade-insecure-requests': '1',
								'if-none-match': 'cacheable:5b681907d3c23fbdf004a64bc6c736d5',
								cookie:
									'_ga=GA1.2.1694710462.1557971784; _fbp=fb.1.1557971784451.760949414; __cfduid=d56267fdef99d3290f0aa686b91b5ef451561515326; _shopify_y=c5b5387a-6c9a-40e3-a399-2cca0c061677; secure_customer_sig=; cart_sig=; _gid=GA1.2.382759227.1561515349'
							}
						)
						.then(product => {
							let priceMax = Number(
								(product.price_max * arrayCurrency[currency]).toString().substr(0, 5)
							);
							let priceMin = Number(
								(product.price_min * arrayCurrency[currency]).toString().substr(0, 5)
							);
							let _price = Number((product.price * arrayCurrency[currency]).toString().substr(0, 5));

							let price =
								helpers.roundDown(product.price_min, true) != helpers.roundDown(product.price_max, true)
									? '$' +
									  helpers.roundDown(priceMin / 100, true) +
									  ' - ' +
									  helpers.roundDown(priceMax / 100, true)
									: '$' + helpers.roundDown(_price / 100, true);
							let roundPrice =
								helpers.roundDown(product.price_min) != helpers.roundDown(product.price_max)
									? '$' +
									  helpers.roundDown(priceMin / 100) +
									  ' - ' +
									  helpers.roundDown(priceMax / 100)
									: '$' + helpers.roundDown(_price / 100);

							return {
								platform: 'Shopify',
								...link,
								price,
								roundPrice
							};
						})
						.catch(e => {
							return {
								platform: 'Shopify',
								...link,
								price: null,
								roundPrice: null
							};
						});
				})
				.catch(e => {
					return {
						platform: 'Shopify',
						...link,
						price: null,
						roundPrice: null
					};
				});
		})
	);
};

const getAliexpressProductId = link => {
	let productId = 0;
	if (link.includes('.aliexpress.com/store/product')) {
		try {
			let url_split = link.split('.html')[0].split('/');
			productId = url_split[url_split.length - 1].split('_')[1];
		} catch (e) {
			productId = 0;
		}
	} else if (link.includes('.aliexpress.com/item/')) {
		try {
			let url_split = link.split('.html')[0].split('/');
			productId = url_split[url_split.length - 1];
		} catch (e) {
			productId = 0;
		}
	} else {
		try {
			productId = link.split('/i/')[1].split('.html')[0];
		} catch (e) {
			productId = 0;
		}
	}
	return {
		platform: 2,
		product_id: productId,
		link
	};
};

/**
 *
 * @param {*} links array
 */
const aliexpressLinkToPrices = async links => {
	return Promise.all(
		links.map(async link => {
			let productId = getAliexpressProductId(link.origin_link)['product_id'];
			let response = null;
			try {
				let url = `https://www.aliexpress.com/item/${productId}.html`;
				response = await api.get(
					url,
					{},
					{
						'user-agent':
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
						'upgrade-insecure-requests': '1',
						// Cookie,
						'Accept-Encoding': 'gzip',
						cookie: 'intl_locale=en_US&aep_usuc_f=site=glo_v&c_tp=USD&region=US&b_locale=en_US',
						'cache-control': 'max-age=0,no-cache',
						'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
						'accept-encoding': 'gzip, deflate, br',
						referer:
							'https://www.aliexpress.com/item/32804034293.html/_____tmd_____/verify/?nc_token=11af24e9562dd2912afdb1a470dcb37b&nc_session_id=01oeZ-6QK0YCAQuO78TGgDvJm-5koe9LLgif3b-PoKELrmhOAX5l6NsqtOhPWAJmt4N8HPWMx6QlMWV-Nw9LKhFln6-0AXmw2z9nEi93BnEET0S_ZfE8KJCKYqDlXZAWdsok34B8QlFM9u5HizBuPDQJGDvFEB2ZNhkS5r-7CCsypH7kxyTNr5IiGZ3i-Id3ijHvJG0DpdSHZOdyTDPcKc6A&nc_sig=05DiT5He4WNtJOklr2wCXYiFQAA456YRYsaMl74JmRcUtAQt71X1tp4J4QAr_xlpczluSiNOvtiGY07piXXwijQktg1oCdF0TXBNLJ273GJanBtkJHwY_5-dUG4dTlQhGDasTYFjBtQJbSmooYFhttQNsIexkfdPvgGFScMhpPRLhPKsTCruwzAMZUMpswJwBghzIiGJzKxLpS1LnjuS6F8jnEPs_3D0-lJiwaplLuVDae4y1WeMeEIkPmfAMp5EFiyaNL3o_CpqD88VORez-orZt8DKb_FBjPEuqQ4Q0KQID8PCeXWuKJfPgQOt3nEip1Kw6PK8wNXpWz3KRA0ub63hRF9KiZTvJb0bxCQP1YXy4o2o3GOxbowBqfBsLfhdzrxZ_x1gOawMBBjyCWaAs8N1sAxQHojeOF39MSL4bxBD6r5ffcEwIRZtmiW7Mgrw0hmig9eHKGZUVFMKkRmtlM7-Q7KAl9e4x3gSlU5GRFmlk&x5secdata=5e0c8e1365474455070961b803bd560607b52cabf5960afff39b64ce58073f78396e508eb90e4252a635ee7287116df396baf272a8e769889207f7f5d5ff9182f45bc036c354d85e65293afca7d9dc33fde70eaf526cd897e8385299614a3772e789e34f9a8d5ae0365a3fe8d0fffe6d823d444dc5f43ac275b3c69b84888233d962ddec1af8435f608bc9185f65d7a2cd76651e2bd9c5cebd2458fb2ecc7bbdbebb76d866521f550e44cc332009d0cdb05960c880170a729a67640856a59b4390602fed578bd718f9a26f732a6df4e7fead6ca6ccec93049283216a6f5c7c8f985a8d48c5e583d1dcb269e2c7b12ea2053625af875e0b89b57ae9dabf56b5ae7b8256e0dd451b8c89a3ef898f4731918979f12d1230f5195068bac1e00dc3a6c7b46b34746723699be39d3c81db5c4ce9709b013b4d125f67c076215e197fd64440bf0b3e57db00024c36b841c1cc35ed81c65bebf3b9df46dd6afed6f199890a777fdb98d49b73549b806bf5b2767f6c79de2b7d9de4012d935ba45d92885dd2b757ac8adc9a6713068aaed6970a3046d7c07b418bd61930fcc7f43085f215e86713c5b56157441d74626077f315c4d124ee5f1aa597c74d0b3c7e6f645ab278d2e83242fc493e95447404524c0717&x5step=100&nc_app_key=X82Y__320d47f8fd1e72b46bce39afbc7e787e',
						accept:
							'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
					}
				);
				if (response.includes('Maintaining')) {
					// console.log("Erorr: ", "Maintaining");
					return {
						platform: 'Aliexpress',
						...link,
						price: null,
						roundPrice: null,
						video_id: null
					};
				}
			} catch (error) {
				// console.log("request: ", error.message);
			}
			if (!response) {
				// console.log("Erorr: ", "response null");
				return {
					platform: 'Aliexpress',
					...link,
					price: null,
					roundPrice: null,
					video_id: null
				};
			}
			if (
				response.includes('Please slide to verify') ||
				response.includes('Service is unavailable') ||
				response.includes('buyerRegisterAndSignIn')
			) {
				// console.log("Erorr: ", "Some things went wrong");
				return {
					platform: 'Aliexpress',
					...link,
					price: null,
					roundPrice: null,
					video_id: null
				};
			}
			try {
				let $ = cheerio.load(response);
				let scripts = $('script');
				let priceFun = null;
				for (let i = 0; i < scripts.length; i++) {
					if ($(scripts[i]).html().includes('window.runParams')) {
						priceFun = new Function(
							` try {let window = {}; ${$(
								scripts[i]
							).html()} return window.runParams.data } catch(e){return null}`
						);
					}
				}
				if (priceFun) {
					// let video_id = $("#video-player").prop("data-uid");

					priceFun = priceFun();
					let video_id = priceFun.imageModule.videoId;
					let title = $($('title')[0]).text();
					let price = priceFun.priceModule;
					let price_max = price.maxActivityAmount ? price.maxActivityAmount.value : price.maxAmount.value;
					let price_min = price.minActivityAmount ? price.minActivityAmount.value : price.minAmount.value;
					let _price = price_min != price_max ? '$' + price_min + ' - ' + price_max : '$' + price_min;
					let roundPrice =
						helpers.roundDown(price_min) != helpers.roundDown(price_max)
							? '$' + helpers.roundDown(price_min) + ' - ' + helpers.roundDown(price_max)
							: '$' + helpers.roundDown(price_min);

					return {
						platform: 'Aliexpress',
						...link,
						price: _price,
						roundPrice,
						video_id,
						title
					};
				} else {
					return {
						platform: 'Aliexpress',
						...link,
						price: null,
						roundPrice: null,
						video_id: null
					};
				}
			} catch (error) {
				// console.log("Error", error);
				return {
					platform: 'Aliexpress',
					link,
					price: null,
					roundPrice: null,
					video_id: null
				};
			}
		})
	);
};
