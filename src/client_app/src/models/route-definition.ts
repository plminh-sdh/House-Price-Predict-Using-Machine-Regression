import { Crumb } from "@/models/crumb";
import { RouteObject } from "react-router";

export type RouteDefinition = RouteObject & {
  pathname?: string;
  handle?: {
    crumb?: Crumb;
    pageTitle?: string;
  };
};
