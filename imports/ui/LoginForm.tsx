import { Meteor } from "meteor/meteor";
import React, { FormEvent, useState } from "react";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password);
  };

  return (
    <form onSubmit={submit} className="login-form">
      <div>
        <input
          className="input-base"
          type="text"
          placeholder="Username"
          name="username"
          required
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          className="input-base"
          type="password"
          placeholder="Password"
          name="password"
          required
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <button className="btn-base btn-primary" type="submit">Log In</button>
      </div>
    </form>
  );
};