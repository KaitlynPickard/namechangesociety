import request from '../request';

let baseURL = "";

export let getExpiringNames = () => {
    return request({url: baseURL + "/getExpiringNames" })
        .then(data => {
            return data;
        });
}