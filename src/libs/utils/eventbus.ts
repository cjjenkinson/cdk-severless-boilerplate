import { EventBridge } from 'aws-sdk';
import { getParameter } from './ssm';

const eventbridge = new EventBridge();

interface Event {
  Detail: string;
  DetailType: string;
  Source: string;
  Time?: Date;
  EventBusName?: string;
}

interface Props {
  events: Event[];
}

const emitEvents = async ({ events }: Props) => {
  const eventBusName = await getParameter('services/event/eventBusName');

  if (!eventBusName) throw Error('Cant find event bus name');

  const Time = new Date();

  const Entries = events.map((event) => {
    return {
      EventBusName: eventBusName,
      Time,
      ...event,
    };
  });

  console.log({ Entries });

  const eventbridgeResponse = await eventbridge
    .putEvents({
      Entries,
    })
    .promise();

  console.log({ eventbridgeResponse });

  if (eventbridgeResponse.FailedEntryCount !== 0) {
    console.error('Failed to emit event', JSON.stringify(events, null, 2));
  }

  return eventbridgeResponse;
};

export { emitEvents };
