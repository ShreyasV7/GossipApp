(function() {
    const app = document.querySelector(".app");
    const socket = io();

    let name;
    app.querySelector(".join-screen #join-user").addEventListener("click", function()  {
        let username = app.querySelector(".join-screen #username").value;

        if (username.length == 0){return; }

        socket.emit("newuser", username);
        name = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let data = app.querySelector(".chat-screen #message-input").value;

        if (data.length == 0){return;}

        renderData("my", {
            username: name,
            text: data
                                                             
        });

        socket.emit("chat", {
            username: name,
            text: data
        });

        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        socket.emit("exituser",name)  ;
        window.location.href = window.location.href;
    })

    socket.on("update",function(update){
        renderMessage("update",update) ;
    })

    
    socket.on("chat",function(message){
        renderMessage("other",message) ;
    })

    function renderData(type, data) {
        let dataContainer = app.querySelector(".chat-screen .messages");

        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "messsage my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${data.text}</div>
                </div>
                `;
            dataContainer.appendChild(el);
        }
        else if (type == "other") {

            let el = document.createElement("div");     
            el.setAttribute("class", "messsage other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${data.username}</div>
                    <div class="text">${data.text}</div>
                </div>
                `; 
            dataContainer.appendChild(el);
        }
        else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerHTML = data
            dataContainer.appendChild(el);
        }

        // scrolls chat till end
        dataContainer.scrollTop = dataContainer.scrollHeight - dataContainer.clientHeight;
    }



})(); 