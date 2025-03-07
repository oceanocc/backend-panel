$(function()
{
    function configurarFechas()
    {
        // Obtiene la fecha actual
        const hoy = new Date();
    
        // Obtiene el primer día del mes actual
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
        // Formatea las fechas a YYYY-MM-DD (formato requerido por <input type="date">)
        const hoyFormateado = hoy.toISOString().slice(0, 10);
        const primerDiaMesFormateado = primerDiaMes.toISOString().slice(0, 10);
    
        // Selecciona los inputs 'from' y 'to' y les asigna los valores formateados
        $('input[type="date"][name="from"]').val(primerDiaMesFormateado);
        $('input[type="date"][name="to"]').val(hoyFormateado);
    }
    configurarFechas();

});

function menu(menu)
{
    let menus = ['users', 'salesStates'];

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