function procesarCSV(fileInput, callback)
{
    const file = fileInput.files[0];

    if (!file)
    {
        alert('Por favor, selecciona un archivo CSV.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event)
    {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++)
        {
            const currentLine = lines[i].split(',');
            if (currentLine.length === headers.length)
            {
                const obj = {};
                for (let j = 0; j < headers.length; j++)
                {
                    obj[headers[j].trim()] = currentLine[j].trim();
                }
                data.push(obj);
            }
        }
        callback(data); // Llama al callback con los datos procesados
    };

    reader.onerror = function(event)
    {
        console.error('Error al leer el archivo:', event.target.error);
        alert('Error al leer el archivo CSV.');
    };

    reader.readAsText(file);
}