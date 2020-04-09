import request from 'request-promise';

function apiCall(uri, method, body, action, failureAction, json = true) {
    const access_token = window.localStorage.getItem('access_token');
    const contentType = json ? "application/json" : "text/plain";
    return request({
        method,
        uri: window.location.origin + uri,
        body,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': contentType
        },
        json
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

export const get = (uri, action, failureAction, isJson) => apiCall(uri, 'GET', undefined, action, failureAction, isJson);
export const post = (uri, body, action, failureAction, isJson) => apiCall(uri, 'POST', body, action, failureAction, isJson);
export const put = (uri, body, action, failureAction, isJson) => apiCall(uri, 'PUT', body, action, failureAction, isJson);
export const del = (uri, action, failureAction, isJson) => apiCall(uri, 'DELETE', undefined, action, failureAction, isJson);