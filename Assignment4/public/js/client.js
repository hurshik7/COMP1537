

console.log("Client script loaded.");
let isLevel2Loaded = false;

function ajaxGET(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);
        }
    };
    xhr.open("GET", path);
    xhr.send();
}

//////////////////////////////////
// YOU CAN CHANGE THE PATH, BUT
// YOU MUST CHANGE IT IN INDEX.JS
//////////////////////////////////
ajaxGET("/data/newsfeed", function(data) {
    document.getElementById("newsfeed").innerHTML = data;
});


document.querySelector("#click4NewsFeed").addEventListener("click", function(e) {
    e.preventDefault();

    ajaxGET("/data/newsfeed2", function(data) {
        if (isLevel2Loaded) {
            console.log("Second year courses have already loaded!");
            document.getElementById("click_again_error").innerHTML = "Level - 2 courses have already loaded!";
        }
        else {
            console.log(data);
            document.getElementById("newsfeed2").innerHTML = data;
            isLevel2Loaded = true;
        }
    });

}, false);
