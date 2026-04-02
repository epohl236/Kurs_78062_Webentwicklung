/**
 * @file Implements the search lists for departing and arriving
 * flights matching the search results from airportSearch.js
 * 
 * Load the following files before this file:
 * - globalConstants.js
 * - airport_data.js
 * - airlines_data.js
 * - routes_data.js
 */

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


/**
 * Get source and destination airport names and IATA codes
 * from input elements where the user entered them. Both inputs should
 * be formatted like "<airport name> (<IATA>)".
 * 
 * @param {string} inputFromId - ID of input element with source airport
 * @param {string} inputToId - ID of input element with destination airport
 * @returns {object} Object {fromIATA, toIATA, fromAirport, toAirport}
 */
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

    oRet =
    {
        fromIATA: fromIATA,
        toIATA: toIATA,
        fromAirport: fromAirport,
        toAirport: toAirport
    };
    
    return oRet;
}


/**
 * Get the departure time of a flight route depending on the day of week
 * 
 * @param {array} aRoute - Array with details describing a flight route.
 * Must be structured like an element of array routes[] (routes_data.js)
 * 
 * @param {integer} nDayOfWeek - Day of week number (1..7, 1 == Mo)
 * 
 * @returns {string} - Departure time like "09:00" of flight on that day
 * of week. "0" means that the route is not served on that day.
 */
function getFlightTime (aRoute, nDayOfWeek)
{
    if (nDayOfWeek < 1 || nDayOfWeek > 7)
    {
        console.log (`getFlightTime(): Invalid day of week: ${nDayOfWeek}`);
        return "0";
    }

    // aRoute[IFLIGHTPLAN]: "10:00-5:00-16:00-17:00-0-8:00-0"
    const aDepTimes = aRoute[IROUTE_FLIGHTPLAN].split ("-");
    if (aDepTimes.length != 7)
    {
        console.log (`getFlightTime(): Invalid flight plan in route ${aRoute[IROUTE_ID]}: "${aRoute[IROUTE_FLIGHTPLAN]}"`);
        return "0";
    }

    // Note that nDayOfWeek is 1-based (1 == Mo), but aDepTimes[]
    // is 0-based (0 == Mo)
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
        if (strDepartureTime == "0")
            continue;

        let newRow = document.createElement ("tr");

        // Omit the route ID number from the row but add it as
        // the row's id
        newRow.id = aRoute[IROUTE_ID];

        // Create row cells:
        // 0: Airline IATA
        // 1: Source airport IATA
        // 2: Destination airport IATA
        // 3: Price (EUR)
        // 4: Departure time
        // 5: Distance (km)
        // 6: Flight time (h)
        const aCellContents = [
            aRoute[IROUTE_AIRLINEIATA],
            aRoute[IROUTE_SOURCEIATA],
            aRoute[IROUTE_DESTINATIONIATA],
            aRoute[IROUTE_PRICE] + " €",
            strDepartureTime + " Uhr",
            aRoute[IROUTE_DISTANCE] + " km",
            aRoute[IROUTE_FLIGHTTIME] + " h"
        ];

        for (content of aCellContents)
        {
            let newCell = document.createElement ("td");
            newCell.innerText = content;
            newRow.appendChild (newCell);
        }

        newTable.appendChild (newRow);

        // Keep track of the lowest price
        const nPrice = Number.parseFloat (aRoute[IROUTE_PRICE]);
        if (nMinPrice == 0 || nPrice < nMinPrice)
        {
            nMinPrice = nPrice;
            idOfMinRow = aRoute[IROUTE_ID];
        }
    }

    parent.appendChild (newTable);

    // Highlight the row with the lowest price
    if (idOfMinRow != null)
    {
        let minRow = document.getElementById (idOfMinRow);
        if (minRow != null && minRow.tagName == "TR")
            minRow.className = "bg_red";
    }
}



/**
 * Shows a list of flights matching the user's search criteria, either
 * for outbound flights or inbound flights.
 * 
 * The caller defines whether outbound or inbound flights are searched
 * by providing the IDs of either the "from" airport inputs or the
 * "to" airport inputs.
 * 
 * @param {string} inputFlightDateId - ID of input with departure date
 * @param {string} inputFromId - ID of input with "from" airport
 * @param {string} inputToId - ID of input with "to" airport
 * @param {string} divParentId - ID of a div where the result list
 * should be embedded as a child
 */
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

    const strFlightDate = inputFlightDate.value;
    if (strFlightDate == "")
    {
        console.log (`Flight date input with id "${inputFlightDateId}" is empty`);
        return;
    }

    // Value: "2026-03-12"
    // Calculate the day of week (1..7, 1 == Monday etc.)
    const dateFlight = Temporal.PlainDate.from (inputFlightDate.value);
    const nDayOfWeek = dateFlight.dayOfWeek;

    const oFlightFromToIATA = getFlightFromToIATA (inputFromId, inputToId);
    if (oFlightFromToIATA.fromIATA == null || oFlightFromToIATA.toIATA == null)
    {
        if (oFlightFromToIATA.fromIATA == null)
            console.log ("'From' airport IATA is null");

        if (oFlightFromToIATA.toIATA == null)
            console.log ("'To' airport IATA is null");

        return;
    }

    // Show a title like
    // "Flüge von Frankfurt am Main International Airport (FRA) nach London Heathrow Airport (LHR)"
    let title = document.createElement ("p");
    title.innerText = "Flüge von " + oFlightFromToIATA.fromAirport + " nach " + oFlightFromToIATA.toAirport;
    divParent.appendChild (title);

    let aRoutes = search_route (oFlightFromToIATA.fromIATA, oFlightFromToIATA.toIATA);
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
 * Get some properties of an airline
 * 
 * @param {string} airlineIATA - Airline IATA code
 * @returns {object} Object {IATA, Name, Country}
 */
