import { createContext } from 'react';



export const LoggedContext = createContext(async () => {
    const response = await fetch("/api/users/checkSession");
    return await response.json();
});
