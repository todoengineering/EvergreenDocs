import { StackContext } from "sst/constructs";
import { HostedZone, ARecord, RecordTarget, CnameRecord } from "aws-cdk-lib/aws-route53";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";

async function route53Stack({ stack }: StackContext) {
  if (stack.stage !== "production") {
    return;
  }

  const hostedZone = new HostedZone(stack, "HostedZone", {
    zoneName: "ever-green.io",
  });

  new ARecord(stack, "ARecord", {
    zone: hostedZone,
    target: RecordTarget.fromIpAddresses("76.76.21.21"),
  });

  new CnameRecord(stack, "CnameRecord", {
    zone: hostedZone,
    recordName: "www",
    domainName: "cname.vercel-dns.com.",
  });

  new Certificate(stack, "Certificate", {
    domainName: "ever-green.io",
    validation: CertificateValidation.fromDns(hostedZone),
    subjectAlternativeNames: ["*.ever-green.io"],
  });
}

export default route53Stack;
