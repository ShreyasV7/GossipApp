(function(){

	const socket = io();
	const App = document.querySelector(".app");
	let user_name;


	App.querySelector(".join-screen #join-user").addEventListener("click",function(){
		let username = App.querySelector(".join-screen #username").value;
		if(username.length == 0){return;}
		socket.emit("newuser",username);
		user_name = username;
		App.querySelector(".join-screen").classList.remove("active");
		App.querySelector(".chat-screen").classList.add("active");
	});

	App.querySelector(".chat-screen #send-message").addEventListener("click",function(){
		let message = App.querySelector(".chat-screen #message-input").value;
		if(message.length  == 0){return;}
		renderMessage("my",{
			username:user_name,
			text:message
		});
		socket.emit("chat",{
			username:user_name,
			text:message
		});
		App.querySelector(".chat-screen #message-input").value = "";
	});

	App.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
		socket.emit("exituser",user_name);
		window.location.href = window.location.href;
	});

    	
	socket.on("chat",function(message){
		renderMessage("other",message);
	});
	socket.on("update",function(update){
		renderMessage("update",update);
	});



	function renderMessage(type,message){
		let mssgContainer = App.querySelector(".chat-screen .messages");
        let elementMssg ; 
		if(type == "my"){
			elementMssg = document.createElement("div");
			elementMssg.setAttribute("class","message my-message");
			elementMssg.innerHTML = `
				<div>
					<div class="name">You</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			mssgContainer.appendChild(elementMssg); 

		} else if(type == "update"){
			elementMssg = document.createElement("div");
			elementMssg.setAttribute("class","update");
			elementMssg.innerText = message;
			mssgContainer.appendChild(el);
		}
        else if(type == "other"){
			elementMssg = document.createElement("div");
			elementMssg.setAttribute("class","message other-message");
			elementMssg.innerHTML = `
				<div>
					<div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			mssgContainer.appendChild(elementMssg);
        }

		mssgContainer.scrollTop = mssgContainer.scrollHeight - mssgContainer.clientHeight;
	}

})();