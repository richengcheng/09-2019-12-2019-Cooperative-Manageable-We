import React from 'react';
import './App.css';

import Signup from './components/Signup';
import Signin from './components/Signin';
import PersonalRecipeList from './components/PersonalRecipeList';
import LatestAdded from './components/LatestAdded';
import UploadImages from './components/UploadImage';
import NutritionValue from './components/NutritionValue'
import ComposerPage from './components/ComposerPage';
import SearchUIcomponent from './components/SearchUIcomponent';
import SearchByCategory from './components/searchByCategory';
import AllRecipes from './components/AllRecipes'
import ViewRecipe from './components/viewRecipe';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";


function App() {
    return (
        <div style={{ background: '#ECECEC', padding: '30px' }}>
            <Router>
                <div>
                    <ul>
                        <li><Link to="/AllRecipes">All Recipes</Link></li>
                        <li><Link to="/Signup">Signup</Link></li>
                        <li><Link to="/Signin">Signin</Link></li>
                        <li><Link to="/personalrecipelist">Personal Recipe List</Link></li>
                        <li><Link to="/latestadded">Latest Added Recipes</Link></li>
                        <li><Link to="/SearchUIcomponent">Search recipe by title</Link></li>
                        <li><Link to="/SearchByCategory">Search recipe by Category</Link></li>
                        <li><Link to="/UploadImages">UploadImages</Link></li>
                        <li><Link to="/NutritionValue">NutritionValue</Link></li>

                        <li><Link to="/ViewRecipe">ViewRecipe</Link></li>
                        <li><Link to="/allrecipes">All Recipes</Link></li>
                        <li><Link to="/ComposerPage">ComposerPage</Link></li>
                    </ul>

                    <Switch>
                        <Route path="/Signup">
                            <Signup />
                        </Route>
                        <Route path="/Signin">
                            <Signin />
                        </Route>
                        <Route path="/personalrecipelist" component={PersonalRecipeList} />
                        <Route path="/latestadded" component={LatestAdded} />
                        <Route path="/AllRecipes" component={AllRecipes} />
                        <Route path="/ComposerPage" component={ComposerPage}/>
                        <Route path="/SearchByCategory" component={SearchByCategory}/>
                        <Route path="/UploadImages" component={UploadImages} />
                        <Route path="/NutritionValue" component={NutritionValue} />
                        <Route path="/ViewRecipe" component={ViewRecipe} />
                        <Route path="/ComposerPage" component={ComposerPage} />
                       
                       
                        <Route path="/SearchUIcomponent">
                            <SearchUIcomponent />
                        </Route>

                        <Route path="/allrecipes" component={AllRecipes} />

                    </Switch>
                </div>
            </Router>
        </div>
    );
}
export default App;