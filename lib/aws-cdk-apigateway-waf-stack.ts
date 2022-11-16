import { Construct } from "constructs";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { ApiGatewayToLambda } from "@aws-solutions-constructs/aws-apigateway-lambda";
import { WafwebaclToApiGateway } from "@aws-solutions-constructs/aws-wafwebacl-apigateway";

export class AwsCdkApigatewayWafStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const wafEnabledAPI = new apigateway.RestApi(this, "ApiWithWAFEnabled", {
      restApiName: "ApiWithWAFEnabled",
    });

    const apiGETLambda = new lambda.Function(this, "ApiGETLambda", {
      functionName: "ApiGETLambda",
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(`lib/lambda`),
    });

    wafEnabledAPI.root.addMethod(
      "GET",
      new apigateway.LambdaIntegration(apiGETLambda)
    );

    new WafwebaclToApiGateway(this, "test-wafwebacl-apigateway", {
      existingApiGatewayInterface: wafEnabledAPI,
    });

    new CfnOutput(this, "REST_API_ID", { value: wafEnabledAPI.restApiId });
    new CfnOutput(this, "REST_API_NAME", { value: wafEnabledAPI.restApiName });
    new CfnOutput(this, "REST_API_RESOURCE_ID", {
      value: wafEnabledAPI.restApiRootResourceId,
    });
    new CfnOutput(this, "REST_API_HTTP_METHODS", {
      value: wafEnabledAPI.methods.join(","),
    });
    new CfnOutput(this, "REST_API_BASE_URL", { value: wafEnabledAPI.url });
  }
}
