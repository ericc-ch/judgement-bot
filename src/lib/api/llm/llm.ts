import { fetchEventSource } from "@fortaine/fetch-event-source";
import { merge, throttle } from "lodash";
import { TOKEN } from "~/lib/token";
import { EventDataGeneration, LLMGenerationOptions } from "./types";

const defaultOptions: LLMGenerationOptions = {
  temperature: 0.7,
  max_tokens: 256,
  stream: true,
  stop: ["@", "#", "###"],
  repitition_penalty: 1.2,
  messages: [],
};

interface Options {
  onMessage?: (message: string) => void;
  onClose?: () => void;
}

export const generate = (
  options: Partial<LLMGenerationOptions> & Options = defaultOptions
) => {
  const { onClose, onMessage, ...mergedOptions } = options;
  merge(mergedOptions, defaultOptions);

  const body = JSON.stringify(mergedOptions);

  return new Promise<string>((resolve, reject) => {
    const debouncedOnMessage = throttle(onMessage ? onMessage : () => {}, 500);
    let finalMessage = "";

    fetchEventSource("https://jaintorllm.janitorai.com/generate", {
      headers: {
        accept: "text/event-stream",
        "accept-language": "en",
        authorization: TOKEN,
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "x-request-id": "3dbe26a6-b648-454d-bfc7-395efd4426a9",
      },
      referrerPolicy: "same-origin",
      body,
      method: "POST",
      mode: "cors",
      credentials: "include",
      onmessage: (event) => {
        if (event.data === "[DONE]") resolve(finalMessage);
        const eventSource = JSON.parse(event.data) as EventDataGeneration;

        const messageStream = eventSource.choices[0].delta.content;

        if (messageStream) {
          finalMessage += messageStream;
          debouncedOnMessage(finalMessage);
        }
      },
      onerror: (e) => {
        reject(e);
      },
      onclose: onClose,
    });
  });
};
