describe("Musixmatch search example", () => {
    beforeEach(() => {
        fixture.setBase("test");
        fixture.load("search.fixture.html");
        window.ArtistSearchController.init();
    });

    afterEach(() => {
        fixture.cleanup();
    });

    it("should start with an empty search field", () => {
        expect($("#artist-search-term").val()).toBe("");
    });

    it("should start with a disabled search button", () => {
        expect($("#artist-search-button").prop("disabled")).toBe(true);
    });

    describe("search button", () => {
        var searchTerm;
        var searchButton;

        beforeEach(() => {
            searchTerm = $("#artist-search-term");
            searchButton = $("#artist-search-button");
        });

        it("should be enabled when the search field is not blank", () => {
            // Programmatic changes to elements do not trigger events on their own, so in unit tests
            // we need to trigger those programmatically as well.
            searchTerm.val("i can haz unit tests").trigger("input");
            expect(searchButton.prop("disabled")).toBe(false);
        });

        it("should be disabled when the search field is blank", () => {
            searchTerm.val("").trigger("input");
            expect(searchButton.prop("disabled")).toBe(true);
        });
    });

    describe("API calls", () => {
        var request;

        beforeEach(() => {
            jasmine.Ajax.install();

            $("#artist-search-term").val("United States");
            $("#artist-search-button").click();

            request = jasmine.Ajax.requests.mostRecent();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it("should trigger a search when the search button is clicked", () => {
            expect(request.url).toBe("http://api.musixmatch.com/ws/1.1/chart.artists.get?" +
            "apikey=6e34097f13bbe5241616345f796f7939&country=US&page_size=10&page=1&format=json");
        });

        it("should populate the image container when search results arrive", () => {
            expect($("#albums-show-container").children().length).toBe(0);

            // To manage size, we supply a mock response that contains _only_ what the app will need. This does mean
            // that we need to revise the mock response if our app starts using more (or different) data.
            request.respondWith({
                status: 200,
                responseText: JSON.stringify({

                    message: {
                        body: {
                            artist_list: [{
                                artist: {
                                    artist_id: "13916103"
                                }
                            }]
                        }
                    }
                })
            });

            request = jasmine.Ajax.requests.mostRecent();

            expect(request.url).toBe("http://api.musixmatch.com/ws/1.1/artist.albums.get?" +
            "apikey=6e34097f13bbe5241616345f796f7939&artist_id=13916103&s_release_date=desc&" +
            "g_album_name=1&page_size=3&page=1&format=json");

            request.respondWith({
                status: 200,
                responseText: JSON.stringify({

                    message: {
                        body: {
                            album_list: [{
                                album: {
                                    album_id: "11339785"
                                }
                            }]
                        }
                    }

                })
            });

            request = jasmine.Ajax.requests.mostRecent();

            expect(request.url).toBe("http://api.musixmatch.com/ws/1.1/album.get?" +
            "apikey=6e34097f13bbe5241616345f796f7939&album_id=11339785&format=json");

            request.respondWith({
                status: 200,
                responseText: JSON.stringify({

                    message: {
                        body: {
                            album: {
                                album_rating: 100
                            }
                        }
                    }

                })
            });

            request = jasmine.Ajax.requests.mostRecent();

            expect(request.url).toBe("http://api.musixmatch.com/ws/1.1/album.get?" +
            "apikey=6e34097f13bbe5241616345f796f7939&album_id=11339785&format=json");

            expect($("#albums-show-container").children().length).toBe(2);
            // We can go even further by examining the resulting element(s) and expecting their content to match the
            // mock response, but we will leave this as "further work" for now.
        });
    });
});
