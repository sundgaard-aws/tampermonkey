// ==UserScript==
// @name         CRM Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://aws-crm.lightning.force.com/lightning/page/home
// @match        https://aws-crm.lightning.force.com/lightning/n/SA_Activities
// @icon         https://www.google.com/s2/favicons?domain=force.com
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';


    //updateAsana();
})();

function addVisualOverlay() {
     logInfo("Adding visual overlay...");
    // Create Tampermonkey Overlay DIV for OWA
    // <div class="_n_n ms-bg-color-themePrimary" style="height: 30px;"></div>
    //$(".conductorContent").append("<div style=\"height: 60px;\" class=\"owaOverlay\">OWA Overlay</div>");
    $("body").append("<div class=\"tmCRMOverlay\">CRM Overlay</div>");
    var overlay = $(".tmCRMOverlay");
    $(overlay).attr("style", "height: 10rem; width: 95%; position: absolute; top: 1.5rem; background-color: #4f4f4f; z-index: 10000; color: #05ff47; border: solid 2px #05ff47; font-size:0.8rem; left: 2.5%");
    $(overlay).append("<button class=\"tmFillCreateDialogBtn\">");
    $(overlay).append("<textarea class=\"tmCalendarInputData\">");
    $(overlay).append("<div class=\"tmCloseOverlay\">[X]</div>");

    var tmCloseOverlay = $(".tmCloseOverlay");
    $(tmCloseOverlay).attr("style", "position:absolute; top: 0rem; right: 0.2rem; cursor:pointer;");
    $(tmCloseOverlay).click(function() {$(overlay).hide()});

    var tmCalendarInputData = $(".tmCalendarInputData");
    $(tmCalendarInputData).attr("rows", "8");
    $(tmCalendarInputData).attr("style", "height: 8rem; width: 20rem");
    $(tmCalendarInputData).val("Danske Bank A/S#AP#DUMMY#2021-01-31#0.5\n"); // TEMP

    var tmFillCreateDialogBtn = $(".tmFillCreateDialogBtn");
    $(tmFillCreateDialogBtn).attr("style", "height: 2rem; width: 6em");
    $(tmFillCreateDialogBtn).html("Start");
    $(tmFillCreateDialogBtn).click(function() {console.clear(); openCreateItemDialog();});
    logInfo("Adding visual overlay done.");
};

