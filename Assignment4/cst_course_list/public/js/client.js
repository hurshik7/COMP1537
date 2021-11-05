

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
ajaxGET("/data/firstyearcourses", function(data) {
    document.getElementById("firstyearcourses").innerHTML = data;
});


document.querySelector("#click4Secondyearcourses").addEventListener("click", function(e) {
    e.preventDefault();

    ajaxGET("/data/secondyearcourses", function(data) {
        if (isLevel2Loaded) {
            console.log("Second year courses have already loaded!");
            document.getElementById("click_again_error").innerHTML = "Level - 2 courses have already loaded!";
        }
        else {
            console.log(data);
            document.getElementById("secondyearcourses").innerHTML = data;
            isLevel2Loaded = true;
        }
    });

}, false);
