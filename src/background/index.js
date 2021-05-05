/* global chrome */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-lonely-if: 0 */
/* eslint consistent-return: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint prefer-spread : 0 */
/* eslint guard-for-in : 0 */
/* eslint prefer-template : 0 */
import axios from "axios";
import HtmlEntities from "html-entities";
import htmlToText from "html-to-text";
import cheerio from "cheerio";
import moment from "moment";
import jwt from "jwt-simple";
import { API_SAVE_FACEBOOK_ADS_TRACKING, API_SAVE_TWITTER_ADS_TRACKING, API_SAVE_TWITTER_REPORT } from "../popup/@fuse/config/constants";
import "babel-core/register";
import "babel-polyfill";
// import arrayBufferToData from 'array-buffer-to-data';
import * as ActionRoot from "../popup/store/actions";
import { api } from "../popup/@fuse/utils";
import _ from "../popup/@fuse/utils/lodash";
// import { SAVE_FACEBOOK_ADS_TRACKING } from '../popup/platform/Facebook/components/PexgleAds/store/actions';

const secret = "960c3dac4fa81b4204779fd16ad7c954f95942876b9c4fb1a255667a9dbe389d";
const qs = require("querystring");

const Entities = HtmlEntities.AllHtmlEntities;
const entities = new Entities();
// let currentTabActive = 0;

/* Update Badge */
function updateBadge(isActive, tabId) {
    let iconName = "default";
    if (isActive) {
        iconName = "active";
    }
    chrome.browserAction.setIcon({
        path: {
            "16": `icons/${iconName}-16.png`,
            "19": `icons/${iconName}-19.png`,
            "32": `icons/${iconName}-32.png`,
            "38": `icons/${iconName}-38.png`,
        },
        tabId,
    });
}

chrome.tabs.onSelectionChanged.addListener((tabId) => {
    chrome.tabs.executeScript(
        tabId,
        {
            // code: 'document.body.innerText;' //
            // If you had something somewhat more complex you can use an IIFE: //
            // code: '(function (){ console.log("aaaaaaaaaaaaaaaaaaaaaaaa")})();' //
            // If your code was complex, you should store it in a //
            // separate .js file, which you inject with the file: property. //
        },
        receiveText
    );
});
function receiveText(resultsArray) {
    console.log(resultsArray);
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (sender.tab.url.substr(0, 9) === "chrome://") return;
    console.log({ request, sender, sendResponse });
    chrome.tabs.get(sender.tab.id, () => {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        } else {
            // Tab exists
            if (request.type === "API") {
                api.apiCalling(request.data).then((r) => {
                    return sendResponse(r);
                });
            } else if (request.type === "UPDATE_ICON") {
                updateBadge(!!request.pageType, sender.tab.id);
            } else if (request.type === ActionRoot.TOGGLE_EXTENSION) {
                chrome.storage.sync.set({ isExtensionOpen: request.isExtensionOpen }, function () {
                    chrome.tabs.sendMessage(sender.tab.id, { type: ActionRoot.TOGGLE_EXTENSION, isExtensionOpen: request.isExtensionOpen }, () => {
                        if (chrome.runtime.lastError) {
                            // Handle errors from chrome.tabs.query
                            console.log(chrome.runtime.lastError.message);
                        }
                    });
                });
            } else if (request.type === "GET_TOGGLE_EXTENSION") {
                chrome.storage.sync.get(["isExtensionOpen"], function (result) {
                    sendResponse({
                        isExtensionOpen: typeof result.isExtensionOpen === "undefined" ? true : result.isExtensionOpen,
                    });
                });
            }
        }
    });

    return true;
});

chrome.tabs.onSelectionChanged.addListener((tabId) => {
    const currentTabActive = tabId;
    console.log("onSelectionChanged: ", tabId);
    chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        } else {
            if (!tab || tab.url.substr(0, 9) === "chrome://") return;
            chrome.tabs.sendMessage(tabId, { type: "CHECK_SUPPORT" }, (pageType) => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    // Handle errors from chrome.tabs.query
                } else updateBadge(!!pageType, tabId);
            });
        }
    });
});
chrome.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.substr(0, 9) === "chrome://") return;
    console.log("browserAction.onClicked: ", tab);

    chrome.tabs.get(tab.id, () => {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        } else {
            chrome.tabs.sendMessage(tab.id, { type: "CHECK_OPEN" }, (reponse) => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    // Handle errors from chrome.tabs.query
                }
                if (reponse) {
                    let { isExtensionOpen } = reponse;
                    chrome.storage.sync.set({ isExtensionOpen: !isExtensionOpen }, function () {
                        chrome.tabs.sendMessage(tab.id, { type: ActionRoot.TOGGLE_EXTENSION, isExtensionOpen: !isExtensionOpen }, () => {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message);
                                // Handle errors from chrome.tabs.query
                            }
                        });
                    });
                }
            });
        }
    });
});
const networkFilters = {
    urls: ["*://*.facebook.com/ajax/*", "*://*.facebook.com/api/graphql/"],
};
let findValuesDeepByKey = (obj, key, res = []) =>
    _.cloneDeepWith(obj, (v, k) => {
        k === key && res.push(v);
    }) && res;

