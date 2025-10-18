$(function()
{
    function configurarFechas()
    {
        const hoy = new Date();
        const hoyFormateado = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
        $('input[type="date"][name="from"]').val(hoyFormateado);
        $('input[type="date"][name="to"]').val(hoyFormateado);
    }
    configurarFechas();

});

function menu(menu)
{
    let menus = ['report1', 'report2'];

    for(let m of menus)
    {
        if(m === menu)
        {
            $(`#${m}_btn`).addClass('active');
            $(`#${m}_section`).show();
        }
        else
        {
            $(`#${m}_btn`).removeClass('active');
            $(`#${m}_section`).hide();
        }
    }
}