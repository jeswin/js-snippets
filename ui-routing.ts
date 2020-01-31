import * as React from "react";
import { ReactElement } from "react";
import { createContext, useReducer } from "react";
import { ReactNode } from "react";
import { IStore } from "../types";

let globalDispatch: React.Dispatch<Actions>;

/*
  Type of Actions
*/
export type UpdateRouteAction = {
  type: "UPDATE_ROUTE";
  url: string;
};

export type HistoryGoBackAction = {
  type: "HISTORY_GO_BACK";
  steps: number;
};

export type Actions = UpdateRouteAction | HistoryGoBackAction;

/*
  Reducer which handles UPDATE_ROUTE.
  Changes the path in state.
*/
export function reducer(state: IState, action: Actions): IState {
  switch (action.type) {
    case "UPDATE_ROUTE":
      return {
        ...state,
        url: action.url,
        urlStack: state.urlStack.concat(action.url)
      };
    case "HISTORY_GO_BACK":
      const newStack = state.urlStack.slice(0, action.steps);
      return {
        ...state,
        url: newStack.slice(-1)[0],
        urlStack: newStack
      };
    default:
      return state;
  }
}

/* Store */
export type IState = {
  url: string;
  urlStack: string[];
};

export type RoutingStore = IStore<IState, Actions>;

/* Context */
export const Context = createContext<RoutingStore>(undefined as any);

/*
  To be called when the url needs to be changed.
  You'd usually not call this directly; instead use the <Link /> component which will internally call this.
*/
export async function navigateTo(url: string) {
  window.history.pushState({}, "", url);
  updateRoute(url);
}

/*
  Fixme - this is all messed up.
*/
export async function goBack(steps = -1) {
  if (window.history.length > 1) {
    window.history.go(steps);
    historyGoBack(steps);
  }
}

export async function updateRoute(url: string) {
  globalDispatch({ type: "UPDATE_ROUTE", url });
}

export async function historyGoBack(steps: number) {
  globalDispatch({ type: "HISTORY_GO_BACK", steps });
}

/*
  Create an anchor which redirects to a url. Dispatches an UPDATE_ROUTE action which changes the current url in the state. 
*/
export type LinkProps = {
  href: string;
  children?: ReactNode;
};

export const Link: React.FC<LinkProps> = (props: LinkProps) => {
  return (
    <a onClick={createClickHandler(props.href)} href="#">
      {props.children}
    </a>
  );
};

/*
  Useful for navigating to a url when a link or a button is clicked.
  But instead of using this directly, us the <Link /> component.
*/
function createClickHandler(url: string) {
  return (ev: any) => {
    window.history.pushState({}, "", url);
    updateRoute(url);
    ev.preventDefault();
  };
}

/*
  Check if the url starts with a prefix.
*/

export type MatchResult = {
  matchedPath: string;
  params: { [key: string]: string };
  currentPath: string;
};

export function matchExactUrl(
  url: string,
  pattern: string,
  fn: (match: MatchResult) => ReactElement
): ReactElement | false {
  const result = match(url, pattern, { exact: true });
  return result === false ? false : fn(result);
}

export function matchUrl(
  url: string,
  pattern: string,
  fn: (match: MatchResult) => ReactElement
): ReactElement | false {
  const result = match(url, pattern, { exact: false });
  return result === false ? false : fn(result);
}

export type MatchOptions = {
  exact: boolean;
};

export function match(
  url: string,
  pattern: string,
  options: MatchOptions = { exact: true }
): MatchResult | false {
  const lcaseUrl = url.toLowerCase();

  const fixedUrl = ["http://", "https://"].some(prefix =>
    lcaseUrl.startsWith(prefix)
  )
    ? lcaseUrl
    : `${
        typeof window === "undefined"
          ? "http://localhost"
          : `${window.location.protocol}//${window.location.hostname}`
      }${lcaseUrl.startsWith("/") ? lcaseUrl : `/${lcaseUrl}`}`;

  const urlObject = new URL(fixedUrl);

  const pathnameParts = urlObject.pathname
    .split("/")
    .slice(1, urlObject.pathname.endsWith("/") ? -1 : undefined);

  const patternParts = pattern
    .toLowerCase()
    .split("/")
    .slice(1, pattern.endsWith("/") ? -1 : undefined);

  if (
    pathnameParts.length < patternParts.length ||
    (options.exact && pathnameParts.length !== patternParts.length)
  ) {
    return false;
  } else {
    let match: MatchResult = {
      params: {},
      matchedPath: "",
      currentPath: urlObject.pathname
    };

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathnamePart = pathnameParts[i];

      if (patternPart.startsWith(":")) {
        const paramName = patternPart.substring(1);
        match.params[paramName] = pathnamePart;
        match.matchedPath += `/${pathnamePart}`;
      } else {
        if (patternPart === pathnamePart) {
          match.matchedPath += `/${pathnamePart}`;
        } else {
          return false;
        }
      }
    }

    match.currentPath = `/${pathnameParts
      .slice(patternParts.length)
      .join("/")}`;

    return match;
  }
}

const initialState: IState = { url: "", urlStack: [] };

export function RoutingProvider(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  globalDispatch = dispatch;

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
}
