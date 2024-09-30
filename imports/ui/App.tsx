import React, { Fragment, useCallback, useEffect } from 'react';
import { Meteor } from "meteor/meteor";
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { Appointment, AppointmentsCollection } from '../api/AppointmentsCollection';
import { User } from './User';
import { LoginForm } from './LoginForm';
import { AppointmentCreateOrEdit } from './AppointmentCreateOrEdit';
import { AppointmentList } from './AppointmentList';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState<string | null>(null);
  const isLoading = useSubscribe("appointments");
  const appointments: Appointment[] = useTracker(() => {
    if (!user) {
      return [];
    }
    return AppointmentsCollection.find({}, {sort: {
      date: 1
    }}).fetch();
  });
  const setAppointmentId = useCallback((id: string | null) => {
    setSelectedAppointmentId(oldState => {
      if (oldState === id) {
        return oldState;
      } else {
        return id;
      }
    });
  }, [setSelectedAppointmentId]);

  if (isLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      {user ? (
        <Fragment>
          <User />
          <div className="main-container">
            <div className="create-edit-container">
              <AppointmentCreateOrEdit appointments={appointments} appointmentId={selectedAppointmentId} setAppointmentId={setAppointmentId}/>
            </div>
            <div className="list-container">
              <AppointmentList appointments={appointments} selectedAppointmentId={selectedAppointmentId} setSelectedAppointmentId={setAppointmentId}/>
            </div>
          </div>
        </Fragment>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
