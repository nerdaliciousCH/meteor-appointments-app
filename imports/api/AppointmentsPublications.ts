import { Meteor } from "meteor/meteor";
import { AppointmentsCollection } from "./AppointmentsCollection";

Meteor.publish("appointments", function() {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }
  return AppointmentsCollection.find({ userId });
});
