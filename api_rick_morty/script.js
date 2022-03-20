var responsePart = 0;

axios.get("https://rickandmortyapi.com/api/episode").then(response => updateNav(response.data));

function updateNav(data) {

    $("nav a").remove();
    $("nav button").remove();
    for (let i = 0; i < data.results.length-responsePart; i++) {

        if (i == 10) break;
        $("#nav__episodes").append($("<a>").text("Episódio "+ data.results[i+responsePart].id)
        .click(() => showEpisode(data.results[i+responsePart].url)));
    }

    if (data.info.next != null || responsePart == 0) {
        $("#nav__buttons").append($("<button>").text("Proximo").addClass("proximo").click( () => {
            if(responsePart == 10) {
                responsePart = 0;
                axios.get(data.info.next).then(response => updateNav(response.data));
            } else {
                responsePart = 10;
                updateNav(data);
            }
        }));
    }

    if (data.info.prev != null || responsePart == 10) {
        $("#nav__buttons").append($("<button>").text("Anterior").addClass("anterior").click(() => {
            if (responsePart == 0) {
                responsePart = 10;
                axios.get(data.info.prev).then(response => updateNav(response.data));
            } else {
                responsePart = 0;
                updateNav(data)
            }
        }));
    }
}

function showEpisode(epi) {
    axios.get(epi)
    .then(response => {
        // Resets the main container
        $("#main__container").empty();
        // Applying episode info on the main container
        $("#main__container").append($("<h2>").text("Episódio "+response.data.id+" • "+response.data.name));
        $("#main__container").append($("<p>").text(response.data.episode+" • "+response.data.air_date));
        $("#main__container").append("<ul>");
        for (let i = 0; i < response.data.characters.length; i++) {

            axios.get(response.data.characters[i]).then(character => {
                $("#main__container ul").append($("<li>")
                .append($("<img>").attr("src",character.data.image))
                .append($("<p>").text(character.data.name))
                .append($("<p>").text(character.data.species+" | "+character.data.status))
                .click(() => showCharacter(response.data.characters[i])));
            }).then(() => $("#main__container li").slideDown(600,"linear"));
        }
    });
}

function showCharacter(characterURL) {
    axios.get(characterURL).then(character => {
        // Resets the main container
        $("#main__container").empty();
        // Applying character info on the main container
        $("#main__container").append($("<div>").addClass("flex"));
        $(".flex").append($("<img>").attr("src",character.data.image));
        $(".flex").append($("<div>").css("margin-left","25px")
        .append($("<h2>").text(character.data.name))
        .append($("<p>").text(character.data.species+" | "+character.data.gender+" | "+character.data.status))
        .append($("<p>").text("Origin: "+character.data.origin.name).addClass("location")
        .click(() => {
                if (character.data.origin.name != "unknown") {
                    showLocation(character.data.origin.url)
                }
            }))
        );
        $("#main__container").append("<ul>");
        for (let i = 0; i < character.data.episode.length; i++) {
            axios.get(character.data.episode[i]).then(episode => {
                $("#main__container ul").append($("<li>").css("width","280px")
                .append($("<h3>").text(episode.data.name))
                .append($("<p>").text(episode.data.episode))
                .click(() => {
                    if (character.data.episode.length > 1) {
                        showEpisode(character.data.episode[i]);
                    } else {
                        showEpisode(character.data.episode);
                    }
                }));
            }).then(() => $("#main__container li").slideDown("slow","linear"));
        }
    });
}

function showLocation(locationURL) {
    axios.get(locationURL)
    .then(location => {

        $("#main__container").empty();

        $("#main__container").append($("<h2>").text(location.data.name));
        $("#main__container").append($("<p>").text(location.data.type+" • "+location.data.dimension));
        $("#main__container").append($("<h4>").text("Moradores"));
        $("#main__container").append("<ul>");
        for (let i = 0; i < location.data.residents.length; i++) {
            axios.get(location.data.residents[i]).then(resident => {
                $("#main__container ul").append($("<li>")
                .append($("<img>").attr("src",resident.data.image))
                .append($("<p>").text(resident.data.name))
                .append($("<p>").text(resident.data.species+" | "+resident.data.status))
                .click(() => showCharacter(resident.data.url))
                );
            }).then(() => $("#main__container li").slideDown(600,"linear"));
        }
    });
}