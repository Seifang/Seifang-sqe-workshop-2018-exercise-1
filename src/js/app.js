import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = createHtmlTable(parseCode(codeToParse));
        $('#parsedCode').html(parsedCode);
    });
});

function createHtmlTable(jsonArray){
    let tableOutput = '<table>';
    tableOutput += '<tr><td>' + 'Line' + '</td>' +
        '<td>' + 'Type' + '</td><td>' + 'Name' + '</td>' +
        '<td>' + 'Condition' + '</td>' + '<td>' + 'Value' + '</td></tr>';
    jsonArray.forEach(function(oneLineParse){
        tableOutput += '<tr><td>' + oneLineParse['line'] + '</td>' +
            '<td>' + oneLineParse['type'] + '</td><td>' + oneLineParse['name'] + '</td>' +
            '<td>' + oneLineParse['condition'] + '</td>' + '<td>' + oneLineParse['value'] + '</td></tr>';
    });
    tableOutput += '</table>';
    return tableOutput;
}
