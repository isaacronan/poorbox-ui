const handleResponse = (res) => {
    if (res.status === 200) {
        return res.json();
    }
    return res.json().then(json => Promise.reject(json));
};

export const testConfig = (body) => fetch('/poorbox/api/test', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(handleResponse);

export const saveConfig = (body) => fetch('/poorbox/api/config', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(handleResponse);

export const getConfig = (id) => fetch(`/poorbox/api/config/${id}`).then(handleResponse);

export const deleteConfig = (id) => fetch(`/poorbox/api/config/${id}`, {
    method: 'DELETE'
}).then(handleResponse);