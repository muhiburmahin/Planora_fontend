import { EventCrudModule } from "../shared/EventCrudModule";

interface UserEventsModuleProps {
  userId: string;
}

export function UserEventsModule({ userId }: UserEventsModuleProps) {
  return <EventCrudModule title="My Events Management" query={{ organizerId: userId }} />;
}
