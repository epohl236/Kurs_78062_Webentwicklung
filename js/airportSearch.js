/**
 * @file Implements the airport search feature in Fallbeispiel.html
 * 
 * Load the following files before this file:
 * - globalConstants.js
 * - airport_data.js
*/


/**
 * Create a list of search results as a table
 * 
 * @param {array} aAirports - Array of search results as returned
 * by the search_airport() function (airpoprt_data.js).
 * Must be structured as described in globalConstants.js for array
 * airports[].
 * @param {*} parent - The parent element to which the table should
 * be added as a child. Usually a div element.
 */
function showAirportSearchResults (aAirports, parent)
{
    // Create a list of search results as a table.
    let newTable = document.createElement ("table");
    newTable.className = "searchList";

    for (const aAirport of aAirports)
    {
        let newRow = document.createElement ("tr");

        let newCell = document.createElement ("td");
        newCell.innerText = `${aAirport[IAIRPORT_NAME]} (${aAirport[IAIRPORT_IATA]})`
        // "London Heathrow Airport (LHR)"

        // Add a tabindex to the td so it can receive keyboard focus
        // See "6.6.3 The tabindex attribute"
        // https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute
        newCell.setAttribute ("tabindex", "0");
        newRow.appendChild (newCell);

        newTable.appendChild (newRow);
    }

    parent.appendChild (newTable);
}


/**
 * Given an input where a search string was entered, find the
 * associated search results list. The list is a div containing a
 * table with the search results.
 * 
 * The table may or may not exist depending on whether or not the
 * search string is empty. Therefore we return the div rather than
 * the table.
 * 
 * In this app, the div's id can be derived from the input's id.
 * By convention, if the input's id is "someId", the associated div's
 * id must be "someId_list".
 * 
 * @param {HTMLElement} input - the input element where the search
 * string was entered
 * @returns The div element containing the table with the search
 * results, or null
 */
function getAssociatedSearchList (input)
{
    if (input == null || input.tagName != "INPUT" || input.id.length <= 0)
        return null;

    let divListId = input.id + "_list";
    return document.getElementById (divListId);
}


/**
 * Whenever the contents of the input element change, search the
 * airports[] array for airports whose names start with the input
 * contents, then show a list of the results.
 * 
 * @param {event} ev - An input event
 */
function handleAirportSearchInput (ev)
{
    //console.log (ev.target.value)

    // ev.target should be the affected input. Find its associated
    // search list (the div where the search results will be shown)

    let divList = getAssociatedSearchList (ev.target);
    if (divList == null || divList.tagName != "DIV")
        return;

    // Clear previous search results
    divList.replaceChildren();

    let searchString = ev.target.value;

    // Don't search if the search string is empty.
    // Otherwise search_airport() would return the whole list.
    if (searchString.length > 0)
    {
        let aSearchResults = search_airport (searchString);
        if (aSearchResults.length > 0)
            showAirportSearchResults (aSearchResults, divList);
    }
}


function handleAirportSearchInputKbd (ev)
{
    //console.log (ev);

    // ev.target should be the affected input. Find its associated
    // search list (the div where the search results will be shown)

    let input = ev.target;
    if (input == null || input.tagName != "INPUT")
        return;
    
    let divList = getAssociatedSearchList (input);
    if (divList == null || divList.tagName != "DIV")
        return;

    switch (ev.key)
    {
        case "ArrowDown":
        {
            // Move focus to the associated search list
            let table = divList.firstChild;
            if (table == null || table.tagName != "TABLE")
                return;

            let tr = table.firstChild;
            if (tr == null || tr.tagName != "TR")
                return;

            tr.firstChild.focus();
        }
        break;

        case "Escape":
        {
            // Clear input contents and clear search results
            divList.replaceChildren();
            input.value = null;
        }
        break;
    }
}


/**
 * Given a td of a search results table embedded in a div, find the
 * associated input used to enter search criteria.
 *
 * In this app, the input's id can be derived from the div's id. By
 * convention, if the input's id is "someId", the associated div's id
 * must be "someId_list".
 * 
 * @param {HTMLElement} td  - The td of the table containing the
 * accepted search result
 * @returns The input where the td's text should be copied
 */
function getAssociatedInput (td)
{

    let divList = td.parentElement.parentElement.parentElement;
    if (divList == null || divList.tagName != "DIV")
        return null;

    // Trim the "_list" from the div id and get the input id
    let divListId = divList.id;
    if (divListId == null || divListId.length <= 0 || !divListId.endsWith ("_list"))
        return null;

    let inputId = divListId.slice (0, -5);
    return document.getElementById (inputId);
}


/**
 * Handler for the click event in the search results table.
 * Copies the text of the clicked table cell into the input
 * where the search string was entered.
 * @param {event} ev - A click event in the search result table
 */
function handleAirportSearchListClick (ev)
{
    // ev.target should be the td element clicked in the search
    // results table. Copy its text into the associated input.
    var input = getAssociatedInput (ev.target);
    if (input == null)
        return;

    input.value = ev.target.innerText;

    // Then delete the list
    let divList = ev.target.parentElement.parentElement.parentElement;
    if (divList.tagName == "DIV")
        divList.replaceChildren();
}


