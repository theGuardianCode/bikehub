const map = L.map('map').setView([-27.47897, 153.0283], 15)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([-27.47897, 153.0283]).addTo(map)

function plotRacks(racks) {
    racks.forEach(element => {
        let popupText = `
            ${element.address}<br>
            ${element.rack_type}<br>
            Capacity: ${element.capacity}<br>
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
