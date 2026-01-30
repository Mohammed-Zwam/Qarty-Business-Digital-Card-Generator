import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Footer = () => {
    const { user } = useContext(UserContext);
    let year = new Date().getFullYear();
    return (
        <footer className="footer py-2 d-flex align-items-center justify-content-center">
            <p className="txt3 fs-4 m-0">
                &copy; {year} <Link to={user !== null ? "/profile" : "/"} className='txt4 fw-bold'>Qarty</Link> - Developed by <a href="https://www.linkedin.com/in/mohammed-ashraf-2992512a7/" target="_blank" className='txt4 fw-bold'>Mohammed Ashraf</a>.
            </p>
        </footer>
    );
}

export default Footer;