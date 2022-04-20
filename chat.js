const socket = io();

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

function autoscroll() {
    const $newMessage = $("#messages div:last-child");

    const newMessageHeight = $newMessage.outerHeight(true);
    const containerHeight =
        $("#messages").prop("scrollHeight") - $("#messages").innerHeight();

    const scrollOffset = containerHeight - $("#messages").scrollTop();

    if (scrollOffset <= newMessageHeight) {
        $("#messages").scrollTop(containerHeight);
    }
}

socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render($("#message-template").html(), {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("HH:m "),
    });
    $("#messages").append(html);
    autoscroll();
});

socket.on("messageLocation", (message) => {
    const html = Mustache.render($("#messageLocation-template").html(), {
        username: message.username,
        message: message.url,
        createdAt: moment(message.createdAt).format("HH:m "),
    });
    $("#messages").append(html);
    autoscroll();
});

socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render($("#sidebar-template").html(), {
        room,
        users,
    });
    $("#sidebar").html(html);
});

function sendMessage(event) {
    event.preventDefault();

    $("#message").prop("disabled", true);
    $("#submitButton").prop("disabled", true);

    const message = $("#message").val();

    socket.emit("sendMessage", message, (msg) => {
        $("#message").prop("disabled", false);
        $("#submitButton").prop("disabled", false);

        $("#message").val("");
        $("#message").focus();
    });
}

$("#send-location").on("click", (event) => {
    $("#send-location").prop("disabled", true);
    if (!navigator.geolocation) {
        $("#send-location").prop("disabled", false);
        return alert("Geolocalização não é compatível com o seu navegador");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            "sendLocation",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            () => {
                $("#send-location").prop("disabled", false);
            }
        );
    });
});

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});
