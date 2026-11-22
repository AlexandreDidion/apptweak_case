import "./App.css";

import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";
import { PlaylistList } from "./features/playlist/PlaylistList";

import { selectUser } from "./features/auth/selectors";

const App: FC = (): ReactElement => {
  const user = useSelector(selectUser);

  // TODO: You can access user data and now fetch user's playlists
  console.log(user);

  return (
    <div className="App">
      <header className="App-header">
        {user && <p>Welcome, {user?.userName}</p>}
        <PlaylistList />
      </header>
    </div>
  );
};

export default App;
