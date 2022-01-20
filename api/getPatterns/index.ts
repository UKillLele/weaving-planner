import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        context.res.status(200).json(context.bindings.patternData);
      } catch (error) {
        context.res.status(500).json(error);
    }

};

export default httpTrigger;