function getAirlineProperties (airlineIATA)
{
    const airlineDetails = airline_details (airlineIATA);
    if (airlineDetails.length <= 0)
        return;

    let oRet =
    {
        IATA: airlineIATA,
        Name: airlineDetails[IAIRLINE_NAME],
        Country: airlineDetails[IAIRLINE_COUNTRY]
    }

    return oRet;
}


/**
 * Get some properties of an airport
 * 
 * @param {*} airportIATA - Airport IATA
 * @returns {object} Object {IATA, Name, Country, AltitudeFt}
 */
function getAirportProperties (airportIATA)
{
    const airportDetails = airport_details (airportIATA);
    if (airportDetails.length <= 0)
        return null;

    let oRet = 
    {
        IATA: airportIATA,
        Name: airportDetails[IAIRPORT_NAME],
        Country: airportDetails[IAIRPORT_COUNTRY],
        AltitudeFt: airportDetails[IAIRPORT_ALTITUDE]
    }

    return oRet;
}


/**
 * Get some properties of a flight route
 * 
 * @param {string} routeId - ID number of route in array routes[]
 * @returns {object} Object {Id, FlightTime, DistanceKm}
 */
function getRouteProperties (routeId)
{
    const routeDetails = route_details (routeId);
    if (routeDetails.length <= 0)
        return null;

    let oRet = 
    {
        Id: routeId,
        FlightTime: routeDetails[IROUTE_FLIGHTTIME],
        DistanceKm: routeDetails[IROUTE_DISTANCE]
    }

    return oRet;
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

    // For this text we need details about airports, the route, and
    // the airline.
    //
    // ev.target should be the td element clicked in the search
    // results table. Get the IATA codes of airline, source airport,
    // and destination airport from the clicked row. By convention, 
    // the are the first, second, and third td in the row.
    // Also get the route's ID number which should be the row's id.
    tr = ev.target.parentElement;
    if (tr == null || tr.tagName != "TR")
        return;

    const routeId = tr.id;

    let td = tr.firstElementChild;
    const airlineIATA = td.innerText;
    td = td.nextElementSibling;
    const srcAirportIATA = td.innerText;
    td = td.nextElementSibling;
    const destAirportIATA = td.innerText;

    const oAirlineDetails = getAirlineProperties (airlineIATA);
    const oSrcAirportDetails = getAirportProperties (srcAirportIATA);
    const oDestAirportDetails = getAirportProperties (destAirportIATA);
    const oRouteDetails = getRouteProperties (routeId);

    const nFlightTime = Number.parseFloat (oRouteDetails.FlightTime);
    // like 1.6
    const nFlightTimeHours = Math.trunc (nFlightTime);
    const nFlightTimeMinutes = Math.round ((nFlightTime - nFlightTimeHours) * 60);
    const nAltitudeDiffM = Math.round ((oDestAirportDetails.AltitudeFt - oSrcAirportDetails.AltitudeFt) * METERPERFOOT);


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
    let description = "Sie fliegen von ";
    description += oSrcAirportDetails.Name;
    description += ", ";
    description += oSrcAirportDetails.Country;
    description += " nach ";
    description += oDestAirportDetails.Name;
    description += ", ";
    description += oDestAirportDetails.Country;
    description += ". Die voraussichtliche Flugzeit beträgt ";
    description += nFlightTimeHours.toString();
    description += " Stunden und ";
    description += nFlightTimeMinutes.toString();
    description += " Minuten. Der Flug wird von ";
    description += oAirlineDetails.Name;
    description += " mit Sitz in ";
    description += oAirlineDetails.Country;
    description += " durchgeführt.";
    
    let pDescription = document.createElement ("p");
    pDescription.innerText = description;
    divFlightDescription.appendChild (pDescription);

    description = "Die Distanz beträgt: <span class='fett'>";
    description += oRouteDetails.DistanceKm.toString();
    description += " km.</span>"

    pDescription = document.createElement ("p");
    pDescription.innerHTML = description;
    divFlightDescription.appendChild (pDescription);

    description = "Abflug und Zielort haben einen Höhenunterschied von: <span class='fett'>";
    description += nAltitudeDiffM.toString();
    description += "m</span>";

    pDescription = document.createElement ("p");
    pDescription.innerHTML = description;
    divFlightDescription.appendChild (pDescription);
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
