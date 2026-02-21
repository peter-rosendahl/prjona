import { MD3DarkTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

const PaperTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: "#0099FF",
        secondary: "#0099FF"
    }
};

export default function PaperWrapper({children}) {
    return (
        <PaperProvider theme={PaperTheme}>
            {children}
        </PaperProvider>
    )
}