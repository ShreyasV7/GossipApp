(function(){

	const socket = io();
	const applctn = document.querySelector(".app");
	let user;

	applctn.querySelector(".join-screen #join-user").addEventListener("click",function(){
		let username = applctn.querySelector(".join-screen #username").value;
		if(username.length == 0){
			return;
		}
		user = username;
		socket.emit("newuser",username);
		applctn.querySelector(".chat-screen").classList.add("active");
		applctn.querySelector(".join-screen").classList.remove("active");
	});

	applctn.querySelector(".chat-screen #send-message").addEventListener("click",function(){
		let message = applctn.querySelector(".chat-screen #message-input").value;
		if(message.length  == 0){
			return;
		}
		renderMessage("my",{
			username:user,
			text:message
		});
		socket.emit("chat",{
			username:user,
			text:message
		});
		applctn.querySelector(".chat-screen #message-input").value = "";
	});

	applctn.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
		socket.emit("exituser",user);
		window.location.href = window.location.href;
	});

	socket.on("update",function(update){
		renderMessage("update",update);
	});
	
	socket.on("chat",function(message){
		renderMessage("other",message);
	});

	function renderMessage(type,message){
		let messageContainer = applctn.querySelector(".chat-screen .messages");
		let content ; 
		if(type == "my"){
			content = document.createElement("div");
			content.setAttribute("class","message my-message");
			content.innerHTML = `
				<div>
					<div class="name">You</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(content);
		} else if(type == "other"){
			content = document.createElement("div");
			content.setAttribute("class","message other-message");
			content.innerHTML = `
				<div>
					<div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(content);
		} else if(type == "update"){
			content = document.createElement("div");
			content.setAttribute("class","update");
			content.innerText = message;
			messageContainer.appendChild(content);
		}
		
		messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
	}

})();
