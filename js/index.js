const btnSearch = document.getElementById('btnBuscar')
const inputCity = document.getElementById('searchCity')

btnSearch.addEventListener('click', () => {
    if(inputCity.value.trim().length > 0) {
        console.log('==> Input value ->', inputCity)
        buscarCiudad(inputCity.value) // 
    }  
})

const buscarCiudad = async(ciudad) => {
    // Peticion al servidor
    const url = `https://ai-weather-by-meteosource.p.rapidapi.com/find_places?text=${ciudad}&language=es`;
    // Cambiamos ' ' por ` `, por que queremos MANDAR lo que se ingreso en el input, y debemos mandar el string 
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0162c6fac3mshb75db644e8313dep15b220jsnecbf198ee5d7',
            'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        } catch (error) {
            console.error(error);
        }
}
// PENDIENTE EL RELIZAR UN FILTRADO DE DATOS, por que encuentra variedad de estados de Gto.