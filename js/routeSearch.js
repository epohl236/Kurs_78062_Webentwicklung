/**
 * @file Implements the search lists for departing and arriving
 * flights matching the search results from airportSearch.js
 * 
 * Load the following files before this file:
 * - routes_data.js
 */

/*
The following code is based on the structure of array routes[] in
routes_data.js. Each routes[] element is itself an array of details
describing a route:

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

// Array indexes in routes[i][]
const IROUTEID = 0;
const IAIRLINEIATA = 1;
const ISOURCEIATA = 2;
const IDESTINATIONIATA = 3;
const IDISTANCE = 4;
const IFLIGHTTIME = 5;
const IPRICE = 6;
const IFLIGHTPLAN = 7;


/**
 * From a string like "Frankfurt am Main International Airport (FRA)"
 * return the "FRA", i.e. the text between parentheses at the end of
 * the string. It should be an airpoprt's IATA code.
 * 
 * @param {string} airportNameAndIATA String with name and IATA code
 * of an airport, like "Frankfurt am Main International Airport (FRA)"
 * 
 * @returns {string} The extracted IATA code or null
 */
function extractIATA (airportNameAndIATA)
{
    if (!airportNameAndIATA.endsWith (")"))
        return null;

    let iOpenParen = airportNameAndIATA.lastIndexOf ("(");
    if (iOpenParen < 0)
        return null;

    return airportNameAndIATA.slice (iOpenParen + 1, -1);
}


function getFlightFromToIATA (inputFromId, inputToId)
{
    let fromIATA = null;
    let toIATA = null;
    let fromAirport = null;
    let toAirport = null;

    let inputFrom = document.getElementById (inputFromId);
    if (inputFrom != null && inputFrom.tagName == "INPUT")
    {
        fromIATA = extractIATA (inputFrom.value);
        fromAirport = inputFrom.value;
    }

    let inputTo = document.getElementById (inputToId);
    if (inputTo != null && inputTo.tagName == "INPUT")
    {
        toIATA = extractIATA (inputTo.value);
        toAirport = inputTo.value;
    }

    return [fromIATA, toIATA, fromAirport, toAirport];
}


function getFlightTime (aRoute, nDayOfWeek)
{
    if (nDayOfWeek < 1 || nDayOfWeek > 7)
    {
        console.log (`getFlightTime(): Invalid day of week: ${nDayOfWeek}`);
        return "0";
    }

    // aRoute[IFLIGHTPLAN]: "10:00-5:00-16:00-17:00-0-8:00-0"
    const aDepTimes = aRoute[IFLIGHTPLAN].split ("-");
    if (aDepTimes.length != 7)
    {
        console.log (`getFlightTime(): Invalid flight plan in route ${aRoute[IROUTEID]}: "${aRoute[IFLIGHTPLAN]}"`);
        return "0";
    }

    // Note that nDayOfWeek is 1-based (1 == Mo), but aDepTimes[]
    // is 0-based
    return aDepTimes[nDayOfWeek - 1];
}


/**
 * Create a list of search results as a table
 * 
 * @param {array} aRoutes - Array of search results as returned by the
 * search_route() function (routes_data.js). Subset of the routes[]
 * array in routes_data.js. Each element is an array of details of a
 * flight route.
 * 
 * @param {integer} nDayOfWeek - 1-based day of week of where 1 == Monday,
 * 2 = Tuesday ... Routes that are not served on that day will be excluded
 * from the list.
 * @param {HTMLElement} parent - The parent element to which the table
 * should be added as a child. Usually a div element.
*/
function showRoutesSearchResults (aRoutes, nDayOfWeek, parent)
{
    let newTable = document.createElement ("table");
    newTable.className = "bg_green flight_options";

    let nMinPrice = 0;
    let idOfMinRow = null;

    for (const aRoute of aRoutes)
    {
        // First examine the flight times. If the route is not served
        // on nDayOfWeek, skip this route.
        const strDepartureTime = getFlightTime (aRoute, nDayOfWeek);
        //console.log (`showRoutesSearchResults() route ${aRoute[IROUTEID]} departure time: ${strDepartureTime}`);
        if (strDepartureTime == "0")
            continue;

        let newRow = document.createElement ("tr");

        // Omit the route ID number from the row but add it as
        // the row's id
        newRow.id = aRoute[IROUTEID];

        // Create row cells:
        // 0: Airline IATA
        // 1: Source airport IATA
        // 2: Destination airport IATA
        // 3: Price (EUR)
        // 4: Departure time
        // 5: Distance (km)
        // 6: Flight time (h)
        const aCellContents = [
            aRoute[IAIRLINEIATA],
            aRoute[ISOURCEIATA],
            aRoute[IDESTINATIONIATA],
            aRoute[IPRICE] + " €",
            strDepartureTime + " Uhr",
            aRoute[IDISTANCE] + " km",
            aRoute[IFLIGHTTIME] + " h"
        ];

        for (content of aCellContents)
        {
            let newCell = document.createElement ("td");
            newCell.innerText = content;
            newRow.appendChild (newCell);
        }

        newTable.appendChild (newRow);

        // Keep track of the lowest price
        const nPrice = Number.parseFloat (aRoute[IPRICE]);
        if (nMinPrice == 0 || nPrice < nMinPrice)
        {
            nMinPrice = nPrice;
            idOfMinRow = aRoute[IROUTEID];
        }
    }

    parent.appendChild (newTable);

    // Highlight the row with the lowest price
    //console.log ("Min price:", nMinPrice, "id:", idOfMinRow);
    if (idOfMinRow != null)
    {
        let minRow = document.getElementById (idOfMinRow);
        //console.log (minRow);
        if (minRow != null && minRow.tagName == "TR")
            minRow.className = "bg_red";
    }
}


