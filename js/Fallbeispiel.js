/**
 * @file Scripts for Fallbeispiel.html
 * 
 * Load the following files before this file:
 * - routes_data.js
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
    installSearchBtnClickHandler();
}


window.addEventListener ("DOMContentLoaded", installEventHandlers);
