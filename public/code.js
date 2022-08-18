(function(){

	const socket = io();
	const App = document.querySelector(".app");
	let name;


	App.querySelector(".join-screen #join-user").addEventListener("click",function(){
		let username = App.querySelector(".join-screen #username").value;
		if(username.length == 0){
			return;
		}
		socket.emit("newuser",username);
		name = username;
		App.querySelector(".join-screen").classList.remove("active");
		App.querySelector(".chat-screen").classList.add("active");
	});

	App.querySelector(".chat-screen #send-message").addEventListener("click",function(){
		let mssg = App.querySelector(".chat-screen #message-input").value;
		if(mssg.length  == 0){
			return;
		}
		renderMessage("my",{
			username:name,
			text:mssg
		});
		socket.emit("chat",{
			username:name,
			text:mssg
		});
		App.querySelector(".chat-screen #message-input").value = "";
	});

	App.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
		socket.emit("exituser",name);
		window.location.href = window.location.href;
	});

	socket.on("update",function(update){
		renderMessage("update",update);
	});
	
	socket.on("chat",function(mssg){
		renderMessage("other",mssg);
	});

	function renderMessage(type,mssg){
		let messageContainer = App.querySelector(".chat-screen .messages");
		let element;
		if(type == "my"){
		       element = document.createElement("div");
			element.setAttribute("class","message my-message");
			element.innerHTML = `
				<div>
					<div class="name">You</div>
					<div class="text">${mssg.text}</div>
				</div>
			`;
			messageContainer.appendChild(element);
		} else if(type == "other"){
			element = document.createElement("div");
			element.setAttribute("class","message other-message");
			element.innerHTML = `
				<div>
					<div class="name">${mssg.username}</div>
					<div class="text">${mssg.text}</div>
				</div>
			`;
			messageContainer.appendChild(element);
		} else if(type == "update"){
			element = document.createElement("div");
			element.setAttribute("class","update");
			element.innerText = mssg;
			messageContainer.appendChild(element);
		}
		
		messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
	}

})();