function openCreateItemDialog() {
    //$("div.flexipageComponent[data-component-id=BTSEditTask]").find("button").click();
    var lines = $(".tmCalendarInputData").val().split('\n');
    if(lines && lines.length>0) {
        //for(var i=0;i<lines.length;i++) {
        var prefix = "SF#"; // Define in UI
        var nextItem = lines[0].substring(prefix.length); // Strip prefix if any
        var itemTokens = nextItem.split("#");
        if(itemTokens.length<5) return; // Fail safe
        var account = itemTokens[0].trim();
        var activityAcronym = itemTokens[1].trim();
        var activity = "Account Planning [Management]";
        if(activityAcronym == "MOH") activity = "Meeting / Office Hours [Management]";
        else if(activityAcronym == "AP") activity = "Account Planning [Management]";
        else if(activityAcronym == "AR") activity = "Architecture Review [Architecture]";
        else if(activityAcronym == "PE") activity = "Partner enablement/support [Management]";
        var subject = itemTokens[2].trim();
        var date = itemTokens[3].trim();
        var timeSpent = itemTokens[4].trim();
        logInfo("Processing item {"+nextItem+"}");
        //$("#input-122").val(nextItem); // Update Subject Field
        /*dialogInputItems = $(".oneUtilityBarPanel").find("input").each(function() { // Somehow direct ID query not working
    //for(var i=0;i<dialogInputItems.length;i++) {
        if($(this).attr("id") == "input-112") $(this).val(account); // Account
        if($(this).attr("id") == "input-122") $(this).val(nextItem); // Subject
    });*/
        //}
        //printDialogInputs();

        logInfo("Setting account field"); setTimeout(function(){ $(".oneUtilityBarPanel").find("input:nth(1)").val(account);}, 500); // Account

        // SET DATE
        //logInfo("Setting date field"); setTimeout(function(){ $(".oneUtilityBarPanel").find("input:nth(2)").val(date); }, 1000); // Date
        setTimeout(function(){
        $(".oneUtilityBarPanel").find("input:nth(2)").focus().click();
        }, 3500);
        setTimeout(function(){
        $(".oneUtilityBarPanel").find("td:nth(0)").attr("data-value", date); // Format "2020-01-31"
        $(".oneUtilityBarPanel").find("td:nth(0) span").click();
        }, 6000);



        logInfo("Setting subject field"); setTimeout(function(){ $(".oneUtilityBarPanel").find("input:nth(4)").focus().val(subject);}, 1500); // Subject
        logInfo("Setting role field"); setTimeout(function(){ $(".oneUtilityBarPanel").find("input:nth(5)").val("SA");}, 2000); // Role
        logInfo("Setting activity field"); setTimeout(function(){ $(".oneUtilityBarPanel").find("input:nth(6)").val(activity);}, 2500); // Activity
        logInfo("Setting time spent"); setTimeout(function(){ $(".oneUtilityBarPanel").find("input:nth(8)").focus().val(timeSpent);}, 3000); // Time Spent
        logInfo("Clicking open selections"); setTimeout(function(){ $(".oneUtilityBarPanel").find("div").find(".slds-listbox__item").click();}, 6500); // Click all hovering items
        //setTimeout(function(){ $(".oneUtilityBarPanel").find("button:nth(5)").delay(7000).click();}, 2000); // Create button click

        // CLICK CREATE BUTTON
        logInfo("Clicking [Create] button"); setTimeout(function(){ clickButtonByHTML("Create");}, 7500); // Create button click
        //logInfo("Clicking create button"); setTimeout(function(){ $(".oneUtilityBarPanel").find("lightning-button:nth(4)").click();}, 7500); // Create button click

        // CLICK ADD MORE BUTTON
        logInfo("Clicking [Create New] button"); setTimeout(function(){ clickButtonByHTML("Create New");}, 11000); // Create button click
        //logInfo("Clicking add more button"); setTimeout(function(){ $(".oneUtilityBarPanel").find("button:nth(2)").click();}, 11000); // Create more click

        // UPDATE INPUT ITEMS
        logInfo("Deleting lines from textarea"); setTimeout(function(){ lines.splice(0,1); $(".tmCalendarInputData").val(lines.join('\n')); openCreateItemDialog(); }, 13000);

        /*for(var i = 0;i < lines.length;i++){
        //code here using lines[i] which will give you each line
    }*/
        //$(".oneUtilityBarPanel").find("");
    } else logInfo("No more items to process.");
}

function printDialogInputs() {
    $(".oneUtilityBarPanel").find("input").each(function(index) {
        logInfo("["+index+"]:"+$(this).attr("id")+"/"+this.labels[0].innerText);
    });
}

function getInputByLabel() {
    $(".oneUtilityBarPanel").find("button").each(function(index) {
        logInfo("["+index+"]:"+$(this).attr("id")+"/"+this.labels[0].innerText);
    });
}

function clickButtonByHTML(buttonHTML) {
    $(".oneUtilityBarPanel").find("button").each(function(index) {
        if($(this).html() == buttonHTML) { logInfo("Found button ["+ $(this).html()+"] with outer HTML like [" + $(this).prop("outerHTML")+"]"); $(this).click(); }
    });
}


function findCalendarItems() {
    logInfo("Finding calendar items...");
    //$("div.flexipageComponent[data-component-id=BTSEditTask]").click();
    /*$("._cb_c1").each(function(index) {
        logInfo($(this).html());
    });*/
    logInfo("Finding calendar done.");
};

function updateAsana() {
    var asanaURL = "https://app.asana.com/api/1.0/users/me";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", asanaURL, false ); // false for synchronous request
    xmlHttp.send( null );
    logInfo("response=" + xmlHttp.responseText);
};

function logInfo(msg) {
    console.log("[TAMPERMONKEY-INFO]:" + msg);
};

$(document).ready(function() {
    logInfo("Jquery ready.");
    logInfo("Running Tampermonkey script on top of CRM...");
    addVisualOverlay();
    //$("div.flexipageComponent[data-component-id=BTSEditTask]").click();
});