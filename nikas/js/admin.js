function ajax(req) {
    var r = new XMLHttpRequest();
    r.open(req.method, req.url, true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) {
            if (req.failure) {
                req.failure();
            }
            return;
        }
        req.success(r.responseText);
    };
    r.send(req.data);
}

function fade(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = "none";
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}

function moderate(com_id, hash, action, nikas_host_script) {
    ajax({
        method: "POST",
        url: nikas_host_script + "/id/" + com_id + "/" + action + "/" + hash,
        success: function () {
            fade(document.getElementById("nikas-" + com_id));
        },
    });
}

function edit(
    com_id,
    hash,
    author,
    email,
    website,
    comment,
    nikas_host_script
) {
    ajax({
        method: "POST",
        url: nikas_host_script + "/id/" + com_id + "/edit/" + hash,
        data: JSON.stringify({
            text: comment,
            author: author,
            email: email,
            website: website,
        }),
        success: function (ret) {
            console.log("edit successed: ", ret); // TODO display some pretty stuff & update msg
        },
        error: function (ret) {
            console.log("Error: ", ret); // TODO flash msg/notif
        },
    });
}

function validate_com(com_id, hash, nikas_host_script) {
    moderate(com_id, hash, "activate", nikas_host_script);
}

function delete_com(com_id, hash, nikas_host_script) {
    moderate(com_id, hash, "delete", nikas_host_script);
}

function unset_editable(elt_id) {
    var elt = document.getElementById(elt_id);
    if (elt) {
        elt.contentEditable = false;
        elt.classList.remove("editable");
    }
}

function set_editable(elt_id) {
    var elt = document.getElementById(elt_id);
    if (elt) {
        elt.contentEditable = true;
        elt.classList.add("editable");
    }
}

function start_edit(com_id) {
    var editable_elements = [
        "nikas-author-" + com_id,
        "nikas-email-" + com_id,
        "nikas-website-" + com_id,
        "nikas-text-" + com_id,
    ];
    for (var idx = 0; idx <= editable_elements.length; idx++) {
        set_editable(editable_elements[idx]);
    }
    document.getElementById("edit-btn-" + com_id).classList.toggle("hidden");
    document
        .getElementById("stop-edit-btn-" + com_id)
        .classList.toggle("hidden");
    document
        .getElementById("send-edit-btn-" + com_id)
        .classList.toggle("hidden");
}

function stop_edit(com_id) {
    var editable_elements = [
        "nikas-author-" + com_id,
        "nikas-email-" + com_id,
        "nikas-website-" + com_id,
        "nikas-text-" + com_id,
    ];
    for (var idx = 0; idx <= editable_elements.length; idx++) {
        unset_editable(editable_elements[idx]);
    }
    document.getElementById("edit-btn-" + com_id).classList.toggle("hidden");
    document
        .getElementById("stop-edit-btn-" + com_id)
        .classList.toggle("hidden");
    document
        .getElementById("send-edit-btn-" + com_id)
        .classList.toggle("hidden");
}

function send_edit(com_id, hash, nikas_host_script) {
    var author = document.getElementById("nikas-author-" + com_id).textContent;
    var email = document.getElementById("nikas-email-" + com_id).textContent;
    var website = document.getElementById("nikas-website-" + com_id)
        .textContent;
    var comment = document.getElementById("nikas-text-" + com_id).textContent;
    edit(com_id, hash, author, email, website, comment, nikas_host_script);
    stop_edit(com_id);
}
