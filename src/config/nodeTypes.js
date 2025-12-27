import GenericNode from "../components/nodes/GenericNode";
import ServiceNode from "../components/nodes/ServiceNode";
import DatabaseNode from "../components/nodes/DatabaseNode";
import ClientNode from "../components/nodes/ClientNode";
import DecisionNode from "../components/nodes/DecisionNode";

export const nodeTypes = {
  generic: GenericNode,
  service: ServiceNode,
  database: DatabaseNode,
  client: ClientNode,
  decision: DecisionNode,
};
