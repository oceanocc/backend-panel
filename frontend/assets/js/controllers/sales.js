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
  
    $('#estado_de_ventas form').submit(function(e)
    {
        e.preventDefault();
        var from = $('#estado_de_ventas form input[name=from]').val();
        var to = $('#estado_de_ventas form input[name=to]').val();

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

        fetch(`/sales/${from}/${to}`)
        .then(response =>
        {
            if(response.ok)
                return response.json();
            else
            {
                $('.notifications').empty();
                $('.notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Error al solicitar las ventas
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }
        })
        .then(response =>
        {
            $('#results_table tbody').empty();

            if (response.sales.length == 0)
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
            $.each(response.sales, function(index, sale) 
            {
                $('#estado_de_ventas table.results tbody').append(`
                    <tr>
                        <td>${sale.usuario}</td>
                        <td>${sale.dn}</td>
                        <td>${sale.status}</td>
                        <td>${sale.fecha_encuesta == null ? '' : sale.fecha_encuesta}</td>
                        <td>${sale.fecha_activacion == null ? '' : sale.fecha_activacion}</td>
                        <td>${sale.fecha_alta == null ? '' : sale.fecha_alta}</td>
                        <td>${transformarFecha(sale.fecha_actualizacion)}</td>
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
});