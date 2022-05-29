import http from "http"
import url from "url"
import got from "got"

// prettier-ignore
const df_urls = {
    dev: "https://console.dialogflow.com/v1/integrations/messenger/webhook/4e508c7e-69cb-43bf-b32a-44d54f6b3431/sessions/webdemo-25036c1f-dd66-4d05-d948-45bddbcda347?platform=webdemo",
    default: "https://console.dialogflow.com/v1/integrations/messenger/webhook/18dc7865-baf4-4d1b-9dc4-2980d30bf725/sessions/webdemo-439eaa42-c853-07d8-b10c-2e5edb39eb41?platform=webdemo",
    inclusive: "https://console.dialogflow.com/v1/integrations/messenger/webhook/15ac00e6-6b68-44a9-8a2c-5c9bec6cae6c/sessions/webdemo-a872f2f4-e571-ebef-fdce-b1a261dec04a?platform=webdemo"
}

const server = http.createServer(async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "https://redii.github.io")
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
        res.setHeader("Access-Control-Allow-Credentials", true)
        res.setHeader("Content-Type", "application/json")
        var params = url.parse(req.url, true).query

        const df_url = df_urls[params.bot]
        const query = {
            queryInput: {
                text: {
                    text: params.query,
                    languageCode: "de",
                },
            },
        }

        const temp = await got.post(df_url, { json: query })
        const result = JSON.parse(temp.request.response.body.substring(5))

        res.end(JSON.stringify(result))
    } catch (err) {
        console.log(err)
    }
})

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/")
})
