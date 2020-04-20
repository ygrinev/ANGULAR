var $ = require("jquery");
var moment = require("moment");

window.jQuery = window.$ = $;
require("jquery.cookie/jquery.cookie.js");
require("./jquery-ui.js");
$.fn.datetimepicker = require("eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js");

var ResponsiveBootstrapToolkit = require("responsive-toolkit");
var Modernizr = require("./modernizr.js");

/*//////////////////////////////////////////////////////////////////////////////////
// GLOBAL Scoped Declarations & Events
//////////////////////////////////////////////////////////////////////////////////*/
var currentViewPort = "lg";
window.currentViewPort = currentViewPort;

var Lang = "en";

if ($.cookie("culture")) {
    Lang = $.cookie("culture").substr(0,2);
}

window.Lang = Lang;
$("html").attr("lang", Lang);

module.exports = function() {

    var updateGateway = function(gateway, gatewayCode, reloadPage) {
        var reloadPage = typeof reloadPage !== "undefined" ? reloadPage : true;
        $.cookie("SunwingGateway", gatewayCode, {
          expires: 30,
          path: "/"
        });
      
        var url = $(location).attr("href");
      
        if (url.indexOf("from") !== -1 && reloadPage) {
          // Do nothing here now
          location.href =
            url.substring(0, url.indexOf("from")) +
            "from-" +
            gateway.replace(".", "");
        } else if (reloadPage) {
          location.reload();
        }
      };
      
      // Cookie Gateway Detection for PCI compliance
      // Cookies are now set via JS below
      if (typeof $.cookie === "function") {
        if (
          typeof $.cookie("SunwingGateway") === "undefined" && window.location.origin.indexOf("localhost") < 0
        ) {
          if (
            document.getElementsByTagName("html")[0].getAttribute("lang") === "fr"
          ) {
            updateGateway("montreal", "YUL", false);
          } else {
            updateGateway("toronto", "YYZ", false);
          }
        }
      }
      
      // IIFE Closure
      (function($, viewport, app) {
        "use strict";
      
        $(document).ready(function() {
          /*//////////////////////////////////////////////////////////////////////////////////
          // GLOBAL: Constants, Events, and Functions
          //////////////////////////////////////////////////////////////////////////////////*/
      
          var scriptLoaded = false;
      
          // Page Variables
          var thisWindow = $(window);
          var browserDOMTarget = "html, body";
          var viewportObj = $(browserDOMTarget);
      
          // ViewPort Tracking
          var prevViewPort = "";
          var viewPortChange = false;
      
          var windowScrollTop = thisWindow.scrollTop(),
            windowScrollTopPrev = 0;
      
          // Search Box (Inline Tabbed Booking Engine)
          var searchBoxObj = $("#search-box");
          var searchBoxExists = searchBoxObj.length ? true : false;
          var defaultTab = $("html").data("page-template")
            ? $("html").data("page-template")
            : false;
      
          var searchBoxArray = ["packages", "flights", "hotels", "cruises", "cars"];
      
          // Flights autocomplete inputs
          var departureGatewayObj;
          var arrivalGatewayObj;
      
          // Cars autocomplete inputs
          var pickUpGatewayObj;
          var dropOffGatewayObj;
      
          // DatePicker Options
          var datePickerOptions;
      
          // Application Private Namespace
          var SWGApplication = {};
          
          app.SWGApplication = {
            dataModel: {
              language: "", // values: en, fr
              locale: "", // values: en-ca, fr-ca
              protocol: "",
              viewPortChange: "",
              dictionary: {
                closeModal: { en: "Close", fr: "Fermer" },
                closeToggle: { en: "Close", fr: "Fermer" },
                openToggle: { en: "Explore more", fr: "Explore plus" }
              }
            },
      
            dataView: {
              init: function() {
                /*//////////////////////////////////////////////////////////////////////////////////
                // Page Load Sequence 
                //////////////////////////////////////////////////////////////////////////////////*/
                app.SWGApplication.dataController.initSettings();
      
                // Load Non-AJAX modules
                app.SWGApplication.dataView.loadStaticSequence();
              },
      
              loadStaticSequence: function() {
                /*//////////////////////////////////////////////////////////////////////////////////
                // Load Static Body Content & Components
                //////////////////////////////////////////////////////////////////////////////////*/
      
                // Inline Search Box (Booking Engine)
                if (searchBoxExists)
                  app.SWGApplication.dataController.loadSearchBox();
      
      
                /*//////////////////////////////////////////////////////////////////////////////////
                // Load Global Events
                //////////////////////////////////////////////////////////////////////////////////*/
      
                loadWindowsEvents();
      
                /*//////////////////////////////////////////////////////////////////////////////////
              // Load Hacks
              //////////////////////////////////////////////////////////////////////////////////*/
      
                // jQuery UI Autocomplete Hacks
                if (!$.isEmptyObject($.ui)) {
                  if (!$.isEmptyObject($.ui.autocomplete)) {
                    // Monkey Patch hack to make drop-downs responsive
                    $.ui.autocomplete.prototype._resizeMenu = function() {
                      var ul = this.menu.element;
                      ul.outerWidth(this.element.outerWidth());
                      ul.offset().top =
                        this.element.offset().top + this.element.height();
                      ul.offset().left = this.element.offset().left;
                    };
                  }
                }
              }
            },
      
            dataController: {
              initSettings: function() {
                this.setLanguage();
                this.loadDatePickerOptions();
              },
      
              setLanguage: function() {
                var lang = $("html").attr("lang")
                  ? $("html")
                      .attr("lang")
                      .toLowerCase()
                  : "en";
                app.SWGApplication.dataModel.language = lang;
                app.SWGApplication.dataModel.locale = lang + "-ca";
              },
      
              loadDatePickerOptions: function() {
                /*/////////////////////////////////////////
                  // DateTimePicker Global Options
                  /////////////////////////////////////////*/
      
                datePickerOptions = {
                  format: "YYYY-MM-DD",
                  widgetPositioning: {
                    horizontal: "auto",
                    vertical: "bottom"
                  },
                  locale: app.SWGApplication.dataModel.locale,
                  ignoreReadonly: true
                };
      
                if (Modernizr.touch) {
                  datePickerOptions.showClose = true;
                }
      
                if (app.SWGApplication.dataModel.language === "fr") {
                  datePickerOptions.tooltips = {
                    today: "Aller à Aujourd’hui",
                    clear: "Effacer la sélection",
                    close: "Fermer le sélecteur",
                    selectMonth: "Sélectionner un mois",
                    prevMonth: "Mois précédent",
                    nextMonth: "Mois prochain",
                    selectYear: "Sélectionner une année",
                    prevYear: "Année précédente",
                    nextYear: "Année prochaine",
                    selectDecade: "Sélectionner une décennie",
                    prevDecade: "Décennie précédente",
                    nextDecade: "Prochaine décennie",
                    prevCentury: "Siècle précédent",
                    nextCentury: "Prochain siècle"
                  };
                }
              },
      
              loadSearchBox: function() {
                var searchBoxTabObj = searchBoxObj.find(".sb-tab-container .tab");
                var searchBoxContentObj = searchBoxObj.find(".sb-tab-contents form");
                var defaultTabIndex = $.inArray(defaultTab, searchBoxArray);
                var thisTab;
      
                var checkin = null;
                var checkout = null;
      
                var todaysDate = moment().format("YYYY-MM-DD");
                var checkinDate = moment()
                  .add(1, "days")
                  .format("YYYY-MM-DD");
                var checkoutDate = moment()
                  .add(8, "days")
                  .format("YYYY-MM-DD");
      
                var pickUpDate = null;
                var dropOffDate = null;
      
                function addTrigger(_checkin, _checkout, _days) {
                  var minDate;
      
                  if (_checkout && _checkin) {
                    $(_checkin).on("dp.change", function(e) {
                      minDate = e.date;
      
                      $(_checkout)
                        .data("DateTimePicker")
                        .minDate(minDate);
      
                      if (
                        $(_checkin)
                          .data("DateTimePicker")
                          .date() >
                        $(_checkout)
                          .data("DateTimePicker")
                          .date()
                      ) {
                        $(_checkout)
                          .data("DateTimePicker")
                          .date(
                            moment(
                              $(_checkin)
                                .data("DateTimePicker")
                                .date()
                                .add(_days, "days")
                                .format("L")
                            )
                          );
                      }
                    });
      
                    checkout = null;
                    checkin = null;
                  }
                }
      
                searchBoxTabObj.each(function(index, element) {
                  var initTabs = true;
      
                  $(element).on("click.searchBoxTab", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
      
                    // Query if URL is available
                    var href = $(this)
                      .attr("href")
                      .trim();
      
                    if (href.length > 1) {
                      window.open(href, "_blank");
                      return;
                    }
      
                    // Resume Displaying Content
                    thisTab = index;
                    var thisTabContent = searchBoxContentObj.eq(thisTab).get(0);
                    var searchBoxOptions;
                    var thisTabId = $(element).attr("id");
                    var thisId = thisTabId.substr(
                      thisTabId.lastIndexOf("-") + 1,
                      thisTabId.length
                    );
                    var group = $(element).data("group");
                    var bpTabId = $(element).data("bpid");
                    $(element).addClass("active");
                    $(thisTabContent)
                      .closest(".tab-content")
                      .removeClass("hideTab")
                      .addClass("showTab");
                    $(thisTabContent).addClass("active");
      
                    $(searchBoxContentObj).each(function(oIndex, oElement) {
                      if (oIndex !== thisTab) {
                        $(oElement).removeClass("active");
                        searchBoxTabObj.eq(oIndex).removeClass("active");
                        $(oElement)
                          .closest(".tab-content")
                          .addClass("hideTab")
                          .removeClass("showTab");
      
                        if (oIndex === 0 && group === "BP") {
                          $(oElement).addClass("active");
                          $("#content-packages")
                            .removeClass("hideTab")
                            .addClass("showTab");
                        }
                        if (typeof window.config !== "undefined")
                          if (
                            typeof window.config.BP_SWITCH_SINGLE_TAB !== "undefined"
                          )
                            window.config.BP_SWITCH_SINGLE_TAB(parseInt(bpTabId));
                      }
                    });
      
                    // initialize all JS events
                    if (initTabs) {
                      if (group !== "BP") loadSearchBoxContent(thisId);
                      initTabs = false;
                    }
      
                    function loadSearchBoxContent(_tabId) {
                      if (_tabId === "packages") {
                        var tomorrowsDate;
      
                        searchBoxOptions = $.extend({}, datePickerOptions);
                        tomorrowsDate = moment()
                          .add(1, "days")
                          .format("YYYY-MM-DD");
      
                        if (typeof userDate !== "undefined") {
                          if (userDate !== "") tomorrowsDate = userDate;
                        }
      
                        searchBoxOptions.defaultDate = tomorrowsDate;
                        searchBoxOptions.minDate = tomorrowsDate;
                        searchBoxOptions.maxDate = moment().add(365, "days");
      
                        thisTabContent = searchBoxContentObj.eq(thisTab);
      
                        // Initialize calendar instance
                        thisTabContent
                          .find(".calendar")
                          .datetimepicker(searchBoxOptions);
      
                        if (!Modernizr.touch) {
                          thisTabContent.find(".calendar").removeAttr("readonly");
                        }
      
                        thisTabContent.find(".calendar").on("click", function(e) {
                          e.preventDefault();
                          e.stopPropagation();
                        });
      
                        // Attach Children Drop-Down Interaction
                        thisTabContent
                          .find(".childage-wrapper")
                          .each(function(index, element) {
                            var thisChildAgeObj = $(element);
                            var totalChildren = $(element)
                              .find(".form-group")
                              .children().length;
      
                            var thisForm = "#search-box-form-" + _tabId;
                            var closeButton = $(thisForm + " .close");
                            var editButton = $(
                              thisForm + " ." + _tabId + "-children .edit"
                            );
                            var rowPaddingObj = $(thisForm + " .mrow4");
      
                            thisTabContent
                              .find("[name='nb_child']")
                              .on("change", function() {
                                if ($(this).val() > 0) {
                                  for (var i = 0; i < totalChildren; i++) {
                                    if (i < $(this).val()) {
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .removeClass("disabled");
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .find("select")
                                        .prop("disabled", false);
                                    } else {
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .addClass("disabled");
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .find("select")
                                        .val(0)
                                        .prop("disabled", true);
                                    }
                                  }
      
                                  thisChildAgeObj
                                    .closest(".mrow3")
                                    .removeClass("disabled")
                                    .removeClass("reset");
                                  editButton.removeClass("disabled");
                                  rowPaddingObj.addClass("show").removeClass("hide");
                                } else {
                                  thisChildAgeObj
                                    .find(".form-group")
                                    .find("select")
                                    .val(0)
                                    .prop("disabled", true);
                                  thisChildAgeObj
                                    .closest(".mrow3")
                                    .addClass("disabled")
                                    .addClass("reset");
                                  editButton.addClass("disabled");
                                  rowPaddingObj.addClass("hide").removeClass("show");
                                }
                              });
      
                            closeButton.on("click", function(e) {
                              e.preventDefault();
                              thisChildAgeObj.closest(".mrow3").addClass("disabled");
                            });
      
                            editButton.on("click", function(e) {
                              e.preventDefault();
                              thisChildAgeObj
                                .closest(".mrow3")
                                .removeClass("disabled");
                            });
                          });
                      } else if (_tabId === "flights") {
                        thisTabContent = searchBoxContentObj.eq(thisTab);
      
                        searchBoxOptions = $.extend({}, datePickerOptions);
                        tomorrowsDate = moment()
                          .add(1, "days")
                          .format("YYYY-MM-DD");
      
                        if (typeof userDate !== "undefined") {
                          if (userDate !== "") tomorrowsDate = userDate;
                        }
      
                        searchBoxOptions.defaultDate = tomorrowsDate;
                        searchBoxOptions.minDate = tomorrowsDate;
      
                        thisTabContent
                          .find(".calendar")
                          .each(function(index, element) {
                            checkin =
                              $(element)
                                .attr("class")
                                .indexOf("checkin") > -1
                                ? $(element)
                                : checkin;
                            checkout =
                              $(element)
                                .attr("class")
                                .indexOf("checkout") > -1
                                ? $(element)
                                : checkout;
      
                            tomorrowsDate = checkout ? checkoutDate : checkinDate;
      
                            if (checkin && checkout) {
                              searchBoxOptions.useCurrent = false;
                              searchBoxOptions.defaultDate = checkoutDate;
                              searchBoxOptions.maxDate = false;
                            } else if (checkin) {
                              searchBoxOptions.defaultDate = tomorrowsDate;
                              searchBoxOptions.maxDate = false;
                            }
      
                            // Initialize calendar instance
                            $(element).datetimepicker(searchBoxOptions);
      
                            addTrigger(checkin, checkout, 7);
      
                            if (!Modernizr.touch) {
                              $(element).removeAttr("readonly");
                            }
                          });
      
                        // Attach Children Drop-Down Interaction
                        thisTabContent
                          .find(".childage-wrapper")
                          .each(function(index, element) {
                            var thisChildAgeObj = $(element);
                            var totalChildren = $(element)
                              .find(".form-group")
                              .children().length;
      
                            var thisForm = "#search-box-form-" + _tabId;
                            var closeButton = $(thisForm + " .close");
                            var editButton = $(
                              thisForm + " ." + _tabId + "-children .edit"
                            );
                            var rowPaddingObj = $(thisForm + " .mrow4");
      
                            thisTabContent
                              .find("[name='nb_child']")
                              .on("change", function() {
                                if ($(this).val() > 0) {
                                  for (var i = 0; i < totalChildren; i++) {
                                    if (i < $(this).val()) {
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .removeClass("disabled");
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .find("select")
                                        .prop("disabled", false);
                                    } else {
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .addClass("disabled");
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .find("select")
                                        .val(0)
                                        .prop("disabled", true);
                                    }
                                  }
      
                                  thisChildAgeObj
                                    .closest(".mrow3")
                                    .removeClass("disabled")
                                    .removeClass("reset");
                                  editButton.removeClass("disabled");
                                  rowPaddingObj.addClass("show").removeClass("hide");
                                } else {
                                  thisChildAgeObj
                                    .find(".form-group")
                                    .find("select")
                                    .val(0)
                                    .prop("disabled", true);
                                  thisChildAgeObj
                                    .closest(".mrow3")
                                    .addClass("disabled")
                                    .addClass("reset");
                                  editButton.addClass("disabled");
                                  rowPaddingObj.addClass("hide").removeClass("show");
                                }
                              });
      
                            closeButton.on("click", function(e) {
                              e.preventDefault();
                              thisChildAgeObj.closest(".mrow3").addClass("disabled");
                            });
      
                            editButton.on("click", function(e) {
                              e.preventDefault();
                              thisChildAgeObj
                                .closest(".mrow3")
                                .removeClass("disabled");
                            });
                          });
      
                        // Get default Departure value
                        departureGatewayObj = thisTabContent.find(
                          ".departure-gateway .right-inner-icon input"
                        );
                        var departureGatewayToggleObj = thisTabContent.find(
                          ".departure-gateway .right-inner-icon .fa"
                        );
      
                        if (departureGatewayObj.length > 0) {
                          var departureGatewayDefault = $.trim(
                            departureGatewayObj.val()
                          );
                          var departureGatewayValue = departureGatewayDefault;
                          var departureGatewayToggle = false;
                          var depGToggleFlag = false;
                          var depGateToggleInit = false;
      
                          departureGatewayObj.on(
                            "click focus blur keydown keyup",
                            function(e) {
                              e.stopPropagation();
      
                              if (e.type === "blur") {
                                if (!$(this).val()) {
                                  departureGatewayValue = $.trim($(this).val());
                                  departureGatewayDefault = departureGatewayValue
                                    ? departureGatewayValue
                                    : departureGatewayDefault;
      
                                  $(this).val(departureGatewayDefault);
      
                                  if (!depGToggleFlag) {
                                    toggleDepartureGateway(
                                      departureGatewayToggleObj,
                                      false
                                    );
                                  }
                                } else {
                                  toggleDepartureGateway(
                                    departureGatewayToggleObj,
                                    false
                                  );
                                }
                              } else if (e.type === "focus") {
                                departureGatewayDefault = $.trim($(this).val());
                                $(this).val("");
                                $(this).trigger("keydown", {
                                  keyCode: 8
                                });
      
                                toggleDepartureGateway(
                                  departureGatewayToggleObj,
                                  true
                                );
      
                                // deactivate arrival DD
                                arrGToggleFlag = false;
                                arrivalGatewayObj.trigger("blur");
                              } else if (e.type === "keyup") {
                                if (e.keyCode === 13) {
                                  departureGatewayObj.trigger("blur");
                                } else if (e.keyCode === 9) {
                                  toggleDepartureGateway(
                                    departureGatewayToggleObj,
                                    true
                                  );
                                }
                              }
                            }
                          );
      
                          departureGatewayToggleObj.on("click", function(e) {
                            e.stopPropagation();
      
                            if (e.type === "click") {
                              if (
                                departureGatewayToggle === true ||
                                !depGToggleFlag
                              ) {
                                departureGatewayObj.trigger("focus");
                                departureGatewayObj.trigger("keydown", {
                                  keyCode: 8
                                });
                                depGToggleFlag = true;
                              }
      
                              toggleArrow(
                                departureGatewayToggleObj,
                                departureGatewayToggle
                              );
                              departureGatewayToggle = !departureGatewayToggle;
                            }
                          });
      
                          var toggleDepartureGateway = function(
                            _toggleElement,
                            _toggleValue
                          ) {
                            departureGatewayToggle =
                              typeof _toggleValue !== "undefined"
                                ? _toggleValue
                                : !departureGatewayToggle;
                            toggleArrow(_toggleElement, _toggleValue);
                            depGToggleFlag = false;
                          };
                        }
      
                        // Get default Arrival value
                        arrivalGatewayObj = thisTabContent.find(
                          ".arrival-gateway .right-inner-icon input"
                        );
                        var arrivalGatewayToggleObj = thisTabContent.find(
                          ".arrival-gateway .right-inner-icon .fa"
                        );
      
                        if (arrivalGatewayObj.length > 0) {
                          var arrivalGatewayDefault = $.trim(arrivalGatewayObj.val());
                          var arrivalGatewayValue = arrivalGatewayDefault;
                          var arrivalGatewayToggle = false;
                          var arrGToggleFlag = false;
      
                          arrivalGatewayObj.on(
                            "click focus blur keydown keyup",
                            function(e) {
                              e.stopPropagation();
      
                              if (e.type === "blur") {
                                if (!$(this).val()) {
                                  arrivalGatewayValue = $.trim($(this).val());
                                  arrivalGatewayDefault = arrivalGatewayValue
                                    ? arrivalGatewayValue
                                    : arrivalGatewayDefault;
      
                                  $(this).val(arrivalGatewayDefault);
      
                                  if (!arrGToggleFlag) {
                                    toggleArrivalGateway(
                                      arrivalGatewayToggleObj,
                                      false
                                    );
                                  }
                                } else {
                                  toggleArrivalGateway(
                                    arrivalGatewayToggleObj,
                                    false
                                  );
                                }
                              } else if (e.type === "focus") {
                                arrivalGatewayDefault = $.trim($(this).val());
                                $(this).val("");
                                $(this).trigger("keydown", {
                                  keyCode: 8
                                });
      
                                toggleArrivalGateway(arrivalGatewayToggleObj, true);
      
                                // deactivate arrival DD
                                depGToggleFlag = false;
                                departureGatewayObj.trigger("blur");
                              } else if (e.type === "keyup") {
                                if (e.keyCode === 13) {
                                  arrivalGatewayObj.trigger("blur");
                                } else if (e.keyCode === 9) {
                                  toggleArrivalGateway(arrivalGatewayToggleObj, true);
                                }
                              }
                            }
                          );
      
                          var toggleArrivalGateway = function(
                            _toggleElement,
                            _toggleValue
                          ) {
                            arrivalGatewayToggle =
                              typeof _toggleValue !== "undefined"
                                ? _toggleValue
                                : !arrivalGatewayToggle;
                            toggleArrow(_toggleElement, _toggleValue);
                            arrGToggleFlag = false;
                          };
      
                          arrivalGatewayToggleObj.on("click", function(e) {
                            e.stopPropagation();
      
                            if (arrivalGatewayToggle === true || !arrGToggleFlag) {
                              arrivalGatewayObj.trigger("focus");
                              arrivalGatewayObj.trigger("keydown", {
                                keyCode: 8
                              });
                              arrGToggleFlag = true;
                            }
      
                            toggleArrow(
                              arrivalGatewayToggleObj,
                              arrivalGatewayToggle
                            );
                            arrivalGatewayToggle = !arrivalGatewayToggle;
                          });
                        }
      
                        if (
                          departureGatewayObj.length > 0 &&
                          arrivalGatewayObj.length > 0
                        ) {
                          // SHARED //
                          var resetFlightsDD = function(_toggleValue) {
                            departureGatewayObj.trigger("blur");
                            arrivalGatewayObj.trigger("blur");
                            toggleDepartureGateway(
                              departureGatewayToggleObj,
                              _toggleValue
                            );
                            toggleArrivalGateway(
                              arrivalGatewayToggleObj,
                              _toggleValue
                            );
                            depGateToggleInit = false;
                          };
      
                          var toggleArrow = function(_toggleObj, _toggleValue) {
                            if (_toggleValue === true) {
                              _toggleObj
                                .removeClass("fa-angle-down")
                                .addClass("fa-angle-up");
                            } else {
                              _toggleObj
                                .addClass("fa-angle-down")
                                .removeClass("fa-angle-up");
                            }
                          };
      
                          thisWindow.on("click", function() {
                            resetFlightsDD(false);
                          });
                        }
                      } else if (_tabId === "cruises") {
                        thisTabContent = searchBoxContentObj.eq(thisTab);
                        tomorrowsDate = moment()
                          .add(1, "days")
                          .format("YYYY-MM-DD");
      
                        var searchBoxOptionsMonth = $.extend({}, datePickerOptions);
                        searchBoxOptionsMonth.format = "MMMM YYYY";
                        searchBoxOptionsMonth.defaultDate = tomorrowsDate;
                        searchBoxOptionsMonth.minDate = tomorrowsDate;
                        searchBoxOptionsMonth.maxDate = moment().add(365, "days");
      
                        var searchBoxOptionsDate = $.extend({}, datePickerOptions);
                        searchBoxOptionsDate.format = "YYYY-MM-DD";
                        searchBoxOptionsDate.defaultDate = tomorrowsDate;
                        searchBoxOptionsDate.minDate = tomorrowsDate;
                        searchBoxOptionsDate.maxDate = moment().add(365, "days");
      
                        // Initialize calendar instance
                        thisTabContent
                          .find(".cruise-departure-month .calendar")
                          .datetimepicker(searchBoxOptionsMonth);
                        thisTabContent
                          .find(".cruise-departure-date .calendar")
                          .datetimepicker(searchBoxOptionsDate);
      
                        if (!Modernizr.touch) {
                          thisTabContent.find(".calendar").removeAttr("readonly");
                        }
      
                        thisTabContent
                          .find("#cruise-dep-month-toggle")
                          .on("click", function(e) {
                            $(this)
                              .closest(".input-group-wrapper")
                              .find(".calendar")
                              .prop("disabled", false);
                            $(this)
                              .closest(".input-group-wrapper")
                              .removeClass("disabled-form-input");
                            $(this)
                              .closest(".mrow2")
                              .find(".cruise-departure-date .calendar")
                              .prop("disabled", true);
                            $(this)
                              .closest(".mrow2")
                              .find(".cruise-departure-date")
                              .closest(".input-group-wrapper")
                              .addClass("disabled-form-input");
                          });
      
                        thisTabContent
                          .find("#cruise-dep-date-toggle")
                          .on("click", function(e) {
                            $(this)
                              .closest(".input-group-wrapper")
                              .find(".calendar")
                              .prop("disabled", false);
                            $(this)
                              .closest(".input-group-wrapper")
                              .removeClass("disabled-form-input");
                            $(this)
                              .closest(".mrow2")
                              .find(".cruise-departure-month .calendar")
                              .prop("disabled", true);
                            $(this)
                              .closest(".mrow2")
                              .find(".cruise-departure-month")
                              .closest(".input-group-wrapper")
                              .addClass("disabled-form-input");
                          });
      
                        // Retrieve active radio / calendar value
                        $("[name='cruise-dep-group']").each(function(index, element) {
                          if ($(element).prop("checked")) {
                            return $(element)
                              .closest(".input-group-wrapper")
                              .find(".calendar")
                              .val();
                          }
                        });
                      } else if (_tabId === "hotels") {
                        thisTabContent = searchBoxContentObj.eq(thisTab);
      
                        searchBoxOptions = $.extend({}, datePickerOptions);
                        tomorrowsDate = moment()
                          .add(1, "days")
                          .format("YYYY-MM-DD");
      
                        if (typeof userDate !== "undefined") {
                          if (userDate !== "") tomorrowsDate = userDate;
                        }
      
                        searchBoxOptions.defaultDate = tomorrowsDate;
                        searchBoxOptions.minDate = tomorrowsDate;
                        searchBoxOptions.maxDate = moment().add(365, "days");
      
                        thisTabContent
                          .find(".calendar")
                          .each(function(index, element) {
                            checkin =
                              $(element)
                                .attr("class")
                                .indexOf("checkin") > -1
                                ? $(element)
                                : checkin;
                            checkout =
                              $(element)
                                .attr("class")
                                .indexOf("checkout") > -1
                                ? $(element)
                                : checkout;
      
                            tomorrowsDate = checkout ? checkoutDate : checkinDate;
      
                            if (checkin && checkout) {
                              searchBoxOptions.useCurrent = false;
                              searchBoxOptions.defaultDate = checkoutDate;
                            } else if (checkin) {
                              searchBoxOptions.defaultDate = tomorrowsDate;
                            }
      
                            // Initialize calendar instance
                            $(element).datetimepicker(searchBoxOptions);
      
                            addTrigger(checkin, checkout, 7);
      
                            if (!Modernizr.touch) {
                              $(element).removeAttr("readonly");
                            }
                          });
      
                        // Attach Children Drop-Down Interaction
                        thisTabContent
                          .find(".childage-wrapper")
                          .each(function(index, element) {
                            var thisChildAgeObj = $(element);
                            var totalChildren = $(element)
                              .find(".form-group")
                              .children().length;
      
                            var thisForm = "#search-box-form-" + _tabId;
                            var closeButton = $(thisForm + " .close");
                            var editButton = $(
                              thisForm + " ." + _tabId + "-children .edit"
                            );
                            var rowPaddingObj = $(thisForm + " .mrow4");
      
                            thisTabContent
                              .find("[name='nb_child']")
                              .on("change", function() {
                                if ($(this).val() > 0) {
                                  for (var i = 0; i < totalChildren; i++) {
                                    if (i < $(this).val()) {
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .removeClass("disabled");
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .find("select")
                                        .prop("disabled", false);
                                    } else {
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .addClass("disabled");
                                      thisChildAgeObj
                                        .find(".form-group")
                                        .eq(i)
                                        .find("select")
                                        .val(0)
                                        .prop("disabled", true);
                                    }
                                  }
      
                                  thisChildAgeObj
                                    .closest(".mrow3")
                                    .removeClass("disabled")
                                    .removeClass("reset");
                                  editButton.removeClass("disabled");
                                  rowPaddingObj.addClass("show").removeClass("hide");
                                } else {
                                  thisChildAgeObj
                                    .find(".form-group")
                                    .find("select")
                                    .val(0)
                                    .prop("disabled", true);
                                  thisChildAgeObj
                                    .closest(".mrow3")
                                    .addClass("disabled")
                                    .addClass("reset");
                                  editButton.addClass("disabled");
                                  rowPaddingObj.addClass("hide").removeClass("show");
                                }
                              });
      
                            closeButton.on("click", function(e) {
                              e.preventDefault();
                              thisChildAgeObj.closest(".mrow3").addClass("disabled");
                            });
      
                            editButton.on("click", function(e) {
                              e.preventDefault();
                              thisChildAgeObj
                                .closest(".mrow3")
                                .removeClass("disabled");
                            });
                          });
                      } else if (_tabId === "cars") {
                        searchBoxOptions = $.extend({}, datePickerOptions);
      
                        thisTabContent = searchBoxContentObj.eq(thisTab);
      
                        searchBoxOptions.format = "YYYY-MM-DD";
                        searchBoxOptions.maxDate = moment().add(365, "days");
      
                        // Initialize calendar instance
                        thisTabContent
                          .find(".calendar")
                          .each(function(index, element) {
                            checkin =
                              $(element)
                                .attr("class")
                                .indexOf("pickup") > -1
                                ? $(element)
                                : checkin;
                            checkout =
                              $(element)
                                .attr("class")
                                .indexOf("dropoff") > -1
                                ? $(element)
                                : checkout;
      
                            if (checkin && checkout) {
                              searchBoxOptions.useCurrent = false;
                              searchBoxOptions.defaultDate = moment()
                                .add(2, "days")
                                .format("YYYY-MM-DD");
                            } else if (checkin) {
                              searchBoxOptions.minDate = moment().format(
                                "YYYY-MM-DD"
                              );
                              searchBoxOptions.defaultDate = moment()
                                .add(1, "days")
                                .format("YYYY-MM-DD");
                            }
      
                            // Initialize calendar instance
                            $(element).datetimepicker(searchBoxOptions);
      
                            addTrigger(checkin, checkout, 1);
      
                            if (!Modernizr.touch) {
                              $(element).removeAttr("readonly");
                            }
                          });
      
                        $(".car-pickup-date input, .car-dropoff-date input").on(
                          "click",
                          function(e) {
                            e.stopPropagation();
                          }
                        );
      
                        // Get default Departure value
                        pickUpGatewayObj = thisTabContent.find(
                          ".car-pickup-gateway .right-inner-icon input"
                        );
      
                        var pickUpGatewayToggleObj = thisTabContent.find(
                          ".car-pickup-gateway .right-inner-icon .fa"
                        );
                        var initCars = true;
      
                        if (pickUpGatewayObj.length > 0) {
                          var pickUpGatewayDefault = $.trim(pickUpGatewayObj.val());
                          var pickUpGatewayValue = pickUpGatewayDefault;
                          var pickUpGatewayToggle = false;
                          var pickUpGToggleFlag = false;
                          var pickUpGateToggleInit = false;
      
                          pickUpGatewayObj.on(
                            "click focus blur keydown keyup",
                            function(e) {
                              e.stopPropagation();
      
                              if ($(this).is(":visible")) {
                                if (e.type === "blur") {
                                  if (!$(this).val()) {
                                    pickUpGatewayValue = $.trim($(this).val());
                                    pickUpGatewayDefault = pickUpGatewayValue
                                      ? pickUpGatewayValue
                                      : pickUpGatewayDefault;
      
                                    $(this).val(pickUpGatewayDefault);
      
                                    if (!pickUpGToggleFlag) {
                                      togglePickUpGateway(
                                        pickUpGatewayToggleObj,
                                        false
                                      );
                                    }
                                  } else {
                                    togglePickUpGateway(
                                      pickUpGatewayToggleObj,
                                      false
                                    );
                                  }
      
                                  // Show errors when class is added in initGatewayloaded
                                  if ($(".error-messages.cars").hasClass("show")) {
                                    // Removed seems to fix blur issue on inputs
                                    //initCars = true;
                                  }
      
                                  // Adds same as pick up default value
                                  if (
                                    $.trim(dropOffGatewayObj.val()).length <= 0 &&
                                    initCars
                                  ) {
                                    dropOffGatewayObj.trigger("focus");
                                    dropOffGatewayObj
                                      .closest(".form-group")
                                      .find(".ui-autocomplete")
                                      .children()
                                      .eq(0)
                                      .trigger("click");
                                    dropOffGatewayObj.trigger("blur");
                                    initCars = false;
                                  }
                                } else if (e.type === "focus") {
                                  pickUpGatewayDefault = $.trim($(this).val());
                                  $(this).val("");
                                  $(this).trigger("keydown", {
                                    keyCode: 8
                                  });
      
                                  togglePickUpGateway(pickUpGatewayToggleObj, true);
      
                                  // deactivate arrival DD
                                  dropOffGToggleFlag = false;
                                  dropOffGatewayObj.trigger("blur");
                                } else if (e.type === "keyup") {
                                  if (e.keyCode === 13) {
                                    pickUpGatewayObj.trigger("blur");
                                  } else if (e.keyCode === 9) {
                                    togglePickUpGateway(pickUpGatewayToggleObj, true);
                                  }
                                }
                              }
                            }
                          );
      
                          pickUpGatewayToggleObj.on("click", function(e) {
                            e.stopPropagation();
      
                            if ($(this).is(":visible")) {
                              if (e.type === "click") {
                                if (
                                  pickUpGatewayToggle === true ||
                                  !pickUpGToggleFlag
                                ) {
                                  pickUpGatewayObj.trigger("focus");
                                  pickUpGatewayObj.trigger("keydown", {
                                    keyCode: 8
                                  });
      
                                  pickUpGToggleFlag = true;
                                }
      
                                toggleArrow(
                                  pickUpGatewayToggleObj,
                                  pickUpGatewayToggle
                                );
                                pickUpGatewayToggle = !pickUpGatewayToggle;
                              }
                            }
                          });
      
                          var togglePickUpGateway = function(
                            _toggleElement,
                            _toggleValue
                          ) {
                            pickUpGatewayToggle =
                              typeof _toggleValue !== "undefined"
                                ? _toggleValue
                                : !pickUpGatewayToggle;
                            toggleArrow(_toggleElement, _toggleValue);
                            pickUpGToggleFlag = false;
                          };
                        }
      
                        // Get default Arrival value
                        dropOffGatewayObj = thisTabContent.find(
                          ".car-dropoff-gateway .right-inner-icon input"
                        );
                        var dropOffGatewayToggleObj = thisTabContent.find(
                          ".car-dropoff-gateway .right-inner-icon .fa"
                        );
      
                        $("#car-dropoff-gateway").val("");
      
                        if (dropOffGatewayObj.length > 0) {
                          var dropOffGatewayDefault = $.trim(dropOffGatewayObj.val());
                          var dropOffGatewayValue = dropOffGatewayDefault;
                          var dropOffGatewayToggle = false;
                          var dropOffGToggleFlag = false;
      
                          dropOffGatewayObj.on(
                            "click focus blur keydown keyup",
                            function(e) {
                              e.stopPropagation();
      
                              if ($(this).is(":visible")) {
                                if (e.type === "blur") {
                                  if (!$(this).val()) {
                                    dropOffGatewayValue = $.trim($(this).val());
                                    dropOffGatewayDefault = dropOffGatewayValue
                                      ? dropOffGatewayValue
                                      : dropOffGatewayDefault;
      
                                    $(this).val(dropOffGatewayDefault);
      
                                    if (!dropOffGToggleFlag) {
                                      toggleDropOffGateway(
                                        dropOffGatewayToggleObj,
                                        false
                                      );
                                    }
                                  } else {
                                    toggleDropOffGateway(
                                      dropOffGatewayToggleObj,
                                      false
                                    );
                                  }
                                } else if (e.type === "focus" && !initCars) {
                                  dropOffGatewayDefault = $.trim($(this).val());
                                  $(this).val("");
                                  $(this).trigger("keydown", {
                                    keyCode: 8
                                  });
      
                                  toggleDropOffGateway(dropOffGatewayToggleObj, true);
      
                                  // deactivate arrival DD
                                  pickUpGToggleFlag = false;
                                  pickUpGatewayObj.trigger("blur");
                                } else if (e.type === "keyup") {
                                  if (e.keyCode === 13) {
                                    dropOffGatewayObj.trigger("blur");
                                  } else if (e.keyCode === 9) {
                                    toggleDropOffGateway(
                                      dropOffGatewayToggleObj,
                                      true
                                    );
                                  }
                                }
                              }
                            }
                          );
      
                          var toggleDropOffGateway = function(
                            _toggleElement,
                            _toggleValue
                          ) {
                            dropOffGatewayToggle =
                              typeof _toggleValue !== "undefined"
                                ? _toggleValue
                                : !dropOffGatewayToggle;
                            toggleArrow(_toggleElement, _toggleValue);
                            dropOffGToggleFlag = false;
                          };
      
                          dropOffGatewayToggleObj.on("click", function(e) {
                            e.stopPropagation();
      
                            if (
                              dropOffGatewayToggle === true ||
                              !dropOffGToggleFlag
                            ) {
                              dropOffGatewayObj.trigger("focus");
                              dropOffGatewayObj.trigger("keydown", {
                                keyCode: 8
                              });
      
                              dropOffGToggleFlag = true;
                            }
      
                            toggleArrow(
                              dropOffGatewayToggleObj,
                              dropOffGatewayToggle
                            );
                            dropOffGatewayToggle = !dropOffGatewayToggle;
                          });
                        }
      
                        if (
                          pickUpGatewayObj.length > 0 &&
                          dropOffGatewayObj.length > 0
                        ) {
                          // SHARED //
                          var resetCarsDD = function(_toggleValue) {
                            pickUpGatewayObj.trigger("blur");
                            dropOffGatewayObj.trigger("blur");
                            togglePickUpGateway(pickUpGatewayToggleObj, _toggleValue);
                            toggleDropOffGateway(
                              dropOffGatewayToggleObj,
                              _toggleValue
                            );
                            pickUpGateToggleInit = false;
                          };
      
                          var toggleArrow = function(_toggleObj, _toggleValue) {
                            if (_toggleValue === true) {
                              _toggleObj
                                .removeClass("fa-angle-down")
                                .addClass("fa-angle-up");
                            } else {
                              _toggleObj
                                .addClass("fa-angle-down")
                                .removeClass("fa-angle-up");
                            }
                          };
      
                          thisWindow.on("click", function() {
                            resetCarsDD(false);
                          });
                        }
                      }
                    }
                  });
                });
      
                // Load the appropiate tab, by default
                if (defaultTabIndex >= 0) {
                  $(searchBoxTabObj.get(defaultTabIndex)).trigger("click");
      
                } else {
                  // Load first tab
                  $(searchBoxTabObj.get(0)).trigger("click");
                }
              }
            }
          };
      
          // Delay the loading of this script due to dependencies not loaded in time
          app.SWGApplication.dataView.init();
      
          /*//////////////////////////////////////////////////////////////////////////////////
          // GLOBAL: Window Events
          //////////////////////////////////////////////////////////////////////////////////*/
      
          function loadWindowsEvents() {
            scriptLoaded = true;
      
              /*//////////////////////////////////////////////////////////////////////////////////
              // EXECUTION INITIALIZATION: Window Events
              //////////////////////////////////////////////////////////////////////////////////*/
      
            thisWindow.on(
              "resize",
              throttle(function() {
                if (viewport.is("xs")) {
                  // mq < 768px (mobile)
                  currentViewPort = "xs";
                } else if (viewport.is("sm")) {
                  // mq < 992px (tablet)
                  currentViewPort = "sm";
                } else if (viewport.is("md")) {
                  // mq < 1200px (small desktop)
                  currentViewPort = "md";
                } else {
                  // mq = 1200px (large desktop)
                  currentViewPort = "lg";
                }
      
                window.currentViewPort = currentViewPort;
      
                // check when viewport changes
                if (prevViewPort !== currentViewPort) {
                  prevViewPort = currentViewPort;
                  viewPortChange = true;
                  app.SWGApplication.dataModel.viewPortChange = viewPortChange;
                  windowScrollTop = thisWindow.scrollTop();
                } else {
                  viewPortChange = false;
                  app.SWGApplication.dataModel.viewPortChange = viewPortChange;
                }
      
                thisWindow.trigger("scroll");
      
                // Update jQuery UI Dropdowns Autocomplete Instances
                if ($(".ui-autocomplete").is(":visible")) {
                  if (departureGatewayObj.is(":visible")) {
                    departureGatewayObj.autocomplete("search");
                  } else {
                    departureGatewayObj.autocomplete("close");
                  }
      
                  if (arrivalGatewayObj.is(":visible")) {
                    arrivalGatewayObj.autocomplete("search");
                  } else {
                    arrivalGatewayObj.autocomplete("close");
                  }
                }
              }, 250)
            );
      
            function throttle(fn, threshold, scope) {
              threshold || (threshold = 250);
              var last, deferTimer;
              return function() {
                var context = scope || this;
      
                var now = +new Date(),
                  args = arguments;
                if (last && now < last + threshold) {
                  // hold on to it
                  clearTimeout(deferTimer);
                  deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                  }, threshold + last - now);
                } else {
                  last = now;
                  fn.apply(context, args);
                }
              };
            }
      
            if (scriptLoaded) {
              // Load initial resize
              thisWindow.trigger("resize");
            }
          }
        });
      })(jQuery, ResponsiveBootstrapToolkit, window);
};