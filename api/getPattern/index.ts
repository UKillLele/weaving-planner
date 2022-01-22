import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        let pattern = {
          ...context.bindings.patternData,
          _attachments: null,
          _etag: null,
          _rid: null,
          _self: null,
          _ts: null
        };
        context.res.status(200).json({ success: true, data: pattern});
      } catch (error) {
        context.res.status(500).json({ success: false, error: error});
    }

};

export default httpTrigger;