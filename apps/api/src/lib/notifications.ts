import { PinpointClient, SendMessagesCommand } from "@aws-sdk/client-pinpoint";
import { getEnv } from "./env";
import { logger } from "./logger";

type PushProvider = "apns" | "fcm";

export type PushDevice = {
  provider: PushProvider;
  pushToken: string;
};

export type PushPayload = {
  title: string;
  body: string;
};

let client: PinpointClient | undefined;

function getClient() {
  client ??= new PinpointClient({ region: getEnv().AWS_REGION });
  return client;
}

function channelType(provider: PushProvider) {
  return provider === "apns" ? "APNS" : "GCM";
}

export async function sendPushNotification(device: PushDevice, payload: PushPayload) {
  const env = getEnv();

  if (!env.PUSH_NOTIFICATIONS_ENABLED) {
    logger.info("Push notification skipped because push is disabled", {
      provider: device.provider,
      title: payload.title,
      body: payload.body
    });
    return;
  }

  if (!env.AWS_PINPOINT_APPLICATION_ID) {
    logger.warn("Push notification skipped because AWS_PINPOINT_APPLICATION_ID is missing");
    return;
  }

  const command = new SendMessagesCommand({
    ApplicationId: env.AWS_PINPOINT_APPLICATION_ID,
    MessageRequest: {
      Addresses: {
        [device.pushToken]: {
          ChannelType: channelType(device.provider)
        }
      },
      MessageConfiguration: {
        APNSMessage: {
          Action: "OPEN_APP",
          Body: payload.body,
          Title: payload.title,
          Sound: "default"
        },
        GCMMessage: {
          Body: payload.body,
          Title: payload.title
        }
      }
    }
  });

  await getClient().send(command);
}

