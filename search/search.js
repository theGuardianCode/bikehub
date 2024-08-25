const searchBar = document.getElementById('search')
const racks = document.getElementById('rack-list')

searchBar.addEventListener('input', e => {
    const text = e.target.value

    if (text !== "") {
        const where = encodeURI(`address like "%${text}%"`)
        const url = `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/bicycle-racks/records?where=${where}&limit=20`

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("baa")
                const rackList = data.results
                
                let markup = ""
                rackList.forEach(element => {
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

                racks.innerHTML = markup
            })
    }
})