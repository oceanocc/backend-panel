function ExportTableToCSV(table)
{
    var rows = [];
    $(table).find('tr').each(function()
    {
        var $row = $(this);
        var columns = $row.find('th').map(function(index, cell)
        {
            return $(cell).text();
        }).get();
        var data = $row.find('td').map(function(index, cell)
        {
            return $(cell).text();
        }).get();
        if(columns.length == 0)
            rows.push(data);
        else
            rows.push(columns);
    });

    // Convert data to CSV
    var csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray) {
        let row = rowArray.join("\t");
        csvContent += row + "\r\n";
    });

    // Create a link to download
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
}