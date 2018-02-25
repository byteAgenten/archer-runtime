function ajax(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function () {
        if (req.readyState != 4) return;
        callback.call(null, req);
    };
    req.send();
}

ajax.invalidResponse = function (request) {
    // With disabled web security status remains 0
    return !(request.status == 200 || (request.status == 0 && request.response));
};

module.exports = ajax;
