export type BillLineItem = { label: string; cost: string };
export type BillScenario = {
  id: string;
  title: string;
  items: BillLineItem[];
  wastefulIndex: number;
  explanation: string;
};

export const billScenarios: BillScenario[] = [
  {
    id: "b1",
    title: "Dev Account — Monthly Bill",
    items: [
      { label: "EC2 — t3.micro (dev-api)", cost: "$8.40" },
      { label: "EBS gp3 volume — 500GB, unattached", cost: "$40.00" },
      { label: "S3 Standard — 2GB storage", cost: "$0.05" },
      { label: "CloudWatch Logs — 1GB ingested", cost: "$0.50" },
    ],
    wastefulIndex: 1,
    explanation: "A 500GB EBS volume that isn't attached to any instance is pure waste — it's still billed even though nothing is using it. Unattached volumes should be snapshotted and deleted.",
  },
  {
    id: "b2",
    title: "Staging Account — Monthly Bill",
    items: [
      { label: "NAT Gateway — running 24/7", cost: "$32.40" },
      { label: "Lambda — 50k invocations", cost: "$0.10" },
      { label: "RDS db.t3.micro — staging DB", cost: "$12.00" },
      { label: "Route 53 hosted zone", cost: "$0.50" },
    ],
    wastefulIndex: 0,
    explanation: "A NAT Gateway left running 24/7 in a staging environment that's only used during business hours is a common source of waste — it should be scheduled to shut down outside working hours or replaced with a NAT instance for non-prod.",
  },
  {
    id: "b3",
    title: "Production Account — Monthly Bill",
    items: [
      { label: "EC2 — 3x r5.4xlarge, ~8% avg CPU", cost: "$1,440.00" },
      { label: "S3 Standard — 200GB", cost: "$4.60" },
      { label: "CloudFront — 500GB transferred", cost: "$42.50" },
      { label: "ELB — 1 load balancer", cost: "$18.00" },
    ],
    wastefulIndex: 0,
    explanation: "Three r5.4xlarge instances (16 vCPU / 128GB RAM each) running at ~8% average CPU are massively oversized. Rightsizing to something like r5.xlarge or using auto scaling would cut this cost dramatically.",
  },
  {
    id: "b4",
    title: "Data Team Account — Monthly Bill",
    items: [
      { label: "S3 Standard — 50TB, accessed once at upload", cost: "$1,150.00" },
      { label: "Redshift — 1 node, active queries daily", cost: "$180.00" },
      { label: "Glue — 20 ETL jobs/day", cost: "$25.00" },
      { label: "Athena — ad hoc queries", cost: "$8.00" },
    ],
    wastefulIndex: 0,
    explanation: "50TB of data that's written once and never accessed again belongs in S3 Glacier or Glacier Deep Archive, not S3 Standard — this alone could cut that line item by over 80%.",
  },
  {
    id: "b5",
    title: "Shared Services Account — Monthly Bill",
    items: [
      { label: "CloudTrail — multi-region logging", cost: "$8.00" },
      { label: "Elastic IP — allocated, not attached to any instance", cost: "$3.65" },
      { label: "VPC — data transfer", cost: "$15.00" },
      { label: "IAM — no cost", cost: "$0.00" },
    ],
    wastefulIndex: 1,
    explanation: "AWS charges for Elastic IPs that are allocated but not attached to a running instance. It's a small amount here, but at scale, orphaned Elastic IPs add up fast and are easy to clean up.",
  },
];
