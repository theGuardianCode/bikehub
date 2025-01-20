const map = L.map('map').setView([-27.4729, 153.0265], 15)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function plotRacks(racks) {
    racks.forEach(element => {
        const mapsURL = `geo:${element.latitude},${element.longitude}?q=${element.latitude},${element.longitude}`

        let popupText = `
            Address: ${element.address}<br>
            Type: ${element.rack_type}<br>
            Capacity: ${element.capacity}<br>
            <a href="${mapsURL}">Open Directions</a>
        `
        L.marker([element.latitude, element.longitude]).addTo(map)
            .bindPopup(popupText)
    });
}


window.onload = async () => {
    let offset = 0
    let limit = 100
    let racks = []

    while (limit > 0) {
        const url = `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/bicycle-racks/records?limit=${limit}&offset=${offset}`

        const res = await fetch(url)
        const data = await res.json()

        racks = racks.concat(data.results)

        offset += limit
        limit = data.total_count - offset
    }
    
    plotRacks(racks)
}
