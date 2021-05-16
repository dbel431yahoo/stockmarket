$(document).ready(function () {
    $('#example tfoot th').each(function () {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });
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
            var find = {};

            var col = data.columns.filter(d => { return d.search.value != ""; });
            if (col.length > 0)
                col = col.map(d => {
                    t = {};
                    t[d.data] = { _eval: "regex", value: "^" + d.search.value };
                    if (d.data.match(/date/ig)) {
                        var enterDate = new Date(d.search.value.trim());
                        var start = new Date(enterDate).setDate(enterDate.getDate() - 1);
                        var end = new Date(enterDate).setDate(enterDate.getDate() + 1);
                        t[d.data] = {
                            "$gte": { _eval: "date", value: start },
                            "$lt": { _eval: "date", value: end }
                        }

                    }
                    return t
                })
            if (col.length > 0) {
                find = col.reduce(function (it, curr) {
                    var k = Object.keys(curr);
                    it[k] = curr[k];
                    return it;
                }, {});

                console.log(find);
            }

            var settings = {
                "url": "/resultfind",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({ find: find, "skip": data.start, limit: data.length, sort: { "date": -1 } }),
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