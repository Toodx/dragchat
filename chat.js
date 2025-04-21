const TOKEN = "";

const css = `
		#chatContainer {
			font-size: 10px;
			line-height: 1.2;
			position: fixed;
			bottom: 100px;
			right: 100px;
			width: fit-content;
			height: fit-content;
			background: rgba(0, 0, 0, 0.03);
			color: rgba(27, 27, 27, 0.349);
			border-radius: 8px;
			z-index: 9999;
			display: flex;
			flex-direction: column;
			overflow: hidden;

			#chatHeader {
				height: 20px;
				cursor: move;
				user-select: none;
				padding-right: 5px;
				display: flex;
				align-items: center;
				justify-content: right;
				background: rgba(0, 0, 0, 0.04);

				#chatSend {
					background: rgba(0, 0, 0, 0.06);
					border: none;
					width: 10px;
					height: 10px;
					cursor: pointer;
					padding: 0;
					border-radius: 50%;
				}
			}

			#chatTextarea {
				width: 100%;
				height: 100%;
				border: none;
				resize: both;
				padding: 5px;
				box-sizing: border-box;
				background: transparent;
				color: rgba(0, 0, 0, 0.6);

				&:focus {
					outline: none;
				}
			}
		}
`;
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);


const js = `
		// Create chat container
		const chatContainer = document.createElement("div");
		chatContainer.id = "chatContainer";

		// Create chat header
		const chatHeader = document.createElement("div");
		chatHeader.id = "chatHeader";

		// Create send button
		const chatSend = document.createElement("button");
		chatSend.id = "chatSend";
		chatHeader.appendChild(chatSend);

		// Create textarea
		const chatTextarea = document.createElement("textarea");
		chatTextarea.id = "chatTextarea";
		chatTextarea.placeholder = "Ask...";

		// Append header and textarea to container
		chatContainer.appendChild(chatHeader);
		chatContainer.appendChild(chatTextarea);

		// Append chat container to body
		document.body.appendChild(chatContainer);

		// Make the chat draggable
		let offsetX = 0, offsetY = 0, isDown = false;

		chatHeader.addEventListener('mousedown', (e) => {
			isDown = true;
			offsetX = chatContainer.offsetLeft - e.clientX;
			offsetY = chatContainer.offsetTop - e.clientY;
		});

		document.addEventListener('mouseup', () => isDown = false);
		document.addEventListener('mousemove', (e) => {
			if (isDown) {
				chatContainer.style.left = (e.clientX + offsetX) + 'px';
				chatContainer.style.top = (e.clientY + offsetY) + 'px';
			}
		});

		// Chat functionality
		chatTextarea.value = ">> ";

		chatTextarea.addEventListener("keydown", (e) => {
			// Prevent deleting the initial ">> "
			if (chatTextarea.selectionStart <= 3 && (e.key === "Backspace" || e.key === "Delete")) {
				e.preventDefault();
			}
		});

		chatSend.addEventListener("click", async () => {
			const lastPromptIndex = chatTextarea.value.lastIndexOf(">> ") + 3;
			const userMessage = chatTextarea.value.slice(lastPromptIndex).trim();
			if (userMessage !== "") {
				chatTextarea.value += "\\nThinking...\\n";

				try {
					const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer ${TOKEN}",
						},
						body: JSON.stringify({
							model: "deepseek/deepseek-chat-v3-0324:free",
							messages: [
								{
									role: "user",
									content: userMessage,
								},
							],
						}),
					});
					const data = await response.json();
					const aiResponse = data.choices[0].message.content;
					chatTextarea.value += aiResponse + "\\n>> ";
				} catch (error) {
					chatTextarea.value += "Error: Unable to fetch response.\\n>> ";
				}
			}
		});
`;
const chatScript = document.createElement('script');
chatScript.textContent = js;
document.body.appendChild(chatScript);
