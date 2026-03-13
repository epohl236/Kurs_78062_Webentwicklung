/**
 * @file Scripts for Fallbeispiel.html
 * 
 * Load the following files before this file:
 * - airlines_data.js
 * - airport_data.js
 * - routes_data.js
 * - routeSearch.js
 * - airportSearch.js
 */

function installSearchBtnClickHandler()
{
    let btnSearch = document.getElementById ("btn_search");
    if (btnSearch == null)
        return;

    btnSearch.addEventListener ("click", showMatchingRoutes);
}


function installEventHandlers()
{
    installAirportSearchEventHandlers();
    installRoutesSearchEventHandlers();
    installSearchBtnClickHandler();
}


window.addEventListener ("DOMContentLoaded", installEventHandlers);
