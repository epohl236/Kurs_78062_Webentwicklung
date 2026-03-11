/**
 * @file Implements the airport search feature in Fallbeispiel.html
 * 
 * Load airport_data.js before this file.
 */


/**
 * Create a list of search results as a table
 * 
 * @param {array} aAirports - Array of search results as returned
 * by the search_airport() function (airpoprt_data.js).
 * Element[1] must be an airport's name, element[4] the IATA code.
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
        newCell.innerText = `${aAirport[1]} (${aAirport[4]})`
        // "London Heathrow Airport (LHR)"
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
    //console.log ("getAssociatedInput() inputId:", inputId);
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
    //console.log (ev);

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
}


/**
 * Installs a handler for the click event on a search results table
 * 
 * @param {string} id - The id of a div containing the table
 */
function installAirportSearchClickHandler (id)
{
    // The handler is installed on the div, but it is actually
    // intended to handle clicks in the search results table
    // embedded in the div.
    // The handler is not installed on the table because the table
    // exists only temporarily, while search criteria are being entered
    // in the associated input.
    // By way of bubbling, table events can be handled in the div.
    var divList = document.querySelector (id);
    if (divList == null || divList.tagName != "DIV")
        return;

    divList.addEventListener ("click", handleAirportSearchListClick);
}



function installAirportSearchEventHandlers()
{
    installAirportSearchInputHandler ("#departure_from");
    installAirportSearchInputHandler ("#departure_to");
    installAirportSearchInputHandler ("#arrival_from");
    installAirportSearchInputHandler ("#arrival_to");
    installAirportSearchClickHandler ("#departure_from_list");
    installAirportSearchClickHandler ("#departure_to_list");
    installAirportSearchClickHandler ("#arrival_from_list");
    installAirportSearchClickHandler ("#arrival_to_list");
}

