import Navbar from './navbar';
import Sidebar from './sidebar';

export default function Navigation() {
    return (
        <>
            <header className="block lg:h-[52px] h-[50px] opacity-100 transition-opacity duration-420 ease-cubic-custom ">
                <Navbar />
                <Sidebar />
            </header>
        </>
    )
}