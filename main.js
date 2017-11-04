"use strict";

// Yes, this is a "global." But it is a single entry point for all of the code in the module,
// and in its role as the overall controller code of the page, this is one of the acceptable
// uses for a [single!] top-level name.
//
// Module managers address even this issue, for web apps of sufficient complexity.
(() => {
    window.ArtistSearchController = {
        init: () => {
            let searchButton = $("#artist-search-button");
            let searchTerm = $("#artist-search-term");
            let result = $("#albums-show-container");
            let artistArray = [];
            let apiKey = "6e34097f13bbe5241616345f796f7939";

            $(result).hide();

            $(searchTerm).keyup(function(event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    $(searchButton).click();
                }
            });

            searchButton.click(() =>
                $.getJSON("http://api.musixmatch.com/ws/1.1/chart.artists.get", {
                    apikey: apiKey,
                    country: getCountryCode(searchTerm.val()),
                    page_size: 10,
                    page: 1,
                    format: "json"
                }, function(data){

                    $('html,body').animate({
                        scrollTop: $("#result").offset().top
                    });

                    $(result).show().html("");
                    artistArray = data.message.body.artist_list;

                    let showTitle = `
                        <h1 class="text-center">Top 10 Artists</h1>
                    `;

                    $(result).append(showTitle);

                    for (let i = 0; i < artistArray.length; i++){
                        let name = artistArray[i].artist.artist_name;
                        let artistID = artistArray[i].artist.artist_id;

                        let show = `
                            <div class="artist-data well">
                                <div class="row">
                                    <div class ="col-md-12">
                                        <h3> ${i + 1}. ${name} </h3>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="embed-responsive embed-responsive-16by9">
                                        <iframe id="ytplayer" type="text/html" width="560" height="315"
                                        src="https://www.youtube.com/embed?listType=search&list=${name}"
                                        frameborder="0" allowfullscreen></iframe>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h4>Latest Albums</h4>
                                        <div class="row" id="${artistID}"></div>
                                    </div>

                            </div>
                        `;

                        $(result).append(show);

                        $.getJSON("http://api.musixmatch.com/ws/1.1/artist.albums.get", {
                            apikey: apiKey,
                            artist_id: artistID,
                            s_release_date: "desc",
                            g_album_name: 1,
                            page_size: 3,
                            page: 1,
                            format: "json"

                        }, function(data){
                            let albumResult = $("#" + artistID);
                            let albumArray = data.message.body.album_list;

                            for (let i = 0; i < albumArray.length; i++){

                                let albumName = albumArray[i].album.album_name;
                                let albumID = albumArray[i].album.album_id;



                                // console.log(name + ": " + albumName);
                                let showAlbum = `
                                    <div id="${albumID}" class="col-md-4 text-center">

                                    </div>
                                `;

                                $(albumResult).append(showAlbum);

                                $.getJSON("http://api.musixmatch.com/ws/1.1/album.get", {
                                    apikey: apiKey,
                                    album_id: albumID,
                                    format: "json"
                                }, function(data){
                                    // let albumCoverArt = data.message.body.album.album_coverart_100x100;

                                    let albumPhotoResult = $("#" + albumID);
                                    let albumRating = data.message.body.album.album_rating;
                                    let starRating = stars(albumRating);

                                    let showAlbumPhoto = `
                                        <i class="fa fa-music" aria-hidden="true"></i>
                                        <p>Rating: ${starRating}</p>
                                        <h6> ${albumName} </h6>
                                    `;

                                    $(albumPhotoResult).append(showAlbumPhoto);

                                });
                            }
                        });

                    }
                })

            );

            searchTerm.bind("input", () => searchButton.prop("disabled", !searchTerm.val()));

            let stars = function(rating){
                rating = Math.round(rating / 20);
                switch (rating){
                case 5:
                    return "★★★★★";
                case 4:
                    return "★★★★";
                case 3:
                    return "★★★";
                case 2:
                    return "★★";
                case 1:
                    return "★";
                case 0:
                    return "";
                case undefined:
                    return "n/a";
                }
            };

            let isoCountries = {
                'Afghanistan': 'AF',
                'Aland Islands': 'AX',
                'Albania': 'AL',
                'Algeria': 'DZ',
                'American Samoa': 'AS',
                'Andorra': 'AD',
                'Angola': 'AO',
                'Anguilla': 'AI',
                'Antarctica': 'AQ',
                'Antigua And Barbuda': 'AG',
                'Argentina': 'AR',
                'Armenia': 'AM',
                'Aruba': 'AW',
                'Australia': 'AU',
                'Austria': 'AT',
                'Azerbaijan': 'AZ',
                'Bahamas': 'BS',
                'Bahrain': 'BH',
                'Bangladesh': 'BD',
                'Barbados': 'BB',
                'Belarus': 'BY',
                'Belgium': 'BE',
                'Belize': 'BZ',
                'Benin': 'BJ',
                'Bermuda': 'BM',
                'Bhutan': 'BT',
                'Bolivia': 'BO',
                'Bosnia And Herzegovina': 'BA',
                'Botswana': 'BW',
                'Bouvet Island': 'BV',
                'Brazil': 'BR',
                'British Indian Ocean Territory': 'IO',
                'Brunei Darussalam': 'BN',
                'Bulgaria': 'BG',
                'Burkina Faso': 'BF',
                'Burundi': 'BI',
                'Cambodia': 'KH',
                'Cameroon': 'CM',
                'Canada': 'CA',
                'Cape Verde': 'CV',
                'Cayman Islands': 'KY',
                'Central African Republic': 'CF',
                'Chad': 'TD',
                'Chile': 'CL',
                'China': 'CN',
                'Christmas Island': 'CX',
                'Cocos (Keeling) Islands': 'CC',
                'Colombia': 'CO',
                'Comoros': 'KM',
                'Congo': 'CG',
                'Congo, Democratic Republic': 'CD',
                'Cook Islands': 'CK',
                'Costa Rica': 'CR',
                'Cote D\'Ivoire': 'CI',
                'Croatia': 'HR',
                'Cuba': 'CU',
                'Cyprus': 'CY',
                'Czech Republic': 'CZ',
                'Denmark': 'DK',
                'Djibouti': 'DJ',
                'Dominica': 'DM',
                'Dominican Republic': 'DO',
                'Ecuador': 'EC',
                'Egypt': 'EG',
                'El Salvador': 'SV',
                'Equatorial Guinea': 'GQ',
                'Eritrea': 'ER',
                'Estonia': 'EE',
                'Ethiopia': 'ET',
                'Falkland Islands': 'FK',
                'Faroe Islands': 'FO',
                'Fiji': 'FJ',
                'Finland': 'FI',
                'France': 'FR',
                'French Guiana': 'GF',
                'French Polynesia': 'PF',
                'French Southern Territories': 'TF',
                'Gabon': 'GA',
                'Gambia': 'GM',
                'Georgia': 'GE',
                'Germany': 'DE',
                'Ghana': 'GH',
                'Gibraltar': 'GI',
                'Greece': 'GR',
                'Greenland': 'GL',
                'Grenada': 'GD',
                'Guadeloupe': 'GP',
                'Guam': 'GU',
                'Guatemala': 'GT',
                'Guernsey': 'GG',
                'Guinea': 'GN',
                'Guinea-Bissau': 'GW',
                'Guyana': 'GY',
                'Haiti': 'HT',
                'Heard Island & Mcdonald Islands': 'HM',
                'Holy See (Vatican City State)': 'VA',
                'Honduras': 'HN',
                'Hong Kong': 'HK',
                'Hungary': 'HU',
                'Iceland': 'IS',
                'India': 'IN',
                'Indonesia': 'ID',
                'Iran, Islamic Republic Of': 'IR',
                'Iraq': 'IQ',
                'Ireland': 'IE',
                'Isle Of Man': 'IM',
                'Israel': 'IL',
                'Italy': 'IT',
                'Jamaica': 'JM',
                'Japan': 'JP',
                'Jersey': 'JE',
                'Jordan': 'JO',
                'Kazakhstan': 'KZ',
                'Kenya': 'KE',
                'Kiribati': 'KI',
                'Korea': 'KR',
                'Kuwait': 'KW',
                'Kyrgyzstan': 'KG',
                'Lao People\'s Democratic Republic': 'LA',
                'Latvia': 'LV',
                'Lebanon': 'LB',
                'Lesotho': 'LS',
                'Liberia': 'LR',
                'Libyan Arab Jamahiriya': 'LY',
                'Liechtenstein': 'LI',
                'Lithuania': 'LT',
                'Luxembourg': 'LU',
                'Macao': 'MO',
                'Macedonia': 'MK',
                'Madagascar': 'MG',
                'Malawi': 'MW',
                'Malaysia': 'MY',
                'Maldives': 'MV',
                'Mali': 'ML',
                'Malta': 'MT',
                'Marshall Islands': 'MH',
                'Martinique': 'MQ',
                'Mauritania': 'MR',
                'Mauritius': 'MU',
                'Mayotte': 'YT',
                'Mexico': 'MX',
                'Micronesia, Federated States Of': 'FM',
                'Moldova': 'MD',
                'Monaco': 'MC',
                'Mongolia': 'MN',
                'Montenegro': 'ME',
                'Montserrat': 'MS',
                'Morocco': 'MA',
                'Mozambique': 'MZ',
                'Myanmar': 'MM',
                'Namibia': 'NA',
                'Nauru': 'NR',
                'Nepal': 'NP',
                'Netherlands': 'NL',
                'Netherlands Antilles': 'AN',
                'New Caledonia': 'NC',
                'New Zealand': 'NZ',
                'Nicaragua': 'NI',
                'Niger': 'NE',
                'Nigeria': 'NG',
                'Niue': 'NU',
                'Norfolk Island': 'NF',
                'Northern Mariana Islands': 'MP',
                'Norway': 'NO',
                'Oman': 'OM',
                'Pakistan': 'PK',
                'Palau': 'PW',
                'Palestinian Territory, Occupied': 'PS',
                'Panama': 'PA',
                'Papua New Guinea': 'PG',
                'Paraguay': 'PY',
                'Peru': 'PE',
                'Philippines': 'PH',
                'Pitcairn': 'PN',
                'Poland': 'PL',
                'Portugal': 'PT',
                'Puerto Rico': 'PR',
                'Qatar': 'QA',
                'Reunion': 'RE',
                'Romania': 'RO',
                'Russian Federation': 'RU',
                'Rwanda': 'RW',
                'Saint Barthelemy': 'BL',
                'Saint Helena': 'SH',
                'Saint Kitts And Nevis': 'KN',
                'Saint Lucia': 'LC',
                'Saint Martin': 'MF',
                'Saint Pierre And Miquelon': 'PM',
                'Saint Vincent And Grenadines': 'VC',
                'Samoa': 'WS',
                'San Marino': 'SM',
                'Sao Tome And Principe': 'ST',
                'Saudi Arabia': 'SA',
                'Senegal': 'SN',
                'Serbia': 'RS',
                'Seychelles': 'SC',
                'Sierra Leone': 'SL',
                'Singapore': 'SG',
                'Slovakia': 'SK',
                'Slovenia': 'SI',
                'Solomon Islands': 'SB',
                'Somalia': 'SO',
                'South Africa': 'ZA',
                'South Georgia And Sandwich Isl.': 'GS',
                'Spain': 'ES',
                'Sri Lanka': 'LK',
                'Sudan': 'SD',
                'Suriname': 'SR',
                'Svalbard And Jan Mayen': 'SJ',
                'Swaziland': 'SZ',
                'Sweden': 'SE',
                'Switzerland': 'CH',
                'Syrian Arab Republic': 'SY',
                'Taiwan': 'TW',
                'Tajikistan': 'TJ',
                'Tanzania': 'TZ',
                'Thailand': 'TH',
                'Timor-Leste': 'TL',
                'Togo': 'TG',
                'Tokelau': 'TK',
                'Tonga': 'TO',
                'Trinidad And Tobago': 'TT',
                'Tunisia': 'TN',
                'Turkey': 'TR',
                'Turkmenistan': 'TM',
                'Turks And Caicos Islands': 'TC',
                'Tuvalu': 'TV',
                'Uganda': 'UG',
                'Ukraine': 'UA',
                'United Arab Emirates': 'AE',
                'United Kingdom': 'GB',
                'United States': 'US',
                'United States Outlying Islands': 'UM',
                'Uruguay': 'UY',
                'Uzbekistan': 'UZ',
                'Vanuatu': 'VU',
                'Venezuela': 'VE',
                'Vietnam': 'VN',
                'Virgin Islands, British': 'VG',
                'Virgin Islands, U.S.': 'VI',
                'Wallis And Futuna': 'WF',
                'Western Sahara': 'EH',
                'Yemen': 'YE',
                'Zambia': 'ZM',
                'Zimbabwe': 'ZW'
            };

            let getCountryCode = function(country){
                country = country.charAt(0).toUpperCase() + country.slice(1);
                if (isoCountries.hasOwnProperty(country)) {
                    return isoCountries[country];
                } else {
                    return country;
                }
            };

        }
    };



})();
