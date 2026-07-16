export type IncidentStep = { id: string; label: string };
export type IncidentScenario = {
  name: string;
  timeLimit: number;
  steps: IncidentStep[];
};

export const incidentScenarios: IncidentScenario[] = [
  {
    name: "API Latency Spike",
    timeLimit: 40,
    steps: [
      { id: "s1", label: "Check monitoring dashboards" },
      { id: "s2", label: "Identify the affected service" },
      { id: "s3", label: "Check recent deploys/changes" },
      { id: "s4", label: "Mitigate (rollback or scale up)" },
      { id: "s5", label: "Communicate status to stakeholders" },
    ],
  },
  {
    name: "Production Outage",
    timeLimit: 55,
    steps: [
      { id: "o1", label: "Acknowledge the alert" },
      { id: "o2", label: "Declare an incident and assign a commander" },
      { id: "o3", label: "Assess blast radius and impact" },
      { id: "o4", label: "Identify root cause candidates" },
      { id: "o5", label: "Apply mitigation (rollback/failover)" },
      { id: "o6", label: "Verify recovery" },
      { id: "o7", label: "Write and share the postmortem" },
    ],
  },
  {
    name: "Database Connection Exhaustion",
    timeLimit: 45,
    steps: [
      { id: "d1", label: "Check connection pool metrics" },
      { id: "d2", label: "Identify which service is leaking connections" },
      { id: "d3", label: "Kill or restart the offending service" },
      { id: "d4", label: "Increase pool limits or add read replicas" },
      { id: "d5", label: "Add alerting for connection pool saturation" },
    ],
  },
];
