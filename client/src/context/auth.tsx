import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../types";
import Axios from "axios";

interface State {
  user: User | undefined;
  loading: boolean;
  authenticated: boolean;
}

const StateContext = createContext<State>({
  user: undefined,
  loading: true,
  authenticated: false,
});

const DispatchContext = createContext<any>(null);
// for update StateContext

interface Action {
  type: string;
  payload: any;
}

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "SIGNIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "SIGNOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    loading: true,
    authenticated: false,
  });

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    async function loadUser() {
      // check user already login and has cookie and token
      try {
        const res = await Axios.get("/auth/me");
        dispatch("SIGNIN", res.data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
