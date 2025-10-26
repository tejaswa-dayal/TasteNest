
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {store} from './redux/store/store'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
AOS.init({
    duration: 2000,
});

createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
    <App />
    </Provider>,
)
