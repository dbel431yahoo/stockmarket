function handleDrop(f) {
    return new Promise(function(rev, rej) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {
                type: 'array'
            });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            rev(XLSX.utils.sheet_to_json(worksheet));

        };
        reader.readAsArrayBuffer(f);
    })

}

function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}
$("#test").change(function(e) {
    handleDrop(e.target.files[0]).then(function(resp) {
        var keys = Object.keys(resp[0]);
        console.log("key=>", keys);
        var val = keys.map(function(d) {
            return d.toLocaleLowerCase().replace(/[\. ]/g, "");
        })
        var rr = resp.map(function(d, d1) {

            for (var i = 0; i < keys.length; i++) {

                d[val[i]] = d[keys[i]];

                if (val[i].match(/date/g) != null) {
                    if (d[keys[i]] != "-")
                        d[val[i]] = ExcelDateToJSDate(Number(d[keys[i]]).toFixed(0)).toISOString();

                    if (d[keys[i]] == "-")
                        d[val[i]] = new Date().toISOString();
                }
                //d[val[i]] = ExcelDateToJSDate(d[keys[i]]).toISOString();

                if (val[i] != keys[i])
                    delete d[keys[i]];
            }
            return JSON.parse(JSON.stringify(d).replace(/\\n/g, ""))

        })

        console.log(rr);
    })
})
$("#file").change(function(e) {
    for (var i = 0; i < e.target.files.length; i++)
        handleDrop(e.target.files[i]).then(function(resp) {
            console.log("resp=>", resp);


            var keys = Object.keys(resp[0]);
            var val = Object.keys(resp[0]).map(function(d) {

                return d.trim().toLocaleLowerCase().replace(new RegExp(/[\r \n  .]/g), "");
            })
            var rr = resp.map(function(d) {
                for (var i = 0; i < keys.length; i++) {

                    d[val[i]] = d[keys[i]];

                    if (val[i] == "date")
                        d[val[i]] = ExcelDateToJSDate(d[keys[i]]).toISOString();

                    delete d[keys[i]];
                }
                return d;
            })

            var arr = _.chunk(rr, 10);

            for (var i = 0; i < arr.length; i++) {
                console.log(arr[i])
                var settings = {
                    "url": "/indices",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(arr[i]),
                };

                $.ajax(settings).done(function(response) {
                    console.log(response);
                });
            }

        })
})

$("#result").change(function(e) {
    for (var i = 0; i < e.target.files.length; i++)
        handleDrop(e.target.files[i]).then(function(resp) {
            console.log("resp=>", resp);


            var keys = Object.keys(resp[0]);
            var val = Object.keys(resp[0]).map(function(d) {

                return d.trim().toLocaleLowerCase().replace(new RegExp(/[\r \n  .]/g), "");
            })
            var rr = resp.map(function(d) {
                for (var i = 0; i < keys.length; i++) {

                    d[val[i]] = d[keys[i]];

                    if (val[i] == "date")
                        d[val[i]] = ExcelDateToJSDate(d[keys[i]]).toISOString();

                    delete d[keys[i]];
                }
                return d;
            })

            var arr = _.chunk(rr, 10);

            for (var i = 0; i < arr.length; i++) {
                console.log(arr[i])
                var settings = {
                    "url": "/resultm",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(arr[i]),
                };

                $.ajax(settings).done(function(response) {
                    console.log(response);
                });
            }

        })
})