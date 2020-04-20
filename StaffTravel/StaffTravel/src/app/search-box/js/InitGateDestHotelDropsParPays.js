module.exports = function() {
    // Wrapped with document ready since Staff Travel calls this before dom is rendered
    $(document).ready(function() {
        // Globals from Sunwing.ca
        var desktopAlias = "jjv";
        var mobileAlias = "jjm";
        var gatewayDestinationURL = 'https://services.sunwinggroup.ca/beta/';
        var CommonDictionary = { readMore: "Read more", showLess: "Show less" };
        var Duration_3to4 = "3 or 4 days";
        var Duration_5to10 = "5 to 10 days";
        var Duration_11to16 = "11 to 16 days";
        var Duration_17days = "17 days or more";
        var Duration_daysonly = "days only";
        var SameAs = "Same as Pick up";

        function isMobileDevice() {
            return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf("IEMobile") !== -1);
        }

        function isTouchDevice() {
            return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
        }

        if (queryParamExists("dalias"))
            desktopAlias = urlParam("dalias");

        if (queryParamExists("malias"))
            mobileAlias = urlParam("malias");
        //Updated for Affiliates
        if ($(location).attr("pathname").indexOf("/affiliates/") !== -1) {
            if ($.cookie("_afd_") !== null && $.cookie("_afd_") !== undefined)
                desktopAlias = $.cookie("_afd_");
            else
                $.cookie("_afd_", desktopAlias, { expires: 30, domain: ".sunwing.ca", path: "/affiliates/" });

            if ($.cookie("_afm_") !== null && $.cookie("_afm_") !== undefined)
                mobileAlias = $.cookie("_afm_");
            else
                $.cookie("_afm_", mobileAlias, { expires: 30, domain: ".sunwing.ca", path: "/affiliates/" });
        }

        var displayGateway = "YYZ";
        if (Lang === "fr")
            displayGateway = "YUL";
        if (queryParamExists("gatewaycode"))
            displayGateway = urlParam("gatewaycode").toUpperCase();

        var flightObj = $("#content-flights");
        var flightExists = (flightObj.length > 0) ? true : false;

        var LPCObj = $("#lpc-search-box");
        var LPCObjExists = (LPCObj.length > 0) ? true : false;

        var SearchBoxObj = $("#search-box");
        var SearchBoxObjExists = (SearchBoxObj.length > 0) ? true : false;


        // Cars Tab 
        var dataCars = [];

        var codesPrepopulations = Array();
        codesPrepopulations["ACA"] = "1_3049109";
        codesPrepopulations["1"] = "1_3049109";
        codesPrepopulations["CUN"] = "2_24_3049111_3049105";
        codesPrepopulations["2"] = "2_24_3049111_3049105";
        codesPrepopulations["CYO"] = "3";
        codesPrepopulations["3"] = "3";
        codesPrepopulations["CFG"] = "4";
        codesPrepopulations["4"] = "4";
        codesPrepopulations["ZLO"] = "5";
        codesPrepopulations["5"] = "5";
        codesPrepopulations["HOG"] = "6";
        codesPrepopulations["6"] = "6";
        codesPrepopulations["ZIH"] = "7";
        codesPrepopulations["7"] = "7";
        codesPrepopulations["POP"] = "8_12_13";
        codesPrepopulations["8"] = "8_12_13";
        codesPrepopulations["PVR"] = "9_156";
        codesPrepopulations["9"] = "9";
        codesPrepopulations["PUJ"] = "10";
        codesPrepopulations["10"] = "10";
        codesPrepopulations["CTG"] = "11";
        codesPrepopulations["11"] = "11";
        codesPrepopulations["POP"] = "8_12_13";
        codesPrepopulations["12"] = "12";
        codesPrepopulations["POP"] = "8_12_13";
        codesPrepopulations["13"] = "13";
        codesPrepopulations["SDQ"] = "73_14";
        codesPrepopulations["14"] = "73_14";
        codesPrepopulations["HEX"] = "73_14";
        codesPrepopulations["14"] = "73_14";
        codesPrepopulations["VRA"] = "15";
        codesPrepopulations["15"] = "15";
        codesPrepopulations["16"] = "16";
        codesPrepopulations["CZM"] = "17";
        codesPrepopulations["17"] = "17";
        codesPrepopulations["MBJ"] = "18";
        codesPrepopulations["18"] = "18";
        codesPrepopulations["FAO"] = "19";
        codesPrepopulations["19"] = "19";
        codesPrepopulations["FMY"] = "20";
        codesPrepopulations["20"] = "20";
        codesPrepopulations["RSW"] = "20";
        codesPrepopulations["20"] = "20";
        codesPrepopulations["SJO"] = "21_64";
        codesPrepopulations["21"] = "21_64";
        codesPrepopulations["SYQ"] = "21_64";
        codesPrepopulations["21"] = "21_64";
        codesPrepopulations["TMU"] = "22";
        codesPrepopulations["22"] = "22";
        codesPrepopulations["AGA"] = "23";
        codesPrepopulations["23"] = "23";
        codesPrepopulations["24"] = "24";
        codesPrepopulations["NAS"] = "25";
        codesPrepopulations["25"] = "25";
        codesPrepopulations["PID"] = "25";
        codesPrepopulations["25"] = "25";
        codesPrepopulations["FPO"] = "26";
        codesPrepopulations["26"] = "26";
        codesPrepopulations["ANU"] = "27";
        codesPrepopulations["27"] = "27";
        codesPrepopulations["PTP"] = "28";
        codesPrepopulations["28"] = "28";
        codesPrepopulations["AUA"] = "29";
        codesPrepopulations["29"] = "29";
        codesPrepopulations["BGI"] = "30";
        codesPrepopulations["30"] = "30";
        codesPrepopulations["FLL"] = "31_1578";
        codesPrepopulations["31"] = "31_1578";
        codesPrepopulations["FXE"] = "31_1578";
        codesPrepopulations["31"] = "31_1578";
        codesPrepopulations["MCO"] = "32";
        codesPrepopulations["32"] = "32";
        codesPrepopulations["GCM"] = "33";
        codesPrepopulations["33"] = "33";
        codesPrepopulations["GND"] = "34";
        codesPrepopulations["34"] = "34";
        codesPrepopulations["SKB"] = "35";
        codesPrepopulations["35"] = "35";
        codesPrepopulations["SLU"] = "36";
        codesPrepopulations["36"] = "36";
        codesPrepopulations["UVF"] = "36";
        codesPrepopulations["36"] = "36";
        codesPrepopulations["MZO"] = "37";
        codesPrepopulations["37"] = "37";
        codesPrepopulations["FDF"] = "38";
        codesPrepopulations["38"] = "38";
        codesPrepopulations["SXM"] = "39";
        codesPrepopulations["39"] = "39";
        codesPrepopulations["EPS"] = "40";
        codesPrepopulations["40"] = "40";
        codesPrepopulations["AZS"] = "40";
        codesPrepopulations["40"] = "40";
        codesPrepopulations["PMV"] = "41";
        codesPrepopulations["41"] = "41";
        codesPrepopulations["TAB"] = "42";
        codesPrepopulations["42"] = "42";
        codesPrepopulations["PIE"] = "43";
        codesPrepopulations["43"] = "43";
        codesPrepopulations["SPG"] = "43";
        codesPrepopulations["43"] = "43";
        codesPrepopulations["HUX"] = "44";
        codesPrepopulations["44"] = "44";
        codesPrepopulations["CIA"] = "45";
        codesPrepopulations["45"] = "45";
        codesPrepopulations["FCO"] = "45";
        codesPrepopulations["45"] = "45";
        codesPrepopulations["ROM"] = "45";
        codesPrepopulations["45"] = "45";
        codesPrepopulations["SJU"] = "46";
        codesPrepopulations["46"] = "46";
        codesPrepopulations["HAV"] = "47";
        codesPrepopulations["47"] = "47";
        codesPrepopulations["UPB"] = "47";
        codesPrepopulations["47"] = "47";
        codesPrepopulations["MGA"] = "48";
        codesPrepopulations["48"] = "48";
        codesPrepopulations["PDL"] = "49";
        codesPrepopulations["49"] = "49";
        codesPrepopulations["STT"] = "50";
        codesPrepopulations["50"] = "50";
        codesPrepopulations["SPB"] = "50";
        codesPrepopulations["50"] = "50";
        codesPrepopulations["MIA"] = "51";
        codesPrepopulations["51"] = "51";
        codesPrepopulations["OPF"] = "51";
        codesPrepopulations["51"] = "51";
        codesPrepopulations["TMB"] = "51";
        codesPrepopulations["51"] = "51";
        codesPrepopulations["TNT"] = "51";
        codesPrepopulations["51"] = "51";
        codesPrepopulations["SCU"] = "52";
        codesPrepopulations["52"] = "52";
        codesPrepopulations["CMW"] = "53";
        codesPrepopulations["53"] = "53";
        codesPrepopulations["COF"] = "54";
        codesPrepopulations["54"] = "54";
        codesPrepopulations["ADZ"] = "55";
        codesPrepopulations["55"] = "55";
        codesPrepopulations["56"] = "56";
        codesPrepopulations["BZE"] = "57";
        codesPrepopulations["57"] = "57";
        codesPrepopulations["TZA"] = "57";
        codesPrepopulations["57"] = "57";
        codesPrepopulations["MAD"] = "58";
        codesPrepopulations["58"] = "58";
        codesPrepopulations["TOJ"] = "58";
        codesPrepopulations["58"] = "58";
        codesPrepopulations["PTY"] = "59";
        codesPrepopulations["59"] = "59";
        codesPrepopulations["PAC"] = "59";
        codesPrepopulations["59"] = "59";
        codesPrepopulations["BDA"] = "60";
        codesPrepopulations["60"] = "60";
        codesPrepopulations["NWU"] = "60";
        codesPrepopulations["60"] = "60";
        codesPrepopulations["BVA"] = "61";
        codesPrepopulations["61"] = "61";
        codesPrepopulations["CDG"] = "61";
        codesPrepopulations["61"] = "61";
        codesPrepopulations["LBG"] = "61";
        codesPrepopulations["61"] = "61";
        codesPrepopulations["ORY"] = "61";
        codesPrepopulations["61"] = "61";
        codesPrepopulations["PLS"] = "62";
        codesPrepopulations["62"] = "62";
        codesPrepopulations["LCE"] = "63";
        codesPrepopulations["63"] = "63";
        codesPrepopulations["SJO"] = "64";
        codesPrepopulations["64"] = "64";
        codesPrepopulations["DAB"] = "65";
        codesPrepopulations["65"] = "65";
        codesPrepopulations["ATH"] = "66";
        codesPrepopulations["66"] = "66";
        codesPrepopulations["HEW"] = "66";
        codesPrepopulations["66"] = "66";
        codesPrepopulations["SPJ"] = "66";
        codesPrepopulations["66"] = "66";
        codesPrepopulations["67"] = "67";
        codesPrepopulations["NCE"] = "68";
        codesPrepopulations["68"] = "68";
        codesPrepopulations["MZT"] = "69";
        codesPrepopulations["69"] = "69";
        codesPrepopulations["LIR"] = "70_568430_568522_568546_569962_2974_64_569714";
        codesPrepopulations["70"] = "70_568430_568522_568546_569962_2974_64_569714";
        codesPrepopulations["LAS"] = "71";
        codesPrepopulations["71"] = "71";
        codesPrepopulations["VGT"] = "71";
        codesPrepopulations["71"] = "71";
        codesPrepopulations["HSH"] = "71";
        codesPrepopulations["71"] = "71";
        codesPrepopulations["BIX"] = "72";
        codesPrepopulations["72"] = "72";
        codesPrepopulations["LRM"] = "73_14";
        codesPrepopulations["73"] = "73_14";
        codesPrepopulations["LCY"] = "74";
        codesPrepopulations["74"] = "74";
        codesPrepopulations["LGW"] = "74";
        codesPrepopulations["74"] = "74";
        codesPrepopulations["LHR"] = "74";
        codesPrepopulations["74"] = "74";
        codesPrepopulations["STN"] = "74";
        codesPrepopulations["74"] = "74";
        codesPrepopulations["BQH"] = "74";
        codesPrepopulations["74"] = "74";
        codesPrepopulations["ACE"] = "75";
        codesPrepopulations["75"] = "75";
        codesPrepopulations["CUR"] = "76";
        codesPrepopulations["76"] = "76";
        codesPrepopulations["SJD"] = "77";
        codesPrepopulations["77"] = "77";
        codesPrepopulations["KIN"] = "78";
        codesPrepopulations["78"] = "78";
        codesPrepopulations["KTP"] = "78";
        codesPrepopulations["78"] = "78";
        codesPrepopulations["HNL"] = "79";
        codesPrepopulations["79"] = "79";
        codesPrepopulations["KOA"] = "80";
        codesPrepopulations["80"] = "80";
        codesPrepopulations["OGG"] = "81";
        codesPrepopulations["81"] = "81";
        codesPrepopulations["LIH"] = "82";
        codesPrepopulations["82"] = "82";
        codesPrepopulations["RTB"] = "83";
        codesPrepopulations["83"] = "83";
        codesPrepopulations["LAX"] = "84";
        codesPrepopulations["84"] = "84";
        codesPrepopulations["VNY"] = "84";
        codesPrepopulations["84"] = "84";
        codesPrepopulations["WHP"] = "84";
        codesPrepopulations["84"] = "84";
        codesPrepopulations["PSP"] = "85";
        codesPrepopulations["85"] = "85";
        codesPrepopulations["MID"] = "86";
        codesPrepopulations["86"] = "86";
        codesPrepopulations["SNU"] = "87";
        codesPrepopulations["87"] = "87";
        codesPrepopulations["LTO"] = "88";
        codesPrepopulations["88"] = "88";
        codesPrepopulations["SBH"] = "89";
        codesPrepopulations["89"] = "89";
        codesPrepopulations["POS"] = "90";
        codesPrepopulations["90"] = "90";
        codesPrepopulations["RAR"] = "91";
        codesPrepopulations["91"] = "91";
        codesPrepopulations["CCC"] = "92";
        codesPrepopulations["92"] = "92";
        codesPrepopulations["LIS"] = "93";
        codesPrepopulations["93"] = "93";
        codesPrepopulations["ZYD"] = "93";
        codesPrepopulations["93"] = "93";
        codesPrepopulations["PAP"] = "94_1035346_1041366_1042663";
        codesPrepopulations["94"] = "94_1035346_1041366_1042663";
        codesPrepopulations["SAL"] = "95";
        codesPrepopulations["95"] = "95";
        codesPrepopulations["SRQ"] = "96";
        codesPrepopulations["96"] = "96";
        codesPrepopulations["LNA"] = "97";
        codesPrepopulations["97"] = "97";
        codesPrepopulations["PBI"] = "97";
        codesPrepopulations["97"] = "97";
        codesPrepopulations["TAM"] = "98";
        codesPrepopulations["98"] = "98";
        codesPrepopulations["GEO"] = "99";
        codesPrepopulations["99"] = "99";
        codesPrepopulations["AMS"] = "100";
        codesPrepopulations["100"] = "100";
        codesPrepopulations["BFS"] = "101";
        codesPrepopulations["101"] = "101";
        codesPrepopulations["BHD"] = "101";
        codesPrepopulations["101"] = "101";
        codesPrepopulations["BHX"] = "102";
        codesPrepopulations["102"] = "102";
        codesPrepopulations["BRU"] = "103";
        codesPrepopulations["103"] = "103";
        codesPrepopulations["CRL"] = "103";
        codesPrepopulations["103"] = "103";
        codesPrepopulations["ZYR"] = "103";
        codesPrepopulations["103"] = "103";
        codesPrepopulations["DUB"] = "104";
        codesPrepopulations["104"] = "104";
        codesPrepopulations["EDI"] = "105";
        codesPrepopulations["105"] = "105";
        codesPrepopulations["FRA"] = "106";
        codesPrepopulations["106"] = "106";
        codesPrepopulations["HHN"] = "106";
        codesPrepopulations["106"] = "106";
        codesPrepopulations["QGV"] = "106";
        codesPrepopulations["106"] = "106";
        codesPrepopulations["GLA"] = "107";
        codesPrepopulations["107"] = "107";
        codesPrepopulations["LYN"] = "108";
        codesPrepopulations["108"] = "108";
        codesPrepopulations["LYS"] = "108";
        codesPrepopulations["108"] = "108";
        codesPrepopulations["MAN"] = "109";
        codesPrepopulations["109"] = "109";
        codesPrepopulations["MRS"] = "110";
        codesPrepopulations["110"] = "110";
        codesPrepopulations["AGB"] = "111";
        codesPrepopulations["111"] = "111";
        codesPrepopulations["MUC"] = "111";
        codesPrepopulations["111"] = "111";
        codesPrepopulations["BSL"] = "112";
        codesPrepopulations["112"] = "112";
        codesPrepopulations["NTE"] = "113";
        codesPrepopulations["113"] = "113";
        codesPrepopulations["TLS"] = "114";
        codesPrepopulations["114"] = "114";
        codesPrepopulations["XYT"] = "114";
        codesPrepopulations["114"] = "114";
        codesPrepopulations["CXH"] = "115";
        codesPrepopulations["115"] = "115";
        codesPrepopulations["YVR"] = "115";
        codesPrepopulations["115"] = "115";
        codesPrepopulations["YYC"] = "116";
        codesPrepopulations["116"] = "116";
        codesPrepopulations["BOD"] = "117";
        codesPrepopulations["117"] = "117";
        codesPrepopulations["VCE"] = "118";
        codesPrepopulations["118"] = "118";
        codesPrepopulations["LIN"] = "119";
        codesPrepopulations["119"] = "119";
        codesPrepopulations["MXP"] = "119";
        codesPrepopulations["119"] = "119";
        codesPrepopulations["SWK"] = "119";
        codesPrepopulations["119"] = "119";
        codesPrepopulations["APF"] = "120";
        codesPrepopulations["120"] = "120";
        codesPrepopulations["CMR"] = "121";
        codesPrepopulations["121"] = "121";
        codesPrepopulations["HAM"] = "122";
        codesPrepopulations["122"] = "122";
        codesPrepopulations["KIR"] = "123";
        codesPrepopulations["123"] = "123";
        codesPrepopulations["MLH"] = "124";
        codesPrepopulations["124"] = "124";
        codesPrepopulations["PRG"] = "125";
        codesPrepopulations["125"] = "125";
        codesPrepopulations["QXB"] = "126";
        codesPrepopulations["126"] = "126";
        codesPrepopulations["CCF"] = "127";
        codesPrepopulations["127"] = "127";
        codesPrepopulations["SXB"] = "128";
        codesPrepopulations["128"] = "128";
        codesPrepopulations["AGP"] = "129";
        codesPrepopulations["129"] = "129";
        codesPrepopulations["EAS"] = "130";
        codesPrepopulations["130"] = "130";
        codesPrepopulations["BCN"] = "131";
        codesPrepopulations["131"] = "131";
        codesPrepopulations["BIO"] = "132";
        codesPrepopulations["132"] = "132";
        codesPrepopulations["GRX"] = "133";
        codesPrepopulations["133"] = "133";
        codesPrepopulations["SVQ"] = "134";
        codesPrepopulations["134"] = "134";
        codesPrepopulations["VLC"] = "135";
        codesPrepopulations["135"] = "135";
        codesPrepopulations["ODB"] = "136";
        codesPrepopulations["136"] = "136";
        codesPrepopulations["CDZ"] = "137";
        codesPrepopulations["137"] = "137";
        codesPrepopulations["SCQ"] = "138";
        codesPrepopulations["138"] = "138";
        codesPrepopulations["CEQ"] = "139";
        codesPrepopulations["139"] = "139";
        codesPrepopulations["YED"] = "140";
        codesPrepopulations["140"] = "140";
        codesPrepopulations["YEG"] = "140";
        codesPrepopulations["140"] = "140";
        codesPrepopulations["YXD"] = "140";
        codesPrepopulations["140"] = "140";
        codesPrepopulations["FLR"] = "141";
        codesPrepopulations["141"] = "141";
        codesPrepopulations["SAY"] = "142";
        codesPrepopulations["142"] = "142";
        codesPrepopulations["RRO"] = "143";
        codesPrepopulations["143"] = "143";
        codesPrepopulations["PMO"] = "144";
        codesPrepopulations["144"] = "144";
        codesPrepopulations["ISH"] = "145";
        codesPrepopulations["145"] = "145";
        codesPrepopulations["PRJ"] = "146";
        codesPrepopulations["146"] = "146";
        codesPrepopulations["CLW"] = "147";
        codesPrepopulations["147"] = "147";
        codesPrepopulations["ISM"] = "148";
        codesPrepopulations["148"] = "148";
        codesPrepopulations["JTR"] = "149";
        codesPrepopulations["149"] = "149";
        codesPrepopulations["VIE"] = "150";
        codesPrepopulations["150"] = "150";
        codesPrepopulations["VDD"] = "150";
        codesPrepopulations["150"] = "150";
        codesPrepopulations["KYL"] = "151";
        codesPrepopulations["151"] = "151";
        codesPrepopulations["UTL"] = "152";
        codesPrepopulations["152"] = "152";
        codesPrepopulations["KEF"] = "153";
        codesPrepopulations["153"] = "153";
        codesPrepopulations["RKV"] = "153";
        codesPrepopulations["153"] = "153";
        codesPrepopulations["MYF"] = "154";
        codesPrepopulations["154"] = "154";
        codesPrepopulations["SAN"] = "154";
        codesPrepopulations["154"] = "154";
        codesPrepopulations["SDM"] = "154";
        codesPrepopulations["154"] = "154";
        codesPrepopulations["NKX"] = "154";
        codesPrepopulations["154"] = "154";
        codesPrepopulations["SEE"] = "154";
        codesPrepopulations["154"] = "154";
        codesPrepopulations["SXF"] = "155";
        codesPrepopulations["155"] = "155";
        codesPrepopulations["THF"] = "155";
        codesPrepopulations["155"] = "155";
        codesPrepopulations["TXL"] = "155";
        codesPrepopulations["155"] = "155";
        codesPrepopulations["GWW"] = "155";
        codesPrepopulations["155"] = "155";
        codesPrepopulations["PVR"] = "9_156";
        codesPrepopulations["156"] = "156";
        codesPrepopulations["LUX"] = "157";
        codesPrepopulations["157"] = "157";
        codesPrepopulations["LIL"] = "158";
        codesPrepopulations["158"] = "158";
        codesPrepopulations["INN"] = "159";
        codesPrepopulations["159"] = "159";
        codesPrepopulations["SZG"] = "160";
        codesPrepopulations["160"] = "160";
        codesPrepopulations["JMK"] = "161";
        codesPrepopulations["161"] = "161";
        codesPrepopulations["YHZ"] = "162";
        codesPrepopulations["162"] = "162";
        codesPrepopulations["YAW"] = "162";
        codesPrepopulations["162"] = "162";
        codesPrepopulations["YUL"] = "163";
        codesPrepopulations["163"] = "163";
        codesPrepopulations["YKZ"] = "164";
        codesPrepopulations["164"] = "164";
        codesPrepopulations["YTZ"] = "164";
        codesPrepopulations["164"] = "164";
        codesPrepopulations["YYZ"] = "164";
        codesPrepopulations["164"] = "164";
        codesPrepopulations["YDF"] = "165";
        codesPrepopulations["165"] = "165";
        codesPrepopulations["YQX"] = "166";
        codesPrepopulations["166"] = "166";
        codesPrepopulations["YQY"] = "167";
        codesPrepopulations["167"] = "167";
        codesPrepopulations["YYG"] = "168";
        codesPrepopulations["168"] = "168";
        codesPrepopulations["YYT"] = "169";
        codesPrepopulations["169"] = "169";
        codesPrepopulations["YYJ"] = "170";
        codesPrepopulations["170"] = "170";
        codesPrepopulations["ZRH"] = "171";
        codesPrepopulations["171"] = "171";
        codesPrepopulations["GVA"] = "172";
        codesPrepopulations["172"] = "172";
        codesPrepopulations["OPO"] = "173";
        codesPrepopulations["173"] = "173";
        codesPrepopulations["AXA"] = "174";
        codesPrepopulations["174"] = "174";
        codesPrepopulations["YLW"] = "175";
        codesPrepopulations["175"] = "175";
        codesPrepopulations["YQQ"] = "176";
        codesPrepopulations["176"] = "176";
        codesPrepopulations["YWG"] = "177";
        codesPrepopulations["177"] = "177";
        codesPrepopulations["YXE"] = "178";
        codesPrepopulations["178"] = "178";
        codesPrepopulations["PHX"] = "179";
        codesPrepopulations["179"] = "179";
        codesPrepopulations["DVT"] = "179";
        codesPrepopulations["179"] = "179";
        codesPrepopulations["180"] = "180";
        codesPrepopulations["ACY"] = "181";
        codesPrepopulations["181"] = "181";
        codesPrepopulations["AIY"] = "181";
        codesPrepopulations["181"] = "181";
        codesPrepopulations["ZSA"] = "182";
        codesPrepopulations["182"] = "182";
        codesPrepopulations["YHM"] = "183";
        codesPrepopulations["183"] = "183";
        codesPrepopulations["YKA"] = "184";
        codesPrepopulations["184"] = "184";
        codesPrepopulations["YOW"] = "185";
        codesPrepopulations["185"] = "185";
        codesPrepopulations["YQB"] = "186";
        codesPrepopulations["186"] = "186";
        codesPrepopulations["RAK"] = "187";
        codesPrepopulations["187"] = "187";
        codesPrepopulations["GGT"] = "188";
        codesPrepopulations["188"] = "188";
        codesPrepopulations["BOS"] = "189";
        codesPrepopulations["189"] = "189";
        codesPrepopulations["CGX"] = "190";
        codesPrepopulations["190"] = "190";
        codesPrepopulations["MDW"] = "190";
        codesPrepopulations["190"] = "190";
        codesPrepopulations["ORD"] = "190";
        codesPrepopulations["190"] = "190";
        codesPrepopulations["PWK"] = "190";
        codesPrepopulations["190"] = "190";
        codesPrepopulations["DPA"] = "190";
        codesPrepopulations["190"] = "190";
        codesPrepopulations["SFO"] = "191";
        codesPrepopulations["191"] = "191";
        codesPrepopulations["EMB"] = "191";
        codesPrepopulations["191"] = "191";
        codesPrepopulations["EWR"] = "192";
        codesPrepopulations["192"] = "192";
        codesPrepopulations["JFK"] = "192";
        codesPrepopulations["192"] = "192";
        codesPrepopulations["LGA"] = "192";
        codesPrepopulations["192"] = "192";
        codesPrepopulations["WTC"] = "192";
        codesPrepopulations["192"] = "192";
        codesPrepopulations["TUN"] = "193";
        codesPrepopulations["193"] = "193";
        codesPrepopulations["BFI"] = "194";
        codesPrepopulations["194"] = "194";
        codesPrepopulations["KEH"] = "194";
        codesPrepopulations["194"] = "194";
        codesPrepopulations["SEA"] = "194";
        codesPrepopulations["194"] = "194";
        codesPrepopulations["DAL"] = "195";
        codesPrepopulations["195"] = "195";
        codesPrepopulations["DFW"] = "195";
        codesPrepopulations["195"] = "195";
        codesPrepopulations["ADS"] = "195";
        codesPrepopulations["195"] = "195";
        codesPrepopulations["RBD"] = "195";
        codesPrepopulations["195"] = "195";
        codesPrepopulations["APA"] = "196";
        codesPrepopulations["196"] = "196";
        codesPrepopulations["DEN"] = "196";
        codesPrepopulations["196"] = "196";
        codesPrepopulations["BNA"] = "197";
        codesPrepopulations["197"] = "197";
        codesPrepopulations["CAI"] = "198";
        codesPrepopulations["198"] = "198";
        codesPrepopulations["MSY"] = "199";
        codesPrepopulations["199"] = "199";
        codesPrepopulations["NEW"] = "199";
        codesPrepopulations["199"] = "199";
        codesPrepopulations["NBG"] = "199";
        codesPrepopulations["199"] = "199";
        codesPrepopulations["IST"] = "200";
        codesPrepopulations["200"] = "200";
        codesPrepopulations["SAW"] = "200";
        codesPrepopulations["200"] = "200";
        codesPrepopulations["MLM"] = "201";
        codesPrepopulations["201"] = "201";
        codesPrepopulations["PSR"] = "202";
        codesPrepopulations["202"] = "202";
        codesPrepopulations["SUF"] = "203";
        codesPrepopulations["203"] = "203";
        codesPrepopulations["STR"] = "204";
        codesPrepopulations["204"] = "204";
        codesPrepopulations["BTV"] = "205";
        codesPrepopulations["205"] = "205";
        codesPrepopulations["BWI"] = "206";
        codesPrepopulations["206"] = "206";
        codesPrepopulations["DCA"] = "206";
        codesPrepopulations["206"] = "206";
        codesPrepopulations["IAD"] = "206";
        codesPrepopulations["206"] = "206";
        codesPrepopulations["CRE"] = "207";
        codesPrepopulations["207"] = "207";
        codesPrepopulations["GGE"] = "207";
        codesPrepopulations["207"] = "207";
        codesPrepopulations["MYR"] = "207";
        codesPrepopulations["207"] = "207";
        codesPrepopulations["SAP"] = "208";
        codesPrepopulations["208"] = "208";
        codesPrepopulations["YQG"] = "209";
        codesPrepopulations["209"] = "209";
        codesPrepopulations["YAM"] = "210";
        codesPrepopulations["210"] = "210";
        codesPrepopulations["YQM"] = "211";
        codesPrepopulations["211"] = "211";
        codesPrepopulations["YQT"] = "212";
        codesPrepopulations["212"] = "212";
        codesPrepopulations["YSB"] = "213";
        codesPrepopulations["213"] = "213";
        codesPrepopulations["YTM"] = "214";
        codesPrepopulations["214"] = "214";
        codesPrepopulations["YTS"] = "215";
        codesPrepopulations["215"] = "215";
        codesPrepopulations["LBY"] = "216";
        codesPrepopulations["216"] = "216";
        codesPrepopulations["CPH"] = "217";
        codesPrepopulations["217"] = "217";
        codesPrepopulations["DKR"] = "218";
        codesPrepopulations["218"] = "218";
        codesPrepopulations["219"] = "219";
        codesPrepopulations["220"] = "220";
        codesPrepopulations["221"] = "221";
        codesPrepopulations["222"] = "222";
        codesPrepopulations["223"] = "223";
        codesPrepopulations["224"] = "224";
        codesPrepopulations["SNN"] = "225";
        codesPrepopulations["225"] = "225";
        codesPrepopulations["RIH"] = "226";
        codesPrepopulations["226"] = "226";
        codesPrepopulations["227"] = "227";
        codesPrepopulations["BUD"] = "228";
        codesPrepopulations["228"] = "228";
        codesPrepopulations["CHS"] = "229";
        codesPrepopulations["229"] = "229";
        codesPrepopulations["YJT"] = "230";
        codesPrepopulations["230"] = "230";
        codesPrepopulations["YYB"] = "231";
        codesPrepopulations["231"] = "231";
        codesPrepopulations["AGC"] = "232";
        codesPrepopulations["232"] = "232";
        codesPrepopulations["PIT"] = "232";
        codesPrepopulations["232"] = "232";
        codesPrepopulations["233"] = "233";
        codesPrepopulations["MLB"] = "234";
        codesPrepopulations["234"] = "234";
        codesPrepopulations["ZAG"] = "235";
        codesPrepopulations["235"] = "235";
        codesPrepopulations["236"] = "236";
        codesPrepopulations["BGI"] = "237";
        codesPrepopulations["237"] = "237";
        codesPrepopulations["3049111"] = "3049111";
        codesPrepopulations["3049105"] = "3049105";

        /*//////////////////////////////////////////////////////
        // Cruise Data for generating searchbox drop-downs
        //////////////////////////////////////////////////////*/

        // Departing from - gateways
        results = new Array();

        // Based on http://lib.softvoyage.com/cgi-bin/gate_dest_cruises.xml?code_ag=rds&alias=btd
        // result parameters = Gateway Code, Region/Group Code, Destination Code, Port of Call Code, Duration, Cruise Line Code, Ship ID

        // Halifax
        results.push(new result("YHZ", 21, 61, 18, 7, 11, "385"));
        results.push(new result("YHZ", 21, 111, 51, 7, 21, "381"));
        results.push(new result("YHZ", 0, 1263, 18, 7, 21, "381")); // missing

        // Quebec
        results.push(new result("YQB", 21, 61, 51, 7, 43, "399"));
        results.push(new result("YQB", 21, 61, 51, 7, 21, "381"));
        results.push(new result("YQB", 21, 61, 51, 7, 21, "253"));

        results.push(new result("YQB", 21, 111, 51, 7, 21, "381"));
        results.push(new result("YQB", 21, 111, 51, 7, 43, "233"));

        // Moncton
        results.push(new result("YQM", 21, 61, 51, 7, 21, "381"));
        results.push(new result("YQM", 21, 111, 51, 7, 21, "381"));

        // Montreal
        results.push(new result("YUL", 21, 61, 51, 7, 43, "399"));
        results.push(new result("YUL", 21, 61, 51, 7, 21, "253"));
        results.push(new result("YUL", 21, 61, 51, 7, 21, "381"));

        results.push(new result("YUL", 21, 111, 51, 7, 43, "233"));
        results.push(new result("YUL", 21, 111, 18, 7, 43, "233"));

        results.push(new result("YUL", 21, 111, 51, 7, 11, "385"));
        results.push(new result("YUL", 21, 111, 18, 7, 11, "385"));

        // Toronto
        results.push(new result("YYZ", 21, 61, 51, 7, 21, "381"));
        results.push(new result("YYZ", 21, 61, 18, 7, 21, "381"));
        results.push(new result("YYZ", 21, 111, 51, 7, 11, "381"));
        results.push(new result("YYZ", 21, 111, 18, 7, 11, "381"));

        results.push(new result("YYZ", 21, 61, 51, 7, 43, "399"));
        results.push(new result("YYZ", 21, 61, 18, 7, 43, "399"));
        results.push(new result("YYZ", 21, 111, 51, 7, 43, "399"));
        results.push(new result("YYZ", 21, 111, 18, 7, 43, "399"));

        results.push(new result("YYZ", 21, 61, 51, 7, 11, "385"));
        results.push(new result("YYZ", 21, 61, 18, 7, 11, "385"));
        results.push(new result("YYZ", 0, 1263, 18, 7, 21, "385")); // missing

        // Ottawa
        results.push(new result("YOW", 21, 111, 51, 7, 43, "233"));
        results.push(new result("YOW", 21, 111, 51, 7, 21, "381"));
        results.push(new result("YOW", 21, 61, 51, 7, 21, "381"));


        var gateway_YOW = "Ottawa";
        var gateway_YQB = "Quebec City";
        var gateway_YUL = "Montreal";
        var gateway_YYZ = "Toronto";
        var gateway_YHZ = "Halifax";
        var gateway_YQM = "Moncton";

        // Going to - destinations
        region_0 = 'Unlinked';

        if (Lang === "fr") {
            var region_21 = "CARAIBES";
            var region_61 = "CARAIBES DE L EST";
            var region_111 = "CARAIBES DE L OUEST";
            var region_1263 = "AMERIQUE DU SUD";
            var region_56093 = "CUBA";
        } else {
            var region_21 = "CARIBBEAN";
            var region_61 = "EASTERN CARIBBEAN";
            var region_111 = "WESTERN CARIBBEAN";
            var region_1263 = "SOUTH AMERICA";
            var region_56093 = "CUBA";
        }
        var port_18 = "Montego Bay";
        var port_47 = "Havana";
        var port_51 = "Miami";
        var cruise_line_11 = "MARELLA CRUISES";
        var cruise_line_21 = "MSC CRUISES";
        var cruise_line_43 = "NORWEGIAN CRUISE LINE";
        var ship_213 = "MSC DIVINA";
        var ship_225 = "NORWEGIAN GETAWAY";
        var ship_241 = "MSC ARMONIA";
        var ship_247 = "MSC OPERA";
        var ship_379 = "NORWEGIAN BLISS";
        var ship_381 = "MSC SEASIDE";
        var ship_385 = "MARELLA DISCOVERY 2";

        var Gateways = Array();
        function RetreiveGateways(FormEnCours, gateway, dest, hotel, duration) {
            // Gateways = Array("Toronto--xx--YYZ","Montreal--xx--YUL");
            $.ajax({
                url: gatewayDestinationURL + "api/SV/search/getGatewayforBrand/" + Lang + "/SWG",
                type: "GET",
                cache: true,
                dataType: "json",
                success: function (data) {
                    Gateways = data;
                    InitDropsSuite(FormEnCours, gateway, dest, hotel, duration);
                }
            });
        }

        function InitDrops(FormEnCours, gateway, dest, hotel, duration) {

            // Validations
            if (dest != null && dest.indexOf('xxx') > -1) { dest = dest.split('xxx'); }
            if (duration != null && duration.indexOf(':') > -1) { duration = duration.split(':')[1]; }
            if (Gateways.length == 0) { RetreiveGateways(FormEnCours, gateway, dest, hotel, duration); }
            else { InitDropsSuite(FormEnCours, gateway, dest, hotel, duration); }
        }

        window.RefreshCruiseSuite = function(FormEnCours, GateEnCours, DestEnCours, PortEnCours, DurationEnCours, CruiseLineEnCours, ShipEnCours) {

            if (GateEnCours == null || GateEnCours == "") {
                if (FormEnCours.gateway_dep.selectedIndex != -1) { GateEnCours = FormEnCours.gateway_dep.options[FormEnCours.gateway_dep.selectedIndex].value; }
                else { GateEnCours = 'YUL'; }
            }
            if (DestEnCours == null || DestEnCours == "") { DestEnCours = FormEnCours.dest_dep.options[FormEnCours.dest_dep.selectedIndex].value; }
            //if (PortEnCours == null || PortEnCours == "") { PortEnCours = FormEnCours.PortEnCours.options[FormEnCours.port_of_call.selectedIndex].value; }
            if (DurationEnCours == null || DurationEnCours == "") { DurationEnCours = FormEnCours.duration.options[FormEnCours.duration.selectedIndex].value; }
            //    if (CruiseLineEnCours == null || CruiseLineEnCours == "") { CruiseLineEnCours = FormEnCours.cruise_line.options[FormEnCours.cruise_line.selectedIndex].value; }
            //    if (ShipEnCours == null || ShipEnCours == "") { ShipEnCours = FormEnCours.id_ship.options[FormEnCours.id_ship.selectedIndex].value; 
            if (GateEnCours == null) { GateEnCours = ""; }
            if (DestEnCours == null) { DestEnCours = ""; }
            if (DurationEnCours == null) { DurationEnCours = ""; }

            var GatewaysToPrint = Array(); var ListeGatewaysToPrint = "";
            var DestinationsToPrint = Array(); var ListeDestinationsToPrint = "";
            var DurationsToPrint = Array(); var ListeDurationsToPrint = "";



            // update du drop de gateway
            for (var compteur = 0; compteur < results.length; compteur++) {
                var ResComptShipsAvecVirgules = ',' + results[compteur].ships + ',';
                if (
                    results[compteur].gateway != '' && results[compteur].gateway != null &&
                    (DestEnCours == '' || DestEnCours == 'ALL' || DestEnCours == results[compteur].destination || DestEnCours == results[compteur].region) &&
                    (DurationEnCours == '' || DurationEnCours == 'ALL' || DurationEnCours == results[compteur].duration)
                ) {
                    if (ListeGatewaysToPrint.indexOf("--" + results[compteur].gateway + "--") == -1) {
                        ListeGatewaysToPrint += "--" + results[compteur].gateway + "--";
                        GatewaysToPrint[GatewaysToPrint.length] = eval('gateway_' + results[compteur].gateway) + "--xx--" + results[compteur].gateway;
                    }
                }
            }

            var indice = 0;
            FormEnCours.gateway_dep.length = 0;
            GatewaysToPrint.sort();
            for (var compteur = 0; compteur < GatewaysToPrint.length; compteur++) {
                var ToPrintArray = GatewaysToPrint[compteur].split('--xx--');

                FormEnCours.gateway_dep.options[indice] = new Option(ToPrintArray[0]);
                FormEnCours.gateway_dep.options[indice].value = ToPrintArray[1];
                if (GateEnCours != "" && ToPrintArray[1] == GateEnCours) { FormEnCours.gateway_dep.options[indice].selected = true; }
                indice++;
            }


            // update du drop de destinations
            for (var compteur = 0; compteur < results.length; compteur++) {
                var ResComptShipsAvecVirgules = ',' + results[compteur].ships + ',';
                if (
                    (GateEnCours == '' || GateEnCours == 'ALL' || GateEnCours == results[compteur].gateway) &&
                    (DurationEnCours == '' || DurationEnCours == 'ALL' || DurationEnCours == results[compteur].duration)
                ) {
                    // result mettre dans les drops

                    if (ListeDestinationsToPrint.indexOf("--" + results[compteur].destination + "--") == -1) {
                        ListeDestinationsToPrint += "--" + results[compteur].destination + "--";

                        // Si c'est une destination non-linkee, je l'affiche comme un grouping - joe2, 14 aout 2012.
                        if (results[compteur].region == 0) { DestinationsToPrint[DestinationsToPrint.length] = eval('region_' + results[compteur].destination) + "--xx--" + results[compteur].destination + "--xx--"; }
                        else { DestinationsToPrint[DestinationsToPrint.length] = eval('region_' + results[compteur].region) + "--xx--" + results[compteur].region + "--xx--" + eval('region_' + results[compteur].destination) + "--xx--" + results[compteur].destination; }
                    }
                }
            }


            indice = 1;
            FormEnCours.dest_dep.length = 1;
            var RegionsPrinted = "";
            DestinationsToPrint.sort();
            for (var compteur = 0; compteur < DestinationsToPrint.length; compteur++) {
                var ToPrintArray = DestinationsToPrint[compteur].split('--xx--');

                // Si c'est la premiere destination d'un nouveau grouping, j'ajoute l'option du grouping
                if (RegionsPrinted.indexOf("--" + ToPrintArray[1] + "--") == -1) {
                    RegionsPrinted += "--" + ToPrintArray[1] + "--";
                    FormEnCours.dest_dep.options[indice] = new Option(ToPrintArray[0]);
                    FormEnCours.dest_dep.options[indice].value = ToPrintArray[1];
                    if (DestEnCours != "" && ToPrintArray[1] == DestEnCours) { FormEnCours.dest_dep.options[indice].selected = true; }
                    indice++;
                }

                // Si c'est une destination non-linkee, je l'affiche comme un grouping - joe2, 14 aout 2012.
                if (ToPrintArray[3] > 1) {
                    FormEnCours.dest_dep.options[indice] = new Option("-  " + ToPrintArray[2]);
                    FormEnCours.dest_dep.options[indice].value = ToPrintArray[3];
                    if (DestEnCours != "" && ToPrintArray[3] == DestEnCours) { FormEnCours.dest_dep.options[indice].selected = true; }
                    indice++;
                }
            }


            // update du drop de duration
            for (var compteur = 0; compteur < results.length; compteur++) {
                var ResComptShipsAvecVirgules = ',' + results[compteur].ships + ',';
                if (
                    (GateEnCours == '' || GateEnCours == 'ALL' || GateEnCours == results[compteur].gateway) &&
                    (DestEnCours == '' || DestEnCours == 'ALL' || DestEnCours == results[compteur].destination || DestEnCours == results[compteur].region)
                ) {
                    var LabelDuration = ''; var ValueDuration = '';
                    if (results[compteur].duration < 5) { LabelDuration = "3 or 4 days"; ValueDuration = '4'; }
                    else if (results[compteur].duration < 11) { LabelDuration = "5 to 10 days"; ValueDuration = '7'; }
                    else if (results[compteur].duration < 11) { LabelDuration = "11 to 16 days"; ValueDuration = '14'; }
                    else { LabelDuration = "17 days or more"; ValueDuration = '21'; }

                    if (ListeDurationsToPrint.indexOf("--" + ValueDuration + "--") == -1) {
                        ListeDurationsToPrint += "--" + ValueDuration + "--";
                        DurationsToPrint[DurationsToPrint.length] = (100 + ValueDuration) + "--xx--" + LabelDuration + "--xx--" + ValueDuration;
                    }
                }
            }

            indice = 1;
            FormEnCours.duration.length = 1;
            DurationsToPrint.sort();
            for (var compteur = 0; compteur < DurationsToPrint.length; compteur++) {
                var ToPrintArray = DurationsToPrint[compteur].split('--xx--');

                FormEnCours.duration.options[indice] = new Option(ToPrintArray[1]);
                FormEnCours.duration.options[indice].value = ToPrintArray[2];
                if (DurationEnCours !== "" && ToPrintArray[2] === DurationEnCours) { FormEnCours.duration.options[indice].selected = true; }
                indice++;
            }

        }

        function result(gateway, region, destination, port_of_call, duration, cruise_line, ships) {
            this.gateway = gateway;
            this.region = region;
            this.destination = destination;
            this.port_of_call = port_of_call;
            this.duration = duration;
            this.cruise_line = cruise_line;
            this.ships = ships;
        }

        window.Submit = function() {
            $("[name='date_dep_type']").each(function (index, element) {
                if ($(element).prop("checked")) {
                    if ($(element).attr('value') === "month") {
                        var months_en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        var months_fr = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
                        var dep_month = $(element).closest(".input-group-wrapper").find(".calendar").val();
                        var dep_year = dep_month.substring(dep_month.length - 4, dep_month.length).trim();
                        dep_month = dep_month.substring(0, dep_month.length - 4)
                        if (Lang === "fr")
                            dep_month = parseInt($.inArray(dep_month.trim(), months_fr)) + 1;
                        else
                            dep_month = parseInt($.inArray(dep_month.trim(), months_en)) + 1;
                        dep_month = ('0' + dep_month).slice(-2);
                        $("input[name='departure_month_au_long']").val(dep_year + dep_month)
                    }
                    else {
                        var date = $(element).closest(".input-group-wrapper").find(".calendar").val().replace(/-/g, "");
                        $("input[name='date_dep']").val(date)
                    }
                }
            });
            $("input[name='alias']").val(desktopAlias);
            if (currentViewPort === "xs" && isMobileDevice() && isTouchDevice()) {
                $("input[name='alias']").val(mobileAlias);
                $("input[name='isMobile']").val("true");
                $("input[name='nb_child_forf']").val($("#nb_child").val());
            }
            return true;
        }

        function InitDropsSuite(FormEnCours, gateway, dest, hotel, duration) {
            var indice = 0;
            if (typeof FormEnCours !== "undefined") {
                FormEnCours.gateway_dep.length = 0;
                for (var compteur = 0; compteur < Gateways.length; compteur++) {
                    //indice = compteur;
                    var GatewaysArray = Gateways[compteur].code;
                    FormEnCours.gateway_dep.options[compteur] = new Option(Gateways[compteur].name);
                    FormEnCours.gateway_dep.options[compteur].value = Gateways[compteur].code;
                    if (gateway !== "" && GatewaysArray.indexOf(gateway) > -1) { FormEnCours.gateway_dep.options[compteur].selected = true; }
                }

                if (FormEnCours.dest_dep != null && FormEnCours.dest_dep.type && FormEnCours.dest_dep.value != "ALL") {
                    // c'est pas un last minute
                    refreshDest(FormEnCours, dest, hotel, duration);
                }
            }
        }

        var Durations = Object();
        var Destinations = Array();

        function RetreiveDestinations(FormEnCours, GateEnCours, dest, hotel, duration) {
            // Destinations[GateEnCours] = Array("All Destinations--xx--AllqqqDestinationsxxx1,2,24--xx--3,4,5,6,7,8,13,14,15","","All Mexico--xx--AllqqqMexicoxxx1,2,24--xx--7,14","- Acapulco--xx--1--xx--7,14","- Cancun--xx--Cancunxxx2,24--xx--7,14");

            $.ajax({
                url: gatewayDestinationURL + "api/SV/search/getDestCode/" + Lang + "/SWG/" + GateEnCours,
                type: "GET",
                cache: true,
                dataType: "json",
                success: function (data) {
                    Destinations[GateEnCours] = data;
                    refreshDestSuite(FormEnCours, GateEnCours, dest, hotel, duration);
                }
            });
        }

        window.refreshDest = function(FormEnCours, dest, hotel, duration) {
            var GateEnCours;
            FormEnCours.duration.options[0] = new Option(Duration_5to10);
            FormEnCours.duration.options[0].value = 7;
            GateEnCours = FormEnCours.gateway_dep.options[FormEnCours.gateway_dep.selectedIndex].value;
            if (GateEnCours == "") { FormEnCours.dest_dep.length = 0 }
            else if (FormEnCours.dest_dep != null && FormEnCours.dest_dep.type && FormEnCours.dest_dep.value != "ALL") {
                if (Destinations[GateEnCours] == null || Destinations[GateEnCours].length == 0) { RetreiveDestinations(FormEnCours, GateEnCours, dest, hotel, duration); }
                else { refreshDestSuite(FormEnCours, GateEnCours, dest, hotel, duration); }
            }
        }

        function refreshDestSuite(FormEnCours, GateEnCours, dest, hotel, duration) {
            var indice = 0,
                indiceCount = 0;
            FormEnCours.dest_dep.length = 0;
            var selectedFound = false;
            //All Canada and United States--xx--All Canada and United States xxx20_31_32_43_51_65_97_147_148_151_1017_1434_1578_2749976_2750009_2750048_2750660_2750814_2751301_2752241--xx--3,4,5,6,7,8,9,10,11,12,13,14,15,16
            for (var compteur = 0; compteur < Destinations[GateEnCours].length; compteur++) {
                indice = (compteur + indiceCount);
                var DestinationsArray = Array(); //Destinations[GateEnCours][compteur].split('--xx--');
                DestinationsArray[0] = Destinations[GateEnCours][compteur].groupName;
                var destArray = Destinations[GateEnCours][compteur].groupCode.split(",");
                destArray.sort(function (a, b) { return a - b });
                var destValue = Destinations[GateEnCours][compteur].groupName + " xxx" + destArray[0];
                var i;
                for (i = 1; i < destArray.length; i++)
                    destValue = destValue + "_" + destArray[i];

                DestinationsArray[1] = destValue;

                FormEnCours.dest_dep.options[indice] = new Option(DestinationsArray[0]);
                FormEnCours.dest_dep.options[indice].value = DestinationsArray[1];
                var DestEnCours = destValue.substring(destValue.indexOf("xxx") + 3);
                if (Durations[GateEnCours] == null || Durations[GateEnCours].length === 0) { Durations[GateEnCours] = Object(); }
                // To get Rid of Duplication of durations values
                if ((DestinationsArray[0] !== "United States") && (DestinationsArray[0] !== "Etats-Unis")) {
                    var j = 0;
                    for (i = 0; i < Destinations[GateEnCours][compteur].destination.length; i++)
                        if (i > 0) {
                            var prevDur = Destinations[GateEnCours][compteur].destination[i - 1].durations.split(",");
                            var currDur = Destinations[GateEnCours][compteur].destination[i].durations.split(",");
                            if (prevDur.length <= currDur.length)
                                j = (i);
                            else
                                j = (i - 1);
                        }
                    Durations[GateEnCours][DestEnCours] = Destinations[GateEnCours][compteur].destination[j].durations;
                }
                if (Destinations[GateEnCours][compteur].destination.length >= 2) {
                    for (i = 0; i < Destinations[GateEnCours][compteur].destination.length; i++) {
                        DestinationsArray[0] = Destinations[GateEnCours][compteur].destination[i].destName;
                        DestinationsArray[0] = "- " + DestinationsArray[0];
                        if (codesPrepopulations[Destinations[GateEnCours][compteur].destination[i].destCode] !== undefined && !LPCObjExists)
                            DestinationsArray[1] = DestinationsArray[0] + " xxx" + codesPrepopulations[Destinations[GateEnCours][compteur].destination[i].destCode];
                        else
                            DestinationsArray[1] = DestinationsArray[0] + " xxx" + Destinations[GateEnCours][compteur].destination[i].destCode;
                        FormEnCours.dest_dep.options[indice + i + 1] = new Option(DestinationsArray[0]);
                        FormEnCours.dest_dep.options[indice + i + 1].value = DestinationsArray[1];
                        var destEnCour = Destinations[GateEnCours][compteur].destination[i].destCode;
                        Durations[GateEnCours][destEnCour] = Destinations[GateEnCours][compteur].destination[i].durations;
                        indiceCount = indiceCount + 1;
                    }
                } else {
                    if ((DestinationsArray[0].indexOf("All Countries") === -1) && (DestinationsArray[0].indexOf("All Canada") === -1) && (DestinationsArray[0].indexOf("All South") === -1) && (DestinationsArray[0].indexOf("Tout Pays") === -1) && (DestinationsArray[0].indexOf("Tout Canada et Etats-Unis") === -1) && (DestinationsArray[0].indexOf("Tout Sud") === -1)) {
                        DestinationsArray[0] = DestinationsArray[0] + " (" + Destinations[GateEnCours][compteur].destination[0].destName + ")";
                        FormEnCours.dest_dep.options[indice] = new Option(DestinationsArray[0]);
                        FormEnCours.dest_dep.options[indice].value = DestinationsArray[1];
                    }
                }
            }
            UpdateDestinationSelection();
            refreshHotel(FormEnCours, hotel, duration);
        }

        function UpdateDestinationSelection() {
            if ($("html").attr("data-template") === "hotelpage" || ($("html").attr("data-template") === "excursions" && ExcursionDictionary.destination !== "") || ($("html").attr("data-template") === "destinations" && (CommonDictionary.country !== "" || CommonDictionary.destination !== ""))) {
                var topLevel = false;
                switch ($("html").attr("data-template")) {
                    case "excursions":
                        if (typeof ExcursionDictionary.destination !== "undefined") {
                            DestinationName = ExcursionDictionary.destination.replace(/-/g, " ");
                            DestinationName = DestinationName.toLowerCase().replace(/\b[a-z]/g, function (letter) { return letter.toUpperCase(); });
                        }
                        break;
                    case "destinations":
                        if (typeof CommonDictionary.destination !== "undefined") {
                            DestinationName = CommonDictionary.destination.replace(/-/g, " ");
                            DestinationName = DestinationName.toLowerCase().replace(/\b[a-z]/g, function (letter) { return letter.toUpperCase(); });
                        }
                        else if (typeof CommonDictionary.country !== "undefined") {
                            DestinationName = CommonDictionary.country.replace(/-/g, " ");
                            DestinationName = DestinationName.toLowerCase().replace(/\b[a-z]/g, function (letter) { return letter.toUpperCase(); });
                            topLevel = true;
                        }
                        topLevel = (CommonDictionary.destination === CommonDictionary.country) ? topLevel = true : topLevel = false;
                        break;
                }
                if (Lang === "fr" && DestinationName === "St Maarten")
                    DestinationName = "Saint Martin";

                switch (DestinationName) {
                    case "St Lucia":
                        DestinationName = "Saint Lucia";
                        break;
                    case "Santa Lucia":
                        DestinationName = "Santa Lucia (Camaguey)";
                        break;
                    case "Santiago De Cuba":
                        DestinationName = "Santiago de Cuba";
                        break;
                    case "Manzanillo De Cuba":
                        DestinationName = "Manzanillo de Cuba";
                        break;
                    case "Grand Bahama":
                        DestinationName = "Freeport";
                        break;
                    case "Ixtapa-Zihuatanejo":
                        DestinationName = "Ixtapa";
                        break;
                    case "Ixtapa Zihuatanejo":
                        DestinationName = "Ixtapa";
                        break;
                    case "CuraçAo":
                        DestinationName = "Curacao";
                        break;
                    case "Mazatlán":
                        DestinationName = "Mazatlan";
                        break;
                    case "MazatláN":
                        DestinationName = "Mazatlan";
                        break;
                    case "JamaïQue":
                        DestinationName = "Jamaique";
                        break;
                    case "RéPublique Dominicaine":
                        DestinationName = "Republique Dominicaine";
                        break;
                    case "St. Petersburg":
                        DestinationName = "St Petersburg";
                        break;
                    case "éTats Unis":
                        DestinationName = "Etats-Unis";
                        break;
                    case "Antigua":
                        if (Lang === "fr")
                            DestinationName = "Antigua et Barbuda";
                        else
                            DestinationName = "Antigua and Barbuda";
                        break;
                    case "ANTIGUA":
                        if (Lang === "fr")
                            DestinationName = "Antigua et Barbuda";
                        else
                            DestinationName = "Antigua and Barbuda";
                        break;
                    case "Tobago":
                        DestinationName = "Trinidad  Tobago";
                        break;
                }
                var destHotel = DestinationName;
                selectDestination(destHotel, topLevel);
            }
        }

        function selectDestination(destHotel, topLevel) {
            $("#Select2 option").filter(function () {
                if (!topLevel && $(this).val().substring(0, $(this).val().indexOf("xxx")).replace(/[\-]/g, "").trim().toLowerCase() === destHotel.toLowerCase()) {
                    $(this).prop("selected", true);
                    $("#Select2").change();
                }
                else if (topLevel && $(this).val().substring(0, $(this).val().indexOf("xxx")).replace(/[\-]/g, "").trim().toLowerCase() === destHotel.toLowerCase()) {
                    $(this).prop("selected", true);
                    $("#Select2").change();
                }
                else if (typeof SVDestCode !== "undefined" && !topLevel && $(this).val().substring($(this).val().indexOf("xxx") + 3).trim() === SVDestCode.trim()) {
                    $(this).prop("selected", true);
                    $("#Select2").change();
                }
            });
        }

        Hotels = Array();
        function RetreiveHotels(FormEnCours, GateEnCours, DestEnCours, hotel, duration) {
            // Hotels[GateEnCours][DestEnCours] = Array("All Hotels--xx--","All Melia--xx--1234,5678","","MELIA C. SANTA MARIA--xx--1234","MELIA LAS DUNAS--xx--5678");
            if (Hotels[GateEnCours] == null || Hotels[GateEnCours].length == 0) { Hotels[GateEnCours] = Array(); }

            $.ajax({
                url: gatewayDestinationURL + "api/SV/search/SVHotelList/",
                type: "GET",
                data: { brand: "swg", lang: Lang, gateway: GateEnCours, destinationid: DestEnCours },
                cache: true,
                dataType: 'json',
                success: function (data) {
                    if (data !== undefined) {
                        Hotels[GateEnCours][DestEnCours] = data[0].hotels;
                        refreshHotelSuite(FormEnCours, GateEnCours, DestEnCours, hotel, duration);
                    };
                }
            });
        };

        window.refreshHotel = function(FormEnCours, hotel, duration) {
            var GateEnCours;
            GateEnCours = FormEnCours.gateway_dep.options[FormEnCours.gateway_dep.selectedIndex].value;

            var DestEnCours;
            DestEnCours = FormEnCours.dest_dep.options[FormEnCours.dest_dep.selectedIndex].value;

            var DestToKeep = DestEnCours;
            if (DestEnCours.indexOf('xx') > -1) {
                var DestEnCoursTemp = DestEnCours.split('xxx');
                DestEnCours = DestEnCoursTemp[1];
            }
            if (FormEnCours.no_hotel != null && FormEnCours.no_hotel.type) {
                FormEnCours.no_hotel.length = 1;

                if (Hotels[GateEnCours] == null || Hotels[GateEnCours].length == 0 || Hotels[GateEnCours][DestEnCours] == null || Hotels[GateEnCours][DestEnCours].length == 0) { RetreiveHotels(FormEnCours, GateEnCours, DestEnCours, hotel, duration); }
                else { refreshHotelSuite(FormEnCours, GateEnCours, DestEnCours, hotel, duration); }
            }
            else {
                refreshDuration(FormEnCours, GateEnCours, DestEnCours, hotel, duration);
            }
        }

        function refreshHotelSuite(FormEnCours, GateEnCours, DestEnCours, hotel, duration) {
            var indice = 1;
            FormEnCours.no_hotel.length = indice;
            for (var compteur = 0; compteur < Hotels[GateEnCours][DestEnCours].length; compteur++) {
                var HotelsArray = Hotels[GateEnCours][DestEnCours][compteur].split('--xx--');

                FormEnCours.no_hotel.options[indice] = new Option(HotelsArray[0]);
                FormEnCours.no_hotel.options[indice].value = HotelsArray[1];

                // Prepopulation
                if (hotel != "" && HotelsArray[1] == hotel) { FormEnCours.no_hotel.options[indice].selected = true; }

                indice++;
            }
            if ($("html").attr("data-template") === "hotelpage") {
                var hotelCode = SoftVoyageCode;
                selectHotel(hotelCode)
            }
            if ($("html").attr("data-template") === "hotelBrandpage") {
                $("#Select6 option").filter(function () {
                    var hb = $(location).attr("pathname")
                    hb = hb.substring(hb.indexOf("hotel-brands") + 13).replace(/[-]/g, " ");
                    if (hb.toLowerCase().indexOf($(this).text().substring(4).toLowerCase()) !== -1)
                        $(this).prop("selected", true);
                });
            }

            refreshDuration(FormEnCours, GateEnCours, DestEnCours, hotel, duration);
        }

        function refreshStar(FormEnCours) {
            FormEnCours.star.options[0].selected = true;
            var hVal = $("#lpc-select-hotel option:selected").val();
            if ((hVal === "")) {
                $("#lpc-star-rating").removeAttr("disabled");
                $(".form-group.dtc.lpc-star-rating").removeClass("disabled-form-input");
            }
            else {
                $("#lpc-star-rating").attr("disabled", "disabled");
                $(".form-group.dtc.lpc-star-rating").addClass("disabled-form-input");
            }
        }

        function selectHotel(hotelCode) {
            $("#Select6 option").filter(function () {
                if ($(this).val() == hotelCode) {
                    $(this).prop("selected", true);
                }
            })
        }

        function refreshDuration(FormEnCours, GateEnCours, DestEnCours, hotel, duration) {
            // Refresh durations
            var FlagMoinsDe5Jours = "";
            var Flag5a10jours = "";
            var Flag11a16jours = "";
            var FlagPlusDe16Jours = "";

            var DurationEnCours;
            if (FormEnCours.duration.selectedIndex > -1) { DurationEnCours = FormEnCours.duration.options[FormEnCours.duration.selectedIndex].value; }
            if (DurationEnCours == "") { DurationEnCours = 7; }

            var ListeDurations = Array();
            if (Durations[GateEnCours] == null || Durations[GateEnCours].length == 0 || Durations[GateEnCours][DestEnCours] == null || Durations[GateEnCours][DestEnCours].length == 0) { ListeDurations = Array(3, 7, 14) }
            else { ListeDurations = Durations[GateEnCours][DestEnCours].split(',') }

            var onlyFixedDurations = false;
            if (ListeDurations[0] === "FIXED") {
                onlyFixedDurations = true;
                ListeDurations.shift();
            }

            for (var compteur = 0; compteur < ListeDurations.length; compteur++) {
                if (ListeDurations[compteur] >= 0 && ListeDurations[compteur] <= 4) { FlagMoinsDe5Jours = "Y"; }
                else if (ListeDurations[compteur] >= 5 && ListeDurations[compteur] <= 10) { Flag5a10jours = "Y"; }
                else if (ListeDurations[compteur] >= 11 && ListeDurations[compteur] <= 16) { Flag11a16jours = "Y"; }
                else if (ListeDurations[compteur] >= 17) { FlagPlusDe16Jours = "Y"; }
            }

            if (onlyFixedDurations) {
                FlagMoinsDe5Jours = "";
                Flag5a10jours = "";
                Flag11a16jours = "";
                FlagPlusDe16Jours = "";
            }

            FormEnCours.duration.length = 0;
            indice = 0;
            if (FlagMoinsDe5Jours != "") {
                FormEnCours.duration.options[indice] = new Option(Duration_3to4);
                FormEnCours.duration.options[indice].value = 4;
                indice++;
            }
            if (Flag5a10jours != "") {
                FormEnCours.duration.options[indice] = new Option(Duration_5to10);
                FormEnCours.duration.options[indice].value = 7;
                indice++;
            }
            if (Flag11a16jours != "") {
                FormEnCours.duration.options[indice] = new Option(Duration_11to16);
                FormEnCours.duration.options[indice].value = 14;
                indice++;
            }
            if (FlagPlusDe16Jours != "") {
                FormEnCours.duration.options[indice] = new Option(Duration_17days);
                FormEnCours.duration.options[indice].value = 21;
                indice++;
            }
            // Ajouter les durations specifiques
            if (!onlyFixedDurations && ListeDurations.length > 0) {
                // ajouter un espace
                FormEnCours.duration.options[indice] = new Option("");
                FormEnCours.duration.options[indice].value = '';
                indice++;
            }

            for (var compteur = 0; compteur < ListeDurations.length; compteur++) {
                FormEnCours.duration.options[indice] = new Option(ListeDurations[compteur] + " " + Duration_daysonly);
                FormEnCours.duration.options[indice].value = ListeDurations[compteur] + 'DAYS';
                indice++;
            }

            compteur1 = "";
            compteur = "";
            indice = "";

            //Prepopulation
            if (!FormEnCours.duration.options[0]) {
                FormEnCours.duration.options[0] = new Option(Duration_5to10);
                FormEnCours.duration.options[0].value = 7;
                FormEnCours.duration.options[1] = new Option(Duration_3to4);
                FormEnCours.duration.options[1].value = 4;
                FormEnCours.duration.options[2] = new Option(Duration_11to16);
                FormEnCours.duration.options[2].value = 14;
            }

            if (duration == null || duration == "") { duration = 7; }
            for (var i = 0; i < FormEnCours.duration.options.length; i++) {
                if (FormEnCours.duration.options[i].value == duration) {
                    FormEnCours.duration.options[i].selected = true;
                }
            }

        }

        var userDate = "";
        $(function () {
            $('#nb_child, #flights_nb_child').prop('selectedIndex', 0);
            $('#nb_adult, #nb_rooms').focus(function () {
                $('#error-message-modulo').hide();
                $('#error-message-totalPax').hide();
                $('#content-packages .packages-adults').removeClass("error");
                if ($('#error-message-nonadults').is(":hidden") && $('#error-message-totalPax').is(":hidden") && $('#error-message-nonadultage').is(":hidden") && $('#error-message-dates').is(":hidden")) {
                    $('.error-messages.packages').removeClass("show");
                }
            });

            $('#nb_rooms, #nb_child').focus(function () {
                $('#error-message-nonadults').hide();
                $('#error-message-totalPax').hide();
                $('#content-packages .packages-rooms').removeClass("error");
                if ($('#error-message-modulo').is(":hidden") && $('#error-message-totalPax').is(":hidden") && $('#error-message-nonadultage').is(":hidden") && $('#error-message-dates').is(":hidden")) {
                    $('.error-messages.packages').removeClass("show");
                }
            });

            $('.c_age, #nb_child').focus(function () {
                $('#error-message-nonadultage').hide();
                $('#error-message-totalPax').hide();
                $('#content-packages .packages-children').removeClass("error");
                $("#content-packages .form-group.col-xs-3").removeClass("error")
                $("#content-packages .form-group.childage-wrapper").removeClass("error")
                if ($('#error-message-nonadults').is(":hidden") && $('#error-message-totalPax').is(":hidden") && $('#error-message-modulo').is(":hidden") && $('#error-message-dates').is(":hidden")) {
                    $('.error-messages.packages').removeClass("show");
                }
            });

            $('#package_date_dep').focus(function () {
                $('#error-message-dates').hide();
                $('#content-packages .departure-date').removeClass("error");
                if ($('#error-message-nonadults').is(":hidden") && $('#error-message-totalPax').is(":hidden") && $('#error-message-modulo').is(":hidden") && $('#error-message-nonadultage').is(":hidden")) {
                    $('.error-messages.packages').removeClass("show");
                }
            });

            $("#tab-packages").click(function () {
                if (!$('#content-packages .packages-adults').hasClass("error") &&
                    !$('#content-packages .packages-rooms').hasClass("error") &&
                    !$('#content-packages .packages-children').hasClass("error") &&
                    !$('#content-packages .departure-date').hasClass("error")) {
                    $('.error-messages.packages').removeClass("show");
                    $('.error-messages.flights').removeClass("show");
                    $('.error-messages.cars').removeClass("show");

                } else {
                    $('.error-messages.packages').addClass("show");
                    $('.error-messages.flights').removeClass("show");
                    $('.error-messages.cars').removeClass("show");
                }
            });

            $("#tab-hotels").click(function () {
                if (!$('#content-hotels .hotel-destination').hasClass("error")) {
                    $('.error-messages.packages').removeClass("show");
                    $('.error-messages.flights').removeClass("show");
                    $('.error-messages.cars').removeClass("show");
                    $('.error-messages.hotels').removeClass("show");
                } else {
                    $('.error-messages.packages').addClass("show");
                    $('.error-messages.cars').removeClass("show");
                    $('.error-messages.flights').removeClass("show");
                }
            });

            $("#tab-cruises").click(function () {
                $('.error-messages.packages').removeClass("show");
                $('.error-messages.flights').removeClass("show");
                $('.error-messages.cars').removeClass("show");
                $('.error-messages.hotels').removeClass("show");
            });

            $("#tab-cars").click(function () {
                if (!$('#content-cars .car-dropoff-gateway').hasClass("error") &&
                    !$('#content-cars .car-pickup-gateway').hasClass("error")) {
                    $('.error-messages.packages').removeClass("show");
                    $('.error-messages.flights').removeClass("show");
                    $('.error-messages.cars').removeClass("show");

                } else {
                    $('.error-messages.cars').addClass("show");
                    $('.error-messages.packages').removeClass("show");
                    $('.error-messages.flights').removeClass("show");
                }
            });

            $('#flights_date_dep').focus(function () {
                $('#flights_error-message-dates_dep').hide();
                $('#content-flights .departure-date').removeClass("error");
                if ($('#flights_error-message-dates_ret').is(":hidden") && $('#flights_error-message-nonadultage').is(":hidden") && $('#flights_error-message-gateway').is(":hidden") && $('#flights_error-message-destination').is(":hidden") && $('#flights_error-message-searchType').is(":hidden")) {
                    $('.error-messages.flights').removeClass("show");
                }
            });

            $('#flights_date_ret').focus(function () {
                $('#flights_error-message-dates_ret').hide();
                $('#content-flights .return-date').removeClass("error");
                if ($('#flights_error-message-dates_dep').is(":hidden") && $('#flights_error-message-nonadultage').is(":hidden") && $('#flights_error-message-gateway').is(":hidden") && $('#flights_error-message-destination').is(":hidden") && $('#flights_error-message-searchType').is(":hidden")) {
                    $('.error-messages.flights').removeClass("show");
                }
            });

            $('.flights_age, #flights_nb_child').focus(function () {
                $('#flights_error-message-nonadultage').hide();
                $('#content-flights .flights-children').removeClass("error");
                $("#content-flights .form-group.childage-wrapper").removeClass("error")
                $('#content-flights .form-group.col-xs-3').removeClass("error")
                if ($('#flights_error-message-dates_dep').is(":hidden") && $('#flights_error-message-dates_ret').is(":hidden") && $('#flights_error-message-gateway').is(":hidden") && $('#flights_error-message-destination').is(":hidden") && $('#flights_error-message-searchType').is(":hidden")) {
                    $('.error-messages.flights').removeClass("show");
                }
            });

            $('#flights_Select1').click(function () {
                $('#flights_error-message-gateway').hide();
                $('#content-flights .departure-gateway').removeClass("error");
                if ($('#flights_error-message-dates_dep').is(":hidden") && $('#flights_error-message-dates_ret').is(":hidden") && $('#flights_error-message-nonadultage').is(":hidden") && $('#flights_error-message-destination').is(":hidden") && $('#flights_error-message-searchType').is(":hidden")) {
                    $('.error-messages.flights').removeClass("show");
                }
            });
            $("#flights_Select2").click(function () {
                $('#flights_error-message-destination').hide();
                $('#content-flights .arrival-gateway').removeClass("error");
                if ($('#flights_error-message-dates_dep').is(":hidden") && $('#flights_error-message-dates_ret').is(":hidden") && $('#flights_error-message-gateway').is(":hidden") && $('#flights_error-message-nonadultage').is(":hidden") && $('#flights_error-message-searchType').is(":hidden")) {
                    $('.error-messages.flights').removeClass("show");
                }
            });

            $('.form-group.dtc.radio-group-wrapper, #flights_Select1').click(function () {
                $('#flights_error-message-searchType').hide();
                $('#content-flights .radio-group').removeClass("error");
                if ($('#flights_error-message-dates_dep').is(":hidden") && $('#flights_error-message-dates_ret').is(":hidden") && $('#flights_error-message-gateway').is(":hidden") && $('#flights_error-message-destination').is(":hidden") && $('#flights_error-message-nonadultage').is(":hidden")) {
                    $('.error-messages.flights').removeClass("show");
                }
            });

            $("#tab-flights").click(function () {
                if (!$('#content-flights .return-date').hasClass("error") &&
                    !$('#content-flights .flights-children').hasClass("error") &&
                    !$('#content-flights .departure-date').hasClass("error") &&
                    !$('#content-flights .arrival-gateway').hasClass("error") &&
                    !$('#content-flights .departure-gateway').hasClass("error") &&
                    !$('#content-flights .radio-group').hasClass("error")) {
                    $('.error-messages.flights').removeClass("show");
                    $('.error-messages.packages').removeClass("show");
                    $('.error-messages.cars').removeClass("show");
                } else {
                    $('.error-messages.flights').addClass("show");
                    $('.error-messages.packages').removeClass("show");
                    $('.error-messages.cars').removeClass("show");
                }
            });

            if (SearchBoxObjExists) {
                //Start: Updated for removing old www.sunwing.ca cookies for Gateway and Language
                $.cookie("SunwingGateway", "", { expires: -1, path: "/" });
                $.cookie("SunwingLanguage", "", { expires: -1, path: "/" });
                //End: Updated for removing old www.sunwing.ca cookies
                if (($.cookie("SunwingGateway") !== null && $.cookie("SunwingGateway") !== undefined) && !queryParamExists("gatewaycode")) {
                    InitDrops(document.frm, $.cookie("SunwingGateway"), "", "", "");
                    RefreshCruiseSuite(document.cruise_frm, $.cookie("SunwingGateway"), "", "", "", "", "");
                    if (flightExists)
                        InitFlightsDrops($.cookie("SunwingGateway"));
                } else {
                    InitDrops(document.frm, displayGateway, "", "", "");
                    RefreshCruiseSuite(document.cruise_frm, displayGateway, "", "", "", "", "");
                    if (flightExists)
                        InitFlightsDrops(displayGateway);

                }
                RefreshCarsSuite();
            }
        });

        function RefreshCarsSuite() {
            if (SearchBoxObjExists) {
                $("#car-pickup-gateway").val("");
                $("#car-dropoff-gateway").val("");
            }
            $.getJSON('https://www.sunwing.ca/Home/GetSearchCarsTabData', function (d) {
                dataCars.push(d);
            }).always(function () {
                $("#car-pickup-gateway").autocomplete({
                    minLength: 0,
                    source: function (request, response) {
                        var carPickupGateways = getCarsData(dataCars[0].Products, null, request);
                        response(carPickupGateways);
                    },
                    select: function (event, ui) {
                        $("#car-dropoff-gateway").val("");
                        $("#car-dropoff-gateway").autocomplete({
                            minLength: 0,
                            source: function (request, response) {
                                var carDropoffGateways = getCarsData(dataCars[0].Products, ui, request);
                                carDropoffGateways.unshift({
                                    label: SameAs,
                                    value: SameAs,
                                    regionCode: ""
                                });
                                response(carDropoffGateways);
                            }
                        }).focus(function () {
                            $(this).data("uiAutocomplete").search($(this).val());
                        });
                    }

                }).focus(function () {
                    $(this).data("uiAutocomplete").search($(this).val());
                });
            });
        }

        var getCarsData = function (data, ui, request) {
            var carGateways = [];

            if (ui == null) {
                var ignoreRegionFilter = true;
            }
            $.each(data, function (ke, val) {
                if (ui != null && val.regionCode === ui.item.regionCode || ignoreRegionFilter) {
                    var mapped = $.map(val.destinationName, function (value, key) {
                        if ($(".error-messages.cars").hasClass("show"))
                            request.term = "";
                        if (value.substring(0, request.term.length).toLowerCase() === request.term.toLowerCase()) {
                            value = value + " (" + val.destinationCode[key] + ")";
                            return {
                                label: value,
                                value: value,
                                regionCode: val.regionCode
                            };
                        }
                    });
                    carGateways = carGateways.concat(mapped);
                }
            });

            return carGateways;
        }


        window.validateCarsForm = function() {
            pickUpGateway = false;
            dropOffGateway = false;
            pickUpDate = false;
            dropffDate = false;
            var returnType = true;
            var dest_dropoff = $("#car-dropoff-gateway").val();
            var pickUpGatewayObj = $("#car-pickup-gateway");
            var pickUpGatewayDefault = $.trim(pickUpGatewayObj.val());
            var gateway = $("#car-pickup-gateway").val();
            $("input[name='gateway_dep']").val(gateway.substring(gateway.indexOf("(") + 1, gateway.indexOf(")")));
            if (dest_dropoff === SameAs) {
                $("input[name='dest_dep']").val(gateway.substring(gateway.indexOf("(") + 1, gateway.indexOf(")")));
            }
            else {
                var dest = $("#car-dropoff-gateway").val();
                $("input[name='dest_dep']").val(dest.substring(dest.indexOf("(") + 1, dest.indexOf(")")));
            }
            if (pickUpGatewayDefault.length <= 0) {
                returnType = false;
                pickUpGateway = true;
            }
            if (dest_dropoff.length <= 0) {
                returnType = false;
                dropOffGateway = true;
            }
            $("input[name='date_dep']").val($("#car-pickup-date").val().replace(/-/g, ""));
            $("input[name='date_ret']").val($("#car-dropoff-date").val().replace(/-/g, ""));

            if (pickUpGateway) {
                if (!$(".error-messages.cars").hasClass("show"))
                    $('.error-messages.cars').addClass("show");
                $('#cars_error-message-pickup').show();
                $('#content-cars .car-pickup-gateway').addClass("error");
            } else {
                $('#content-cars .car-pickup-gateway').removeClass("error");
                $('#cars_error-message-pickup').hide();
            }
            if (dropOffGateway) {
                if (!$(".error-messages.cars").hasClass("show"))
                    $('.error-messages.cars').addClass("show");
                $('#cars_error-message-dropoff').show();
                $('#content-cars .car-dropoff-gateway').addClass("error");
            } else {
                $('#content-cars .car-dropoff-gateway').removeClass("error");
                $('#cars_error-message-dropoff').hide();
            }

            if (!validateDate($("#car-pickup-date").val())) {
                if (!$(".error-messages.cars").hasClass("show"))
                    $('.error-messages.cars').addClass("show");
                $('#cars_error-message-pickup-date').show();
                $('#content-cars .car-pickup-date').addClass("error");
                returnType = false;
            }
            else {
                $('#content-cars .car-pickup-date').removeClass("error");
                $('#cars_error-message-pickup-date').hide();
            }

            if (!validateDate($("#car-dropoff-date").val())) {
                if (!$(".error-messages.cars").hasClass("show"))
                    $('.error-messages.cars').addClass("show");
                $('#cars_error-message-dropoff-date').show();
                $('#content-cars .car-dropoff-date').addClass("error");
                returnType = false;
            }
            else {
                $('#content-cars .car-dropoff-date').removeClass("error");
                $('#cars_error-message-dropoff-date').hide();
            }

            var isFormValid = returnType === true ? true : false;
            if (isFormValid) {
                $('.error-messages.cars').removeClass("show");
            }
            $("input[name='alias']").val(desktopAlias);
            if (currentViewPort === "xs" && isMobileDevice() && isTouchDevice()) {
                $("input[name='alias']").val(mobileAlias);
                $("input[name='isMobile']").val("true");
                $("input[name='nb_child_forf']").val($("#nb_child").val());
            }
            return isFormValid;
        }


        window.validateForm = function() {

            var returnType = true;

            if (!validateDate($("#package_date_dep").val())) {
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");
                $('#error-message-dates').show();
                $('#content-packages .departure-date').addClass("error");
                returnType = false;
            }
            //Forcer 1 seule chambre
            if ($("#nb_child option:selected").val() != 0 && $("#nb_rooms option:selected").val() > 1) {
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");
                $('#error-message-nonadults').show();
                $('#content-packages .packages-rooms').addClass("error");
                returnType = false;
            }

            //Forcer un nombre d'adultes divisable par le nombre de chambres (sans reste)
            if (document.frm.nb_adult_forf[document.frm.nb_adult_forf.selectedIndex].value % document.frm.nb_rooms[document.frm.nb_rooms.selectedIndex].value) {
                var element_adults = document.getElementById('nb_adult_forf');
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");

                if ($('#error-message-nonadults').is(":hidden")) {
                    $('#error-message-modulo').show();
                }

                $('#content-packages .packages-adults').addClass("error");
                returnType = false;
            }

            //ParticularitÃ© DRV : si la personne dit vouloir des enfants, on l'oblige Ã  entrer l'Ã¢ge de chacun.
            var nb_child = document.frm.nb_child[document.frm.nb_child.selectedIndex].value;
            for (i = 1; i <= nb_child; i++) {
                var champ;
                champ = eval('document.frm.non_adult_forf' + i).value;
                if (champ == 0) {
                    if (!$(".error-messages.packages").hasClass("show"))
                        $('.error-messages.packages').addClass("show");

                    if ($('#error-message-nonadults').is(":hidden")) {
                        $('#error-message-nonadultage').show();
                    }

                    $('#content-packages .packages-children').addClass("error");
                    $("#content-packages .form-group.childage-wrapper").addClass("error");
                    $('#promo-packages-childage' + i).parent().addClass("error");
                    returnType = false;
                }

            }

            if (parseInt($("#nb_child option:selected").val()) + parseInt($("#nb_adult option:selected").val()) > 9) {
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");
                $('#error-message-totalPax').show();
                $('#content-packages .packages-adults').addClass("error");
                $('#content-packages .packages-children').addClass("error");
                returnType = false;
            }

            if (returnType === true) {

                $("input[name='alias']").val(desktopAlias);
                //Si on s'est rendus jusqu'ici, c'est bon pour soumettre!
                if (currentViewPort === "xs" && isMobileDevice() && isTouchDevice()) {
                    $("input[name='alias']").val(mobileAlias);
                    $("input[name='isMobile']").val("true");
                    $("input[name='nb_child_forf']").val($("#nb_child").val());
                }
                document.frm.date_dep.value = document.frm.package_date_dep.value.replace(/-/g, "");
                try {
                    var _csd = [], child = 0, childAge, language, depart, dest, departDate, duration, rooms, adults, hotel, strGateway, hotelValue;

                    if ($("#language").val() != undefined)
                        language = $("#language").val().trim();

                    if ($("#Select1 option:selected").text() != undefined)
                        strGateway = $("#Select1 option:selected").val().trim();

                    if ($("#Select1 option:selected").text() != undefined)
                        depart = $("#Select1 option:selected").text().replace(/[^a-zA-Z(/)\s]/gi, "").trim();

                    if ($("#Select2 option:selected").text() != undefined)
                        dest = $("#Select2 option:selected").text().replace(/[^a-zA-Z(/)\s]/gi, "").trim();

                    if ($("#package_date_dep").val() != undefined)
                        departDate = $("#package_date_dep").val().trim();

                    if ($("#duration option:selected").val() != undefined)
                        duration = $("#duration option:selected").val().trim();

                    if ($("#nb_rooms option:selected").val() != undefined)
                        rooms = $("#nb_rooms option:selected").val().trim();

                    if ($("#nb_adult option:selected").val() != undefined)
                        adults = $("#nb_adult option:selected").val().trim();

                    if ($("#nb_child option:selected").val() != undefined)
                        child = $("#nb_child option:selected").val().trim();

                    for (i = 1; i <= child; i++) {
                        if (i == 1)
                            childAge = $("select[name=non_adult_forf1").val().trim();
                        else
                            childAge = childAge + "," + $("select[name=non_adult_forf" + i).val().trim();
                    }

                    if ($("#Select6 option:selected").text() != undefined)
                        hotel = $("#Select6 option:selected").text().trim();

                    if ($("#Select6 option:selected").val() != undefined)
                        hotelValue = $("#Select6 option:selected").val().trim();

                    _csd.push({
                        "language": language,
                        "deptCode": strGateway,
                        "depart": depart,
                        "dest": dest,
                        "departDate": departDate,
                        "duration": duration,
                        "rooms": rooms,
                        "adult": adults,
                        "child": child,
                        "childAge": childAge,
                        "hotel": hotel,
                        "hV": hotelValue,
                    })
                    $.cookie("_sd", JSON.stringify(_csd[0]), { domain: ".sunwing.ca", path: '/' });
                    $.cookie("SunwingGateway", strGateway, { expires: 30, domain: ".sunwing.ca", path: '/' });
                }
                catch (exception) {
                    console.log("Error while storing in Cookie" + exception);
                }
            }
            return returnType;
        }

        function validateDate(deptDate) {
            var currVal = deptDate;
            if (currVal == '')
                return false;

            var rxDatePattern = /^\d{4}-((0\d)|(1[012]))-(([012]\d)|3[01])$/; //Declare Regex
            var dtArray = currVal.match(rxDatePattern); // is format OK?
            if (dtArray == null)
                return false;

            //Checks for mm/dd/yyyy format.
            dtMonth = dtArray[1];
            dtDay = dtArray[3];
            dtYear = dtArray[5];

            if (dtMonth < 1 || dtMonth > 12)
                return false;
            else if (dtDay < 1 || dtDay > 31)
                return false;
            else if ((dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11) && dtDay === 31)
                return false;
            else if (dtMonth == 2) {
                var isleap = (dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0));
                if (dtDay > 29 || (dtDay === 29 && !isleap))
                    return false;
            }
            return true;
        }
        //Flights
        var searchType;
        var gateway;
        var items = [];
        var itemcodes = [];
        var itemsDest = [];

        function InitFlightsDrops(currentGateway) {
            gateway = currentGateway;
            getGatewaySource();
        }

        window.getGatewaySource = function () {
            searchType = $("input[name='searchtype']:checked").val();
            if (searchType === "OW") {
                $(".form-group.dtc.return-date").addClass("disabled-form-input");
                $("#flights_date_ret").attr("disabled", true);
                $(".form-group.dtc.flights-days").addClass("disabled-form-input");
                $("#flights_duration").attr("disabled", true);
            } else {
                $(".form-group.dtc.return-date").removeClass("disabled-form-input");
                $("#flights_date_ret").attr("disabled", false);
                $(".form-group.dtc.flights-days").removeClass("disabled-form-input");
                $("#flights_duration").attr("disabled", false);
            }
            $.getJSON(gatewayDestinationURL + "api/search/getGatewayforBrand/" + Lang + "/SWG/" + searchType, function (data) {
                items = [];
                itemcodes = [];
                $.each(data, function (key, val) {
                    items.push(val.name + " (" + val.code + ")");
                    itemcodes.push(val.code);
                });
            }).always(function () {
                if ($.inArray(gateway, itemcodes) !== -1)
                    $("#flights_Select1").val(items[$.inArray(gateway, itemcodes)]);
                else
                    $("#flights_Select1").val("");
                getDestinationSource(gateway);
                $("#flights_Select1").autocomplete({
                    source: items,
                    autoFocus: true,
                    minLength: 0,
                    select: function () {
                        setTimeout(function () {
                            var dest = $("#flights_Select1").val();
                            gateway = dest.substring(dest.indexOf("(") + 1, dest.indexOf(")"));
                            getDestinationSource(gateway);
                        }, 100);
                    }
                }).focus(function () {
                    $(this).autocomplete("search", "");
                })
            })
        }

        var getDestinationSource = function (dest) {
            $.getJSON(gatewayDestinationURL + "api/search/getDestCode/" + Lang + "/SWG/" + dest + "/" + searchType,
                function (data) {
                    itemsDest = [];
                    var countryName;
                    $.each(data,
                        function (key, val) {
                            if (countryName !== val.countryName) {
                                itemsDest.push(val.countryName);
                                itemsDest.push("- " + val.destinationName);
                            } else {
                                itemsDest.push("- " + val.destinationName);
                            }
                            countryName = val.countryName;
                        });
                }).always(function () {
                    if ($.inArray($("#flights_Select2").val(), itemsDest) === -1) {
                        $("#flights_Select2").val("");
                        if (typeof (flightDest) !== 'undefined' && $.inArray(flightDest, ["Cheap-Flights", "bahamas", "canada", "cuba", "dominican-republic", "mexico", "mexique", "république-dominicaine"]) === -1)
                            $("#flights_Select2").val(flightSelected);
                    }


                    if (itemsDest.length === 0) {
                        if (!$(".error-messages.flights").hasClass("show"))
                            $('.error-messages.flights').addClass("show");
                        $('#flights_error-message-searchType').show();
                        $('#content-flights .radio-group').addClass("error");
                    }
                    if ($("#flights_Select2").length>0)
                    $("#flights_Select2").autocomplete({
                        source: itemsDest,
                        minLength: 0,
                        autoFocus: true,
                        focus: function (event, ui) {
                            if (ui.item.value.indexOf("-") === -1)
                                $(".ui-menu-item").removeClass("ui-state-focus");
                        },
                        select: function (event, ui) {
                            if (ui.item.value.indexOf("USA") !== -1) {
                                $(".form-group.dtc.flights-days").addClass("hide");
                                $(".form-group.dtc.return-date").removeClass("hide");
                            } else if (ui.item.value.indexOf("Canada") !== -1) {
                                $(".form-group.dtc.flights-days").addClass("hide");
                                $(".form-group.dtc.return-date").removeClass("hide");
                            } else {
                                $(".form-group.dtc.return-date").addClass("hide");
                                $(".form-group.dtc.flights-days").removeClass("hide");
                            }
                            if (ui.item.value.indexOf("-") === -1)
                                return false;
                            else
                                return true;
                        }
                    }).data("uiAutocomplete")._renderItem = function (ul, item) {
                        return $("<li>")
                            .append(val =
                                item.value.indexOf("-") === -1
                                    ? "<span class='bold'>" + item.value + "</span>"
                                    : "<span class='fa-destinations'>" + item.value + "</span>")
                            .appendTo(ul);
                    };
                });
        }

        $("#dest_dep_text").autocomplete({
            source: function (request, response) {
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                $.ajax({
                    type: "POST",
                    url: "https://www.sunwing.ca/Home/GetSearchHotelTabData",
                    dataType: "json",
                    data: ({
                        'language': $("#language").val().trim(),
                        'city': request.term,
                    }),
                    autoFocus: true,
                    success: function (data) {
                        var mapped = $.map(data.items, function (v, i) {
                            var text = unescape(v.name);
                            if (text && (!request.term || matcher.test(text) || matcher.test(v.acode) || matcher.test(v.code))) {
                                var aname = v.aname ? ' (' + unescape(v.aname) + ')' : '';
                                return {
                                    label: unescape(v.name) + aname + ', ' + unescape(v.pname) + ', ' + unescape(v.cname),
                                    value: unescape(v.name) + aname + ', ' + unescape(v.pname) + ', ' + unescape(v.cname),
                                    code: v.vvp
                                };
                            }
                        });
                        var keys = Object.create(null);
                        var result = mapped.filter(function (obj) {
                            return keys[obj.value] ? false : keys[obj.value] = true;
                        });
                        response(result);
                    },
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $('.dest_dep_hotel#' + $('#dest_dep_text').attr('canyouseeme')).val(ui.item.code);
                return true;
            },
        });

        window.validateHotelForm = function() {
            var returnType = true;
            var canyouseeme;

            if ($('#dest_dep_text').is('*')) {
                canyouseeme = $('#dest_dep_text').attr('canyouseeme');
            }

            if ($('#dest_dep_text').is('*') && $('#dest_dep_text').val().length == 3) {
                $('.dest_dep_hotel#' + canyouseeme).val($('#dest_dep_text').val());
            }

            if ($('.dest_dep_hotel#' + canyouseeme).is('*') && ($('#dest_dep_text').val().length < 3 || $('.dest_dep_hotel#' + canyouseeme).val() == '')) {
                $('#dest_dep_text').val('');
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");
                $('#error-message-destination').show();
                $('#content-hotels .hotel-destination').addClass("error");
                $('#dest_dep_text').blur();

                var returnType = false;
            }

            if (!validateDate($("#hotel-checkin-date").val())) {
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");
                $('#error-message-dates').show();
                $('#content-hotels .hotel-checkin-date').addClass("error");
                returnType = false;
            }

            if (!validateDate($("#hotel-checkout-date").val())) {
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");
                $('#error-message-dates').show();
                $('#content-hotels .hotel-checkout-date').addClass("error");
                returnType = false;
            }

            if ($(".hotels-children #nb_child option:selected").val() != 0 && $(".hotels-rooms #nb_rooms option:selected").val() > 1) {
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");
                $('#error-message-nonadults').show();
                $('#content-hotels .hotels-rooms').addClass("error");
                returnType = false;
            }

            if (document.hotels_frm.nb_adult[document.hotels_frm.nb_adult.selectedIndex].value % document.hotels_frm.nb_rooms[document.hotels_frm.nb_rooms.selectedIndex].value) {
                if (!$(".error-messages.packages").hasClass("show"))
                    $('.error-messages.packages').addClass("show");

                if ($('#error-message-nonadults').is(":hidden")) {
                    $('#error-message-modulo').show();
                }

                $('#content-hotels .hotels-adults').addClass("error");
                returnType = false;
            }

            var nb_child = document.hotels_frm.nb_child[document.hotels_frm.nb_child.selectedIndex].value;
            for (i = 1; i <= nb_child; i++) {
                var champ;
                champ = eval('document.hotels_frm.non_adult' + i).value;
                if (champ == 0) {
                    if (!$(".error-messages.packages").hasClass("show"))
                        $('.error-messages.packages').addClass("show");

                    if ($('#error-message-nonadults').is(":hidden")) {
                        $('#error-message-nonadultage').show();
                    }

                    $('#content-hotels .hotels-children').addClass("error");
                    $("#content-hotels .form-group.childage-wrapper").addClass("error")
                    $('#promo-packages-childage' + i).parent().addClass("error")
                    returnType = false;
                }
            }

            if (returnType === true) {
                var checkinDate = $("#hotel-checkin-date").val();
                var checkoutDate = $("#hotel-checkout-date").val();
                $('#hotel-checkin-date').val(checkinDate.replace(/-/g, "/"));
                $('#hotel-checkout-date').val(checkoutDate.replace(/-/g, "/"));
            }
            $("input[name='alias']").val(desktopAlias);
            if (currentViewPort === "xs" && isMobileDevice() && isTouchDevice()) {
                $("input[name='alias']").val(mobileAlias);
                $("#search-box-form-hotels").attr("action", "//shopping.sunwing.ca/cgi-bin/mobile/results-hotel.cgi");
                $("input[name='isMobile']").val("true");
                $("input[name='nb_child_forf']").val($("#nb_child").val());
            }
            return returnType;
        }

        var parseDate = function (str) {
            var vDate = str.split("-");
            return new Date(vDate[0], vDate[1], vDate[2]);
        }

        var getDaysDifference = function (date1, date2) {
            return (parseDate(date2) - parseDate(date1)) / (1000 * 60 * 60 * 24);
        }

        var addDays = function (depDate, days) {
            var retDate = new Date(depDate);
            retDate.setDate(retDate.getDate() + parseInt(days));
            var rMonth = (retDate.getMonth() + 1) < 10 ? "0" + (retDate.getMonth() + 1) : (retDate.getMonth() + 1);
            var rDay = retDate.getDate() < 10 ? "0" + retDate.getDate() : retDate.getDate();
            return retDate.getFullYear() + "" + rMonth + "" + rDay;
        }

        window.flights_validateForm = function() {
            var returnType = true;
            var test_regex = /^[a-zA-Z\u00E0-\u00FC ]{3,3}$/;
            var test_gateway = $("#flights_Select1").val();
            test_gateway = test_gateway.substring(test_gateway.indexOf("(") + 1, test_gateway.indexOf(")"));
            if (!test_gateway.match(test_regex)) {
                if (!$(".error-messages.flights").hasClass("show"))
                    $('.error-messages.flights').addClass("show");
                $('#flights_error-message-gateway').show();
                $('#content-flights .departure-gateway').addClass("error");
                returnType = false;
            }
            var test_dest = $("#flights_Select2").val();
            test_dest = test_dest.substring(test_dest.indexOf("(") + 1, test_dest.indexOf(")"));
            if (!test_dest.match(test_regex)) {
                if (!$(".error-messages.flights").hasClass("show"))
                    $('.error-messages.flights').addClass("show");
                $('#flights_error-message-destination').show();
                $('#content-flights .arrival-gateway').addClass("error");
                returnType = false;
            }
            if (!validateDate($("#flights_date_dep").val())) {
                if (!$(".error-messages.flights").hasClass("show"))
                    $('.error-messages.flights').addClass("show");
                $('#flights_error-message-dates_dep').show();
                $('#content-flights .departure-date').addClass("error");
                returnType = false;
            }
            if ($("input[name='searchtype']:checked").val() === "RE") {
                if ((!validateDate($("#flights_date_ret").val())) && ($(".form-group.dtc.return-date").is(":visible"))) {
                    if (!$(".error-messages.flights").hasClass("show"))
                        $('.error-messages.flights').addClass("show");
                    $('#flights_error-message-dates_ret').show();
                    $('#content-flights .return-date').addClass("error");
                    returnType = false;
                }
            }


            //ParticularitÃ© DRV : si la personne dit vouloir des enfants, on l'oblige Ã  entrer l'Ã¢ge de chacun.

            var nb_child = document.flights_frm.nb_child[document.flights_frm.nb_child.selectedIndex].value;
            for (i = 1; i <= nb_child; i++) {
                var champ;
                champ = eval('document.flights_frm.non_adult' + i).value;
                if (champ === 0) {
                    if (!$(".error-messages.flights").hasClass("show"))
                        $('.error-messages.flights').addClass("show");
                    $('#flights_error-message-nonadultage').show();
                    $('#content-flights .flights-children').addClass("error");
                    $("#content-flights .form-group.childage-wrapper").addClass("error");
                    $('#flights_promo-flights-childage' + i).parent().addClass("error");
                    returnType = false;
                }
            }
            if (returnType === true) {
                var gatewayDep = $("#flights_Select1").val();
                var dest = $("#flights_Select2").val().trim().toUpperCase();
                var destDep = dest.substring(dest.indexOf("(") + 1, dest.indexOf(")"));
                gatewayDep = gatewayDep.substring(gatewayDep.indexOf("(") + 1, gatewayDep.indexOf(")"));
                //dest = dest.substring(dest.indexOf(",") + 1, dest.indexOf("(")).trim().toUpperCase();
                $("input[name='duration']").val(document.flights_frm.flights_duration.value);
                $("input[name='date_ret']").val("");
                if (((dest.indexOf("CANADA") !== -1) || (dest.indexOf("USA") !== -1)) && searchType === "RE") {
                    $("input[name='duration']").val("");
                    document.flights_frm.date_ret.value = document.flights_frm.flights_date_ret.value.replace(/-/g, "");
                    /*var diff = getDaysDifference($("#flights_date_dep").val(), $("#flights_date_ret").val());
                    if (0 < diff && diff < 5)
                        $("input[name='duration']").val("4");
                    if (4 < diff && diff < 11)
                        $("input[name='duration']").val("7");
                    if (diff > 10)
                        $("input[name='duration']").val("14");*/
                }
                $("input[name='gateway_dep']").val(gatewayDep);
                $("input[name='dest_dep']").val(destDep);
                document.flights_frm.date_dep.value = document.flights_frm.flights_date_dep.value.replace(/-/g, "");
            }
            $("input[name='alias']").val(desktopAlias);
            if (currentViewPort === "xs" && isMobileDevice() && isTouchDevice()) {
                if ($(".form-group.dtc.flights-days").is(":visible")) {
                    $("input[name='date_ret']").val(addDays(document.flights_frm.flights_date_dep.value,
                        document.flights_frm.flights_duration.value.replace(/r/g, "")));
                } else {
                    document.flights_frm.date_ret.value = document.flights_frm.flights_date_ret.value.replace(/-/g, "");
                }
                $("input[name='alias']").val(mobileAlias);
                $("input[name='isMobile']").val("true");
                $("#search-box-form-flights").attr("action", "//shopping.sunwing.ca/cgi-bin/mobile/results.cgi");
                $("input[name='nb_child_forf']").val($("#nb_child").val());
            }
            return returnType;
        }


        if (LPCObjExists) {
            //Start: Updated for removing old www.sunwing.ca cookies for Gateway and Language
            $.cookie('SunwingGateway', '', { expires: -1, path: '/' });
            $.cookie('SunwingLanguage', '', { expires: -1, path: '/' });
            //End: Updated for removing old www.sunwing.ca cookies
            if (($.cookie("SunwingGateway") !== null && $.cookie("SunwingGateway") !== undefined)) {
                InitDrops(document.frm, $.cookie("SunwingGateway"), "", "", "");
            } else {
                InitDrops(document.frm, "YYZ", "", "", "");
            }
            $("#lightbox-lpc").click(function () {
                openLPCLink();
            });
        }

        function openLPCLink() {
            try {
                var lang = $("#language").val();
                var months_en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var months_fr = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
                var dep_month = $("#lpc-dep-month").val();
                var dep_year = dep_month.substring(dep_month.length - 4, dep_month.length).trim();
                dep_month = dep_month.substring(0, dep_month.length - 4)
                if (lang === "fr")
                    dep_month = parseInt($.inArray(dep_month.trim(), months_fr)) + 1;
                else
                    dep_month = parseInt($.inArray(dep_month.trim(), months_en)) + 1;
                dep_month = ('0' + dep_month).slice(-2);
                var date_dep = dep_year + dep_month + "01";
                var gateway_dep = $("#lpc-departure-gateway").val();
                var dest_dep = $("#Select2").val().trim().replace(/-/g, '');
                //dest_dep = dest_dep.substring(dest_dep.indexOf("xxx") + 3);
                var no_hotel = $("#lpc-select-hotel").val().trim();
                var duration = $("#lpc-duration").val().trim();
                var star = $("#lpc-star-rating").val().trim();
                $("#lightbox-lpc").prop("href", "//book.sunwing.ca/cgi-bin/calendrier-lowest-price.cgi?gateway_dep=" + gateway_dep + "&dest_dep=" + dest_dep + "&no_hotel=" + no_hotel + "&date_dep=" + date_dep + "&duration=" + duration + "&star=" + star + "&searchtype=PA&code_ag=rds&alias=btd&language=" + lang);
                if (currentViewPort === "xs" && isMobileDevice() && isTouchDevice()) {
                    $("#lightbox-lpc").prop("href", "//book.sunwing.ca/cgi-bin/calendrier-lowest-price.cgi?gateway_dep=" + gateway_dep + "&dest_dep=" + dest_dep + "&no_hotel=" + no_hotel + "&date_dep=" + date_dep + "&duration=" + duration + "&star=" + star + "&searchtype=PA&code_ag=rds&isMobile=true&alias=btm&language=" + lang);
                }
            }
            catch (ex) {
                console.log("Error: " + ex);
            }
        }

        function openDeepLink(deepLink, id) {
            window.location.href = deepLink.substr(0, deepLink.indexOf("date_dep=") + 9) + $("#" + id + " option:selected").val() + deepLink.substr(deepLink.indexOf("date_dep=") + 17, deepLink.length);
        }

        function queryParamExists(param) {
            var url = window.location.href.toLowerCase();
            if (url.indexOf("?" + param.toLowerCase() + "=") !== -1)
                return true;
            else if (url.indexOf("&" + param.toLowerCase() + "=") !== -1)
                return true;
            else if (url.indexOf(param.toLowerCase()) !== -1)
                return true;
            return false;
        };

        function urlParam(name) {
            var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
            return results[1] || 0;
        }
    });
};