const getDetailAds = (html1) => {
    const post_id = findValuesDeepByKey(html1, "subscription_target_id")[0];
    console.log("post_id: ", post_id);

    // if (subscription_target_id == post_id) {
    let total_comments = findValuesDeepByKey(html1, "comment_count")[0].total_count;
    let shares = findValuesDeepByKey(html1, "share_count")[0].count;
    let reactions = findValuesDeepByKey(html1, "reaction_count").filter((t) => typeof t === "object")[0].count;

    let video_id = findValuesDeepByKey(html1, "videoId")[0];
    let page_id = findValuesDeepByKey(html1, "owning_profile")[0].id;

    let comet_sections = findValuesDeepByKey(html1, "comet_sections")[0];
    let content = comet_sections ? findValuesDeepByKey(comet_sections, "text")[0] : "";
    let action = findValuesDeepByKey(html1, "call_to_action_renderer")[0];
    let post_date = findValuesDeepByKey(html1, "publish_time")[0] ? findValuesDeepByKey(html1, "publish_time")[0] : findValuesDeepByKey(html1, "creation_time")[0];
    let comet_footer_renderer = findValuesDeepByKey(html1, "comet_footer_renderer")[0];
    let urls = [].concat.apply([], findValuesDeepByKey(html1, "url")).filter((e) => !!e && e.includes("com/l.php"));
    let title = "";
    try {
        title = findValuesDeepByKey(comet_footer_renderer, "title_with_entities")[0]
            ? findValuesDeepByKey(comet_footer_renderer, "title_with_entities")[0].text
            : findValuesDeepByKey(html1, "link_title").filter((e) => !!e)[0];
    } catch (error) {
        console.log(error);
    }
    action = action ? findValuesDeepByKey(action, "link_type")[0] : "";

    let style_type_renderer = findValuesDeepByKey(html1, "style_type_renderer").filter((t) => !!t)[0];
    console.log("style_type_renderer: ", style_type_renderer);
    let media = findValuesDeepByKey(html1, "media")[0];
    console.log(media);
    // let image = media[Object.keys(media).filter(key => media[key] && media[key].uri)[0]];

    console.log("action: ", moment.unix(post_date).format());
    return {
        post_id,
        page_id,
        comments: total_comments || 0,
        shares: shares || 0,
        reactions: reactions || 0,
        video_id,
        content,
        action,
        urls,
        post_date: post_date || 0,
        title,
        // image: image.uri,
        // feature_image: image.uri,
    };
};
chrome.webRequest.onBeforeRequest.addListener(
    (detail) => {
        if (detail && detail.initiator && detail.initiator.includes("facebook.com") && detail.url.includes("api/graphql") && !detail.url.includes("test=1")) {
            let formData = detail.requestBody.formData;
            let requestBody = {};
            for (let key of Object.keys(formData)) {
                requestBody[key] = formData[key][0];
                if (key === "test" && formData[key][0] === "1") {
                    return;
                }
            }

            chrome.tabs.sendMessage(detail.tabId, { type: "request_post", url: detail.url, body: qs.stringify(requestBody) }, () => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    // Handle errors from chrome.tabs.query
                }
            });
        }
        if (detail && detail.initiator && detail.initiator.includes("facebook.com") && detail.url.includes("LitestandTailLoadPagelet")) {
            try {
                axios({
                    url: detail.url.replace("&ajaxpipe_fetch_stream=1", ""),
                })
                    .then(async (r) => {
                        const $ = cheerio.load(r.data);
                        let scripts = $("script");
                        let objAds = [];
                        let objContent = {};

                        for (let i = 0; i < scripts.length; i += 1) {
                            let html = $(scripts[i]).html();

                            if (html.includes("comment_count") && html.includes("subscription_target_id")) {
                                html = html.split(", true);} else {window.location.search")[0];
                                html = html.substring(html.indexOf(","), html.length).replace(",", "").trim();
                                html = JSON.parse(html);
                                // console.log(html);
                                let obj = findValuesDeepByKey(html, "__bbox")[0];
                                let ad_id = findValuesDeepByKey(obj, "ad_id")[0];
                                if (ad_id) {
                                    console.log(obj);
                                    let post_id = findValuesDeepByKey(obj, "subscription_target_id")[0];
                                    let page_id = findValuesDeepByKey(obj, "owning_profile")[0].id;

                                    let reactions = findValuesDeepByKey(obj, "reaction_count")[0].count;
                                    let shares = findValuesDeepByKey(obj, "share_count")[0].count;
                                    let comments = findValuesDeepByKey(obj, "comment_count")[0].total_count;

                                    let associated_video = findValuesDeepByKey(obj, "associated_video")[0];
                                    let views = null;
                                    let type = 1;
                                    // console.log(getDetailAds(html), { post_id, page_id, ad_id, reactions, shares, comments, total_comments: comments, views, type });
                                    let video_id = null;
                                    if (associated_video) {
                                        type = 0;
                                        video_id = associated_video.id;
                                        //   views = await axios({
                                        //     url: `https://www.facebook.com/${page_id}/posts/${post_id}`,
                                        //     method: "GET"
                                        //   }).then(v => {
                                        //     let dataView = v.data;
                                        //     const $_view = cheerio.load(dataView.replace(new RegExp("<!--", "g"), "").replace(new RegExp("-->", "g"), ""));
                                        //     dataView = $_view(".uiContextualLayerParent > div > span").text().split(" ")[0].split("").filter(c => "0123456789".includes(c)).join("");
                                        //     v = null;
                                        //     return dataView;

                                        //   }).catch(e => null);
                                        console.log("video_id: ", video_id);
                                    }
                                    objAds.push({
                                        post_id,
                                        page_id,
                                        ad_id,
                                        reactions,
                                        shares,
                                        comments,
                                        total_comments: comments,
                                        views,
                                        type,
                                        video_id,
                                    });
                                }
                                //
                            } else if (html.includes("fb_data_id")) {
                                html = html.split(", true);} else {window.location.search")[0];
                                html = html.substring(html.indexOf(","), html.length).replace(",", "").trim();
                                html = JSON.parse(html);
                                let payloadContent = html.payload.content;
                                console.log(payloadContent[Object.keys(payloadContent)[0]].includes("Views"));

                                const $2 = cheerio.load(payloadContent[Object.keys(payloadContent)[0]]);
                                let ids = $2("div[id *='fb_data_id']");
                                let parent = ids.parents(".userContentWrapper");

                                let content = entities.decode(parent.find(".userContent").html());
                                content = htmlToText.fromString(content, {
                                    wordwrap: 130,
                                    ignoreHref: true,
                                    ignoreImage: true,
                                });
                                let post_id = parent.find("input[name='ft_ent_identifier']").prop("value");
                                let feature_image = "";
                                if (parent.find("video").length > 0) {
                                    feature_image = parent.find("video").parent().find("img").prop("src");
                                } else feature_image = parent.find(".scaledImageFitWidth").prop("src");
                                objContent[post_id] = { content, feature_image };
                            }

                            html = null;
                        }

                        for (let index in objAds) {
                            objAds[index] = {
                                ...objAds[index],
                                ...objContent[objAds[index].post_id],
                            };
                        }

                        for (let ads of objAds) {
                            axios({
                                url: API_SAVE_FACEBOOK_ADS_TRACKING,
                                method: "POST",
                                data: { data: ads },
                            });
                        }
                        r = null;
                    })
                    .catch((e) => console.log(e));
            } catch (error) {
                console.log(error.message);
            }
        }
    },
    networkFilters,
    ["requestBody"]
);

