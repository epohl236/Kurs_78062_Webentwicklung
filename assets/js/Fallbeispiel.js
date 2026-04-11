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

<<<<<<< HEAD
/**
 * Handler for the submit event of form #form_search_options.
 * It is triggered by the submit button, or by hitting Enter in a field.
 * 
 * Handling submit is more reliable than handling click, touch, or
 * pointer events on the submit button as different browsers handle such
 * events in different ways. Particularly in the Samsung browser on
 * mobile phones, touching the submit button hardly ever triggers a
 * click event.
 * @param {event} ev - A form's submit event
 */
function handleFormSearchOptionsSubmit (ev)
{
    // Suppress default handling for the submit event.
    // Default handling would clear the form and the search results
    // shortly after submit. This makes it virtually impossible to view
    // the results.
    // Also we want the search criteria to remain so the user can modify
    // them without having to re-enter all of them.
    //
    // Default handling is also not needed as we don't really want to
    // submit data to a server. We only want to call the search function.
    ev.preventDefault();

    let btn = ev.submitter;
    if (btn == null || btn.id != "btn_search")
        return;
    
    showMatchingRoutes();
}


function installSubmitHandler()
{
    let formSearchOptions = document.getElementById ("form_search_options");
    if (formSearchOptions == null)
        return;

    formSearchOptions.addEventListener ("submit", handleFormSearchOptionsSubmit);
=======
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
    console.log ("click"); //##################
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
>>>>>>> fixSubmitBtnSamsung
}


function installEventHandlers()
{
    installAirportSearchEventHandlers();
    installRoutesSearchEventHandlers();
<<<<<<< HEAD
    installSubmitHandler();
=======
    installSearchBtnHandlers();
>>>>>>> fixSubmitBtnSamsung
}


window.addEventListener ("DOMContentLoaded", installEventHandlers);
