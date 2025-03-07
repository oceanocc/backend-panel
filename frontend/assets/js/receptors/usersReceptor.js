$(function()
{
    // Leer
    function ReadUsers()
    {
        fetch(`/users`)
        .then(response =>
        {
            if(response.ok)
                return response.json();
            else
                throw 'Error al solicitar los usuarios';
        })
        .then(response =>
        {
            $('#component_users_read table.results tbody').empty();

            if (response.data.length == 0)
            {
                $('#component_users_read .notifications').empty();
                $('#component_users_read .notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        No se encontraron usuarios
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                return;
            }
            $('#component_users_read .notifications').empty();
            $.each(response.data, function(index, row) 
            {
                $('#component_users_read table.results tbody').append(`
                    <tr row-id="${row.id}">
                        <td>${row.id}</td>
                        <td>${row.usuario}</td>
                        <td>${row.nombres}</td>
                        <td>${row.activo}</td>
                        <td>${row.rol}</td>
                    </tr>`
                );

            });
        })
        .catch(error =>
        {
            $('#component_users_read .notifications').empty();
            $('#component_users_read .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    };
    ReadUsers();

    // Crear
    $('#component_users_add form').submit(function(e)
    {
        e.preventDefault();

        var formData = new FormData(this)
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        fetch(`/users`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => 
        {
            if(response.ok)
            {
                ReadUsers();
                $('#component_users_add form').trigger('reset');
                $('#component_users_add .notifications').empty();
                $('#component_users_add').modal('hide');
            }
            else
            {
                $('#component_users_add .notifications').empty();
                $('#component_users_add .notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Error al crear el usuario
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }
        })
        .catch(error =>
        {
            $('#component_users_add .notifications').empty();
            $('#component_users_add .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    });

    // Modificar

    $(document).on('click', '#component_users_read table.results tr', function(e)
    {
        e.preventDefault();

        let id = $(e.currentTarget).attr('row-id');

        fetch(`/users/id/${id}`)
        .then(response =>
        {
            if(response.ok)
                return response.json();
            else
                throw 'Error al leer el usuario';
        })
        .then(response =>
        {
            $('#component_users_modify input[name=id]').val(response.data[0].id);
            $('#component_users_modify input[name=usuario]').val(response.data[0].usuario);
            $('#component_users_modify input[name=nombres]').val(response.data[0].nombres);
            $('#component_users_modify input[name=activo]').val(response.data[0].activo);
            $('#component_users_modify input[name=rol]').val(response.data[0].rol);

            $('#component_users_modify').modal('show');
        })
        .catch(error =>
        {
            $('#component_users_modify .notifications').empty();
            $('#component_users_modify .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    });

    $('#component_users_modify form').submit(function(e)
    {
        e.preventDefault();

        var formData = new FormData(this)
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        fetch(`/users`,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => 
        {
            if(response.ok)
            {
                ReadUsers();
                $(this).trigger('reset');
                $('#component_users_modify .notifications').empty();
                $('#component_users_modify').modal('hide');
            }
            else
            {
                $('#component_users_modify .notifications').empty();
                $('#component_users_modify .notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Error al modificar el usuario
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }
        })
        .catch(error =>
        {
            $('#component_users_modify .notifications').empty();
            $('#component_users_modify .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    });

    // Borrar

    $(document).on('click', '#component_users_modify .delete', function(e)
    {
        e.preventDefault();

        let id = $('#component_users_modify input[name=id]').val();
        $('#component_users_delete input[name=id]').val(id);
        $('#component_users_delete strong.id').html(id);
        $('#component_users_delete').modal('show');
    });

    $('#component_users_delete form').submit(function(e)
    {
        e.preventDefault();

        var formData = new FormData(this);
        fetch(`/users?id=${formData.get('id')}`,
        {
            method: 'DELETE'
        })
        .then(response => 
        {
            if(response.ok)
            {
                ReadUsers();
                $('#component_users_modify .notifications').empty();
                $('#component_users_delete .notifications').empty();
                $('#component_users_modify').modal('hide');
                $('#component_users_delete').modal('hide');
            }
            else
            {
                $('#component_users_delete .notifications').empty();
                $('#component_users_delete .notifications').append(
                `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Error al borrar el usuario
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }
        })
        .catch(error =>
        {
            $('#component_users_delete .notifications').empty();
            $('#component_users_delete .notifications').append(
            `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
        });
    });

});