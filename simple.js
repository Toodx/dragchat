function q(text, TOKEN="sdfsdfsdf") {
	fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + TOKEN,
		},
		body: JSON.stringify({
			model: "deepseek/deepseek-chat-v3-0324:free",
			messages: [
				{
					role: "user",
					content: text,
				},
			],
		}),
	})
		.then((response) => response.json())
		.then((data) => console.log(data.choices[0].message.content));
}

q("Привет")
