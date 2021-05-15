$(document).ready(function () {
    $('#example').DataTable({
        "processing": true,
        "serverSide": true,
        "columns": [
            {
                "data": "company",
                width: "200px",
                render: function (data, type, row) {
                    return '<a target="_blank" href="https://www.nseindia.com/get-quotes/equity?symbol=' + row.symbol + '">' + data + '</a>';
                }
            },
            {
                "data": "symbol",
            },
            {
                "data": "date", render: function (data, type, row) {
                    return new Date(data).toLocaleDateString()
                }
            },
            { "data": "details" },
            { "data": "purpose" },

        ],
        "ajax": function (data, callback, settings) {
            var settings = {
                "url": "/resultfind",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({ find: {}, "skip": data.start, limit: data.length, sort: { "_id": -1 } }),
            };

            $.ajax(settings).done(function (response) {
                callback(response);
            });


        }
    });
});