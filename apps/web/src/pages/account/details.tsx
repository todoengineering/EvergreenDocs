import { useContext } from "react";

import Layout from "../../components/layout";
import { UserContext } from "../../context/user";

function UserDetails() {
  const { user } = useContext(UserContext);

  return (
    <Layout>
      <h1>User Details</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  );
}

export default UserDetails;
