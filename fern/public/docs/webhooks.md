Webhooks allow you to build custom workflows in response to events on the DevRev platform. A webhook can be thought of as a 'reverse API' that is driven by events rather than requests. While APIs are used to pull data from the system, webhooks are a mechanism for the system to push data to a pre-configured endpoint. Webhooks allow you to receive notifications based on events without having to explicitly make a request.

## Webhook Workflow[​](#webhook-workflow "Direct link to Webhook Workflow")

You must first set up an HTTP server that listens on a publicly accessible endpoint. When ready, you must register the endpoint’s URL with DevRev by creating a webhook object that is associated with your Dev org. After successful registration and verification of the endpoint, DevRev will issue HTTP requests (i.e. invoke the endpoint) for all events that match the event type(s) that the webhook is registered for. Your HTTP server will receive an event’s information, verify it using the event’s provided metadata, and return a response indicating successful reception. The types of events that can be received via webhooks are object mutation events (create, update, delete). Events will be delivered concurrently in a semi-ordered (but not guaranteed) manner, where object timestamps and versions will enable you to determine the order of events for a particular object.

## Webhook Event Handling[​](#webhook-event-handling "Direct link to Webhook Event Handling")

[API Reference: Webhook Event](https://devrev.docs.buildwithfern.com/api-reference/webhooks/create)

All events will be delivered to the same registered endpoint, and there is a single request schema to encompass all events that contains the following fields:

    webhook_id: Identifies the webhook that the event is being delivered for.timestamp: The timestamp for the event.type: The event type. This will always be followed by a field of the type’s name that contains the event’s data.

Event POST from DevRev to your endpoint

### Event POST `[json]`[​](#event-post-json "Direct link to event-post-json")

    POST your-webhook-endpoint-urlX-DevRev-Signature: z1BY0e8JYzEGfxZ8e4k8agCdWQyTr2An{    "id": "don:integration:dvrv-us-1:devo/1H79gci4u/webhook/123:event/abcdef",    "webhook_id": "don:integration:dvrv-us-1:devo/1H79gci4u/webhook/123",    "timestamp": "2022-08-01T12:00:00.123456789Z",    "type": "work_created",    "work_created": {...}}

Supported events will include the standard create/update/delete operations. When providing objects in webhook payloads, the schema for the objects will be the same as those from the OpenAPI specification, which will enable easy interoperability between REST and Webhook events APIs. Multiple events may be invoked concurrently for the same webhook endpoint.

> Note: It is strongly recommended that the webhook endpoint respond immediately to webhook invocations such that any non-trivial processing is done asynchronously. If a response isn’t returned within 3 seconds, the invocation will be aborted and retried at a later time.

## Steps to set up and receive webhooks[​](#steps-to-set-up-and-receive-webhooks "Direct link to Steps to set up and receive webhooks")

Let us use an example to walk through how webhooks can be set up. You are building a work distribution system, and would like to be notified anytime a new work item is created or deleted on DevRev.

You can start receiving event notifications using the following steps:

1.  Set up a secure HTTP server and expose a publicly accessible endpoint, which serves as the webhook invocation target. Insert your endpoint where the following is mentioned: your-webhook-endpoint-url
2.  Identify the events you want to monitor and the event payloads to parse. Please look up the supported events and event payloads in our API Methods section. A general guideline here is to only subscribe to event types which you require in order to avoid overwhelming your HTTP server. In the above example, we may be interested in work_created and work_deleted
3.  Register webhook endpoint

    Before webhook events can be processed, you must inform DevRev of the URL where the events should be delivered, along with the specific event type(s) that you are interested in. As a result of this registration, DevRev will pass back a secret that will subsequently be used to verify requests. This secret will never be provided when invoking a webhook, only when you call into DevRev (using TLS), however the webhook request will contain a derivative of the secret that you will use to verify DevRev as the originator.

    [API Reference: Create Webhook](https://devrev.ai/docs/apis/methods#/operations/webhooks-create)

    You will invoke DevRev webhook create with the following fields for our example:

### Webhook Create Request `[bash]`[​](#webhook-create-request-bash "Direct link to webhook-create-request-bash")

```bash
curl  --request POST 'https://api.devrev.ai/webhooks.create'
        --header "Authorization:token"
        --header 'Content-Type: application/json'
        --data-raw '{
        "event_types": ["work_created", "work_deleted"],
        "url": "your-webhook-endpoint-url"
    }'
```

The following response will be sent by DevRev

### Webhook Create Response

`````json
{
    "webhook": {
        "id": "don:integration:dvrv-us-1:devo/123:webhook/234",
        "event_types": ["work_created", "work_deleted"],
        "url": "your-webhook-endpoint-url",
        "secret": "<secret-string>",
        "status": "unverified"
    },
}
```

After creation, DevRev will issue a verify request to verify the endpoint is reachable and was intentionally created by the owner (i.e. not a malicious client using a URL that they don’t own). To perform a successful verification, your endpoint must echo the provided challenge within 3 mins of the Create Request:

### Verify Request

```bash
curl --request POST "your-webhook-endpoint-url"
    --header "X-DevRev-Signature: GfxZ8e4k8agCdWQyTr2z1BY0e8JYzEAn"
    --data-raw '{
        "id": "don:integration:dvrv-us-1:devo/1H79gci4u:webhook/123:event/abcdef",
        "webhook_id": "don:integration:dvrv-us-1:devo/1H79gci4u:webhook/123",
        "timestamp": "2022-08-01T12:00:00.123456789Z",
        "type": "verify",
        "verify": {
            "challenge": "DlrVaK7zRyZWwbJhj5dZHDlrVaK7Jhj5dZZjH"
        }
    }'
```

The following response is expected from your endpoint

### Echo Challenge

````json
{
    "challenge": "DlrVaK7zRyZWwbJhj5dZHDlrVaK7Jhj5dZZjH"
}
```

You are all set! Once verified, the status of the webhook will be updated to be active and DevRev will begin delivering the subscribed events to the webhook endpoint. The APIs for standard CRUDL behavior for webhooks can be found in the API methods section.

## Webhook Failure Handling

To mitigate intermittent and/or transient failures, DevRev will retry unacknowledged webhooks invocations. By default, three attempts will be made: the first immediately, the second after a 30-second delay, and the third after a three-minute delay. If sustained failures are encountered, the webhook service will mark the webhook endpoint to be in a degraded state and it’ll fail any queued events without invocation attempts. When in this state, verify requests will be restarted to determine when the endpoint becomes healthy again and eventually promoted back to the active state.

## Webhook Security

A header signature `X-DevRev-Signature` will always be provided, and is a hash-based message authentication code (HMAC) utilizing SHA256 consisting of the secret as the key and the raw request payload as the message. Any adversary that intercepts and modifies the request will be unable to reproduce the proper signature, and therefore should be discarded by the webhook endpoint. Note that this method is still subject to replay attacks, such that an adversary could intercept the request and replay it at different points in time, however the timestamp should be used to validate the proximity of the request and be discarded if stale.

> Note: The webhook endpoint must handle duplicate deliveries of the same event.
`````
