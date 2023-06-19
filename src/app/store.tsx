import { useState, createContext } from 'react'
import { conversations } from '../chats';

export const DataContext = createContext<any>(null);

const DataContextProvider = (props : any) => {

    const [data, setData] = useState<any>(null);
  const [chats, updateChats] = useState(conversations);


    console.log({globalChats:chats});
    
    return (
        <DataContext.Provider value={{
            data, setData,
            chats, updateChats
        }}>
            {props.children}
        </DataContext.Provider>
    );
}

export default DataContextProvider;