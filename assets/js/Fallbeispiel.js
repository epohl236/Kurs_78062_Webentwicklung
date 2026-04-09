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

var ignoreBtnSearchEvents = false;

function handleTimeout()
{
    ignoreBtnSearchEvents = false;
}


function handleBtnSearch (strType)
{
    if (ignoreBtnSearchEvents)
    {
        //console.log ("Ignored event:", strType);
        alert ("Ignored event: " + strType);
        return;
    }

    ignoreBtnSearchEvents = true;
    setTimeout (handleTimeout, 500);
    showMatchingRoutes();
}


function handleBtnSearchClick()
{
    console.log ("click"); //#################
    handleBtnSearch ("click");
}


function handleBtnSearchPtr()
{
    console.log ("pointerdown"); //#################
    handleBtnSearch ("pointerdown");
}


function installSearchBtnHandlers()
{
    let btnSearch = document.getElementById ("btn_search");
    if (btnSearch == null)
        return;

    btnSearch.addEventListener ("click", handleBtnSearchClick);
    btnSearch.addEventListener ("pointerdown", handleBtnSearchPtr);
}


function installEventHandlers()
{
    installAirportSearchEventHandlers();
    installRoutesSearchEventHandlers();
    installSearchBtnHandlers();
}


window.addEventListener ("DOMContentLoaded", installEventHandlers);
