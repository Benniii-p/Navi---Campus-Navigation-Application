# Navi: Campus Navigation Web App

**Cavite State University – Cavite City Campus** · Group 3 · Systems Analysis and Design

Navi helps students and visitors find offices, classrooms and other places inside the campus.
It follows the System Proposal:

| Requirement in the proposal | Where it is in Navi |
|---|---|
| Home Screen | `index.php` |
| Search Destination Screen (library, registrar, canteen, admin office, classrooms…) | `search.php` |
| Campus Map Screen (buildings, offices, classrooms) – **Ground Floor and Second Floor** | `map.php` |
| Current Location Screen (latitude & longitude from the browser's Geolocation API) | `location.php` |
| List of all destinations + location information of a selected destination | `search.php?all=1`, place card on `map.php` |
| Simple, user-friendly, works on any device with a browser | Responsive Bootstrap 5 layout, bottom navigation on phones |
| Destination info updated manually when rooms or offices change | Admin panel `admin/` |
| QR code posters (Training Costs in the proposal) | `admin/qr.php` – each poster opens Navi with "You are here" set |

Extra: step-by-step directions with the route drawn on the floor map, including the stairs
between the Ground and Second Floor.

Built with **HTML, CSS, JavaScript, PHP and MySQL**, using Bootstrap 5.3.8, Bootstrap Icons, Leaflet 1.9.4
and QRCode.js. All libraries are already included in `assets/vendor/`, so nothing needs to be downloaded.

---

## 1. Requirements

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP 8)
- [Visual Studio Code](https://code.visualstudio.com/)
- A modern browser (Chrome, Edge, Firefox or Safari)

## 2. Put the project inside XAMPP

Clone or copy the project into `C:\xampp\htdocs\` and name the folder **`navi`**:

```bash
cd C:\xampp\htdocs
git clone https://github.com/benniii-p/navi---campus-navigation-application.git navi
cd navi
git checkout claude/loving-curie-hzovio
```

Then in VS Code: **File → Open Folder → `C:\xampp\htdocs\navi`**.

## 3. Start XAMPP

Open the **XAMPP Control Panel** and click **Start** for **Apache** and **MySQL**.

## 4. Create the database

1. Go to <http://localhost/phpmyadmin>
2. Click **Import** (top menu). You don't need to pick a database first.
3. **Choose file** → `navi/database/navi_db.sql` → click **Import**.

This creates the `navi_db` database with the `destinations` table (73 places on both floors) and the `admins` table.

> If your MySQL `root` user has a password, put it in `includes/config.php` (`DB_PASS`).

## 5. Open Navi

| Page | Link |
|---|---|
| Home | <http://localhost/navi/> |
| Search | <http://localhost/navi/search.php> |
| Campus map | <http://localhost/navi/map.php> |
| Current location | <http://localhost/navi/location.php> |
| Admin | <http://localhost/navi/admin/> → username **admin**, password **navi2026** |

**Change the admin password** after your first login (Admin → Password).

---

## 6. Opening Navi on a phone

Phones can't open `localhost`. Use one of these:

**Same Wi-Fi.** Find your PC's IP with `ipconfig` (for example `192.168.1.5`) and open
`http://192.168.1.5/navi/` on the phone. Allow Apache through Windows Firewall if asked.
⚠️ Browsers **block GPS on plain `http://` links**, so the Current Location screen won't work this way.

**HTTPS tunnel (recommended, GPS works).**

```bash
winget install --id Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:80
```

Open the `https://….trycloudflare.com/navi/` link it prints on any phone. Put that link in
`PUBLIC_BASE_URL` in `includes/config.php` (or in the box on the QR page) before printing QR posters.

> Only share the `/navi/` link. **Don't share `/phpmyadmin`** – anyone with the link could change your database.

---

## 7. Settings (`includes/config.php`)

| Setting | What it does |
|---|---|
| `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` | MySQL connection (XAMPP default: `root` with no password) |
| `CAMPUS_LAT`, `CAMPUS_LNG` | Campus position on the Current Location map. **These are approximate – replace them** with the real coordinates: right-click the campus in Google Maps and click the numbers to copy them. |
| `CAMPUS_RADIUS_M` | How close (in meters) still counts as "inside the campus" |
| `GEO_POINTS` | Optional. Shows the live GPS dot on the Ground Floor map. See below. |
| `PUBLIC_BASE_URL` | Link used in the QR code posters |

### Turning on the GPS dot on the floor map (optional)

1. Stand at 3 spots far apart, for example the Main Gate, the West Fire Exit and the East Fire Exit.
2. At each spot open **My Location**, wait until the accuracy is small, and write down the latitude and longitude.
3. In **Admin → Edit** for that place, note its **Door X / Door Y** (its position on the map).
4. Fill in `GEO_POINTS`:

```php
define('GEO_POINTS', [
    ['x' => 835,  'y' => 1770, 'lat' => 14.46431, 'lng' => 120.89551],  // Main Gate
    ['x' => 412,  'y' => 858,  'lat' => 14.46502, 'lng' => 120.89510],  // West Fire Exit
    ['x' => 1360, 'y' => 1278, 'lat' => 14.46470, 'lng' => 120.89590],  // East Fire Exit
]);
```

(The numbers above are only an example.) GPS indoors is usually 5–20 m off, so treat the dot as a rough guide.

---

## 8. Updating destinations (Admin panel)

- **Destinations**: edit, hide or delete places.
- **Add**: new room or office. Choose the floor, then turn on **Draw rectangle** and drag on the map.
  Turn on **Set door** and click where the room meets the hallway. Routes start and end at the door.
- **QR Posters**: printable "You are here" QR codes for every place.

Hallways, stairs and walkways (used for routing) are in `assets/js/floorplan.js` under `FLOORS[1]` and `FLOORS[2]`
(`shapes` = drawing, `nodes` and `edges` = walkable paths, `STAIR_LINKS` = stairs between floors).

> **Please verify on site:** the floor layout was traced from the posted evacuation plans
> ("CvSU-CCC Ground Site Map", "As-Built Ground Floor Plan" and "CvSU-CCC Second Floor Emergency Exit Plan").
> Second-floor room numbers were read from a photo, and office hours are typical values.
> Correct anything that is different in the Admin panel.

---

## 9. Project structure

```
navi/
├── index.php              Home Screen
├── search.php             Search Destination Screen
├── map.php                Campus Map Screen (Ground + Second Floor, directions)
├── location.php           Current Location Screen (Geolocation API + Leaflet map)
├── api/
│   └── destinations.php   JSON API: list / search / single destination
├── admin/                 Login, manage destinations, QR posters, change password
├── includes/
│   ├── config.php         Settings (database, campus coordinates)
│   ├── db.php             Database connection + helpers
│   ├── header.php         Navbar (shared)
│   └── footer.php         Bottom navigation + scripts (shared)
├── assets/
│   ├── css/style.css      Design (CvSU green & gold)
│   ├── js/common.js       Shared helpers
│   ├── js/floorplan.js    Floor plans, route finding (Dijkstra), interactive SVG map
│   ├── js/map.js          Campus Map screen logic
│   ├── js/search.js       Search screen logic
│   ├── js/location.js     Current Location screen logic
│   ├── js/admin-*.js      Admin map editor and QR generator
│   ├── img/navi-logo.svg
│   └── vendor/            Bootstrap, Bootstrap Icons, Leaflet, QRCode.js
└── database/navi_db.sql   Database + sample data (import in phpMyAdmin)
```

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| "Cannot connect to the database" | Start **MySQL** in XAMPP and import `database/navi_db.sql`. Check `DB_PASS` in `includes/config.php`. |
| Apache won't start (port 80 busy) | Close Skype or IIS, or change Apache's port in XAMPP → Config → `httpd.conf` (`Listen 8080`), then use `http://localhost:8080/navi/`. |
| Location says "permission denied" | Allow location for the site in the browser (🔒 icon next to the address). |
| Location doesn't work on the phone | Use the HTTPS tunnel (section 6). Plain `http://192.168…` links can't use GPS. |
| The street map on the Location page is gray | OpenStreetMap tiles need internet. The floor maps work offline. |
