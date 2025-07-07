

// ADMIN SECTION
function showAdminLogin() {
    document.getElementById("adminModal").style.display = "block";
    document.getElementById("adminPassword").focus();
}
function hideAdminLogin() {
    document.getElementById("adminModal").style.display = "none";
}
function confirmAdminLogin() {
    const input = document.getElementById("adminPassword").value;
    if (input === "")//if (input === "admin123") 
    {
        sessionStorage.setItem("admin", "true");
        hideAdminLogin();
        applyAdminMode();
    } else {
        alert("Falsches Passwort.");
    }
}
function logoutAdmin() {
    sessionStorage.removeItem("admin");
    applyAdminMode();
}
function applyAdminMode() {
    document.querySelectorAll(".admin-edit, .admin-delete").forEach(el => {
        el.style.display = sessionStorage.getItem("admin") === "true" ? "inline-block" : "none";
    });
    const addBtn = document.getElementById('addCardBtn');
    if (addBtn) {
        addBtn.style.display = sessionStorage.getItem('admin') === 'true' ? 'inline-block' : 'none';
    }
}
window.addEventListener("DOMContentLoaded", () => {
    if (performance.navigation?.type === 1 || performance.getEntriesByType("navigation")[0]?.type === "reload") {
        sessionStorage.removeItem("admin");
    }
    applyAdminMode();
    addFloatingIcons();
    document.addEventListener("keydown", function(e) {
        if (e.shiftKey && e.ctrlKey) {
            if (sessionStorage.getItem("admin") === "true") {
                logoutAdmin();
            } else {
                showAdminLogin();
            }
        }
    });

    document.addEventListener("keydown", function(e) {
        if (document.getElementById("adminModal")?.style.display === "block" && e.key === "Enter") {
            confirmAdminLogin();
        }
    });
});

function editField(id) {
    const element = document.getElementById(id);
    const newText = prompt("Neuer Text:", element.innerText);
    if (newText !== null) {
        element.innerText = newText;
        const textId = element.getAttribute("data-textId");
        console.log("editField: textid = "+textId);
        if (textId!=null && textId!="0")
        {
            textParts = textId.split("_");
            if (textParts.length < 2)
                updateText(textId,newText);
            else
                updateExhibitColumn(textParts[0],textParts[1],newText);
        }
    }
}

function sendHTTPRequest(type,phpfile,body)
{
    const xhr = new XMLHttpRequest();
    xhr.open(type, phpfile);
    xhr.setRequestHeader("Content-Type", "application/text; charset=UTF-8");
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status < 400) {
        //console.log(JSON.parse(xhr.responseText));
        console.log((xhr.responseText));
        //alert(xhr.responseText);
    } else {
        console.log(`Error: ${xhr.status}`);
    }
    };
    xhr.send(body);
}

//update text via php
function updateText(_id,_text) 
{
    // create an HTTP GET request to the server
    //var request = new XMLHttpRequest();
    //const params = new URLSearchParams(window.location.search);
    //const lang = params.get("lang");

    //request.open('POST', 'getdeviceinfo.php?id=' +id+'&text=' + text, true);
    //request.send();
    sendHTTPRequest("POST","getdeviceinfo.php",JSON.stringify({ id: _id, text: _text, lcid: getLCID() }));
}

// delete exhibit entry in database
function deleteExhibitInDatabase(exhibitId) 
{
    sendHTTPRequest("DELETE","getdeviceinfo.php",JSON.stringify({ id: exhibitId }));
}

function createExhibitInDatabase(json)
{
    sendHTTPRequest("PUT","getdeviceinfo.php",json);
}

function updateExhibitColumn(_id,_column,_text)
{
    sendHTTPRequest("PATCH","getdeviceinfo.php"
        ,JSON.stringify({ id: _id, column:_column, text:_text }));
}