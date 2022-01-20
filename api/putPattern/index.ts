import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.bindings.outputDocument = req.body;

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: context.bindings.outputDocument
    };

};

export default httpTrigger;