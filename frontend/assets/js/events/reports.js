
// Supervisors
let supervisors = 
[
    {
        id: "damaglys_guerra"
        ,name: "Damaglys Guerra"
    }
    ,{
        id: "jose_rivasl"
        ,name: "José Rivas Labrador"
    }
];

// Campaigns
let campaigns = 
[
    {id: "a1", name: "A1 - WINBACK MEX-MOV-PORTA"}
    ,{id: "a2", name: "A2 - REFERIDOS MEX-MOV-PORTA"}
    ,{id: "a3", name: "A3 - RRSS MEX-MOV-PORTA"}
    ,{id: "a4", name: "A4 - ENTRENAMIENTO MEX-MOV-PORTA"}
    ,{id: "a5", name: "A5 - ALERTAS MEX-MOV-PORTA"}
    ,{id: "a6", name: "A6 - MANUAL MEX-MOV-PORTA"}
];

$(function()
{
    function SetupSupervisors()
    {
        $('.select_supervisor').append(`<option value="all" selected>-- Todo --</option>`);
        for(let supervisor of supervisors)
        {
            $('.select_supervisor').append(`<option value="${supervisor.id}">${supervisor.name}</option>`);
        }
    }
    SetupSupervisors();
    function SetupCampaigns()
    {
        $('.select_campaign').append(`<option value="all" selected>-- Todo --</option>`);
        for(let campaign of campaigns)
        {
            $('.select_campaign').append(`<option value="${campaign.id}">${campaign.name}</option>`);
        }
    }
    SetupCampaigns();
    function TransformDate(fechaISO)
    {
        const fecha = new Date(fechaISO);
    
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
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
    $('#component_report1_filters form').submit(function(e)
    {
        e.preventDefault();
        let from = $('#component_report1_filters form input[name=from]').val();
        let to = $('#component_report1_filters form input[name=to]').val();
        let supervisor = $('#component_report1_filters form select[name=supervisor]').val();
        let campaign = $('#component_report1_filters form select[name=campaign]').val();

        if (from == "")
        {
            new wtools.Notification('WANING', 5000, `#component_report1_filters .notifications`, true).Show_("Por favor, ingrese fecha \"Desde\"");
            return;
        }
        if (to == "")
        {
            new wtools.Notification('WANING', 5000, `#component_report1_filters .notifications`, true).Show_("Por favor, ingrese fecha \"Hasta\"");
            return;
        }

        fetch(`/api/reports/1?from=${from}&to=${to}&campaign=${campaign}&supervisor=${supervisor}`,)
        .then(response =>
        {
            if(response.ok)
                return response.json();
            else
                throw 'Error al solicitar la informaci&oacute;n';
        })
        .then(response =>
        {
            $('#component_report1_filters').modal('hide');
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
            $('#component_report1_filters').modal('hide');
            new wtools.Notification('ERROR', 5000, `#component_report1 .notifications`, true).Show_("No se pudo cargar la informaci&oacute;n.");
            console.error('Error al cargar la informaci&oacute;n:', error);
        });
    });
    $('#component_report1_filters form').submit();

});