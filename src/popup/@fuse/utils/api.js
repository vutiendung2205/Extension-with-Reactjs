/* global chrome */
import axios from "axios";

export default {
    get(url, params, headers = {}) {
        return new Promise((resolve, reject) =>
            chrome.runtime.sendMessage({ type: "API", data: { url, method: "GET", params }, headers }, ({ result, error }) => {
                if (error) return reject(error);
                else return resolve(result);
            })
        );
    },
    post(url, data) {
        return new Promise((resolve, reject) =>
            chrome.runtime.sendMessage({ type: "API", data: { url, method: "POST", data } }, ({ result, error }) => {
                if (error) return reject(error);
                else return resolve(result);
            })
        );
    },
    delete(url, data) {
        return new Promise((resolve, reject) =>
            chrome.runtime.sendMessage({ type: "API", data: { url, method: "DELETE", data } }, ({ result, error }) => {
                if (error) return reject(error);
                else return resolve(result);
            })
        );
    },
    apiCalling(objCalling) {
        return axios({
            ...objCalling,
            headers: {
                "x-type": "extension",
            },
        })
            .then((r) => ({ result: r.data, error: null }))
            .catch((error) => ({ result: null, error }));
    },
};
