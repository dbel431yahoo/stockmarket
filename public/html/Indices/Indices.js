$(document).ready(function () {
    $('#example tfoot th').each(function () {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    console.log("asfsafdsfsdf", new Date());
    $('#example').DataTable({
        "processing": true,
        "serverSide": true,
        "columns": [
            {
                "data": "companyname", render: function (data, type, row) {
                    return '<a target="_blank" href="https://www.nseindia.com/get-quotes/equity?symbol=' + row.symbol + '">' + data + '</a>';
                }
            },
            { "data": "symbol" },
            { "data": "industry" },
            { "data": "isincode" },
            { "data": "series" }

        ],
        "ajax": function (data, callback, settings) {


            var find = {};

            var col = data.columns.filter(d => { return d.search.value != ""; });
            if (col.length > 0)
                col = col.map(d => { t = {}; t[d.data] = { _eval: "regex", value: "^" + d.search.value }; return t })
            if (col.length > 0) {
                find = col.reduce(function (it, curr) {
                    var k = Object.keys(curr);
                    it[k] = curr[k];
                    return it;
                }, {});

                console.log(find);
            }
            var settings = {
                "url": "/indicesfind",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({ find: find, "skip": data.start, limit: data.length }),
            };

            $.ajax(settings).done(function (response) {
                callback(response);
            });


        },
        initComplete: function () {

            // Apply the search
            this.api().columns().every(function () {
                var that = this;

                $('input', this.footer()).on('keyup change clear', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });
            });
        }
    });
});