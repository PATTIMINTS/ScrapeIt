// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "<button data-id='" + data._id + "' id='saveArticle'>Save Article</button>");
    }
  });
  $(document).on("click", ".scrape", function(){
    // $(".load").html("<img id='wait' src='./img/loading.gif'>");
    $.get( "/scrape", function (req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.href = "/";
    });
});

// $(document).on("click", "#saveArticle", function() {
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");
  
//     // Now make an ajax call for the Article
//     $.ajax({
//       method: "GET",
//       url: "/articles" + thisId
//     })
//       // With that done, add the note information to the page
//       .then(function(data) {
//         console.log(data);
//         // The title of the article
//         $("#notes").append("<h2>" + data.title + "</h2>");
        
//         // A button to submit a new note, with the id of the article saved to it
//         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
//       })
//     })

// /Click to save article
$(document).on("click", ".save", function(e){
    $(this).parent().remove();
    var articleId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: '/save/' + articleId,
        
    }).done(function(data) {
        $(".article").filter("[data-id='" + articleId + "']").remove();
    });
});

//Click to view saved article
$(document).on("click", ".topo", function() {
    $.get( "/saved", function (req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.href = "/saved";
    });
  });
  
