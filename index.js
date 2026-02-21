/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PaperWrapper from './plugins/Paper';

export default function Main() {
    return (
        <PaperWrapper>
            <App />
        </PaperWrapper>
    )
}

AppRegistry.registerComponent(appName, () => Main);
