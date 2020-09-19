import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import MainScreen from './components/MainScreen';
import AdminScreen from './components/AdminScreen';

function App() {
	return (
		<div className="App">
			<Router>
				<div>
					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
					<Switch>
						<Route path="/admin">
							<AdminScreen />
						</Route>
						<Route path="/">
							<MainScreen />
						</Route>
					</Switch>
				</div>
			</Router>

		</div>
	);
}

export default App;
