class Login
{
    constructor(target = '')
    {
        this.target = target;
    }
    IsLoggedIn_(callback)
    {
        // Request
        new wtools.Request("/api/verifyLogin").Exec_((response_data) =>
        {
            if(response_data.status == 200)
                callback(true, response_data.body);
            else
                callback(false);
        });
    }
    
    LoginWithCredentials_(e)
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState(`${this.target} button[type=submit]`, true, 'button', new wtools.WaitAnimation().for_button);

        // Data
        const data = 
        {
            username: $(`${this.target} input[name=username]`).val()
            ,password: $(`${this.target} input[name=password]`).val()
        }

        // Form check
        if(! new wtools.FormChecker(e.target).Check_())
        {
            wait.Off_();
            new wtools.Notification('WARNING', 5000, `${this.target} .notifications`, true).Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Request
        new wtools.Request("/api/login", "POST", data, true).Exec_((response_data) =>
        {
            wait.Off_();

            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS', 0, `${this.target} .notifications`, true).Show_('Iniciando sesi&oacute;n...');
                location.href = '../';
            }
            else
                new wtools.Notification('WARNING', 5000, `${this.target} .notifications`, true).Show_('Credenciales inv&aacute;lidas.');
        });
    }
    Logout_()
    {
        // Request
        new wtools.Request("/api/logout", "DELETE").Exec_((response_data) =>
        {
            if(response_data.status != 200)
                new wtools.Notification('ERROR', 5000, `#notifications`, true).Show_('Error al cerrar la sesi&oacute;n.');

            location.href = '/login/';
        });
    }
}
var loginObject = new Login();
