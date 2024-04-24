import Navbar from '../../components/navigation/navbar';
import Sidebar from '../../components/navigation/sidebar';
import style from './layout.module.css';

export default function PageLayout({ children }) {
    return (
        <main className={style.oc_wrapper}>
            <header className= "block lg:h-[52px] h-[50px] opacity-100 transition-opacity duration-420 ease-cubic-custom ">
                <Navbar />
                <Sidebar />
            </header>

            {children}
        </main>
    )
}