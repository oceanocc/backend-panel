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

    // Leer
    $('#componente_estado_de_ventas_leer form').submit(function(e)
    {
        e.preventDefault();
        var from = $('#componente_estado_de_ventas_leer form input[name=from]').val();
        var to = $('#componente_estado_de_ventas_leer form input[name=to]').val();

        if (from == "")
        {
            $('#componente_estado_de_ventas_leer .notifications').empty();
            $('#componente_estado_de_ventas_leer .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Por favor, ingrese fecha "Desde"
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);

            return;
        }
        if (to == "")
        {
            $('#componente_estado_de_ventas_leer .notifications').empty();
            $('#componente_estado_de_ventas_leer .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Por favor, ingrese fecha "Desde"
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
            return;
        }

        fetch(`/api/reports/agentsIndicators?from=${from}&to=${to}`)
        .then(response =>
        {
            if(response.ok)
                return response.json();
            else
                throw 'Error al solicitar la informaci&oacute;n';
        })
        .then(response =>
        {
            $('#componente_estado_de_ventas_leer table.results tbody').empty();

            if (response.data.length == 0)
            {
                $('#componente_estado_de_ventas_leer .notifications').empty();
                $('#componente_estado_de_ventas_leer .notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        No se encontr&oacute; informaci&oacute;n en el rango de tiempo establecido
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                return;
            }
            $('#componente_estado_de_ventas_leer .notifications').empty();
            $.each(response.data, function(index, row) 
            {
                $('#componente_estado_de_ventas_leer table.results tbody').append(`
                    <tr row-id="${row.cedula}">
                        <td>${row.cedula}</td>
                        <td>${row.nombe_completo}</td>
                        <td>${row.ventas_tipificaciones}</td>
                        <td>${row.horas_conexion}</td>
                    </tr>`
                );

            });
        })
        .catch(error =>
        {
            $('#componente_estado_de_ventas_leer .notifications').empty();
            $('#componente_estado_de_ventas_leer .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    });
    $('#componente_estado_de_ventas_leer form').submit();

});