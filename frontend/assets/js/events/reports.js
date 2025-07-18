
// Datasets

$(function()
{
    function transformarFecha(fechaISO)
    {
        const fecha = new Date(fechaISO);
    
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Añade 1 al mes porque es 0-indexado
        const dia = String(fecha.getDate()).padStart(2, '0');
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        const segundos = String(fecha.getSeconds()).padStart(2, '0');
    
        return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    }

    // Report 1
    let datatables1 = new DataTable('#report1', {
        columns: [
            { title: 'C&eacute;dula' },
            { title: 'Nombre completo' },
            { title: 'Horas' },
            { title: 'ACD.' },
            { title: 'Wait' },
            { title: 'ACW' },
            { title: 'DEAD' },
            { title: 'Pausa' },
            { title: 'Break' },
            { title: 'Ba&ntilde;o' },
            { title: 'Feedback' },
            { title: 'Manual' },
            { title: 'Login' }
        ],
        data: []
    });
    $('#component_report1 form').submit(function(e)
    {
        e.preventDefault();
        var from = $('#component_report1 form input[name=from]').val();
        var to = $('#component_report1 form input[name=to]').val();

        if (from == "")
        {
            new wtools.Notification('WANING', 5000, `#component_report1 .notifications`, true).Show_("Por favor, ingrese fecha \"Desde\"");
            return;
        }
        if (to == "")
        {
            new wtools.Notification('WANING', 5000, `#component_report1 .notifications`, true).Show_("Por favor, ingrese fecha \"Hasta\"");
            return;
        }

        fetch(`/api/reports/1?from=${from}&to=${to}`)
        .then(response =>
        {
            if(response.ok)
                return response.json();
            else
                throw 'Error al solicitar la informaci&oacute;n';
        })
        .then(response =>
        {
            if (response.data.length == 0)
            {
                new wtools.Notification('WANING', 0, `#component_report1 .notifications`, true).Show_("No se encontr&oacute; informaci&oacute;n en el rango de tiempo establecido.");
                return;
            }

            $('#component_report1 .notifications').empty();
            let dataset1 = [];
            $.each(response.data, function(index, row) 
            {
                dataset1.push([row.cedula, row.nombre_completo, row.horas, row.acd, row.wait, row.acw, row.dead, row.pauseAux, row.break, row.bano, row.fdbk, row.manual, row.login]);
            });
            datatables1.clear().rows.add(dataset1).draw();
        })
        .catch(error =>
        {
            new wtools.Notification('ERROR', 5000, `#component_report1 .notifications`, true).Show_("No se pudo cargar la informaci&oacute;n.");
            console.error('Error al cargar la informaci&oacute;n:', error);
        });
    });
    $('#component_report1 form').submit();

});