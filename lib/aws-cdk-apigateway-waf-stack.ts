import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { ApiGatewayToLambda } from "@aws-solutions-constructs/aws-apigateway-lambda";
import {
  WafwebaclToApiGatewayProps,
  WafwebaclToApiGateway,
} from "@aws-solutions-constructs/aws-wafwebacl-apigateway";

export class AwsCdkApigatewayWafStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const apiGatewayToLambda = new ApiGatewayToLambda(
      this,
      "ApiGatewayToLambdaPattern",
      {
        lambdaFunctionProps: {
          runtime: lambda.Runtime.NODEJS_14_X,
          handler: "index.handler",
          code: lambda.Code.fromAsset(`lambda`),
        },
      }
    );

    // This construct can only be attached to a configured API Gateway.
    new WafwebaclToApiGateway(this, "test-wafwebacl-apigateway", {
      existingApiGatewayInterface: apiGatewayToLambda.apiGateway,
    });
  }
}
