import got from "got"

// prettier-ignore
const dialogflow_urls = {
	max: "https://console.dialogflow.com/v1/integrations/messenger/webhook/63b5bb72-c19b-42d7-9241-9e2b255a1cd1/sessions/webdemo-577f1cfe-38b8-5da5-82ea-b0cc08a9b8d5?platform=webdemo",
	maxo: "https://console.dialogflow.com/v1/integrations/messenger/webhook/e0e79cf0-4e10-43de-b994-8049e8df3a12/sessions/webdemo-f0b12bbb-f0ab-89d6-7fd7-b0525d116e16?platform=webdemo",
	lena: "https://console.dialogflow.com/v1/integrations/messenger/webhook/56d38b7d-9812-4d83-91ac-bc14c60f0f14/sessions/webdemo-dd8626f6-8501-8edc-faa6-5ef41c131bf6?platform=webdemo",
	lena_inkl: "https://console.dialogflow.com/v1/integrations/messenger/webhook/d7ff5857-bf4c-4d61-a4cc-e12377ea5ccf/sessions/webdemo-3dcbbc01-0c77-01c4-788c-e54aa816c58a?platform=webdemo",
	ben: "https://console.dialogflow.com/v1/integrations/messenger/webhook/625a4345-b2aa-4b64-a6fe-5b2187ad65fc/sessions/webdemo-e52841f3-8f16-2b65-5f03-738fef578aa3?platform=webdemo",
    ben_inkl: "https://console.dialogflow.com/v1/integrations/messenger/webhook/34bf5e85-243a-461c-9b5c-3e7bb870c9d5/sessions/webdemo-869f437e-54d7-7c54-cae0-167656c34f9c?platform=webdemo",
}

export async function GET({ url }) {
	const query = url.searchParams.get("query")
	const bot = url.searchParams.get("bot")

	const dialogflow_url = dialogflow_urls[bot]
	const temp = await got.post(dialogflow_url, {
		json: {
			queryInput: {
				text: {
					text: query,
					languageCode: "de",
				},
			},
		},
	})
	const result = JSON.parse(temp.request.response.body.substring(5))

	return new Response(JSON.stringify(result))
}
