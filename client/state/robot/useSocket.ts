'use client'

import { Dispatch, RefObject, useEffect, useRef } from "react";
import { CraneAction } from "./actions";

export type Updater = (update: CraneAction) => void;

export const useSocket = (
  id: string,
  dispatch: Dispatch<CraneAction>
): Updater => {
  const ws: RefObject<WebSocket | null> = useRef(null);
  useEffect(() => {
    const serverURL = `ws://localhost:7777/v1/robot/${id}/connect`;
    ws.current = new WebSocket(serverURL);

    ws.current.onopen = () => {
      dispatch({
        type: "connect",
        payload: true,
      });
      console.log("connection established");
    };

    ws.current.onclose = () => {
      dispatch({
        type: "connect",
        payload: false,
      });
      console.log("connection lost");
    };

    ws.current.onmessage = (evt: MessageEvent) => {
      let data = JSON.parse(evt.data);
      let action = data.action as CraneAction;
      dispatch(action);
    };

    const socket = ws.current;

    return () => {
      if (socket.readyState === socket.OPEN) {
        socket.close();
      }
    };
  }, [id]);

  return (update: CraneAction) => {
    if (ws.current) {
      dispatch(update);
      const msg = JSON.stringify(update);
      ws.current.send(msg);
    }
  };
};
