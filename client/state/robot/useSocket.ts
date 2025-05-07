'use client'

import { Dispatch, RefObject, useEffect, useRef } from "react";
import { CraneAction } from "./actions";

export type Updater = (update: CraneAction) => void;

export const useSocket = (
  id: string,
  dispatch: Dispatch<CraneAction>
): Updater => {
  const ws: RefObject<WebSocket | null> = useRef(null);
  const retryCount = useRef(0);
  const maxRetries = 5;
  const retryTimeout = useRef<NodeJS.Timeout>(null);

  const connect = () => {
    const serverURL = `ws://localhost:7777/v1/robot/${id}/connect`;
    ws.current = new WebSocket(serverURL);

    ws.current.onopen = () => {
      retryCount.current = 0;
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

      if (retryCount.current < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${retryCount.current + 1}/${maxRetries})`);
        
        retryTimeout.current = setTimeout(() => {
          retryCount.current += 1;
          connect();
        }, delay);
      } else {
        console.log("Max reconnection attempts reached");
      }
    };

    ws.current.onmessage = (evt: MessageEvent) => {
      let data = JSON.parse(evt.data);
      let action = data.action as CraneAction;
      dispatch(action);
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [id]);

  return (update: CraneAction) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify(update);
      ws.current.send(msg);
    }
  };
};
