import request from 'request-promise';

function apiCall(uri, method, body, action, failureAction) {
    const access_token = window.localStorage.getItem('access_token');
    return request({
        method,
        uri: window.location.origin + uri,
        body,
        headers: {
          "Authorization": `Bearer ${access_token}`
        },
        json: true
    }).then(response => {
        if (action) {
            action(response);
        }

        // return a non-undefined value to signal that we didn't forget to return
        return null;
    }).catch(failure => {
        if (failureAction) {
            failureAction(failure);
        }

        // return a non-undefined value to signal that we didn't forget to return
        return null;
    })
}

export const get = (uri, action, failureAction) => apiCall(uri, 'GET', undefined, action, failureAction);
export const post = (uri, body, action, failureAction) => apiCall(uri, 'POST', body, action, failureAction);
export const put = (uri, body, action, failureAction) => apiCall(uri, 'PUT', body, action, failureAction);
export const del = (uri, action, failureAction) => apiCall(uri, 'DELETE', undefined, action, failureAction);