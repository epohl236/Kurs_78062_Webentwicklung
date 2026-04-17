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

/**
 * Waiting period after an event during which subsequent events
 * should be ignored
*/
const IGNOREEVENTSFORMSECS = 500;

/** true: within waiting period, ignoring events */
var ignoreBtnSearchEvents = false;

/**
 * Timeout handler.
 * Re-enables handling of events when the waiting period ends.
 */
function handleTimeout()
{
    ignoreBtnSearchEvents = false;
}


function handleBtnSearch (strType)
{
    if (ignoreBtnSearchEvents)
    {
        console.log ("Ignored event:", strType);
        return;
    }

    ignoreBtnSearchEvents = true;
    setTimeout (handleTimeout, IGNOREEVENTSFORMSECS);
    showMatchingRoutes();
}


function handleBtnSearchClick()
{
    console.log ("click");
    handleBtnSearch ("click");
}


function handleBtnSearchPtr()
{
    console.log ("pointerdown");
    handleBtnSearch ("pointerdown");
}


/**
 * Installs handler for the search button.
 * 
 * In order to support most browsers, both click and pointerdown events
 * are handled.
 * - Ideally, clicking or touching the button should always trigger
 *   both click and pointerdown events.
 * - However, it was found that in mobile browsers, click is not reliable.
 *   Sometimes both pointerdown and click are triggered, sometimes only
 *   pointerdown.
 * - In desktop browsers, pointerdown may or may not be triggered.
 *   Tabbing to the button and hitting space triggers only click.
 *
 * As a consequence, both events are handled here. Care must be taken
 * not to handle the same button action twice if both click and
 * pointerdown were triggered. For this purpose, handleBtnSearch()
 * installs a timer for a short period after an event was received.
 * If more events are received during that period, they are ignored.
 */
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
