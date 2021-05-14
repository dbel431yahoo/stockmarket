$(document).ready(function() {
    console.log("asfsafdsfsdf", new Date());
    $('#example').DataTable({
        "processing": true,
        "serverSide": true,
        "columns": [
            { "data": "companyname" },
            { "data": "industry" },
            { "data": "isincode" },
            { "data": "series" },
            { "data": "symbol" }
        ],
        "ajax": function(data, callback, settings) {
            var settings = {
                "url": "/indicesfind",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({ find: {}, "skip": data.start, limit: data.length }),
            };

            $.ajax(settings).done(function(response) {
                callback(response);
            });


        }
    });
});