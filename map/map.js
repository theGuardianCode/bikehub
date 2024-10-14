const map = L.map('map').setView([-27.4729, 153.0265], 15)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function plotRacks(racks) {
    racks.forEach(element => {
        const mapsURL = `https://www.google.com/maps/search/?api=1&query=${element.latitude}%2C${element.longitude}`

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


window.onload = () => {
    let racks = []
    let rackCount = 100
    let rackOffset = 0
    let url = `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/bicycle-racks/records?limit=${rackCount}&offset=${rackOffset}`
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            rackCount = data.results.length
            rackOffset = data['total_count'] - rackCount
            url = `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/bicycle-racks/records?limit=${rackCount}&offset=${rackOffset}`

            racks = racks.concat(data.results)

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    racks = racks.concat(data.results)
                    plotRacks(racks)
                })
        })
}
