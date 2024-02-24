const btnSearch = document.getElementById('btnBuscar')
const inputCity = document.getElementById('searchCity')

const bodyTable = document.getElementById('bodyTable')
const renglonClima = document.getElementById('renglonClima').content //.content por ser template
const fragment = document.createDocumentFragment()

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
            // 'X-RapidAPI-Key': '0162c6fac3mshb75db644e8313dep15b220jsnecbf198ee5d7',
            'X-RapidAPI-Key': '72e3310bf6msh4060fda3b7a9440p16454ajsnef4e583d12ae',
            'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        let result = await response.json(); // Respuestas de todo lo que obtuve en la busqueda

        const datos = ciudad.split(',') // Separamos cada resultado por ,
        // console.log(result);
        result = result.filter((city) => city.adm_area2.toLowerCase() === datos[0].toLowerCase() && city.name.toLowerCase() === datos[0].toLowerCase()) // los === busca coindicencias EXACTAS
        getCurrentWeather(result[0].place_id) // Obtenemos el clima actual
        } catch (error) {
            console.error(error);
        }
}   

const getCurrentWeather = async (place_id) => {
    // Funcion Asincrona porque voy a consultar el point y devolvere algo
    const url = `https://ai-weather-by-meteosource.p.rapidapi.com/current?place_id=${place_id}&timezone=auto&language=es&units=metric`;
    const options = {
        method: 'GET',
        headers: {
            // 'X-RapidAPI-Key': '0162c6fac3mshb75db644e8313dep15b220jsnecbf198ee5d7',
            'X-RapidAPI-Key': '72e3310bf6msh4060fda3b7a9440p16454ajsnef4e583d12ae',
            'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        await drawCard(result.current)
        await getHistoricalData(place_id)
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

const getHistoricalData = async (place_id) => { // Funcion para OBTENER TODOS LOS DATOS HISTORICOS!!! 
    // los datos hisoricos los OBTENEMOS del get-pont de la API:
    const anio = new Date().getFullYear().toString()
    const mes = (new Date().getMonth() + 1).toString() // getMonth iniciaa contar en 0
    const dia = new Date().getDay().toString()
    const fecha_actual = anio + '-' + mes + '-' + dia
    // console.log('==> Fecha ->', fecha_actual);

    const url = `https://ai-weather-by-meteosource.p.rapidapi.com/time_machine?date=${fecha_actual}&place_id=${place_id}&units=auto`;
    const options = {
        method: 'GET',
        headers: {
            // 'X-RapidAPI-Key': '0162c6fac3mshb75db644e8313dep15b220jsnecbf198ee5d7',
            'X-RapidAPI-Key': '72e3310bf6msh4060fda3b7a9440p16454ajsnef4e583d12ae',
            'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        await drawTable(result.data)  // el .data es en donde estan os 24 arreglos equivalentes a las 24 horas del dia.
        // console.log(result.data);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

const drawTable = (datos) => {
    bodyTable.innerHTML = '' // borramos elementos basura, para solo imprimir los elementos del end-point
    datos.forEach((renglon) => {
        renglonClima.querySelectorAll('td')[0].textContent = renglon.weather
        renglonClima.querySelectorAll('td')[1].textContent = renglon.temperature
        renglonClima.querySelectorAll('td')[2].textContent = renglon.feels_like  // Sensacion termica
        renglonClima.querySelectorAll('td')[3].textContent = renglon.wind.speed  // Velocidad de viento
        renglonClima.querySelectorAll('td')[4].textContent = renglon.wind.dir    // Direccion de viento
        renglonClima.querySelectorAll('td')[5].textContent = renglon.precipitation.total // % De Humedad
        renglonClima.querySelectorAll('td')[6].textContent = renglon.precipitation.type // TIpo de Lluvia
        renglonClima.querySelectorAll('td')[7].textContent = renglon.ozone        // Ozono
        renglonClima.querySelectorAll('td')[8].textContent = renglon.humidity     // Humedad
        
        const clone = renglonClima.cloneNode(true) // Clonamos DATO por DATO
        fragment.appendChild(clone)
    })
    bodyTable.appendChild(fragment)
}

const drawCard = (datos) => {
    const temperatura = document.getElementsByClassName('temperatura')
    const localidad = document.getElementsByClassName('localidad')

    temperatura[0].innerHTML = '' // Limpiamos lo que haya de basura
    temperatura[0].textContent = datos.temperature + "°"

    localidad[0].innerHTML = ''
    localidad[0].textContent = inputCity.value
}