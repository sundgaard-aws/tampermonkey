// ==UserScript==
// @name         OWA overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Do cool stuff on top of Amazon OWA
// @author       You
// @match        https://ballard.amazon.com/owa/
// @match        https://ballard.amazon.com/owa/#path=/mail
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    logInfo("Running Tampermonkey script on top of Amazon OWA...");
    addVisualOverlay();
    //updateAsana();
})();

function addVisualOverlay() {
     logInfo("Adding visual overlay...");
    // Create Tampermonkey Overlay DIV for OWA
    // <div class="_n_n ms-bg-color-themePrimary" style="height: 30px;"></div>
    //$(".conductorContent").append("<div style=\"height: 60px;\" class=\"owaOverlay\">OWA Overlay</div>");
    $("body").append("<div class=\"tmOWAOverlay\"></div>");
    var overlay = $(".tmOWAOverlay");
    $(overlay).attr("style", "height: 10rem; width: 60%; position: absolute; top: 2.2rem; background-color: rgba(70,70,70,0.7); z-index: 10000; color: rgb(255,255,255); border: solid 2px rgb(70,70,70,0.8); font-size:0.8rem; right: 1%");
    $(overlay).append("<div class=\"tmOverlayContent\"></div>");
    $(overlay).append("<div class=\"tmOverlayTitle\">OWA Overlay</div>");
    $(overlay).append("<div class=\"tmCloseButton\">[X]</div>");
    $(overlay).append("<input type=\"text\" class=\"tmPickupToken\">");
    var tmOverlayTitle = $(".tmOverlayTitle");
    $(tmOverlayTitle).attr("style", "position:absolute; top:0.5rem; left:0.5rem; font-weight:bold; cursor:pointer;");
    $(".tmOverlayTitle").click(function() {toggleDisplayMode();});
    var tmCloseButton = $(".tmCloseButton");
    $(tmCloseButton).attr("style", "position:absolute; top:0.5rem; right:0.5rem; font-weight:bold; cursor:pointer;");
    $(tmCloseButton).click(function() {closeOverlay();});
    var tmOverlayContent = $(".tmOverlayContent");
    $(tmOverlayContent).append("<button class=\"tmFindCalendarItemsBtn\">");
    $(tmOverlayContent).append("<textarea class=\"tmCalendarOutputData\">");
    var tmCalendarOutputData = $(".tmCalendarOutputData");
    $(tmCalendarOutputData).attr("style", "height: 8rem; position:absolute; bottom:0.5rem; left:7.5rem; width: 42rem;");
    var findCalendarItemsBtn = $(".tmFindCalendarItemsBtn");
    $(findCalendarItemsBtn).attr("style", "height: 2rem; width: 6rem; position:absolute; bottom:0.5rem; left:0.5rem;");
    $(findCalendarItemsBtn).html("Export Items");
    $(findCalendarItemsBtn).click(function() {findCalendarItems($("._cb_c1"),0);});
    var tmPickupToken = $(".tmPickupToken");
    $(tmPickupToken).attr("style", "height: 1.7rem; width: 5.5rem; position:absolute; bottom:3.0rem; left:0.5rem;");
    $(tmPickupToken).attr("placeholder", "Pickup token");
    var pickupToken=$.cookie("pickupToken");
    if(pickupToken) $(tmPickupToken).val(pickupToken);
    if($(".peekPopup").length<=0) $(tmCalendarOutputData).attr("placeholder","Please click first calendar item before you begin");
    $(".bidi").closest("div").first().click(function() {
        setTimeout(function() { if($(".peekPopup").length>0) $(tmCalendarOutputData).attr("placeholder","Thanks. Ready to start."); }, 1000);
    });
    logInfo("Adding visual overlay done.");
};

function closeOverlay() {
    $(".tmOWAOverlay").hide();
}

function toggleDisplayMode() {
    var isCollapsed = $(".tmOWAOverlay").hasClass("collapsed");
    if(isCollapsed) { $(".tmOWAOverlay").height("10rem"); $(".tmOWAOverlay").removeClass("collapsed"); $(".tmOverlayContent").show(); }
    else { $(".tmOWAOverlay").addClass("collapsed"); $(".tmOWAOverlay").height("2.2rem"); $(".tmOverlayContent").hide(); }
}

function findCalendarItems(calendarItems, currentIndex) {
    logInfo("Finding calendar items...");
    var pickupToken = $(".tmPickupToken");
    if(!pickupToken||pickupToken.val().length<=0) pickupToken="SF#";
    if(pickupToken) $.cookie("pickupToken", pickupToken.val(), { expires: 100 });
    if(currentIndex>=calendarItems.length) return;

    setTimeout(function() {
        var calendarItemTitle = calendarItems[currentIndex].getInnerHTML();
        $("._cb_c1:nth("+currentIndex+")").closest("div._ce_71").focus().click();
        setTimeout(function() {
            try {
                var rawDate = $(".peekPopup").find("._ck_o").html(); // Sample date Tue 8/10/2021 9:00 AM-9:30 AM
                rawDate = rawDate.replaceAll(" AM","_AM").replaceAll(" PM", "_PM");
                rawDate = rawDate.substring(4);
                var dateParts = rawDate.split(" ");
                var timeParts = dateParts[1].replaceAll("_AM", " AM").replaceAll("_PM", " PM").split("-");
                var fromDate = new Date(dateParts[0]+" "+timeParts[0]);
                var toDate = new Date(dateParts[0]+" "+timeParts[1]);
                var timeSpent = Math.abs(fromDate-toDate)/1000/3600;
                //var targetDate = fromDate.format("MMM dd, yyyy"); // Target date format Jul 5, 2021
                var targetDate = fromDate.format("yyyy-MM-dd"); // Target date format 2021-01-31
                logInfo(calendarItemTitle+"#"+targetDate+"#"+timeSpent);
                if(calendarItemTitle && calendarItemTitle.startsWith(pickupToken.val())) $(".tmCalendarOutputData").append(calendarItemTitle+"#"+targetDate+"#"+timeSpent+"\n");
                findCalendarItems(calendarItems, ++currentIndex);
            }
            catch(ex) { findCalendarItems(calendarItems, currentIndex); } // try again with the same index
        }, 2300);
    }, 1500);

    //window.open("https://aws-crm.lightning.force.com/lightning/popout/utility?0.windowed=true", "_blank");

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