var settings = {
    "url": "/indicesfind",
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    },
    "data": JSON.stringify({}),
};

$.ajax(settings).done(function(response) {
    console.log(response);
});