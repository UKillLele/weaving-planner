import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a get all request.');

    try {
        context.res.status(200).json({ 
          success: true, 
          data: context.bindings.patternData
            .sort((a: any, b: any) => {
              a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 
            })
        });
      } catch (error) {
        context.res.status(500).json({ success: false, error: error});
    }

};

export default httpTrigger;