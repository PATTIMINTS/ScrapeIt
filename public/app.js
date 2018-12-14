// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "<button data-id='" + data._id + "' id='saveArticle'>Save Article</button>");
    }
});
$(document).on("click", ".scrape", function () {
    // $(".load").html("<img id='wait' src='./img/loading.gif'>");
    $.get("/scrape", function (req, res) {
        console.log(res);
    }).then(function (data) {
        window.location.href = "/";
    });
});


// /Click to save article
$(document).on("click", ".save", function (e) {
    $(this).parent().remove();
    var articleId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: '/save/' + articleId,

    }).done(function (data) {
        $(".article").filter("[data-id='" + articleId + "']").remove();
    });
});

//Click to view saved article
$(document).on("click", ".topo", function () {
    $.get("/saved", function (req, res) {
        console.log(res);
    }).then(function (data) {
        window.location.href = "/saved";
    });
});

//Click to delete article after being saved
$(document).on("click", ".blue", function () {
    $(this).parent().remove();
    let articleId = $(this).attr("data-id");

    $.ajax({
        url: '/unsave/' + articleId,
        type: "POST"
    }).done(function (data) {
        $(".article").filter("[data-id='" + articleId + "']").remove();
    });
})
// click event to open note modal and populate with notes
$(document).on('click', '.greenNote', function (e) {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/getNotes/" + thisId
    }).then(function (data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<h3 id='notestitle'></h3>");
        $("#notes").append("<p id='notesbody'></p>");
        $("#notes").append("<div class='form-group'><label for='title'>Title: </label><input id='titleinput' class='form-control' name='title'></div>");
        $("#notes").append("<div class='form-group'><label for='body'>Note: </label><input id='bodyinput' class='form-control' name='body'></div>");
        $("#notes").append("<button class='btn btn-default' data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
            $("#notestitle").text(data.note.title);
            $("#notesbody").text(data.note.body);
        }
    });
    $('#noteModal').modal();
});
//click event to create a note
$(document).on('click', '#savenote', function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/createNote/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function (data) {
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
    $('#noteModal').modal('hide');
});
