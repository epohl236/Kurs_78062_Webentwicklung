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

//#####################################
function handleBtnSearchClick()
{
    alert ("click");
}

function handleBtnSearchTouch()
{
    alert ("touch");
}

function handleBtnSearchPtr()
{
    alert ("pointer");
}
//#####################################

function installSearchBtnClickHandler()
{
    let btnSearch = document.getElementById ("btn_search");
    if (btnSearch == null)
        return;

    //####### btnSearch.addEventListener ("click", showMatchingRoutes);

    //#####################################
    btnSearch.addEventListener ("click", handleBtnSearchClick);
    btnSearch.addEventListener ("touchstart", handleBtnSearchTouch);
    btnSearch.addEventListener ("pointerdown", handleBtnSearchPtr);
    //#####################################

}


function installEventHandlers()
{
    installAirportSearchEventHandlers();
    installRoutesSearchEventHandlers();
    installSearchBtnClickHandler();
}


window.addEventListener ("DOMContentLoaded", installEventHandlers);
