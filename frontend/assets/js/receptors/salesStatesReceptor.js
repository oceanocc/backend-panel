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
  
    $('#componente_estado_de_ventas_leer form').submit(function(e)
    {
        e.preventDefault();
        var from = $('#componente_estado_de_ventas_leer form input[name=from]').val();
        var to = $('#componente_estado_de_ventas_leer form input[name=to]').val();

        if (from == "")
        {
            $('.notifications').empty();
            $('.notifications').append(
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
            $('.notifications').empty();
            $('.notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Por favor, ingrese fecha "Desde"
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
            return;
        }

        fetch(`/salesStates/${from}/${to}`)
        .then(response =>
        {
            if(response.ok)
                return response.json();
            else
                throw 'Error al solicitar las ventas';
        })
        .then(response =>
        {
            $('#componente_estado_de_ventas_leer table.results tbody').empty();

            if (response.data.length == 0)
            {
                $('.notifications').empty();
                $('.notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        No se encontraron ventas en el rango de tiempo establecido
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                return;
            }
            $('.notifications').empty();
            $.each(response.data, function(index, row) 
            {
                $('#componente_estado_de_ventas_leer table.results tbody').append(`
                    <tr row-id="${row.id}">
                        <td>${row.usuario}</td>
                        <td>${row.dn}</td>
                        <td>${row.status}</td>
                        <td>${row.fecha_encuesta == null ? '' : row.fecha_encuesta}</td>
                        <td>${row.fecha_activacion == null ? '' : row.fecha_activacion}</td>
                        <td>${row.fecha_alta == null ? '' : row.fecha_alta}</td>
                        <td>${transformarFecha(row.fecha_actualizacion)}</td>
                    </tr>`
                );

            });
        })
        .catch(error =>
        {
            $('.notifications').empty();
            $('.notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    });

    $('#componente_estado_de_ventas_crear form').submit(function(e)
    {
        e.preventDefault();

        var formData = new FormData(this)
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        fetch(`/salesStates`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => 
        {
            if(response.ok)
            {
                $('#componente_estado_de_ventas_crear form').trigger('reset');
                $('#componente_estado_de_ventas_crear .notifications').empty();
                $('#componente_estado_de_ventas_crear').modal('hide');
            }
            else
            {
                $('#componente_estado_de_ventas_crear .notifications').empty();
                $('#componente_estado_de_ventas_crear .notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Error al crear la venta
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }
        })
        .catch(error =>
        {
            $('#componente_estado_de_ventas_crear .notifications').empty();
            $('#componente_estado_de_ventas_crear .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    });
});