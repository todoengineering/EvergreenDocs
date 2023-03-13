import { StackContext } from "sst/constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { HostedZone, ARecord, RecordTarget, CnameRecord } from "aws-cdk-lib/aws-route53";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";

async function route53Stack({ stack }: StackContext) {
  const hostedZone = new HostedZone(stack, "HostedZone", {
    zoneName: "ever-green.io",
  });
  hostedZone.applyRemovalPolicy(RemovalPolicy.DESTROY);

  new ARecord(stack, "ARecord", {
    zone: hostedZone,
    target: RecordTarget.fromIpAddresses("76.76.21.21"),
  });

  new CnameRecord(stack, "CnameRecord", {
    zone: hostedZone,
    recordName: "www",
    domainName: "cname.vercel-dns.com.",
  });

  const certificate = new Certificate(stack, "Certificate", {
    domainName: "ever-green.io",
    validation: CertificateValidation.fromDns(hostedZone),
    subjectAlternativeNames: ["*.ever-green.io"],
  });
  certificate.applyRemovalPolicy(RemovalPolicy.DESTROY);
}

export default route53Stack;
