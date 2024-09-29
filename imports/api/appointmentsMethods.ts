import { Meteor } from "meteor/meteor";
import { Appointment, AppointmentsCollection } from '/imports/api/AppointmentsCollection';
import { Mongo } from "meteor/mongo";

Meteor.methods({
  "appointments.create": async (doc: Mongo.OptionalId<Appointment>) => {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("not-authorized", "You are not logged in");
    }

    // Otherwise Meteor would just create a document with the given _id
    if (doc?._id !== undefined) {
      throw new Meteor.Error("invalid-argument", "You cannot specify an _id when creating a new appointment");
    }

    return AppointmentsCollection.insertAsync({
      ...doc,
      userId,
    });
  },
  "appointments.update": async ({ _id, doc }: {
    _id: string;
    doc: Mongo.OptionalId<Appointment>;
  }) => {
    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error("not-authorized", "You are not logged in");
    }

    // Otherwise Meteor would crash
    if (doc?._id !== undefined) {
      throw new Meteor.Error("invalid-argument", "You cannot specify an _id when creating a new appointment");
    }

    const appointment = await AppointmentsCollection.findOneAsync({ _id });
    if (userId !== appointment?.userId) {
      throw new Meteor.Error("not-authorized", "You are not authorized to update this appointment");
    }
  
    return AppointmentsCollection.updateAsync(
      { _id },
      {
        $set: doc,
      }
    );
  },
  "appointments.delete": async ({ _id }) => {
    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error("not-authorized", "You are not logged in");
    }

    const appointment = await AppointmentsCollection.findOneAsync({ _id });
    if (userId !== appointment?.userId) {
      throw new Meteor.Error("not-authorized", "You are not authorized to delete this appointment");
    }

    return AppointmentsCollection.removeAsync(_id);
  },
});
