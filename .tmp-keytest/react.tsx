import {createRoot} from 'react-dom/client';
function App(){return <><label htmlFor="x">Test</label><input id="x" /></>};
const root=document.querySelector('#root'); if(root) createRoot(root).render(<App/>);
