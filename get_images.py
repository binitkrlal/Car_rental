import urllib.request
import json
import re

cars = [
    "Tesla Model 3", "Tesla Model Y", "BMW X5", "Audi A6", "Mercedes C-Class",
    "Toyota Fortuner", "Hyundai Creta", "Mahindra Thar", "Kia Seltos", "Maruti Swift",
    "Tata Nexon EV", "MG ZS EV", "Skoda Superb", "Volkswagen Virtus", "Honda City",
    "Toyota Innova Crysta", "Mahindra XUV700", "Jeep Compass", "Renault Kwid", "BMW i4"
]

for car in cars:
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(car + ' car exterior high quality')}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # match image url
        matches = re.findall(r'img class="tile--img__img"\s+src="([^"]+)"', html)
        # duckduckgo proxy urls are like //external-content.duckduckgo.com/iu/?u=...
        if matches:
            proxy_url = matches[0]
            if proxy_url.startswith('//'):
                proxy_url = 'https:' + proxy_url
            print(f"{car}: {proxy_url}")
        else:
            print(f"{car}: NO MATCH")
    except Exception as e:
        print(f"{car}: ERROR {e}")
