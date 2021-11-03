/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import Loading from './loading';
const Profile = () => {

  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h3>User name: {user.name}</h3>
      <p>Email: {user.email}</p>
      <p>ID token content:</p>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
