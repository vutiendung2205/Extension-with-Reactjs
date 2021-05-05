import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import '../../../../../scss/components/Facebook.scss';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import $ from 'jquery';
import * as pgLanguage from '../PexgleAds/language.js';
import { useDebounce, useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../../@fuse/utils/hooks';
import moment from 'moment';

import { CYCLE_TIME_GET_PEXGLE_ADS, units_by_country_on_facebook } from '../../../../@fuse/config/constants';
let checkedPostIds = [];
let is_run = false;
let isGetData = false;
let languageFB = 'en';
let bodyLocalLanguague = 'en-US';

/**
 * Convert number of like, share, comment
 * @param str
 * @param lang
 * @param like
 * @returns {*}
 */
const rever_number_from_engagement = (str, lang = 'en_US', like = false) => {
	if (!str) {
		return 0;
	}
	var unit = units_by_country_on_facebook();
	if (unit[lang] != undefined) {
		str = str.replace(',', '.');
		var numbers = str.replace(/[^(0-9|.)]/g, '');
		var arrayFilter = unit[lang].filter(v => {
			if (like) {
				return str.indexOf(v.unit) != -1;
			} else {
				if (v.reverse != undefined) {
					return str.indexOf(v.unit) != -1;
				}
				return str.indexOf(v.unit + ' ') != -1;
			}
		});
		var currentValue = arrayFilter[0];
		if (currentValue) {
			return parseFloat(numbers) * currentValue.value;
		}
		return parseFloat(numbers.replace('.', ''));
	}
	return str;
};

/**
 * Handle ads
 * @param css_selector
 * @param sponsorTemplate
 * @param blockAdsOption
 */
const getFullDataFromUi = (css_selector, sponsorTemplate, blockAdsOption) => {
	let post_id_inputs = $(`${css_selector.post_id}`);
	let language = getLanguage();
	languageFB = language;
	let countPost = 0;
	for (let post_id_input of post_id_inputs) {
		let post_id = $(post_id_input).val();
		/**
		 * Show Pexgle Ads
		 */
		countPost++;
		// Pexgle Ads
		if (window.location.pathname == '/') {
			let currentHideAds = localStorage.getItem('pg-hide-ads');
			sponsorTemplate.forEach(function (s, i) {
				let dataAdsIds = $(post_id_input).attr('data-ads-ids');
				let link = new URL(!s.display_link.includes('http') ? 'https://' + s.display_link : s.display_link);

				let dropDownMenuHTML = `
        <ul class="pg-drop-down-list" style="display:none" >
            <li onClick="hidePgAd(event,'pg-ad-${s.id}');"> 
                <div class="pg-flex">
                  <div class="pg-li-left-icon"><i class="pg-ads-image pg-hide-icon"></i></div>
                  <div class="pg-li-right">
                        <div class="pg-li-right-title" >${pgLanguage.languages['PG_MENU_HIDE_AD'][language]}</div>
                        <div class="pg-li-right-description">${pgLanguage.languages['PG_MENU_HIDE_AD_DESCRIPTION'][language]}</div>
                  </div>
                </div>
              </li>
              <li onClick="showReportAd(event,'pg-ad-${s.id}');"> 
              <div class="pg-flex">
                <div class="pg-li-left-icon"><i class="pg-ads-image pg-report-icon"></i></div>
                <div class="pg-li-right">
                <div class="pg-li-right-title">${pgLanguage.languages['PG_MENU_REPORT'][language]}</div>
                      <div class="pg-li-right-description">${pgLanguage.languages['PG_MENU_REPORT_DESCRIPTION'][language]}</div>
                </div>
              </div>
            </li>
              <li onClick="savePgAd(event,'pg-ad-${s.id}');"> 
                <div class="pg-flex">
                  <div class="pg-li-left-icon"><i class="pg-ads-image pg-save-icon"></i></div>
                  <div class="pg-li-right">
                        <div class="pg-save-title pg-li-right-title">${pgLanguage.languages['PG_MENU_SAVE_AD'][language]}</div>
                        <div class="pg-save-des pg-li-right-description">${pgLanguage.languages['PG_MENU_SAVE_AD_DESCRIPTION'][language]}</div>
                  </div>
                </div>
              </li>           
                <li onClick="whyISeeThis(event,'pg-ad-${s.id}','${s.page_name}','${link.hostname}','${s.avatar}','${s.page_link}');"> 
                <div class="pg-flex">
                  <div class="pg-li-left-icon"><i class="pg-ads-image pg-wys-icon"></i></div>
                  <div class="pg-li-right">
                        <div class="pg-li-right-title">${pgLanguage.languages['PG_MENU_WYS_AD'][language]}</div>
                  </div>
                </div>
              </li>
          </ul>
         <a onClick="showPgDropdown(event);" style="position:absolute;top:0px;right:5px;" class="pg-dropdown pg-menu-toggle" aria-haspopup="true" aria-expanded="false" rel="toggle" href="#" role="button"></a>
  `;
				dataAdsIds = dataAdsIds ? dataAdsIds : '';
				let adsId = 'id-' + s.id + ',';
				let index = s.new_feed_position.indexOf(countPost);
				if (
					index >= 0 &&
					!dataAdsIds.includes(adsId) &&
					(!currentHideAds || currentHideAds.split(',').indexOf('pg-ad-' + s.id) < 0)
				) {
					s.content_html = s.content_html.replace(
						'PG_ID_CLASS_PLACEHOLDER',
						`data-pg-id = "pg-ad-${s.id}" class="pg-ad-${s.id}"`
					);
					let htmlIncludeUnit = replaceUnit(s.content_html);

					$(post_id_input)
						.parents(`${css_selector.overall_post}`)
						.before(
							replaceLanguage(htmlIncludeUnit).replace(
								'PG_MENU_HTML_PLACEHOLDER',
								dropDownMenuHTML.replace(/\n/g, '')
							)
						);
					// s.new_feed_position.splice(index,1);
					$(post_id_input).attr('data-ads-ids', (dataAdsIds ? dataAdsIds : '') + adsId);
				}
			});
		}

		// PostIds processed
		if (post_id) {
			let totalPostContent = $(post_id_input).parents(`${css_selector.post_area}`);
			try {
				let id = totalPostContent.find(`div[id*=';'][id*=':']`).attr('id').split(';');
				let page_id = id[1];
				checkIfBlockedPageById(totalPostContent, page_id, blockAdsOption, css_selector);

				// console.log({ id });
				// if (id[id.length - 1].split(":").length >= 5 && isGetAds) {

				//   try {
				//     // if (!checkedPostIds.includes(post_id)) {
				//       let content = totalPostContent.find(`${css_selector.content}`).html();
				//       // let textContent = totalPostContent.find(`${css_selector.content}`).text();
				//       let images = totalPostContent.find(`${css_selector.image}`);
				//       let post_image = "";
				//       if (images.length != 0) {
				//         for (let image of images) {
				//           if ($(image).attr("src")) {
				//             post_image = $(image).attr("src");
				//             break;
				//           }
				//         }
				//       }
				//       let reactions = totalPostContent.find(`${css_selector.reactions}`).text();
				//       let comments = totalPostContent.find(`${css_selector.comments}`).text();
				//       let shares = totalPostContent.find(`${css_selector.shares}`).text();
				//       let views = totalPostContent.find(`${css_selector.views}`).text();
				//       let type = totalPostContent.find(`${css_selector.type_post}`).find("video").length > 0 ? 2 : 1;

				//       reactions = rever_number_from_engagement(reactions, language, true);
				//       comments = rever_number_from_engagement(comments, language);
				//       shares = rever_number_from_engagement(shares, language);
				//       views = views ? rever_number_from_engagement(views, language) : null;

				//       // console.log(textContent);
				//       let finalObject = {
				//         post_id,
				//         page_id,
				//         feature_image: post_image,
				//         content,
				//         comments,
				//         shares,
				//         views,
				//         reactions,
				//         type
				//       };

				//       // saveSponsor(finalObject);
				//       dispatch(Actions.saveFacebookAdsTracking(finalObject));
				//     // }
				//     // checkedPostIds.push(post_id);
				//   }
				//   catch (e) {
				//   }
				// }
				// else {
				//   // if (window.location.pathname == '/') totalPostContent[0].innerHTML = '';
				// }
			} catch (error) {
				// console.log("Error totalPostContent: ", totalPostContent);
				// if (window.location.pathname == '/') totalPostContent[0].innerHTML = '';
			}

			// console.log(window.getEventListeners(totalPostContent.find(`div[id*='fb_story_md'] a`)[0]))
			// let sponsoredSpan = totalPostContent.find(`${css_selector.is_sponsored}`)[0];

			// if (post_id_input && sponsoredSpan) {

			// }
		}
	}
};

/**
 * Check block when first load
 */
const checkBlockWhenFirstLoad = (css_selector, blockAdsOption) => {
	let post_id_inputs = $(`${css_selector.post_id}`);
	try {
		for (let post_id_input of post_id_inputs) {
			let totalPostContent = $(post_id_input).parents(`${css_selector.post_area}`);
			let page_id = totalPostContent.find(`${css_selector.page_id}`).prop('id').split(';')[1];
			let sponsoredSpan = totalPostContent.find(`${css_selector.is_sponsored}`)[0];
			if (post_id_input && sponsoredSpan) {
				checkIfBlockedPageById(totalPostContent, page_id, blockAdsOption, css_selector);
			}
		}
	} catch (e) {}
};

/**
 *
 * @param totalPostContent
 * @param page_id
 * @param blockAdsOption
 * @param css_selector
 */
const checkIfBlockedPageById = (totalPostContent, page_id, blockAdsOption, css_selector) => {
	if (!blockAdsOption.blockAll) {
		if (blockAdsOption.blackList.includes(page_id)) {
			let postElem = totalPostContent.parents(`${css_selector.overall_post}:not(.hidden_elem)`);
			postElem.addClass('hidden_elem');
		}
	} else {
		if (!blockAdsOption.whiteList.includes(page_id)) {
			let postElem = totalPostContent.parents(`${css_selector.overall_post}:not(.hidden_elem)`);
			postElem.addClass('hidden_elem');
		}
	}
};
function replaceLanguage(html) {
	html = html.replace(/Sponsored/g, pgLanguage.languages['PG_SPONSOR'][languageFB]);
	html = html.replace('LIKE_PLACE_HOLDER', pgLanguage.languages['PG_LIKE'][languageFB]);
	html = html.replace('SHARE_PLACE_HOLDER', pgLanguage.languages['PG_SHARE'][languageFB]);
	html = html.replace('COMMENT_PLACE_HOLDER', pgLanguage.languages['PG_COMMENT'][languageFB]);
	html = html.replace('SHARES_PLACE_HOLDER', pgLanguage.languages['PG_SHARES'][languageFB]);
	html = html.replace('COMMENTS_PLACE_HOLDER', pgLanguage.languages['PG_COMMENTS'][languageFB]);

	return html;
}
function isNoThousandUnit(lang) {
	return (
		lang == 'zh' ||
		lang.includes('zh_') ||
		lang == 'it' ||
		lang.includes('it_') ||
		lang == 'ja' ||
		lang.includes('ja_')
	);
}
function is10Thousand(lang) {
	return lang == 'zh' || lang.includes('zh_') || lang == 'ja' || lang.includes('ja_');
}
function isNumberBehindTitle(lang) {
	return lang == 'ja' || lang.includes('ja_') || lang == 'it' || lang.includes('it_');
}
function isReverseUnit(lang) {
	return lang == 'it' || lang.includes('it_');
}
function getNumberWithUnit(lang, number, unit) {
	if (isReverseUnit(lang)) {
		return unit + number.toLocaleString(bodyLocalLanguague);
	} else {
		return number.toLocaleString(bodyLocalLanguague) + unit;
	}
}
function replaceUnit(html) {
	var div = document.createElement('div');
	div.innerHTML = html.trim();
	// Change this to div.childNodes to support multiple top-level nodes
	let htmlObj = div.getElementsByTagName('div')[0];
	if (!htmlObj) return html;
	let arrayUnitObj = htmlObj.getElementsByClassName('pg-need-change-unit');
	let unit = pgLanguage.languages['PG_UNIT_THOUSAND'][languageFB];
	let unit2 = pgLanguage.languages['PG_UNIT_MILLION'][languageFB];
	for (let i = 0; i < arrayUnitObj.length; i++) {
		let textContent = arrayUnitObj[i].innerHTML;
		let hasCommentPlaceHolder = textContent.includes('COMMENTS_PLACE_HOLDER');
		let hasSharePlaceHolder = textContent.includes('SHARES_PLACE_HOLDER');
		let textNumber = Number(
			textContent
				.replace('COMMENTS_PLACE_HOLDER', '')
				.replace('SHARES_PLACE_HOLDER', '')
				.replace('K', '000')
				.replace('M', '000')
		);
		if (is10Thousand(languageFB)) {
			// china thì tính theo vạn
			if (textNumber >= 10000) {
				textNumber = textNumber / 10000;
				textContent = getNumberWithUnit(languageFB, textNumber, unit);
			} else {
				textContent = getNumberWithUnit(languageFB, textNumber, unit);
				if (languageFB == 'ja' || languageFB.includes('ja_')) {
					textContent = textContent + '件';
				}
			}
		} else {
			if (textNumber >= 1000 && textNumber < 1000000) {
				if (isNoThousandUnit(languageFB)) {
					textContent = getNumberWithUnit(languageFB, textNumber, unit);
				} else {
					textNumber = textNumber / 1000;
					textContent = getNumberWithUnit(languageFB, textNumber, unit);
				}
			} else if (textNumber >= 1000000) {
				textNumber = textNumber / 1000000;
				textContent = getNumberWithUnit(languageFB, textNumber, unit2);
			}
		}
		if (hasCommentPlaceHolder) {
			if (isNumberBehindTitle(languageFB)) {
				textContent = 'COMMENTS_PLACE_HOLDER ' + textContent;
				if (languageFB == 'ja' || languageFB.includes('ja_')) {
					textContent = textContent + '件';
				}
			} else {
				textContent = textContent + ' COMMENTS_PLACE_HOLDER';
				if (languageFB == 'ja' || languageFB.includes('ja_')) {
					textContent = textContent + '件';
				}
			}
		}
		if (hasSharePlaceHolder) {
			if (isNumberBehindTitle(languageFB)) {
				textContent = 'SHARES_PLACE_HOLDER ' + textContent;
			} else {
				textContent = textContent + ' SHARES_PLACE_HOLDER';
			}
		}
		arrayUnitObj[i].innerHTML = textContent;
	}
	return htmlObj.outerHTML;
}
function getLanguage() {
	let language = document
		.getElementsByTagName('body')[0]
		.classList.toString()
		.split(' ')
		.filter(x => x.includes('Locale_'));
	if (language.length > 0) {
		let l = language[0].replace('Locale_', '');
		bodyLocalLanguague = l.replace('_', '-');
		if (pgLanguage.languages['PG_SPONSOR'][l]) {
			return l;
		} else {
			let mainLanguage = l.split('_')[0];
			if (pgLanguage.languages['PG_SPONSOR'][mainLanguage]) {
				return mainLanguage;
			} else {
				return 'en';
			}
		}
	} else {
		return 'en';
	}
}
function FacebookAds(props) {
	const dispatch = useDispatch();
	const pexgleAdsObj = useSelector(({ pexgleAds }) => {
		// console.log("BBBBBBBBBBBBBBBBBBBBB", pexgleAds);
		return pexgleAds.pexgleAdsObj;
	});
	useFirstEffect(() => {
		pexgleAdsObj == null ||
			(pexgleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS < new Date().getTime() &&
				dispatch(Actions.getFacebookAdsOfPexgle()));
	}, [pexgleAdsObj, dispatch]);
	//console.log("pexgleAdsObj: ", pexgleAdsObj);
	if (
		pexgleAdsObj &&
		pexgleAdsObj.facebookAdsTrackingCssSelector != null &&
		pexgleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS > new Date().getTime() &&
		pexgleAdsObj.blockAdsOption != null &&
		is_run === false
	) {
		is_run = true;
		let current = moment().isoWeekday() + '-' + moment().hour();
		let sponsorTemplate = pexgleAdsObj.data.filter(s => s.show_times.includes(current) && s.platform == 'FACEBOOK');
		let bodyHeight = $('body').height();
		checkBlockWhenFirstLoad(pexgleAdsObj.facebookAdsTrackingCssSelector, pexgleAdsObj.blockAdsOption);
		getFullDataFromUi(
			pexgleAdsObj.facebookAdsTrackingCssSelector,
			sponsorTemplate,
			pexgleAdsObj.blockAdsOption,
			dispatch
		);
		setInterval(() => {
			let currentBodyHeight = $('body').height();
			if (bodyHeight !== currentBodyHeight) {
				bodyHeight = currentBodyHeight;
				getFullDataFromUi(
					pexgleAdsObj.facebookAdsTrackingCssSelector,
					sponsorTemplate,
					pexgleAdsObj.blockAdsOption,
					dispatch
				);
			}
		}, 1000);
	}
	// else if (isGetData === false) {
	//   isGetData = true;
	//   if (pexgleAdsObj == null || (pexgleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS) < new Date().getTime())
	//     dispatch(Actions.getFacebookAdsOfPexgle());
	// }
	// else if (pexgleAdsObj != null && (pexgleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS) < new Date().getTime()) {
	//   dispatch(Actions.getFacebookAdsOfPexgle());
	// }
	let language = getLanguage();
	let hideHtml =
		'<div class="hide-pg-container" id="u_1c_0"><i class="hide-pg-icon"></i><div class="_6i_3" style="flex:1;"><span class="hide-pg-title">' +
		pgLanguage.languages['PG_HIDED_AD'][language] +
		'</span><div class="hide-pg-content">' +
		pgLanguage.languages['PG_HIDED_AD_DES'][language] +
		'</div></div><a  onClick = "undoHide(event,`PG_ID_PLACE_HOLDER`);" role="button" class="hide-pg-button"  href="#" rel="async-post">' +
		pgLanguage.languages['PG_UNDO'][language] +
		'</a></div>';
	let saveHtml =
		'<div class="hide-pg-container" id="u_1c_0"><i class="save-pg-icon"></i><div class="_6i_3" style="flex:1;"><span class="hide-pg-title">' +
		pgLanguage.languages['PG_SAVE_SUCCESSFUL'][language] +
		'</span><div class="hide-pg-content">' +
		pgLanguage.languages['PG_MENU_SAVE_AD_DESCRIPTION'][language] +
		'</div></div><a  onClick = "undoSave(event);" role="button" class="hide-pg-button"  href="#" rel="async-post">' +
		pgLanguage.languages['PG_UNDO'][language] +
		'</a></div>';
	let reportHtml =
		'<div class="hide-pg-container" id="u_1c_0"><i class="hide-pg-icon"></i><div class="_6i_3" style="flex:1;"><span class="hide-pg-title">' +
		pgLanguage.languages['PG_AD_REPORT_REPORTED'][language] +
		'</span><div class="hide-pg-content">' +
		pgLanguage.languages['PG_AD_REPORT_NOT_DISPLAY_AGAIN'][language] +
		'</div></div><a  onClick = "undoHide(event,`PG_ID_PLACE_HOLDER`);" role="button" class="hide-pg-button"  href="#" rel="async-post">' +
		pgLanguage.languages['PG_UNDO'][language] +
		'</a></div>';
	let selectHideResaonHTML = `
  <div class ="pg-reason-backdop">
    <div class ="pg-hide-reason-container"> 
        <div class ="close-reason" onClick ="closeHideReason();"><i></i></div>
        <div class="hide-reason-header">${pgLanguage.languages['PG_HIDED_AD_POPUP'][language]} </div>
        <div class="hide-reason-body">
          <div class ="reason-question">
          <img class="pg-info" src="https://www.facebook.com/images/assets_DO_NOT_HARDCODE/facebook_icons/info-circle_filled_16_fds-gray-25.png" alt=""><span> ${pgLanguage.languages['PG_HIDED_AD_QUESTION'][language]}</span>
          </div>
          <div class="pg-reason-container">
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_HIDED_AD_REASON_1'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_HIDED_AD_REASON_2'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_HIDED_AD_REASON_3'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_HIDED_AD_REASON_4'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_HIDED_AD_REASON_5'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_HIDED_AD_REASON_6'][language]}</div>
          </div>
        </div>
        <div class="hide-reason-footer">
            <button class="pg-close-reason pg-disabled" onClick = "finishSelectReason(event);"> ${pgLanguage.languages['PG_HIDED_AD_FINISH'][language]}</button>
        </div>
    </div>  
  </div>`;
	let reportAdHTML = `
  <div class ="pg-reason-backdop">
    <div class ="pg-hide-reason-container"> 
        <div class ="close-reason" onClick ="closeHideReason();"><i></i></div>
        <div class="hide-reason-header">${pgLanguage.languages['PG_AD_REPORT'][language]} </div>
        <div class="hide-reason-body">
          <div class ="reason-question">
          <img class="" src="https://www.facebook.com/images/assets_DO_NOT_HARDCODE/facebook_icons/feedback_filled_24_artillery-orange.png" style="min-width: 24px;width:24px;height:24px;margin-right:8px;" alt=""><span> ${pgLanguage.languages['PG_AD_REPORT_DESCRIPTION'][language]}</span>
          </div>
          <div class="pg-reason-container">
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_1'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_2'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_3'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_4'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_5'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_6'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_7'][language]}</div>
            <div class="pg-reason-item" onClick="selectReason(event);">${pgLanguage.languages['PG_AD_REPORT_8'][language]}</div>
          </div>
        </div>
        <div class ="reason-question" style ="padding: 16px 32px 0px 16px;margin: 0px 0 0px 0px;padding-bottom: 16px;border-top: 1px solid rgb(218, 221, 225);">
           <img class="pg-info" src="https://www.facebook.com/images/assets_DO_NOT_HARDCODE/facebook_icons/info-circle_filled_16_fds-gray-25.png" alt=""><span> ${pgLanguage.languages['PG_AD_REPORT_INFO'][language]}</span>
        </div>
        <div class="hide-reason-footer">
            <button class="pg-close-reason pg-disabled" onClick = "finishSelectReason(event);"> ${pgLanguage.languages['PG_AD_REPORT_SEND'][language]}</button>
        </div>
    </div>  
  </div>`;
	let whyIseeThisAdHtml = `
  <div class ="pg-wys-backdop">
    <div class ="pg-wys-container"> 
        <div onClick="closeWYS();" class="pg-wys-close circle-gray">
          <i class="pg-wys-close-icon"></i>
        </div>
        <div class = "pg-wys-header">
            <div class="pg-wys-header-title pg-language">${pgLanguage.languages['PG_WYS_HEADER'][language]}</div>
            <div class="pg-wys-header-info"><i class="pg-wys-lock pg-language"></i>${pgLanguage.languages['PG_WYS_ONLY_YOU'][language]}</div>
        </div>
        <hr class="pg-line" style="border-bottom-color: rgb(218, 221, 225);">
        <div class ="pg-wys-body">
              <div class = "pg-wys-reason-container">
                  <div class = "pg-wys-reason-header pg-language"> ${pgLanguage.languages['PG_WYS_REASON_HEADER'][language]} </div>
                  <div class = "pg-wys-reason"><div class="pg-reason-icon  circle-gray "><i class="pg-reason-icon pg-reason-icon-1" style ="background-image: url(/rsrc.php/v3/yx/r/HpaGKEW1yeX.png);background-position: -63px -189px;"></i></div> <div style="
                  display: flex;
                  justify-content: space-between;
                  align-content: center;
                  line-height: 18px;
                  width: 100%;
              ">
              <div style="line-height: 26px;
              width: 400px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: inline-block;" class="pg-reason-content pg-mg-l-12" title="${pgLanguage.languages['PG_WYS_REASON_1_CONTENT'][language]}">${pgLanguage.languages['PG_WYS_REASON_1_CONTENT'][language]}</div> 
                  <div class="" style=""><i alt="" class="img sp_uyPBjdsC_pl sx_223256" style="
                  width: 24px;
                  height: 24px;
                  background-position: -25px -271px;
                  background-image: url(/rsrc.php/v3/yy/r/bS5Xi6eU5g8.png);
                  background-size: auto;
                  background-repeat: no-repeat;
                  display: inline-block;
                  cursor: pointer;
              "></i></div>
              </div></div>
                  <div class = "pg-wys-reason"><div class="pg-reason-icon  circle-gray "><i class="pg-reason-icon pg-reason-icon-2" style ="background-image: url(/rsrc.php/v3/yx/r/HpaGKEW1yeX.png);background-position: -55px -210px;"></i></div><div style="
                  display: flex;
                  justify-content: space-between;
                  align-content: center;
                  line-height: 18px;
                  width: 100%;
              ">
              <div style="line-height: 26px;
              width: 400px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: inline-block;" class="pg-reason-content pg-mg-l-12" title="${pgLanguage.languages['PG_WYS_REASON_2_CONTENT'][language]}">${pgLanguage.languages['PG_WYS_REASON_2_CONTENT'][language]}</div> 
                  <div class="" style=""><i alt="" class="img sp_uyPBjdsC_pl sx_223256" style="
                  width: 24px;
                  height: 24px;
                  background-position: -25px -271px;
                  background-image: url(/rsrc.php/v3/yy/r/bS5Xi6eU5g8.png);
                  background-size: auto;
                  background-repeat: no-repeat;
                  display: inline-block;
                  cursor: pointer;
              "></i></div>
              </div></div>
                  <div class = "pg-wys-reason"><div class="pg-reason-icon  circle-gray "><i class="pg-reason-icon pg-reason-icon-3 " style ="background-image: url(/rsrc.php/v3/yx/r/HpaGKEW1yeX.png);background-position: -34px -231px;"></i></div> <div style="
                  display: flex;
                  justify-content: space-between;
                  align-content: center;
                  line-height: 18px;
                  width: 100%;
              ">
              <div style="line-height: 26px;
              width: 400px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: inline-block;" class="pg-reason-content pg-mg-l-12" title="${pgLanguage.languages['PG_WYS_REASON_3_CONTENT'][language]}">${pgLanguage.languages['PG_WYS_REASON_3_CONTENT'][language]}</div> 
                  <div class="" style=""><i alt="" class="img sp_uyPBjdsC_pl sx_223256" style="
                  width: 24px;
                  height: 24px;
                  background-position: -25px -271px;
                  background-image: url(/rsrc.php/v3/yy/r/bS5Xi6eU5g8.png);
                  background-size: auto;
                  background-repeat: no-repeat;
                  display: inline-block;
                  cursor: pointer;
              "></i></div>
              </div> </div>
              </div>
              <hr class="pg-line" style="border-bottom-color: rgb(218, 221, 225);">
              <div class = "pg-wys-action">
                  <div class = "pg-wys-header-action pg-language">${pgLanguage.languages['PG_WYS_YOU_CAN_DO'][language]}</div>
                  <div class="pg-wys-action-item">
                      <div class= "pg-action-image-container">
                        <i class ="pg-action-hide-icon"></i>
                        <img  class="pg-action-image" src="%PAGE_AVATAR%" />
                      </div>
                      <div class="pg-action-title pg-mg-l-12">
                          <div id="pg-hide-title" class="pg-wys-action-title pg-language">${pgLanguage.languages['PG_WYS_ACTION_1_TITLE'][language]}</div>
                          <div id="pg-hide-des" class="pg-wys-description pg-language">${pgLanguage.languages['PG_WYS_ACTION_1_DES'][language]}</div>
                      </div>
                      <div id="pg-hide-button" data-pg-id ="PG_ID_PLACE_HOLDER" data-page-name="Pexgle" class="pg-action-button pg-language" onClick="hidePgAd2(event);"> ${pgLanguage.languages['PG_WYS_ACTION_HIDE'][language]}</div>
                  </div>
                  <div class="pg-wys-action-item" onClick = "openAdList();" style="cursor:pointer;">
                  <div class= "pg-reason-icon  circle-gray ">
                    <i class ="pg-action-config-icon"></i>                    
                  </div>
                  <div class="pg-action-title pg-mg-l-12">
                      <div class="pg-wys-action-title pg-language">${pgLanguage.languages['PG_WYS_ACTION_2_TITLE'][language]}</div>
                      <div class="pg-wys-description pg-language">${pgLanguage.languages['PG_WYS_ACTION_2_DES'][language]}</div>
                  </div>
                  <div class="pg-action-config"></div>
              </div>
              </div>
              <hr class="pg-line" style="border-bottom-color: rgb(218, 221, 225);">
              <div class="pg-wys-bottom">
              <span style="flex:1;"></span>
                <span class="pg-guide-text pg-language">${pgLanguage.languages['PG_WYS_IS_GUIDE_HEPL'][language]}</span>
                <span class ="pg-wys-button pg-action-button pg-language" onClick = "showWYSThank();">${pgLanguage.languages['PG_WYS_YES'][language]}</span>
                <span class ="pg-wys-button pg-action-button pg-language" onClick = "showWYSThank();">${pgLanguage.languages['PG_WYS_NO'][language]}</span>
              </div>
          </div>
    </div>
  </div>
  `;
	let pexgleCss = `
  <style>
      .needTooltipShare:hover  .tooltipShare {
        visibility: visible !important;
      }
      .needTooltipReaction:hover  .tooltipReaction {
        visibility: visible !important;
      }
      .needTooltipComment:hover  .tooltipComment {
        visibility: visible !important;
      }
      .pg-dropdown{
        background-image: url(/rsrc.php/v3/y_/r/Gl-8sXxv2FU.png);
        background-repeat: no-repeat;
        background-size: auto;
        background-position: 0 -180px;
        height: 20px;
        margin-top: 10px;
        width: 20px;
        z-index:2;
      }
      .pg-dropdown:hover{
        background-image: url(/rsrc.php/v3/y_/r/Gl-8sXxv2FU.png);
        background-repeat: no-repeat;
        background-size: auto;
        background-position: -21px -180px;
      }
      .pg-drop-down-list{
        padding: 5px 0;
        position:absolute;
        right:5px;
        top:28px;
        z-index:3;
        background:white;
        background-clip: padding-box;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, .15);
        border-radius: 3px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, .3);   
        width :250px;         
      }
      .pg-drop-down-list li{
        padding: 5px 12px;
        cursor : pointer;
        position: relative;
      }
      .pg-ads-image {           
        background-size: auto;
        background-repeat: no-repeat;
        display: inline-block;
        height: 16px;
        width: 16px;
        position: absolute;
        top: 7px;
    }
    .pg-save-icon{
      background-image: url(/rsrc.php/v3/yT/r/wyHDKN-FqWH.png);
      background-position: 0 -110px;
    }
    .pg-hide-icon{
      background-image: url(/rsrc.php/v3/yI/r/aFCwsbktaik.png);
      background-position: 0 -803px;
    }
    .pg-flex{
      display:flex;
    }
    .pg-li-left-icon{
      width:24px;
    }
    .pg-li-right {
      flex:1;
      display:flex;
      flex-direction: column;
    }
    .pg-li-right-title{
      color: #1d2129;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      white-space: normal;
    }
    .pg-li-right-description {
      color: #90949c;
      font-size: 11px;
      font-weight: normal;
      line-height: 16px;
      white-space: normal;
    }
    .pg-drop-down-list li:hover {
      background-color: #4267b2;
      border-color: #29487d;
      border: solid #fff;
      border-width: 1px 0;
      border-top: 1px solid #29487d;
      border-bottom: 1px solid #29487d;
    }
    .pg-drop-down-list li:hover .pg-save-icon{
      background-image: url(/rsrc.php/v3/yT/r/wyHDKN-FqWH.png);
      background-position: 0 -93px;
    }
    .pg-drop-down-list li:hover .pg-hide-icon{
      background-image: url(/rsrc.php/v3/yI/r/aFCwsbktaik.png);
      background-position: 0 -786px;
    }
    .pg-drop-down-list li:hover .pg-li-right-title, .pg-drop-down-list li:hover .pg-li-right-description {
      color:white;
    }
    .hide-pg-container{
      font-size: 12px;
      display:flex;
      padding: 12px 10px;
      background: white;
      border: 1px solid #dddfe2;
      border-radius: 3px;
      margin-bottom:10px;
    }
    .hide-pg-icon{
      background-image: url(/rsrc.php/v3/yE/r/mnY2RsbG9jw.png);
      background-size: auto;
      background-repeat: no-repeat;
      display: inline-block;
      height: 20px;
      width: 20px;
      flex-shrink: 0;
      margin: 4px 8px 4px 0;
    }     
    .hide-pg-title{
      font-weight: bold;
      color: #1d2129;
    }  
    .hide-pg-content{
      color: #90949c;
    }
    .hide-pg-button{
      align-self: center;
      flex-shrink: 0;
      margin-left: 6px;
      line-height: 22px;
      background-color: #f5f6f7;
      border-color: #ccd0d5;
      color: #4b4f56;
      transition: 200ms cubic-bezier(.08,.52,.52,1) background-color, 200ms cubic-bezier(.08,.52,.52,1) box-shadow, 200ms cubic-bezier(.08,.52,.52,1) transform;
      border: 1px solid;
      border-radius: 2px;
      box-sizing: content-box;
      -webkit-font-smoothing: antialiased;
      font-weight: bold;
      justify-content: center;
      padding: 0 8px;
      position: relative;
      text-align: center;
      text-shadow: none;
      vertical-align: middle;
      cursor: pointer;
      display: inline-block;
      white-space: nowrap;
      text-decoration:none;
    }
    .hide-pg-button:hover{
      background-color: #ebedf0;
      text-decoration:none;
    }
  </style>`;
	let whyYouSeeCss = `<style>
  .pg-drop-down-list li .pg-wys-icon{
   background-image: url(/rsrc.php/v3/yI/r/aFCwsbktaik.png);
   background-position: 0 -854px;
  }
  .pg-drop-down-list li:hover .pg-wys-icon{
    background-image: url(/rsrc.php/v3/yv/r/8PHqpgV_Z5X.png);
    background-position: 0 -345px;
  }
  .pg-wys-backdop, .pg-reason-backdop{
    position:fixed;
    width:100%;
    height:100%;
    z-index:99999;
    background-color:rgba(0, 0, 0, .4);
  }
  .pg-wys-container{
    position: relative;
    width: 555px;
    margin-top: 50px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 26px rgba(0, 0, 0, .3), 0 0 0 1px rgba(0, 0, 0, .1);
    margin: 10% auto;
    z-index: 99999;
  }
  .pg-wys-header{
    justify-content: center;
    align-items: center;
    height: 80px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    line-height: 18px;
  }
  .pg-wys-header-title{
    font-family: Arial, sans-serif;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: normal;
    font-weight: bold;
    overflow-wrap: normal;
    text-align: center;
    color: rgb(28, 30, 33);
  }
  .pg-wys-header-info{
    font-family: Arial, sans-serif;
    font-size: 13px;
    line-height: 17px;
    letter-spacing: normal;
    overflow-wrap: normal;
    text-align: left;
    color: rgb(96, 103, 112);
    display: inline-block;
  }
  .pg-wys-lock{
    width: 12px;
    height: 12px;
    background-position: 0 -609px;
    background-image: url(/rsrc.php/v3/yv/r/8PHqpgV_Z5X.png);
    background-size: auto;
    background-repeat: no-repeat;
    display: inline-block;
    color: #1d2129;
    margin-right:4px;
  }
  .pg-wys-close{
    position: absolute;
    right: 20px;
    top: 20px;
    background-color: #ebedf0;
  }
  .circle-gray{
    border-radius: 50%;
    height: 36px;
    width: 36px;
    min-width: 36px;
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .pg-wys-close-icon{
    width: 20px;
    height: 20px;
    background-position: -42px -189px;
    background-image: url(/rsrc.php/v3/yx/r/HpaGKEW1yeX.png);
    background-size: auto;
    background-repeat: no-repeat;
    display: inline-block;
    cursor: pointer;
  }
  .pg-wys-body{
    padding:16px;
  }
  .pg-line{
    border-bottom-color: rgb(218, 221, 225);
    border: none;
    border-bottom: 1px solid;
    height: 0;
    margin-bottom: 8px;
    margin-top: 8px;
    background: #dadde1;
    color: #dadde1;
  }
  .pg-wys-reason-header{
    margin-bottom: 8px;
  }
  .pg-wys-reason{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding:0px 8px;
    font-size: 14px;
    line-height: 18px;
    padding: 8px 0;
  }
  .pg-reason-icon{
    background-color: #f5f6f7;
  }
  .pg-reason-icon i{
    height: 16px;
    width: 16px;
    background-size: auto;
    background-repeat: no-repeat;
  }
  .pg-action-image{
    background-color: #f5f6f7;
    height: 16px;
    width: 16px;
    background-size: auto;
    background-repeat: no-repeat;
  }
  .pg-mg-l-12{
    margin-left:12px;
  }
  .pg-wys-header-action{
      padding: 8px 0px 12px 0px;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: normal;
      font-weight: bold;
      overflow-wrap: normal;
      text-align: left;
      color: rgb(28, 30, 33);
  }
  .pg-wys-action-item{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  .pg-action-image-container{
    position:relative;
    width:36px;
    height:36px;
    border-radius: 50%;
  }
  .pg-action-image{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .pg-action-hide-icon{
    background-image: url(/rsrc.php/v3/yW/r/3Q-2E32A_B6.png);
    background-size: auto;
    background-repeat: no-repeat;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-position: -326px -1674px;
    position:absolute;
    right: -5px;
    bottom: -5px;
    background-color: white;
    border-radius: 50%;
  }
  .pg-action-button{
    padding: 0px 12px;
    align-items: center;
    align-self: auto;
    height: 36px;
    background-color: #e4e6eb;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    color: #050505;
    display:flex;
    margin-left: 10px;
    font-weight: 600;
    font-size:15px;
  }
  .pg-action-button:hover{
     background-color: #d2d3d6;
  }
  .pg-action-title{
    flex: 1;
  }
  .pg-action-config {
    background-image: url(/rsrc.php/v3/yS/r/moDmXDQnn2e.png);
    background-size: auto;
    background-repeat: no-repeat;
    display: inline-block;
    width: 24px;
    height: 24px;
    background-position: -75px -238px;
}
.pg-action-config-icon{
  background-image: url(/rsrc.php/v3/yV/r/nYN5Om6ilwl.png);
  background-position: 0 -720px;
  background-size: auto;
  background-repeat: no-repeat;
  display: inline-block;
  height: 16px;
  width: 16px;
}
.pg-wys-action-title{
  margin-bottom: 2px;
}
.pg-wys-description{
  font-family: Arial, sans-serif;
    font-size: 13px;
    line-height: 17px;
    letter-spacing: normal;
    overflow-wrap: normal;
    text-align: left;
    color: rgb(96, 103, 112);
}
.pg-guide-text{
  font-size: 14px;
  line-height: 18px;
  letter-spacing: normal;
  overflow-wrap: normal;
  text-align: left;
  color: rgb(96, 103, 112);
}
.pg-wys-bottom{
  display:flex;
  align-items: center;
  padding-top: 5px;
}
.pg-hide-reason-container{
  position:relative;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 16px 32px 2px;
  height: auto;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  min-height: 160px;
  overflow: initial;
  width: 450px;
  max-width:100%;
  margin: 10% auto;
}
.hide-reason-header{
  padding: 12px 44px 12px 16px;
  color: rgb(28, 30, 33);
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
}
.close-reason{
  position:absolute;
  right: 0;
  top: 0;
  padding: 12px; 
  cursor:pointer;   
}
.close-reason i{
  background-image: url(/rsrc.php/v3/y_/r/AR6iMYqT9Yo.png);
  background-size: auto;
  background-repeat: no-repeat;
  display: inline-block;
  width: 16px;
  height: 16px;
  background-position: 0 -119px;
}
.hide-reason-body{
  border-top: 1px solid rgb(218, 221, 225);
  display:flex;
  flex-direction:column;
  flex:1;
}
.reason-question{
  display: flex;
  margin: 16px 32px 0px 16px;
  color: #606770;
  font-size: 14px;
  line-height: 18px;
  align-items: center;
}
.pg-info{
  margin-right: 8px;
  width: 16px;
  height: 16px;
}
.pg-reason-container{
  margin: 16px 32px 0px 48px;
}
.pg-reason-item{  
  font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: normal;
    overflow-wrap: normal;
    text-align: left;
    color: rgb(28, 30, 33);
    align-items: center;
    background: #f5f6f7;
    border: 1px solid #dddfe2;
    border-radius: 20px;
    display: inline-flex;
    margin-bottom: 8px;
    margin-right: 8px;
    padding: 8px 12px;
    outline-color: #fff;
    cursor: default;
}
.pg-reason-item.pg-reason-selected{
  background: #3578e5;
  border: 1px solid #3578e5;
  color:white;
}
.hide-reason-footer{
  align-items: center;
  justify-content: flex-end;
  display: flex;
  flex: 0 0 auto;
  padding:12px 16px;
  border-top: 1px solid rgb(218, 221, 225);
}
.pg-close-reason{
  border: 1px solid;
  letter-spacing: normal;
  color: rgb(255, 255, 255);
  font-size: 12px;
  font-weight: bold;
  line-height: 26px;
  text-align: center;
  background-color: rgb(24, 119, 242);
  border-color: rgb(24, 119, 242);
  height: 28px;
  padding-left: 11px;
  padding-right: 11px;
  border-radius: 2px;
  cursor: pointer;
  text-shadow: none;
  transition: all 300ms cubic-bezier(.1, .7, .1, 1), border-width 1ms;
  transition-property: background, border-color, border-width, color;
  vertical-align: middle;
}
.pg-disabled{
  background-color: rgb(176, 213, 255);
  border-color: rgb(176, 213, 255);
  pointer-events: none;
}
.pg-report-icon{
  background-image: url(/rsrc.php/v3/yI/r/aFCwsbktaik.png);
  background-position: 0 -1041px;
}
.pg-drop-down-list li{
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
}
.pg-drop-down-list li:hover .pg-report-icon{
  background-position: 0 -1007px;
}
.no-scroll{
  overflow-y:hidden !important;
}
.save-pg-icon{
  background-position: 0 -21px;
  background-image: url(/rsrc.php/v3/yT/r/wyHDKN-FqWH.png);
  background-size: auto;
  background-repeat: no-repeat;
  display: inline-block;
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  margin: 4px 8px 4px 0;
}
  </style>`;
	$('body').prepend(pexgleCss);
	$('body').prepend(whyYouSeeCss);
	$('body').prepend(`
  <script id ="pgScriptElement">
  function disableScrollBody(){
    document.getElementsByTagName("body")[0].classList.add('no-scroll');
  }
  function restoreScrollBody(){
    document.getElementsByTagName("body")[0].classList.remove('no-scroll');
  }
  function showPgDropdown(e){   
    let currentDisplay = e.target.parentNode.getElementsByClassName("pg-drop-down-list")[0].style.display;
    if(currentDisplay == "block"){
      e.target.parentNode.getElementsByClassName("pg-drop-down-list")[0].style.display = "none";
    }      
    else{
      e.target.parentNode.getElementsByClassName("pg-drop-down-list")[0].style.display = "block";        
    }
       
  }
  function savePgAd(e,currentId){
    let curentAdItem =  findParent(e,currentId);
    let currentSaveMenuTitle = document.querySelector('.'+ currentId + ' .pg-save-title');
    let saveStatus = currentSaveMenuTitle.innerText;
    if(saveStatus == '${pgLanguage.languages['PG_MENU_SAVE_AD'][language]}'){
      currentSaveMenuTitle.innerHTML = '${pgLanguage.languages['PG_MENU_UN_SAVE_AD'][language]}';
      document.querySelector('.'+ currentId + ' .pg-save-des').innerHTML = '${
			pgLanguage.languages['PG_MENU_UN_SAVE_AD_DESCRIPTION'][language]
		}'
      curentAdItem.insertAdjacentHTML('beforebegin','${saveHtml}'.replace("PG_ID_PLACE_HOLDER",currentId));  
    }else{
      document.querySelector('.'+ currentId).previousSibling.style.display = 'none'; 
      currentSaveMenuTitle.innerHTML = '${pgLanguage.languages['PG_MENU_SAVE_AD'][language]}';
      document.querySelector('.'+ currentId + ' .pg-save-des').innerHTML = '${
			pgLanguage.languages['PG_MENU_SAVE_AD_DESCRIPTION'][language]
		}'  
    }
  }
  function findParent(e,currentId){
    let curentAdItem = e.target;
      while(true){
        if(curentAdItem.getAttribute('class') && curentAdItem.getAttribute('class').includes(currentId)){
          break;
        }else {
          curentAdItem = curentAdItem.parentNode;
        }
      }
  
    return curentAdItem;
  }
  function hidePgAd(e,currentId){
    let dropdownMenu =  e.target.parentNode.parentNode.parentNode.parentNode;
    let curentAdItem =   findParent(e,currentId);


    // let currentId = curentAdItem.getAttribute('data-pg-id')
    let storage = localStorage.getItem('pg-hide-ads');
    if(!storage || storage.split(',').indexOf(currentId) < 0 ){
      localStorage.setItem('pg-hide-ads', (storage ? storage +"," : "")+ currentId);
    }
   dropdownMenu.style.display = 'none';
   // ẩn các ad cùng id trên màn hình
    let adsItem = document.getElementsByClassName(currentId);
    for(let i = 0; i< adsItem.length; i++){
         adsItem[i].style.display ="none";
    }
    curentAdItem.insertAdjacentHTML('beforebegin','${hideHtml}'.replace("PG_ID_PLACE_HOLDER",currentId));       
    //show reason table
    showSelectHideReason(currentId);
  }
  function hidePgAd2(e){
    let adId =  e.target.getAttribute('data-pg-id');
    let pageName =  e.target.getAttribute('data-page-name');
    let storage = localStorage.getItem('pg-hide-ads');
    if(document.getElementById("pg-hide-button").innerHTML != '${pgLanguage.languages['PG_UNDO'][language]}'){
      //do hide ad    
      document.getElementById("pg-hide-title").innerHTML = '${
			pgLanguage.languages['PG_HIDE_TITLE'][language]
		}'.replace("Pexgle",pageName);
      document.getElementById("pg-hide-des").innerHTML = '${
			pgLanguage.languages['PG_HIDE_DESCRIPTION'][language]
		}'.replace("Pexgle",pageName);
      document.getElementById("pg-hide-button").innerHTML = '${pgLanguage.languages['PG_UNDO'][language]}';
      if(!storage || storage.split(',').indexOf(adId) < 0 ){
        localStorage.setItem('pg-hide-ads', (storage ? storage +"," : "")+ adId);
      }
      let adsItem = document.getElementsByClassName(adId);
      for(let i = 0; i< adsItem.length; i++){
           adsItem[i].style.display ="none";
      } 
    }else{
      //do un hide
      document.getElementById("pg-hide-title").innerHTML = '${pgLanguage.languages['PG_WYS_ACTION_1_TITLE'][language]}';
      document.getElementById("pg-hide-des").innerHTML = '${
			pgLanguage.languages['PG_WYS_ACTION_1_DES'][language]
		}'.replace("Pexgle",pageName);
      document.getElementById("pg-hide-button").innerHTML = '${
			pgLanguage.languages['PG_WYS_ACTION_HIDE'][language]
		}';      
      if(storage){
        let hideListArray = storage.split(',');
        let indexAd = hideListArray.indexOf(adId);
        if(indexAd >= 0){
          hideListArray.splice(indexAd,1);
          localStorage.setItem('pg-hide-ads',hideListArray.join(','));
        }
      }
      let adsItem = document.getElementsByClassName(adId);
    for(let i = 0; i< adsItem.length; i++){
         adsItem[i].style.display ="block";
    } 
    }   
  }
  function undoHide(e,adId){
    let hideList = localStorage.getItem('pg-hide-ads');
    if(hideList){
      let hideListArray = hideList.split(',');
      let indexAd = hideListArray.indexOf(adId);
      if(indexAd >= 0){
        hideListArray.splice(indexAd,1);
        localStorage.setItem('pg-hide-ads',hideListArray.join(','));
      }
      let adsItem = document.getElementsByClassName(adId);
      for(let i = 0; i< adsItem.length; i++){
           adsItem[i].style.display ="block";
      }
      e.target.parentNode.style.display = "none";
    }
  }    
  function undoSave(e){
    e.target.parentNode.style.display = "none";
    let element =  e.target.parentNode.nextSibling.querySelector('.pg-save-title');
    if(element){
      element.innerHTML = '${pgLanguage.languages['PG_MENU_SAVE_AD'][language]}';
      e.target.parentNode.nextSibling.querySelector('.pg-save-des').innerHTML = '${
			pgLanguage.languages['PG_MENU_SAVE_AD_DESCRIPTION'][language]
		}'  
    }
  } 
  
  function whyISeeThis(event,id,page_name,reason_url,avatar,page_link){
    disableScrollBody();
    //an dropdown
    event.target.parentNode.parentNode.parentNode.parentNode.style.display ='none';
    document.getElementsByTagName("body")[0].insertAdjacentHTML('afterbegin','${whyIseeThisAdHtml.replace(
		/\n/g,
		''
	)}'.replace("PG_ID_PLACE_HOLDER",id).replace(/Pexgle/g,page_name).replace(/www.pexgle.com/g,reason_url).replace(/%PAGE_AVATAR%/g,avatar).replace(/%PAGE_LINK%/g,page_link)); 
  }

  function closeWYS(){   
    let fuckFB = document.getElementById("u_ps_0_0_0");
    if(fuckFB){
      // ko hiểu sao facebook hay thằng adblock lại gói html của mình vào thẻ này rồi ẩn đi, cứ hiện nó lên
      fuckFB.display = "block";
    }
    let wysElement = document.getElementsByClassName('pg-wys-backdop');
    wysElement[0].parentNode.removeChild(wysElement[0]);
    restoreScrollBody();
  }
  function openAdList(){
    var win = window.open("https://www.facebook.com/ads/preferences/", '_blank');
    win.focus();
  }
  function showWYSThank(){
    document.getElementsByClassName('pg-wys-bottom')[0].innerHTML = '<span style ="flex:1;"></span><span role="heading" aria-level="4" style="padding: 8px 0;font-family: Arial, sans-serif; font-size: 14px; line-height: 18px; letter-spacing: normal; overflow-wrap: normal; text-align: left; color: rgb(96, 103, 112);"> ${
		pgLanguage.languages['PG_THANKS'][language]
	} </span>';
  }
  function showSelectHideReason(adId){
    disableScrollBody();
    document.getElementsByTagName("body")[0].insertAdjacentHTML('afterbegin','${selectHideResaonHTML.replace(
		/\n/g,
		''
	)}'.replace(/PG_ID_PLACE_HOLDER/g,adId)); 
  }
  function closeHideReason(){
    let reasonElement = document.getElementsByClassName('pg-reason-backdop');
    reasonElement[0].parentNode.removeChild(reasonElement[0]);
    restoreScrollBody();
  }
  function selectReason(e){
    let reasons = document.getElementsByClassName('pg-reason-item');
    for(let i = 0; i< reasons.length;i++){
      reasons[i].classList.remove("pg-reason-selected");
    }
    e.target.classList.add('pg-reason-selected');
    document.getElementsByClassName('pg-close-reason')[0].classList.remove('pg-disabled');
  }
  function finishSelectReason(e){
    //submit to server if needed
    closeHideReason();
  }
  function showReportAd(e,currentId){
    let dropdownMenu =  e.target.parentNode.parentNode.parentNode.parentNode;
    let curentAdItem =   findParent(e,currentId);

    let storage = localStorage.getItem('pg-hide-ads');
    if(!storage || storage.split(',').indexOf(currentId) < 0 ){
      localStorage.setItem('pg-hide-ads', (storage ? storage +"," : "")+ currentId);
    }
   dropdownMenu.style.display = 'none';
   // ẩn các ad cùng id trên màn hình
    let adsItem = document.getElementsByClassName(currentId);
    for(let i = 0; i< adsItem.length; i++){
         adsItem[i].style.display ="none";
    }
    curentAdItem.insertAdjacentHTML('beforebegin','${reportHtml}'.replace("PG_ID_PLACE_HOLDER",currentId));       
    //show reason table
    showSelectReportReason(currentId);
  }
  function showSelectReportReason(adId){
    disableScrollBody();
    document.getElementsByTagName("body")[0].insertAdjacentHTML('afterbegin','${reportAdHTML.replace(
		/\n/g,
		''
	)}'.replace(/PG_ID_PLACE_HOLDER/g,adId)); 
  }  
  window.onload = function(){
    var pgDropDown = document.getElementsByClassName('pg-drop-down-list');
    document.onclick = function(e){
       if(!e.target.classList.contains('pg-menu-toggle') && !e.target.classList.contains('pg-drop-down-list') && (!e.target.parentNode || !e.target.parentNode.classList.contains('pg-drop-down-list')) ){
         for(let i = 0; i < pgDropDown.length; i++){
           pgDropDown[i].style.display = 'none';
         }       
       }
    };
 };
  </script>`);

	return null;
}

export default withReducer('pexgleAds', reducer)(FacebookAds);
