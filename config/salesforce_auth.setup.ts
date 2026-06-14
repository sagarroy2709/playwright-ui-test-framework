import { test as setup, APIRequestContext } from "@playwright/test";
import { ENV } from "../config/env.config";
import * as fs from "fs";


async function getSalesforceSessionId(
    request: APIRequestContext
): Promise<{ sessionId: string; instanceUrl: string }> {
    const combinedPassword = ENV.SALESFORCE.USER.password + ENV.SALESFORCE.USER.token;

    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <soapenv:Body>
            <login xmlns="urn:partner.soap.sforce.com">
                <username>${ENV.SALESFORCE.USER.username}</username>
                <password>${combinedPassword}</password>
            </login>
        </soapenv:Body>
    </soapenv:Envelope>`;

    const response = await request.post(`${ENV.SALESFORCE.BASE_URL}/services/Soap/u/56.0`, {
        headers: { "Content-Type": "text/xml", SOAPAction: '""' },
        data: soapBody,
    });

    const text = await response.text();

    const sessionIdMatch = text.match(/<sessionId>([^<]+)<\/sessionId>/);
    const serverUrlMatch = text.match(/<serverUrl>([^<]+)<\/serverUrl>/);

    //     // Playwright has no built-in XML parser. response.json() only works for JSON responses. SOAP returns XML, so you're stuck with either:
    //     // Regex — current approach, fine for extracting a single known field
    //     // XML parser library — like fast-xml-parser (yarn add fast-xml-parser), gives you a proper object to traverse

    //     // typescriptimport { XMLParser } from 'fast-xml-parser';

    //     // const textData = await response.text();
    //     // const parser = new XMLParser();
    //     // const parsed = parser.parse(textData);
    //     // const sessionId = parsed['soapenv:Envelope']['soapenv:Body']
    //     //                         ['loginResponse']['result']['sessionId'];


    if (!sessionIdMatch || !serverUrlMatch) {
        throw new Error("Salesforce SOAP login failed. Check credentials or security token.");
    }

    const instanceUrl = new URL(serverUrlMatch[1]).origin; // e.g. https://yourorg.my.salesforce.com

    return { sessionId: sessionIdMatch[1], instanceUrl };
}

setup("authenticate salesforce", async ({ request }) => {
    fs.mkdirSync(".auth", { recursive: true });

    console.log(`\n→ Authenticating Salesforce: ${ENV.SALESFORCE.USER.username}`);
    const { sessionId, instanceUrl } = await getSalesforceSessionId(request);

    fs.writeFileSync(
        ENV.SALESFORCE.USER.authFile,
        JSON.stringify({ sessionId, instanceUrl })
    );

    console.log(`✅ Done: Salesforce`);
});