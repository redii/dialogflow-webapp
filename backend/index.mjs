import http from "http"
import url from "url"
import got from "got"

const df_url =
    "https://console.dialogflow.com/v1/integrations/messenger/webhook/4e508c7e-69cb-43bf-b32a-44d54f6b3431/sessions/webdemo-25036c1f-dd66-4d05-d948-45bddbcda347?platform=webdemo"

const server = http.createServer(async (req, res) => {
    try {
        res.setHeader(
            "Access-Control-Allow-Origin",
            "https://redii.github.io/dialogflow-webapp/"
        )
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
        res.setHeader("Access-Control-Allow-Credentials", true)
        res.setHeader("Content-Type", "application/json")

        var params = url.parse(req.url, true).query

        const query = {
            queryInput: {
                text: {
                    text: params.query,
                    languageCode: "de",
                },
            },
        }

        const temp = await got.post(df_url, {
            json: query,
        })

        const result = JSON.parse(temp.request.response.body.substring(5))

        res.end(JSON.stringify(result))
    } catch (err) {
        console.log(err)
    }
})

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/")
})
