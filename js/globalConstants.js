/**
 * @file Defines constants used by other js files
 */


const METERPERFOOT = 0.3048;

/*
The web page's' js code is based on the structure of predefined arrays
provided with the courseware for
"Kurs_78062_Webentwicklung(HTML,CSS,JavaScript)":

- airlines[] in airlines_data.js
- airports[] in airports_data.js
- routes[] in routes_data.js

This file defines column indices in these arrays to avoid errors
caused by using the wrong index numbers.
*/


/* Array airlines[] (airlines_data.js):
Each airlines[] element is itself an array of details describing an airline:

[0]: Airline ID number
[1]: Airline name
[2]: Alternate name
[3]: Airline IATA code
[4]: Airline ICAO code
[5]: Country of registration
*/

// Array indices in airlines[i][]
const IAIRLINE_ID = 0;
const IAIRLINE_NAME = 1;
const IAIRLINE_ALTNAME = 2;
const IAIRLINE_IATA = 3;
const IAIRLINE_ICAO = 4;
const IAIRLINE_COUNTRY = 5;



/* Array airports[] (airports_data.js):
Each airports[] element is itself an array of details describing an airport:

[0]: Airport ID number
[1]: Airport name
[2]: City
[3]: Country
[4]: Airport IATA code
[5]: Airport ICAO code
[6]: Longitude
[7]: Latitude
[8]: Altitude (ft)
[9]: Timezone offset (h)
*/

// Array indices in airports[i][]
const IAIRPORT_ID = 0;
const IAIRPORT_NAME = 1;
const IAIRPORT_CITY = 2;
const IAIRPORT_COUNTRY = 3;
const IAIRPORT_IATA = 4;
const IAIRPORT_ICAO = 5;
const IAIRPORT_LONGITUDE = 6;
const IAIRPORT_LATITUDE = 7;
const IAIRPORT_ALTITUDE = 8;
const IAIRPORT_TIMEZONE = 9;



/* Array routes[] (routes_data.js):
Each routes[] element is itself an array of details describing a route:

[0]: Route ID number
[1]: Airline IATA code
[2]: Source airport IATA code
[3]: Destination airport IATA code
[4]: Distance between source and destination (km)
[5]: Flight time (h)
[6]: Price (EUR)
[7]: Departure times for each day of week. Formatted as a list of times
    separated by dashes, like
    "10:00-5:00-16:00-17:00-0-8:00-0"
    where the first element is the departure time on Monday etc.
    0 means that the route is not served on this day of week.
*/

// Array indices in routes[i][]
const IROUTE_ID = 0;
const IROUTE_AIRLINEIATA = 1;
const IROUTE_SOURCEIATA = 2;
const IROUTE_DESTINATIONIATA = 3;
const IROUTE_DISTANCE = 4;
const IROUTE_FLIGHTTIME = 5;
const IROUTE_PRICE = 6;
const IROUTE_FLIGHTPLAN = 7;