/**
 * Handler for the mouseover event in the search results table.
 * Moves the focus to the td entered by the mouse.
 * 
 * The purpose is to synchronize the rows selected by keyboard and
 * by mouse.
 * 
 * Without this handler, a row could be selected by the
 * mouse and another by the keyboard handler (handleAirportSearchListKbd()).
 * Both would be highlighted by the :hover pseudo-class (see CSS) and the
 * keyboard focus. This could be confusing to the user.
 * 
 * Using this handler, mouse hovering in the list has the same effect as
 * keyboard navigation. There is always only one row selected and it has
 * focus. This makes the :hover pseudo-class rule redundant.
 * @param {event} ev - A mouseover event in the search result table
 * @returns 
 */
function handleAirportSearchListMouseOver (ev)
{
    // ev.target is either the table or a td within the table.
    // If a td, move focus there.
    //console.log (ev.target.tagName);

    if (ev.target.tagName == "TD")
        ev.target.focus();

    return;
}


/**
 * Handler for the keydown event in the search results table.
 * - Arrow keys navigate up and down within the table
 * - Arrow up from the top row moves back to the input
 * - Enter copies the text of the clicked table cell into the input
 * where the search string was entered.
 * @param {event} ev - A keydown event in the search result table
 */
function handleAirportSearchListKbd (ev)
{
    //console.log (ev);

    // ev.target should be a td element in the search results table.
    let tdSrc = ev.target;
    if (tdSrc == null || tdSrc.tagName != "TD")
        return;

    let trSrc = tdSrc.parentElement;
    if (trSrc == null || trSrc.tagName != "TR")
        return;

    let table = trSrc.parentElement;
    if (table == null || table.tagName != "TABLE")
        return;

    switch (ev.key)
    {
        case "ArrowDown":
        {
            // Move focus to next row down
            let trDest = trSrc.nextElementSibling;

            if (trDest == null || trDest.tagName != "TR")
            {
                // If no next row down, wrap around to top row
                trDest = table.firstElementChild;

                // No top row: this should never happen as a td
                // received an event.
                if (trDest == null || trDest.tagName != "TR")
                    return;
            }

            // Set focus to trDest.
            // Note that a tr cannot receive focus, only a td.
            // Search tables in this app have only one column,
            // so the first td in the row should do.
            trDest.firstChild.focus();
        }
        break;
    
        case "ArrowUp":
        {
            // Move focus to next row up
            let trDest = trSrc.previousElementSibling;
            if (trDest != null && trDest.tagName == "TR")
            {
                trDest.firstChild.focus();
                return;
            }

            // If no next row up, move back to the input
            let input = getAssociatedInput (tdSrc);
            if (input != null && input.tagName == "INPUT")
            {
                input.focus();
                return;
            }

            // If input not found, move to last row
            trDest = table.lastElementChild;
            if (trDest != null && trDest.tagName == "TR")
            {
                trDest.firstChild.focus();
                return;
            }
        }
        break;
        
        case "Enter":
        {
            // Copy tdSrc's text into the associated input.
            let input = getAssociatedInput (tdSrc);
            if (input != null && input.tagName == "INPUT")
            {
                input.value = tdSrc.innerText;
                input.focus();
            }

            // Then delete the list
            let divList = table.parentElement;
            if (divList != null && divList.tagName == "DIV")
                divList.replaceChildren();
        }
        break;
    }
}


/**
 * Installs a handler for the input event on an input control
 * 
 * @param {string} id - The input's id
 */
function installAirportSearchInputHandler (id)
{
    var input = document.querySelector (id);
    if (input == null || input.tagName != "INPUT")
        return;

    input.addEventListener ("input", handleAirportSearchInput);
    input.addEventListener ("keydown", handleAirportSearchInputKbd);
}


/**
 * Installs handlers for mouse events in a search results table:
 * - click
 * - mouseover
 * 
 * @param {string} id - The id of a div containing the table
 */
function installAirportSearchMouseHandler (id)
{
    // The handlers are installed on the div, but they are actually
    // intended to handle events in the search results table
    // embedded in the div.
    // The handlers are not installed on the table because the table
    // exists only temporarily, while search criteria are being entered
    // in the associated input.
    // By way of bubbling, table events can be handled in the div.
    var divList = document.querySelector (id);
    if (divList == null || divList.tagName != "DIV")
        return;

    divList.addEventListener ("click", handleAirportSearchListClick);
    divList.addEventListener ("mouseover", handleAirportSearchListMouseOver);
}


/**
 * Installs a handler for keyboard events on a search results table.
 * 
 * @param {string} id - The id of a div containing the table
 */
function installAirportSearchKbdHandler (id)
{
    // The handler is installed on the div, but it is actually
    // intended to handle events in the search results table
    // embedded in the div.
    // The handler is not installed on the table because the table
    // exists only temporarily, while search criteria are being entered
    // in the associated input.
    // By way of bubbling, table events can be handled in the div.
    var divList = document.querySelector (id);
    if (divList == null || divList.tagName != "DIV")
        return;

    divList.addEventListener ("keydown", handleAirportSearchListKbd);
}



function installAirportSearchEventHandlers()
{
    installAirportSearchInputHandler ("#departure_from");
    installAirportSearchInputHandler ("#departure_to");
    installAirportSearchInputHandler ("#arrival_from");
    installAirportSearchInputHandler ("#arrival_to");
    installAirportSearchMouseHandler ("#departure_from_list");
    installAirportSearchMouseHandler ("#departure_to_list");
    installAirportSearchMouseHandler ("#arrival_from_list");
    installAirportSearchMouseHandler ("#arrival_to_list");
    installAirportSearchKbdHandler ("#departure_from_list");
    installAirportSearchKbdHandler ("#departure_to_list");
    installAirportSearchKbdHandler ("#arrival_from_list");
    installAirportSearchKbdHandler ("#arrival_to_list");
}

