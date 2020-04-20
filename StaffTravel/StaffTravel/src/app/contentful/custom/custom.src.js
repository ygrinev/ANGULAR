var customsrcObject = (function () {
    return {
        init: function () {
            // original strarts		


            /*//////////////////////////////////////////////////////////////////////////////////
            // GLOBAL Scoped Declarations & Events
            //////////////////////////////////////////////////////////////////////////////////*/

            currentViewPort = "lg";
            browser = {};
            signOut = {};

            updateGateway = function (gatewayCode) {
                "use strict";

                $.cookie("SunwingGateway", gatewayCode, {
                    expires: 30,
                    domain: ".sunwing.ca",
                    path: "/"
                });

                var url = $(location).attr("href");

                if (url.indexOf("promotion") !== -1) {

                    if (url.substring(url.length - 3, url.length - 4) === "/") {
                        url = url.substring(0, url.length - 4);
                    }

                    location.href = url + "/" + gatewayCode;

                } else {

                    location.reload();
                }
            };

            // IIFE Closure
            (function ($, viewport, app) {
                "use strict";

                $(document).ready(function () {

                    /*//////////////////////////////////////////////////////////////////////////////////
                    // GLOBAL: Constants, Events, and Functions
                    //////////////////////////////////////////////////////////////////////////////////*/

                    var scriptLoaded = false;

                    // Page Variables
                    var thisWindow = $(window);
                    var browserDOMTarget = navigator.userAgent.toLowerCase().indexOf("webkit") > -1 ? "body" : "html";
                    var viewportObj = $(browserDOMTarget);

                    // Header Search Box
                    var headerSearchBoxObj = $(".hotel-search > input.search");
                    var headerSearchBoxExists = (headerSearchBoxObj.length > 0) ? true : false;
                    var headerSearchBoxService = (typeof hotelServicesURL !== "undefined") ? hotelServicesURL : "";

                    // Hotel Page Template
                    var hotelURL = "/hotel/";

                    // Scroll Tracking
                    var windowScrollTop = thisWindow.scrollTop(), windowScrollTopPrev = 0;
                    var windowScrollHeight;
                    var moveDirection = null;

                    // Scroll to Top
                    var backToTopObj = $("#back-to-top");
                    var backToTopExists = (backToTopObj.length > 0) ? true : false;
                    var backToTopLoaded = false;
                    var backToTopToggleDirection = -1;
                    var backToTopInit = true;

                    // ViewPort Tracking
                    var prevViewPort = "";
                    var viewPortWidth = 0;
                    var viewPortChange = false;

                    // Error Tooltips
                    var errorToolTip = ".form-error-container .haspopover span.fa";

                    // URL Query Storage
                    var allURLVars = {
                        "queries": [],
                        "hash": ""
                    };

                    // Video Display
                    var displayVideo = true; // global toggle switch
                    var playVideo = false; // detected video player state
                    var videoPlayer, videoAccount, videoPlayList; // video player requirements

                    /*/////////////////////////////////////////
                    // Component Class Variables
                    /////////////////////////////////////////*/

                    // Primary Slider (bxSlider)
                    var sliderObj = $(".slider-container");
                    var sliderExists = ($.fn.bxSlider && sliderObj.length > 0) ? true : false;
                    var bxSliderPluginObj, slideShowObj;
                    var sliderPager = "bx-pager";
                    var sliderWrapperClass = "bx-wrapper";
                    var sliderContainerClass = "bx-container";
                    var sliderLoadedFlag = false;

                    // Primary Mobile Slider (bxSlider)
                    var mobileSliderObj = $(".slider-container .mobile-slider");
                    var mobileSliderExists = ($.fn.bxSlider && mobileSliderObj.length > 0 && !mobileSliderObj.hasClass("over-ride")) ? true : false;
                    var bxSliderMobilePluginObj, mobileSlideShowObj;
                    var mobileSliderPager = "mobile-bx-pager";
                    var mobileSliderWrapperClass = "bx-wrapper";
                    var mobileSliderContainerClass = "mobile-bx-container";
                    var mobileSliderLoadedFlag = false;
                    var mobileSliderRatio = (720 / 420).toFixed(2);

                    // Sign-up #1ToTheSun Promotion
                    var signUpNo1ToTheSunObj = $("#signup-no1-to-the-sun");
                    var signUpNo1ToTheSunExists = (signUpNo1ToTheSunObj.length > 0) ? true : false;
                    var slideState = false;
                    var slideVorH; // values: "horizontal" or "vertical"
                    var signUpInputFlag = false;

                    // Sticky Effect Init
                    var signUpFormToggleDirection = -1;
                    var signUpFormInit = true;
                    var signUpStickyOn = false; // default value for when the signUp sticky footer is activated

                    var searchBoxBottomPosition = 0;
                    var signUpNo1ToTheSunTopPosition = 0;

                    // Search Box (Inline Tabbed Booking Engine)
                    var searchBoxObj = $("#search-box");
                    var searchBoxExists = (searchBoxObj.length) ? true : false;
                    var defaultTab = ($("html").data("page-template")) ? $("html").data("page-template") : false;

                    var searchBoxArray = ["packages", "flights", "hotels", "cruises", "cars"];
                    var pageTemplate;

                    // Flights autocomplete inputs
                    var departureGatewayObj;
                    var arrivalGatewayObj;

                    // Cars autocomplete inputs
                    var pickUpGatewayObj;
                    var dropOffGatewayObj;

                    // DatePicker Options
                    var datePickerOptions;

                    // Ad Module 
                    var adModuleObj = $(".promo-module");
                    var adModuleExists = (adModuleObj.length > 0) ? true : false;
                    var adModuleDDObj = $(".promo-module .promo-module-tab-container > ul > li.dropdown");
                    var adModuleTabLimit = (adModuleTabLimit) ? parseInt(adModuleTabLimit, 10) : 4;

                    // Sunwing Mobile App Slider (bxSlider)
                    var mobileAppSliderObj = $("#swg-mobile-app .bxslider");
                    var mobileAppSliderExists = ($.fn.bxSlider && mobileAppSliderObj.length > 0) ? true : false;
                    var mobileAppSliderWrapperClass = "swg-app-bx-wrapper";
                    var mobileAppSlideShowObj;
                    var mobileAppSliderPager = "swg-app-bx-pager";
                    var mobileAppSliderPluginObj;

                    // LPC Search Box
                    var lpcSearchBoxObj = $("#lpc-search-box");
                    var lpcSearchBoxExists = (lpcSearchBoxObj.length) ? true : false;

                    var lpcSliderImgObj = $("#lpc-slider-carousel");
                    var lpcSliderImgObjExists = (lpcSliderImgObj.length) ? true : false;

                    // Multiple Slider Carousel (bxSlider)
                    var slideCarouselObj = $(".slider-carousel");
                    var slideCarouselExists = ($.fn.bxSlider && slideCarouselObj.length > 0) ? true : false;
                    var slideCarouselPluginObjArray = [];
                    var slideCarouselPrevButton = "carousel-bx-prev";
                    var slideCarouselNextButton = "carousel-bx-next";
                    var slideCarouselPager = "carousel-bx-pager";
                    var slideCarouselControlsClass = "carousel-bx-controls";
                    var slideCarouselLoadedFlag = false;
                    var slideCarouselMargin = 20;

                    // Tab Accordion Hybrid
                    var accordionTabObj = $(".accordion-tab-wrapper");
                    var accordionTabExists = (accordionTabObj.length) ? true : false;
                    var accordionTabArray = [];

                    // Thumbnail Gallery Slider
                    var thumbnailGallerySliderObj = $(".thumbnail-gallery-slider");
                    var thumbnailGallerySliderExists = ($.fn.bxSlider && thumbnailGallerySliderObj.length > 0) ? true : false;
                    var thumbnailGallerySliderPluginObj;

                    // Excursion Step 1 - Multi-Column Table
                    var multiColumnTableObj = $(".multi-column-table");
                    var multiColumnTableExists = (multiColumnTableObj.length > 0) ? true : false;
                    var htmlArray = {}, destinationMax = 0, countryTotal = 0;
                    var excursionStep1Data;
                    var tableScrollerObj = null;

                    // Excursion Step 2 - Filter Listing
                    var filterContentObj = $(".filter-content");
                    var filterTabMenuObj = $(".filter-tab-menu");
                    var filterWrapperObj = $(".filter-tab-wrapper");
                    var filterDDMenuObj = $(".filter-dd-menu");
                    var filterListObj = $(".filter-list");
                    var filterContentExists = (filterContentObj.length) ? true : false;

                    // Excursion Step 3
                    var excursionPageDataObj = $(".excursion-s3-data");
                    var excursionPageDataExists = (excursionPageDataObj.length) ? true : false;
                    var excursionGalleryObj = $(".thumbnail-gallery-slider");
                    var excursionGalleryExists = (excursionGalleryObj.length > 0 && thumbnailGallerySliderExists) ? true : false;
                    var exCodeURL = (typeof exCode !== "undefined") ? exCode : "";

                    // Destinations Step 1
                    var animateWallObj = $(".animate-wall");
                    var animateWallExists = (animateWallObj.length) ? true : false;

                    // Destination Step 1 & 2 Navigation
                    var scrollNavigationObj = $(".media-navigation-container .nav-wrapper");
                    var scrollNavigationExists = (scrollNavigationObj.length) ? true : false;
                    var scrollMoreObj = scrollNavigationObj.find(".more");
                    var scrollMoreNavigationObj = scrollNavigationObj.find(".more-navigation");

                    // Sticky Navigation
                    var scrollStickyNavigationObj = $(".sticky-navigation-anchor");
                    var scrollStickyNavigationExists = (scrollStickyNavigationObj.length) ? true : false;
                    var scrollStickyTabListObj = scrollStickyNavigationObj.find(".navigation");
                    var toggleScroll = false;
                    var horizontalMenuInstance;

                    var stickySideNavigationExists = scrollStickyNavigationObj.hasClass("side");

                    // Hotel Filter Application
                    var productGroupObj = $(".product-container-group");

                    // Destination Weather
                    var weatherCalendarObj = $(".weather-calendar");
                    var weatherCalendarExists = (weatherCalendarObj.length > 0) ? true : false;
                    var weatherCalendarControlsObj = weatherCalendarObj.find(".weather-controls");

                    // Things to do 
                    var horizontalTabMenuInstance;

                    var destinationTabRequirement = {
                        "tours-excursions": {
                            "serviceAPI": "excursionsCountryDestination",
                            "country": "",
                            "destination": "",
                            "callback": "appendExcursionData",
                            //"itemInterval": 0,
                            "itemCounter": 0,
                            "itemLimit": 6,
                            "moreCTA": false
                        },
                        "golf": {
                            "serviceAPI": "destinationGolfInfo",
                            "code": "",
                            "callback": "appendGolfData",
                            "itemInterval": 6,
                            "itemCounter": 0,
                            "itemLimit": null,
                            "moreCTA": true
                        },
                        "spas": {
                            "serviceAPI": "destinationSpaInfo",
                            "code": "",
                            "callback": "appendSpaData",
                            "itemInterval": 9,
                            "itemCounter": 0,
                            "itemLimit": null,
                            "moreCTA": true
                        },
                        "casinos": {
                            "serviceAPI": "destinationCasinoInfo",
                            "code": "",
                            "callback": "appendCasinoData",
                            "itemInterval": 6,
                            "itemCounter": 0,
                            "itemLimit": null,
                            "moreCTA": true
                        }
                    };

                    // Load internal page anchor scrolling
                    var scrollIDObj = viewportObj.find("[data-scroll-id='true']");
                    var scrollIDsExist = (scrollIDObj.length > 0) ? true : false;

                    // Load scrolling tabs Sly plugin
                    var scrollingTabsObj = $(".scrolling-tabs");
                    var scrollingTabsExists = (scrollingTabsObj.length > 0) ? true : false;
                    var scrollingTabInstanceArray = [];

                    // Load single thumbnail in modal window
                    var modalThumbnailObj = $(".modal-thumbnail");
                    var modalThumbnailExists = (modalThumbnailObj.length > 0) ? true : false;
                    var modalWindowObj = $("#generic-modal");
                    var modalWindowExists = (modalWindowObj.length > 0) ? true : false;

                    // Generic Pop-over DOM element
                    var popOverObj = $(".popover-container");

                    // Pop-over DOM trigger element
                    var popOverTriggerObj = popOverObj.find(".popover-trigger");
                    var popOverTriggerExists = (popOverTriggerObj.length > 0) ? true : false;

                    // Vacation Finder Tab DOM element
                    var vacationFinderTabObj = $("#vacation-finder-tab");
                    var vacationFinderTabExists = (vacationFinderTabObj.length > 0) ? true : false;
                    var vacationFinderInit = false;
                    var vacationFinderDisplay = false;

                    // Homepage Feature Recommendations
                    var featureRecommendationsObj = $("#feature-recommendations.rules .recommendation-item");
                    var featureRecommendationsExists = (featureRecommendationsObj.length > 0) ? true : false;

                    // Rules Slider (bxSlider)
                    var featureRuleSliderObj = $("#feature-recommendations.rules .recommendation-item .rule-wrapper");
                    var featureRuleSliderExists = ($.fn.bxSlider && featureRuleSliderObj.length > 0) ? true : false;
                    var featureRuleSliderPager = "feature-rule-bx-pager";
                    var featureRuleSliderWrapperClass = "rule-wrapper";
                    var featureRuleSlideShowObj;
                    var featureRuleSliderPluginObj;
                    var featureRuleSliderInstanceArray = [], featureRuleSliderInstanceCounterArray = [];

                    // Application Private Namespace
                    var SWGApplication = {};

                    app.SWGApplication = {

                        dataModel: {
                            language: "", // values: en, fr
                            locale: "", // values: en-ca, fr-ca
                            template: "", // display types: homepage, promotionpage, hotelpage
                            brand: "", // value: sunwing
                            protocol: "",
                            query: [], // value: object properties: hash, queries
                            queryList: {
                                "queryArray": ["excursion-code", "excursion-dest"]
                            },
                            viewPortChange: "",
                            excursionStep3Array: [{
                                "shortDescription": [{
                                    "heading": "description",
                                    "domElement": "short-description"
                                }]
                            },
                            {
                                "longDescription": [{
                                    "heading": "description",
                                    "domElement": "long-description"
                                }]
                            },
                            {
                                "inclusions": [{
                                    "heading": "inclusions",
                                    "domElement": "inclusions"
                                }]
                            },
                            {
                                "duration": [{
                                    "heading": "duration",
                                    "domElement": "duration"
                                }]
                            },
                            {
                                "departureTimeAndLocation": [{
                                    "heading": "departure",
                                    "domElement": "departure"
                                }]
                            },
                            {
                                "dropOffTimeAndLocation": [{
                                    "heading": "drop-off",
                                    "domElement": "drop-off"
                                }]
                            },
                            {
                                "notes": [{
                                    "heading": "notes",
                                    "domElement": "notes"
                                }]
                            },
                            {
                                "frequency": [{
                                    "heading": "frequency",
                                    "domElement": "frequency"
                                }]
                            }],
                            galleryImages: [],
                            excursionFeatures: [],
                            urlConversionDictionary: {
                                // Punctuation Combination Chars
                                "\'": " ",
                                "\"": "_",
                                // Punctuation Single Chars
                                "‘": "_",
                                "’": "_",
                                "“": "_",
                                "”": "_",
                                ".": "_",
                                "&": "and",
                                "/": " ",
                                "?": "_",
                                "!": "_",
                                ":": " ",
                                ";": " ",
                                "(": "_",
                                ")": "_",
                                "[": "_",
                                "]": "_"
                            },
                            classConversionDictionary: {
                                // Letters
                                "â": "a", "à": "a", "á": "a",
                                "ç": "c",
                                "é": "e", "ê": "e", "è": "e", "ë": "e",
                                "î": "i", "ï": "i",
                                "ô": "o",
                                "û": "u", "ù": "u", "ü": "u",
                                // Punctuation Combination Chars
                                "\'": " ",
                                "\"": "_",
                                // Punctuation Single Chars
                                "‘": "_",
                                "’": "_",
                                "“": "_",
                                "”": "_",
                                ".": "_",
                                "&": "and",
                                "/": " ",
                                "?": "_",
                                "!": "_",
                                ":": " ",
                                ";": " ",
                                "(": "_",
                                ")": "_",
                                "[": "_",
                                "]": "_"
                            },
                            videoPlayer: {
                                "brightCove": {
                                    "playerID": "3769567102001",
                                    "playerKey": "AQ~~,AAACAjbl3IE~,5ak6eABhcgEpQCgEMoAmo0XJp4lI3ZUU",
                                    "playList": []
                                },
                                "brightCove-SSL": {
                                    "player": "H1KdEl4Hg",  // Bk7oo10zW
                                    "account": "2208534224001",
                                    "playList": []
                                },

                            },
                            templateList: ["/attractions", "/cars", "/cruises", "/destinations", "/error", "/excursions", "/grouptravel", "/hotel", "/hoteldesc", "/lowestpricecalendar", "/promotions", "/search"]

                        },

                        dataView: {
                            init: function () {

                                /*//////////////////////////////////////////////////////////////////////////////////
                                // Page Load Sequence 
                                //////////////////////////////////////////////////////////////////////////////////*/

                                app.SWGApplication.dataController.initSettings();
                                app.SWGApplication.dataController.loadHeaderScripts();

                                // Load Non-AJAX modules
                                app.SWGApplication.dataView.loadStaticSequence();

                            },

                            loadStaticSequence: function () {

                                /*//////////////////////////////////////////////////////////////////////////////////
                                // Load Static Body Content & Components
                                //////////////////////////////////////////////////////////////////////////////////*/

                                // Inline Search Box (Booking Engine)
                                if (searchBoxExists) app.SWGApplication.dataController.loadSearchBox();

                                // Lowest Price Calendar Search Box (Booking Engine)
                                if (lpcSearchBoxExists) app.SWGApplication.dataController.loadLPCSearchBox();

                                // Lowest Price Calendar Carousel Slider
                                if (lpcSliderImgObjExists) app.SWGApplication.dataController.loadLPCSliderImg();

                                // Promotion Ad Module
                                if (adModuleExists) app.SWGApplication.dataController.loadAdModule();

                                // Sunwing Mobile App bxSlider Plugin
                                if (mobileAppSliderExists) app.SWGApplication.dataController.loadSWGMobileAppSlider();

                                // Back to top
                                if (backToTopExists) app.SWGApplication.dataController.loadBackToTop();

                                // Load all Thumbnails in the generic modal window
                                if (modalThumbnailExists && modalWindowExists) app.SWGApplication.dataController.loadModalThumbnail();

                                if (popOverTriggerExists) app.SWGApplication.dataController.loadModalPopOver();

                                // Scan DOM for scrollable navigation
                                if (scrollIDsExist) app.SWGApplication.dataView.displayScrollNavigation();

                                /*//////////////////////////////////////////////////////////////////////////////////
                                // Load Global Events
                                //////////////////////////////////////////////////////////////////////////////////*/

                                loadWindowsEvents();

                                /*//////////////////////////////////////////////////////////////////////////////////
                                // Load Body Content Requiring Global Events 
                                //////////////////////////////////////////////////////////////////////////////////*/

                                // Sign Up Form: #1 to the Sun
                                if (signUpNo1ToTheSunExists) {

                                    if (currentViewPort !== "xs" && currentViewPort !== "sm") {
                                        setTimeout(function () {
                                            app.SWGApplication.dataController.loadSignUpNo1ToTheSun();
                                        }, 2000);
                                    } else {
                                        app.SWGApplication.dataController.loadSignUpNo1ToTheSun();
                                    }

                                }

                                /*//////////////////////////////////////////////////////////////////////////////////
                                // Load Hacks
                                //////////////////////////////////////////////////////////////////////////////////*/

                                // jQuery UI Autocomplete Hacks
                                if (!$.isEmptyObject($.ui)) {
                                    if (!$.isEmptyObject($.ui.autocomplete)) {

                                        // Monkey Patch hack to make drop-downs responsive
                                        $.ui.autocomplete.prototype._resizeMenu = function () {
                                            var ul = this.menu.element;
                                            ul.outerWidth(this.element.outerWidth());
                                            ul.offset().top = this.element.offset().top + this.element.height();
                                            ul.offset().left = this.element.offset().left;
                                        };
                                    }
                                }

                            },

                            displayPrimarySlider: function () {
                                // Primary Slider bxSlider Plugin
                                if (sliderExists) app.SWGApplication.dataController.loadPrimarySlider();
                                if (mobileSliderExists && (currentViewPort === "xs")) app.SWGApplication.dataController.loadMobileSlider();
                            },

                            displayCarouselSlider: function () {
                                // Carousel Slider
                                if (slideCarouselExists) app.SWGApplication.dataController.loadCarouselSlider();
                            },

                            displayAccordionTabs: function () {
                                // Tab Accordion
                                if (accordionTabExists) {
                                    app.SWGApplication.dataController.loadAccordionTab();
                                    app.SWGApplication.dataController.reloadAccordionTab();
                                }
                            },

                            displayScrollNavigation: function () {
                                // In-page Navigation Scrolling
                                if (scrollNavigationExists || scrollStickyNavigationExists || scrollIDsExist) app.SWGApplication.dataController.loadScrollableNavigation();
                            },

                            displayExcursionStep1Content: function () {
                                // Load Excursion Step 1 Destination List
                                if (multiColumnTableExists && app.SWGApplication.dataModel.template === "excursions") app.SWGApplication.dataController.loadExcursionStep1Content();
                            },

                            displayExcursionStep2Content: function () {
                                // Load Excursion Step 2 Content
                                if (multiColumnTableExists && app.SWGApplication.dataModel.template === "excursions" && filterContentExists) app.SWGApplication.dataController.loadExcursionStep2Content();
                            },

                            displayExcursionStep3Content: function () {
                                // Load Excursion Step 3 Content
                                if ((excursionGalleryExists || excursionPageDataExists) && app.SWGApplication.dataModel.template === "excursions") app.SWGApplication.dataController.loadExcursionStep3Content();
                            },

                            displayDestinationStep1Content: function () {
                                // Freewall Animate Container
                                if (app.SWGApplication.dataModel.template === "destinations") app.SWGApplication.dataController.loadDestinationsStep1();
                            },

                            displayDestinationStep2Content: function () {
                                if (app.SWGApplication.dataModel.template === "destinations") app.SWGApplication.dataController.loadDestinationsStep2();
                            },

                            displayThumbnailGallery: function (_element, _controls) {
                                // Thumbnail Gallery Slider
                                if (thumbnailGallerySliderExists) app.SWGApplication.dataController.loadThumbnailGallery(_element, _controls);
                            },

                            displayAccordionPanels: function (_id) {
                                // Load all Bootstrap Accordion Panels (Outer & Inner Customized)
                                if ($(_id).length > 0) app.SWGApplication.dataController.loadAccordionPanels(_id);
                            },

                            displayScrollingTabs: function () {
                                // Load all Sly plugin tabs
                                if (scrollingTabsExists) app.SWGApplication.dataController.loadScrollingTabs();
                            },

                            displayItinerary: function (_code) {
                                // Display one tab
                                app.SWGApplication.dataController.showOneItinerary(_code);
                            },

                            displayMultiColumnTable: function () {
                                if (multiColumnTableExists) app.SWGApplication.dataController.loadMultiColumnTable();
                            },

                            displayMultiColumnPlugin: function (_selector, _options) {
                                if ($(_selector).length > 0) {
                                    $(_selector).multiColumnManager(_options);
                                }
                            },

                            displayWeather: function () {
                                if (weatherCalendarExists) app.SWGApplication.dataController.loadWeatherToggle();
                            },

                            displayFeatureRecommendations: function () {
                                // Load Feature Recommendations
                                featureRecommendationsObj = $("#feature-recommendations.rules .recommendation-item");
                                featureRecommendationsExists = (featureRecommendationsObj.length > 0) ? true : false;

                                if (featureRecommendationsExists) app.SWGApplication.dataController.loadFeatureRecommendations();
                            },

                            updateLoader: function (_displayState, _statusCode) {

                                var displayState = (typeof _displayState !== "undefined") ? _displayState : null;
                                var statusCode = (typeof _statusCode !== "undefined") ? _statusCode : null;

                                if (displayState === "show" && statusCode === "loading") {

                                    $(".loader-wrapper").show();
                                    $(".interstitial").show();
                                    $(".interstitial .content.successLoading").show();

                                } else if (displayState === "show" && statusCode === "notfound") {

                                    $(".loader-wrapper").show();
                                    $(".interstitial").show();
                                    $(".interstitial .content.errorLoading").show();

                                    setTimeout(function () {
                                        window.location.href = "/";
                                    }, 5000);

                                } else if (displayState === "hide" && statusCode === "loading") {

                                    $(".interstitial").show();
                                    $(".interstitial .content.successLoading").hide();

                                } else if (displayState === "hide") {
                                    $(".loader-wrapper").hide();
                                }

                            },

                            updateBackToTop: function () {

                                var triggerHeight = Math.round(thisWindow.height());
                                var triggerTop = 0;
                                var bottom = 15;
                                // in the case that there is a searchbox take into account
                                var searchBoxBottomPosition = (searchBoxExists) ? searchBoxObj.offset().top + searchBoxObj.height() : 0;

                                updateDirection();

                                if (windowScrollTop < triggerTop + triggerHeight || windowScrollTop < searchBoxBottomPosition || moveDirection === "down") {

                                    // Hide BackToTop Button
                                    if (backToTopToggleDirection < 0) {
                                        backToTopToggleDirection = 1;

                                        if (backToTopInit) {

                                            backToTopObj.css("bottom", bottom);
                                            backToTopInit = false;

                                            backToTopObj.show();
                                        } else {

                                            backToTopObj.stop().dequeue().animate({
                                                bottom: bottom
                                            }, 800, "easeOutExpo");

                                        }

                                    }

                                } else if (((windowScrollTop > triggerTop + triggerHeight) || moveDirection === "up") && !backToTopObj.is(":animated")) {

                                    // Show BackToTop Button
                                    if (backToTopToggleDirection > 0) {
                                        backToTopToggleDirection = -1;

                                        backToTopObj.stop().animate({
                                            bottom: bottom
                                        }, 1500, "easeInOutBack");

                                    } else if (backToTopInit) {
                                        backToTopToggleDirection = -1;
                                        updateDirection();
                                        backToTopObj.css("bottom", bottom);
                                        backToTopInit = false;

                                        backToTopObj.show();
                                    }
                                }

                                function updateDirection() {

                                    if (backToTopToggleDirection < 0) {
                                        bottom = backToTopToggleDirection * (backToTopObj.outerHeight(true) + bottom);
                                    }

                                }
                            },

                            updateSignUpNo1ToTheSun: function () {

                                var triggerHeight = Math.round(thisWindow.height());
                                var bottom = 0;
                                var footerTop = $("footer").offset().top;

                                searchBoxBottomPosition = searchBoxObj.offset().top + searchBoxObj.height();
                                signUpNo1ToTheSunTopPosition = signUpNo1ToTheSunObj.position().top + parseInt(signUpNo1ToTheSunObj.css("margin-top"), 10) + parseInt(signUpNo1ToTheSunObj.css("padding-top"), 10);

                                function updateDirection() {

                                    if (signUpFormToggleDirection < 0) {
                                        bottom = signUpFormToggleDirection * (signUpNo1ToTheSunObj.outerHeight(true) + bottom);
                                    }

                                }

                                updateDirection();

                                // Update only when user is not inputting content
                                if (!signUpInputFlag) {

                                    if (searchBoxBottomPosition - windowScrollTop >= 0 || footerTop < windowScrollTop + triggerHeight || moveDirection === "up") {

                                        // Hide Form Button
                                        if (signUpFormToggleDirection < 0) {
                                            signUpFormToggleDirection = 1;

                                            if (signUpFormInit) {
                                                updateDirection();
                                                signUpNo1ToTheSunObj.css("bottom", bottom);
                                                signUpFormInit = false;

                                                signUpNo1ToTheSunObj.show();

                                            } else {

                                                signUpNo1ToTheSunObj.stop().dequeue().animate({
                                                    bottom: bottom
                                                }, 800, "easeOutExpo");
                                            }

                                        }

                                    } else if (((windowScrollTop > searchBoxBottomPosition) && moveDirection === "down") && !signUpNo1ToTheSunObj.is(":animated")) {

                                        // Show Form
                                        if (signUpFormToggleDirection > 0) {
                                            signUpFormToggleDirection = -1;

                                            if (signUpFormInit) {
                                                updateDirection();
                                                signUpNo1ToTheSunObj.css("bottom", bottom);
                                                signUpFormInit = false;

                                                signUpNo1ToTheSunObj.show();

                                            } else {

                                                signUpNo1ToTheSunObj.stop().animate({
                                                    bottom: bottom
                                                }, 1500, "easeOutExpo");

                                            }
                                        }
                                    }

                                } else if (signUpInputFlag && (searchBoxBottomPosition - windowScrollTop >= 0 || (footerTop < windowScrollTop + triggerHeight) || moveDirection === "up")) {
                                    signUpInputFlag = false;
                                }

                            }
                        },

                        dataController: {
                            initSettings: function () {
                                this.setSignIn();
                                this.setLanguage();
                                this.getTemplate();
                                this.getBrand();
                                this.getURLQueries();
                                this.autoScrollToSection();
                                this.getProtocol();
                                this.setEnvironment();
                                this.loadDatePickerOptions();
                                this.loadPollyFills();
                            },

                            autoScrollToSection: function () {

                                var targetID = app.SWGApplication.dataModel.query.hash;
                                var anchorTarget = (targetID.length > 1) ? $(app.SWGApplication.dataModel.query.hash) : null;
                                var anchorTriggerObj = null;
                                var anchorTriggerExists = false;
                                var isTab = false;
                                var anchorTriggerToggle, anchorTriggerID;

                                // Intercept browser auto scrolling
                                if (targetID) {
                                    setTimeout(function () {
                                        window.scrollTo(0, 0);
                                    }, 1);
                                }

                                // Delay scrolling once page has loaded
                                setTimeout(function () {

                                    // Target controlled scrolling
                                    if (targetID && anchorTarget.length > 0) {

                                        // Find trigger if exists
                                        var foundTrigger = false;

                                        viewportObj.find("#body-content a").each(function (anchorIndex, anchorElement) {

                                            if ($(anchorElement).attr("href") === targetID && !foundTrigger) {
                                                anchorTriggerExists = true;
                                                anchorTriggerObj = $(anchorElement);
                                                return false;
                                            }

                                        });

                                        // Check if anchor trigger object exists in the DOM
                                        anchorTriggerID = (anchorTriggerObj !== null) ? anchorTriggerObj.data("id") : null;

                                        // Check if anchor trigger object exists as a BS toggle
                                        anchorTriggerToggle = (anchorTriggerObj !== null) ? anchorTriggerObj.data("toggle") : null;

                                        // Check if there is a tab that shares the id, then it needs to be triggered
                                        isTab = (anchorTriggerID === targetID.replace("#", "") || anchorTriggerToggle === "tab") ? true : false;

                                        if (isTab && anchorTriggerExists) {

                                            setTimeout(function () {

                                                app.SWGApplication.dataController.scrollViewport(anchorTriggerObj.offset().top, 2000, ((anchorTriggerToggle === "tab") ? anchorTriggerObj : null), 0, function () {
                                                    setTimeout(function () {
                                                        anchorTriggerObj.trigger("click");
                                                    }, 300);
                                                });

                                            }, 500);

                                        } else if (anchorTriggerExists) {

                                            setTimeout(function () {
                                                anchorTriggerObj.trigger("click");
                                            }, 500);

                                        } else {

                                            setTimeout(function () {
                                                app.SWGApplication.dataController.scrollViewport(targetID.replace("#", ""), 2000, null);
                                            }, 500);

                                        }

                                    }

                                }, 1000);

                            },

                            getURLQueries: function () {

                                var valuePairs = [], query;
                                var hash = window.location.hash;
                                var hashExists = (hash) ? true : false;
                                var pageName = "", pageNameStart = 0, pageNameEnd = 0;

                                var checkForQuery = (window.location.href.indexOf("?") + 1 < window.location.href.length) ? window.location.href.indexOf("?") + 1 : false;

                                if (checkForQuery) {

                                    var queries = window.location.href.replace(hash, "").slice(checkForQuery).split("&");
                                    var tempURLVars = [];

                                    if (!$.isEmptyObject(queries)) {

                                        for (var i = 0; i < queries.length; i++) {
                                            query = queries[i].split("=");
                                            valuePairs[query[0]] = query[1];

                                            if ($.inArray(query[0], app.SWGApplication.dataModel.queryList.queryArray) >= 0) {
                                                tempURLVars[query[0]] = query[1];
                                            }

                                        }

                                        allURLVars.queries.queryArray = tempURLVars;

                                    } else {
                                        allURLVars.queries = null;
                                    }

                                }

                                if (hashExists) {
                                    allURLVars.hash = hash;
                                }

                                // Determine the page name
                                pageNameStart = window.location.href.lastIndexOf("/") + 1;
                                pageNameStart = (pageNameStart !== window.location.href.length) ? pageNameStart : window.location.href.substr(0, pageNameStart - 1).lastIndexOf("/") + 1;

                                pageNameEnd = window.location.href.length;
                                pageNameEnd = (window.location.href.indexOf("?") > -1) ? window.location.href.indexOf("?") + 1 : pageNameEnd;
                                pageName = window.location.href.substring(pageNameStart, pageNameEnd).replace(hash, "");

                                allURLVars.pageName = pageName;

                                app.SWGApplication.dataModel.query = allURLVars;
                            },

                            setSignIn: function () {

                                if ($.cookie("_acswb") === undefined || $.cookie("_acswb") === "XQw0xct0/Mc=") {
                                    // User is not signed in
                                    $("#signIn").removeClass("hide");
                                    $("#signOut").addClass("hide");
                                } else if ($.cookie("_acswb") !== undefined && $.cookie("_acswb") !== "XQw0xct0/Mc=") {
                                    // User is not signed out
                                    $("#signOut").removeClass("hide");
                                    $("#signIn").addClass("hide");
                                } else {
                                    // Fallback for user to sign in
                                    $("#signIn").removeClass("hide");
                                    $("#signOut").addClass("hide");
                                }

                                // Signout cookie management, sets cookie to sign in value
                                signOut = function () {
                                    $.cookie("_acswb", "XQw0xct0/Mc=", { expires: 1, domain: ".sunwing.ca", path: '/' });
                                    $("#signIn").removeClass("hide");
                                    $("#signOut").addClass("hide");
                                }
                            },

                            setLanguage: function () {
                                var lang = $("html").attr("lang") ? $("html").attr("lang").toLowerCase() : "en";
                                app.SWGApplication.dataModel.language = lang;
                                app.SWGApplication.dataModel.locale = lang + "-ca";
                            },

                            getTemplate: function () {
                                var template = $("html").data("template") ? $("html").data("template").toLowerCase() : "promotion";
                                app.SWGApplication.dataModel.template = template;
                            },

                            getBrand: function () {
                                var brand = $("html").data("brand") ? $("html").data("brand").toLowerCase() : "sunwing";
                                app.SWGApplication.dataModel.brand = brand;
                            },

                            getProtocol: function () {
                                var protocol = $(location).attr("protocol");
                                app.SWGApplication.dataModel.protocol = protocol;
                            },

                            setEnvironment: function () {
                                // Set any global settings
                            },

                            loadPollyFills: function () {

                                browser = app.SWGApplication.dataController.getBrowserIE(window.navigator.userAgent.toLowerCase());

                                // Work-around for www.sunwing.ca cross-domain same origin policy for IE9
                                if (browser.ua === "msie" && browser.version < 10 && window.XDomainRequest) {
                                    $.ajaxTransport(function (s) {
                                        if (s.crossDomain && s.async) {
                                            if (s.timeout) {
                                                s.xdrTimeout = s.timeout;
                                                delete s.timeout;
                                            }
                                            var xdr;
                                            return {
                                                send: function (_, complete) {
                                                    function callback(status, statusText, responses, responseHeaders) {
                                                        xdr.onload = xdr.onerror = xdr.ontimeout = $.noop;
                                                        xdr = undefined;
                                                        complete(status, statusText, responses, responseHeaders);
                                                    }
                                                    xdr = new XDomainRequest();
                                                    xdr.onload = function () {
                                                        callback(200, "OK", {
                                                            text: xdr.responseText
                                                        }, "Content-Type: " + xdr.contentType);
                                                    };
                                                    xdr.onerror = function () {
                                                        callback(404, "Not Found");
                                                    };
                                                    xdr.onprogress = $.noop;
                                                    xdr.ontimeout = function () {
                                                        callback(0, "timeout");
                                                    };
                                                    xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;
                                                    xdr.open(s.type, s.url);
                                                    xdr.send((s.hasContent && s.data) || null);
                                                },
                                                abort: function () {
                                                    if (xdr) {
                                                        xdr.onerror = $.noop;
                                                        xdr.abort();
                                                    }
                                                }
                                            };
                                        }
                                    });
                                }

                                if (!Object.keys) {
                                    Object.keys = (function () {

                                        var hasOwnProperty = Object.prototype.hasOwnProperty,
                                            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable("toString"),
                                            dontEnums = [
                                                "toString",
                                                "toLocaleString",
                                                "valueOf",
                                                "hasOwnProperty",
                                                "isPrototypeOf",
                                                "propertyIsEnumerable",
                                                "constructor"
                                            ],
                                            dontEnumsLength = dontEnums.length;

                                        return function (obj) {
                                            if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                                                throw new TypeError("Object.keys called on non-object");
                                            }

                                            var result = [], prop, i;

                                            for (prop in obj) {
                                                if (hasOwnProperty.call(obj, prop)) {
                                                    result.push(prop);
                                                }
                                            }

                                            if (hasDontEnumBug) {
                                                for (i = 0; i < dontEnumsLength; i++) {
                                                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                                                        result.push(dontEnums[i]);
                                                    }
                                                }
                                            }
                                            return result;
                                        };
                                    }());
                                }

                            },

                            loadHeaderScripts: function () {

                                var searchString = "";
                                var searchSelection = "";
                                var searchHotelCode = "";

                                if (headerSearchBoxExists) {

                                    headerSearchBoxObj.each(function (searchIndex, searchElement) {

                                        var headerSearchBoxButtonObj = $(searchElement).parent().find("button");

                                        $(searchElement).autocomplete({
                                            source: function (request, response) {

                                                $.ajax({
                                                    url: headerSearchBoxService + app.SWGApplication.dataModel.brand + "/" + app.SWGApplication.dataModel.language + "/hotelNameCode/" + request.term,
                                                    dataType: "json",
                                                    crossDomain: true,
                                                    data: {
                                                        maxRows: 12,
                                                        multiple: true,
                                                        multipleSeparator: " ",
                                                        name_startsWith: request.term
                                                    },
                                                    success: function (data) {

                                                        var results = $.map(data, function (items) {
                                                            return {
                                                                label: items.hotelName,
                                                                id: items.regionName.replace(/ /g, "-") + "/" + items.destinationName.replace(/ /g, "-") + "/" + items.hotelName.replace(/ /g, "-")
                                                            };
                                                        });

                                                        response(results);
                                                    }
                                                });
                                            },

                                            minLength: 2,
                                            search: function () {

                                                searchString = $(searchElement).val();
                                                searchSelection = "";
                                                headerSearchBoxButtonObj.removeClass("active");

                                                // Added hack for haptic devices
                                                $(".ui-autocomplete").off("menufocus");
                                            },

                                            close: function () {

                                                if (!searchSelection) {
                                                    $(searchElement).val(searchString);
                                                }

                                                updateInput();
                                            },

                                            focus: function () {
                                                return false;
                                            },

                                            select: function (event, ui) {
                                                searchSelection = ui.item.label;
                                                searchHotelCode = ui.item.id;
                                                $(searchElement).val(searchSelection);
                                                headerSearchBoxButtonObj.addClass("active");
                                                return false;
                                            },
                                            appendTo: ".search-result.instance" + searchIndex
                                        });

                                        /*/////////////////////////////////////////
                                        // Attach header search reset button
                                        /////////////////////////////////////////*/

                                        var clearButton = $(searchElement).parent().children(".input-cancel");

                                        $(searchElement).on("click keyup blur", function (e) {

                                            if (e.type === "blur" && !searchSelection || e.which === 27) {
                                                clearButton.trigger("click");
                                            }

                                            if (e.type === "click") {
                                                $(this).autocomplete("search");
                                            }

                                            updateInput();
                                        });

                                        var updateInput = function () {

                                            if ($.trim($(searchElement).val())) {

                                                clearButton.show();
                                                $(".hotel-search > button").removeClass("disabled");
                                                $(".hotel-search > button").prop("disabled", false);

                                            } else {

                                                clearButton.hide();
                                                $(".hotel-search > button").addClass("disabled");
                                                $(".hotel-search > button").prop("disabled", true);

                                                searchString = "";
                                                searchSelection = "";
                                                searchHotelCode = "";
                                            }
                                        };

                                        clearButton.on("click", function () {
                                            $(this).next().val("");
                                            $(this).hide();
                                            updateInput();
                                            $(searchElement).removeClass("active");
                                        });

                                        /*/////////////////////////////////////////
                                        // Add Results interaction
                                        /////////////////////////////////////////*/

                                        headerSearchBoxObj.on("keydown", function (e) {

                                            if (e.which === 13 && searchSelection) {
                                                headerSearchBoxButtonObj.trigger("click");
                                            }

                                        });

                                        headerSearchBoxButtonObj.on("click", function (e) {
                                            e.preventDefault();

                                            if (searchSelection.trim() && app.SWGApplication.dataModel.template !== "hotelpage") {
                                                window.open("/" + app.SWGApplication.dataModel.language + hotelURL + searchHotelCode.toLowerCase(), "_blank");
                                                clearButton.trigger("click");
                                            } else {
                                                window.open("/" + app.SWGApplication.dataModel.language + hotelURL + searchHotelCode.toLowerCase(), "_self");
                                            }

                                        });

                                    });

                                }
                            },

                            loadDatePickerOptions: function () {

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

                            loadSearchBox: function () {

                                var searchBoxTabObj = searchBoxObj.find(".sb-tab-container .tab");
                                var searchBoxContentObj = searchBoxObj.find(".sb-tab-contents form");
                                var defaultTabIndex = $.inArray(defaultTab, searchBoxArray);
                                var thisTab;

                                var checkin = null;
                                var checkout = null;

                                var todaysDate = moment().format("L");
                                var checkinDate = moment().add(1, "days").format("L");
                                var checkoutDate = moment().add(8, "days").format("L");

                                var pickUpDate = null;
                                var dropOffDate = null;

                                function addTrigger(_checkin, _checkout, _days) {
                                    var minDate;

                                    if (_checkout && _checkin) {

                                        $(_checkin).on("dp.change", function (e) {
                                            minDate = e.date;

                                            $(_checkout).data("DateTimePicker").minDate(minDate);

                                            if ($(_checkin).data("DateTimePicker").date() > $(_checkout).data("DateTimePicker").date()) {
                                                $(_checkout).data("DateTimePicker").date(moment($(_checkin).data("DateTimePicker").date().add(_days, "days").format("L")));
                                            }
                                        });

                                        checkout = null;
                                        checkin = null;
                                    }

                                }

                                searchBoxTabObj.each(function (index, element) {

                                    var initTabs = true;

                                    $(element).on("click.searchBoxTab", function (e) {

                                        e.preventDefault();
                                        e.stopPropagation();

                                        // Query if URL is available
                                        var href = $(this).attr("href").trim();

                                        if (href.length > 1) {
                                            window.open(href, "_blank");
                                            return;
                                        }

                                        // Resume Displaying Content
                                        thisTab = index;
                                        var thisTabContent = searchBoxContentObj.eq(thisTab).get(0);
                                        var searchBoxOptions;

                                        $(element).addClass("active");
                                        $(thisTabContent).closest(".tab-content").removeClass("hideTab").addClass("showTab");
                                        $(thisTabContent).addClass("active");

                                        $(searchBoxContentObj).each(function (oIndex, oElement) {
                                            if (oIndex !== thisTab) {
                                                $(oElement).closest(".tab-content").removeClass("showTab").addClass("hideTab");
                                                $(oElement).removeClass("active");
                                                searchBoxTabObj.eq(oIndex).removeClass("active");
                                            }
                                        });

                                        var thisTabId = $(element).attr("id");
                                        var thisId = thisTabId.substr(thisTabId.lastIndexOf("-") + 1, thisTabId.length);

                                        // initialize all JS events
                                        if (initTabs) {
                                            loadSeachBoxContent(thisId);
                                            initTabs = false;
                                        }

                                        function loadSeachBoxContent(_tabId) {
                                            var tomorrowsDate;

                                            if (_tabId === "packages") {

                                                searchBoxOptions = $.extend({}, datePickerOptions);
                                                tomorrowsDate = moment().add(1, "days").format("YYYY-MM-DD");

                                                if (typeof userDate !== "undefined") {
                                                    if (userDate !== "") tomorrowsDate = userDate;
                                                }

                                                searchBoxOptions.defaultDate = tomorrowsDate;
                                                searchBoxOptions.minDate = tomorrowsDate;
                                                searchBoxOptions.maxDate = moment().add(365, "days");

                                                thisTabContent = searchBoxContentObj.eq(thisTab);

                                                // Initialize calendar instance
                                                thisTabContent.find(".calendar").datetimepicker(searchBoxOptions);

                                                if (!Modernizr.touch) {
                                                    thisTabContent.find(".calendar").removeAttr("readonly");
                                                }

                                                thisTabContent.find(".calendar").on("click", function (e) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                });

                                                // Attach Children Drop-Down Interaction
                                                thisTabContent.find(".childage-wrapper").each(function (index, element) {

                                                    var thisChildAgeObj = $(element);
                                                    var totalChildren = $(element).find(".form-group").children().length;

                                                    var thisForm = "#search-box-form-" + _tabId;
                                                    var closeButton = $(thisForm + " .close");
                                                    var editButton = $(thisForm + " ." + _tabId + "-children .edit");
                                                    var rowPaddingObj = $(thisForm + " .mrow4");

                                                    thisTabContent.find("[name='nb_child']").on("change", function () {

                                                        if ($(this).val() > 0) {

                                                            for (var i = 0; i < totalChildren; i++) {

                                                                if (i < $(this).val()) {
                                                                    thisChildAgeObj.find(".form-group").eq(i).removeClass("disabled");
                                                                    thisChildAgeObj.find(".form-group").eq(i).find("select").prop("disabled", false);

                                                                } else {
                                                                    thisChildAgeObj.find(".form-group").eq(i).addClass("disabled");
                                                                    thisChildAgeObj.find(".form-group").eq(i).find("select").val(0).prop("disabled", true);
                                                                }

                                                            }

                                                            thisChildAgeObj.closest(".mrow3").removeClass("disabled").removeClass("reset");
                                                            editButton.removeClass("disabled");
                                                            rowPaddingObj.addClass("show").removeClass("hide");

                                                        } else {
                                                            thisChildAgeObj.find(".form-group").find("select").val(0).prop("disabled", true);
                                                            thisChildAgeObj.closest(".mrow3").addClass("disabled").addClass("reset");
                                                            editButton.addClass("disabled");
                                                            rowPaddingObj.addClass("hide").removeClass("show");
                                                        }

                                                    });

                                                    closeButton.on("click", function (e) {
                                                        e.preventDefault();
                                                        thisChildAgeObj.closest(".mrow3").addClass("disabled");
                                                    });

                                                    editButton.on("click", function (e) {
                                                        e.preventDefault();
                                                        thisChildAgeObj.closest(".mrow3").removeClass("disabled");
                                                    });

                                                });

                                            } else if (_tabId === "flights") {

                                                thisTabContent = searchBoxContentObj.eq(thisTab);

                                                searchBoxOptions = $.extend({}, datePickerOptions);
                                                tomorrowsDate = moment().add(1, "days").format("YYYY-MM-DD");

                                                if (typeof userDate !== "undefined") {
                                                    if (userDate !== "") tomorrowsDate = userDate;
                                                }

                                                searchBoxOptions.defaultDate = tomorrowsDate;
                                                searchBoxOptions.minDate = tomorrowsDate;

                                                thisTabContent.find(".calendar").each(function (index, element) {

                                                    checkin = ($(element).attr("class").indexOf("checkin") > -1) ? $(element) : checkin;
                                                    checkout = ($(element).attr("class").indexOf("checkout") > -1) ? $(element) : checkout;

                                                    tomorrowsDate = (checkout) ? checkoutDate : checkinDate;

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
                                                thisTabContent.find(".childage-wrapper").each(function (index, element) {

                                                    var thisChildAgeObj = $(element);
                                                    var totalChildren = $(element).find(".form-group").children().length;

                                                    var thisForm = "#search-box-form-" + _tabId;
                                                    var closeButton = $(thisForm + " .close");
                                                    var editButton = $(thisForm + " ." + _tabId + "-children .edit");
                                                    var rowPaddingObj = $(thisForm + " .mrow4");

                                                    thisTabContent.find("[name='nb_child']").on("change", function () {

                                                        if ($(this).val() > 0) {

                                                            for (var i = 0; i < totalChildren; i++) {

                                                                if (i < $(this).val()) {
                                                                    thisChildAgeObj.find(".form-group").eq(i).removeClass("disabled");
                                                                    thisChildAgeObj.find(".form-group").eq(i).find("select").prop("disabled", false);

                                                                } else {
                                                                    thisChildAgeObj.find(".form-group").eq(i).addClass("disabled");
                                                                    thisChildAgeObj.find(".form-group").eq(i).find("select").val(0).prop("disabled", true);
                                                                }

                                                            }

                                                            thisChildAgeObj.closest(".mrow3").removeClass("disabled").removeClass("reset");
                                                            editButton.removeClass("disabled");
                                                            rowPaddingObj.addClass("show").removeClass("hide");

                                                        } else {
                                                            thisChildAgeObj.find(".form-group").find("select").val(0).prop("disabled", true);
                                                            thisChildAgeObj.closest(".mrow3").addClass("disabled").addClass("reset");
                                                            editButton.addClass("disabled");
                                                            rowPaddingObj.addClass("hide").removeClass("show");
                                                        }

                                                    });

                                                    closeButton.on("click", function (e) {
                                                        e.preventDefault();
                                                        thisChildAgeObj.closest(".mrow3").addClass("disabled");
                                                    });

                                                    editButton.on("click", function (e) {
                                                        e.preventDefault();
                                                        thisChildAgeObj.closest(".mrow3").removeClass("disabled");
                                                    });

                                                });

                                                // Get default Departure value
                                                departureGatewayObj = thisTabContent.find(".departure-gateway .right-inner-icon input");
                                                var departureGatewayToggleObj = thisTabContent.find(".departure-gateway .right-inner-icon .fa");

                                                if (departureGatewayObj.length > 0) {

                                                    var departureGatewayDefault = $.trim(departureGatewayObj.val());
                                                    var departureGatewayValue = departureGatewayDefault;
                                                    var departureGatewayToggle = false;
                                                    var depGToggleFlag = false;
                                                    var depGateToggleInit = false;

                                                    departureGatewayObj.on("click focus blur keydown keyup", function (e) {
                                                        e.stopPropagation();

                                                        if (e.type === "blur") {

                                                            if (!$(this).val()) {
                                                                departureGatewayValue = $.trim($(this).val());
                                                                departureGatewayDefault = (departureGatewayValue) ? departureGatewayValue : departureGatewayDefault;

                                                                $(this).val(departureGatewayDefault);

                                                                if (!depGToggleFlag) {
                                                                    toggleDepartureGateway(departureGatewayToggleObj, false);
                                                                }

                                                            } else {
                                                                toggleDepartureGateway(departureGatewayToggleObj, false);
                                                            }

                                                        } else if (e.type === "focus") {

                                                            departureGatewayDefault = $.trim($(this).val());
                                                            $(this).val("");
                                                            $(this).trigger("keydown", {
                                                                keyCode: 8
                                                            });

                                                            toggleDepartureGateway(departureGatewayToggleObj, true);

                                                            // deactivate arrival DD
                                                            arrGToggleFlag = false;
                                                            arrivalGatewayObj.trigger("blur");

                                                        } else if (e.type === "keyup") {

                                                            if (e.keyCode === 13) {
                                                                departureGatewayObj.trigger("blur");

                                                            } else if (e.keyCode === 9) {
                                                                toggleDepartureGateway(departureGatewayToggleObj, true);
                                                            }

                                                        }

                                                    });

                                                    departureGatewayToggleObj.on("click", function (e) {
                                                        e.stopPropagation();

                                                        if (e.type === "click") {

                                                            if (departureGatewayToggle === true || !depGToggleFlag) {
                                                                departureGatewayObj.trigger("focus");
                                                                departureGatewayObj.trigger("keydown", {
                                                                    keyCode: 8
                                                                });
                                                                depGToggleFlag = true;
                                                            }

                                                            toggleArrow(departureGatewayToggleObj, departureGatewayToggle);
                                                            departureGatewayToggle = !departureGatewayToggle;
                                                        }

                                                    });

                                                    var toggleDepartureGateway = function (_toggleElement, _toggleValue) {
                                                        departureGatewayToggle = (typeof _toggleValue !== "undefined") ? _toggleValue : !departureGatewayToggle;
                                                        toggleArrow(_toggleElement, _toggleValue);
                                                        depGToggleFlag = false;
                                                    };

                                                }

                                                // Get default Arrival value
                                                arrivalGatewayObj = thisTabContent.find(".arrival-gateway .right-inner-icon input");
                                                var arrivalGatewayToggleObj = thisTabContent.find(".arrival-gateway .right-inner-icon .fa");

                                                if (arrivalGatewayObj.length > 0) {

                                                    var arrivalGatewayDefault = $.trim(arrivalGatewayObj.val());
                                                    var arrivalGatewayValue = arrivalGatewayDefault;
                                                    var arrivalGatewayToggle = false;
                                                    var arrGToggleFlag = false;

                                                    arrivalGatewayObj.on("click focus blur keydown keyup", function (e) {

                                                        e.stopPropagation();

                                                        if (e.type === "blur") {

                                                            if (!$(this).val()) {
                                                                arrivalGatewayValue = $.trim($(this).val());
                                                                arrivalGatewayDefault = (arrivalGatewayValue) ? arrivalGatewayValue : arrivalGatewayDefault;

                                                                $(this).val(arrivalGatewayDefault);

                                                                if (!arrGToggleFlag) {
                                                                    toggleArrivalGateway(arrivalGatewayToggleObj, false);
                                                                }

                                                            } else {
                                                                toggleArrivalGateway(arrivalGatewayToggleObj, false);
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

                                                    });

                                                    var toggleArrivalGateway = function (_toggleElement, _toggleValue) {
                                                        arrivalGatewayToggle = (typeof _toggleValue !== "undefined") ? _toggleValue : !arrivalGatewayToggle;
                                                        toggleArrow(_toggleElement, _toggleValue);
                                                        arrGToggleFlag = false;
                                                    };

                                                    arrivalGatewayToggleObj.on("click", function (e) {
                                                        e.stopPropagation();

                                                        if (arrivalGatewayToggle === true || !arrGToggleFlag) {
                                                            arrivalGatewayObj.trigger("focus");
                                                            arrivalGatewayObj.trigger("keydown", {
                                                                keyCode: 8
                                                            });
                                                            arrGToggleFlag = true;
                                                        }

                                                        toggleArrow(arrivalGatewayToggleObj, arrivalGatewayToggle);
                                                        arrivalGatewayToggle = !arrivalGatewayToggle;
                                                    });

                                                }

                                                if (departureGatewayObj.length > 0 && arrivalGatewayObj.length > 0) {

                                                    // SHARED //
                                                    var resetFlightsDD = function (_toggleValue) {
                                                        departureGatewayObj.trigger("blur");
                                                        arrivalGatewayObj.trigger("blur");
                                                        toggleDepartureGateway(departureGatewayToggleObj, _toggleValue);
                                                        toggleArrivalGateway(arrivalGatewayToggleObj, _toggleValue);
                                                        depGateToggleInit = false;
                                                    };

                                                    var toggleArrow = function (_toggleObj, _toggleValue) {

                                                        if (_toggleValue === true) {
                                                            _toggleObj.removeClass("fa-angle-down").addClass("fa-angle-up");
                                                        } else {
                                                            _toggleObj.addClass("fa-angle-down").removeClass("fa-angle-up");
                                                        }

                                                    };

                                                    thisWindow.on("click", function () {
                                                        resetFlightsDD(false);
                                                    });

                                                }

                                            } else if (_tabId === "cruises") {

                                                thisTabContent = searchBoxContentObj.eq(thisTab);
                                                tomorrowsDate = moment().add(0, "days").format("YYYY-MM-DD");

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
                                                thisTabContent.find(".cruise-departure-month .calendar").datetimepicker(searchBoxOptionsMonth);
                                                thisTabContent.find(".cruise-departure-date .calendar").datetimepicker(searchBoxOptionsDate);

                                                if (!Modernizr.touch) {
                                                    thisTabContent.find(".calendar").removeAttr("readonly");
                                                }

                                                thisTabContent.find("#cruise-dep-month-toggle").on("click", function (e) {

                                                    $(this).closest(".input-group-wrapper").find(".calendar").prop("disabled", false);
                                                    $(this).closest(".input-group-wrapper").removeClass("disabled-form-input");
                                                    $(this).closest(".mrow2").find(".cruise-departure-date .calendar").prop("disabled", true);
                                                    $(this).closest(".mrow2").find(".cruise-departure-date").closest(".input-group-wrapper").addClass("disabled-form-input");
                                                });

                                                thisTabContent.find("#cruise-dep-date-toggle").on("click", function (e) {

                                                    $(this).closest(".input-group-wrapper").find(".calendar").prop("disabled", false);
                                                    $(this).closest(".input-group-wrapper").removeClass("disabled-form-input");
                                                    $(this).closest(".mrow2").find(".cruise-departure-month .calendar").prop("disabled", true);
                                                    $(this).closest(".mrow2").find(".cruise-departure-month").closest(".input-group-wrapper").addClass("disabled-form-input");

                                                });

                                                // Retrieve active radio / calendar value
                                                $("[name='cruise-dep-group']").each(function (index, element) {

                                                    if ($(element).prop("checked")) {
                                                        return $(element).closest(".input-group-wrapper").find(".calendar").val();
                                                    }

                                                });

                                            } else if (_tabId === "hotels") {

                                                thisTabContent = searchBoxContentObj.eq(thisTab);

                                                searchBoxOptions = $.extend({}, datePickerOptions);
                                                tomorrowsDate = moment().add(1, "days").format("YYYY-MM-DD");

                                                if (typeof userDate !== "undefined") {
                                                    if (userDate !== "") tomorrowsDate = userDate;
                                                }

                                                searchBoxOptions.defaultDate = tomorrowsDate;
                                                searchBoxOptions.minDate = tomorrowsDate;
                                                searchBoxOptions.maxDate = moment().add(365, "days");

                                                thisTabContent.find(".calendar").each(function (index, element) {

                                                    checkin = ($(element).attr("class").indexOf("checkin") > -1) ? $(element) : checkin;
                                                    checkout = ($(element).attr("class").indexOf("checkout") > -1) ? $(element) : checkout;

                                                    tomorrowsDate = (checkout) ? checkoutDate : checkinDate;

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
                                                thisTabContent.find(".childage-wrapper").each(function (index, element) {

                                                    var thisChildAgeObj = $(element);
                                                    var totalChildren = $(element).find(".form-group").children().length;

                                                    var thisForm = "#search-box-form-" + _tabId;
                                                    var closeButton = $(thisForm + " .close");
                                                    var editButton = $(thisForm + " ." + _tabId + "-children .edit");
                                                    var rowPaddingObj = $(thisForm + " .mrow4");

                                                    thisTabContent.find("[name='nb_child']").on("change", function () {

                                                        if ($(this).val() > 0) {

                                                            for (var i = 0; i < totalChildren; i++) {

                                                                if (i < $(this).val()) {
                                                                    thisChildAgeObj.find(".form-group").eq(i).removeClass("disabled");
                                                                    thisChildAgeObj.find(".form-group").eq(i).find("select").prop("disabled", false);

                                                                } else {
                                                                    thisChildAgeObj.find(".form-group").eq(i).addClass("disabled");
                                                                    thisChildAgeObj.find(".form-group").eq(i).find("select").val(0).prop("disabled", true);
                                                                }

                                                            }

                                                            thisChildAgeObj.closest(".mrow3").removeClass("disabled").removeClass("reset");
                                                            editButton.removeClass("disabled");
                                                            rowPaddingObj.addClass("show").removeClass("hide");

                                                        } else {
                                                            thisChildAgeObj.find(".form-group").find("select").val(0).prop("disabled", true);
                                                            thisChildAgeObj.closest(".mrow3").addClass("disabled").addClass("reset");
                                                            editButton.addClass("disabled");
                                                            rowPaddingObj.addClass("hide").removeClass("show");
                                                        }

                                                    });

                                                    closeButton.on("click", function (e) {
                                                        e.preventDefault();
                                                        thisChildAgeObj.closest(".mrow3").addClass("disabled");
                                                    });

                                                    editButton.on("click", function (e) {
                                                        e.preventDefault();
                                                        thisChildAgeObj.closest(".mrow3").removeClass("disabled");
                                                    });

                                                });

                                            } else if (_tabId === "cars") {

                                                searchBoxOptions = $.extend({}, datePickerOptions);

                                                thisTabContent = searchBoxContentObj.eq(thisTab);

                                                searchBoxOptions.format = "YYYY-MM-DD";
                                                searchBoxOptions.maxDate = moment().add(365, "days");

                                                // Initialize calendar instance
                                                thisTabContent.find(".calendar").each(function (index, element) {

                                                    checkin = ($(element).attr("class").indexOf("pickup") > -1) ? $(element) : checkin;
                                                    checkout = ($(element).attr("class").indexOf("dropoff") > -1) ? $(element) : checkout;

                                                    if (checkin && checkout) {

                                                        searchBoxOptions.useCurrent = false;
                                                        searchBoxOptions.defaultDate = moment().add(1, "days").format("YYYY-MM-DD");

                                                    } else if (checkin) {

                                                        searchBoxOptions.minDate = moment().format("YYYY-MM-DD");
                                                        searchBoxOptions.defaultDate = moment().format("YYYY-MM-DD");
                                                    }

                                                    // Initialize calendar instance
                                                    $(element).datetimepicker(searchBoxOptions);

                                                    addTrigger(checkin, checkout, 1);

                                                    if (!Modernizr.touch) {
                                                        $(element).removeAttr("readonly");
                                                    }

                                                });

                                                $(".car-pickup-date input, .car-dropoff-date input").on("click", function (e) {
                                                    e.stopPropagation();
                                                });

                                                // Get default Departure value
                                                pickUpGatewayObj = thisTabContent.find(".car-pickup-gateway .right-inner-icon input");

                                                var pickUpGatewayToggleObj = thisTabContent.find(".car-pickup-gateway .right-inner-icon .fa");
                                                var initCars = true;

                                                if (pickUpGatewayObj.length > 0) {

                                                    var pickUpGatewayDefault = $.trim(pickUpGatewayObj.val());
                                                    var pickUpGatewayValue = pickUpGatewayDefault;
                                                    var pickUpGatewayToggle = false;
                                                    var pickUpGToggleFlag = false;
                                                    var pickUpGateToggleInit = false;

                                                    pickUpGatewayObj.on("click focus blur keydown keyup", function (e) {
                                                        e.stopPropagation();

                                                        if ($(this).is(":visible")) {

                                                            if (e.type === "blur") {

                                                                if (!$(this).val()) {
                                                                    pickUpGatewayValue = $.trim($(this).val());
                                                                    pickUpGatewayDefault = (pickUpGatewayValue) ? pickUpGatewayValue : pickUpGatewayDefault;

                                                                    $(this).val(pickUpGatewayDefault);

                                                                    if (!pickUpGToggleFlag) {
                                                                        togglePickUpGateway(pickUpGatewayToggleObj, false);
                                                                    }

                                                                } else {
                                                                    togglePickUpGateway(pickUpGatewayToggleObj, false);
                                                                }

                                                                // Show errors when class is added in initGatewayloaded
                                                                if ($(".error-messages.cars").hasClass("show")) initCars = true;

                                                                // Adds same as pick up default value
                                                                if ($.trim(dropOffGatewayObj.val()).length <= 0 && initCars) {

                                                                    dropOffGatewayObj.trigger("focus");
                                                                    dropOffGatewayObj.closest(".form-group").find(".ui-autocomplete").children().eq(0).trigger("click");
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

                                                    });

                                                    pickUpGatewayToggleObj.on("click", function (e) {
                                                        e.stopPropagation();

                                                        if ($(this).is(":visible")) {

                                                            if (e.type === "click") {

                                                                if (pickUpGatewayToggle === true || !pickUpGToggleFlag) {
                                                                    pickUpGatewayObj.trigger("focus");
                                                                    pickUpGatewayObj.trigger("keydown", {
                                                                        keyCode: 8
                                                                    });

                                                                    pickUpGToggleFlag = true;
                                                                }

                                                                toggleArrow(pickUpGatewayToggleObj, pickUpGatewayToggle);
                                                                pickUpGatewayToggle = !pickUpGatewayToggle;
                                                            }

                                                        }

                                                    });

                                                    var togglePickUpGateway = function (_toggleElement, _toggleValue) {
                                                        pickUpGatewayToggle = (typeof _toggleValue !== "undefined") ? _toggleValue : !pickUpGatewayToggle;
                                                        toggleArrow(_toggleElement, _toggleValue);
                                                        pickUpGToggleFlag = false;
                                                    };

                                                    /*
                                                    // Adds both default values on init
                                                    setTimeout(function(){
                                                    	
                                                        if (!$.trim(pickUpGatewayObj.val())){
                                                            pickUpGatewayObj.trigger("focus");
                                                            pickUpGatewayObj.closest(".form-group").find(".ui-autocomplete").children().eq(0).trigger("click");
                                                            pickUpGatewayObj.trigger("blur");
                                                        	
                                                            dropOffGatewayObj.trigger("focus");
                                                            dropOffGatewayObj.closest(".form-group").find(".ui-autocomplete").children().eq(0).trigger("click");
                                                            dropOffGatewayObj.trigger("blur");
                                                        }
                                                    	
                                                    }, 100);
                                                    */
                                                }

                                                // Get default Arrival value
                                                dropOffGatewayObj = thisTabContent.find(".car-dropoff-gateway .right-inner-icon input");
                                                var dropOffGatewayToggleObj = thisTabContent.find(".car-dropoff-gateway .right-inner-icon .fa");

                                                $("#car-dropoff-gateway").val("");

                                                if (dropOffGatewayObj.length > 0) {

                                                    var dropOffGatewayDefault = $.trim(dropOffGatewayObj.val());
                                                    var dropOffGatewayValue = dropOffGatewayDefault;
                                                    var dropOffGatewayToggle = false;
                                                    var dropOffGToggleFlag = false;

                                                    dropOffGatewayObj.on("click focus blur keydown keyup", function (e) {

                                                        e.stopPropagation();

                                                        if ($(this).is(":visible")) {

                                                            if (e.type === "blur") {

                                                                if (!$(this).val()) {
                                                                    dropOffGatewayValue = $.trim($(this).val());
                                                                    dropOffGatewayDefault = (dropOffGatewayValue) ? dropOffGatewayValue : dropOffGatewayDefault;

                                                                    $(this).val(dropOffGatewayDefault);

                                                                    if (!dropOffGToggleFlag) {
                                                                        toggleDropOffGateway(dropOffGatewayToggleObj, false);
                                                                    }

                                                                } else {
                                                                    toggleDropOffGateway(dropOffGatewayToggleObj, false);
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
                                                                    toggleDropOffGateway(dropOffGatewayToggleObj, true);
                                                                }

                                                            }

                                                        }

                                                    });

                                                    var toggleDropOffGateway = function (_toggleElement, _toggleValue) {
                                                        dropOffGatewayToggle = (typeof _toggleValue !== "undefined") ? _toggleValue : !dropOffGatewayToggle;
                                                        toggleArrow(_toggleElement, _toggleValue);
                                                        dropOffGToggleFlag = false;
                                                    };

                                                    dropOffGatewayToggleObj.on("click", function (e) {
                                                        e.stopPropagation();

                                                        if (dropOffGatewayToggle === true || !dropOffGToggleFlag) {
                                                            dropOffGatewayObj.trigger("focus");
                                                            dropOffGatewayObj.trigger("keydown", {
                                                                keyCode: 8
                                                            });

                                                            dropOffGToggleFlag = true;
                                                        }

                                                        toggleArrow(dropOffGatewayToggleObj, dropOffGatewayToggle);
                                                        dropOffGatewayToggle = !dropOffGatewayToggle;
                                                    });

                                                }

                                                if (pickUpGatewayObj.length > 0 && dropOffGatewayObj.length > 0) {

                                                    // SHARED //
                                                    var resetCarsDD = function (_toggleValue) {
                                                        pickUpGatewayObj.trigger("blur");
                                                        dropOffGatewayObj.trigger("blur");
                                                        togglePickUpGateway(pickUpGatewayToggleObj, _toggleValue);
                                                        toggleDropOffGateway(dropOffGatewayToggleObj, _toggleValue);
                                                        pickUpGateToggleInit = false;
                                                    };

                                                    var toggleArrow = function (_toggleObj, _toggleValue) {

                                                        if (_toggleValue === true) {
                                                            _toggleObj.removeClass("fa-angle-down").addClass("fa-angle-up");
                                                        } else {
                                                            _toggleObj.addClass("fa-angle-down").removeClass("fa-angle-up");
                                                        }

                                                    };

                                                    thisWindow.on("click", function () {
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

                                    pageTemplate = defaultTabIndex;

                                } else {
                                    // Load first tab
                                    $(searchBoxTabObj.get(0)).trigger("click");
                                }

                            },

                            loadAdModule: function () {

                                adModuleObj.each(function (index, element) {

                                    var adModuleTabContainerObj = $(element).find(".promo-module-tab-container");
                                    var pageContentObj = $(element).parent().find(".promo-description .wrapper .text");
                                    var adModuleTabsObj = $(element).find(".promo-module-tab-container > ul > li:not(.dropdown)");
                                    var adModuleDDObj = $(element).find(".promo-module-tab-container > ul > li.dropdown");
                                    var adModuleTabCount = adModuleDDObj.find("ul.dropdown-menu > li").length;
                                    var adModuleDDText = adModuleDDObj.find(".rule-name").text();
                                    var currentRuleHREF = "";
                                    var currentRuleName = "";
                                    var adModuleItem = $(element).find(".promo-module-item");

                                    if (adModuleTabCount <= (adModuleTabLimit - 1)) {
                                        // hide drop-down except for mobile
                                        adModuleDDObj.addClass("hidden-sm hidden-md hidden-lg");
                                        // add right border to count item
                                        adModuleDDObj.prev("li").addClass("border-right");
                                    } else {
                                        // hide count items in drop-down
                                        adModuleDDObj.children("ul.dropdown-menu").children("li:lt(" + (adModuleTabLimit - 1) + ")").addClass("hidden-sm hidden-md hidden-lg");
                                    }

                                    // Loop through each ad module tab item and add click event to update drop-down href attribute
                                    adModuleTabsObj.each(function (liIndex, liElement) {

                                        $(liElement).children("a").on("click", function () {

                                            currentRuleHREF = $(this).attr("href");
                                            currentRuleName = $(this).text();

                                            if (currentRuleName && currentRuleHREF) {
                                                updateAdModuleDD(currentRuleHREF);
                                            }

                                            adModuleDDObj.find(".rule-name").text(adModuleDDText);

                                            updateBodyContent(pageContentObj, liIndex);
                                        });

                                    });

                                    // Loop through each drop-down ad module list item
                                    adModuleDDObj.children("ul.dropdown-menu").children("li").children("a").each(function (liIndex, liElement) {

                                        $(liElement).on("click", function () {

                                            currentRuleHREF = $(this).attr("href");
                                            currentRuleName = $(this).text();

                                            if (currentRuleName && currentRuleHREF) {
                                                updateAdModuleDD(currentRuleHREF, currentRuleName);
                                            }

                                            updateBodyContent(pageContentObj, liIndex);
                                        });

                                        // Add split class
                                        if ((liIndex + 1) === adModuleTabLimit) {
                                            $(liElement).parent("li").addClass("split");
                                        }

                                    });

                                    currentRuleName = adModuleObj.find("li.active a").text();
                                    currentRuleHREF = adModuleObj.find("li.active a").attr("href");
                                    updateAdModuleDD(currentRuleHREF);

                                    adModuleTabContainerObj.delay(250).animate({
                                        opacity: 1
                                    }, 500);

                                    // Add Read more overlay logic
                                    adModuleItem.each(function (index, element) {
                                        var thisElement = element;

                                        var adModuleItemReadMore = $(thisElement).find(".hotel-details .more-details");

                                        adModuleItemReadMore.on("click", function (e) {
                                            e.preventDefault();
                                            // update generic modal
                                            $("#generic-modal .modal-title").html($(thisElement).find(".hotelname a").text());
                                            $("#generic-modal .modal-body").html($(thisElement).find(".hotel-details .text").html());
                                            $("#generic-modal").trigger("click");
                                        });
                                    });

                                    if (typeof hotelCodeArray !== "undefined") {

                                        //ajax to load the images and points, Variables are initialized on promo index page.
                                        $.each(hotelCodeArray, function (key, value) {
                                            $.ajax({
                                                url: promoHotelURL + value,
                                                data: {
                                                    format: "json"
                                                },
                                                error: function () {
                                                    window.console && console.log("Service Failed");
                                                },
                                                dataType: 'json',
                                                success: function (data) {
                                                    if (typeof data.HotelImages !== "undefined" && typeof data.HotelImages.Img16x9 !== "undefined") {
                                                        $('div[data-name=hotelImage_' + value + ']').css('background-image', 'url(' + app.SWGApplication.dataModel.protocol + data.HotelImages.Img16x9[0].substring(5) + ')');
                                                    }
                                                    else {
                                                        $('div[data-name=hotelImage_' + value + ']').addClass("missing");
                                                    }
                                                    if (typeof data.ResortOverview !== "undefined" && typeof data.ResortOverview.Description !== "undefined") {
                                                        $('div[data-name=description_' + value + ']').html(data.ResortOverview.Description);
                                                    }
                                                },
                                                type: "GET"
                                            });
                                        });
                                    }

                                });

                                function updateAdModuleDD(_href, _name) {

                                    if (_href) {
                                        adModuleDDObj.find(".rule-name").attr("data-href", _href);
                                    }

                                    if (_name) {
                                        adModuleDDObj.find(".rule-name").text(_name);
                                    }
                                }

                                function updateBodyContent(_pageContentObj, _item) {

                                    _pageContentObj.children("div").each(function (_index, _element) {

                                        if (_index === _item) {

                                            $(_element).removeClass("hide").addClass("show");
                                        } else {
                                            $(_element).removeClass("show").addClass("hide");
                                        }

                                    });

                                }

                                function updateMobileTab() {

                                    var activeTabHREF = "";
                                    var activeTabName = "";
                                    var activeTabObj = null;

                                    if (viewPortChange && currentViewPort === "xs") {

                                        adModuleObj.each(function (index, element) {
                                            activeTabHREF = $(element).find(".rule-name").attr("data-href");
                                            activeTabObj = $(element).find(".active a[href='" + activeTabHREF + "']");
                                            activeTabName = activeTabObj.text();

                                            $(element).find(".promo-module-tab-container > ul > li.dropdown .dropdown-menu a[href='" + activeTabHREF + "']").trigger("click");
                                        });

                                        updateAdModuleDD(activeTabHREF, activeTabName);

                                    } else if (viewPortChange && currentViewPort !== "xs") {

                                        adModuleObj.each(function (index, element) {
                                            activeTabHREF = $(element).find(".rule-name").attr("data-href");
                                            activeTabObj = $(element).find(".active a[href='" + activeTabHREF + "']");
                                            activeTabName = activeTabObj.text();

                                            var liSelected = $(element).find(".promo-module-tab-container > ul > li:not(.dropdown) a[href='" + activeTabHREF + "']");
                                            if (!liSelected.parent("li").hasClass("active")) {
                                                liSelected.trigger("click");
                                            }

                                        });
                                    }

                                }

                                thisWindow.on("resize", updateMobileTab);
                            },

                            loadSignUpNo1ToTheSun: function () {

                                var signUpContentsObj = signUpNo1ToTheSunObj.find(".signup-container");
                                var signUpContentsSliderObj = signUpContentsObj.find(".form-group-slider");
                                var signUpEmailObj = signUpContentsObj.find("#signUpEmail");
                                var signUpSubmit = signUpContentsSliderObj.find(".cta button");
                                var signUpCloseObj = signUpContentsObj.find("button.close");
                                var slideWidth, slideContainerWidth, slideBorderWidth, slidePercentage;

                                var signUpToggleButtonObj = signUpNo1ToTheSunObj.find(".display-group .toggleButton");
                                var signUpToggleHeadingObj = signUpNo1ToTheSunObj.find(".display-group > .message");
                                var signUpToggleObj = signUpNo1ToTheSunObj.find(".display-group .form-group");

                                function closeSignUp() {
                                    if (Modernizr.touch) {
                                        viewportObj.removeClass("scroll-lock");
                                        signUpNo1ToTheSunObj.closest(".container").removeClass("scroll-lock-bg");
                                        signUpNo1ToTheSunObj.css("position", "");
                                        viewportObj.off("touchmove.lock");
                                    }
                                }

                                signUpToggleHeadingObj.on("click", function () {

                                    if (currentViewPort !== "xs") return;

                                    this.activeState = (typeof this.activeState !== "undefined") ? this.activeState : false;

                                    if (this.activeState) {
                                        // slide down
                                        signUpEmailObj.val("").blur();
                                        signUpToggleObj.slideToggle(function () {
                                            signUpToggleButtonObj.find("i").addClass("fa-chevron-up").removeClass("fa-chevron-down");
                                            signUpInputFlag = false;

                                            closeSignUp();

                                            viewportObj.css("height", "");
                                            thisWindow.trigger("resize");
                                        });

                                    } else {
                                        // slide up
                                        signUpToggleObj.slideToggle(function () {
                                            signUpToggleButtonObj.find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
                                            signUpInputFlag = true;

                                            if (Modernizr.touch) {
                                                viewportObj.addClass("scroll-lock");
                                                signUpNo1ToTheSunObj.closest(".container").addClass("scroll-lock-bg");
                                                signUpNo1ToTheSunObj.css("position", "fixed");

                                                viewportObj.on("touchmove.lock", function (e) {
                                                    e.preventDefault();
                                                });

                                                viewportObj.css("height", windowScrollTop + Math.round(thisWindow.height()) + "px");
                                            }

                                        });
                                    }

                                    this.activeState = !this.activeState;
                                });

                                // Capture Container clicks so form doesn't close
                                signUpContentsObj.on("click", function (e) {
                                    e.stopPropagation();
                                });

                                // Close dialog box
                                signUpCloseObj.on("click", function () {
                                    signUpContentsObj.fadeOut("fast");
                                    signUpInputFlag = false;
                                    closeSignUp();
                                    viewportObj.css("height", "");
                                    thisWindow.trigger("resize");
                                });

                                // Handle email triggers to display / hide the form
                                signUpEmailObj.on("blur input", function (e) {

                                    if (e.type === "input" && $(this).val()) {
                                        showForm();
                                    } else if (e.type === "blur" && !$(this).val() || e.type === "input" && !$(this).val()) {
                                        hideForm();
                                    }

                                });

                                // Force overflow to avoid having the tooltip error message cut-off when user submits
                                signUpSubmit.on("click", function (e) {

                                    if (slideState) {
                                        signUpNo1ToTheSunObj.css("overflow", "visible");
                                    } else {
                                        e.preventDefault();
                                    }

                                });

                                // Recalculate container widths to correctly display form at all viewport sizes
                                thisWindow.on("resize", updateSlide);

                                function updateSlide() {
                                    updateSlideCalculations();

                                    if (slideState) {
                                        showForm();
                                    }
                                }

                                function updateSlideCalculations() {
                                    slideWidth = parseInt(signUpContentsSliderObj.css("width"), 10);
                                    slideContainerWidth = signUpContentsObj.closest(".container").width();
                                    slideBorderWidth = parseInt(signUpContentsSliderObj.css("border-top-width"), 10);
                                    slidePercentage = ((slideContainerWidth - slideWidth - slideBorderWidth) / slideContainerWidth) * 100;
                                }

                                function showForm() {

                                    if (signUpEmailObj.val()) {
                                        updateSlideCalculations();

                                        if (slideVorH === "horizontal" && !slideState) {

                                            signUpContentsSliderObj.css("opacity", 1);
                                            signUpContentsObj.addClass("open");
                                            signUpContentsSliderObj.fadeIn(0).stop().dequeue().show().animate({
                                                left: slidePercentage + "%"
                                            }, 500, "easeOutExpo", function () {
                                                slideState = true;
                                            });

                                        } else if (slideVorH === "vertical" && !slideState) {

                                            signUpContentsObj.addClass("open");

                                            signUpContentsSliderObj.slideDown(500, function () {

                                                $(this).animate({
                                                    opacity: 1
                                                }, 500, "easeOutExpo", function () {
                                                    $(this).css("display", "inline-block");
                                                    slideState = true;
                                                });

                                            });

                                        } else if (slideVorH === "horizontal" && slideState) {
                                            // if the form is on screen all ready, then just force left property to be full percentage width
                                            updateSlideCalculations();
                                            signUpContentsSliderObj.css("left", slidePercentage + "%");

                                        }
                                    }
                                }

                                function hideForm() {

                                    if (!signUpEmailObj.val()) {

                                        if (slideVorH === "horizontal") {

                                            signUpContentsObj.find(".form-error-container").addClass("hide");
                                            signUpNo1ToTheSunObj.css("overflow", "hidden");

                                            signUpContentsSliderObj.stop().dequeue().animate({
                                                left: "-20%"
                                            }, 500, "easeInOutExpo", function () {
                                                signUpContentsObj.removeClass("open");
                                                $(this).hide();
                                                slideState = false;
                                            });

                                        } else if (slideVorH === "vertical") {

                                            signUpContentsSliderObj.stop().dequeue().animate({
                                                opacity: 0
                                            }, 500, "easeInOutExpo", function () {
                                                signUpContentsObj.removeClass("open");
                                                $(this).slideUp(500);
                                                slideState = false;
                                            });
                                        }

                                    }

                                }

                                viewportObj.on("click", function () {
                                    hideForm();
                                });

                                $(errorToolTip).on("click", function () {
                                    $(this).closest(".form-error-container").hide();
                                });

                                /* START: Input Fields Data and Error handling supplied by Pramod Patel */
                                $("#txtDepCity").val("");

                                $("#txtDepCity").autocomplete({
                                    source: function (request, response) {
                                        $.ajax({
                                            url: gateWayURL + request.term,
                                            dataType: "json",
                                            data: {
                                                maxRows: 12,
                                                name_startsWith: request.term
                                            },
                                            success: function (data) {
                                                response($.map(data, function (items) {
                                                    return {
                                                        id: items.id,
                                                        label: items.label + " (" + items.gatewayCode + ")"
                                                    };
                                                }));
                                            }
                                        });
                                    },
                                    minLength: 3,
                                    select: function (event, ui) {
                                        $("#txtDepCity").val(ui.item.label);
                                        $("#htxtDepCity").val(ui.item.id);
                                        return false;
                                    },
                                });

                                $("#formNewsLetter").submit(function () {
                                    if (app.SWGApplication.dataController.validateSignUp()) {
                                        $.ajax({
                                            header: {
                                                "Accept": "application/json",
                                                "content-Type": "application/json; charset=utf-8",
                                                "Origin": "sunwing.ca",
                                            },
                                            url: "/Home/Signup",
                                            type: "POST",
                                            data: $("#formNewsLetter").serialize(),
                                            dataType: 'JSON',
                                            success: function (response) {
                                                if (response === "Success") {
                                                    $("#formNewsLetter").hide();
                                                    $("#email-instruction").hide();
                                                    $("#email-success").show();

                                                    // Success CSS 
                                                    signUpContentsObj.removeClass("open");
                                                }
                                            },
                                            fail: function (response) {
                                                if (response === "Failed") {
                                                    $("#email-fail").show();
                                                }
                                            },
                                            error: function () {
                                                $("#email-fail").show();
                                            }
                                        });
                                    }

                                    return false;
                                });

                                $("#txtDepCity").keypress(function () {
                                    $("#txtDepCityError").addClass("hide");
                                });

                                $("#signUpEmail").keypress(function () {
                                    $("#signUpEmailError").addClass("hide");
                                });

                                /* END: */

                                // Display Form Animation or show
                                if (currentViewPort !== "xs" && currentViewPort !== "sm") {

                                    signUpNo1ToTheSunObj.css("bottom", "0").css("display", "block");
                                    signUpNo1ToTheSunObj.animate({
                                        opacity: 1,
                                        bottom: 45
                                    }, 1000, "easeOutBack", function () {
                                        $(this).css("bottom", "");
                                    });

                                } else {
                                    signUpNo1ToTheSunObj.css("opacity", "1").css("display", "block");
                                }
                            },

                            validateSignUp: function () {

                                var valid = 0;
                                var test_regex = /^[a-zA-Z(),-\u00E0-\u00FC ]{2,100}$/;
                                var email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                                var gateway = $("#txtDepCity").val();
                                var your_email = $("#signUpEmail").val();
                                var hgateway = $("#htxtDepCity").val();
                                $("#signUpEmailError").addClass("hide");
                                $("#txtDepCityError").addClass("hide");

                                if (!gateway.match(test_regex) || hgateway === "") {
                                    $("#txtDepCityError").removeClass("hide");
                                    $("#txtDepCityError").css("display", "block");
                                    $("#txtDepCity").focus();
                                    valid = 2;
                                }

                                if (!your_email.match(email_regex)) {
                                    $("#signUpEmailError").removeClass("hide");
                                    $("#signUpEmailError").css("display", "block");
                                    $("#signUpEmail").focus();
                                    valid = 1;
                                }

                                if (valid !== 0) {
                                    return false;
                                } else {
                                    return true;
                                }

                            },

                            getSlideVorH: function () {
                                slideVorH = (currentViewPort === "xs" || currentViewPort === "sm") ? "vertical" : "horizontal";
                                return slideVorH;
                            },

                            loadBackToTop: function () {

                                var clicked = false;
                                backToTopLoaded = true;

                                backToTopObj.on("click focus", function (e) {
                                    e.preventDefault();
                                    clicked = true;

                                    viewportObj.animate({
                                        scrollTop: 0
                                    }, 1500, "easeOutCirc", function () {
                                        backToTopObj.find("a").blur();
                                        clicked = false;
                                    });

                                });

                                // Stop the animation if the user interacts with the page
                                viewportObj.on("scroll mousedown DOMMouseScroll mousewheel keyup touchstart", function (e) {

                                    if (clicked) {
                                        if (e.which > 0 && e.which !== 13 || e.type === "mousedown" || e.type === "mousewheel" || e.type === "touchstart") {
                                            $(this).stop().dequeue();
                                            backToTopObj.find("a").blur();
                                            clicked = false;
                                        }
                                    }

                                });

                            },

                            checkBrowserWidth: function () {
                                var windowWidth = thisWindow.width();
                                return windowWidth;
                            },

                            updateScroll: function () {
                                windowScrollTop = thisWindow.scrollTop();

                                if (windowScrollTop < windowScrollTopPrev) {
                                    moveDirection = "up";
                                } else if (windowScrollTop > windowScrollTopPrev) {
                                    moveDirection = "down";
                                }

                                windowScrollTopPrev = windowScrollTop;
                            },

                            loadPrimarySlider: function () {

                                var bxSliderCount = sliderObj.find(".primary-slider li").length;

                                var infiniteLoop;
                                var controls;
                                var buttonHTML = "";

                                if (bxSliderCount <= 1) {
                                    infiniteLoop = false;
                                    controls = false;

                                    sliderObj.find(".primary-slider ." + sliderPager).hide();
                                    sliderObj.find(".primary-slider ." + sliderWrapperClass).hide();

                                } else {

                                    slideShowObj = sliderObj.find(".primary-slider").closest("." + sliderContainerClass);

                                    infiniteLoop = true;
                                    controls = true;

                                    slideShowObj.find("." + sliderPager).remove();
                                    slideShowObj.append($("<div>").addClass(sliderPager));

                                    for (var i = 0; i < bxSliderCount; i++) {
                                        buttonHTML += '<a data-slide-index="' + i + '" href></a>';
                                        buttonHTML += '\n'; // add newline character
                                    }

                                    sliderObj.find("." + sliderPager).html(buttonHTML);

                                }

                                bxSliderPluginObj = sliderObj.find(".primary-slider").bxSlider({
                                    auto: true,
                                    autoControls: true,
                                    mode: "fade",
                                    autoResume: true,
                                    useCSS: true,
                                    responsive: true,
                                    pagerCustom: "." + sliderPager,
                                    wrapperClass: sliderWrapperClass,
                                    pause: 5000,
                                    slideMargin: 15,
                                    easing: (Modernizr.csstransitions) ? "ease-in-out" : "swing",
                                    prevText: '<i class="fa fa-chevron-left"></i>',
                                    nextText: '<i class="fa fa-chevron-right"></i>',
                                    infiniteLoop: true,
                                    controls: (bxSliderCount <= 1) ? false : true,
                                    onSliderLoad: function ($thisSlider, currentIndex) {
                                        $thisSlider.closest("." + sliderWrapperClass).show();
                                        sliderLoadedFlag = true;

                                        loadPNTabbing($thisSlider);
                                    }
                                });

                                function loadPNTabbing(_thisSliderObj) {

                                    _thisSliderObj.next().find(".bx-prev").on("focus blur", function (e) {

                                        if (e.type === "focus") {
                                            $(this).closest(".bx-controls").addClass("opacity-full");
                                        } else {
                                            $(this).closest(".bx-controls").removeClass("opacity-full");
                                        }

                                    });

                                    _thisSliderObj.next().find(".bx-next").on("focus blur", function (e) {
                                        if (e.type === "focus") {
                                            $(this).closest(".bx-controls").addClass("opacity-full");
                                        } else {
                                            $(this).closest(".bx-controls").removeClass("opacity-full");
                                        }
                                    });
                                }

                            },

                            unloadPrimarySlider: function () {
                                if (typeof bxSliderPluginObj !== "undefined" && sliderObj.find("." + sliderWrapperClass)) {
                                    bxSliderPluginObj.destroySlider();
                                    sliderLoadedFlag = false;
                                }
                            },

                            loadMobileSlider: function () {

                                var bxSliderCount = mobileSliderObj.find(".mobile-primary-slider li").length;
                                var infiniteLoop;
                                var controls;
                                var buttonHTML = "";

                                if (bxSliderCount <= 1) {
                                    infiniteLoop = false;
                                    controls = false;

                                    mobileSliderObj.find(".mobile-primary-slider ." + mobileSliderPager).hide();
                                    mobileSliderObj.find(".mobile-primary-slider ." + mobileSliderWrapperClass).hide();

                                } else {

                                    mobileSlideShowObj = mobileSliderObj.find(".mobile-primary-slider").closest("." + mobileSliderContainerClass);

                                    infiniteLoop = true;
                                    controls = true;

                                    mobileSlideShowObj.find("." + mobileSliderPager).remove();
                                    mobileSlideShowObj.append($("<div>").addClass(mobileSliderPager));

                                    for (var i = 0; i < bxSliderCount; i++) {
                                        buttonHTML += '<a data-slide-index="' + i + '" href></a>';
                                        buttonHTML += '\n'; // add newline character
                                    }

                                    mobileSliderObj.find("." + mobileSliderPager).html(buttonHTML);

                                }

                                bxSliderMobilePluginObj = mobileSliderObj.find(".mobile-primary-slider").bxSlider({
                                    auto: true,
                                    autoControls: true,
                                    mode: "fade",
                                    autoResume: true,
                                    useCSS: true,
                                    responsive: true,
                                    pagerCustom: "." + mobileSliderPager,
                                    wrapperClass: mobileSliderWrapperClass,
                                    adaptiveHeight: true,
                                    pause: 5000,
                                    slideMargin: 15,
                                    easing: (Modernizr.csstransitions) ? "ease-in-out" : "swing",
                                    prevText: '<i class="fa fa-chevron-left"></i>',
                                    nextText: '<i class="fa fa-chevron-right"></i>',
                                    infiniteLoop: true,
                                    controls: (bxSliderCount <= 1) ? false : true,
                                    onSliderLoad: function ($thisSlider, currentIndex) {

                                        $thisSlider.css("height", mobileSliderObj.width() / mobileSliderRatio);
                                        $thisSlider.closest("." + mobileSliderWrapperClass).show();

                                        mobileSliderLoadedFlag = true;
                                        loadPNTabbing($thisSlider);
                                    }
                                });

                                function loadPNTabbing(_thisSliderObj) {

                                    _thisSliderObj.next().find(".bx-prev").on("focus blur", function (e) {

                                        if (e.type === "focus") {
                                            $(this).closest(".bx-controls").addClass("opacity-full");
                                        } else {
                                            $(this).closest(".bx-controls").removeClass("opacity-full");
                                        }

                                    });

                                    _thisSliderObj.next().find(".bx-next").on("focus blur", function (e) {
                                        if (e.type === "focus") {
                                            $(this).closest(".bx-controls").addClass("opacity-full");
                                        } else {
                                            $(this).closest(".bx-controls").removeClass("opacity-full");
                                        }
                                    });

                                }

                            },

                            unloadMobileSlider: function () {
                                if (typeof bxSliderMobilePluginObj !== "undefined") {
                                    bxSliderMobilePluginObj.destroySlider();
                                    mobileSliderLoadedFlag = false;
                                }
                            },

                            loadSWGMobileAppSlider: function () {

                                var bxSliderCount = $(".swg-app-bx-wrapper .bxslider > li").length;

                                var infiniteLoop;
                                var controls;
                                var buttonHTML = "";

                                if (bxSliderCount <= 1) {
                                    infiniteLoop = false;
                                    controls = false;

                                    $("." + mobileAppSliderPager).hide();
                                    $("." + mobileAppSliderWrapperClass).hide();

                                } else {

                                    mobileAppSlideShowObj = $("." + mobileAppSliderWrapperClass);

                                    infiniteLoop = true;
                                    controls = true;

                                    mobileAppSlideShowObj.find(".buttons").before($("<div>").addClass(mobileAppSliderPager).addClass("col-xs-12"));

                                    for (var i = 0; i < bxSliderCount; i++) {
                                        buttonHTML += '<a data-slide-index="' + i + '" href></a>';
                                        buttonHTML += '\n'; // add newline character
                                    }

                                    $("." + mobileAppSliderPager).html(buttonHTML);

                                }

                                mobileAppSliderPluginObj = mobileAppSliderObj.bxSlider({
                                    auto: true,
                                    autoControls: true,
                                    mode: "fade",
                                    autoResume: true,
                                    useCSS: true,
                                    responsive: true,
                                    hideControlOnEnd: true,
                                    adaptiveHeight: true,
                                    pagerCustom: "." + mobileAppSliderPager,
                                    wrapperClass: mobileAppSliderWrapperClass,
                                    pause: 8000,
                                    speed: 1000,
                                    slideMargin: 15,
                                    easing: (Modernizr.csstransitions) ? "easeOutExpo" : "swing",
                                    prevText: '<i class="fa fa-angle-left"></i>',
                                    nextText: '<i class="fa fa-angle-right"></i>',
                                    infiniteLoop: true,
                                    onSliderLoad: function () {
                                        setTimeout(function () {
                                            mobileAppSliderObj.css("visibility", "visible");
                                        }, 1000);

                                    }
                                });

                            },

                            loadLPCSearchBox: function () {

                                var searchBoxOptions = datePickerOptions;
                                var tomorrowsDate = moment().format("YYYY-MM");

                                if (typeof userDate !== "undefined") {
                                    if (userDate !== "") tomorrowsDate = userDate;
                                }

                                searchBoxOptions.defaultDate = tomorrowsDate;
                                searchBoxOptions.minDate = tomorrowsDate;
                                searchBoxOptions.maxDate = moment().add(334, "days");
                                // 
                                searchBoxOptions.viewMode = "months";
                                searchBoxOptions.format = "MMMM YYYY";

                                // Initialize calendar instance
                                lpcSearchBoxObj.find(".calendar").datetimepicker(searchBoxOptions);

                                if (!Modernizr.touch) {
                                    lpcSearchBoxObj.find(".calendar").removeAttr("readonly");
                                }

                                lpcSearchBoxObj.find(".calendar").on("click", function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                });

                            },

                            loadLPCSliderImg: function () {

                                var hotelImgCodes = "";
                                $(".bxSlider .slide.carousel-feature .feature-item .feature-container").find("img").each(function () {
                                    hotelImgCodes = hotelImgCodes + $(this).attr("data-name") + "|";
                                });

                                if (typeof hotelImgCodes !== "undefined") {
                                    $.ajax({
                                        url: promoHotelURL + hotelImgCodes,
                                        data: {
                                            format: "json"
                                        },
                                        error: function () {
                                            window.console && console.log("Service Failed");
                                        },
                                        dataType: "json",
                                        success: function (data) {

                                            for (var i = 0; i < data.length - 1; i++) {
                                                if (data[i].HotelImages !== null && data[i].HotelImages !== "undefined") {
                                                    $("img[data-name=" + data[i].HotelCode + "]").prop("src", app.SWGApplication.dataModel.protocol + data[i].HotelImages.Img4x3[0].substring(5));
                                                } else {
                                                    $("img[data-name=" + data[i].HotelCode + "]").prop("src", "/Content/images/hotel/error/photo-no-image-" + app.SWGApplication.dataModel.language + ".jpg");
                                                }
                                            }

                                            app.SWGApplication.dataController.loadCarouselSlider();
                                        },
                                        type: "GET"
                                    });

                                }
                            },

                            loadCarouselSlider: function () {

                                var slideMaxSlideCount, slideWidth, sliderOptions, slideTotal, slideMargin;
                                var infiniteLoop = false;
                                var buttonHTML;

                                slideCarouselObj.each(function (index, element) {

                                    buttonHTML = "";
                                    slideMaxSlideCount = $(element).data("max-slides");
                                    slideWidth = $(element).data("slide-width");
                                    slideMargin = $(element).data("slide-margin");
                                    slideTotal = Math.ceil($(element).find(".bxSlider > .slide").length / slideMaxSlideCount);

                                    if (slideTotal <= 1) {
                                        infiniteLoop = false;

                                        $(element).find("." + slideCarouselControlsClass).hide();

                                    } else {

                                        infiniteLoop = true;

                                        for (var i = 0; i < slideTotal; i++) {
                                            buttonHTML += '<a data-slide-index="' + i + '" href></a>';
                                            buttonHTML += '\n'; // add newline character
                                        }

                                        $(element).find("." + slideCarouselPager).html(buttonHTML);
                                    }

                                    sliderOptions = {
                                        auto: false,
                                        autoControls: true,
                                        hideControlOnEnd: true,
                                        autoResume: true,
                                        responsive: true,
                                        pagerCustom: $(element).find("." + slideCarouselPager),
                                        pause: 8000,
                                        speed: 1000,
                                        easing: "easeOutExpo",
                                        prevSelector: $(element).find(".carousel-bx-prev"),
                                        nextSelector: $(element).find(".carousel-bx-next"),
                                        prevText: '<i class="fa fa-angle-left"></i>',
                                        nextText: '<i class="fa fa-angle-right"></i>',
                                        infiniteLoop: false,
                                        useCSS: false,
                                        slideWidth: slideWidth,
                                        minSlides: slideMaxSlideCount,
                                        maxSlides: slideMaxSlideCount,
                                        slideMargin: (typeof slideMargin !== "undefined") ? slideMargin : slideCarouselMargin,
                                        adaptiveHeight: true,
                                        autoHover: true,
                                        onSliderLoad: function () {

                                            setTimeout(function () {
                                                $(element).css("visibility", "visible");
                                            }, 100);

                                        },

                                        // custom settings
                                        slidersTotal: $(element).find(".bxSlider > .slide").length,
                                        pagerHTML: buttonHTML
                                    };


                                    var thisSliderInstance = $(element).find(".bxSlider").bxSlider(sliderOptions);

                                    slideCarouselPluginObjArray.push([thisSliderInstance, sliderOptions]);
                                });

                                slideCarouselLoadedFlag = true;

                                // Reload sliders if loaded in the following viewports
                                if (currentViewPort === "xs" || currentViewPort === "sm") {
                                    app.SWGApplication.dataController.reloadCarouselSlider();
                                }
                            },

                            reloadCarouselSlider: function () {

                                $.each(slideCarouselPluginObjArray, function (pluginIndex, pluginValue) {
                                    var total = pluginValue.length;
                                    var instance, instanceOptions, tempOptions;
                                    var visibleSlides;
                                    var reloadSlider = false;
                                    var buttonHTML = "";

                                    for (var i = 0; i < total; i++) {
                                        if (i === 0) {
                                            instance = pluginValue[i];
                                        } else if (i === 1) {
                                            instanceOptions = pluginValue[i];
                                        }
                                    }

                                    // Check if instance needs to be reloaded by cloning original settings
                                    tempOptions = $.extend(true, {}, instanceOptions);

                                    if (currentViewPort === "xs") {
                                        visibleSlides = 1;

                                        tempOptions.minSlides = visibleSlides;
                                        tempOptions.maxSlides = visibleSlides;
                                        tempOptions.slideWidth = 767;
                                        tempOptions.adaptiveHeight = true;
                                        tempOptions.mode = "fade";

                                        reloadSlider = true;

                                    } else if (currentViewPort === "sm") {
                                        visibleSlides = 2;

                                        tempOptions.minSlides = visibleSlides;
                                        tempOptions.maxSlides = visibleSlides;
                                        reloadSlider = true;

                                    } else if (currentViewPort === "md") {
                                        visibleSlides = 3;

                                        tempOptions.minSlides = visibleSlides;
                                        tempOptions.maxSlides = visibleSlides;
                                        reloadSlider = true;

                                    } else if (currentViewPort === "lg") {
                                        visibleSlides = 3;

                                        tempOptions.minSlides = (instanceOptions.minSlides > visibleSlides) ? instanceOptions.minSlides : visibleSlides;
                                        tempOptions.maxSlides = (instanceOptions.maxSlides > visibleSlides) ? instanceOptions.maxSlides : visibleSlides;
                                        reloadSlider = true;
                                    }

                                    if (tempOptions.slidersTotal > tempOptions.minSlides) {
                                        // Check if infinite sliding is appropriate
                                        //tempOptions.infiniteLoop = true;

                                        $(instance.get(0)).closest(".slider-carousel").find("." + slideCarouselControlsClass).show();

                                        // Remove old pager arrows because plugin appends
                                        tempOptions.prevSelector.empty();
                                        tempOptions.nextSelector.empty();

                                        // Generate new pager HTML based on slides & new minSlide value
                                        tempOptions.slidersTotal = Math.ceil(tempOptions.slidersTotal / tempOptions.minSlides);

                                        for (var j = 0; j < tempOptions.slidersTotal; j++) {
                                            buttonHTML += '<a data-slide-index="' + j + '" href></a>';
                                            buttonHTML += '\n'; // add newline character
                                        }

                                        tempOptions.pagerCustom.html(buttonHTML);

                                    } else {

                                        $(instance.get(0)).closest(".slider-carousel").find("." + slideCarouselControlsClass).hide();
                                    }

                                    if (reloadSlider) {
                                        instance.destroySlider();
                                        instance.reloadSlider(tempOptions);
                                    }

                                    buttonHTML = "";

                                });
                            },

                            updateCarouselPager: function () {

                                if ($.fn.bxSlider && slideCarouselExists) {

                                    if (slideCarouselLoadedFlag) {

                                        $.each(slideCarouselPluginObjArray, function (pluginIndex, pluginValue) {
                                            var total = pluginValue.length;
                                            var instance, instanceOptions;

                                            for (var i = 0; i < total; i++) {
                                                if (i === 0) {
                                                    instance = pluginValue[i];
                                                } else if (i === 1) {
                                                    instanceOptions = pluginValue[i];
                                                }
                                            }

                                            var buttonWidth = 3 * Math.ceil($(instance.get(0)).closest(".slider-carousel").find("." + slideCarouselPrevButton).outerWidth(true));
                                            var pagerWidth = Math.ceil($(instance.get(0)).closest(".slider-carousel").find("." + slideCarouselPager).width());
                                            var containerWidth = $(instance.get(0)).closest(".slider-carousel").width();

                                            if (buttonWidth + pagerWidth <= containerWidth) {
                                                $(instance.get(0)).closest(".slider-carousel").find("." + slideCarouselPager).removeClass("hidden-offscreen");
                                            } else if (buttonWidth + pagerWidth > containerWidth) {
                                                $(instance.get(0)).closest(".slider-carousel").find("." + slideCarouselPager).addClass("hidden-offscreen");
                                            }

                                        });

                                    }

                                }

                            },

                            loadAccordionTab: function () {

                                accordionTabObj.each(function (index, element) {

                                    var tabObj = $(element).find("ul.accordion-tabs > li");
                                    var accordionPanelHeadingObj = $(element).find(".tab-accordion-heading");
                                    var accordionPanelContainerObj = $(element).find(".accordion-panel-container");
                                    var accordionPanelContentObj = $(element).find(".accordion-tab-content");
                                    var accordionPanelReadMoreObj = $(element).find(".read-more");
                                    var activeTab, lastActiveTab, defaultTab;

                                    /* Update tab mode */
                                    tabObj.each(function (indexTab, elementTab) {

                                        var liTabObj = $(elementTab);
                                        var anchorTabObj = liTabObj.find("a");

                                        defaultTab = (liTabObj.hasClass("default")) ? indexTab : defaultTab;

                                        if (indexTab === 0 && tabObj.length === 1) {
                                            accordionTabObj.addClass("one-tab");
                                        }


                                        liTabObj.on("click", function (e) {
                                            e.preventDefault();

                                            activeTab = anchorTabObj.data("id");

                                            if (activeTab === lastActiveTab) return;
                                            lastActiveTab = activeTab;

                                            // Set active tabs
                                            tabObj.removeClass("active");
                                            $(this).addClass("active");

                                            // Update accordion content removal transition
                                            accordionPanelHeadingObj.removeClass("active-panel");

                                            if (currentViewPort === "xs") {
                                                accordionPanelContentObj.slideUp();
                                            } else {
                                                accordionPanelContentObj.hide();
                                            }

                                            // Set active panel and content display transition
                                            accordionPanelContainerObj.find("[data-id='" + activeTab + "']").addClass("active-panel");

                                            if (currentViewPort === "xs") {
                                                accordionPanelContainerObj.find("[id='" + activeTab + "']").slideDown();
                                            } else {
                                                accordionPanelContainerObj.find("[id='" + activeTab + "']").fadeIn();
                                                app.SWGApplication.dataController.reloadAccordionTab();
                                            }

                                        });

                                    });

                                    /* Update accordion mode */
                                    accordionPanelHeadingObj.on("click", function (e) {
                                        e.preventDefault();

                                        activeTab = $(this).data("id");

                                        if (activeTab === lastActiveTab) return;
                                        lastActiveTab = activeTab;

                                        // Update accordion content removal transition
                                        accordionPanelHeadingObj.removeClass("active-panel");

                                        if (currentViewPort === "xs") {
                                            accordionPanelContentObj.slideUp();
                                        } else {
                                            accordionPanelContentObj.hide();
                                        }

                                        // Set active panel and content display transition
                                        $(this).addClass("active-panel");

                                        if (currentViewPort === "xs") {
                                            accordionPanelContainerObj.find("[id='" + activeTab + "']").slideDown();
                                        } else {
                                            accordionPanelContainerObj.find("[id='" + activeTab + "']").fadeIn();
                                        }

                                        // Set active tabs
                                        tabObj.removeClass("active");
                                        tabObj.find("a[data-id='" + activeTab + "']").parent().addClass("active");
                                    });

                                    // Attach click event to all read-more objects
                                    accordionPanelReadMoreObj.on("click", function (e) {
                                        e.preventDefault();

                                        if (typeof this.toggle === "undefined" || !this.toggle) {

                                            $(this).text(CommonDictionary.showLess);
                                            $(this).closest(".accordion-tab-content").removeClass("mask").addClass("show-all");
                                            this.toggle = true;
                                        } else {
                                            $(this).text(CommonDictionary.readMore);
                                            $(this).closest(".accordion-tab-content").addClass("mask").removeClass("show-all");
                                            this.toggle = false;
                                        }

                                    });

                                    // Initialize default tab display
                                    if (defaultTab) {
                                        tabObj.eq(defaultTab).children("a").trigger("click");
                                    } else {
                                        tabObj.first().children("a").trigger("click");
                                    }

                                    accordionTabArray.push($(element));

                                });

                            },

                            reloadAccordionTab: function () {

                                var visibleTab = null;

                                $.each(accordionTabArray, function (index, value) {
                                    if (value.is(":visible")) {
                                        visibleTab = value.find(".accordion-tabs .active > a").data("id");

                                        if ($("[id='" + visibleTab + "']").find(".read-more").length) {
                                            showReadMore(value.find("[id='" + visibleTab + "']"));
                                        }

                                    }
                                });

                                function showReadMore(_this) {

                                    // Display Read More, if required | offset by body font-size in pixels
                                    if ($(_this).outerHeight(true) - parseInt(viewportObj.css("font-size"), 10) < $(_this).get(0).scrollHeight && !$(_this).hasClass("show-all")) {
                                        $(_this).addClass("mask");
                                    }

                                }

                            },

                            loadExcursionStep1Content: function () {
                                this.loadMultiColumnTable();
                            },

                            loadMultiColumnTable: function () {

                                var excursionDataSource = hotelServicesURL + app.SWGApplication.dataModel.language + "/AllHotelDestinationList/";
                                var excursionArray = { "dataList": [] };
                                var listOffset = 2;

                                if ($.isEmptyObject(excursionStep1Data)) {

                                    $.ajax({
                                        type: "GET",
                                        url: excursionDataSource,
                                        dataType: "json",
                                        cache: false,
                                        success: function (excursionData) {

                                            if (!$.isEmptyObject(excursionData)) {

                                                excursionStep1Data = excursionData;
                                                displayMultiColumnData();

                                            } else {
                                                // Excursion data is unavailable
                                                window.console && console.log("Remove excursion destination table - no data");
                                            }
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            // excursion service not available
                                            window.console && console.log("Remove excursion destination table - service not available");
                                        }

                                    });

                                } else {
                                    displayMultiColumnData();
                                }

                                function displayMultiColumnData() {
                                    var destinationsTotal = 0;
                                    countryTotal = 0;

                                    $.each(excursionStep1Data, function (index, dataNode) {
                                        excursionArray.dataList[index] = [{ "country": dataNode.countryName }, { "destination": dataNode.destinations }];
                                        countryTotal++;
                                        destinationsTotal = dataNode.destinations.length;

                                        destinationMax = (destinationMax < destinationsTotal) ? destinationsTotal : destinationMax;
                                    });

                                    multiColumnTableObj.each(function (index, element) {
                                        var scrollInterval = 0;
                                        generateHTML();
                                        $(element).closest(".multi-column-table-container").fadeIn(1000);
                                        scrollInterval = updateHTML(element);
                                        app.SWGApplication.dataController.addScrollListener(element, scrollInterval);
                                    });

                                }

                                function generateHTML() {
                                    var htmlString = "";
                                    var counter = 0;

                                    // Create the country and destination HTML sections in the htmlArray, with the elements counter value
                                    $.each(excursionArray.dataList, function (eIndex, eValue) {
                                        var countryURL = app.SWGApplication.dataController.classifyString(eValue[0].country, "urlConversionDictionary");

                                        htmlString += "<span class='country'>" + eValue[0].country + "</span>";
                                        counter++;

                                        $.each(eValue[1].destination, function (dIndex, dValue) {
                                            var destinationURL = app.SWGApplication.dataController.classifyString(dValue, "urlConversionDictionary");

                                            htmlString += "<span class='destination'><a href='/" + app.SWGApplication.dataModel.language + "/excursions/" + countryURL + "/" + destinationURL + "'>" + dValue + "</a></span>";
                                            counter++;
                                        });

                                        // Add HTML to array to analyse later when generating columns
                                        htmlArray[eIndex] = { "html": [htmlString], "count": counter };

                                        htmlString = "";
                                        counter = 0;
                                    });

                                }

                                function updateHTML(_table) {
                                    var htmlString = "";
                                    var counter = 0, total = 0;

                                    // Clear any HTML
                                    $(_table).html("");

                                    // Create columns based on the destinationMax value and htmlArray counter value
                                    // in order to keep all sections from breaking
                                    $.each(htmlArray, function (index, value) {

                                        if (counter + value.count <= destinationMax + listOffset) {
                                            htmlString += value.html[0];
                                            counter += value.count;

                                        } else if (counter + value.count > destinationMax + listOffset) {
                                            total++;
                                            // Append to DOM
                                            $(_table).append("<div class='multi-column'>" + htmlString + "</div>");

                                            // Reset temp variables
                                            htmlString = "";
                                            counter = 0;

                                            htmlString += value.html[0];
                                            counter += value.count;
                                        }

                                        if (index >= countryTotal - 1) {
                                            total++;
                                            $(_table).append("<div class='multi-column'>" + htmlString + "</div>");
                                        }

                                    });

                                    var containerWidth = $(_table).parent().width();
                                    var columnWidth = parseInt($(".multi-column").css("width"), 10);
                                    var tableWidth = (containerWidth > total * columnWidth) ? containerWidth + "px" : total * columnWidth + "px";

                                    $(_table).css("width", tableWidth);
                                    return columnWidth;
                                }

                            },

                            addScrollListener: function (_DOMElement, _interval) {

                                tableScrollerObj = $(_DOMElement).parent();

                                // Unbind scroll and click events
                                $(_DOMElement).parent().off("scroll.scrollerList");
                                $(_DOMElement).closest(".scroll-wrapper").parent().find(".left a").off("click.scrollerList");
                                $(_DOMElement).closest(".scroll-wrapper").parent().find(".right a").off("click.scrollerList");
                                tableScrollerObj.off("scroll mousedown DOMMouseScroll mousewheel keyup touchstart");

                                // Attach click event on left arrow
                                $(_DOMElement).closest(".scroll-wrapper").parent().find(".scroll-indicator .left a").on("click.scrollerList", function (e) {
                                    e.preventDefault();

                                    multiColumnTableObj.parent().stop().dequeue().animate({
                                        scrollLeft: "-=" + _interval
                                    }, 1500, "easeOutExpo");

                                });

                                // Attach click event on right arrow
                                $(_DOMElement).closest(".scroll-wrapper").parent().find(".scroll-indicator .right a").on("click.scrollerList", function (e) {
                                    e.preventDefault();

                                    multiColumnTableObj.parent().stop().dequeue().animate({
                                        scrollLeft: "+=" + _interval
                                    }, 1500, "easeOutExpo");

                                });

                                // Stop the animation if the user interacts with the page
                                tableScrollerObj.on("scroll mousedown DOMMouseScroll mousewheel keyup touchstart", function (e) {

                                    if (e.which > 0 && e.which !== 13 && e.which !== 27 || e.type === "mousedown" || e.type === "mousewheel" || e.type === "touchstart") {
                                        $(this).stop().dequeue();
                                    }
                                });

                                // Attach scroll event on multi column table wrapper object 					
                                tableScrollerObj.on("scroll.scrollerList", function () {
                                    var scrollerWidth = $(this).width() - $(this).children().width();
                                    var indicatorObj = $(this).closest(".scroll-wrapper").parent().find(".scroll-indicator");
                                    var isScrolling = false;

                                    // Check if scrolling and width is scrollable
                                    if (scrollerWidth < 0 && Math.abs(scrollerWidth) > 0) {

                                        indicatorObj.removeClass().addClass("scroll-indicator show");

                                        // Update left gradient
                                        if ($(this).scrollLeft() > 0) {
                                            $(this).closest(".scroll-wrapper").addClass("left");
                                        } else {
                                            $(this).closest(".scroll-wrapper").removeClass("left");
                                        }

                                        // Update right gradient
                                        if ($(this).scrollLeft() >= Math.abs(scrollerWidth)) {
                                            $(this).closest(".scroll-wrapper").removeClass("right");
                                        } else {
                                            $(this).closest(".scroll-wrapper").addClass("right");
                                        }

                                        if (browser.ua === "other") {
                                            // Update Scroll Indicator
                                            if ($(this).scrollLeft() <= 0) {
                                                indicatorObj.removeClass().addClass("scroll-indicator").find(".left > a").addClass("disabled");
                                            } else {
                                                indicatorObj.removeClass().addClass("scroll-indicator").find(".left > a").removeClass("disabled");
                                            }

                                            if ($(this).scrollLeft() >= Math.abs(scrollerWidth)) {
                                                indicatorObj.removeClass().addClass("scroll-indicator").find(".right > a").addClass("disabled");
                                            } else {
                                                indicatorObj.removeClass().addClass("scroll-indicator").find(".right > a").removeClass("disabled");
                                            }

                                            if ($(this).scrollLeft() > 0 && $(this).scrollLeft() < Math.abs(scrollerWidth)) {
                                                indicatorObj.removeClass().addClass("scroll-indicator");
                                                indicatorObj.removeClass().addClass("scroll-indicator").find(".left > a").removeClass("disabled");
                                                indicatorObj.removeClass().addClass("scroll-indicator").find(".right > a").removeClass("disabled");
                                            }

                                        }

                                    } else {

                                        // No scrolling, update both gradients
                                        $(this).closest(".scroll-wrapper").removeClass("left");
                                        $(this).closest(".scroll-wrapper").removeClass("right");

                                        // Reset Scroll Indicator
                                        if (browser.ua === "other") {
                                            indicatorObj.removeClass().addClass("scroll-indicator hide");
                                        }
                                    }

                                });

                                // Initialize scroller to set up scroll indicators
                                tableScrollerObj.trigger("scroll.scrollerList");
                            },

                            loadExcursionStep2Content: function () {

                                var excursionDataSource = hotelServicesURL + "1/" + app.SWGApplication.dataModel.language + "/excursionsCountryDestination/";
                                var excursionArray = { "dataList": [] };
                                var excursionQuery, excursionStep2Data;
                                var destinationArray = "";
                                var requestHyphenFlag = false;

                                function getJSONRequest() {

                                    if (!$.isEmptyObject(excursionQuery)) {

                                        $.ajax({
                                            type: "GET",
                                            url: excursionDataSource + excursionQuery,
                                            dataType: "json",
                                            cache: false,
                                            success: function (excursionData) {

                                                if (!$.isEmptyObject(excursionData)) {

                                                    excursionStep2Data = excursionData;

                                                    app.SWGApplication.dataController.loadFilteredContent(excursionStep2Data, destinationArray);

                                                } else {
                                                    // Excursion data is unavailable
                                                    window.console && console.log("Excursion data is unavailable");

                                                    // Fallback in case there is a hyphen in the destination name
                                                    if (!requestHyphenFlag) {

                                                        excursionQuery = destinationArray[0] + "/" + destinationArray[1].replace(/[\s]/g, "-");
                                                        getJSONRequest();
                                                        requestHyphenFlag = true;
                                                    } else {
                                                        app.SWGApplication.dataView.updateLoader("hide", "loading");
                                                        app.SWGApplication.dataView.updateLoader("show", "notfound");
                                                    }
                                                }
                                            },
                                            error: function (jqXHR, textStatus, errorThrown) {
                                                // Excursion service not available
                                                window.console && console.log("Excursion service not available");
                                            }

                                        });

                                    } else {
                                        window.console && console.log("Excursion query is invalid.");
                                    }

                                }

                                destinationArray = [ExcursionDictionary.country, ExcursionDictionary.destination];
                                excursionQuery = destinationArray[0].replace(/[-]/g, " ") + "/" + destinationArray[1].replace(/[-]/g, " ");
                                getJSONRequest();
                            },

                            loadFilteredContent: function (_dataSource, _urlArray) {
                                var htmlString = "", categoriesArray = [];
                                var filterCategoryArray = [];
                                var fwPluginInstance = null; // Freewall Plugin Instance

                                function createFilterClasses() {

                                    var tempClass = "";

                                    $.each(_dataSource, function (catIndex, catValue) {
                                        categoriesArray.push($.trim(catValue.categoryName));
                                    });

                                    categoriesArray = categoriesArray.filter(function (item, i, categoriesArray) {
                                        return i === categoriesArray.indexOf(item);
                                    });

                                    $.each(categoriesArray, function (catIndex, catValue) {
                                        tempClass = app.SWGApplication.dataController.classifyString(catValue, "classConversionDictionary");
                                        filterCategoryArray.push(tempClass);
                                    });

                                }

                                function generateContent() {

                                    $.each(_dataSource, function (catIndex, catValue) {

                                        $.each(catValue.subCategories, function (scIndex, scValue) {

                                            $.each(scValue.excursions, function (exIndex, exValue) {

                                                var imgSource = "";
                                                var description = ((exValue.excursionShortDescription) ? exValue.excursionShortDescription : '<span class="swg-orange">' + ExcursionDictionary.noDescription + '.</span>');
                                                var missingImageFlag = false;
                                                var missingImageClass = " disable-css-zoom";

                                                try {

                                                    imgSource = app.SWGApplication.dataModel.protocol + exValue.excursionImages.Img16X9.substring(5);

                                                } catch (error) {
                                                    missingImageFlag = true;
                                                    //imgSource = "http://redesign.sunwing.ca/Content/images/hotel/error/photo-no-image-" + app.SWGApplication.dataModel.language + ".jpg";
                                                }

                                                // Get index of category
                                                var categoryName = " " + app.SWGApplication.dataController.classifyString(catValue.categoryName, "classConversionDictionary");
                                                var subCategoryName = " " + app.SWGApplication.dataController.classifyString(scValue.subCategoryName, "classConversionDictionary");
                                                var missingImageName = (missingImageFlag) ? missingImageClass : "";

                                                htmlString += '<div class="hover-panel-feature detailed-read-more' + categoryName + subCategoryName + missingImageName + '">';
                                                htmlString += '<div class="feature-item">';
                                                htmlString += '<div class="feature-container">';

                                                htmlString += '<a href="/';
                                                // Dynamic URL 
                                                htmlString += app.SWGApplication.dataModel.language + "/excursions/" + app.SWGApplication.dataController.classifyString(_urlArray[0], "urlConversionDictionary") + "/" + app.SWGApplication.dataController.classifyString(_urlArray[1], "urlConversionDictionary") + "/" + app.SWGApplication.dataController.classifyString(exValue.excursionFullName, "urlConversionDictionary");
                                                htmlString += '" title="' + exValue.excursionName.replace(/[\"]/g, "") + '">';

                                                htmlString += '<span class="heading-description">';
                                                htmlString += '<span class="heading-content">';
                                                htmlString += '<span class="title">' + exValue.excursionName + '</span>';
                                                htmlString += '<span class="sub-title">' + catValue.categoryName + '</span>';
                                                htmlString += '</span>';
                                                htmlString += '</span>';

                                                htmlString += '<span class="image-container"><img src="' + imgSource + '" alt="' + exValue.excursionName.replace(/[\"]/g, "") + '"></span>';

                                                htmlString += '<span class="feature-bg dt">';
                                                htmlString += '<span class="cta-text dtc">';
                                                htmlString += '<span class="text-wrapper">';
                                                htmlString += '<span class="text-description">' + description + '</span>';
                                                htmlString += '</span>';
                                                htmlString += '</span>';
                                                htmlString += '</span>';

                                                htmlString += '<span class="read-more">[<span class="cta">' + CommonDictionary.readMore + '</span>]</span>';

                                                htmlString += '</a>';

                                                htmlString += '</div>';
                                                htmlString += '</div>';
                                                htmlString += '</div>';

                                            });

                                        });
                                    });

                                    filterListObj.html(htmlString);
                                }

                                function generateFilters(fwPluginInstance) {

                                    var htmlString = "";

                                    // Generate Tab HTML
                                    htmlString += '<div class="tab-list dt">';

                                    htmlString += '<span class="tab-item dtc active">';
                                    htmlString += '<a class="filter show-all" data-toggle="tab" href="#">' + ExcursionDictionary.allExcursion + '</a>';
                                    htmlString += '</span>';

                                    $.each(filterCategoryArray, function (filterIndex, filterValue) {

                                        htmlString += '<span class="tab-item dtc">';
                                        htmlString += '<a data-toggle="tab" href="#" class="filter" data-filter=".' + filterValue + '">' + categoriesArray[filterIndex] + '</a>';
                                        htmlString += '</span>';

                                    });

                                    htmlString += '</div>';

                                    filterTabMenuObj.html(htmlString);

                                    // Generate Drop-down HTML
                                    htmlString = "";

                                    htmlString += '<li>';
                                    htmlString += '<a class="filter show-all" href="#">' + ExcursionDictionary.allExcursion + '</a>';
                                    htmlString += '</li>';

                                    $.each(filterCategoryArray, function (filterIndex, filterValue) {

                                        htmlString += '<li>';
                                        htmlString += '<a href="#" class="filter" data-filter=".' + filterValue + '">' + categoriesArray[filterIndex] + '</a>';
                                        htmlString += '</li>';

                                    });

                                    filterDDMenuObj.html(htmlString);

                                    // Initialize Responsive Tabs
                                    app.SWGApplication.dataController.initResponsiveDDTabs(filterWrapperObj);


                                    viewportObj.on("click", ".filter", function (e) {
                                        e.preventDefault();

                                        var filter = $(this).data("filter");

                                        if (filter) {
                                            fwPluginInstance.filter(filter);
                                        } else {
                                            fwPluginInstance.unFilter();
                                        }
                                    });

                                }

                                function setOptions(fwPluginInstance) {

                                    var fwOptions = {
                                        selector: ".hover-panel-feature.detailed-read-more",
                                        cellW: 300,
                                        cellH: 341,
                                        fixSize: false,
                                        delay: 5,
                                        gutterX: 20,
                                        gutterY: 20,
                                        animate: true,
                                        keepOrder: true,
                                        onResize: function (_element) {
                                            this.refresh();
                                            this.fitWidth();
                                        },
                                        onComplete: function (_element, _this) {
                                            setTimeout(function () {
                                                //console.log($(fwOptions.selector + ":visible").length);
                                            }, 1000);

                                        }
                                    };

                                    fwPluginInstance = app.SWGApplication.dataController.initFreewallPlugin(fwPluginInstance, ".hover-panel-container.filter-list", fwOptions);

                                    return fwPluginInstance;
                                }

                                createFilterClasses();
                                generateContent();

                                // Update heading
                                $(".toggle-menu .ws-destination").html((_urlArray[0] !== _urlArray[1]) ? _urlArray[1].replace(/[-]/g, " ") + ", " + _urlArray[0].replace(/[-]/g, " ") : _urlArray[0].replace(/[-]/g, " "));

                                $(".toggle-menu").on("click", function (e) {
                                    e.preventDefault();

                                    if ((typeof this.toggle === "undefined" || !this.toggle) && !$(".toggle-wrapper").is(":animated")) {

                                        $(this).addClass("active");

                                        $(".toggle-wrapper").slideDown(300, "easeInOutQuad", function () {
                                            app.SWGApplication.dataController.loadMultiColumnTable();
                                        });

                                        this.toggle = true;

                                    } else if (this.toggle && !$(".toggle-wrapper").is(":animated")) {

                                        $(this).removeClass("active");
                                        $(".toggle-wrapper").slideUp(300, "easeInOutQuad");

                                        this.toggle = false;
                                    }

                                });

                                $(".excursion-s2-data").fadeIn(1500);

                                fwPluginInstance = setOptions(fwPluginInstance);
                                generateFilters(fwPluginInstance);
                            },

                            initFreewallPlugin: function (fwPluginInstance, _container, _settings) {

                                // Instantiate Freewall Plugin
                                fwPluginInstance = new Freewall(_container);
                                fwPluginInstance.reset(_settings);

                                // Init Plugin Sizing
                                fwPluginInstance.fitWidth();

                                return fwPluginInstance;
                            },

                            initResponsiveDDTabs: function (_DOMElementWrapperDIV) {

                                // Create Tab Object References
                                var tabWrapperObj = _DOMElementWrapperDIV;
                                var tabContainerObj = tabWrapperObj.find("ul");
                                var tabObj = tabContainerObj.find("li");
                                var totalTabs = tabObj.length;

                                if (totalTabs > 2) {
                                    tabWrapperObj.responsiveDDTabManager({
                                        mobileBreakPoint: 475,
                                        menuWidth: 230,
                                        showMobileActiveText: true
                                    });
                                } else {
                                    tabWrapperObj.hide();
                                }

                            },

                            loadExcursionStep3Content: function () {

                                app.SWGApplication.dataView.updateLoader("show", "loading");

                                var excursionJSONData = null;
                                var excursionDataSource = hotelServicesURL + app.SWGApplication.dataModel.brand + "/" + app.SWGApplication.dataModel.language + "/excursionsCountryDestinationExcursion/";
                                var excursionQuery, excursionURL;

                                if (!$.isEmptyObject(exCodeURL)) {
                                    excursionURL = hotelServicesURL + app.SWGApplication.dataModel.brand + "/" + app.SWGApplication.dataModel.language + "/excursion/" + exCodeURL;
                                } else if (typeof ExcursionDictionary.country !== "undefined" && typeof ExcursionDictionary.destination !== "undefined" && typeof ExcursionDictionary.excursionName !== "undefined") {
                                    excursionQuery = ExcursionDictionary.country.replace(/-/g, " ") + "/" + ExcursionDictionary.destination.replace(/-/g, " ") + "/" + ExcursionDictionary.excursionName.replace(/-/g, " ");
                                    excursionURL = excursionDataSource + excursionQuery;
                                }

                                if (typeof excursionURL !== "undefined") {

                                    $.ajax({
                                        type: "GET",
                                        url: excursionURL,
                                        dataType: "json",
                                        cache: false,
                                        success: function (excursionData) {

                                            if (!$.isEmptyObject(excursionData)) {

                                                excursionJSONData = excursionData;

                                                if (excursionPageDataExists) {
                                                    updateExcursionPage();
                                                    updateHeader();
                                                    updateBreadcrumbs();
                                                }

                                                if (excursionGalleryExists) {
                                                    generateGallery();
                                                }

                                                setTimeout(function () {

                                                    app.SWGApplication.dataView.updateLoader("hide");

                                                    // Page Content is updated 
                                                    app.SWGApplication.dataView.loadStaticSequence();

                                                    /* Load Promotion Features */

                                                    // Promotion Features
                                                    var excursionPageFeatureObj = $(".hover-panel-container.excursion-features");
                                                    var excursionPageFeatureExists = (excursionPageFeatureObj.length) ? true : false;

                                                    if (excursionPageFeatureExists) {
                                                        loadExcursionPromotions(excursionPageFeatureObj, 3, excursionJSONData[0].category, excursionJSONData[0].subCategory, excursionJSONData[0].name);
                                                    }

                                                }, 1000);


                                            } else {
                                                // Excursion data is empty
                                                app.SWGApplication.dataView.updateLoader("hide", "loading");
                                                app.SWGApplication.dataView.updateLoader("show", "notfound");
                                            }
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            // excursion service not available or failed attempt
                                            app.SWGApplication.dataView.updateLoader("hide", "loading");
                                            app.SWGApplication.dataView.updateLoader("show", "notfound");
                                        }

                                    });

                                } else {
                                    // valid query not passed
                                    app.SWGApplication.dataView.updateLoader("hide", "loading");
                                    app.SWGApplication.dataView.updateLoader("show", "notfound");
                                }

                                function updateHeader() {

                                    var locationString = excursionJSONData[0].country + ", " + excursionJSONData[0].destination;

                                    excursionGalleryObj.find(".blue-header h2").html(excursionJSONData[0].name);
                                    excursionGalleryObj.find(".map-cta .location").html(locationString);

                                }

                                function updateBreadcrumbs() {

                                    var locationString = excursionJSONData[0].destination + ", " + excursionJSONData[0].country;

                                    $(".breadcrumbs .ws-data.location").html(locationString);
                                }

                                function generateGallery() {

                                    excursionGalleryObj.each(function (index, element) {

                                        var loadGalleryStatus = false;

                                        analyzeGalleryData(loadGalleryStatus, element);

                                    });

                                }

                                function checkLoadState(loadGalleryStatus, _element) {

                                    var controls = false;

                                    if (loadGalleryStatus) {
                                        controls = createHTML(_element);
                                        initSlider(_element, controls);

                                    } else {
                                        $(_element).find(".row-slideshow").hide();
                                    }

                                }

                                function analyzeGalleryData(loadGalleryStatus, _element) {

                                    $.each(excursionJSONData, function (index, property) {

                                        if (typeof property.hotelImages === "object") {

                                            $.each(property.hotelImages, function (key, imageArray) {

                                                if (key === "Img16X9") {
                                                    app.SWGApplication.dataModel.galleryImages[key] = imageArray;
                                                    loadGalleryStatus = true;
                                                }

                                            });
                                        }

                                    });

                                    checkLoadState(loadGalleryStatus, _element);
                                }

                                function createHTML(_element) {

                                    var htmlString = "";
                                    var imageCounter = 0, imageTypeCounter = 0;
                                    var imageFlag = false;
                                    var largeImages = app.SWGApplication.dataModel.galleryImages.Img16X9;
                                    var smallImages = app.SWGApplication.dataModel.galleryImages.Img16X9;

                                    if (typeof largeImages !== "undefined" && largeImages !== null) {

                                        htmlString += '<ul class="bxslider">';

                                        if (typeof largeImages === "object") {

                                            imageFlag = true;

                                            $.each(largeImages, function (key, val) {
                                                imageCounter++;
                                                htmlString += '<li><img src="' + app.SWGApplication.dataModel.protocol + val.substring(5) + '" alt="Photo ' + imageCounter + '"></li>';
                                            });

                                        } else {
                                            imageCounter++;
                                            htmlString += '<li><img src="' + app.SWGApplication.dataModel.protocol + largeImages.substring(5) + '" alt="Photo ' + imageCounter + '"></li>';
                                        }

                                        htmlString += '</ul>';

                                        if (imageCounter) {
                                            imageTypeCounter++;
                                        }

                                        $(_element).find(".slideshow").html("");
                                        $(_element).find(".slideshow").html(htmlString);

                                        htmlString = "";
                                        imageCounter = 0;
                                        imageFlag = false;

                                    } else {

                                        // No large images found
                                        htmlString = "";

                                        htmlString += '<ul class="bxslider">';
                                        htmlString += '<li><img src="/Content/images/hotel/error/photo-no-lg-image-' + app.SWGApplication.dataModel.language + '.jpg" alt="Hotel photo placeholder" /></li>';
                                        htmlString += '</ul>';

                                        $(_element).find(".slideshow").html(htmlString);
                                        htmlString = "";
                                        $(_element).find(".thumbs").html(htmlString);
                                    }

                                    if (typeof smallImages !== "undefined" && smallImages !== null) {

                                        htmlString += '<ul id="bx-pager">';

                                        if (typeof smallImages === "object") {

                                            imageFlag = true;

                                            $.each(smallImages, function (key, val) {
                                                htmlString += '<li><a data-slide-index="' + imageCounter + '" href="#"><img src="' + app.SWGApplication.dataModel.protocol + val.substring(5) + '" alt="Hotel photo ' + (imageCounter + 1) + '" /></a></li>';
                                                imageCounter++;
                                            });

                                        } else {
                                            htmlString += '<li><a data-slide-index="' + imageCounter + '" href="#"><img src="' + app.SWGApplication.dataModel.protocol + smallImages.substring(5) + '" alt="Hotel photo ' + (imageCounter + 1) + '" /></a></li>';
                                        }

                                        htmlString += '</ul>';

                                        if (imageCounter) {
                                            imageTypeCounter++;
                                        }

                                        $(_element).find(".thumbs").html("");
                                        $(_element).find(".thumbs").html(htmlString);
                                        htmlString = "";

                                    } else {

                                        // No thumbnail images found
                                        htmlString = "";

                                        htmlString += '<ul class="bxslider">';
                                        htmlString += '<li><img src="/Content/images/hotel/error/photo-no-thumb-image-' + app.SWGApplication.dataModel.language + '.jpg" alt="Hotel photo placeholder" /></li>';
                                        htmlString += '</ul>';

                                        $(_element).find(".slideshow").html(htmlString);
                                        htmlString = "";
                                        $(_element).find(".thumbs").html(htmlString);
                                    }

                                    return imageFlag;
                                }

                                function initSlider(_element, _controls) {

                                    var infiniteFlag = ($(_element).find("li").length > 1) ? true : false;

                                    var settings = {
                                        auto: true,
                                        autoControls: true,
                                        controls: _controls,
                                        mode: "fade",
                                        autoResume: true,
                                        useCSS: true,
                                        captions: true,
                                        pagerCustom: "#bx-pager",
                                        pause: 5000,
                                        easing: (Modernizr.csstransitions) ? "ease-in-out" : "swing",
                                        prevText: '<i class="fa fa-chevron-left"></i>',
                                        nextText: '<i class="fa fa-chevron-right"></i>',
                                        infiniteLoop: infiniteFlag,
                                        onSliderLoad: function ($thisSlider, currentIndex) {
                                            $thisSlider.closest("." + sliderWrapperClass).show();
                                            sliderLoadedFlag = true;

                                            loadPNTabbing($thisSlider);
                                        }
                                    };

                                    $(_element).find(".bxslider").bxSlider(settings);

                                    function loadPNTabbing(_thisSliderObj) {

                                        _thisSliderObj.next().find(".bx-prev").on("focus blur", function (e) {

                                            if (e.type === "focus") {
                                                $(this).closest(".bx-controls").addClass("opacity-full");
                                            } else {
                                                $(this).closest(".bx-controls").removeClass("opacity-full");
                                            }

                                        });

                                        _thisSliderObj.next().find(".bx-next").on("focus blur", function (e) {
                                            if (e.type === "focus") {
                                                $(this).closest(".bx-controls").addClass("opacity-full");
                                            } else {
                                                $(this).closest(".bx-controls").removeClass("opacity-full");
                                            }
                                        });
                                    }

                                }

                                function updateExcursionPage() {

                                    $.each(app.SWGApplication.dataModel.excursionStep3Array, function (key, property) {

                                        var serviceKey = Object.keys(property)[0];
                                        var DOMClass, headingClass;
                                        var dataValue = excursionJSONData[0][serviceKey];

                                        $.each(property[serviceKey], function (index, value) {
                                            DOMClass = value.domElement;
                                            headingClass = value.heading;
                                        });

                                        if (dataValue !== "") {
                                            $(".heading." + headingClass).show();
                                            $(".ws-data." + DOMClass).html("<p>" + dataValue + "</p>");

                                        } else {

                                            $(".heading." + headingClass).remove();
                                            $(".ws-data." + DOMClass).remove();
                                        }

                                    });

                                    var columnDIVs = $(".excursion-s3-data div[class*='col-']");

                                    $.each(columnDIVs, function (divIndex, divElement) {
                                        // Check if there are any empty columns
                                        if ($.isEmptyObject($.trim($(divElement).html()))) {
                                            // Remove 50% width classes with rows containing empty columns
                                            if ($(divElement).hasClass("col-sm-6")) {
                                                $(divElement).closest(".row").find(".col-sm-6").each(function (index, element) {
                                                    $(element).removeClass("col-sm-6");
                                                });
                                            }
                                            // Remove all empty columns
                                            $(divElement).remove();
                                        }

                                    });
                                }

                                function loadExcursionPromotions(_containerObj, _rowItems, _categoryGroup, _subCategoryGroup, _name) {

                                    var excursionDataSource = hotelServicesURL + "1/" + app.SWGApplication.dataModel.language + "/excursionsCountryDestination/";
                                    var excursionPromoQuery = excursionQuery.substr(0, excursionQuery.lastIndexOf("/"));
                                    var excursionPromoData;

                                    if (typeof excursionPromoQuery !== "undefined") {

                                        $.ajax({
                                            type: "GET",
                                            url: excursionDataSource + excursionPromoQuery,
                                            dataType: "json",
                                            cache: false,
                                            success: function (excursionData) {
                                                excursionPromoData = excursionData;
                                                analyzeExcursionData(_containerObj, excursionPromoData, _rowItems, _categoryGroup, _subCategoryGroup, _name);
                                            }
                                        });

                                    }
                                }

                                function analyzeExcursionData(_containerObj, _dataSource, _rowItems, _categoryGroup, _subCategoryGroup, _name) {

                                    var categoryMarker = [];
                                    var rowCounter = 0;
                                    var rowExtraSelection = 5;

                                    // Attempt 1: Select items from the same category
                                    $.each(_dataSource, function (catIndex, catValue) {

                                        if (catValue.categoryName === _categoryGroup) {
                                            categoryMarker.push(catIndex);

                                            $.each(catValue.subCategories, function (subIndex, subValue) {
                                                processSubCategory(subIndex, subValue);
                                            });

                                        }

                                    });

                                    // Attempt 2: Select items from different categories
                                    if (rowCounter < _rowItems) {

                                        // Loop through other categories
                                        $.each(_dataSource, function (catIndex, catValue) {

                                            if (catValue.categoryName !== _categoryGroup) {

                                                $.each(catValue.subCategories, function (subIndex, subValue) {
                                                    processSubCategory(subIndex, subValue);
                                                });

                                            }

                                        });

                                    }

                                    function processSubCategory(_subIndex, _subValue) {

                                        $.each(_subValue.excursions, function (exIndex, exValue) {
                                            var imageURL = "";

                                            // Omit any excursion with the same name
                                            if (_name !== exValue.excursionName && rowCounter < _rowItems + rowExtraSelection) {

                                                if (typeof exValue.excursionImages.Img16X9 !== "undefined") {
                                                    imageURL = app.SWGApplication.dataModel.protocol + exValue.excursionImages.Img16X9.substring(5);
                                                } else {
                                                    imageURL = app.SWGApplication.dataModel.protocol + exValue.excursionImages.Img4X3.substring(5);
                                                }

                                                app.SWGApplication.dataModel.excursionFeatures.push([{
                                                    "name": exValue.excursionName,
                                                    "fullName": exValue.excursionFullName,
                                                    "description": exValue.excursionShortDescription,
                                                    "subCategory": _subValue.subCategoryName,
                                                    "image": imageURL
                                                }]);

                                                rowCounter++;
                                            } else {
                                                return;
                                            }

                                        });

                                    }

                                    generateHTML(_containerObj, app.SWGApplication.dataModel.excursionFeatures, _rowItems, _subCategoryGroup);
                                }

                                function generateHTML(_containerObj, _dataSource, _rowItems, _subCategoryGroup) {

                                    var htmlString = "";
                                    var counter = 0;

                                    // Add some randomization to results
                                    _dataSource = app.SWGApplication.dataController.shuffleArray(_dataSource);

                                    // Create features with the same SubCategory
                                    $.each(_dataSource, function (index, value) {

                                        if (counter >= _rowItems) {
                                            return false;

                                        } else if (_subCategoryGroup === value[0].subCategory) {
                                            createHTML(value);
                                        }
                                    });

                                    if (counter < _rowItems) {

                                        // Create features with a different SubCategory
                                        $.each(_dataSource, function (index, value) {

                                            if (counter >= _rowItems) {
                                                return false;

                                            } else if (_subCategoryGroup !== value[0].subCategory) {
                                                createHTML(value);
                                            }
                                        });

                                    }

                                    function createHTML(value) {
                                        htmlString += '<div class="hover-panel-feature">';
                                        htmlString += '<div class="feature-item">';
                                        htmlString += '<div class="feature-container">';

                                        htmlString += '<a href="/' + app.SWGApplication.dataModel.language + '/excursions/' + ExcursionDictionary.country + '/' + ExcursionDictionary.destination + '/' + app.SWGApplication.dataController.classifyString(value[0].fullName, "urlConversionDictionary") + '" class="hover" title="' + value[0].name + '">';
                                        htmlString += '<span class="title-bar">' + value[0].name + '</span>';
                                        htmlString += '<img src="' + value[0].image + '" alt="' + value[0].name + '">';

                                        htmlString += '<span class="feature-bg">';
                                        htmlString += '<span class="cta-text">';
                                        htmlString += '<span class="text-wrapper">';
                                        htmlString += '<span class="text-description">';
                                        htmlString += value[0].description;
                                        htmlString += '</span>';
                                        htmlString += '</span>';
                                        htmlString += '</span>';
                                        htmlString += '</span>';
                                        htmlString += '</a>';
                                        htmlString += '</div>';
                                        htmlString += '</div>';
                                        htmlString += '</div>';

                                        counter++;
                                    }

                                    if (counter >= _rowItems) {
                                        _containerObj.attr("data-row-items", _rowItems);
                                        _containerObj.html(htmlString);
                                    } else {
                                        _containerObj.attr("data-row-items", _rowItems);
                                        _containerObj.html(htmlString);
                                    }
                                }

                            },

                            loadDestinationsStep1: function () {

                                // Manual accordion tab load sequence
                                app.SWGApplication.dataView.displayAccordionTabs();

                                app.SWGApplication.dataController.loadDestinationMediaGalleries();

                                if (animateWallExists) app.SWGApplication.dataController.loadResponsiveHoverPanelGrid();

                                app.SWGApplication.dataController.loadResponsiveAdModuleTabs();

                                //app.SWGApplication.dataView.displayScrollNavigation();
                            },

                            loadDestinationsStep2: function () {

                                // Manual accordion tab load sequence
                                app.SWGApplication.dataView.displayAccordionTabs();

                                // Load Weather Tab
                                app.SWGApplication.dataView.displayWeather();

                                // Load media gallery
                                app.SWGApplication.dataController.loadDestinationMediaGalleries();

                                // Load hotel filter application
                                app.SWGApplication.dataController.loadHotelFilterApp();

                                $(".promo-module .show-more-button").on("click", function (e) {
                                    e.preventDefault();
                                });

                                // Attach click events to load dynamic content
                                app.SWGApplication.dataController.attachAjaxLoadEvent();
                                app.SWGApplication.dataView.displayScrollingTabs();

                                // Attach scroll behavior
                                //app.SWGApplication.dataView.displayScrollNavigation();

                                thisWindow.trigger("resize");
                            },

                            attachAjaxLoadEvent: function () {

                                // Loop through each tab and setup AJAX data retrieval routines, as required
                                $("#things-to-do .tab-list a").each(function (tabIndex, tabElement) {

                                    $(tabElement).on("click", { requirements: destinationTabRequirement }, function (e) {
                                        e.preventDefault();

                                        var thisHREF = $(tabElement).attr("href").replace("#", "");
                                        var thisTabData = $(tabElement).closest(".content-wrapper").find(".tab-content #" + thisHREF).data();

                                        // Load data if ajax is required
                                        if (thisTabData.ajax) {

                                            // Update data
                                            $.extend(true, e.data.requirements[thisHREF], thisTabData);

                                            // Load data based on web service call
                                            if (!$.isEmptyObject(e.data.requirements[thisHREF])) {
                                                app.SWGApplication.dataController.delegateDataLoader(e.data.requirements[thisHREF], thisHREF);
                                            }

                                        }

                                    });

                                });

                                // Load default
                                $("#things-to-do .tab-list .active > a").trigger("click");
                            },

                            delegateDataLoader: function (_requirementsArray, _tabID) {

                                switch (_requirementsArray.serviceAPI) {
                                    case "excursionsCountryDestination":
                                        app.SWGApplication.dataController.loadExcursionsLevel2(_requirementsArray, _tabID);
                                        break;

                                    case "destinationGolfInfo":
                                        app.SWGApplication.dataController.loadWebServiceAPI(_requirementsArray, _tabID);
                                        break;

                                    case "destinationSpaInfo":
                                        app.SWGApplication.dataController.loadWebServiceAPI(_requirementsArray, _tabID);
                                        break;

                                    case "destinationCasinoInfo":
                                        app.SWGApplication.dataController.loadWebServiceAPI(_requirementsArray, _tabID);
                                        break;
                                }

                            },

                            loadExcursionsLevel2: function (_requirementsArray, _id) {

                                var excursionDataSource = hotelServicesURL + "1/" + app.SWGApplication.dataModel.language + "/" + _requirementsArray.serviceAPI + "/";
                                var excursionQuery;
                                var destinationArray = "";
                                var requestHyphenFlag = false;

                                function getJSONRequest() {

                                    if (!$.isEmptyObject(excursionQuery)) {

                                        $.ajax({
                                            type: "GET",
                                            url: excursionDataSource + excursionQuery,
                                            dataType: "json",
                                            cache: false,
                                            success: function (data) {

                                                if (!$.isEmptyObject(data)) {
                                                    app.SWGApplication.dataController.displayAjaxTabData(data, _requirementsArray, _id);

                                                } else {
                                                    // Excursion data is unavailable
                                                    window.console && console.log("Excursion data is unavailable");

                                                    // Fallback in case there is a hyphen in the destination name
                                                    if (!requestHyphenFlag) {

                                                        excursionQuery = destinationArray[0] + "/" + destinationArray[1].replace(/[\s]/g, "-");
                                                        getJSONRequest();
                                                        requestHyphenFlag = true;
                                                    } else {
                                                        // Fallback failed
                                                        $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");
                                                    }
                                                }
                                            },
                                            error: function (jqXHR, textStatus, errorThrown) {
                                                // Excursion service not available
                                                window.console && console.log("Excursion service not available");
                                            }

                                        });

                                    } else {
                                        window.console && console.log("Excursion query is invalid.");
                                    }

                                }

                                destinationArray = [_requirementsArray.country, _requirementsArray.destination];
                                excursionQuery = destinationArray[0].replace(/[-]/g, " ") + "/" + destinationArray[1].replace(/[-]/g, " ");
                                getJSONRequest();
                            },

                            displayAjaxTabData: function (_data, _requirementsArray, _id) {

                                // Load custom callback to process and display
                                app.SWGApplication.dataController[_requirementsArray.callback](_data, _requirementsArray, _id);
                            },

                            appendExcursionData: function (_data, _requirementsArray, _id) {

                                var dataArray = [];
                                var imageURL = "";
                                var currentSubCategory = "";
                                var paginationLimit = _requirementsArray.itemLimit;
                                var currentCount = 0, tempCounter = 0;

                                $.each(_data, function (catIndex, catValue) {

                                    $.each(catValue.subCategories, function (subIndex, subValue) {

                                        if (currentCount < paginationLimit) {

                                            $.each(subValue.excursions, function (exIndex, exValue) {

                                                if (tempCounter <= 0) {

                                                    imageURL = "";

                                                    try {

                                                        imageURL = app.SWGApplication.dataModel.protocol + exValue.excursionImages.Img16X9.substring(5);

                                                    } catch (error) {
                                                        // Missing image
                                                    }

                                                    dataArray.push({
                                                        "subCategory": subValue.subCategoryName,
                                                        "fullName": exValue.excursionFullName,
                                                        "description": exValue.excursionShortDescription,
                                                        "image": imageURL
                                                    });

                                                    currentSubCategory = subValue.subCategoryName;
                                                    tempCounter++;

                                                } else {
                                                    return;
                                                }
                                            });

                                            currentCount++;
                                            tempCounter = 0;

                                        } else {
                                            return;
                                        }

                                    });

                                });

                                // Update presentation
                                $(".excursion-tour-container").empty();

                                var htmlString = "";

                                $.each(dataArray, function (dataIndex, dataValue) {

                                    htmlString += '<div class="feature-container col-xs-12 col-md-6">';
                                    htmlString += '<div class="feature-item">';

                                    // START Header
                                    htmlString += '<div class="header">';
                                    htmlString += '<div class="title">' + dataValue.fullName + '</div>';

                                    //htmlString += '<div class="theme-logo">';
                                    //htmlString += '<img src="images/destinations/step2/aquatic-ex-logo.png" alt="Aquatic experiences">';
                                    //htmlString += '</div>';

                                    htmlString += '</div>';
                                    // END Header

                                    // START Content
                                    htmlString += '<div class="content-container dt">';

                                    htmlString += '<div class="image dtc" style="background-image: url(\'' + dataValue.image + '\');" title="' + dataValue.fullName + '"></div>';
                                    htmlString += '<div class="description dtc">';
                                    htmlString += '<div class="copy">';
                                    htmlString += '<p>';
                                    htmlString += dataValue.description;
                                    htmlString += '</p>';
                                    htmlString += '</div>';

                                    htmlString += '<div class="cta-btn">';
                                    htmlString += '<a href="/' + app.SWGApplication.dataModel.language + '/excursions/' + _requirementsArray.country + '/' + _requirementsArray.destination + '/' + app.SWGApplication.dataController.classifyString(dataValue.fullName, "urlConversionDictionary") + '" class="btn chevron-arrow">' + CommonDictionary.learnMore + '</a>';
                                    htmlString += '</div>';

                                    htmlString += '</div>';

                                    htmlString += '</div>';
                                    // END Content

                                    htmlString += '</div>';
                                    htmlString += '</div>';

                                    $(".excursion-tour-container").append(htmlString);
                                    htmlString = '';
                                });

                                $("#" + _id).find(".more").show();
                            },

                            appendGolfData: function (_data, _requirementsArray, _id) {

                                var dataArray = [];
                                var courseNameArray = [];

                                if (!$.isEmptyObject(_data)) {

                                    $.each(_data, function (golfIndex, golfValue) {

                                        if (app.SWGApplication.dataController.classifyString(golfValue.destinationName.toLowerCase(), "urlConversionDictionary") === app.SWGApplication.dataController.classifyString(CommonDictionary.destination.toLowerCase(), "urlConversionDictionary")) {

                                            $.each(golfValue.hotelGolfInfo.golfCourses, function (courseIndex, courseValue) {

                                                // Filter out duplicate names
                                                if ($.inArray(courseValue.name, courseNameArray) < 0) {

                                                    courseNameArray.push(courseValue.name);

                                                    dataArray.push({
                                                        "name": courseValue.name,
                                                        "address": courseValue.address ? courseValue.address : "<span class='italic'>N/A</span>",
                                                        "architect": courseValue.architect ? courseValue.architect : "<span class='italic'>N/A</span>",
                                                        "holes": courseValue.numOfHoles ? courseValue.numOfHoles : "<span class='italic'>N/A</span>",
                                                        "par": courseValue.par ? courseValue.par : "<span class='italic'>N/A</span>",
                                                        "priceRange": courseValue.priceRange ? courseValue.priceRange : "<span class='italic'>N/A</span>",
                                                        "greens": courseValue.greens ? courseValue.greens : "<span class='italic'>N/A</span>",
                                                        "fairways": courseValue.fairways ? courseValue.fairways : "<span class='italic'>N/A</span>",
                                                        "spikes": courseValue.spikesAllowed ? courseValue.spikesAllowed : "<span class='italic'>N/A</span>",
                                                        "yardage": courseValue.yardage ? courseValue.yardage.replace(/[\/]/g, " | ") : "<span class='italic'>N/A</span>",
                                                        "slope": courseValue.slope ? courseValue.slope.replace(/[\/]/g, " | ") : "<span class='italic'>N/A</span>",
                                                        "rating": courseValue.rating ? courseValue.rating.replace(/[\/]/g, " | ") : "<span class='italic'>N/A</span>",
                                                        "telephone": courseValue.telephone ? courseValue.telephone : "<span class='italic'>N/A</span>"
                                                    });

                                                }

                                            });
                                        } else {
                                            return;
                                        }
                                    });

                                    if (dataArray.length > 0) {

                                        var htmlString = "";

                                        dataArray.sort(app.SWGApplication.dataController.sortObject("name", false));

                                        (_requirementsArray.ajax) && $(".golf-container").empty();

                                        $("#" + _id).find(".more").on("click", function (e) {
                                            e.preventDefault();

                                            var timer = 0;

                                            app.SWGApplication.dataController.generateGolfData(dataArray, _requirementsArray, _id);

                                            viewportObj.find("#" + _id + " .feature-container-wrapper.hide").each(function (index, element) {
                                                $(element).delay(100 * index).show(function () {
                                                    $(this).removeAttr("style");
                                                    $(this).removeClass("hide");
                                                });

                                                timer = 100 * index;
                                            });

                                            // Handle more button display
                                            if (_requirementsArray.itemCounter >= dataArray.length || _requirementsArray.itemCounter > parseInt(_requirementsArray.itemLimit, 10)) {

                                                $(this).fadeOut();
                                            } else {

                                                if (_requirementsArray.itemLimit !== null) {
                                                    if (_requirementsArray.itemCounter >= _requirementsArray.itemLimit) {
                                                        this.init = false;
                                                    }
                                                }

                                                if (typeof this.init === "undefined") {
                                                    this.init = true;
                                                    $(this).delay(timer + 500).fadeIn(1000);
                                                }
                                            }

                                        });

                                        // Display initial data set 
                                        $("#" + _id).find(".more").trigger("click");

                                    } else {
                                        $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");
                                    }

                                } else {
                                    $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");
                                }
                            },

                            generateGolfData: function (_data, _requirementsArray, _id) {
                                var htmlString = "";
                                var counter = 1;
                                var paginationLimit = _requirementsArray.itemLimit;
                                var total = (paginationLimit) ? paginationLimit : _data.length;

                                $.each(_data, function (dataIndex, dataValue) {

                                    if (paginationLimit !== null) {
                                        if (dataIndex >= paginationLimit) {
                                            return;
                                        }
                                    }

                                    if (dataIndex >= _requirementsArray.itemCounter && dataIndex < _requirementsArray.itemCounter + _requirementsArray.itemInterval) {
                                        if (counter === 1) {
                                            htmlString += '<div class="feature-container dt">';
                                        }

                                        htmlString += '<div class="feature-container-wrapper dtc hide">';
                                        htmlString += '<div class="feature-item">';

                                        htmlString += '<div class="top-content">';
                                        htmlString += '<span class="course name">';
                                        htmlString += '<span class="data">' + dataValue.name + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course address">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfAddress + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.address + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course architect">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfArchitect + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.architect + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course telephone">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfTelephone + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.telephone + '</span>';
                                        htmlString += '</span>';
                                        htmlString += '</div>';

                                        htmlString += '<div class="middle-content dt">';

                                        htmlString += '<div class="column dtc">';
                                        htmlString += '<span class="course no-holes">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfHoles + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.holes + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course fairways">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfFairways + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.fairways + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course yardage">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfYardage + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.yardage + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course rating">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfRating + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.rating + '</span>';
                                        htmlString += '</span>';
                                        htmlString += '</div>';

                                        htmlString += '<div class="column dtc">';
                                        htmlString += '<span class="course par">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfPar + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.par + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course greens">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfGreens + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.greens + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course spikes">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfSpikes + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.spikes + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="course slope">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdGolfSlope + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.slope + '</span>';
                                        htmlString += '</span>';
                                        htmlString += '</div>';

                                        htmlString += '</div>';

                                        htmlString += '<div class="bottom-content">';
                                        htmlString += '</div>';


                                        htmlString += '</div>';
                                        htmlString += '</div>';

                                        if (counter >= 2 || dataIndex >= total - 1) {

                                            if (counter == 1 && dataIndex >= total - 1) {
                                                htmlString += '<div class="feature-container-wrapper dtc empty hide"></div>';
                                            }

                                            htmlString += '</div>';
                                            counter = 0;
                                            $(".golf-container").append(htmlString);
                                            htmlString = '';
                                        }

                                        counter++;

                                    } else {
                                        return;
                                    }

                                });

                                _requirementsArray.itemCounter += _requirementsArray.itemInterval;
                            },

                            appendSpaData: function (_data, _requirementsArray, _id) {

                                var dataArray = [];

                                if (!$.isEmptyObject(_data)) {

                                    $.each(_data, function (hotelIndex, hotelValue) {

                                        if (app.SWGApplication.dataController.classifyString(hotelValue.destinationName.toLowerCase(), "urlConversionDictionary") === app.SWGApplication.dataController.classifyString(CommonDictionary.destination.toLowerCase(), "urlConversionDictionary")) {
                                            dataArray.push({
                                                "hotelName": hotelValue.hotelName,
                                                "offerList": hotelValue.hotelSpas
                                            });
                                        } else {
                                            return;
                                        }
                                    });

                                    if (dataArray.length > 0) {

                                        dataArray.sort(app.SWGApplication.dataController.sortObject("hotelName", false));

                                        (_requirementsArray.ajax) && $(".spa-container .feature-container").empty();

                                        $("#" + _id).find(".more").on("click", function (e) {
                                            e.preventDefault();

                                            var timer = 0;

                                            // Add HTML to DOM
                                            app.SWGApplication.dataController.generateSpaData(dataArray, _requirementsArray, _id);

                                            viewportObj.find("#" + _id + " .feature-container-wrapper.hide").each(function (index, element) {
                                                $(element).delay(100 * index).fadeIn("slow", function () {
                                                    $(this).removeClass("hide");
                                                });

                                                timer = 100 * index;
                                            });

                                            // Handle more button display
                                            if (_requirementsArray.itemCounter >= dataArray.length || _requirementsArray.itemCounter > parseInt(_requirementsArray.itemLimit, 10)) {

                                                $(this).fadeOut();
                                            } else {

                                                if (_requirementsArray.itemLimit !== null) {
                                                    if (_requirementsArray.itemCounter >= _requirementsArray.itemLimit) {
                                                        this.init = false;
                                                    }
                                                }

                                                if (typeof this.init === "undefined") {
                                                    this.init = true;
                                                    $(this).delay(timer + 500).fadeIn(1000);
                                                }
                                            }

                                        });

                                        // Display initial data set HTML
                                        $("#" + _id).find(".more").trigger("click");

                                    } else {
                                        $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");
                                    }

                                } else {
                                    $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");
                                }

                            },

                            generateSpaData: function (_data, _requirementsArray, _id) {

                                var htmlString = "";
                                var paginationLimit = _requirementsArray.itemLimit;

                                $.each(_data, function (dataIndex, dataValue) {

                                    if (paginationLimit !== null) {
                                        if (dataIndex >= paginationLimit) {
                                            return;
                                        }
                                    }

                                    if (dataIndex >= _requirementsArray.itemCounter && dataIndex < _requirementsArray.itemCounter + _requirementsArray.itemInterval) {

                                        htmlString += '<div class="feature-container-wrapper hide">';
                                        htmlString += '<a href="/' + app.SWGApplication.dataModel.language + "/hotel/" + app.SWGApplication.dataController.classifyString(CommonDictionary.country.toLowerCase(), "urlConversionDictionary") + "/" + CommonDictionary.destination + "/" + app.SWGApplication.dataController.classifyString(dataValue.hotelName, "urlConversionDictionary") + '" class="feature-item">';

                                        // START Content
                                        htmlString += '<div class="feature-content">';

                                        htmlString += '<span class="spa name">';
                                        htmlString += '<span class="data">' + dataValue.hotelName + '</span>';
                                        htmlString += '</span>';

                                        // START Description
                                        htmlString += '<div class="spa description scroll-bar">';
                                        htmlString += '<div class="data">';

                                        htmlString += '<ul class="bullet blue">';

                                        $.each(dataValue.offerList, function (offerIndex, offerValue) {
                                            htmlString += '<li>' + offerValue + '</li>';
                                        });

                                        htmlString += '</ul>';

                                        htmlString += '</div>';
                                        htmlString += '</div>';
                                        // END Description

                                        htmlString += '<span class="spa cta">';
                                        htmlString += '<span class="data">';
                                        htmlString += '<span>' + CommonDictionary.exploreAllServices + '</span>';
                                        htmlString += '</span>';
                                        htmlString += '</span>';

                                        htmlString += '</div>';
                                        // END Content

                                        htmlString += '</a>';
                                        htmlString += '</div>';

                                        $(".spa-container .feature-container").append(htmlString);

                                    } else {
                                        return;
                                    }

                                    htmlString = '';
                                });

                                _requirementsArray.itemCounter += _requirementsArray.itemInterval;
                            },

                            appendCasinoData: function (_data, _requirementsArray, _id) {

                                var dataArray = [];

                                if (!$.isEmptyObject(_data)) {

                                    $.each(_data, function (hotelIndex, hotelValue) {

                                        if (app.SWGApplication.dataController.classifyString(hotelValue.destinationName.toLowerCase(), "urlConversionDictionary") === app.SWGApplication.dataController.classifyString(CommonDictionary.destination.toLowerCase(), "urlConversionDictionary")) {

                                            $.each(hotelValue.hotelCasinosInfo.casinos, function (casinoIndex, casinoValue) {

                                                dataArray.push({
                                                    "casinoName": casinoValue.name,
                                                    "address": casinoValue.address,
                                                    "hours": casinoValue.hours,
                                                    "bars": casinoValue.numOfBars,
                                                    "restaurants": casinoValue.numOfRestaurants,
                                                    "games": casinoValue.games
                                                });

                                            });

                                        } else {
                                            return;
                                        }
                                    });

                                    if (dataArray.length > 0) {

                                        dataArray.sort(app.SWGApplication.dataController.sortObject("casinoName", false));

                                        (_requirementsArray.ajax) && $(".casino-container").empty();

                                        $("#" + _id).find(".more").on("click", function (e) {
                                            e.preventDefault();

                                            var timer = 0;

                                            app.SWGApplication.dataController.generateCasinoData(dataArray, _requirementsArray, _id);

                                            viewportObj.find("#" + _id + " .feature-container-wrapper.hide").each(function (index, element) {
                                                $(element).delay(100 * index).show(function () {
                                                    $(this).removeAttr("style");
                                                    $(this).removeClass("hide");
                                                });

                                                timer = 100 * index;
                                            });

                                            // Handle more button display
                                            if (_requirementsArray.itemCounter >= dataArray.length || _requirementsArray.itemCounter > parseInt(_requirementsArray.itemLimit, 10)) {

                                                $(this).fadeOut();
                                            } else {

                                                if (_requirementsArray.itemLimit !== null) {
                                                    if (_requirementsArray.itemCounter >= _requirementsArray.itemLimit) {
                                                        this.init = false;
                                                    }
                                                }

                                                if (typeof this.init === "undefined") {
                                                    this.init = true;
                                                    $(this).delay(timer + 500).fadeIn(1000);
                                                }
                                            }

                                        });

                                        // Display initial data set 
                                        $("#" + _id).find(".more").trigger("click");

                                    } else {
                                        $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");
                                    }

                                } else {
                                    $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");
                                }
                            },

                            generateCasinoData: function (_data, _requirementsArray, _id) {
                                var htmlString = "";
                                var counter = 1;
                                var paginationLimit = _requirementsArray.itemLimit;
                                var total = (paginationLimit) ? paginationLimit : _data.length;

                                $.each(_data, function (dataIndex, dataValue) {

                                    if (paginationLimit !== null) {
                                        if (dataIndex >= paginationLimit) {
                                            return;
                                        }
                                    }

                                    if (dataIndex >= _requirementsArray.itemCounter && dataIndex < _requirementsArray.itemCounter + _requirementsArray.itemInterval) {
                                        if (counter === 1) {
                                            htmlString += '<div class="feature-container dt">';
                                        }

                                        htmlString += '<div class="feature-container-wrapper dtc hide">';

                                        htmlString += '<div class="feature-item">';
                                        htmlString += '<div class="feature-content">';

                                        htmlString += '<span class="casino name">';
                                        htmlString += '<span class="data">' + dataValue.casinoName + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="casino address">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdCasinoAddress + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.address + '</span>';
                                        htmlString += '</span>';

                                        htmlString += '<span class="casino hours">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdCasinoHours + ' </span>';
                                        htmlString += '<span class="data">' + dataValue.hours + '</span>';
                                        htmlString += '</span>';

                                        if (parseInt(dataValue.bars, 10) > 0) {
                                            htmlString += '<span class="casino no-bars">';
                                            htmlString += '<span class="heading">' + CommonDictionary.ttdCasinoBars + ' </span>';
                                            htmlString += '<span class="data">' + dataValue.bars + '</span>';
                                            htmlString += '</span>';
                                        }

                                        if (parseInt(dataValue.restaurants, 10) > 0) {
                                            htmlString += '<span class="casino no-restaurants">';
                                            htmlString += '<span class="heading">' + CommonDictionary.ttdCasinoRestaurants + ' </span>';
                                            htmlString += '<span class="data">' + dataValue.restaurants + '</span>';
                                            htmlString += '</span>';
                                        }

                                        htmlString += '<span class="casino games">';
                                        htmlString += '<span class="heading">' + CommonDictionary.ttdCasinoGames + '</span>';
                                        htmlString += '<span class="data">';

                                        $.each(dataValue.games, function (gamesIndex, gamesValue) {
                                            htmlString += " &bull; " + gamesValue + " ";
                                        });

                                        htmlString += '</span>';
                                        htmlString += '</span>';

                                        htmlString += '</div>';
                                        htmlString += '</div>';

                                        htmlString += '</div>';

                                        if (counter >= 2 || dataIndex >= total - 1) {

                                            if (counter == 1 && dataIndex >= total - 1) {
                                                htmlString += '<div class="feature-container-wrapper dtc empty hide"></div>';
                                            }

                                            htmlString += '</div>';
                                            counter = 0;
                                            $(".casino-container").append(htmlString);
                                            htmlString = '';
                                        }

                                        counter++;

                                    } else {
                                        return;
                                    }

                                });

                                _requirementsArray.itemCounter += _requirementsArray.itemInterval;
                            },

                            loadWebServiceAPI: function (_requirementsArray, _id) {

                                var wsQuery = hotelServicesURL + "1/" + app.SWGApplication.dataModel.language + "/" + _requirementsArray.serviceAPI + "/" + _requirementsArray.code;

                                $.ajax({
                                    type: "GET",
                                    url: wsQuery,
                                    dataType: "json",
                                    cache: false,
                                    success: function (data) {

                                        if (!$.isEmptyObject(data)) {

                                            app.SWGApplication.dataController.displayAjaxTabData(data, _requirementsArray, _id);
                                        } else {
                                            // Error message
                                            $("[id='" + _id + "']").html("<p>" + CommonDictionary.naInDestination + "</p>");

                                            // Data is unavailable
                                            window.console && console.log("Data is unavailable");
                                        }

                                        // Update data attributes
                                        $("#" + _id).attr("data-ajax", false);
                                        $("#" + _id).data("ajax", false);
                                        _requirementsArray.ajax = false;
                                        destinationTabRequirement[_id].ajax = false;

                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        // Web service not available
                                        window.console && console.log("Web service not available");
                                    }
                                });

                            },

                            loadHotelFilterApp: function () {

                                // Load filter tabs
                                app.SWGApplication.dataController.initResponsiveDDTabs(filterWrapperObj);

                                // Display dateway alert message
                                $(".hotel-filter-application [name='departure-gateway']").one("change", function () {
                                    $(this).closest(".hotel-filter-application").find(".gateway-message").show();
                                });

                                // Activate hotel filter list view
                                app.SWGApplication.dataController.loadHotelFilterListView();

                                // Map & List view toggle button
                                $(".hotel-filter-application .menu-wrapper .filter-toggle .app-view").on("click", function (e) {
                                    e.preventDefault();

                                    if (typeof this.toggle === "undefined" || this.toggle === "list-view") {

                                        $(".hotel-filter-application .list-view").removeClass("show").addClass("hide");
                                        $(".hotel-filter-application .map-view").removeClass("hide").addClass("show");
                                        $(this).text("List view");

                                        this.toggle = "map-view";
                                    } else {

                                        $(".hotel-filter-application .list-view").removeClass("hide").addClass("show");
                                        $(".hotel-filter-application .map-view").removeClass("show").addClass("hide");
                                        $(this).text("Map view");

                                        this.toggle = "list-view";
                                    }
                                });
                            },

                            loadHotelFilterListView: function () {

                                productGroupObj.each(function (groupIndex, groupElement) {

                                    // Top header toggle switch
                                    $(groupElement).find(".toggle-cta").on("click", function (e) {
                                        e.preventDefault();

                                        if (typeof this.toggle === "undefined" || !this.toggle) {

                                            $(groupElement).removeClass("collapsed");
                                            $(this).find(".less").addClass("show").removeClass("hide");
                                            $(this).find(".more").removeClass("show").addClass("hide");
                                            this.toggle = true;
                                        } else {

                                            $(groupElement).addClass("collapsed");
                                            $(this).find(".less").removeClass("show").addClass("hide");
                                            $(this).find(".more").addClass("show").removeClass("hide");
                                            this.toggle = false;
                                        }

                                    });

                                    // Bottom panel toggle switch
                                    $(groupElement).find(".toggle-cta-hide").on("click", function (e) {
                                        e.preventDefault();
                                        $(this).closest(".product-container-group").find(".toggle-cta").trigger("click");
                                    });

                                    // Tab filter logic 
                                    viewportObj.on("click", ".filter", function (e) {
                                        e.preventDefault();

                                        var filterTotal = 0;

                                        if ($.isEmptyObject(this.total)) {
                                            this.total = $(groupElement).find(".product-item").length;
                                            this.counter = 0;
                                        }

                                        var filter = $(this).data("filter");

                                        if (filter) {

                                            filterTotal = $(groupElement).find(".product-item").filter(filter).length;

                                            // Update total
                                            updateTotal(this.total - $(groupElement).find(".product-item").not(filter).length);

                                            // Update DOM
                                            if (filterTotal <= 0) {
                                                $(groupElement).addClass("hide");
                                            } else {
                                                $(groupElement).removeClass("hide");
                                                $(groupElement).find(".product-item").removeClass("first-active");
                                            }

                                            if (filterTotal === 1) {
                                                $(groupElement).find(".toggle-cta").addClass("hide");
                                                $(groupElement).find(".toggle-cta-hide").addClass("hide");
                                            } else {
                                                $(groupElement).find(".toggle-cta").removeClass("hide");
                                                $(groupElement).find(".toggle-cta-hide").removeClass("hide");
                                            }

                                            $(groupElement).find(".product-item").not(filter).each(function (itemIndex, itemElement) {

                                                if ($(itemElement).is(":visible")) {
                                                    $(itemElement).fadeOut(100);
                                                } else {
                                                    $(itemElement).css("display", "none");
                                                }

                                                $(itemElement).removeClass("active");
                                            });

                                            $(groupElement).find(".product-item").filter(filter).stop().fadeIn(100, function () {
                                                $(this).removeAttr("style");
                                                $(this).addClass("active");
                                            });

                                            $(groupElement).find(".product-item").filter(filter).eq(0).addClass("first-active");

                                        } else {

                                            // Update total
                                            updateTotal($(groupElement).find(".product-item").length);

                                            // Update DOM
                                            $(groupElement).removeClass("hide");
                                            $(groupElement).find(".product-item").removeClass("first-active");
                                            $(groupElement).find(".toggle-cta").removeClass("hide");
                                            $(groupElement).find(".toggle-cta-hide").removeClass("hide");
                                            $(groupElement).find(".product-item").eq(0).addClass("first-active");
                                            $(groupElement).find(".product-item").addClass("active");

                                            $(groupElement).find(".product-item").stop().fadeIn(300, function () {
                                                $(this).removeAttr("style");
                                            });

                                        }

                                        function updateTotal(_total) {

                                            if (_total > 1) {
                                                $(groupElement).find(".total").text(_total);

                                                if ($(groupElement).hasClass("collapsed")) {
                                                    $(groupElement).find(".total").closest(".more").removeClass("hide").addClass("show");
                                                }

                                            } else {
                                                $(groupElement).find(".total").text(_total);

                                                if ($(groupElement).hasClass("collapsed")) {
                                                    $(groupElement).find(".total").closest(".more").removeClass("show").addClass("hide");
                                                }

                                            }

                                        }

                                    });

                                    // Update hotel name layout to float hotel ratings based on name length 
                                    function updateHotelName(_groupElement) {
                                        var hotelNameObj = $(_groupElement).find(".hotel-name .name");

                                        hotelNameObj.each(function (nameIndex, nameElement) {

                                            if ($(nameElement).get(0).scrollWidth <= $(nameElement).width() && $(nameElement).get(0).scrollWidth > 0) {
                                                $(nameElement).closest(".hotel-name").addClass("fluid");
                                            } else {
                                                $(nameElement).closest(".hotel-name").removeClass("fluid");
                                            }

                                        });

                                    }


                                });

                                viewportObj.find(".filter.default").trigger("click");
                            },

                            loadResponsiveAdModuleTabs: function () {

                                var totalTabs = $(".promo-module .tab-wrapper .tab-item").length;

                                if (totalTabs > 2) {
                                    $(".promo-module .tab-wrapper").responsiveDDTabManager({
                                        mobileBreakPoint: 475,
                                        menuWidth: 230,
                                        showMobileActiveText: true,
                                        onTabClicked: function (thisIndex, thisInstance) {
                                            $(".promo-description .description .text").children().removeClass("show").addClass("hide");
                                            $(".promo-description .description .text .content_" + (thisIndex + 1)).addClass("show");
                                        }
                                    });
                                } else {
                                    $(".promo-module .tab-wrapper").hide();
                                }

                            },

                            loadResponsiveHoverPanelGrid: function () {

                                var fwPluginInstance = null; // Freewall plugin instance

                                function setOptions(fwPluginInstance) {

                                    var fwOptions = {
                                        selector: ".hover-panel-feature",
                                        cellW: 250,
                                        cellH: 230,
                                        fixSize: false,
                                        delay: 20,
                                        gutterX: 15,
                                        gutterY: 15,
                                        animate: true,
                                        onResize: function () {
                                            this.refresh();
                                            this.fitWidth();
                                        }
                                    };

                                    fwPluginInstance = app.SWGApplication.dataController.initFreewallPlugin(fwPluginInstance, ".hover-panel-container.animate-wall", fwOptions);

                                    return fwPluginInstance;
                                }

                                fwPluginInstance = setOptions(fwPluginInstance);

                            },

                            loadDestinationMediaGalleries: function () {

                                var initGallery = false;
                                var videoSliderObj = $("#gallery-modal .video-gallery-slider");
                                var imageSliderObj = $("#gallery-modal .thumbnail-gallery-slider");

                                // Get video playlist information
                                var playList = videoSliderObj.data("play-list");

                                if (!!playList) {

                                    playList = playList.toString().split(",");

                                    // Update Data model
                                    app.SWGApplication.dataModel.videoPlayer["brightCove-SSL"]["playList"] = playList;

                                } else {
                                    window.console && console.log("Missing video playlist");
                                }

                                $(".video-gallery").on("click", function (e) {
                                    e.preventDefault();

                                    // value: json object or false
                                    var videoData = app.SWGApplication.dataController.detectVideoPlayerSSL();

                                    if (typeof videoData !== "boolean") {

                                        // Initialize gallery
                                        setTimeout(function () {
                                            var presentationData;

                                            app.SWGApplication.dataController.showVideoPlayList(videoSliderObj, videoData, presentationData);
                                            videoSliderObj.show();
                                        }, 100);

                                    } else {
                                        e.stopPropagation();
                                    }

                                });

                                $(".image-gallery").on("click", function (e) {
                                    e.preventDefault();

                                    // Initialize gallery
                                    var controls = (imageSliderObj.find(".bxslider li").length > 1) ? true : false;

                                    if (!controls) {
                                        imageSliderObj.find(".row-slideshow").addClass("one-slider");
                                    }

                                    setTimeout(function () {
                                        imageSliderObj.show();
                                        $("#gallery-modal .modal-dialog").addClass("modal-xlg");
                                        initSlider(imageSliderObj, controls);
                                    }, 100);
                                });

                                // Reset all content and JS
                                $("#gallery-modal").on("hidden.bs.modal", function (e) {
                                    $("#gallery-modal .gallery").hide();
                                    $("#gallery-modal .modal-dialog").removeClass("modal-xlg");
                                });

                                function initSlider(_element, _controls) {

                                    var infiniteFlag = ($(_element).find("li").length > 1) ? true : false;

                                    var settings = {
                                        auto: true,
                                        autoControls: true,
                                        controls: _controls,
                                        mode: "fade",
                                        autoResume: true,
                                        useCSS: true,
                                        captions: true,
                                        pagerCustom: "#bx-pager",
                                        pause: 5000,
                                        easing: (Modernizr.csstransitions) ? "ease-in-out" : "swing",
                                        prevText: '<i class="fa fa-chevron-left"></i>',
                                        nextText: '<i class="fa fa-chevron-right"></i>',
                                        infiniteLoop: infiniteFlag,
                                        onSliderLoad: function ($thisSlider, currentIndex) {
                                            if (_controls) loadPNTabbing($thisSlider);
                                        }
                                    };

                                    if (typeof thumbnailGallerySliderPluginObj !== "undefined") {
                                        thumbnailGallerySliderPluginObj.destroySlider();
                                        $(_element).find("#bx-pager").off("click");
                                        $(_element).find(".bxslider li:not(:first-of-type)").hide();
                                    }

                                    setTimeout(function () {
                                        thumbnailGallerySliderPluginObj = $(_element).find(".bxslider").bxSlider(settings);
                                    }, 100);

                                    function loadPNTabbing(_thisSliderObj) {

                                        _thisSliderObj.next().find(".bx-prev").on("focus blur", function (e) {

                                            if (e.type === "focus") {
                                                $(this).closest(".bx-controls").addClass("opacity-full");
                                            } else {
                                                $(this).closest(".bx-controls").removeClass("opacity-full");
                                            }

                                        });

                                        _thisSliderObj.next().find(".bx-next").on("focus blur", function (e) {
                                            if (e.type === "focus") {
                                                $(this).closest(".bx-controls").addClass("opacity-full");
                                            } else {
                                                $(this).closest(".bx-controls").removeClass("opacity-full");
                                            }
                                        });
                                    }

                                }

                            },

                            showVideoPlayList: function (_videoDOMContainer, _settings, _display) {

                                generateVideoHTML(_videoDOMContainer, _settings, _display);

                                function generateVideoHTML(_videoDOMContainer, _settings, _display) {
                                    loadBrightcoveVideoSSL(_videoDOMContainer, _settings, _display);
                                }

                                function loadBrightcoveVideoSSL(_videoDOMContainer, _settings, _display) {

                                    var autoPlay = true; // default to autoplay video
                                    var controls = true;
                                    var html = "";

                                    html += "<div style='padding-top: 56.5%;'>";

                                    html += "<video class='video-js'";
                                    //html += (_settings.videoData.videoPlayList.length > 1) ? " data-playlist-id='" + _settings.videoData.videoPlayList[0] + "'" : " data-video-id='" + _settings.videoData.videoPlayList[0] + "'";
                                    html += " data-video-id='" + _settings.videoData.videoPlayList[0] + "'";

                                    html += " data-account='" + _settings.videoData.videoAccount + "'";
                                    html += " data-player='" + _settings.videoData.videoPlayer + "'";
                                    html += (autoPlay) ? " autoplay" : "";
                                    html += (controls) ? " controls" : "";
                                    html += " data-embed='default'";
                                    html += "></video>";

                                    html += "<script src='//players.brightcove.net/" + _settings.videoData.videoAccount + "/" + _settings.videoData.videoPlayer + "_default/index.min.js'></script>";

                                    //html += (_settings.videoData.videoPlayList.length > 1) ? "<ol class='vjs-playlist'></ol>" : "";

                                    html += "</div>";

                                    $(_videoDOMContainer).empty();
                                    $(_videoDOMContainer).append(html);
                                }

                            },

                            loadScrollableNavigation: function () {

                                // Mixed Media Navigation
                                scrollMoreObj.on("click", function (e) {
                                    e.preventDefault();

                                    scrollMoreNavigationObj.slideDown(500);
                                    $(this).slideUp(500);
                                });

                                if (scrollMoreNavigationObj.children().length > 0) {
                                    scrollMoreObj.fadeIn(2000);
                                }

                                // Attach click event for mixed media navigation
                                scrollNavigationObj.find("a").each(function (scrollIndex, scrollElement) {

                                    var href = $(scrollElement).attr("href");
                                    var scrollSpyID = href.replace("#", "");

                                    $(scrollElement).on("click", function (e) {
                                        e.preventDefault();
                                        app.SWGApplication.dataController.scrollViewport(scrollSpyID, 3000, null, 15);
                                    });

                                });

                                // Attach click event for sticky navigation
                                scrollStickyNavigationObj.find("a").each(function (scrollIndex, scrollElement) {

                                    var clickElementObj = $(scrollElement);
                                    var href = clickElementObj.attr("href");
                                    var scrollID = href.replace("#", "");
                                    var scrollState = true;
                                    var preScrollFN = clickElementObj.data("pre-scroll");
                                    var postScrollFN = clickElementObj.data("post-scroll");
                                    var delayTime = 0;

                                    clickElementObj.on("click", function (e) {

                                        if (href.substring(0, 1).indexOf("#") > -1) {

                                            e.preventDefault();

                                            // Load the pre scroll function
                                            if (preScrollFN) {
                                                app.SWGApplication.dataController[preScrollFN](scrollID, preScrollFN);
                                                delayTime = 300;
                                            }

                                            setTimeout(function () {

                                                scrollState = app.SWGApplication.dataController.scrollViewport(scrollID, 3000, (stickySideNavigationExists) ? null : scrollStickyNavigationObj, 5, postScrollFN);

                                                if (!scrollState) {
                                                    $(this).trigger("blur");
                                                    scrollState = true;
                                                }

                                            }, delayTime);

                                        }

                                    });

                                    // Determine if anchor is active
                                    if (href.substring(0, 1).indexOf("#") < 0 && window.location.href.indexOf(href) > -1) {
                                        clickElementObj.addClass("active");
                                    }

                                });

                                if (scrollStickyNavigationExists && scrollStickyNavigationObj.data("scroll-navigation") === true) {

                                    var frameObj = $(".sticky-navigation-container .navigation-wrapper");
                                    var parentObj = frameObj.parent();

                                    var options = {
                                        horizontal: true,
                                        itemNav: "basic",
                                        speed: 300,
                                        mouseDragging: true,
                                        touchDragging: true,
                                        smart: true,
                                        elasticBounds: false,
                                        easing: "easeOutExpo",
                                        prevPage: parentObj.find(".navigation-buttons .prevPage"),
                                        nextPage: parentObj.find(".navigation-buttons .nextPage")
                                    };

                                    horizontalMenuInstance = new Sly(".sticky-navigation-container .navigation-wrapper", options).init();
                                }

                                scrollIDObj.each(function (sIndex, sElement) {

                                    var clickElementObj = $(sElement);
                                    var scrollID = clickElementObj.attr("href").replace("#", "");
                                    var preScrollFN = clickElementObj.data("pre-scroll");
                                    var postScrollFN = clickElementObj.data("post-scroll");
                                    var delayTime = 0;

                                    if (scrollID.length > 0) {

                                        clickElementObj.on("click", function (e) {
                                            e.preventDefault();

                                            // check if global function is called
                                            if (typeof window[preScrollFN] === "function") {
                                                window[preScrollFN]();
                                            } else {

                                                // Load the pre scroll function
                                                if (typeof app.SWGApplication.dataController[preScrollFN] === "function") {
                                                    app.SWGApplication.dataController[preScrollFN](scrollID, preScrollFN);
                                                    delayTime = 300;
                                                }

                                            }

                                            setTimeout(function () {
                                                app.SWGApplication.dataController.scrollViewport(scrollID, 2000, null, 15, postScrollFN);
                                            }, delayTime);

                                        });

                                    }
                                });
                            },

                            updateScrollableNavigation: function () {

                                var headerObj = $("header");
                                var footerObj = $("footer");
                                var scrollStickyNavbarObj = scrollStickyNavigationObj.find(".sticky-navbar");
                                var stickyHeight = scrollStickyNavbarObj.outerHeight(true);

                                //if ( && stickyHeight > scrollStickyNavbarObj.parent().height()){

                                // Sticky Navigation 
                                if (scrollStickyNavigationExists && scrollStickyNavigationObj.is(":visible") && currentViewPort !== "xs") {

                                    var stickyWidth = scrollStickyNavigationObj.width();

                                    // Custom Bottom Limit
                                    var scrollBottom = scrollStickyNavigationObj.data("scroll-bottom");
                                    var scrollBottomObj = (!!scrollBottom && $(scrollBottom).length > 0) ? $(scrollBottom) : null;

                                    var windowBottom = viewportObj.get(0).scrollHeight;
                                    var bottomLimit = 0;

                                    // Update sticky nav width
                                    if (stickyWidth && stickySideNavigationExists) {
                                        scrollStickyNavbarObj.css("width", stickyWidth);
                                    }

                                    // Calculate bottom limit 
                                    if (scrollBottomObj !== null) {
                                        bottomLimit = scrollBottomObj.offset().top - stickyHeight - 15;
                                    } else if (footerObj.length > 0) {
                                        bottomLimit = footerObj.offset().top - stickyHeight - 15;
                                    } else {
                                        bottomLimit = windowBottom - stickyHeight;
                                    }

                                    var anchorScrollTop = $(".sticky-navigation-anchor").offset().top;

                                    if (windowScrollTop >= anchorScrollTop && !toggleScroll && windowScrollTop < bottomLimit) {
                                        toggleScroll = true;
                                        scrollStickyNavbarObj.addClass("navbar-fixed-top");

                                        // Destinations Level 2 search input
                                        scrollStickyNavigationObj.find(".search-bar .hotel-search").show();

                                    } else if (windowScrollTop < anchorScrollTop && toggleScroll && windowScrollTop < bottomLimit) {
                                        toggleScroll = false;
                                        scrollStickyNavbarObj.removeClass("navbar-fixed-top");

                                        // Destinations Level 2 search input
                                        scrollStickyNavigationObj.find("a").trigger("blur");
                                        scrollStickyNavigationObj.find("input").trigger("blur");
                                        scrollStickyNavigationObj.find(".search-bar .hotel-search").hide();

                                    } else {

                                        if (windowScrollTop >= bottomLimit) {
                                            scrollStickyNavbarObj.addClass("navbar-stop");

                                            var bottomPosition = 0;
                                            var headerOffset = parseInt(headerObj.find(".logo-menu-wrapper").css("margin-top"), 10);

                                            if (scrollBottomObj !== null) {

                                                if (stickySideNavigationExists) {
                                                    bottomPosition = bottomLimit - stickyHeight - (scrollStickyNavigationObj.outerHeight(true) - 32) + ((headerObj.length > 0) ? headerObj.height() : 0);
                                                } else {
                                                    bottomPosition = bottomLimit - stickyHeight + headerOffset;
                                                }

                                            } else if (headerObj.length > 0) {

                                                if (stickySideNavigationExists) {
                                                    bottomPosition = bottomLimit - stickyHeight - (scrollStickyNavigationObj.outerHeight(true) - 32) + ((headerObj.length > 0) ? headerObj.height() : 0);
                                                } else {
                                                    bottomPosition = bottomLimit - stickyHeight + headerOffset;
                                                }

                                            } else {
                                                bottomPosition = bottomLimit;
                                            }

                                            if (bottomPosition > 0) {
                                                scrollStickyNavbarObj.removeClass("navbar-static").css("top", bottomPosition);
                                            } else if (stickySideNavigationExists && stickyHeight > scrollStickyNavbarObj.parent().height()) {
                                                scrollStickyNavbarObj.addClass("navbar-static");
                                                scrollStickyNavbarObj.css("top", "");
                                            }

                                            scrollStickyNavigationObj.find("input").trigger("blur");

                                        } else {
                                            scrollStickyNavbarObj.removeClass("navbar-stop");
                                            scrollStickyNavbarObj.css("top", 0);
                                        }
                                    }
                                } else if (scrollStickyNavigationExists && scrollStickyNavigationObj.is(":visible")) {
                                    scrollStickyNavbarObj.addClass("navbar-stop");
                                    scrollStickyNavbarObj.css("top", "");
                                }

                                //}
                            },

                            scrollViewport: function (_scrollTarget, _scrollTime, _scrollElement, _vertOffset, _callback) {

                                var scrollPosition;

                                // Page scroll with user interuption
                                if (typeof _scrollTarget === "string") {

                                    if (_scrollTarget.length > 0 && $("[id='" + _scrollTarget + "']").length > 0) {
                                        scrollPosition = $("[id='" + _scrollTarget + "']").offset().top;
                                    } else {
                                        // Target not found
                                        return false;
                                    }

                                    if (_scrollElement !== null) {
                                        scrollPosition -= $(_scrollElement).outerHeight(true);
                                    }

                                    if (typeof _vertOffset === "number") {
                                        scrollPosition -= _vertOffset;
                                    }

                                } else if (typeof _scrollTarget === "number") {
                                    scrollPosition = _scrollTarget;
                                }

                                if (typeof scrollPosition !== "undefined" && windowScrollTop !== scrollPosition) {

                                    viewportObj.animate({
                                        scrollTop: scrollPosition
                                    }, _scrollTime, "easeOutExpo", function () {

                                        if (_callback) {

                                            // Check if global function is called
                                            if (typeof window[_callback] === "function") {
                                                window[_callback]();
                                            } else {

                                                // Check if internal function is called
                                                if (typeof app.SWGApplication.dataController[_callback] === "function") {
                                                    app.SWGApplication.dataController[_callback]();
                                                } else {
                                                    // Execute function literal
                                                    _callback();
                                                }

                                            }

                                        }

                                        $("[href='#" + _scrollTarget + "']").trigger("blur");

                                    });

                                }

                                // Stop the animation if the user interacts with the page
                                viewportObj.on("scroll mousedown DOMMouseScroll mousewheel", function (e) {

                                    if (e.which > 0 || e.type === "mousedown" || e.type === "mousewheel") {
                                        viewportObj.stop().off('scroll mousedown DOMMouseScroll mousewheel');
                                    }
                                });

                                return true;
                            },

                            classifyString: function (_dataSource, _dictionary) {

                                // Convert all invalid characters to dictionary safe characters
                                var modifiedString = _dataSource.toLowerCase().replace(/[^\w]/g, function (character) {
                                    return app.SWGApplication.dataModel[_dictionary][character] || character;
                                });

                                // Remove all underscores designated as redundant characters
                                modifiedString = $.trim(modifiedString).replace(/[_]/g, "");
                                // Change all white space to hyphens
                                modifiedString = $.trim(modifiedString).replace(/[\s]/g, "-");
                                return modifiedString;
                            },

                            getBrowserIE: function (_browser) {

                                if (_browser.indexOf("trident") > -1 || _browser.indexOf("msie") > -1) {
                                    var msieUA = (_browser.indexOf("msie") > -1) ? "msie" : "trident";

                                    var versionStartPos = _browser.indexOf(msieUA);
                                    var versionEndPos;
                                    var thisBrowser;

                                    if (msieUA === "trident") {
                                        versionEndPos = (_browser.indexOf(";", versionStartPos) > 0) ? _browser.indexOf(";", versionStartPos) : _browser.length;
                                        thisBrowser = _browser.substring(versionStartPos, versionEndPos).split("/");
                                        thisBrowser[1] = Math.abs(thisBrowser[1]) + 4;

                                    } else if (msieUA === "msie") {
                                        versionEndPos = (_browser.indexOf(";", versionStartPos) > 0) ? _browser.indexOf(";", versionStartPos) : _browser.length;
                                        thisBrowser = _browser.substring(versionStartPos, versionEndPos).split(" ");
                                    }

                                    return { ua: "msie", version: Math.abs(thisBrowser[1]) };

                                } else {
                                    return { ua: "other" };
                                }
                            },

                            shuffleArray: function (array) {
                                for (var i = array.length - 1; i > 0; i--) {
                                    var j = Math.floor(Math.random() * (i + 1));
                                    var temp = array[i];
                                    array[i] = array[j];
                                    array[j] = temp;
                                }
                                return array;
                            },

                            sortObject: function (_field, _reverse, _primer) {

                                var key = _primer ? function (x) { return _primer(x[_field]) } : function (x) { return x[_field] };

                                _reverse = !_reverse ? 1 : -1;

                                return function (a, b) {
                                    return a = key(a), b = key(b), _reverse * ((a > b) - (b > a));
                                }
                            },

                            detectVideoPlayer: function () {

                                if (!$.isEmptyObject(app.SWGApplication.dataModel.videoPlayer["brightCove"]["playList"]) && displayVideo) {
                                    videoPlayerID = app.SWGApplication.dataModel.videoPlayer["brightCove"]["playerID"];
                                    videoPlayerKey = app.SWGApplication.dataModel.videoPlayer["brightCove"]["playerKey"];
                                    videoPlayList = app.SWGApplication.dataModel.videoPlayer["brightCove"]["playList"];
                                    playVideo = true;
                                } else {
                                    playVideo = false;
                                }

                                return (playVideo) ? { "videoData": { "videoPlayerID": videoPlayerID, "videoPlayerKey": videoPlayerKey, "videoPlayList": videoPlayList } } : playVideo;

                            },

                            detectVideoPlayerSSL: function () {

                                if (!$.isEmptyObject(app.SWGApplication.dataModel.videoPlayer["brightCove-SSL"]["playList"]) && displayVideo) {
                                    videoPlayer = app.SWGApplication.dataModel.videoPlayer["brightCove-SSL"]["player"];
                                    videoAccount = app.SWGApplication.dataModel.videoPlayer["brightCove-SSL"]["account"];
                                    videoPlayList = app.SWGApplication.dataModel.videoPlayer["brightCove-SSL"]["playList"];
                                    playVideo = true;
                                } else {
                                    playVideo = false;
                                }

                                return (playVideo) ? { "videoData": { "videoPlayer": videoPlayer, "videoAccount": videoAccount, "videoPlayList": videoPlayList } } : playVideo;

                            },

                            loadScrollingTabs: function () {

                                // Load menu scrolling
                                var frameObj = $(".scrolling-tabs .scroll-container");
                                var parentObj = frameObj.parent();

                                var options = {
                                    horizontal: true,
                                    itemNav: "basic",
                                    speed: 300,
                                    mouseDragging: true,
                                    touchDragging: true,
                                    smart: true,
                                    elasticBounds: false,
                                    easing: "easeOutExpo",
                                    prevPage: parentObj.find(".scroll-buttons .prevPage"),
                                    nextPage: parentObj.find(".scroll-buttons .nextPage")
                                };

                                horizontalTabMenuInstance = new Sly(".scrolling-tabs .scroll-container", options).init();
                                horizontalTabMenuInstance["init"] = true;

                                thisWindow.trigger("resize");

                            },

                            loadThumbnailGallery: function (_element, _controls) {

                                function initSlider(_element, _controls) {

                                    var infiniteFlag = ($(_element).find("li").length > 1) ? true : false;

                                    var settings = {
                                        auto: true,
                                        autoControls: true,
                                        controls: _controls,
                                        mode: "fade",
                                        autoResume: true,
                                        useCSS: true,
                                        captions: true,
                                        pagerCustom: "#bx-pager",
                                        pause: 5000,
                                        easing: (Modernizr.csstransitions) ? "ease-in-out" : "swing",
                                        prevText: '<i class="fa fa-chevron-left"></i>',
                                        nextText: '<i class="fa fa-chevron-right"></i>',
                                        infiniteLoop: infiniteFlag,
                                        onSliderLoad: function ($thisSlider, currentIndex) {
                                            loadPNTabbing($thisSlider);
                                        }
                                    };

                                    if (typeof thumbnailGallerySliderPluginObj !== "undefined") {
                                        thumbnailGallerySliderPluginObj.destroySlider();
                                        $(_element).find("#bx-pager").off("click");
                                        $(_element).find(".bxslider li:not(:first-of-type)").hide();
                                    }

                                    setTimeout(function () {
                                        thumbnailGallerySliderPluginObj = $(_element).find(".bxslider").bxSlider(settings);
                                    }, 100);

                                    function loadPNTabbing(_thisSliderObj) {

                                        _thisSliderObj.next().find(".bx-prev").on("focus blur", function (e) {

                                            if (e.type === "focus") {
                                                $(this).closest(".bx-controls").addClass("opacity-full");
                                            } else {
                                                $(this).closest(".bx-controls").removeClass("opacity-full");
                                            }

                                        });

                                        _thisSliderObj.next().find(".bx-next").on("focus blur", function (e) {
                                            if (e.type === "focus") {
                                                $(this).closest(".bx-controls").addClass("opacity-full");
                                            } else {
                                                $(this).closest(".bx-controls").removeClass("opacity-full");
                                            }
                                        });
                                    }

                                }

                                initSlider(_element, _controls);
                            },

                            loadAccordionPanels: function (_id) {

                                // Outer panel listeners
                                $(_id + " .panel > .panel-collapse.collapse").on("show.bs.collapse", function () {
                                    $(this).parent().find(".fa-angle-right").removeClass("fa-angle-right").addClass("fa-angle-down");

                                }).on("hide.bs.collapse", function () {
                                    $(this).parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
                                });

                                // Inner panel listeners
                                $(_id + " .fa-plus-min .panel > .panel-collapse.collapse").on("show.bs.collapse", function (e) {
                                    e.stopImmediatePropagation();
                                    $(this).parent().find(".fa-plus-circle").removeClass("fa-plus-circle").addClass("fa-minus-circle");

                                }).on("hide.bs.collapse", function (e) {
                                    e.stopImmediatePropagation();
                                    $(this).parent().find(".fa-minus-circle").removeClass("fa-minus-circle").addClass("fa-plus-circle");
                                });

                            },

                            loadModalThumbnail: function () {

                                modalThumbnailObj.each(function (mtIndex, mtElement) {

                                    $(mtElement).on("click", function (e) {
                                        e.preventDefault();

                                        modalWindowObj.find(".modal-body").empty();

                                        var thumbnailTitle = $(this).attr("title");

                                        modalWindowObj.find(".modal-title").html(thumbnailTitle);
                                        $($(this).html()).appendTo("#" + modalWindowObj.attr("id") + " .modal-body");

                                        modalWindowObj.modal({
                                            show: true
                                        });
                                    });

                                });

                            },

                            loadModalPopOver: function () {

                                popOverTriggerObj.each(function (mpIndex, mpElement) {

                                    $(mpElement).on("click mouseenter focus", function (e) {
                                        e.preventDefault();

                                        if (currentViewPort === "xs" && (e.type === "click")) {
                                            modalWindowObj.find(".modal-body").empty();
                                            modalWindowObj.find(".modal-title").empty();
                                            modalWindowObj.find(".modal-header").hide();

                                            $($(this).parent().find(".popover-selection-content").clone()).appendTo("#" + modalWindowObj.attr("id") + " .modal-body");
                                            modalWindowObj.modal({
                                                show: true
                                            });

                                        } else {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            app.SWGApplication.dataController.refreshModalPopOver();
                                        }

                                    });

                                });

                            },

                            refreshModalPopOver: function () {

                                var positionArray = [
                                    {
                                        "tl": "tr",
                                        "tr": "tl",
                                        "bl": "br",
                                        "br": "bl"
                                    }
                                ];

                                popOverTriggerObj.each(function (mpIndex, mpElement) {

                                    if (currentViewPort !== "xs") {
                                        var popOverLeft = $(mpElement).parent().find(".popover-selection-content").offset().left;
                                        var positionClass = $(mpElement).closest(".popover-container").attr("class");
                                        var windowOverflow = (viewportObj.get(0).scrollWidth > viewportObj.width()) ? true : false;

                                        if (popOverLeft < 0 || windowOverflow) {

                                            for (var classItem in positionArray[0]) {

                                                if (positionClass.indexOf(classItem) > -1) {

                                                    $.each(positionArray, function (pIndex, pValue) {
                                                        $(mpElement).closest(".popover-container").removeClass().addClass("popover-container " + pValue[classItem]);
                                                    });

                                                }

                                            }

                                        }

                                    }

                                });

                            },

                            expandAccordion: function (_scrollID, _preScroll) {

                                var accordionElement = $("[id='" + _scrollID + "']");

                                if (accordionElement.attr("aria-expanded") == "false") {
                                    accordionElement.trigger("click");
                                }

                            },

                            showOneItinerary: function (_itinerary) {

                                if (_itinerary) {

                                    $(".panel[data-itinerary]").each(function (itineraryIndex, itineraryElement) {

                                        if ($(itineraryElement).data("itinerary").length > 0) {

                                            if ($(itineraryElement).data("itinerary").toLowerCase() !== _itinerary.toLowerCase()) {
                                                $(itineraryElement).addClass("hide");

                                            } else {
                                                var itineraryTabObj = $(itineraryElement).find(".panel-heading a");

                                                if (itineraryTabObj.attr("aria-expanded") == "false") {
                                                    itineraryTabObj.trigger("click");
                                                }
                                            }

                                        }
                                    });

                                }

                            },

                            loadWeatherToggle: function () {

                                var thisMonth = moment().month() + 1;

                                // Set active month
                                weatherCalendarObj.find("[data-month='" + thisMonth + "']").addClass("active");

                                // Click events to toggle imperial and metric content
                                weatherCalendarControlsObj.find("a.celsius").on("click", function (e) {
                                    e.preventDefault();

                                    weatherCalendarObj.children(".fahrenheit").hide();
                                    weatherCalendarObj.children(".celsius").show();
                                    $(this).addClass("active");
                                    weatherCalendarControlsObj.find("a.fahrenheit").removeClass("active");

                                });

                                weatherCalendarControlsObj.find("a.fahrenheit").on("click", function (e) {
                                    e.preventDefault();

                                    weatherCalendarObj.children(".celsius").hide();
                                    weatherCalendarObj.children(".fahrenheit").show();

                                    $(this).addClass("active");
                                    weatherCalendarControlsObj.find("a.celsius").removeClass("active");

                                });

                            },

                            updateVacationFinderTab: function () {

                                if (!vacationFinderTabObj.is(":visible") && searchBoxExists) {
                                    if (windowScrollTop > (searchBoxObj.offset().top + searchBoxObj.outerHeight(true)) && !vacationFinderInit) {
                                        vacationFinderTabObj.addClass("animate");
                                        vacationFinderInit = true;
                                    } else if (windowScrollTop > (searchBoxObj.offset().top + searchBoxObj.outerHeight(true)) && !vacationFinderDisplay && !vacationFinderTabObj.is(":animated") && vacationFinderInit) {
                                        showTab();
                                    }

                                } else if (vacationFinderTabObj.is(":visible") && searchBoxExists && vacationFinderInit) {
                                    if (windowScrollTop <= (searchBoxObj.offset().top + searchBoxObj.outerHeight(true)) && vacationFinderDisplay) {
                                        vacationFinderDisplay = false;
                                        hideTab();
                                    } else if (windowScrollTop > (searchBoxObj.offset().top + searchBoxObj.outerHeight(true)) && !vacationFinderDisplay && !vacationFinderTabObj.is(":animated")) {
                                        vacationFinderDisplay = true;
                                        showTab();
                                    }

                                }

                                function hideTab() {

                                    vacationFinderTabObj.animate({
                                        right: -vacationFinderTabObj.width()
                                    }, 1000, "easeOutExpo");

                                }

                                function showTab() {

                                    vacationFinderTabObj.animate({
                                        right: 0
                                    }, 1000, "easeOutExpo");

                                }
                            },

                            loadFeatureRecommendations: function () {

                                var elementArray = [];

                                // Attach toggle click events
                                featureRecommendationsObj.find(".feature-deal > a").each(function (fIndex, fElement) {

                                    // Feature promotion click event
                                    $(fElement).on("click", function (e) {
                                        e.preventDefault();

                                        if (typeof $(this).data("toggle") === "undefined" || !$(this).data("toggle")) {
                                            $(this).closest(".recommendation-item").addClass("active");
                                            $(this).data("toggle", true);
                                        } else {
                                            $(this).closest(".recommendation-item").removeClass("active");
                                            $(this).data("toggle", false)
                                        }

                                        if ($(this).closest(".recommendation-item").hasClass("active")) {
                                            if (typeof $(this).data("promo-loaded") === "undefined") {

                                                var url = $(fElement).attr("href");
                                                makeCall(fElement, url);
                                                var url = $(this).attr("href");
                                                $(this).closest(".recommendation-item").find(".side-menu .see-all").attr("href", url);
                                                $(this).data("promo-loaded", true);
                                            }
                                        }

                                        resetToggle(fElement);
                                        app.SWGApplication.dataController.displaySlider(fElement);

                                    });

                                    function attachCloseEvent(_fElement) {

                                        // Rule close button
                                        $(_fElement).closest(".recommendation-item").find(".close-rule a").on("click", function (e) {
                                            e.preventDefault();

                                            $(_fElement).closest(".recommendation-item").removeClass("active");
                                            $(_fElement).data("toggle", false);

                                            if (!$(_fElement).closest(".recommendation-item").find(".recommendation-rules").data("slider")) {
                                                app.SWGApplication.dataController.displaySlider(_fElement);
                                            }
                                        });

                                    }

                                    function makeCall(_thisElement, _url) {

                                        var pageRule = $(_thisElement).attr("data-rule");

                                        $.ajax({
                                            type: "POST",
                                            async: true,
                                            url: "/Home/_Promo",
                                            data: {
                                                pageCode: pageRule
                                            },
                                            dataType: "html",
                                            success: function (data) {

                                                $(_thisElement).closest(".recommendation-item").find(".recommendation-rules").html(data);
                                                $(_thisElement).closest(".recommendation-item").addClass("active-promo");
                                                $(_thisElement).closest(".recommendation-item").find(".loader").addClass("hide");
                                                $(_thisElement).closest(".recommendation-item").find(".side-menu .see-all").attr("href", "/" + app.SWGApplication.dataModel.language + _url);

                                                attachCloseEvent(_thisElement);
                                                app.SWGApplication.dataController.displaySlider(_thisElement);
                                            },
                                            error: function (xhr, textStatus, errorThrown) {
                                                var htmlString = "";

                                                $(_thisElement).closest(".recommendation-item").addClass("active");

                                                htmlString += '<div class="recommendation-rules dt">';
                                                htmlString += '<div class="loader">';
                                                htmlString += '<div class="load-content">';
                                                htmlString += '<div class="loader">';
                                                htmlString += '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>';
                                                htmlString += '<span class="sr-only">' + HomeDictionary.loading + '</span>';
                                                htmlString += '<span class="message">' + HomeDictionary.loadingStatusMessage + '</span>';
                                                htmlString += '</div>';
                                                htmlString += '</div>';
                                                htmlString += '</div>';
                                                htmlString += '</div>';

                                                $(_thisElement).closest(".recommendation-item").find(".recommendation-rules").html(htmlString);

                                                var errorMessage = (typeof HomeDictionary.loadErrorMessage !== "undefined") ? HomeDictionary.loadErrorMessage.replace("#", '/' + app.SWGApplication.dataModel.language + _url) : "Missing error message";

                                                $(_thisElement).closest(".recommendation-item").find(".loader .message").html("<span>" + errorMessage + "</span>");
                                            }
                                        });
                                    }

                                    function resetToggle(_thisElement) {
                                        $.each(elementArray, function (eIndex, eElement) {
                                            if (_thisElement !== eElement) {
                                                $(eElement).closest(".recommendation-item").removeClass("active");
                                                $(eElement).data("toggle", false);
                                            }
                                        });
                                    }

                                    elementArray.push(fElement);
                                });

                            },

                            // Determine create or destroy operation of rules slider instance
                            displaySlider: function (_anchor) {

                                var sliderID = $(_anchor).closest(".recommendation-item").find(".recommendation-rules").data("slider");
                                var validPromo = $(_anchor).closest(".recommendation-item").hasClass("active-promo");

                                if (validPromo) {

                                    if (currentViewPort === "xs" && typeof sliderID === "undefined") {
                                        app.SWGApplication.dataController.loadSlider($(_anchor).closest(".recommendation-item").find(".recommendation-rules"));
                                    } else if (currentViewPort !== "xs" && typeof sliderID !== "undefined") {
                                        app.SWGApplication.dataController.unLoadSlider($(_anchor).closest(".recommendation-item").find(".recommendation-rules"), sliderID);
                                    }

                                }

                            },

                            loadSlider: function (_bxSlider) {

                                var bxSliderCount = _bxSlider.find(".rule-item").length;

                                var infiniteLoop;
                                var controls;
                                var buttonHTML = "";

                                if (bxSliderCount <= 1) {
                                    infiniteLoop = false;
                                    controls = false;

                                    _bxSlider.find("." + featureRuleSliderPager).hide();
                                    _bxSlider.find("." + featureRuleSliderWrapperClass).hide();

                                } else {

                                    featureRuleSlideShowObj = _bxSlider.find("." + featureRuleSliderWrapperClass);

                                    infiniteLoop = true;
                                    controls = true;

                                    for (var i = 0; i < bxSliderCount; i++) {
                                        buttonHTML += '<a data-slide-index="' + i + '" href></a>';
                                        buttonHTML += '\n'; // add newline character
                                    }

                                    _bxSlider.find("." + featureRuleSliderPager).html(buttonHTML);

                                }

                                featureRuleSliderPluginObj = _bxSlider.find(".bxslider-rule").bxSlider({
                                    autoControls: true,
                                    autoResume: true,
                                    useCSS: true,
                                    responsive: false,
                                    hideControlOnEnd: true,
                                    adaptiveHeight: true,
                                    pagerCustom: ".active ." + featureRuleSliderPager,
                                    wrapperClass: featureRuleSliderWrapperClass,
                                    pause: 8000,
                                    speed: 1000,
                                    slideMargin: 15,
                                    easing: (Modernizr.csstransitions) ? "easeOutExpo" : "swing",
                                    prevText: '<i class="fa fa-angle-left"></i>',
                                    nextText: '<i class="fa fa-angle-right"></i>',
                                    infiniteLoop: false,
                                    onSliderLoad: function (currentIndex) {

                                        $.each(currentIndex, function (key, property) {
                                            $(currentIndex).find(".bxslider-rule").children().not(".bx-clone").eq(key).addClass("active");
                                            return;
                                        });

                                    },

                                    onSlideBefore: function ($slideElement) {
                                        $slideElement.parent().children().removeClass("active");
                                        $slideElement.addClass("active");
                                    }
                                });

                                var uniqueId = featureRuleSliderInstanceCounterArray.push(featureRuleSliderInstanceCounterArray.length + 1);

                                // Track new slider instance
                                _bxSlider.attr("data-slider", uniqueId);
                                featureRuleSliderInstanceArray.push([featureRuleSliderPluginObj, _bxSlider, uniqueId]);
                            },

                            unLoadSlider: function (_bxSlider, _sliderID) {

                                var pluginIndexTracker;

                                $.each(featureRuleSliderInstanceArray, function (pluginIndex, pluginValue) {

                                    if (_sliderID === pluginValue[2]) {
                                        pluginValue[0].destroySlider();
                                        $(pluginValue[1]).find("." + featureRuleSliderPager).empty();
                                        $(pluginValue[1]).removeAttr("data-slider").removeData();
                                        $(pluginValue[1]).find(".bxslider-rule").removeData();

                                        pluginIndexTracker = pluginIndex;
                                        return;
                                    }
                                });

                                featureRuleSliderInstanceArray = $.grep(featureRuleSliderInstanceArray, function (n, i) {
                                    return i !== pluginIndexTracker;
                                });

                            },

                            updateFeatureRecommendations: function () {

                                featureRecommendationsObj.each(function (fIndex, fElement) {

                                    if ($(fElement).hasClass("active")) {

                                        app.SWGApplication.dataController.displaySlider(fElement);

                                    }

                                });

                            },

                            showFeatureRecommendations: function () {
                                // remove loading screen

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

                        thisWindow.on("resize", throttle(function () {

                            viewPortWidth = app.SWGApplication.dataController.checkBrowserWidth();

                            windowScrollHeight = viewportObj.get(0).scrollHeight;

                            if (viewport.is("xs")) { // mq < 768px (mobile)
                                currentViewPort = "xs";
                            } else if (viewport.is("sm")) { // mq < 992px (tablet)
                                currentViewPort = "sm";
                            } else if (viewport.is("md")) { // mq < 1200px (small desktop)
                                currentViewPort = "md";
                            } else { // mq = 1200px (large desktop)
                                currentViewPort = "lg";
                            }

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

                            // Detect Primary Slider 
                            if ($.fn.bxSlider && sliderExists && viewPortChange) {

                                if (currentViewPort === "xs" && mobileSliderExists) {
                                    app.SWGApplication.dataController.unloadPrimarySlider();
                                } else if (currentViewPort !== "xs" && !sliderLoadedFlag || currentViewPort === "xs" && !sliderLoadedFlag && !mobileSliderExists) {
                                    app.SWGApplication.dataController.loadPrimarySlider();
                                }
                            }

                            mobileSliderExists = ($.fn.bxSlider && mobileSliderObj.length > 0 && !mobileSliderObj.hasClass("over-ride")) ? true : false;

                            // Detect Primary Mobile Slider 
                            if ($.fn.bxSlider && mobileSliderExists && viewPortChange && mobileSliderExists) {

                                if (currentViewPort === "xs" && !mobileSliderLoadedFlag) {
                                    app.SWGApplication.dataController.loadMobileSlider();

                                } else if (currentViewPort !== "xs" && mobileSliderLoadedFlag) {
                                    app.SWGApplication.dataController.unloadMobileSlider();
                                }
                            }

                            // Update jQuery UI Dropdowns Autocomplete Instances
                            if ($(".ui-autocomplete").is(":visible")) {

                                if (headerSearchBoxObj.is(":visible")) {
                                    headerSearchBoxObj.autocomplete("search");
                                } else {
                                    headerSearchBoxObj.autocomplete("close");
                                }

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

                            // Sunwing Mobile App vertical / horizontal detection
                            app.SWGApplication.dataController.getSlideVorH();

                            // Detect and reload Carousel Slider(s)
                            if ($.fn.bxSlider && slideCarouselExists && viewPortChange) {

                                if (slideCarouselLoadedFlag) {
                                    app.SWGApplication.dataController.reloadCarouselSlider();
                                    app.SWGApplication.dataController.updateCarouselPager();
                                }

                            }

                            setTimeout(function () {
                                app.SWGApplication.dataController.updateCarouselPager();
                            }, 100);

                            // Detect and reload on viewport change
                            if (viewPortChange && multiColumnTableObj.is(":visible")) {
                                app.SWGApplication.dataController.loadMultiColumnTable();
                            }

                            // Detect and reload on viewport change
                            if (viewPortChange && currentViewPort !== "xs" && accordionTabExists) {
                                app.SWGApplication.dataController.reloadAccordionTab();
                            }

                            if (viewPortChange && !$.isEmptyObject(horizontalMenuInstance)) {
                                horizontalMenuInstance.reload();

                                if (scrollStickyTabListObj.width() > scrollStickyNavigationObj.find(".navigation-wrapper").width()) {
                                    scrollStickyNavigationObj.find(".navigation-buttons").addClass("show");
                                } else {
                                    scrollStickyNavigationObj.find(".navigation-buttons").removeClass("show");
                                }
                            }

                            if (!$.isEmptyObject(horizontalTabMenuInstance)) {

                                if (viewPortChange || horizontalTabMenuInstance.init === true || currentViewPort === "xs") {

                                    horizontalTabMenuInstance.reload();

                                    if ($(".scrolling-tabs").find(".tab-list").width() > $(".scrolling-tabs").find(".scroll-container").width()) {
                                        $(".scrolling-tabs").find(".scroll-buttons").addClass("show");
                                        $(".scrolling-tabs").addClass("add-margin");
                                    } else {
                                        $(".scrolling-tabs").find(".scroll-buttons").removeClass("show");
                                        $(".scrolling-tabs").removeClass("add-margin");
                                    }

                                    if (horizontalTabMenuInstance.init === true) {
                                        horizontalTabMenuInstance.init = false;
                                    }

                                }
                            }

                            // Update Popover
                            if (popOverTriggerExists && currentViewPort !== "xs") {
                                app.SWGApplication.dataController.refreshModalPopOver();
                            }

                            // Update sticky navigation
                            app.SWGApplication.dataController.updateScrollableNavigation();

                            // Update Homepage Feature Recommendations 
                            app.SWGApplication.dataController.updateFeatureRecommendations();

                            if ($("#iframe-modal").is(":visible")) {
                                var modalHeight = thisWindow.height() - $("[id='iframe-modal'] .modal-header").outerHeight(true) - $("[id='iframe-modal'] .modal-footer").outerHeight(true) - 30;
                                $("[id='iframe-modal'] .modal-body").css("height", modalHeight);
                            }

                        }, 250));

                        thisWindow.on("scroll", throttle(function () {
                            app.SWGApplication.dataController.updateScroll();
                            if (backToTopExists && backToTopLoaded) app.SWGApplication.dataView.updateBackToTop();

                            if (!signUpInputFlag) {
                                if (currentViewPort === "xs" && searchBoxExists && signUpNo1ToTheSunExists) {
                                    app.SWGApplication.dataView.updateSignUpNo1ToTheSun();
                                    signUpStickyOn = true;
                                } else if (signUpStickyOn || parseInt(signUpNo1ToTheSunObj.css("bottom"), 10) <= 0) {
                                    signUpNo1ToTheSunObj.css("bottom", "");

                                    if (parseInt(signUpNo1ToTheSunObj.css("bottom"), 10) > 0) {
                                        signUpStickyOn = false;
                                    }
                                }
                            }

                            // Update sticky navigation
                            app.SWGApplication.dataController.updateScrollableNavigation();

                            // Display Vacation Finder Tab
                            if (vacationFinderTabExists) {
                                app.SWGApplication.dataController.updateVacationFinderTab();
                            }

                        }, 30));

                        function throttle(fn, threshold, scope) {
                            threshold || (threshold = 250);
                            var last,
                                deferTimer;
                            return function () {
                                var context = scope || this;

                                var now = +new Date(),
                                    args = arguments;
                                if (last && now < last + threshold) {
                                    // hold on to it
                                    clearTimeout(deferTimer);
                                    deferTimer = setTimeout(function () {
                                        last = now;
                                        fn.apply(context, args);
                                    }, threshold + last - now);
                                } else {
                                    last = now;
                                    fn.apply(context, args);
                                }
                            };
                        }


                        viewportObj.on("hide.bs.modal", ".modal", function () {

                            // BS Trigger to stop video playback when modal is dismissed
                            // http://docs.videojs.com/docs/api/player.html
                            if ($(this).closest(".modal").find(".video-js").length > 0) {
                                $(this).closest(".modal").find(".video-js").get(0).player.dispose();
                                $(this).closest(".modal").find(".gallery.video-gallery-slider").empty();
                            }


                            if ($("#iframe-modal").is(":visible")) {
                                //ToDO: For now redirecting to homepage
                                //var redirectState = false;

                                //if (document.referrer !== "" && !redirectState){
                                //	redirectState = true;
                                //}

                                //if (redirectState){
                                window.location.href = "/";
                                //}

                            }

                        });

                        viewportObj.on("shown.bs.modal", ".modal", function () {
                            //$(".modal.white-theme").data("bs.modal").$backdrop.css("background-color", "#ffffff");
                            //$(".modal.white-theme").data("bs.modal").$backdrop.css("opacity", "0.8");
                        });

                        if (scriptLoaded) {
                            // Load initial resize
                            thisWindow.trigger("resize");
                        }

                    }

                });

            })(jQuery, ResponsiveBootstrapToolkit, this);



            //original ends

        }
    }
})(customsrcObject || {})

//if (!SinglePageApplication) {
//    windowlocationhost = window.location.host;
//    customsrcObject.init();
//}