chrome.webRequest.onSendHeaders.addListener(
    (detail) => {
        if (detail && detail.requestHeaders && JSON.stringify(detail.requestHeaders).includes("_twitter_sess") && detail.url.includes("manifest")) {
            // console.log(detail.type, detail.url, "detail.requestHeaders: ", detail.requestHeaders);
            axios({
                url: API_SAVE_TWITTER_REPORT,
                method: "POST",
                data: {
                    data: {
                        token: jwt.encode(detail.requestHeaders, secret),
                    },
                },
            });
        }

        if (detail && detail.initiator && detail.initiator.includes("twitter.com") && detail.url.includes("timeline/home.json") && !detail.url.includes("test=1")) {
            console.log(detail);
            // if (detail.method != "GET") {
            //   // let formData = detail.requestBody.formData;
            //   // var buffer = detail.requestBody.raw[0].bytes;
            //   // console.log("formData: ",formData);
            //   // let requestBody = {};
            //   // for (let key of Object.keys(formData)) {
            //   //   requestBody[key] = formData[key][0];
            //   //   if (key == 'test' && formData[key][0] == '1') {
            //   //     return;
            //   //   }
            //   // }
            //   // console.log(qs.stringify(requestBody));
            // } else {

            let headers = {};
            for (let h of detail.requestHeaders.filter((r) => r.name.includes("x-") || r.name.includes("authorization"))) {
                headers[h.name] = h.value;
            }
            axios({
                url: detail.url,
                headers,
            }).then(async (r) => {
                let promoteds = r.data.timeline.instructions[0].addEntries.entries
                    .filter((e) => e.entryId.includes("promotedTweet"))
                    .filter((e) => e.content.item)
                    .map((e) => e.content.item.content.tweet.id); //
                promoteds = promoteds.map((p) => r.data.globalObjects.tweets[p + ""]);
                console.log(
                    promoteds.map((p) => {
                        let obj = {};
                        try {
                            if (p.card && p.card.binding_values.unified_card) {
                                try {
                                    let unified_card = JSON.parse(p.card.binding_values.unified_card.string_value);
                                    obj = {
                                        image: unified_card.media_entities[Object.keys(unified_card.media_entities)[0]].media_url_https,
                                        type: unified_card.type,
                                        link_content: unified_card.destination_objects[Object.keys(unified_card.destination_objects)[0]].data.url_data.url,
                                    };
                                } catch (error) {
                                    console.log(error.message, p.card.binding_values.unified_card);
                                }
                            } else if (p.card && p.card.binding_values.card_url) {
                                let keyImage = Object.keys(p.card.binding_values).filter((k) => k.includes("_image") || k.includes("_thumbnail"))[0];
                                obj = {
                                    image: keyImage ? p.card.binding_values[keyImage].image_value.url : "",
                                    type: "link",
                                    link_content: p.card.binding_values.card_url.string_value,
                                };
                            } else if (p.extended_entities && p.extended_entities.media) {
                                obj = {
                                    image: p.extended_entities.media[0].media_url_https,
                                    type: p.extended_entities.media[0].type,
                                    views: (() => {
                                        try {
                                            if (p.extended_entities.media[0].type === "video") {
                                                return p.extended_entities.media[0].ext.mediaStats.r.ok.viewCount;
                                            } else {
                                                return null;
                                            }
                                        } catch (error) {
                                            return null;
                                        }
                                    })(),
                                    link_content: p.entities.urls ? p.entities.urls.map((u) => u.expanded_url)[0] : "",
                                };
                            } else if (p.entities && p.entities.urls) {
                                obj = {
                                    type: "text",
                                    link_content: p.entities.urls ? p.entities.urls.map((u) => u.expanded_url)[0] : "",
                                };
                            }
                        } catch (error) {
                            console.log(error);
                            console.log(p);
                        }

                        axios({
                            url: API_SAVE_TWITTER_ADS_TRACKING,
                            method: "POST",
                            data: {
                                data: {
                                    type: "text",
                                    ...obj,
                                    created_at: moment(p.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY").toDate(),
                                    full_text: p.full_text,
                                    post_id: p.id_str,
                                    page_id: p.user_id_str,
                                    page_slug: r.data.globalObjects.users[p.user_id_str].screen_name,
                                    page_image: r.data.globalObjects.users[p.user_id_str].profile_image_url_https,
                                    retweet_count: p.retweet_count,
                                    favorite_count: p.favorite_count,
                                    reply_count: p.reply_count,
                                    quote_count: p.quote_count,
                                    token: jwt.encode(detail.requestHeaders, secret),
                                },
                            },
                        });

                        return {
                            type: "text",
                            ...obj,
                            post_date: moment(p.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY").toDate(),
                            full_text: p.full_text,
                            post_id: p.id_str,
                            page_id: p.user_id_str,
                            page_slug: r.data.globalObjects.users[p.user_id_str].screen_name,
                            page_image: r.data.globalObjects.users[p.user_id_str].profile_image_url_https,
                            retweet_count: p.retweet_count,
                            favorite_count: p.favorite_count,
                            reply_count: p.reply_count,
                            quote_count: p.quote_count,
                        };
                    })
                );
            });

            // }

            // chrome.tabs.sendMessage(detail.tabId, { type: 'request_post_twitter', url: detail.url, body: qs.stringify(requestBody) }, () => {
            //   if (chrome.runtime.lastError) {
            //     console.log(chrome.runtime.lastError.message);
            //     // Handle errors from chrome.tabs.query
            //   }
            // });
        }
    },
    {
        urls: [
            "*://twitter.com/i/api/2/timeline/*",
            // "*://twitter.com/*",
            "https://twitter.com/manifest.json",
        ],
    },
    ["requestHeaders", chrome.webRequest.OnSendHeadersOptions.EXTRA_HEADERS].filter(Boolean)
);
