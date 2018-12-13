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
  
// $(document).on("click", "#", function() {
//   // Empty the notes from the note section
//   $("#articles").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log(data);  
//   // The title of the article
//   $("#noteModal").append("<h2>" + data.title + "</h2>");
//   // An input to enter a new title
//   $("#noteModal").append("<input id='titleinput' name='title' >");
//   // A textarea to add a new note body
//   $("#noteModal").append("<textarea id='bodyinput' name='body'></textarea>");
//   // A button to submit a new note, with the id of the article saved to it
//   $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//   // If there's a note in the article
//   if (data.note) {
//     // Place the title of the note in the title input
//     $("#titleinput").val(data.note.title);
//     // Place the body of the note in the body textarea
//     $("#bodyinput").val(data.note.body);
//   }
// });
// });