function showMatchingRoutesSingleDirection (inputFlightDateId, inputFromId, inputToId, divParentId)
{
    let divParent = document.getElementById (divParentId);
    if (divParent == null || divParent.tagName != "DIV")
    {
        console.log (`Parent div with id "${divParentId}" not found`);
        return;
    }

    // Clear previous search results
    divParent.replaceChildren();

    // Get the flight date. This is necessary because routes that
    // are not served on that day must not be listed.
    const inputFlightDate = document.getElementById (inputFlightDateId);
    if (inputFlightDate == null)
    {
        console.log (`Flight date input with id "${inputFlightDateId}" not found`);
        return;
    }

    // Value: "2026-03-12"
    // Calculate the day of week (1..7, 1 == Monday etc.)
    const dateFlight = Temporal.PlainDate.from (inputFlightDate.value);
    const nDayOfWeek = dateFlight.dayOfWeek;
    //console.log ("Departure date:", departureDate.value, "day of week:", nDayOfWeek);

    const [fromIATA, toIATA, fromAirport, toAirport] = getFlightFromToIATA (inputFromId, inputToId);
    //console.log (`showMatchingDepartures(): fromIATA=${fromIATA}, toIATA=${toIATA}`);
    if (fromIATA == null || toIATA == null)
    {
        if (fromIATA == null)
            console.log ("'From' airport IATA is null");

        if (toIATA == null)
            console.log ("'To' airport IATA is null");

        return;
    }

    // Show a title like
    // "Flüge von Frankfurt am Main International Airport (FRA) nach London Heathrow Airport (LHR)"
    let title = document.createElement ("p");
    title.innerText = "Flüge von " + fromAirport + " nach " + toAirport;
    divParent.appendChild (title);

    let aRoutes = search_route (fromIATA, toIATA);
    //console.log (aDepartures);

    showRoutesSearchResults (aRoutes, nDayOfWeek, divParent);
}


function showMatchingOutboundRoutes()
{
    showMatchingRoutesSingleDirection ("departure_date", "departure_from", "departure_to", "departure_routes");
}


function showMatchingReturnRoutes()
{
    showMatchingRoutesSingleDirection ("arrival_date", "arrival_from", "arrival_to", "arrival_routes");
}


function showMatchingRoutes()
{
    showMatchingOutboundRoutes();

    const checkbox = document.getElementById ("include_arrivals");
    if (checkbox != null && checkbox.tagName == "INPUT" && checkbox.checked)
        showMatchingReturnRoutes();
}


/**
 * Handler for the click event in the search results table.
 * Creates a text describing the selected flight within the
 * fieldset labeled "Ihre Auswahl"
 * @param {event} ev - A click event in the search result table
 */
function handleRoutesSearchListClick (ev)
{
    let divFlightDescription = document.getElementById ("flight_description");
    if (divFlightDescription == null || divFlightDescription.tagName != "DIV")
        return;

    // Delete previous description
    divFlightDescription.replaceChildren();

    // ev.target should be the td element clicked in the search
    // results table.
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    input.value = ev.target.innerText;

    // Construct a text like:
    // "Sie fliegen von <source_airport_name>, <source_airport_country>
    // nach <dest_airport_name>, <dest_airport_country>. Die voraussichtliche
    // Flugzeit beträgt <flight_time_hours> Stunden und <flight_time_minutes>
    // Minuten. Der Flug wird von <airline_name> mit Sitz in <airline_country>
    // durchgeführt.
    //
    // Die Distanz beträgt: <distance> km.
    //
    // Abflug- und Zielort haben einen Höhenunterschied von: <altitude_difference>m"

    // Airport properties
    const srcAirportName = null;
    const srcAirportCountry = null;
    const srcAirportAltitudeFt = null;
    const destAirportName = null;
    const destAirportCountry = null;
    const destAirportAltitudeFt = null;

    // Route properties
    const flightTime = null;
    const distanceKm = null;

    // Airline properties
    const airlineName = null;
    const airlineCountry = null;

}


/**
 * Installs a handler for the click event on a search results table
 * 
 * @param {string} id - The id of a div containing the table
 */
function installRoutesSearchClickHandler (id)
{
    var divList = document.getElementById (id);
    if (divList == null || divList.tagName != "DIV")
        return;

    divList.addEventListener ("click", handleRoutesSearchListClick);
}


function installRoutesSearchEventHandlers()
{
    installRoutesSearchClickHandler ("departure_routes");
    installRoutesSearchClickHandler ("arrival_routes");
}
