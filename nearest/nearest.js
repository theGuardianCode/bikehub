let rackCount = 100
let rackOffset = 0
let url = `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/bicycle-racks/records?limit=${rackCount}&offset=${rackOffset}`
const racklist = document.getElementById("rack-list")

const mapsURL = "https://www.google.com/maps/search/?api=1&query=47.5951518%2C-122.3316393"

const renderRacks = (list) => {
    markup = ""
    list.forEach(element => {
        const mapsURL = `https://www.google.com/maps/search/?api=1&query=${element['latitude']}%2C${element['longitude']}`

        markup += `
            <li>
            <a href="${mapsURL}">
                <span id="rack-item">
                    <span id="pin">📍</span>
                    <div>
                        <h3>${element['address'].toUpperCase()}</h3>
                        <div id="rack-info">
                            <p>${element['rack_type'].toUpperCase()}</p>
                            <p>CAPACITY: ${element['capacity']}</p>
                            <p>LAT: ${element['latitude']}</p>
                            <p>LONG: ${element['longitude']}</p>
                        </div>
                    </div>
                </span>
            </a>
        </li>
        `
    });
    racklist.innerHTML = markup
}

const sortRacks = (arr, lat, long) => {
    let result = arr
    result.sort((a, b) => {
        const distA = Math.sqrt(((a.latitude - lat) ** 2) + ((a.longitude - long) ** 2))
        const distB = Math.sqrt(((b.latitude - lat) ** 2) + ((b.longitude - long) ** 2))

        if (distA < distB) {
            return -1
        } else if (distA > distB) {
            return 1
        }
    })
    return result
}

const fetchRacks = (lat, long) => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            rackOffset = data['results'].length
            rackCount = data['total_count'] - rackCount
            url = `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/bicycle-racks/records?limit=${rackCount}&offset=${rackOffset}`

            racks = racks.concat(data.results)

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    racks.concat(data.results)
                    racks = sortRacks(racks, lat, long)
                    renderRacks(racks)
                })
        })
}

let racks = []

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetchRacks(position.coords.latitude, position.coords.longitude)
        })
    } else {
        fetchRacks(0, 0)
    }
}