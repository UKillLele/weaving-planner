import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a post request.');
    context.bindings.patternData = req.body;

    try {
        context.res.status(200).json({ success: true});
        } catch (error) {
        context.res.status(500).json({ success: false, error: error});
    }
};

export default httpTrigger;