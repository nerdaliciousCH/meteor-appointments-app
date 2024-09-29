import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { AppointmentsCollection } from '/imports/api/AppointmentsCollection';
import "../imports/api/AppointmentsPublications"; 
import "../imports/api/appointmentsMethods";

const SEED_USERNAME_1 = "test1";
const SEED_PASSWORD_1 = "pw1";
const SEED_USERNAME_2 = "test2";
const SEED_PASSWORD_2 = "pw2";
const lastNames = [
  "Huang",
  "Travis",
  "Kemp",
  "Hanson",
  "Gilmore",
  "Newman",
  "Pena",
  "Howe",
  "Wolf",
  "Blake",
  "Walton",
  "Schultz",
]

const firstNames = [
  "Charles",
  "Sage",
  "Ernest",
  "Cayden",
  "Frank",
  "Sidney",
  "Atticus",
  "Corey",
  "Yahir",
  "Yair",
  "Kaleb",
  "Josue",
]

async function insertRandomAppointment(user) {
  await AppointmentsCollection.insertAsync({
    userId: user._id,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    createdAt: new Date(),
    date: new Date(),
  });
}

Meteor.startup(async () => {
  if (!await Accounts.findUserByUsername(SEED_USERNAME_1)) {
    await Accounts.createUser({
      username: SEED_USERNAME_1,
      password: SEED_PASSWORD_1,
    })
  }
  if (!await Accounts.findUserByUsername(SEED_USERNAME_2)) {
    await Accounts.createUser({
      username: SEED_USERNAME_2,
      password: SEED_PASSWORD_2,
    })
  }
  const user1 = await Accounts.findUserByUsername(SEED_USERNAME_1);
  const user2 = await Accounts.findUserByUsername(SEED_USERNAME_2);
  const appointmentsCount = await AppointmentsCollection.find().countAsync()
  if (appointmentsCount === 0) {
    const twenty = Array.from({length:20}, (value, key) => key + 1)
    twenty.map(() => insertRandomAppointment(user1));
    twenty.map(() => insertRandomAppointment(user2));
  }
});
